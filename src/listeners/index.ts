import { Telegram } from "puregram";
import { setMessageListener } from "./setMessageListener";
import { setCallbackListener } from "./setCallbackListener";
import { setInlineListener } from "./setInlineListener";

export const setListeners = async (telegram: Telegram) => {
  setMessageListener(telegram);

  setCallbackListener(telegram);

  setInlineListener(telegram);
};
