import { Telegram } from "puregram";
import Inline from "./inline";

export const setInlineListener = (telegram: Telegram): void => {
  telegram.updates.on("inline_query", Inline.listener);
};
