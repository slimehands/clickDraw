export class Timer {
  private startTime: number | null = null;
  private endTime: number | null = null;

  start(): void {
    this.startTime = Date.now();
    this.endTime = null; // reset endTime in case timer is reused
  }

  stop(): number {
    if (this.startTime === null) {
      throw new Error("Timer was not started.");
    }

    this.endTime = Date.now();
    const elapsedMs = this.endTime - this.startTime;
    return elapsedMs / 1000; // return time in seconds
  }
}