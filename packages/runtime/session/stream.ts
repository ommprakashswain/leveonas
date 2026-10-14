import { PatchOperation } from '../incremental/patch-generator/types';

export interface StreamController {
  sendChunk(text: string): void;
  sendPatch(patch: PatchOperation | PatchOperation[]): void;
  sendError(error: any): void;
  sendComplete(usage?: any): void;
  sendHeartbeat(): void;
  onDisconnect(callback: () => void): void;
}
