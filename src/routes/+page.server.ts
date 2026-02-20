import { db } from "$lib/server/db"

export const load = async () => {
  const tasks = await db.query.task.findMany({
    orderBy: (task, { desc }) => desc(task.startTime),
    limit: 20
  });

  return {
    tasks
  };
}