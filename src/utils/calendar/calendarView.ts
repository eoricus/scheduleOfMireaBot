import { CalendarComponent, VEvent, fromURL } from "node-ical";
import { InlineKeyboard } from "puregram";
import { DateMaster } from "../dateMaster";
import { CalendarMarkup } from "./calendarMarkup";
import genHash from "../genHash";

export class CalendarView<T extends VEvent> {
  private calendar: Array<T>;

  /**
   * Calendar owner id
   *
   * Is 0 for MIREA group calendars
   */
  public authorId: number = 0;

  /**
   * Calendar URL for dynamic update
   */
  public calURL: string;

  /**
   * Custom title for calendar
   */
  public calTitle?: string;

  /**
   * Date of last update
   */
  public lastUpdate: Date = new Date();

  /**
   * Hash from authorId and calURL
   */
  get calHash() {
    return genHash(this.authorId, this.calURL);
  }

  constructor(
    cal: Array<T>,
    calURL: string,
    calTitle?: string,
    authorId: number = 0
  ) {
    this.calendar = cal.filter(
      (event) =>
        new Date(event.end).getTime() > new Date().getTime() - 86400000 * 30
    );
    this.calURL = calURL;
    this.calTitle = calTitle;
    this.authorId = authorId;
  }

  /**
   * Inline keyboard for calendar events
   *
   * @param {string} date — date in the string format YYYYY-MM-DD
   * @returns {InlineKeyboard} — keyboard with buttons representing events
   */
  getViewFor(date?: string): InlineKeyboard {
    const tDate = new DateMaster(date);
    const calMarkup = new CalendarMarkup<T>(tDate, this.calHash);

    calMarkup.addCalendar(this.calendar);

    return calMarkup.keyboard;
  }

  /**
   * Create calendar from URL
   *
   * @param {string} calURL — URL of calendar
   * @returns
   */
  static async fromURL<T extends VEvent>(
    calURL: string,
    calTitle: string,
    authorId: number = 0
  ) {
    const icsFromURL = await fromURL(calURL);

    const rawCal = Object.values(icsFromURL) as Array<T>;

    return new CalendarView<T>(
      rawCal,
      calURL,
      calTitle ||
        (icsFromURL.vcalendar
          ? // @ts-ignore
            icsFromURL.vcalendar["WR-CALNAME"]
          : undefined),
      authorId
    );
  }

  // TO-DO
  public static fromICS() {}

  // TO-DO
  public static fromFile() {}
}
