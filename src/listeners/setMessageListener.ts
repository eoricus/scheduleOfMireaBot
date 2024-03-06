import { calendarManager } from "@/utils/calendar";
import { HearManager } from "@puregram/hear";
import { InlineKeyboard, MessageContext, Telegram } from "puregram";
import callbackGetGroup from "./callbacks/callbackGetGroup";
import scheduleOfMirea from "@/utils/scheduleOfMirea";

export const setMessageListener = (telegram: Telegram): void => {
  const manager = new HearManager<MessageContext>();

  manager.hear("/start", (ctx: MessageContext) => {
    ctx.reply(
      "📚 Привет! Я бот для получения расписания!\n\nПросто введи название группы, или выбери из последних:",
      {
        reply_markup: InlineKeyboard.keyboard([]),
      }
    );
  });

  manager.hear("/help", (ctx: MessageContext) => {
    ctx.reply("Hello, I'm here to help you!");
  });

  manager.hear("/info", (ctx: MessageContext) => {
    ctx.reply("Hello, I'm here to help you!");
  });

  manager.hear(
    /^\/?[А-ЯЁа-яё]{4}-?\d{2}-?\d{2}/i,
    async (ctx: MessageContext) => {
      const matchGroupName = ctx.text?.match(
        /^\/?([А-ЯЁа-яё]{4})-?(\d{2})-?(\d{2})/i
      );

      if (!matchGroupName || matchGroupName.length < 3) {
        return ctx.reply(`Я не понял название группы ${ctx.text} ;(`);
      }

      const normalizedGroupName = matchGroupName.splice(1, 4).join("-");

      const group = await scheduleOfMirea.getGroupSchedule(
        normalizedGroupName,
        ctx.chatId
      );

      if (!group) {
        return ctx.reply(
          `Я не нашел группы с названием ${normalizedGroupName} ;(`
        );
      }

      return ctx.reply(
        `Календарь ${group.calTitle || ""} на ${new Date()
          .toLocaleString("ru")
          .slice(0, 10)}`,
        {
          reply_markup: group.getViewFor(),
        }
      );
    }
  );

  telegram.updates.on("message", manager.middleware);
};
