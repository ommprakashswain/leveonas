import { PatchOperation } from '../patch-generator/types';
export interface RegisteredEventHandler {
    nodeId: string;
    eventName: string;
    targetSelector: string;
    handlerFn: Function;
    listener: (e: any) => void;
}
export declare class JSPatchApplier {
    private doc;
    private win;
    private executedUnitCodes;
    private eventHandlerRegistry;
    private activeTimers;
    private sharedScope;
    private onError?;
    private domApplier?;
    constructor(doc?: any, win?: any, onError?: (err: Error, context: string) => void, domApplier?: any);
    setDOMApplier(domApplier: any): void;
    private setupRuntimeScope;
    apply(patches: PatchOperation[]): void;
    private executeUnitCode;
    private bindEventHandlerFromCode;
    registerEventHandler(nodeId: string, eventName: string, targetSelector: string, handlerFn: Function): void;
    removeRegisteredEventHandler(nodeId: string): void;
    cleanup(): void;
    private handleError;
}
