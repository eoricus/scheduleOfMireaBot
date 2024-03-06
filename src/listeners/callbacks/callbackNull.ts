import callbacks from "./callback";

interface INullPayload {
  isNull: true;
}

const callbackNull = callbacks.addCallback<INullPayload>("Null");

callbackNull.payload.boolean("isNull");

callbackNull.handler = async (ctx) => {
  return;
};

export default callbackNull;
