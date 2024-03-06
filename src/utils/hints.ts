import { Telegram } from "puregram";
import { TelegramBotCommand } from "puregram/generated";

export const hints: Array<TelegramBotCommand> = [
  {
    command: "/start",
    description: "Начальная страница",
  },
  {
    command: "/ivbo0121",
    description: "Название учебной группы",
  },

  {
    command: "/help",
    description: "Информация о боте",
  },
  {
    command: "/help",
    description: "Жалобы и предложения",
  },
];

/**
 * TO-DO
 * @param telegram
 */
export const setHints = (telegram: Telegram): Promise<true> => {
  return telegram.api.setMyCommands({
    commands: hints,
  });
};
