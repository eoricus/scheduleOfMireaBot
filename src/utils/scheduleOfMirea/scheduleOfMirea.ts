import { VEvent } from "node-ical";
import { CalendarView, calendarManager } from "../calendar";

export interface ScheduleData {
  id: number;
  targetTitle: string;
  fullTitle: string;
  scheduleTarget: number;
  iCalLink: string;
  scheduleImageLink: string;
  scheduleUpdateImageLink: string;
}

export interface ApiResponse {
  data: ScheduleData[];
  nextPageToken: null | string;
}

export interface AcademicEvent extends VEvent {
  categories: string;
}

namespace scheduleOfMirea {
  // TO-DO: output a link to the configuration
  export const base = "https://schedule-of.mirea.ru/schedule/api";

  /**
   * Search for groups with a matching name
   *
   * @param {string} match — search query
   * @returns {Promise<ScheduleData[]>} — array of matching groups
   */
  export const search = async (
    match: string,
    limit: number = 7
  ): Promise<ScheduleData[]> => {
    if (match.length == 0) {
      return [];
    }

    // TO-DO: fix the request assembly
    const url = base + `/search?limit=${limit}&match=${match}`;

    const response = await fetch(url);

    return (await response.json()).data;
  };

  /**
   * Finds the schedule for a group with a matching name
   *
   * @param {string} match — search query
   * @returns {Promise<CalendarView<AcademicEvent> | undefined>} — calendar view, if group matched
   */
  export const getGroupSchedule = async (
    match: string,
    userId: number
  ): Promise<CalendarView<AcademicEvent> | undefined> => {
    const matchedGroups = await search(match);

    if (matchedGroups.length == 0) {
      return undefined;
    }

    if (matchedGroups.length != 1) {
      console.log(
        `Found ${
          matchedGroups.length
        } groups with name ${match}:\n\n${JSON.stringify(matchedGroups)}`
      );
    }

    return calendarManager.setNewCalendar<AcademicEvent>(
      matchedGroups[0].iCalLink,
      match
    );
  };
}

export default scheduleOfMirea;
