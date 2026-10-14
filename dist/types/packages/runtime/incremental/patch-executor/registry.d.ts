import { PatchOperationType } from '../patch-generator/types';
import { OperationHandler } from './types';
export declare class HandlerRegistry {
    private handlers;
    register(type: PatchOperationType, handler: OperationHandler): void;
    get(type: PatchOperationType): OperationHandler | undefined;
}
