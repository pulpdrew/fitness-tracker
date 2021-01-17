const S_PER_MINUTE = 60;
const S_PER_HOUR = S_PER_MINUTE * 60;

export class Duration {
  constructor(public totalSeconds: number) {}

  get seconds(): number {
    return this.totalSeconds % S_PER_MINUTE;
  }

  get minutes(): number {
    return Math.floor((this.totalSeconds % S_PER_HOUR) / S_PER_MINUTE);
  }

  get hours(): number {
    return Math.floor(this.totalSeconds / S_PER_HOUR);
  }

  static from(hours: number, minutes: number, seconds: number): Duration {
    return new Duration(hours * S_PER_HOUR + minutes * S_PER_MINUTE + seconds);
  }

  static parse(duration: string): Duration {
    const parts = duration.split(':');
    const seconds =
      parts
        .map((p) => Number.parseInt(p))
        .reduce((seconds, n) => seconds * 60 + n, 0) || 0;
    return new Duration(seconds);
  }

  toString(): string {
    const hours = this.hours.toFixed(0);
    const minutes =
      this.minutes < 10
        ? '0' + this.minutes.toFixed(0)
        : this.minutes.toPrecision(2);
    const seconds =
      this.seconds < 10
        ? '0' + this.seconds.toFixed(0)
        : this.seconds.toPrecision(2);

    return `${hours}:${minutes}:${seconds}`;
  }
}
