export class CleanupManager {
  private cleanupTasks: Array<() => void> = [];

  addTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  cleanup() {
    for (const task of this.cleanupTasks) {
      try {
        task();
      } catch (e) {
        console.error('Error during cleanup:', e);
      }
    }
    this.cleanupTasks = [];
  }
}
