const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;

export class Duration {
  constructor(public totalMilliseconds: number) {}

  get milliseconds(): number {
    return this.totalMilliseconds % MS_PER_SECOND;
  }

  get seconds(): number {
    return Math.floor((this.totalMilliseconds % MS_PER_MINUTE) / MS_PER_SECOND);
  }

  get minutes(): number {
    return Math.floor((this.totalMilliseconds % MS_PER_HOUR) / MS_PER_MINUTE);
  }

  get hours(): number {
    return Math.floor(this.totalMilliseconds / MS_PER_HOUR);
  }

  static from(
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number
  ): Duration {
    return new Duration(
      hours * MS_PER_HOUR +
        minutes * MS_PER_MINUTE +
        seconds * MS_PER_SECOND +
        milliseconds
    );
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
    const milliseconds = (this.milliseconds / 1000).toFixed(3).substr(1);

    return `${hours}:${minutes}:${seconds}${milliseconds}`;
  }
}
