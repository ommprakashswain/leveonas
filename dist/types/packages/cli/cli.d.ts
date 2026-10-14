/**
 * Leveonas Unified CLI Router
 *
 * Dispatches commands: init, check, format, compile, inspect, audit, benchmark, help, version.
 *
 * Exit Code Contract:
 * - 0: Success
 * - 1: Validation / compilation failure
 * - 2: CLI usage error (missing args, invalid command/flag)
 * - 3: Security audit failure / dangerous pattern detected
 * - 4: Provider / network / runtime failure
 */
export declare function runCLI(args: string[]): Promise<number> | number;
