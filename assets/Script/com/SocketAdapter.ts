import { Global } from "../Shared/GloBal";
import { ISocketAgent } from "./socket/ISocketAgent";
import { Socket } from "./socket/Socket";
import { SocketManager } from "./socket/SocketManager";


/**
* socket服务器适配器
*/
export class SocketAdapter implements ISocketAgent {
    type: string;
    private mSocket: Socket;
    private mPU:any;
    /**
     * 初始化
     */
    onInit(_socket: Socket) {
        this.mSocket = _socket;
        // this.mPU = window["pu"];
        // this.mPU.crypto = window["CryptoJS"];
    }
    /**
     * 发生错误时
     */
    onError(_msg: string) {
        console.log("connect fail" + _msg);
        //nk.Toast.show("连接失败"+_msg);
    }
    /**
     * 连接关闭
     */
    onClose() {
        console.log("connect close");
        //nk.Toast.show("连接关闭")
    }
    /**
     * 连接成功
     * _isReconnect 是否是重连状态
     */
    onConnected(_isReconnect: boolean) {
        console.log("connected _isReconnect  " + _isReconnect);
    }

    /**
     * 接收到数据
     */
    onData(msg: any) {
        var sid:number = 0;
		var mid:number = 0;
		try {
			// msg = this.readUTF();
			var cCMD: string = msg.charAt(0);
			if (cCMD == "{") {
				var s = JSON.parse(msg);
				mid = s.mid;
				sid = s.sid;
				if (false == this.DoMsg((s.mid<<16)+s.sid, msg)) {
				}
			}
			else if (cCMD == "P") {
				var subMsg: string = msg.substring(1, msg.length);
			}
		} catch (e) {	
			let errMsg = e.message;
			let errStack = e.stack;
			let date = new Date();
			let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			let format = `T_Mahj-异常：\n时间:${dateStr}\n错误信息:${errMsg}\n协议:\n${mid},${sid}\n堆栈:\n${errStack}`;
			console.error(format);
		}
    }
    // 消息分派
	public DoMsg(id: number, str: string): Boolean {
		Global.mgr.socketMgr.notifyReceive(id,str);
		// if(data){
		// 	if (data != null) {
		// 		data.func.call(data.target, str);
		// 		return true;
		// 	}
		// }
		return false;
	}
    /**
     * 打包发送的socket数据 并返回
     */
    onPackageSendData(_data: any): string {
        let _sendData = JSON.stringify(_data);
        Global.Utils.debugOutput(`send: ` + _sendData +  "socket");
        return _sendData;
    }
}

export class FuncMap {
	public id: number;
	public target: any;
	public func: (string) => void;
}