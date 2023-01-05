import { BaseMsg, BaseIDMsg, MSG_MID } from "./BaseMsg";
import { PlayerData, LobbyBaseInfo, TableRuleInfo, TableRuleTempl, MailUnit } from "./LobbyMsgDef";
import { RecordUnit, MonthRecord, MahjTopInfo, MahjPlayerInfo, MahjScoreInfo } from "./MagRecordDef";
import { RcdSummUnit, BaseStepRcd, RcdSummInfo, RcdSummScoreInfo } from "./MahjStepMsgDef";
import { CountType, PlayerBaseCount, PlayerFeeCount, PlayerMaxMajs, PubBaseCount } from "./MsgCountDef";
import { FinalPlayerCalcInfo } from "./TableMsgDef";

/**
* Created by admin on 2022/5/30.
*/
export class LobbyMsg extends BaseMsg{
}

export enum LobMSG_SID {
	SC_LobErrRlst,                  // 0返回执行错误
	CS_GMMsg,                           // 1测试-GM指令
	CS_TokenLogin,                      // 2Token登录  -目前暂时由网关代发送.客户端以后再用
	SC_PlayerInfo,                  // 3玩家信息-表示登陆成功
	SC_LobbyInfo,                   // 4大厅信息-大厅一些基本数据
	CS_CreateTable,                     // 5-个人创建牌桌 返回牌桌入座消息
	CS_EnterRoom,                       // 6进入房间,旁观 - 返回 TableMsg.SC_RoomInfo
	SC_LeaveRoom,                   // 7通知客户端离开房间消息，这是表示离开房间回到大厅的标志消息
	
	// 牌谱相关
	CS_OpenGameRcd,                     // 8打开牌谱记录
	SC_UpdateGameRcd,               // 9刷新牌谱记录
	CS_AddGameRcd,                      // 10增加一条牌谱记录
	SC_NewGameRcd,                  // 11新增一条牌谱
	CS_DelGameRcd,                      // 12删除一条记录
	SC_RemoveGameRcd,               // 13移除一条牌谱记录
	CS_OpenGameStepRcd,                 // 14打开牌谱详细数据
	SC_GameStepRcd,                 // 15牌谱记录详细数据
	CS_OpenGameRcdRslt,                 // 16打开牌局记录的最后结算信息
	SC_GameRcdRslt,                 // 17牌局记录的最后结算信息
	
	// 房间创建模板相关
	CS_ReqGetRoomRuleTemplate,          // 19/**请求获取房间模板*/
	SC_RspGetRoomRuleTemplate,      // 20/**返回房间模板信息*/
	CS_ReqSaveRoomRuleTemplate,         // 21/**请求保存一个房间模板*/  如果是存在的则是修改，不存在的作为新增
	SC_RspSaveRoomRuleTemplate,     // 22/**返回保存房间模板结果*/
	CS_ReqDeletRoomRuleTemplate,        // 23/***请求删除一个房间模板*/
	SC_RspDeletRoomRuleTemplate,    // 24/***返回删除一个房间模板结果*/
	
	// 大厅买马
	CS_LobReqBuyHorse,                  // 25申请买马(返回TableMsg.SC_HorseRoomInfo)
	CS_LobCancelBuyHorse,               // 26取消买马(返回TableMsg.SC_CancelBuyHorse)
	
	// 数据统计
	CS_GetBaseCount,                    // 27获取基础统计数据
	SC_BaseCountData,               // 28返回基础统计数据
	CS_GetFeeCount,                     // 29获取收费统计数据
	SC_FeeCountData,                // 30返回收费统计数据
	SC_MaxScoreMajs,                // 31返回最大收益牌型数据
	CS_GetPubBaseCount,                 // 32获取全服统计数据
	SC_PubBaseCountData,            // 33返回全服统计数据
	
	// 邀请进入房间（再来一局）
	CS_TableInvite,                     // 34主动邀请玩家进入房间
	SC_InviteTable,                 // 35接收邀请进入某个房间
	
