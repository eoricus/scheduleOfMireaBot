import { VEvent } from "node-ical";
import { InlineKeyboard } from "puregram";
import { DateMaster } from "../dateMaster";
import changeDate from "@/listeners/callbacks/callbackChangeDate";
import { TelegramInlineKeyboardButton } from "puregram/generated";

type EventList = Record<string, TelegramInlineKeyboardButton>;

/**
 * Reduce it to function
 */
export class CalendarMarkup<E extends VEvent> {
  private events: EventList = {};

  private tDate: DateMaster;
  private calHash: string;

  constructor(tDate: DateMaster, calHash: string) {
    this.tDate = tDate;
    this.calHash = calHash;
  }

  /**
   * List of buttons
   *
   * @returns {TelegramInlineKeyboardButton[]}
   */
  get buttons(): TelegramInlineKeyboardButton[] {
    if (Object.keys(this.events).length === 0) {
      this.addEvent(0, "На сегодня нет пар! :-)");
      return this.buttons;
    }

    const sortedEventKeys = Object.keys(this.events).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    const sortedEvents = sortedEventKeys.reduce<EventList>((acc, key) => {
      acc[key] = this.events[key];
      return acc;
    }, {});

    return Object.values(sortedEvents);
  }

  /**
   * Inline keyboard for calendar events
   *
   * @returns {InlineKeyboard} — keyboard with buttons representing events
   */
  get keyboard(): InlineKeyboard {
    return InlineKeyboard.keyboard([
      ...this.buttons,
      changeDate.buttonGetter({
        tDate: this.tDate,
        calHash: this.calHash,
      }),
    ]);
  }

  /**
   * Adds text buttons to the calendar,
   * with event data
   *
   * @param {number} date — event date in the number format
   * @param text — event name
   * @param payload — payload for button
   * @returns {number} — count of buttons
   */
  addEvent = (date: number = 0, text?: string, payload?: string): number => {
    if (this.events[date]) {
      return this.addEvent(date + 1, text, payload);
    }

    this.events[date] = InlineKeyboard.textButton({
      text: text || "Безымянное событие",
      payload: payload || "null",
    });

    return Object.keys(this.events).length;
  };

  /**
   * Goes through all the events in the event list,
   * and adds the relevant ones
   *
   * @param {Array<E>} cal — list of events
   */
  addCalendar = (cal: Array<E>): void => {
    cal.forEach((e: E) => {
      if (e.end && this.tDate.isBetween(e.end)) {
        this.addEvent(e.start.getTime(), e.summary);
      }
      e.rrule?.between(...this.tDate.fullDay).forEach((occurrence) => {
        this.addEvent(e.start.getTime(), e.summary);
      });
    });
  };
}
