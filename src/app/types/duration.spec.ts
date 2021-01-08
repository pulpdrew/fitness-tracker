import { Duration } from './duration';

describe('Duration', () => {
  it('should handle 0 duration', () => {
    const duration = new Duration(0);
    expect(duration.milliseconds).toBe(0);
    expect(duration.seconds).toBe(0);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  it('should handle sub-second durations', () => {
    const duration = new Duration(500);
    expect(duration.milliseconds).toBe(500);
    expect(duration.seconds).toBe(0);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  it('should handle sub-minute durations', () => {
    const duration = new Duration(1500);
    expect(duration.milliseconds).toBe(500);
    expect(duration.seconds).toBe(1);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  it('should handle sub-hour durations', () => {
    const duration = new Duration(90.5 * 1000);
    expect(duration.milliseconds).toBe(500);
    expect(duration.seconds).toBe(30);
    expect(duration.minutes).toBe(1);
    expect(duration.hours).toBe(0);
  });

  it('should handle durations longer than an hour', () => {
    const duration = new Duration(1 * 3600000 + 30 * 60000 + 30 * 1000 + 500);
    expect(duration.milliseconds).toBe(500);
    expect(duration.seconds).toBe(30);
    expect(duration.minutes).toBe(30);
    expect(duration.hours).toBe(1);
  });

  it('should hand durations of exactly 1 hour', () => {
    const duration = new Duration(1 * 60 * 60 * 1000);
    expect(duration.milliseconds).toBe(0);
    expect(duration.seconds).toBe(0);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(1);
  });

  it('should hand durations of exactly 1 second', () => {
    const duration = new Duration(1000);
    expect(duration.milliseconds).toBe(0);
    expect(duration.seconds).toBe(1);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  describe('toString()', () => {
    it('should handle single digit parts', () => {
      const duration = new Duration(1 * 3600000 + 3 * 60000 + 3 * 1000 + 1);
      expect(duration.toString()).toBe('1:03:03.001');
    });

    it('should handle double digit parts', () => {
      const duration = new Duration(
        10 * 3600000 + 30 * 60000 + 30 * 1000 + 500
      );
      expect(duration.toString()).toBe('10:30:30.500');
    });
  });

  describe('from()', () => {
    it('should construct a new Duration with the given fields', () => {
      const duration = Duration.from(11, 12, 13, 14);
      expect(duration.milliseconds).toBe(14);
      expect(duration.seconds).toBe(13);
      expect(duration.minutes).toBe(12);
      expect(duration.hours).toBe(11);
      expect(duration.totalMilliseconds).toBe(
        11 * 3600000 + 12 * 60000 + 13 * 1000 + 14
      );
    });
  });
});
