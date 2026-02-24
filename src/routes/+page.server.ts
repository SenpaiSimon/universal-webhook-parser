import { db } from "$lib/server/db"

const TASK_COUNT = 20;

export const load = async () => {
  let taskCountLimit = TASK_COUNT;

  const settings = await db.query.settingsGeneral.findFirst({
    columns: {
      keepTaskHistoryCount: true
    }
  });

  if(settings) {
    taskCountLimit = settings.keepTaskHistoryCount;
  }

  const tasks = await db.query.task.findMany({
    orderBy: (task, { desc }) => desc(task.startTime),
    limit: taskCountLimit
  });

  const hooks = await db.query.hooks.findMany({
    columns: {
      title: true,
      id: true
    }
  });

  return {
    tasks,
    hooks,
    maxTask: taskCountLimit
  };
}