import { SyntaxTracker } from './state';

export class SyntaxRecoverer {
  static recover(buffer: string, tracker: SyntaxTracker): string {
    let recovered = buffer;
    
    // Close strings
    if (tracker.state === 'IN_STRING') {
      if (tracker.escapeNext) {
        recovered += '\\';
      }
      recovered += tracker.quoteChar;
    }
    
    // Close braces
    if (tracker.braceDepth > 0) {
      recovered += '}'.repeat(tracker.braceDepth);
    }
    
    return recovered;
  }
}
