import { CallbackDataBuilder, CallbackLayer } from "@puregram/callback-data";
import {
  Middleware,
  CallbackQueryContext,
  Context,
  Telegram,
  InlineKeyboard,
} from "puregram";
import { TelegramInlineKeyboardButton } from "puregram/generated";

type IButtonGetter<K> = (params: K) => TelegramInlineKeyboardButton[];

class Callback<
  ICallbackData extends Record<string, any>,
  IButtonGetterArgs extends Record<string, any>
> {
  public payload: CallbackDataBuilder<ICallbackData>;

  private _buttons?: IButtonGetter<IButtonGetterArgs>;
  private _handler?: Middleware<Context>;

  constructor(slug: string) {
    this.payload = new CallbackDataBuilder<ICallbackData>(slug);
  }

  set handler(
    fn: Middleware<CallbackQueryContext & CallbackLayer<ICallbackData>>
  ) {
    this._handler = this.payload.handle(fn);
  }

  set buttonGetter(fn: IButtonGetter<IButtonGetterArgs>) {
    this._buttons = fn;
  }

  get handler(): Middleware<Context> | undefined {
    return this._handler;
  }

  get buttonGetter(): IButtonGetter<IButtonGetterArgs> {
    return this._buttons || (() => []);
  }

  get keyboardGetter() {
    return (args: IButtonGetterArgs) => {
      return InlineKeyboard.keyboard(this.buttonGetter(args));
    };
  }
}

class Callbacks {
  private callbacks: Array<Callback<any, any>> = [];

  addCallback = <
    ICallbackData extends Record<string, any>,
    IButtonGetterArgs extends Record<any, any> = Record<any, any>
  >(
    slug: string
  ): Callback<ICallbackData, IButtonGetterArgs> => {
    const newCallback = new Callback<ICallbackData, IButtonGetterArgs>(slug);

    return this.callbacks.push(newCallback), newCallback;
  };

  setListeners = (telegram: Telegram): void => {
    this.callbacks.forEach((callback) => {
      if (callback.handler) {
        telegram.updates.use(callback.handler);
      }
    });
  };
}

const callbacks = new Callbacks();

export default callbacks;
