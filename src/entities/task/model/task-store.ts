import { makeAutoObservable } from 'mobx';
import { readTasks, writeTasks } from './task-storage';
import type { Task } from './task';

export const MAX_TASK_LENGTH = 160;

export class TaskStore {
  tasks: Task[] = [];
  storageError = '';

  constructor(private readonly getStorage: () => Storage) {
    makeAutoObservable<this, 'getStorage'>(this, { getStorage: false });
    this.restore();
  }

  get completedCount() {
    return this.tasks.filter(task => task.done).length;
  }

  restore() {
    try {
      this.tasks = readTasks(this.getStorage());
    } catch {
      this.storageError = 'Не удалось загрузить список из хранилища браузера.';
    }
  }

  add(title: string): boolean {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length > MAX_TASK_LENGTH) return false;

    this.tasks.push({ id: crypto.randomUUID(), title: trimmedTitle, done: false });
    this.persist();
    return true;
  }

  setDone(id: Task['id'], done: boolean) {
    const task = this.tasks.find(item => item.id === id);
    if (!task) return;

    task.done = done;
    this.persist();
  }

  remove(id: Task['id']) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.persist();
  }

  persist() {
    try {
      writeTasks(this.getStorage(), this.tasks);
      this.storageError = '';
    } catch {
      this.storageError = 'Не удалось сохранить изменения. После обновления страницы они могут пропасть.';
    }
  }
}

export const taskStore = new TaskStore(() => window.localStorage);
