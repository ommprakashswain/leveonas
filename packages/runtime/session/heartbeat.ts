export class HeartbeatManager {
  private timer: any = null;

  constructor(
    private onHeartbeat: () => void,
    private intervalMs: number = 15000
  ) {}

  start() {
    this.stop();
    this.timer = setInterval(() => this.onHeartbeat(), this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
