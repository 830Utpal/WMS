import { db } from "./dbConfig";
import { Users, Notifications, Transactions } from "./schema";
import { eq, and, desc } from "drizzle-orm";

// Define TypeScript Interfaces
interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: Date | null;
}

interface FormattedTransaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string; // Formatted as "YYYY-MM-DD"
}

export async function createUser(email: string, name: string) {
  try {
    const [user] = await db.insert(Users).values({ email, name }).returning().execute();
    return user;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute();
    return user;
  } catch (error) {
    console.error("❌ Error fetching user by email:", error);
    return null;
  }
}

export async function getUnreadNotifications(userId: number) {
  try {
    return await db
      .select()
      .from(Notifications)
      .where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false)))
      .execute();
  } catch (error) {
    console.error("❌ Error fetching unread notifications:", error);
    return [];
  }
}

export async function getUserBalance(userId: number): Promise<number> {
  try {
    const transactions = await getRewardTransactions(userId);
    if (!transactions || transactions.length === 0) return 0;

    const balance = transactions.reduce((acc: number, transaction: FormattedTransaction) => {
      return transaction.type.startsWith("earned") ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    return Math.max(balance, 0);
  } catch (error) {
    console.error("❌ Error fetching user balance:", error);
    return 0;
  }
}

export async function getRewardTransactions(userId: number): Promise<FormattedTransaction[]> {
  try {
    const transactions: Transaction[] = await db
      .select({
        id: Transactions.id,
        type: Transactions.type,
        amount: Transactions.amount,
        description: Transactions.description,
        date: Transactions.date,
      })
      .from(Transactions)
      .where(eq(Transactions.userId, userId))
      .orderBy(desc(Transactions.date))
      .limit(10)
      .execute();

    return transactions.map((t: Transaction) => ({
      ...t,
      date: t.date instanceof Date ? t.date.toISOString().split("T")[0] : "N/A", // Ensure date is safely formatted
    }));
  } catch (error) {
    console.error("❌ Error fetching reward transactions:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    await db.update(Notifications).set({ isRead: true }).where(eq(Notifications.id, notificationId)).execute();
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
  }
}