	// 战绩信息获取
	CS_GetPlayerRecord,                 // 36获取玩家7日战绩
	SC_PlayerRecord,                // 37玩家7日战绩信息
	CS_GetMonthRecord,                  // 38获取玩家往期战绩
	SC_MonthRecord,                 // 39玩家往期战绩信息
	CS_GetMahjRecord,                   // 40获取牌局详情
	SC_MahjRecord,                  // 41牌局详情
	CS_GetMahjRecordScore,              // 42获取多个牌局积分信息
	SC_MahjRecordScore,             // 43牌局积分信息
	
	SC_ExitByLogin,                 // 44账号被顶下线消息
	
	// 个人信息基础设定
	CS_InitPlayerInfo,                  // 首次注册后，需要完善个人信息
	SC_PlayerOK,                    // 修改个人信息后的数据
	CS_SetPlayerInfo,                   // 玩家角色信息编辑后保存 返回SC_PlayerOK
	CS_ChangeNike,                      // 付费修改昵称
	SC_NewNike,                     // 修改后昵称
	
	// 邮件
	SC_SyncMails,                   // 上线同步当前邮件列表
	SC_NewMail,                     // 新邮件推送
	CS_ReadMail,                        // 邮件阅读标记
	// 大厅刷新牌桌的信息暂时没有，后面根据具体需要来考虑
	
	MSG_MAX
}

// 返回执行错误
export class Msg_SC_LobErrRlst extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_LobErrRlst ); }
	
	public      errCode: number;            // 返回错误信息枚举（LobbyMsgDef.LobbyErrCode）
	public   strMsg: string;             // 保留做非枚举里面的扩展信息
}

// Token登录
export class Msg_CS_TokenLogin extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_TokenLogin ); }
	public      accSrvID: number;           // 帐号服编号
	public   token: string;              // token
}

// 玩家信息-表示登陆成功
export class Msg_SC_PlayerInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_PlayerInfo ); }
	public   info: PlayerData;       // 玩家详细信息
	public                      curSec: number;     // 当前服务器时间戳（单位秒）
}

//大厅信息-大厅一些基本数据
export class Msg_SC_LobbyInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_LobbyInfo ); }
	public   info: LobbyBaseInfo; // 大厅信息
}

//创建约局牌桌
export class Msg_CS_CreateTable extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_CreateTable ); }
	public    info: TableRuleInfo;   // 牌桌创建的规则信息
	public                       name: string;   // 创建的名字，null或者""，默认用玩家昵称
}

// 测试-GM指令
export class Msg_CS_GMMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GMMsg ); }
	public   cmd: string;
	public   gmMsg: string;
}

//进入房间 - 返回 TableMsg.SC_RoomInfo
export class Msg_CS_EnterRoom extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_EnterRoom ); }
	public   tid: string;             // 牌桌ID
}

// 通知客户端离开房间消息，这是表示离开房间回到大厅的标志消息
export class Msg_SC_LeaveRoom extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_LeaveRoom ); }
	public      reason: number;         // 离开房间原因(LeaveRoomReason枚举项)
}

//    // 俱乐部牌桌列表
//    public static class Msg_CS_TableList extends BaseIDMsg {
//        public Msg_CS_TableList() { mid = MSG_MID.MID_LobbyMsg.ordinal(); sid = LobMSG_SID.SC_TableList.ordinal();}
//        public List<LobbyMsgDef.TableSummInfo> tabs; // 牌桌列表(简要信息)
//    }

//打开牌谱记录
export class Msg_CS_OpenGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_OpenGameRcd ); }
	public      isFav: number;          // 0=打开历史记录，1=打开收藏牌谱记录
}

//刷新牌谱记录
export class Msg_SC_UpdateGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_UpdateGameRcd ); }
	public      isFav: number;          // 0=打开历史记录，1=打开收藏牌谱记录
	public rcds: RcdSummUnit[];
}

//增加一条牌谱记录
export class Msg_CS_AddGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_AddGameRcd ); }
	public       tid: string;        // 牌桌ID
	public          handNum: number;    // 第几手，从0开始
}

//新增一条牌谱
export class Msg_SC_NewGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_NewGameRcd ); }
	public   rcd: RcdSummUnit;
}

//删除一条记录
export class Msg_CS_DelGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_DelGameRcd ); }
	public       tid: string;        // 牌桌ID
	public          handNum: number;    // 第几手，从0开始
}

