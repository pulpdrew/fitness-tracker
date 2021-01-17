import { Duration } from './duration';

describe('Duration', () => {
  it('should handle 0 duration', () => {
    const duration = new Duration(0);
    expect(duration.seconds).toBe(0);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  it('should handle sub-minute durations', () => {
    const duration = new Duration(1);
    expect(duration.seconds).toBe(1);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(0);
  });

  it('should handle sub-hour durations', () => {
    const duration = new Duration(90);
    expect(duration.seconds).toBe(30);
    expect(duration.minutes).toBe(1);
    expect(duration.hours).toBe(0);
  });

  it('should handle durations longer than an hour', () => {
    const duration = new Duration(1 * 3600 + 30 * 60 + 30);
    expect(duration.seconds).toBe(30);
    expect(duration.minutes).toBe(30);
    expect(duration.hours).toBe(1);
  });

  it('should hand durations of exactly 1 hour', () => {
    const duration = new Duration(1 * 60 * 60);
    expect(duration.seconds).toBe(0);
    expect(duration.minutes).toBe(0);
    expect(duration.hours).toBe(1);
  });

  describe('toString()', () => {
    it('should handle single digit parts', () => {
      const duration = new Duration(1 * 3600 + 3 * 60 + 3);
      expect(duration.toString()).toBe('1:03:03');
    });

    it('should handle double digit parts', () => {
      const duration = new Duration(10 * 3600 + 30 * 60 + 30);
      expect(duration.toString()).toBe('10:30:30');
    });
  });

  describe('from()', () => {
    it('should construct a new Duration with the given fields', () => {
      const duration = Duration.from(11, 12, 13);
      expect(duration.seconds).toBe(13);
      expect(duration.minutes).toBe(12);
      expect(duration.hours).toBe(11);
    });
  });

  describe('parse()', () => {
    it('should handle empty string', () => {
      const duration = Duration.parse('');
      expect(duration.seconds).toBe(0);
      expect(duration.minutes).toBe(0);
      expect(duration.hours).toBe(0);
    });

    it('should handle duration with only seconds', () => {
      const duration = Duration.parse('10');
      expect(duration.seconds).toBe(10);
      expect(duration.minutes).toBe(0);
      expect(duration.hours).toBe(0);
    });

    it('should handle duration with only seconds and minutes', () => {
      const duration = Duration.parse('05:10');
      expect(duration.seconds).toBe(10);
      expect(duration.minutes).toBe(5);
      expect(duration.hours).toBe(0);
    });

    it('should handle duration with hours, minutes, and seconds', () => {
      const duration = Duration.parse('11:12:13');
      expect(duration.seconds).toBe(13);
      expect(duration.minutes).toBe(12);
      expect(duration.hours).toBe(11);
    });

    it('should handle duration single digit parts', () => {
      const duration = Duration.parse('01:02:03');
      expect(duration.seconds).toBe(3);
      expect(duration.minutes).toBe(2);
      expect(duration.hours).toBe(1);
    });
  });
});
