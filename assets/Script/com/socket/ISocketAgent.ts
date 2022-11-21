import { Socket } from "./Socket";

/**
	 * 对socket连接的代理 具体解析需放在此类
	 */
export interface ISocketAgent {
	/**
	 * socket类型
	 */
	type: string;
	/**
	 * 初始化
	 */
	onInit(_socket: Socket);
	/**
	 * 发生错误时
	 */
	onError(_msg: string);
	/**
	 * 连接关闭
	 */
	onClose();
	/**
	 * 连接成功
	 * _isReconnect 是否是重连状态
	 */
	onConnected(_isReconnect: boolean);
	/**
	 * 接收到数据
	 */
	onData(_data: any);
	/**
	 * 打包发送的socket数据 并返回
	 */
	onPackageSendData(..._datas): string
}