//移除一条牌谱记录
export class Msg_SC_RemoveGameRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_RemoveGameRcd ); }
	public       tid: string;        // 牌桌ID
	public          handNum: number;    // 第几手，从0开始
}

//打开牌谱详细数据
export class Msg_CS_OpenGameStepRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_OpenGameStepRcd ); }
	public       tid: string;        // 牌桌ID
	public          handNum: number;    // 第几手，从0开始
}

//牌谱记录详细数据
export class Msg_SC_GameStepRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_GameStepRcd ); }
	public                           tid: string;        // 牌桌ID
	public                              handNum: number;    // 第几手，从0开始
	public lstRcd: BaseStepRcd[];
}

//打开牌局记录的最后结算信息
export class Msg_CS_OpenGameRcdRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_OpenGameRcdRslt ); }
	public                           tid: string;        // 牌桌ID
}

//牌局记录的最后结算信息
export class Msg_SC_GameRcdRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_GameRcdRslt ); }
	public                                   tid: string;            // 牌桌ID
	public               summ: RcdSummInfo;           // 牌局记录的简要信息
	public                rule: TableRuleInfo;           // 规则
	public    players: RcdSummScoreInfo[];        // 参与者信息和积分
	public    calcInfos: FinalPlayerCalcInfo[];      // 总结算数据
}


///**请求获取房间模板*/
export class Msg_CS_ReqGetRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_ReqGetRoomRuleTemplate ); }
}

///**返回房间模板信息*/
export class Msg_SC_RspGetRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_RspGetRoomRuleTemplate ); }
	public errCode : number;
	public ruleInfoArr: TableRuleTempl[];
}

///**请求保存一个房间模板*/ 如果是存在的则是修改，不存在的作为新增
export class Msg_CS_ReqSaveRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_ReqSaveRoomRuleTemplate ); }
	public ruleInfo: TableRuleTempl;
}

///**返回保存房间模板结果*/
export class Msg_SC_RspSaveRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_RspSaveRoomRuleTemplate ); }
	public      tempId: number;
	public      errCode : number;
}

///***请求删除一个房间模板*/
export class Msg_CS_ReqDeletRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_ReqDeletRoomRuleTemplate ); }
	public      tempId: number;
}

///***返回删除一个房间模板结果*/
export class Msg_SC_RspDeletRoomRuleTemplate extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_RspDeletRoomRuleTemplate ); }
	public      tempId: number;
	public      errCode : number;
}

//申请买马(返回TableMsg.SC_HorseRoomInfo)
export class Msg_CS_LobReqBuyHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_LobReqBuyHorse ); }
	public   tid: string;            // 牌桌ID
	public      majNum: number;         // 买入马牌序号
}

//取消买马
export class Msg_CS_LobCancelBuyHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_LobCancelBuyHorse ); }
	public   tid: string;            // 牌桌ID
	public      horseSit: number;       // 马位0-1
}

//27获取基础统计数据
export class Msg_CS_GetBaseCount extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetBaseCount ); }
	public                      aid: number;        // 获取对象玩家的AID
	public    type: CountType;       // 获取数据的类型参数
}

//28返回基础统计数据
export class Msg_SC_BaseCountData extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_BaseCountData ); }
	public                          aid: number;        // 获取对象玩家的AID
	public        type: CountType;       // 获取数据的类型参数
	public  info: PlayerBaseCount;       // 玩家基础统计数据
}

//29获取收费统计数据
export class Msg_CS_GetFeeCount extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetFeeCount ); }
	public                      aid: number;        // 获取对象玩家的AID
	public    type: CountType;       // 获取数据的类型参数
	public                      feeRead: number;    // 1=可扣费获取数据，0=仅在特权下获取
	public                      needMaxMajs: number;// 1=同时获取最大收益牌型数据
}

//30返回收费统计数据
export class Msg_SC_FeeCountData extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_FeeCountData ); }
	public                          aid: number;        // 获取对象玩家的AID
	public        type: CountType;       // 获取数据的类型参数
	public   info: PlayerFeeCount;       // 玩家基础统计数据
}

