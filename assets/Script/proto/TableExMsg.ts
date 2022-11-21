import { BaseMsg, BaseTabExMsg, MSG_MID } from "./BaseMsg";


/**
* Created by admin on 2022/5/30.
*/
export class TableExMsg extends BaseMsg{
}

export enum TabExMSG_SID {
	CS_TGMMsg,                          // 测试-发到牌桌服GM指令
	CS_GGMMsg,                          // 测试-发到网关GM指令
	CS_LeaveExRoom,                     // 离开房间
	
	MSG_MAX
}

// 测试-发到牌桌服GM指令
export class Msg_CS_TGMMsg extends BaseTabExMsg {
	public constructor() { super( MSG_MID.MID_TableExMsg,  TabExMSG_SID.CS_TGMMsg ); }
	public   cmd: string;
	public   gmMsg: string;
}

// 测试-发到网关GM指令
export class Msg_CS_GGMMsg extends BaseTabExMsg {
	public constructor() { super( MSG_MID.MID_TableExMsg,  TabExMSG_SID.CS_GGMMsg ); }
	public   cmd: string;
	public   gmMsg: string;
}

//离开房间
export class Msg_CS_LeaveExRoom extends BaseTabExMsg {
	public constructor() { super( MSG_MID.MID_TableExMsg,  TabExMSG_SID.CS_LeaveExRoom ); }
}


