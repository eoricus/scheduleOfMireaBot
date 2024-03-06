// TO-DO: change logger
import { Color, Logger } from "@starkow/logger";
import bot from "./bot";

bot().catch(() => console.log("error!", Color.Red));
