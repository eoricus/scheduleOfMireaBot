import { InlineKeyboard } from "puregram";
import callbacks from "./callback";
import scheduleOfMirea from "@/utils/scheduleOfMirea";
import { text } from "stream/consumers";

interface IGetGroup {
  // TO-DO: regex check
  group: string;
}

interface IGetGroupKeyboard {
  group?: string;
  groups?: string[];
}

const callbackGetGroup = callbacks.addCallback<IGetGroup, IGetGroupKeyboard>(
  "getGroup"
);

callbackGetGroup.payload.string("group");

// TO-DO: add recent groups
callbackGetGroup.buttonGetter = () => {
  return [
    InlineKeyboard.textButton({
      text: "ИВБО-01-21",
      payload: callbackGetGroup.payload.pack({
        group: "ИВБО-01-21",
      }),
    }),
    InlineKeyboard.textButton({
      text: "ИВБО-01-22",
      payload: callbackGetGroup.payload.pack({
        group: "ИВБО-01-22",
      }),
    }),
    InlineKeyboard.textButton({
      text: "ИВБО-06-21",
      payload: callbackGetGroup.payload.pack({
        group: "ИВБО-06-21",
      }),
    }),
  ];
};

callbackGetGroup.handler = async (ctx) => {
  const payload = ctx.unpackedPayload;

  if (!payload) return;

  const groupCal = await scheduleOfMirea.getGroupSchedule(
    payload.group,
    ctx.senderId
  );

  if (!groupCal) {
    return;
  }

  ctx.telegram.api.sendMessage({
    text: `Календарь группы ${groupCal.calTitle || ""} на ${new Date()
      .toLocaleString("ru")
      .slice(0, 10)}`,
    reply_markup: groupCal.getViewFor(),
    chat_id: ctx.senderId,
  });
};

export default callbackGetGroup;
