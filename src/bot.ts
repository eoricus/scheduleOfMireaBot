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
  const initBot = (token: string) => {
    const telegram: Telegram = Telegram.fromToken(token);

    telegram.updates.stopPolling();

    telegram.updates
      .startPolling()
      .then(() => {
        telegram.updates.dropPendingUpdates().then((count) => {
          console.info(`@${telegram.bot.username} Dropped ${count} updates`);
        });

        setHints(telegram).then(() => {
          console.info(`@${telegram.bot.username} Set hints`);
        });

        setListeners(telegram).then(() => {
          console.info(`@${telegram.bot.username} Set listeners`);
        });

        console.log(`@${telegram.bot.username} Started`);
      })
      .catch((error) => {
        console.error(error);
      });
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
