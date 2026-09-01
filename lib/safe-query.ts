/**
 * Run a Prisma query safely, returning a fallback value if the database is unavailable.
 */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      // In dev, surface the error
    }
    console.warn("DB unavailable, using fallback:", (e as Error).message);
    return fallback;
  }
}
