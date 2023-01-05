/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-24 17:19:21
 * @FilePath: \MajiongJiuYu\assets\Script\proto\AccountMsg.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BaseMsg, BaseIDMsg, MSG_MID } from "./BaseMsg";


/**
* Created by admin on 2022/5/23.
*/
export class AccountMsg extends BaseMsg{
}

export enum ACCMSG_SID {
	SC_AccErrRlst,                  // 返回执行错误
	CS_RegistAcc,                       // 注册账号
	CS_LoginAcc,                        // 账号登陆
	SC_TokenInfo,                   // 返回登录信息
	CS_SelSrvID,                        // 选择服务器 - 在测试期间用于登陆之前选择索要进入的服务器
	
	CS_ReOnline,                        // 断开连接后及时重连消息，超过一定时间（暂定2分钟）只有走重新登陆
	SC_ReOnlineOK,                  // 重连成功，
	
	MSG_MAX
}

export class Msg_SC_AccErrRlst extends BaseIDMsg{
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.SC_AccErrRlst ); }
	
	public      errCode: number;    // 返回错误信息枚举（AccountMsgDef.AccountErrCode）
	public   strMsg: string;     // 保留做非枚举里面的扩展信息
}

export class Msg_CS_RegistAcc extends BaseIDMsg{
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.CS_RegistAcc ); }
	public   plat: string;                       // 渠道来源
	public   account: string;                    // 帐号名
	public   md5Pass: string;                    // 密码MD5码
}

export class Msg_CS_LoginAcc extends BaseIDMsg{
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.CS_LoginAcc ); }
	public   plat: string;                       // 渠道来源
	public   account: string;                    // 帐号名
	public   md5Pass: string;                    // 密码MD5码
}

export class Msg_SC_TokenInfo extends BaseIDMsg{
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.SC_TokenInfo ); }
	public      gpid: number;                       // 玩家此次连接唯一ID，断线重连时带入
	public      aid: number;                        // 账号唯一ID
	public   account: string;                    // 帐号名（暂时无用）
	public   token: string;                      // token 如果转接大厅省略，也需要保留作为断线重连后的验证码
}

export class Msg_CS_SelSrvID extends BaseIDMsg{
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.CS_SelSrvID ); }
	public      accSrvID: number;                   // 选择的帐号服编号
	public      lobSrvID: number;                   // 选择的大厅服编号
}

//断开连接后及时重连消息，超过一定时间（暂定2分钟）只有走重新登陆
export class Msg_CS_ReOnline extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.CS_ReOnline ); }
	public      gpid: number;               // 断开以前的gpid
	public   token: string;              // 上次登录成功返回的token
}

//重连成功
export class Msg_SC_ReOnlineOK extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_Account,  ACCMSG_SID.SC_ReOnlineOK ); }
	public      gpid: number;               // 以后的gpid，实际还是原有的
}


