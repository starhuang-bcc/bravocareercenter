import mysql from "mysql2/promise";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { emptyPlatform, type Platform } from "../../shared/enterprise";
let pool: mysql.Pool | undefined;
let ready: Promise<void> | undefined;
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function verifyPassword(password: string, hash: string) {
  const [salt, h] = hash.split(":");
  if (!salt || !h || h.length !== 128) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(h, "hex"));
}
async function db() {
  if (!process.env.DATABASE_URL) throw Error("企業平台尚未設定資料庫");
  pool ??= mysql.createPool(process.env.DATABASE_URL);
  ready ??= (async () => {
    await pool!.query(
      "CREATE TABLE IF NOT EXISTS bravo_enterprise_state (id INT PRIMARY KEY, payload LONGTEXT NOT NULL) ENGINE=InnoDB"
    );
    await pool!.query(
      "CREATE TABLE IF NOT EXISTS bravo_enterprise_sessions (token CHAR(64) PRIMARY KEY, account_id VARCHAR(64) NOT NULL, expires BIGINT NOT NULL) ENGINE=InnoDB"
    );
    await pool!.query(
      "INSERT IGNORE INTO bravo_enterprise_state (id,payload) VALUES (1,?)",
      [JSON.stringify(emptyPlatform())]
    );
  })();
  await ready;
  return pool;
}
export async function readState(): Promise<Platform> {
  const p = await db();
  const [r] = await p.query<mysql.RowDataPacket[]>(
    "SELECT payload FROM bravo_enterprise_state WHERE id=1"
  );
  return JSON.parse(r[0].payload);
}
export async function changeState<T>(
  fn: (s: Platform) => T | Promise<T>
): Promise<T> {
  const p = await db();
  const c = await p.getConnection();
  try {
    await c.beginTransaction();
    const [r] = await c.query<mysql.RowDataPacket[]>(
      "SELECT payload FROM bravo_enterprise_state WHERE id=1 FOR UPDATE"
    );
    const s: Platform = JSON.parse(r[0].payload);
    const result = await fn(s);
    await c.execute("UPDATE bravo_enterprise_state SET payload=? WHERE id=1", [
      JSON.stringify(s),
    ]);
    await c.commit();
    return result;
  } catch (e) {
    await c.rollback();
    throw e;
  } finally {
    c.release();
  }
}
export async function saveSession(token: string, id: string) {
  const p = await db();
  await p.execute("DELETE FROM bravo_enterprise_sessions WHERE expires < ?", [
    Date.now(),
  ]);
  await p.execute("INSERT INTO bravo_enterprise_sessions VALUES (?,?,?)", [
    token,
    id,
    Date.now() + 8 * 3600000,
  ]);
}
export async function sessionAccount(token: string) {
  const p = await db();
  const [r] = await p.execute<mysql.RowDataPacket[]>(
    "SELECT account_id FROM bravo_enterprise_sessions WHERE token=? AND expires>?",
    [token, Date.now()]
  );
  return r[0]?.account_id as string | undefined;
}
export async function deleteSession(token: string) {
  const p = await db();
  await p.execute("DELETE FROM bravo_enterprise_sessions WHERE token=?", [
    token,
  ]);
}
export async function bootstrap() {
  const email = process.env.ENTERPRISE_ADMIN_EMAIL?.toLowerCase(),
    password = process.env.ENTERPRISE_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) return;
  await changeState(s => {
    if (!s.accounts.some(a => a.email === email))
      s.accounts.push({
        id: randomBytes(16).toString("hex"),
        email,
        name: "BRAVO 管理員",
        role: "admin",
        passwordHash: hashPassword(password),
        active: true,
      });
  });
}
