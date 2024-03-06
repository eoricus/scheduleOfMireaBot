import callbacks from "./callback";

interface INullPayload {
  isNull: true;
}

const callbackNull = callbacks.addCallback<INullPayload>("Null");

callbackNull.payload.boolean("isNull");

callbackNull.handler = async (ctx) => {
  return ctx.answerCallbackQuery({
    text: "Информация по предметам пока в разработке ;)",
  });
};

export default callbackNull;
