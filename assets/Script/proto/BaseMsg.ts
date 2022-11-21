



/**
* @Author: ZZ
* @Date: Created in 14:55 2017/10/16
* @Description: 所有消息的基本定义
* @Modified By:
*/

export class BaseMsg {
}

export enum MSG_MID {   // 主协议号
	MID_DSS,
	MID_BS,
	MID_SrvsMsg,        // 服务器内部消息
	
	MID_Account,        // 账号相关协议
	MID_LobbyMsg,       // 大厅相关协议
	MID_TableMsg,       // 牌桌相关协议（入座者的相关协议，以入座后的消息为准）
	MID_TableExMsg,     // 牌桌外围功能相关协议（旁观者的协议，消息体内带牌桌或牌桌服编号）
	
	MID_GateTable,      // 测试网关牌桌消息
	MID_OtherMsg,
	MID_MAX
}

//    public static class BaseIDMsg implements Serializable {
//        public int mid;
//        public int sid;
//    }

// 所有消息的基类
export class BaseIDMsg {
	public mid: number;     // 主协议号
	public sid: number;     // 次协议号
	public constructor(mid:number,sid:number) { this.mid = mid;this.sid = sid; }
}

// 服务器用协议基类
export class BaseBSMsg extends BaseIDMsg{
	public srvType: number;
	public srvID: number;
}

// 牌桌服扩展消息的基类
export class BaseTabExMsg extends BaseIDMsg{
	public   tid: string;             // 牌桌ID
}

//////////////////////////////

//    public static class BaseMsgData {
//        //        public MSG_MID id;
//        public int      mid;
//        public int      sid;
//        public String   Json;
//    }


