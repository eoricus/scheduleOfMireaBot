import { Color, Logger } from "@starkow/logger";
import { Telegram } from "puregram";

import { Env } from "./env";
import { setListeners } from "./listeners";
import { setHints } from "./utils/hints";

export default async () => {
  /**
   * Bot initialization
   *
   * @param token — bot token
   */
  const initBot = async (token: string) => {
    const telegram: Telegram = Telegram.fromToken(token);

    try {
      telegram.updates.stopPolling();

      await telegram.updates.startPolling();

      /**
       * TO-DO add collecting statistics
       */
      await telegram.updates.dropPendingUpdates();

      setHints(telegram);
      console.info(`@${telegram.bot.username} 1/3 Set hints`);

      setListeners(telegram);
      console.info(`@${telegram.bot.username} 2/3 Set listeners`);

      console.log(`@${telegram.bot.username} 3/3 Started`);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * TO-DO
   *
   * @param token
   * @returns
   */
  const initLogger = (token: string): Telegram => {
    return Telegram.fromToken(token);
  };

  const init = async () => {
    initBot(Env.TOKEN);
  };

  return await init();
};
