//import { Global } from "./Global";


import { Global } from "./GloBal";
import MessageCallback from "./MessageCallback";

export default class NetworkManager {
    private static _ins: NetworkManager;
    public static get ins() {
        return this._ins || (this._ins = new NetworkManager());
    }
    public pomelo;
    constructor() {
        this.pomelo = window["pomelo"];
    }
    init(params, cb) {
        this.pomelo.init({
            host: params.host,
            port: params.port,
            log: true
        }, cb);
    };

    disconnect() {
        this.pomelo.disconnect();
    };

    send(route, msg, cbRoute = null, cbFail = null) {
        
    };

    notify(route, msg) {
        console.log('Notify:' + route);
        console.log(msg);
        this.pomelo.notify(route, msg);
    };

    addReceiveListen(route, cbRoute) {
        cbRoute = cbRoute || route;
        let pushCallback = (msg) => {
            if (!!cbRoute) {
                console.log('push:' + cbRoute);
                console.log(msg);
                MessageCallback.ins.emitMessage(cbRoute, msg);
            }
        };
        this.pomelo.on(route, pushCallback);
        return pushCallback;
    };

    removeListener(route, callback) {
        this.pomelo.removeListener(route, callback);
    };

    removeAllListeners() {
        
        Global.Utils.debugOutput("NetworkLogic ==> removeAllListeners ==> 移除事件监听"+this.pomelo)
        if(this.pomelo){
            this.pomelo.removeAllListeners();
        }
    };
}