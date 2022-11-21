import { Global } from "../../Shared/GloBal";
import { SocketAdapter } from "../SocketAdapter";
import { ISocketAgent } from "./ISocketAgent";
import { Socket } from "./Socket";

export enum SocketType {
	Default
}

export class SocketManager {
	private mSocketLib: Object = {};
	private mAgenClass: any = null;
	private mUrlSep: string = ":";
	private mTmpHandlerLib: Object = {};
	//ssl证书地址，目前发现如果socket服务器采用亚马逊颁发的证书的话 安卓端会出现连接不上的问题
	//故而 需要在客户端的socket连接处加上证书（https://curl.se/docs/caextract.html 下载相应证书）
	//let _pemUrl =cc.url.raw("resources/cacert.pem");
	//if( cc.loader.md5Pipe ){
	//	_pemUrl = cc.loader.md5Pipe.transformURL(_pemUrl);
	//}
	public wssCacertPath:string = null;
	public constructor() {

	}
	/**[public] 
	 * 配置基本信息
	 * @param _agentClass socket代理类 
	 * @param _urlSep url分隔符通常情况下是冒号
	 */
	public config(_agentClass: any, _urlSep: string = ":") {
		this.mAgenClass = _agentClass;
		this.mUrlSep = _urlSep;
	}
	/**[public] 
	 * 创建socket连接
	 * @param _host 
	 * @param _port 
	 * @param _socketType 
	 */
	public createSocket(_host: string, _port: number, _socketType: number = -1) {
		let _url: string = this.mergeUrl(_host, _port);
		this.createSocketByUrl(_url);
	}
	public createSocketByUrl(_url: string, _socketType: number = -1) {
		_socketType = this.getSocketType(_socketType);
		let _agent: ISocketAgent = new this.mAgenClass();
		this.destorySocket(_socketType);
		let _socket: Socket = new Socket(_socketType, _agent);
		this.addHandlers(_socket);
		_socket.startConnect(_url,this.wssCacertPath);
		this.mSocketLib[_socketType] = _socket;
	}
	private addHandlers(_socket: Socket) {
		let _handlerLib: Object = this.mTmpHandlerLib[_socket.socketType];
		if (_handlerLib) {
			for (let _id in _handlerLib) {
				let _handlerList: any[] = _handlerLib[_id];
				_handlerList.forEach(_handler=>{
					_socket.addReceiveNotify(_handler["mid"],_handler["sid"], _handler["handler"], _handler["target"]);
				});
			}
		}
	}
	public mergeUrl(_host: string, _port: number): string {
		return `${_host}${this.mUrlSep}${_port}`;
	}
	/**[public] 
	 * 获取socket
	 * @param _socketType 
	 */
	public getSocket(_socketType: number = -1): Socket {
		_socketType = this.getSocketType(_socketType);
		return this.mSocketLib[_socketType];
	}
	/**[public] 
	 * 销毁某个socket
	 * @param _socketType 
	 */
	public destorySocket(_socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.destory();
			delete this.mSocketLib[_socket.socketType];
		}
	}
	/**[public] 
	 * 关闭连接
	 * @param _socketType 
	 */
	public closeSocket(_socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.close();
			this.destorySocket(_socketType);
		}
	}
	/**[public] 
	 * 重连
	 * @param _socketType 
	 */
	public reconnect(_socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.reconnect();
		}
	}
	/**[public] 
	 * 是否连接
	 * @param _socketType 
	 */
	public isConnected(_socketType: number = -1): boolean {
		let _socket: Socket = this.getSocket(_socketType);
		return _socket ? _socket.connected : false;
	}
	/**[public] 
	 * 发送
	 * @param _socketType 
	 * * ..._datas 
	 */
	public send(_socketType: number = -1, ..._datas) {
		Global.Utils.debugOutput("SocketManager ==> send msg : ");
		Global.Utils.debugOutput(_datas);
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.send.apply(_socket, _datas);
		}
	}
	/**[public] 
	 * 添加通知回调
	 * @param _id 
	 * @param _handler 
	 * @param _target 
	 * @param _socketType 
	 */
	public addReceiveNotify(_mid: number,_sid:number ,_handler: Function, _target: any, _socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.addReceiveNotify(_mid , _sid, _handler, _target);
		}
		_socketType = this.getSocketType(_socketType);
		let _lib: Object = this.mTmpHandlerLib[_socketType] || {};
		this.mTmpHandlerLib[_socketType] = _lib;
		let _id : number = (_mid<<16)+_sid;
		let _list: any[] = _lib[_id] || [];
		_lib[_id] = _list;
		_list.push({ mid: _mid,sid : _sid, handler: _handler, target: _target });
	}
	public removeReceiveNotify(_target: any, _socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		_socket && _socket.removeReceiveNotify(_target);
	}
	/**[public] 
	 * 广播通知
	 * @param _id 
	 * @param _data 
	 * @param _socketType 
	 */
	public notifyReceive(_id: any, _data: any, _socketType: number = -1) {
		let _socket: Socket = this.getSocket(_socketType);
		if (_socket) {
			_socket.notifyReceive(_id, _data);
		}
	}
	private getSocketType(_socketType: number): number {
		return _socketType == -1 ? SocketType.Default : _socketType;
	}
}