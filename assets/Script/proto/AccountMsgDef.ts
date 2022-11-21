

/**
* Created by admin on 2022/5/23.
*/
export class AccountMsgDef {
}

export enum AccountErrCode{
	eOK,
	eNameError,         // 注册名不合法
	eNameRepeat,        // 重复注册
	eAccountNot,        // 账号不存在
	ePassError,         // 密码错误
	eNotSrvID,          // 服务器未启动
	eMax
}


