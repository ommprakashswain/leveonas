import { BenchmarkFramework } from './scenarios';
export interface CompilerStageTimings {
    parseTimeMs: number;
    loweringTimeMs: number;
    validationTimeMs: number;
    reconciliationTimeMs: number;
    patchGenerationTimeMs: number;
    serializationTimeMs: number;
    totalCompilerTimeMs: number;
}
export interface IRSizeMetrics {
    lmBytes: number;
    astBytes: number;
    commonUIIRBytes: number;
    runtimeIRBytes: number;
    domASTBytes: number;
    patchBytes: number;
    patchSSEBytes: number;
}
export interface PatchTypeBreakdown {
    CREATE_NODE: number;
    INSERT_CHILD: number;
    REMOVE_NODE: number;
    MOVE_CHILD: number;
    UPDATE_TEXT: number;
    SET_ATTRIBUTE: number;
    UPDATE_STYLE: number;
    CLASS_UPDATE: number;
    EVENT_UPDATE: number;
    EXECUTE_JS_UNIT: number;
    ATTACH_EVENT_HANDLER: number;
    TOTAL: number;
}
export interface ProfilerResult {
    framework: BenchmarkFramework;
    timings: CompilerStageTimings;
    sizes: IRSizeMetrics;
    patchBreakdown: PatchTypeBreakdown;
    compileSuccess: boolean;
    error: string | null;
}
export declare class LeveonasIRProfiler {
    /**
     * Profiles the full compilation pipeline across any of the 5 frameworks:
     * LM Text -> Framework AST -> Common UI IR -> CommonUIReconciler -> DOM AST & Reactivity -> Patch Generation -> Serialization
     */
    static profile(lmCode: string, framework?: BenchmarkFramework): ProfilerResult;
}
