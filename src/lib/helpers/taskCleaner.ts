import { db, task } from "$lib/server/db";
import { inArray } from "drizzle-orm";

export async function ScrubTasks() {
  const res = await db.query.settingsGeneral.findFirst({
    columns: {
      keepTaskHistoryCount: true
    }
  });

  if(!res) {
    return;
  }

  const count = res.keepTaskHistoryCount;

  // get all tasks and sort them by date
  const tasks = await db.query.task.findMany({
    orderBy: (task, { desc }) => desc(task.startTime),
    columns: {
      id: true
    }
  });

  if (tasks.length > count) {
    const toDelete = tasks.slice(count).map((t) => t.id);
    await db.delete(task).where(inArray(task.id, toDelete));
  }
}