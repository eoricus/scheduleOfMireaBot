export class DateMaster {
  date: Date;

  constructor(date?: Date | string | number) {
    if (date) {
      this.date = new Date(date);
    } else {
      this.date = new Date();
    }

    this.date.setHours(0, 0, 0, 0);
  }

  get fullDay(): [Date, Date] {
    return [this.yesterday, new Date(this.yesterday.getTime() + 86400000)];
  }

  get today(): Date {
    return this.date;
  }

  get yesterday(): Date {
    return new Date(this.date.getTime() - 86400000);
  }

  get tomorrow(): Date {
    return new Date(this.date.getTime() + 86400000);
  }

  isBetween(date: Date): boolean {
    const startOfDay = this.date;
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = this.date;
    endOfDay.setHours(23, 59, 59, 999);

    return (
      date.getTime() >= startOfDay.getTime() &&
      date.getTime() <= endOfDay.getTime()
    );
  }

  isCurrentDate() {
    return (
      this.date.getDate() === new Date().getDate() &&
      this.date.getMonth() === new Date().getMonth() &&
      this.date.getFullYear() === new Date().getFullYear()
    );
  }

  static getDayOfWeek(date: Date) {
    return ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][
      date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1
    ];
  }

  static currentDay() {
    return new DateMaster();
  }
}
