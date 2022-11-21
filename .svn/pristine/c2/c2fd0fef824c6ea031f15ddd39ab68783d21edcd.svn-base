export default class MessageCallback {
    private static _ins: MessageCallback;
    public static get ins() {
        return this._ins || (this._ins = new MessageCallback());
    }
    handlers: any;
    constructor() {
        this.handlers = [];
    }
    addListener(route, handler) {
        let handlers = this.handlers[route] || null;
        if (!!handlers) {
            let isHandlerExist = false;
            for (var i in handlers) {
                if (handlers.hasOwnProperty(i) && (handlers[i] === handler)) {
                    isHandlerExist = true;
                    break;
                }
            }
            if (!isHandlerExist) {
                handlers.push(handler);
            }
        }
        else {
            handlers = [];
            handlers.push(handler);
            this.handlers[route] = handlers;
        }
    };

    removeListener(route, handler) {
        let handlers = this.handlers[route] || null;
        if (!!handlers) {
            for (var i = 0; i < handlers.length; ++i) {
                if (handlers[i] === handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    };

    emitMessage(route, msg=null) {
        let handlers = this.handlers[route] || [];
        if (!!handlers) {
            let handlersTemp = handlers.slice();
            for (var i in handlersTemp) {
                if (handlersTemp.hasOwnProperty(i) && !!handlersTemp[i].messageCallbackHandler && !handlersTemp[i].isDestroy) {
                    handlersTemp[i].messageCallbackHandler(route, msg);
                }
            }
        }
    };
}