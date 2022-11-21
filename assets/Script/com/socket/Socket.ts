
import { Global } from "../../Shared/GloBal";
import { CallBack } from "../CallBack";
import { ISocketAgent } from "./ISocketAgent";
import { SocketEvent } from "./SocketEvent";

/**
 * socket连接
 */
export class Socket {
	private mSocket: WebSocket;
	private mSocketType: number;
	private mUrl: string;
	private mWssCacertPath:string;
	private mAgent: ISocketAgent;
	private mIsReconnect: boolean;
	private mIsConnected:boolean;
	private mReceiveLib: Object = {};
	public constructor(_type: number, _agent: ISocketAgent) {
		this.mSocketType = _type;
		this.mAgent = _agent;
		this.mAgent.onInit(this);

	}
	private onConnectedHandler(e: Event) {
		Global.Utils.debugOutput("socket ==> 连接成功");
		this.mIsConnected = true;
		this.mAgent.onConnected(this.mIsReconnect);
		let _eventType: string = this.mIsReconnect ? SocketEvent.RECONNECTED : SocketEvent.CONNECTED;
		cc.systemEvent.emit(_eventType,_eventType);
	}
	private onCloseHandler(e: CloseEvent) {
		Global.Utils.debugOutput("socket ==> 连接关闭");
		this.mIsConnected = false;
		this.mAgent.onClose();
		cc.systemEvent.emit(SocketEvent.CLOSE, SocketEvent.CLOSE);
	}
	private onErrorHandler(e: ErrorEvent) {
		Global.Utils.debugOutput("socket ==> 连接错误" + e.message);
		this.mIsConnected = false;
		this.mAgent.onError(e.message);
		cc.systemEvent.emit(SocketEvent.ERROR,SocketEvent.ERROR);
	}
	private onSocketDataHandler(e: MessageEvent) {
		Global.Utils.debugOutput("socket ==> 消息回来" + e.data);
		this.mAgent.onData(e.data);
		cc.systemEvent.emit(SocketEvent.MESSAGE, SocketEvent.MESSAGE,e.data);
	}
	/**[public] 
	 * 发送数据
	 * * ..._datas 
	 */
	public send(..._datas) {
		let _tmpDatas: any = this.mAgent.onPackageSendData.apply(this.mAgent, _datas);
		if (this.connected) {
			if (typeof _tmpDatas != "string") {
				_tmpDatas = JSON.stringify(_tmpDatas);
			}
			this.mSocket.send(_tmpDatas);
		} else {
			cc.log("socket error");
		}
	}
	/**[public] 
	 * 添加通知回调
	 * @param _id 
	 * @param _handler 
	 * @param _target 
	 */
	public addReceiveNotify(_mid: number,_sid:number ,_handler: Function, _target: any, _socketType: number = -1) {
		let _id : number = (_mid<<16)+_sid
		let _receives: CallBack[] = this.mReceiveLib[_id] || [];
		let _count: number = _receives.length;
		for (let i: number = 0; i < _count; i++) {
			if (_receives[i].checkEqual(_handler, _target)) {
				CallBack.unbind(_receives.splice(i, 1)[0]);
				break;
			}
		}
		this.mReceiveLib[_id] = _receives;
		_receives.push(CallBack.bind(_handler, _target));
	}
	/**
	 * 移除某个对象中所有的通知回调
	 * @param _target 
	 */
	public removeReceiveNotify(_target: any) {
		for (let _id in this.mReceiveLib) {
			let _receives: CallBack[] = this.mReceiveLib[_id];
			let _count = _receives.length;
			for (let i: number = 0; i < _count; i++) {
				let _caller = _receives[i];
				if (_caller.equalTarget(_target)) {
					_receives.splice(i, 1);
					CallBack.unbind(_caller);
					_count--; i--;
				}
			}
		}
	}
	/**[public] 
	 * 广播通知
	 * @param _id 
	 * @param _data 
	 */
	public notifyReceive(_id: any, _data: any): boolean {
		let _caller: CallBack[] = this.mReceiveLib[_id];
		if (_caller) {
			_caller.forEach((value) => {
				value.excute(_data);
			});
		}
		return _caller && !_caller.length;
	}
	/**[public] 
	 * 开始连接
	 * @param _url 
	 */
	public startConnect(_url: string,_wssCacertPath:string) {
		this.mIsReconnect = false;
		this.mUrl = _url;
		this.mWssCacertPath = _wssCacertPath;
		this.connectByUrl(_url,_wssCacertPath);
	}
	/**[public] 
	 * 重连
	 */
	public reconnect() {
		this.mIsReconnect = true;
		this.connected || this.connectByUrl(this.mUrl,this.mWssCacertPath);
	}
	public close(){
		if (this.connected) {
			this.mSocket.close();
			this.resetSocketListeners();
		}
	}
	public connectByUrl(_url: string,_wssCacertPath:string) {
		this.mIsConnected = false;
		if( _wssCacertPath ){
			this.mSocket = new WebSocket(_url,[],_wssCacertPath);
		}else{
			this.mSocket = new WebSocket(_url,[]);
		}
		this.mSocket.onopen = this.onConnectedHandler.bind(this);
        this.mSocket.onmessage = this.onSocketDataHandler.bind(this);
        this.mSocket.onclose = this.onCloseHandler.bind(this);
        this.mSocket.onerror = this.onErrorHandler.bind(this);
	}
	public get url(): string {
		return this.mUrl;
	}
	public get socketType(): number {
		return this.mSocketType;
	}
	public get connected(){
		return this.mIsConnected;
	}
	/**[public] 
	 * 销毁当前连接
	 */
	public destory() {
		this.resetSocketListeners();
		this.mAgent = null;
	}
	private resetSocketListeners(){
		if( this.mSocket ){
			this.mSocket.onopen = null;
			this.mSocket.onmessage = null;
			this.mSocket.onclose = null;
			this.mSocket.onerror = null;
		}
		this.mSocket = null;
	}
}