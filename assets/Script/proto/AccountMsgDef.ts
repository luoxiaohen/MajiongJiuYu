

/**
* Created by admin on 2022/5/23.
*/
export class AccountMsgDef {
}

export enum AccountErrCode{
	eOK,
	eNameError,         // 1注册名不合法
	eNameRepeat,        // 2重复注册
	eAccountNot,        // 3账号不存在
	ePassError,         // 4密码错误
	eNotSrvID,          // 5服务器未启动
	eRepeqtLogin,       // 6重复登陆或注册，登陆成功后的非法消息
	eNotLogin,          // 7尚未登陆，需要登陆后才能操作
	eErrorGPID,         // 8错误的GPID，重新连接后找不到之前的连接
	eErrorToken,        // 9错误的Token，重新连接后递交的Token错误
	eOnlineOver,        // 10重连超时，请重新登录
	eErrBadAccName,     // 11账号出现脏字或非法字符
	eMax
}


