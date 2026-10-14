import { PatchOperation } from '../patch-generator/types';
import { ExecutionContext } from './types';
export declare class OperationDispatcher {
    private registry;
    constructor();
    dispatch(operation: PatchOperation, context: ExecutionContext): void;
}
