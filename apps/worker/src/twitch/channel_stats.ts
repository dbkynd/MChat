class Stats {
  private intervals: Map<number, number>;
  private intervalSize = 1000 * 60 * 5;
  private maxAge = 1000 * 60 * 60;

  constructor() {
    this.intervals = new Map();
  }

  recordMessage(): void {
    const now = Date.now();
    const flooredTimestamp = Math.floor(now / this.intervalSize) * this.intervalSize;
    this.intervals.set(flooredTimestamp, (this.intervals.get(flooredTimestamp) || 0) + 1);
    this.cleanOldEntries();
  }

  private cleanOldEntries(): void {
    const now = Date.now();
    for (const [timestamp] of this.intervals) {
      if (timestamp < now - this.maxAge) {
        this.intervals.delete(timestamp);
      }
    }
  }

  getStats(): { timestamp: number; count: number }[] {
    return Array.from(this.intervals.entries()).map(([timestamp, count]) => ({
      timestamp,
      count,
    }));
  }
}

export default Stats;
