import type { Task } from './task';

const storageKey = 'spisok-zadach.tasks.v2';

function isTask(value: unknown): value is Task {
  return typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'title' in value && typeof value.title === 'string' &&
    'done' in value && typeof value.done === 'boolean';
}

export function readTasks(storage: Storage): Task[] {
  const value = storage.getItem(storageKey);
  if (value === null) return [];

  const tasks: unknown = JSON.parse(value);
  if (!Array.isArray(tasks)) throw new TypeError('Invalid task list');

  return tasks.filter(isTask);
}

export function writeTasks(storage: Storage, tasks: readonly Task[]): void {
  storage.setItem(storageKey, JSON.stringify(tasks));
}
