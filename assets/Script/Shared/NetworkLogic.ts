import { Global } from "./GloBal";
import MessageCallback from "./MessageCallback";
import NetworkManager from "./NetworkManager";

export default class NetworkLogic{
    private static _ins: NetworkLogic;
    public static get ins() {
        return this._ins || (this._ins = new NetworkLogic());
    }
    
    /**是否手动关闭连接*/
    public isManualCloseServerConnection = false;

    public init() {
        this.isManualCloseServerConnection = false;
        Global.Utils.debugOutput("NetworkLogic ==> inint ==> 添加事件监听")
        /// 添加事件监听
        MessageCallback.ins.addListener('ServerDisconnection', this);
        MessageCallback.ins.addListener('ServerMessagePush', this);
        MessageCallback.ins.addListener('PopDialogContentPush', this);
        /// 服务器推送消息监听
        // 监听断开信息
        NetworkManager.ins.addReceiveListen('close', 'ServerDisconnection');
        // 推送消息
        NetworkManager.ins.addReceiveListen('ServerMessagePush', 'ServerMessagePush');
    };
    public deInit() {
        /// 添加事件监听
        MessageCallback.ins.removeListener('ServerDisconnection', this);
        MessageCallback.ins.removeListener('ServerMessagePush', this);
        MessageCallback.ins.removeListener('PopDialogContentPush', this);
    };

    public connectToServer(host, port, cb) {
        NetworkManager.ins.init({
            host: host,
            port: port
        }, cb);
    };

}