//31返回最大收益牌型数据
export class Msg_SC_MaxScoreMajs extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_MaxScoreMajs ); }
	public                          aid: number;
	public        type: CountType;       // 获取数据的类型参数
	public    info: PlayerMaxMajs;       // 玩家基础统计数据
}

//32获取全服统计数据
export class Msg_CS_GetPubBaseCount extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetPubBaseCount ); }
	public        type: CountType;       // 获取数据的类型参数
}

//33返回全服统计数据
export class Msg_SC_PubBaseCountData extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_PubBaseCountData ); }
	public        type: CountType;       // 获取数据的类型参数
	public     info: PubBaseCount;       // 全服数据
}

//34主动邀请玩家进入房间
export class Msg_CS_TableInvite extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_TableInvite ); }
	public                       tid: string;        // 目标房间的唯一编号
	public                objs: number[];       // 邀请对象的GPID列表
}

//35接收邀请进入某个房间
export class Msg_SC_InviteTable extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_InviteTable ); }
	public    info: TableRuleInfo;       // 牌桌创建的规则信息
	public                       name: string;       // 创建的名字，null或者""，默认用玩家昵称
	public                       inviter: string;    // 邀请者昵称
	public                          roomCode: number;   // 房间号
}

//获取玩家7日战绩
export class Msg_CS_GetPlayerRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetPlayerRecord ); }
}

//玩家7日战绩信息
export class Msg_SC_PlayerRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_PlayerRecord ); }
	public    rcds: RecordUnit[];       // 每局战绩记录
}

//获取玩家往期战绩
export class Msg_CS_GetMonthRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetMonthRecord ); }
}

//玩家往期战绩信息
export class Msg_SC_MonthRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_MonthRecord ); }
	public    rcds: MonthRecord[];      // 每月对战记录
}

//获取牌局详情
export class Msg_CS_GetMahjRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetMahjRecord ); }
	public                           tid: string;        // 牌局唯一ID
}

//牌局详情
export class Msg_SC_MahjRecord extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_MahjRecord ); }
	public                           tid: string;        // 牌局唯一ID
	public       summ: RcdSummInfo;       // 房间信息
	public         tops: MahjTopInfo;       // top信息
	public players: MahjPlayerInfo[];   // 参与玩家列表
}

//42获取多个牌局积分信息
export class Msg_CS_GetMahjRecordScore extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_GetMahjRecordScore ); }
	public                     tids: string[];       // 所要获取的牌局tid列表
}

//43牌局积分信息
export class Msg_SC_MahjRecordScore extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_MahjRecordScore ); }
	public infos: MahjScoreInfo[];      // 积分信息
}

//44账号被顶下线消息
export class Msg_SC_ExitByLogin extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_ExitByLogin ); }
}

//首次注册后，需要完善个人信息
export class Msg_CS_InitPlayerInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_InitPlayerInfo ); }
	public   face: string;       // 暂时仅作测试，通过另外消息上传头像
	public   nike: string;       // 昵称
	public   sign: string;       // 个性签名
	public      sex: number;        // 性别
}

//修改个人信息后的数据
export class Msg_SC_PlayerOK extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_PlayerOK ); }
	public   info: PlayerData;       // 玩家详细信息
}

//玩家角色信息编辑后保存 返回SC_PlayerOK
export class Msg_CS_SetPlayerInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_SetPlayerInfo ); }
	public   face: string;       // 暂时仅作测试，通过另外消息上传头像
	public      sex: number;        // 性别
	public   sign: string;       // 个性签名
}

//付费修改昵称
export class Msg_CS_ChangeNike extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_ChangeNike ); }
	public   nike: string;       // 昵称
}

//修改后昵称
export class Msg_SC_NewNike extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_NewNike ); }
	public   nike: string;       // 昵称
}

//上线同步当前邮件列表
export class Msg_SC_SyncMails extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_SyncMails ); }
	public   mails: MailUnit[];  // 所有邮件列表
}

//新邮件推送
export class Msg_SC_NewMail extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.SC_NewMail ); }
	public         mail: MailUnit;  // 新增邮件
}

//邮件阅读标记
export class Msg_CS_ReadMail extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_LobbyMsg,  LobMSG_SID.CS_ReadMail ); }
	public    mailids: number[];     // 已经阅读的邮件ID列表
}


