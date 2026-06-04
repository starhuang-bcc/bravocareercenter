import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, ContactSubmission } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new contact submission
 */
export async function createContactSubmission(
  submission: InsertContactSubmission
): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact submission: database not available");
    return null;
  }

  try {
    const result = await db.insert(contactSubmissions).values(submission);
    const id = Number((result as any).insertId);
    if (!id) return null;

    const created = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create contact submission:", error);
    throw error;
  }
}

/**
 * Get all contact submissions with optional filtering
 */
export async function getContactSubmissions(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<ContactSubmission[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submissions: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(contactSubmissions);

    if (filters?.status && ["new", "read", "replied", "archived"].includes(filters.status)) {
      query = query.where(eq(contactSubmissions.status, filters.status as any));
    }

    query = query.orderBy(desc(contactSubmissions.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  } catch (error) {
    console.error("[Database] Failed to get contact submissions:", error);
    return [];
  }
}

/**
 * Get a single contact submission by ID
 */
export async function getContactSubmissionById(
  id: number
): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submission: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get contact submission:", error);
    return null;
  }
}

/**
 * Update contact submission status
 */
export async function updateContactSubmissionStatus(
  id: number,
  status: "new" | "read" | "replied" | "archived"
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact submission: database not available");
    return false;
  }

  try {
    await db
      .update(contactSubmissions)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactSubmissions.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update contact submission:", error);
    return false;
  }
}

/**
 * Get contact submission statistics
 */
export async function getContactSubmissionStats(): Promise<{
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submission stats: database not available");
    return { total: 0, new: 0, read: 0, replied: 0, archived: 0 };
  }

  try {
    const submissions = await db.select().from(contactSubmissions);
    const stats = {
      total: submissions.length,
      new: submissions.filter((s) => s.status === "new").length,
      read: submissions.filter((s) => s.status === "read").length,
      replied: submissions.filter((s) => s.status === "replied").length,
      archived: submissions.filter((s) => s.status === "archived").length,
    };
    return stats;
  } catch (error) {
    console.error("[Database] Failed to get contact submission stats:", error);
    return { total: 0, new: 0, read: 0, replied: 0, archived: 0 };
  }
}
