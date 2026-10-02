import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Building2,
  Users,
  CalendarDays,
  Wallet,
  BriefcaseBusiness,
  LogOut,
  Clock,
  ArrowLeft,
} from "lucide-react";
import {
  calculateMonth,
  leaveKinds,
  type Account,
  type Company,
  type Talent,
  type Month,
  type Demand,
  type Attendance,
} from "@shared/enterprise";
import "./enterprise.css";
type State = {
  account: Pick<Account, "id" | "name" | "role" | "email">;
  companies: Company[];
  talents: Talent[];
  months: Month[];
  demands: Demand[];
  accounts: Omit<Account, "passwordHash">[];
  audit: { at: string; actor: string; action: string; entity: string }[];
};
async function api(path: string, body?: unknown) {
  const r = await fetch("/api/enterprise/" + path, {
    credentials: "same-origin",
    method: body === undefined ? "GET" : "POST",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await r.json();
  if (!r.ok) throw Error(result.error || "操作失敗");
  return result;
}
const money = (n: number) =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 2,
  }).format(n);
const currentMonth = () =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="ep-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function data(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}
export default function EnterprisePage() {
  const [state, setState] = useState<State | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [tab, setTab] = useState("總覽");
  async function reload() {
    try {
      setState(await api("state"));
      setError("");
    } catch (e) {
      if ((e as Error).message === "請先登入") setState(null);
      else setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void reload();
  }, []);
  async function run(path: string, input: unknown) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api(path, input);
      await reload();
      setNotice("已儲存");
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const action = (op: string, input: unknown) => run("action", { op, input });
  if (loading) return <main className="ep-login">正在載入企業平台…</main>;
  if (!state)
    return (
      <main className="ep-login">
        <section className="ep-login-card">
          <p className="ep-brand">BRAVO CAREER CENTER</p>
          <h1>人才管理｜企業登入</h1>
          <p className="ep-muted">招募需求、出勤確認與人才費用，一站管理。</p>
          <form
            onSubmit={async e => {
              e.preventDefault();
              await run("login", data(e.currentTarget));
            }}
          >
            <Field label="Email">
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
              />
            </Field>
            <Field label="密碼">
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </Field>
            <button disabled={busy} className="ep-primary">
              登入平台
            </button>
          </form>
          {error && (
            <p className="ep-error" role="alert">
              {error}
            </p>
          )}
          <p className="ep-muted">
            帳號由 BRAVO 建立。人才與 BRAVO 管理員也可由此登入。
          </p>
          <a href="/">
            <ArrowLeft size={16} /> 返回官網
          </a>
        </section>
      </main>
    );
  const admin = state.account.role === "admin",
    talent = state.account.role === "talent";
  const tabs = [
    ["總覽", Building2],
    ...(!talent ? [["招募需求", BriefcaseBusiness]] : []),
    ["約聘人才", Users],
    ["出勤管理", CalendarDays],
    ...(!talent ? [["人才費用", Wallet]] : []),
    ...(admin ? [["帳號管理", Users]] : []),
    ["帳號設定", Users],
  ] as const;
  return (
    <div className="ep-shell">
      <aside className="ep-sidebar">
        <a className="ep-brand" href="/">
          BRAVO
          <br />
          <small>企業人才管理平台</small>
        </a>
        <nav>
          {tabs.map(([name, Icon]) => (
            <button
              key={name as string}
              className={tab === name ? "active" : ""}
              onClick={() => setTab(name as string)}
            >
              <Icon size={19} />
              {name as string}
            </button>
          ))}
        </nav>
        <div className="ep-sidebar-bottom">
          <strong>{state.account.name}</strong>
          <span>{admin ? "BRAVO 管理員" : talent ? "人才" : "企業窗口"}</span>
          <button
            onClick={async () => {
              await run("logout", {});
              setState(null);
            }}
          >
            <LogOut size={16} />
            登出
          </button>
        </div>
      </aside>
      <main className="ep-main">
        <header>
          <div>
            <p className="ep-muted">BRAVO / {tab}</p>
            <h1>{tab}</h1>
          </div>
          <a href="/">返回官網 ↗</a>
        </header>
        {error && (
          <div className="ep-error" role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className="ep-success" role="status">
            {notice}
          </div>
        )}
        <div aria-busy={busy} className={busy ? "ep-busy" : ""}>
          {tab === "總覽" && (
            <>
              <div className="ep-stats">
                <Stat
                  title="招募中需求"
                  value={
                    state.demands.filter(d =>
                      ["已送出", "招募中"].includes(d.status)
                    ).length
                  }
                />
                <Stat
                  title="在職人才"
                  value={state.talents.filter(t => t.status === "在職").length}
                />
                <Stat
                  title="待確認出勤表"
                  value={state.months.filter(m => !m.signature).length}
                />
              </div>
              <section className="ep-card">
                <h2>讓每一次合作都有清楚的紀錄</h2>
                <p className="ep-muted">
                  出勤先確認，費用再月結。預填班表與實際打卡分開標示。
                </p>
                {talent ? (
                  <div className="ep-actions">
                    <button
                      className="ep-primary"
                      onClick={() => action("punch", { kind: "start" })}
                    >
                      <Clock size={18} />
                      上班打卡
                    </button>
                    <button onClick={() => action("punch", { kind: "end" })}>
                      下班打卡
                    </button>
                    <p>使用臺北時間，補登及跨日班次請聯絡 BRAVO。</p>
                  </div>
                ) : (
                  <button
                    className="ep-primary"
                    onClick={() => setTab("招募需求")}
                  >
                    新增招募需求
                  </button>
                )}
              </section>
            </>
          )}
          {tab === "招募需求" && <Demands state={state} action={action} />}
          {tab === "約聘人才" && (
            <>
              <section className="ep-card">
                <h2>約聘人才名單</h2>
                <div className="ep-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>姓名</th>
                        <th>職稱</th>
                        <th>廠商</th>
                        <th>合約期間</th>
                        <th>狀態</th>
                        {admin && <th>月薪</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {state.talents.map(t => (
                        <tr key={t.id}>
                          <td>{t.name}</td>
                          <td>{t.title}</td>
                          <td>
                            {
                              state.companies.find(c => c.id === t.companyId)
                                ?.name
                            }
                          </td>
                          <td>
                            {t.start} ～ {t.end || "未設定到期"}
                          </td>
                          <td>
                            {admin ? (
                              <select
                                value={t.status}
                                onChange={e =>
                                  action("talent", {
                                    ...t,
                                    status: e.target.value,
                                  })
                                }
                              >
                                {["在職", "留停", "離職"].map(v => (
                                  <option key={v}>{v}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="ep-tag">{t.status}</span>
                            )}
                          </td>
                          {admin && <td>{money(t.salary)}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!state.talents.length && (
                  <p className="ep-muted">尚無人才資料</p>
                )}
              </section>
              {admin && (
                <section className="ep-card">
                  <h2>新增約聘人才</h2>
                  <form
                    className="ep-grid"
                    onSubmit={async e => {
                      e.preventDefault();
                      const f = e.currentTarget,
                        p = data(f);
                      if (
                        await action("talent", {
                          ...p,
                          salary: Number(p.salary),
                        })
                      )
                        f.reset();
                    }}
                  >
                    <Field label="所屬廠商">
                      <select name="companyId" required>
                        {state.companies.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="姓名">
                      <input name="name" required />
                    </Field>
                    <Field label="職稱">
                      <input name="title" />
                    </Field>
                    <Field label="月薪（NT$）">
                      <input
                        type="number"
                        name="salary"
                        min="1"
                        step="0.01"
                        required
                      />
                    </Field>
                    <Field label="合約起日">
                      <input type="date" name="start" required />
                    </Field>
                    <Field label="合約迄日">
                      <input type="date" name="end" />
                    </Field>
                    <Field label="狀態">
                      <select name="status">
                        <option>在職</option>
                        <option>留停</option>
                        <option>離職</option>
                      </select>
                    </Field>
                    <button className="ep-primary">新增人才</button>
                  </form>
                </section>
              )}
            </>
          )}
          {tab === "出勤管理" && (
            <AttendancePanel state={state} action={action} />
          )}
          {tab === "人才費用" && (
            <section className="ep-card">
              <h2>
                月結費用 <span className="ep-tag">未稅</span>
              </h2>
              <p className="ep-muted">
                基本費用＝月薪＋保險費 12%＋管理費
                10%。未完成核定的資料以試算顯示。
              </p>
              <div className="ep-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>人才／月份</th>
                      <th>月薪基準</th>
                      <th>保險費</th>
                      <th>管理費</th>
                      <th>請假扣款</th>
                      <th>加班費</th>
                      <th>合計</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.months.map(m => {
                      const c = calculateMonth(m);
                      return (
                        <tr key={m.id}>
                          <td>
                            {state.talents.find(t => t.id === m.talentId)?.name}
                            <br />
                            {m.month}
                          </td>
                          <td>{money(c.salary)}</td>
                          <td>{money(c.insurance)}</td>
                          <td>{money(c.management)}</td>
                          <td>−{money(c.deduction)}</td>
                          <td>＋{money(c.overtime)}</td>
                          <td>
                            <strong>{money(c.total)}</strong>
                          </td>
                          <td>
                            {m.published
                              ? "已發布"
                              : c.unresolved.length
                                ? "待核定／試算"
                                : "待發布"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!state.months.length && <p>尚無月結資料</p>}
            </section>
          )}
          {tab === "帳號設定" && (
            <section className="ep-card">
              <h2>變更密碼</h2>
              <form
                className="ep-grid"
                onSubmit={async e => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  if (await run("password", data(f))) f.reset();
                }}
              >
                <Field label="原密碼">
                  <input
                    name="oldPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                  />
                </Field>
                <Field label="新密碼（至少 12 字元）">
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={12}
                    autoComplete="new-password"
                  />
                </Field>
                <button className="ep-primary">變更密碼</button>
              </form>
            </section>
          )}
          {tab === "帳號管理" && admin && (
            <Accounts state={state} action={action} run={run} />
          )}
        </div>
      </main>
    </div>
  );
}
function Stat({ title, value }: { title: string; value: number }) {
  return (
    <section className="ep-stat">
      <p>{title}</p>
      <strong>{value}</strong>
    </section>
  );
}
type Props = {
  state: State;
  action: (op: string, input: unknown) => Promise<boolean>;
};
function Demands({ state, action }: Props) {
  const [jd, setJd] = useState<Demand["jd"]>(),
    [fileError, setFileError] = useState("");
  const admin = state.account.role === "admin";
  return (
    <>
      <section className="ep-card">
        <h2>提出招募需求</h2>
        <form
          className="ep-grid"
          onSubmit={async e => {
            e.preventDefault();
            const f = e.currentTarget,
              p = data(f);
            if (await action("demand", { ...p, count: Number(p.count), jd })) {
              f.reset();
              setJd(undefined);
            }
          }}
        >
          <Field label="廠商">
            <select name="companyId" required>
              {state.companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="職稱">
            <input name="title" required />
          </Field>
          <Field label="需求人數">
            <input
              type="number"
              min="1"
              name="count"
              defaultValue="1"
              required
            />
          </Field>
          <Field label="工作性質">
            <select name="nature">
              <option>正職</option>
              <option>約聘</option>
            </select>
          </Field>
          <Field label="職務描述（JD）">
            <textarea name="description" rows={5} />
          </Field>
          <Field label="備註">
            <textarea name="note" rows={5} />
          </Field>
          <Field label="JD 附件（PDF／Word，最多 5 MB）">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={async e => {
                setFileError("");
                setJd(undefined);
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) {
                  setFileError("附件超過 5 MB");
                  return;
                }
                const r = new FileReader();
                r.onload = () =>
                  setJd({ name: f.name, type: f.type, data: String(r.result) });
                r.readAsDataURL(f);
              }}
            />
            {fileError && <span className="ep-error">{fileError}</span>}
          </Field>
          <Field label="送出方式">
            <select name="status">
              <option>已送出</option>
              <option>草稿</option>
            </select>
          </Field>
          <button className="ep-primary" disabled={!!fileError}>
            儲存需求
          </button>
        </form>
      </section>
      <section className="ep-card">
        <h2>需求紀錄</h2>
        {!state.demands.length && <p className="ep-muted">尚無招募需求</p>}
        {state.demands.map(d => (
          <article className="ep-demand" key={d.id}>
            <div>
              <h3>{d.title}</h3>
              <p>
                {d.nature} · {d.count} 人 ·{" "}
                {state.companies.find(c => c.id === d.companyId)?.name}
              </p>
              <p className="ep-pre">{d.description}</p>
              <p className="ep-muted ep-pre">{d.note}</p>
              {d.jd && (
                <button
                  onClick={() => {
                    const data = d.jd!.data;
                    const [header, raw] = data.split(",");
                    if (!header || !raw) return;
                    const bytes = Uint8Array.from(atob(raw), c =>
                      c.charCodeAt(0)
                    );
                    const url = URL.createObjectURL(
                      new Blob([bytes], { type: "application/octet-stream" })
                    );
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = d.jd!.name;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  下載 JD：{d.jd.name}
                </button>
              )}
            </div>
            <select
              value={d.status}
              onChange={e => action("demand", { ...d, status: e.target.value })}
            >
              {(admin
                ? ["草稿", "已送出", "招募中", "已完成", "已取消"]
                : [
                    "草稿",
                    "已送出",
                    "已取消",
                    ...(!["草稿", "已送出", "已取消"].includes(d.status)
                      ? [d.status]
                      : []),
                  ]
              ).map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </article>
        ))}
      </section>
    </>
  );
}
function Accounts({
  state,
  action,
  run,
}: Props & { run: (path: string, input: unknown) => Promise<boolean> }) {
  return (
    <>
      <section className="ep-card">
        <h2>新增廠商</h2>
        <form
          className="ep-actions"
          onSubmit={async e => {
            e.preventDefault();
            const f = e.currentTarget;
            if (await action("company", data(f))) f.reset();
          }}
        >
          <input
            aria-label="廠商名稱"
            placeholder="廠商名稱"
            name="name"
            required
          />
          <button className="ep-primary">新增廠商</button>
        </form>
      </section>
      <section className="ep-card">
        <h2>建立登入帳號</h2>
        <form
          className="ep-grid"
          onSubmit={async e => {
            e.preventDefault();
            const f = e.currentTarget;
            if (await run("account", data(f))) f.reset();
          }}
        >
          <Field label="姓名">
            <input name="name" required />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required />
          </Field>
          <Field label="初始密碼（至少 12 字元）">
            <input
              name="password"
              type="password"
              minLength={12}
              autoComplete="new-password"
              required
            />
          </Field>
          <Field label="角色">
            <select name="role">
              <option value="company">廠商窗口</option>
              <option value="talent">人才</option>
            </select>
          </Field>
          <Field label="廠商">
            <select name="companyId">
              {state.companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="人才（人才帳號必選）">
            <select name="talentId">
              <option value="">不適用</option>
              {state.talents.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <button className="ep-primary">建立帳號</button>
        </form>
      </section>
      <section className="ep-card">
        <h2>帳號名單</h2>
        {state.accounts.map(a => (
          <p key={a.id}>
            {a.name} · {a.email} ·{" "}
            {a.role === "admin"
              ? "管理員"
              : a.role === "company"
                ? "廠商"
                : "人才"}{" "}
            · {a.active ? "啟用" : "停用"}{" "}
            {a.role !== "admin" && (
              <button
                onClick={() =>
                  run("account-status", { id: a.id, active: !a.active })
                }
              >
                {a.active ? "停用" : "啟用"}
              </button>
            )}
          </p>
        ))}
      </section>
    </>
  );
}
function AttendancePanel({ state, action }: Props) {
  const admin = state.account.role === "admin";
  const [selected, setSelected] = useState("");
  const m = state.months.find(m => m.id === selected);
  return (
    <>
      {admin && (
        <section className="ep-card">
          <h2>按月預填出勤</h2>
          <p className="ep-muted">
            預設
            09:00–18:00。只補入尚無資料的工作日，不覆蓋打卡。請核對廠商行事曆、國定假日、調移與留停期間。
          </p>
          <form
            className="ep-grid"
            onSubmit={e => {
              e.preventDefault();
              const p = data(e.currentTarget);
              void action("generate", {
                talentId: p.talentId,
                month: p.month,
                start: p.start,
                end: p.end,
                holidays: p.holidays.split(/[\s,，]+/).filter(Boolean),
                calendarReviewed: true,
              });
            }}
          >
            <Field label="人才">
              <select name="talentId" required>
                {state.talents
                  .filter(t => t.status === "在職")
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="月份">
              <input
                name="month"
                type="month"
                defaultValue={currentMonth()}
                required
              />
            </Field>
            <Field label="預設上班時間">
              <input name="start" type="time" defaultValue="09:00" required />
            </Field>
            <Field label="預設下班時間">
              <input name="end" type="time" defaultValue="18:00" required />
            </Field>
            <Field label="排除日期（假日／留停，YYYY-MM-DD，每行一個）">
              <textarea name="holidays" rows={3} />
            </Field>
            <label className="ep-check">
              <input type="checkbox" required />
              已核對本月行事曆與不出勤期間
            </label>
            <button className="ep-primary">產生月表</button>
          </form>
        </section>
      )}
      <section className="ep-card">
        <h2>每月出勤表</h2>
        <Field label="選擇人才與月份">
          <select value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">請選擇</option>
            {state.months.map(m => (
              <option key={m.id} value={m.id}>
                {state.talents.find(t => t.id === m.talentId)?.name} · {m.month}{" "}
                · {m.signature ? "已確認" : "待確認"}
              </option>
            ))}
          </select>
        </Field>
        {!state.months.length && <p className="ep-muted">尚無出勤紀錄</p>}
      </section>
      {m && (
        <MonthEditor
          key={`${m.id}-${m.version}-${m.signature?.at || ""}-${m.published}-${m.correction || ""}`}
          m={m}
          state={state}
          action={action}
        />
      )}
    </>
  );
}
function MonthEditor({ m, state, action }: Props & { m: Month }) {
  const [draft, setDraft] = useState<Month>(structuredClone(m)),
    [importError, setImportError] = useState("");
  const admin = state.account.role === "admin",
    talent = state.account.role === "talent";
  const c = calculateMonth(draft);
  const patch = (i: number, p: Partial<Attendance>) =>
    setDraft(d => ({
      ...d,
      rows: d.rows.map((r, j) => (j === i ? { ...r, ...p } : r)),
    }));
  const save = () =>
    action("saveMonth", {
      id: m.id,
      version: m.version,
      rows: draft.rows,
      salary: draft.salary,
      billingRule: draft.billingRule,
      payrollReviewed: draft.payrollReviewed,
    });
  return (
    <section className="ep-card">
      <div className="ep-section-heading">
        <h2>
          {state.talents.find(t => t.id === m.talentId)?.name} · {m.month}
        </h2>
        <span className="ep-tag">
          {m.published ? "已發布" : m.signature ? "人才已確認" : "待人才確認"} ·
          v{m.version}
        </span>
      </div>
      {m.correction && <p className="ep-error">人才更正要求：{m.correction}</p>}
      <p className="ep-muted">
        上下班時間保留原始紀錄。工時需扣除實際休息時間，加班時數由 BRAVO
        核對填寫。
      </p>
      {admin && (
        <>
          <div className="ep-actions">
            <button
              onClick={() => {
                const used = new Set(draft.rows.map(r => r.date));
                const day = prompt("新增日期（YYYY-MM-DD）", m.month + "-01");
                if (!day || used.has(day)) return;
                setDraft({
                  ...draft,
                  rows: [
                    ...draft.rows,
                    {
                      date: day,
                      start: "09:00",
                      end: "18:00",
                      dayType: "工作日" as const,
                      leave: "無" as const,
                      leaveHours: 0,
                      overtimeHours: 0,
                      overtimeApproved: false,
                      source: "後台填寫" as const,
                      note: "",
                    },
                  ].sort((a, b) => a.date.localeCompare(b.date)),
                });
              }}
            >
              新增日期
            </button>
            <Field label="Excel 匯入（先預覽，儲存後生效）">
              <input
                type="file"
                accept=".xlsx"
                onChange={async e => {
                  setImportError("");
                  try {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 5 * 1024 * 1024)
                      throw Error("Excel 超過 5 MB");
                    const { parseAttendanceWorkbook } = await import(
                      "@/lib/attendanceImport"
                    );
                    const name =
                      state.talents.find(t => t.id === m.talentId)?.name || "";
                    const imported = await parseAttendanceWorkbook(
                      await f.arrayBuffer(),
                      name,
                      m.month
                    );
                    const existing = new Set(draft.rows.map(r => r.date));
                    if (imported.some(r => existing.has(r.date)))
                      throw Error(
                        "匯入日期與既有資料重複；請先刪除待替換的列，再匯入"
                      );
                    setDraft({
                      ...draft,
                      rows: [...draft.rows, ...imported].sort((a, b) =>
                        a.date.localeCompare(b.date)
                      ),
                    });
                  } catch (e) {
                    setImportError((e as Error).message);
                  }
                }}
              />
            </Field>
          </div>
          {importError && <p className="ep-error">{importError}</p>}
        </>
      )}
      <div className="ep-table-scroll">
        <table className="ep-attendance">
          <thead>
            <tr>
              <th>日期／來源</th>
              <th>上班</th>
              <th>下班</th>
              <th>日別</th>
              <th>假別</th>
              <th>請假時數</th>
              <th>加班時數</th>
              <th>加班核定</th>
              <th>備註／特殊核定</th>
              {admin && <th>操作</th>}
            </tr>
          </thead>
          <tbody>
            {draft.rows.map((r, i) => (
              <tr key={r.date}>
                <td>
                  {r.date}
                  <small>{r.source}</small>
                </td>
                <td>
                  {admin ? (
                    <input
                      type="time"
                      aria-label={r.date + "上班"}
                      value={r.start}
                      onChange={e => patch(i, { start: e.target.value })}
                    />
                  ) : (
                    r.start || "—"
                  )}
                </td>
                <td>
                  {admin ? (
                    <input
                      type="time"
                      aria-label={r.date + "下班"}
                      value={r.end}
                      onChange={e => patch(i, { end: e.target.value })}
                    />
                  ) : (
                    r.end || "—"
                  )}
                </td>
                <td>
                  {admin ? (
                    <select
                      value={r.dayType}
                      onChange={e =>
                        patch(i, {
                          dayType: e.target.value as Attendance["dayType"],
                        })
                      }
                    >
                      {["工作日", "休息日", "國定假日", "例假", "不出勤"].map(
                        s => (
                          <option key={s}>{s}</option>
                        )
                      )}
                    </select>
                  ) : (
                    r.dayType
                  )}
                </td>
                <td>
                  {admin ? (
                    <select
                      value={r.leave}
                      onChange={e =>
                        patch(i, {
                          leave: e.target.value as Attendance["leave"],
                        })
                      }
                    >
                      {leaveKinds.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    r.leave
                  )}
                </td>
                <td>
                  {admin ? (
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={r.leaveHours}
                      onChange={e =>
                        patch(i, { leaveHours: Number(e.target.value) })
                      }
                    />
                  ) : (
                    r.leaveHours
                  )}
                </td>
                <td>
                  {admin ? (
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={r.overtimeHours}
                      onChange={e =>
                        patch(i, { overtimeHours: Number(e.target.value) })
                      }
                    />
                  ) : (
                    r.overtimeHours
                  )}
                </td>
                <td>
                  {admin ? (
                    <input
                      aria-label={r.date + "加班核定"}
                      type="checkbox"
                      checked={r.overtimeApproved}
                      onChange={e =>
                        patch(i, { overtimeApproved: e.target.checked })
                      }
                    />
                  ) : r.overtimeApproved ? (
                    "已核定"
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {admin ? (
                    <>
                      <input
                        placeholder="備註"
                        value={r.note}
                        onChange={e => patch(i, { note: e.target.value })}
                      />
                      <details>
                        <summary>特殊金額核定</summary>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="扣款覆寫（元）"
                          value={r.manualDeduction ?? ""}
                          onChange={e =>
                            patch(i, {
                              manualDeduction:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            })
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="加班覆寫（元）"
                          value={r.manualOvertime ?? ""}
                          onChange={e =>
                            patch(i, {
                              manualOvertime:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            })
                          }
                        />
                        <input
                          placeholder="核定依據（必填）"
                          value={r.manualReason || ""}
                          onChange={e =>
                            patch(i, { manualReason: e.target.value })
                          }
                        />
                      </details>
                    </>
                  ) : (
                    r.note
                  )}
                </td>
                {admin && (
                  <td>
                    <button
                      onClick={() =>
                        setDraft({
                          ...draft,
                          rows: draft.rows.filter((_, j) => i !== j),
                        })
                      }
                    >
                      刪除
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {admin && (
        <>
          <div className="ep-grid ep-settings">
            <Field label="本月薪資基準">
              <input
                type="number"
                min="1"
                step="0.01"
                value={draft.salary}
                onChange={e =>
                  setDraft({ ...draft, salary: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="廠商請款調整規則">
              <select
                value={draft.billingRule}
                onChange={e =>
                  setDraft({
                    ...draft,
                    billingRule: e.target.value as Month["billingRule"],
                  })
                }
              >
                <option value="pending">待合約確認</option>
                <option value="fixed">
                  依合約：12%／10% 按原月薪，另加減出勤調整
                </option>
              </select>
            </Field>
            <label className="ep-check">
              <input
                type="checkbox"
                checked={draft.payrollReviewed}
                onChange={e =>
                  setDraft({ ...draft, payrollReviewed: e.target.checked })
                }
              />
              已核對班表休息時間、年度假別資格／額度及核定金額
            </label>
          </div>
          <div className="ep-actions">
            <button className="ep-primary" onClick={save}>
              儲存出勤與計算設定
            </button>
            <button
              onClick={() =>
                action("publish", { id: m.id, version: m.version })
              }
              disabled={
                !m.signature ||
                !m.payrollReviewed ||
                !!calculateMonth(m).unresolved.length ||
                !!m.correction
              }
            >
              發布廠商月結
            </button>
          </div>
          <p className="ep-muted">
            儲存修改會取消既有簽名及發布狀態，須請人才重新確認。
          </p>
          <div className="ep-summary">
            未稅試算：{money(c.salary)}＋保險 {money(c.insurance)}＋管理{" "}
            {money(c.management)}−扣款 {money(c.deduction)}＋加班{" "}
            {money(c.overtime)}＝<strong>{money(c.total)}</strong>
          </div>
          {c.unresolved.length > 0 && (
            <details className="ep-warning" open>
              <summary>尚待核定，無法發布</summary>
              {c.unresolved.map(s => (
                <p key={s}>{s}</p>
              ))}
            </details>
          )}
        </>
      )}
      {m.signature && (
        <div className="ep-signature-record">
          <img src={m.signature.image} alt="人才出勤確認簽名" />
          <p>
            {m.signature.name} ·{" "}
            {new Date(m.signature.at).toLocaleString("zh-TW", {
              timeZone: "Asia/Taipei",
            })}{" "}
            · v{m.signature.version}
          </p>
        </div>
      )}
      {talent && (
        <>
          <form
            onSubmit={e => {
              e.preventDefault();
              const p = data(e.currentTarget);
              void action("correction", { id: m.id, note: p.note });
            }}
            className="ep-actions"
          >
            <input
              name="note"
              placeholder="需要更正的日期與原因"
              aria-label="更正原因"
              required
            />
            <button>提出更正</button>
          </form>
          {!m.signature && (
            <Signature
              onSign={(name, image) =>
                action("sign", { id: m.id, version: m.version, name, image })
              }
            />
          )}
        </>
      )}
    </section>
  );
}
function Signature({
  onSign,
}: {
  onSign: (name: string, image: string) => Promise<boolean>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    [drawn, setDrawn] = useState(false),
    [name, setName] = useState(""),
    [agree, setAgree] = useState(false);
  const down = useRef(false);
  return (
    <div className="ep-sign">
      <h3>確認本月出勤</h3>
      <p>請檢查每日上下班、請假及加班紀錄，再簽名確認。</p>
      <canvas
        ref={canvas}
        width={700}
        height={180}
        aria-label="簽名區"
        onPointerDown={e => {
          const c = canvas.current!,
            r = c.getBoundingClientRect(),
            ctx = c.getContext("2d")!;
          c.setPointerCapture(e.pointerId);
          down.current = true;
          ctx.beginPath();
          ctx.moveTo(
            ((e.clientX - r.left) * 700) / r.width,
            ((e.clientY - r.top) * 180) / r.height
          );
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#24344b";
        }}
        onPointerMove={e => {
          if (!down.current) return;
          const c = canvas.current!,
            r = c.getBoundingClientRect(),
            ctx = c.getContext("2d")!;
          ctx.lineTo(
            ((e.clientX - r.left) * 700) / r.width,
            ((e.clientY - r.top) * 180) / r.height
          );
          ctx.stroke();
          setDrawn(true);
        }}
        onPointerUp={() => {
          down.current = false;
        }}
        onPointerCancel={() => {
          down.current = false;
        }}
      />
      <div className="ep-actions">
        <button
          onClick={() => {
            canvas.current?.getContext("2d")?.clearRect(0, 0, 700, 180);
            setDrawn(false);
          }}
        >
          清除簽名
        </button>
        <input
          aria-label="確認人姓名"
          placeholder="確認人姓名"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <label className="ep-check">
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
        />
        我已核對本月出勤，確認以上紀錄正確。
      </label>
      <button
        className="ep-primary"
        disabled={!drawn || !name.trim() || !agree}
        onClick={() => onSign(name, canvas.current!.toDataURL("image/png"))}
      >
        確認並簽名
      </button>
    </div>
  );
}
