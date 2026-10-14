export declare class EventEmitter {
    private listeners;
    on(event: string, fn: Function): void;
    off(event: string, fn: Function): void;
    emit(event: string, ...args: any[]): void;
}
