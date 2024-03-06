import { Telegram } from "puregram";
import callbacks from "./callbacks";

export const setCallbackListener = (telegram: Telegram): void =>
  callbacks.setListeners(telegram);
