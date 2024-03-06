import { calendarManager } from "@/utils/calendar";
import scheduleOfMirea from "@/utils/scheduleOfMirea";
import { InlineQueryContext } from "puregram";
import {
  ReplyMarkupUnion,
  TelegramInlineQueryResultArticle,
} from "puregram/generated";

export namespace Inline {
  /**
   * Utils for inline queries
   */
  export namespace utils {
    /**
     * Create article
     *
     * @param {string} title — article title
     * @param {string} text — article text
     * @param {ReplyMarkupUnion} reply_markup — article keyboard
     * @returns {TelegramInlineQueryResultArticle} — return article from args
     */
    export const getArticle = (
      title: string,
      text?: string,
      reply_markup?: ReplyMarkupUnion
    ): TelegramInlineQueryResultArticle => {
      return {
        type: "article",
        id: Math.random()
          .toString(36)
          .substring(2, 8 + 2),
        title: title,
        input_message_content: {
          message_text: text,
        } as TelegramInlineQueryResultArticle["input_message_content"],
        reply_markup: reply_markup,
      };
    };
  }

  /**
   * Listener for inline queries
   *
   * @param {InlineQueryContext} ctx — query context
   */
  export const listener = async (ctx: InlineQueryContext) => {
    const query: string = ctx.query.slice(1).trim();

    if (query.length == 0) {
      return ctx.answerInlineQuery([
        utils.getArticle("📚 Укажите группу или преподавателя"),
      ]);
    }

    const matchedGroups = await scheduleOfMirea.search(query);

    if (matchedGroups.length == 0) {
      return ctx.answerInlineQuery([
        utils.getArticle(
          `📚 Я не нашел групп/преподавателей/аудитории по запросу ${query}`
        ),
      ]);
    }

    const content = [];
    for (let group of matchedGroups) {
      const groupCal = await calendarManager.setNewCalendar(
        group.iCalLink,
        group.fullTitle,
        0
      );

      content.push(
        utils.getArticle(
          group.fullTitle,
          `Календарь ${groupCal.calTitle || ""} на ${new Date()
            .toLocaleString("ru")
            .slice(0, 10)}`,
          groupCal.getViewFor()
        )
      );
    }

    return ctx.answerInlineQuery(content);
  };
}
