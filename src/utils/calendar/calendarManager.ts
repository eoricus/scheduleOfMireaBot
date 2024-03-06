import { VEvent } from "node-ical";
import { CalendarView } from "./calendarView";

import genHash from "@utils/genHash";

class CalendarManager {
  public calendars: Record<string, CalendarView<any>> = {};

  async setNewCalendar<T extends VEvent>(
    calURL: string,
    calTitle: string,
    authorId: number = 0
  ): Promise<CalendarView<T>> {
    const calHash = genHash(authorId, calURL);

    this.calendars[calHash] = await CalendarView.fromURL<T>(
      calURL,
      calTitle,
      authorId
    );

    return this.calendars[calHash];
  }

  async getCalendarView(calHash: string): Promise<CalendarView<any> | null> {
    return this.calendars[calHash] || null;
  }
}

export const calendarManager = new CalendarManager();
