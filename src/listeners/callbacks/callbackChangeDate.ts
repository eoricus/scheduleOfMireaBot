import { DateMaster } from "@/utils/dateMaster";
import { InlineKeyboard, Telegram } from "puregram";
import { calendarManager } from "@/utils/calendar";
import callbacks from "./callback";
import callbackNull from "./callbackNull";
import genHash from "@/utils/genHash";

interface IChangeDateCallbackData {
  date?: string;
  calHash: string;
}

interface IChangeDateButtonGetterArgs {
  tDate: DateMaster;
  calHash: string;
}

const callbackChangeDate = callbacks.addCallback<
  IChangeDateCallbackData,
  IChangeDateButtonGetterArgs
>("changeDate");

callbackChangeDate.payload.string("date", { optional: true }).string("calHash");

callbackChangeDate.buttonGetter = ({ tDate, calHash }) => {
  return [
    InlineKeyboard.textButton({
      text: DateMaster.getDayOfWeek(tDate.yesterday) + "  ⬅️",
      payload: callbackChangeDate.payload.pack({
        date: tDate.yesterday.toISOString(),
        calHash: calHash,
      }),
    }),
    InlineKeyboard.textButton({
      text: DateMaster.getDayOfWeek(tDate.today),
      payload: tDate.isCurrentDate()
        ? callbackNull.payload.pack({ isNull: true })
        : callbackChangeDate.payload.pack({
            date: DateMaster.currentDay().today.toISOString(),
            calHash: calHash,
          }),
    }),
    InlineKeyboard.textButton({
      text: "➡️  " + DateMaster.getDayOfWeek(tDate.tomorrow),
      payload: callbackChangeDate.payload.pack({
        date: tDate.tomorrow.toISOString(),
        calHash: calHash,
      }),
    }),
  ];
};

// TO-DO
callbackChangeDate.handler = async (ctx) => {
  // console.log(ctx);
  const payload = ctx.unpackedPayload;

  // console.log(payload.calHash);
  // console.log(Object.keys(calendarManager.calendars));
  // console.log(calendarManager.calendars);
  if (payload?.date) {
    const calendar = await calendarManager.getCalendarView(payload.calHash);

    if (!calendar) {
      return;
    }

    if (ctx.inlineMessageId) {
      return ctx.telegram.api.editMessageText({
        inline_message_id: ctx.inlineMessageId,
        text: `Календарь группы ${calendar.calTitle || ""} на ${new Date(
          payload.date
        )
          .toLocaleString("ru")
          .slice(0, 10)}`,
        reply_markup: calendar.getViewFor(payload.date),
      });
    } else {
      ctx.message?.editMessageText(
        `Календарь группы ${calendar.calTitle || ""} на ${new Date(payload.date)
          .toLocaleString("ru")
          .slice(0, 10)}`,
        {
          reply_markup: calendar.getViewFor(payload.date),
        }
      );
    }
  } else {
    // TODO
  }
};

export default callbackChangeDate;
