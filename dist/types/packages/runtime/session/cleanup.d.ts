export declare class CleanupManager {
    private cleanupTasks;
    addTask(task: () => void): void;
    cleanup(): void;
}
