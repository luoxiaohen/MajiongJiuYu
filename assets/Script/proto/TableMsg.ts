import { BaseMsg, BaseIDMsg, MSG_MID } from "./BaseMsg";
import { PlayerInfo } from "./LobbyMsgDef";
import { RcdSummUnit } from "./MahjStepMsgDef";
import { RoomTableInfo, SitInfo, HorserInfo, SitDiceInfo, SitQueInfo, MsgMajSer, GameResultInfo, GameScoreInfo, FinalPlayerCalcInfo, ScoreEventInfo, HorseSelInfo, HorserTableInfo, GameBackScene, GamePlayerScene, HandsInfo, HorseScoreInfo } from "./TableMsgDef";




/**
* Created by admin on 2022/5/30.
*/
export class TableMsg extends BaseMsg{
}

export enum TabMSG_SID {
	SC_TabErrRlst,                  // 0返回执行错误
	SC_OnTable,                     // 1返回房间号，进入某个房间后的决定性消息
	SC_RoomInfo,                    // 2返回房间信息
	CS_FindEnterRoom,                   // 3搜索进入房间 - 返回 TableMsg.SC_RoomInfo
	CS_SitDown,                         // 4入座某个位置
	SC_SitOK,                       // 5成功入座某个位置
	CS_Ready,                           // 6准备好了
	SC_Ready,                       // 7广播准备好了
	CS_LeaveRoom,                       // 8离开房间
	SC_OneSit,                      // 9广播某人上桌
	SC_OneLeave,                    // 10广播某人离开
	
	// 牌局
	SC_StartDiceEast,               // 11开始定庄   定庄去掉，协议保留，不在发送
	SC_StartDicePos,                // 12开始定位
	SC_StartDiceGame,               // 13刷新新的位置。
	SC_BeginDiceMsg,                // 14开始牌局，需要庄家掷骰子决定开始
	CS_PressDice,                       // 15按下骰子，只在定位置时用
	SC_PressDice,                   // 16广播按下骰子消息
	CS_DoDice,                          // 17掷骰子（暂考虑通用的）类似手松开
	SC_DiceRslt,                    // 18掷骰子结果
	SC_PrDiceRslt,                  // 19掷个人骰子结果
	SC_StartGame,                   // 20开始游戏，发牌
	SC_YouMajMsg,                   // 21单独，你的牌（发牌结果）
	
	SC_StartChange3,                // 22通知客户端开始换三张
	CS_Change3Maj,                      // 23换三张
	SC_Change3Maj,                  // 24换三张同步动作，包含剩余未扣牌人数（=0自动开始倒计时掷骰子）
	SC_You3Maj,                     // 25换三张的结果
	SC_StartDingQue,                // 26通知客户端开始定却
	CS_DingQue,                         // 27定却
	SC_DingQue,                     // 28定却操作动作
	SC_QueRslt,                     // 29定却结果，之后自动开始出牌
	
	SC_SomeTurnMsg,                 // 30广播该谁，同时摸牌
	SC_WaitDownMsg,                 // 31广播该谁出牌
	SC_GetMajMsg,                   // 32单独，你的牌：所得牌，得牌方式
	SC_WaitYou,                     // 33判断客户端有胡碰杠，告知客户端等待对方消息（需要过、碰杠、胡中一个）(别人出牌触发)
	CS_PassMsg,                         // 34过
	CS_DownMajMsg,                      // 35出牌
	SC_DownMajMsg,                  // 36广播，出牌
	CS_PengMajMsg,                      // 37碰或杠  -针对别人打出来的
	SC_PengMajMsg,                  // 38广播碰或杠
	CS_GangSelfMsg,                     // 39自己杠  -针对自己摸上来的
	SC_GangSelfMsg,                 // 40广播自己杠
	SC_HasHuGangMsg,                // 41告知当前杠牌的人，有人抢杠，需等待别人抢胡操作，同时告知能够胡牌的SC_WaitYou消息
	CS_HuMajMsg,                        // 42胡牌
	SC_HuMajMsg,                    // 43广播胡牌
	CS_UpdateHands,                     // 44请求手牌信息   -----
	SC_UpdateHands,                 // 45刷新手牌信息   -----
	CS_GetGameResultMsg,                // 46获取游戏结果   --暂时不用，服务器会主动推送下面消息
	SC_GameResultMsg,               // 47一把游戏结束结果（流局，所有人手牌）
	CS_GetScoreListMsg,                 // 48获取积分列表   -- 可用，服务器也会主动推送
	SC_ScoreListMsg,                // 49积分列表
	CS_NextTrun,                        // 50下一手
	SC_GameOverMsg,                 // 51整局游戏结束结果
	SC_RealScore,                   // 52实时计分消息(胡杠时发生)
	
	SC_UpdatePlayerInfo,            // 53刷新某个玩家信息(在桌的)
	SC_SyncGameState,               // 54重新上线，同步当前牌局
	CS_RqCloseGame,                     // 55申请关闭房间
	SC_RqCloseGame,                 // 56广播有人申请关房
	CS_VoteCloseGame,                   // 57投票关闭房间
	SC_VoteRslt,                    // 58投票状态(仅同意)
	SC_VoteCloseRslt,               // 59投票结果广播
	SC_PoolsList,                   // 60牌墙剩余牌列表(GM:getpools)
	SC_BuGanging,                   // 61广播有人要补杠
	SC_RqCloseGameErr,              // 62发起投票处于冷却时间
	
	CSC_TestTimeMsg,                    // 63测试时间消息 for test
	
	CS_AddMahjRcd,                      // 64增加一条牌谱记录
	SC_NewMahjRcd,                  // 65新增一条牌谱
	
	CS_ReqBuyHorse,                     // 66申请买马
	CS_CancelBuyHorse,                  // 67取消买马
	SC_UpdateHorser,                // 68刷新买马者信息（通用，只要改变都刷新，包括庄家买马）
	SC_StartSelHorse,               // 69通知开始选马牌(用于庄家买马房间的流程里)
	CS_SelHorse,                        // 70玩家选马牌(用于庄家买马房间的流程里)
	SC_SelHorseRslt,                // 71广播选马牌结果（所有人选完以后统一广播）
	
	SC_HorseRoomInfo,               // 72买马后的给买马者单独推送的房间信息，上线重新登陆推送
	SC_NewHorseScoreRslt,           // 73买马战绩，一手结束后给买马者单独推送的信息
	SC_HorseRoomState,              // 74给买马者单独推送的房间状态和结算信息
	SC_CancelBuyHorse,              // 75给买马者单独推送的取消买马信息
	
	CS_Fan3Tin,                         // 76出现3番下叫，每手牌出现发送一次（只有3番时才发送，用于统计）
	SC_LimitHuPeng,                 // 77出现受限制的胡碰消息（因过手胡过手碰和2分起胡限制的胡碰消息）
	SC_NextTrunOK,                  // 78广播谁点了下一手
	
	SC_SyncEndHandsInfo,            // 79重新上线，同步当前局往手记录（含买马信息的往手战绩）
	SC_SyncEndHorseInfo,            // 80重新上线，同步当前玩家买马记录（每一手买中信息）
	CS_GetEyesList,                     // 81获取旁观者列表(打开牌局相应界面时获取)
	SC_SyncEyesList,                // 82返回旁观者列表
	
	MSG_MAX
}

// 返回执行错误
export class Msg_SC_TabErrRlst extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_TabErrRlst ); }
	
	public      errCode: number;    // 返回错误信息枚举（SrvsMsgDef.SrvsErrCode）
	public   strMsg: string;     // 扩展一个字符串信息
	public      val: number;        // 扩展一个整型数据
}

//返回房间号，进入某个房间后的决定性消息
export class Msg_SC_OnTable extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_OnTable ); }
	public   tid: string;        // 牌桌唯一编码
}

//返回房间信息
export class Msg_SC_RoomInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_RoomInfo ); }
	public    info: RoomTableInfo;       // 牌桌信息
	public    players: SitInfo[];    // 玩家列表
	public horsers: HorserInfo[];    // 买马者列表
}

//搜索进入房间 - 返回 TableMsg.SC_RoomInfo
export class Msg_CS_FindEnterRoom extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_FindEnterRoom ); }
	public      code: number;
}

//入座某个位置
export class Msg_CS_SitDown extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_SitDown ); }
	public      sit: number;            // 座位号（0-3=东北西南）4=自动找空位坐下
}

//成功入座某个位置
export class Msg_SC_SitOK extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SitOK ); }
	public      sit: number;            // 座位号（0-3=东北西南）
}

//准备好
export class Msg_CS_Ready extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_Ready ); }
}

//广播准备好了
export class Msg_SC_Ready extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_Ready ); }
	public      okSit: number;                  // 完成准备座位号
}

//离开房间
export class Msg_CS_LeaveRoom extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_LeaveRoom ); }
}

//广播某人上桌
export class Msg_SC_OneSit extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_OneSit ); }
	public  newSit: SitInfo;     // 新的玩家信息
}

//广播某人离开
export class Msg_SC_OneLeave extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_OneLeave ); }
	public      sit: number;                    // 离开玩家的座位号
}


//开始定庄
export class Msg_SC_StartDiceEast extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartDiceEast ); }
}

//开始定位
export class Msg_SC_StartDicePos extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartDicePos ); }
}

//刷新新的位置
export class Msg_SC_StartDiceGame extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartDiceGame ); }
	public    diceInfos: SitDiceInfo[];   // 四人掷骰子结果
	public        players: SitInfo[];    // 刷新玩家位置
}

//开始牌局，需要庄家掷骰子决定开始
export class Msg_SC_BeginDiceMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_BeginDiceMsg ); }
	public bankerSite: number;      // 庄家座位号
}

//按下骰子，只在定位置时用
export class Msg_CS_PressDice extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_PressDice ); }
}

//广播按下骰子消息
export class Msg_SC_PressDice extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_PressDice ); }
	public      sit: number;        // 座位号（0-3=东北西南）
}

//掷骰子（暂考虑通用的）类似手松开
export class Msg_CS_DoDice extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_DoDice ); }
}

//掷骰子结果
export class Msg_SC_DiceRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_DiceRslt ); }
	public      bigNum: number;
	public      smlNum: number;
}

//掷个人骰子结果
export class Msg_SC_PrDiceRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_PrDiceRslt ); }
	public      bigNum: number;
	public      smlNum: number;
	public      sit: number;
}

//开始游戏，发牌
export class Msg_SC_StartGame extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartGame ); }
	public      diceBig: number;            // 骰子数1
	public      diceSmall: number;          // 骰子数2
	public      bankerSite: number;         // 桩位
	public      startHands: number;         // 第几手
	public      baozi: number;              // 是否有豹子(0=无；1=豹子；2=双豹)
	public      piaoSit: number;            // 飘家位置，没有飘家则 = -1
	
	public      horseType: number;          // 1=活马，2=死马
	public      horseMajNum1: number;       // 被买走的马位置号，没有 = -1
	public      horseMajNum2: number;       // 被买走的马位置号，没有 = -1
}


//单独，你的手牌（发牌结果）
export class Msg_SC_YouMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_YouMajMsg ); }
	public lstMajID: number[];           // 万条筒的顺序（1-29）*13
}

//通知客户端开始换三张
export class Msg_SC_StartChange3 extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartChange3 ); }
}

//换三张
export class Msg_CS_Change3Maj extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_Change3Maj ); }
	public lstMajID: number[];           // 换出三张牌
}

//换三张同步动作，包含剩余未扣牌人数（=0自动开始倒计时掷骰子）
export class Msg_SC_Change3Maj extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_Change3Maj ); }
	public      okSit: number;                  // 完成扣牌座位号
	public      remCnt: number;                 // 剩余未扣牌人数（=0自动开始倒计时掷骰子）
}

//换三张的结果
export class Msg_SC_You3Maj extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_You3Maj ); }
	public    lstOuts: number[];            // 换出三张牌
	public    lstMajID: number[];           // 换入三张牌
	public              bigNum: number;
	public              smlNum: number;
	public              type: number;               // 换三张的方式，也可以用上面的骰子推算（0=对换，1=顺时针；-1=逆时针）
	public              baozi: number;              // 最后修正豹子(0=无；1=豹子；2=双豹)
}

//通知客户端开始定却
export class Msg_SC_StartDingQue extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartDingQue ); }
}

//定却
export class Msg_CS_DingQue extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_DingQue ); }
	public      wtt: number;                    // 万条同（0-2）
}

//定却操作动作
export class Msg_SC_DingQue extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_DingQue ); }
	public      okSit: number;                  // 完成定却座位号
}

//定却结果
export class Msg_SC_QueRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_QueRslt ); }
	public infos: SitQueInfo[];
}



//广播该谁，同时摸牌
export class Msg_SC_SomeTurnMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SomeTurnMsg ); }
	public siteNum: number;                     // 现在摸牌的玩家
	public remPoolsNum: number;                 // 摸后牌墙剩余数量
}

//广播该谁出牌
export class Msg_SC_WaitDownMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_WaitDownMsg ); }
	public siteNum: number;                     // 等待出牌的玩家
}

//单独，你的牌：所得牌，得牌方式
export class Msg_SC_GetMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_GetMajMsg ); }
	public majID: number;                       // 万条筒的顺序（1-29）
	public pickWay: number;                     // 取得方式（0-2=摸碰杠）
}

//判断客户端有胡碰杠，告知客户端等待对方消息（需要过、碰杠、胡中一个）
export class Msg_SC_WaitYou extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_WaitYou ); }
	public  type: number;                       //  按位取值：0x01=胡牌；0x02=碰杠
}

// 过
export class Msg_CS_PassMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_PassMsg ); }
}

//出牌
export class Msg_CS_DownMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_DownMajMsg ); }
	public majID: number;                       // 万条筒的顺序（1-29）
}

//广播，出牌
export class Msg_SC_DownMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_DownMajMsg ); }
	public downSiteNum: number;
	public majID: number;
}

//碰或杠
export class Msg_CS_PengMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_PengMajMsg ); }
	public isGang: number;                      // 0=碰，1=杠
}

//广播碰或杠
export class Msg_SC_PengMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_PengMajMsg ); }
	public pengSiteNum: number;                 // 碰或杠的位置
	public majID: number;                       // 牌ID
	public isGang: number;                      // 0=碰，1=杠
	public fromSiteNum: number;                 // 打出的位置
}

//自己杠
export class Msg_CS_GangSelfMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_GangSelfMsg ); }
	public majID: number;                       // 不一定是刚出现的，可能是原生的，所以需要指定
}

//广播自己杠
export class Msg_SC_GangSelfMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_GangSelfMsg ); }
	public pengSiteNum: number;                 // 杠的位置
	public isPapo: number;                      // 0=原手杠，1=碰了之后的杠
	public majID: number;
}

//告知有人抢杠
export class Msg_SC_HasHuGangMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_HasHuGangMsg ); }
}

//胡牌
export class Msg_CS_HuMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_HuMajMsg ); }
}

//广播胡牌
export class Msg_SC_HuMajMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_HuMajMsg ); }
	public      huSit: number;                  // 胡牌的位置
	public      zmType: number;                 // 0=平湖，1=自摸；2=杠上花；3=杠上炮；4=抢杠胡
	public      tarSit: number;                 // 点炮对象位置；如果是点杠花，这里就是点杠的人，如果是抢杠胡，这里是杠牌的人
	public      majID: number;                  // 自摸亮牌，或平胡时所胡的牌
	public      huNum: number;                  // 本次胡牌是第几批胡牌的，从0开始
	public      huCnt: number;                  // 本次胡牌的人数
}

//请求手牌信息
export class Msg_CS_UpdateHands extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_UpdateHands ); }
}

//刷新手牌信息
export class Msg_SC_UpdateHands extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_UpdateHands ); }
	public                lstHands: number[];   // 手牌列表
	public  lstPuts: MsgMajSer[];    // 碰杠牌列表（成型牌）
}

//获取游戏结果
export class Msg_CS_GetGameResultMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_GetGameResultMsg ); }
	public huSiteNum: number;                   // 胡牌位置
	public zm: number;                          // 1=自摸；2=平胡
	public huMajID: number;                     // 所胡的牌
}

//一把游戏结束结果（流局，所有人手牌）
export class Msg_SC_GameResultMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_GameResultMsg ); }
	public isBreak: number;                             // 1=打黄
	public results: GameResultInfo[];// 结算列表
}

//获取积分列表
export class Msg_CS_GetScoreListMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_GetScoreListMsg ); }
}

//积分列表
export class Msg_SC_ScoreListMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_ScoreListMsg ); }
	public  scores: GameScoreInfo[]; // 各玩家积分记录
}

//下一局
export class Msg_CS_NextTrun extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_NextTrun ); }
}

//整局游戏结束结果
export class Msg_SC_GameOverMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_GameOverMsg ); }
	public                                      handCnt: number;        // 实际进行手数
	public    calcInfos: FinalPlayerCalcInfo[];      // 总结算数据
}

// 实时计分消息(胡杠时发生)
export class Msg_SC_RealScore extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_RealScore ); }
	public event: ScoreEventInfo;
}

//刷新某个玩家信息(在桌的)
export class Msg_SC_UpdatePlayerInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_UpdatePlayerInfo ); }
	public  sitInfo: SitInfo;     // 刷新的玩家信息（里面的online表示最新的在离线状态，如果重新连接在线的，里面的gpid也是最新的）
}

//重新上线，同步当前牌局
export class Msg_SC_SyncGameState extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SyncGameState ); }
	public    info: RoomTableInfo;       // 牌桌信息
	public    players: SitInfo[];    // 玩家列表
	public horsers: HorserInfo[];    // 买马者列表
	
	public    mahjInfo: GameBackScene;   // 当前牌局基本信息
	public  lstPlayerScene: GamePlayerScene[];      // /**所有玩家的牌组数据*/
}

//申请关闭房间
export class Msg_CS_RqCloseGame extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_RqCloseGame ); }
}

//投票关闭房间
export class Msg_CS_VoteCloseGame extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_VoteCloseGame ); }
	public      agree: number;      // 0=拒绝，1=同意
}

//广播有人申请关房
export class Msg_SC_RqCloseGame extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_RqCloseGame ); }
	public      rqSit: number;      // 申请者位置
	public      overSec: number;    // 默认同意倒计时时间，单位秒
}

//投票状态(仅同意)
export class Msg_SC_VoteRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_VoteRslt ); }
	public      sitAgree: number;      // 同意者位置
}

//投票结果广播
export class Msg_SC_VoteCloseRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_VoteCloseRslt ); }
	public      isClose: number;        // 0=有人拒绝不退出；1=投票关闭退出；
	public      refuseSit: number;      // 拒绝者位置
}

// 牌墙剩余牌列表(GM:getpools)
export class Msg_SC_PoolsList extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_PoolsList ); }
	public    pools: number[];  // 当前牌墙剩余牌
}

// 广播有人要补杠
export class Msg_SC_BuGanging extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_BuGanging ); }
	public      sit: number;
	public      majID: number;
}

// 发起投票处于冷却时间
export class Msg_SC_RqCloseGameErr extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_RqCloseGameErr ); }
	public      cdSec: number;      // 冷却剩余时间
}


// 测试时间消息
export class Msg_CSC_TestTimeMsg extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CSC_TestTimeMsg ); }
	public      cliSend: number;
	public      gateRcv: number;
	public      gateSend: number;
	public      tabRcv: number;
	public      tabSend: number;
	public      gateRcv2: number;
	public      gateSend2: number;
}

//增加一条牌谱记录
export class Msg_CS_AddMahjRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_AddMahjRcd ); }
	public          handNum: number;    // 第几手，从0开始
}

//新增一条牌谱
export class Msg_SC_NewMahjRcd extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_NewMahjRcd ); }
	public   rcd: RcdSummUnit;
}


//申请买马
export class Msg_CS_ReqBuyHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_ReqBuyHorse ); }
	public      majNum: number;         // 买入马牌序号(0-107)
}

//取消买马
export class Msg_CS_CancelBuyHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_CancelBuyHorse ); }
	public      horseSit: number;       // 马位0-1
}

//刷新买马者信息（通用，只要改变都刷新，包括庄家买马）
export class Msg_SC_UpdateHorser extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_UpdateHorser ); }
	public horsers: HorserInfo[];    // 买马者列表
}

//通知开始选马牌
export class Msg_SC_StartSelHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_StartSelHorse ); }
}

//玩家选马牌
export class Msg_CS_SelHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_SelHorse ); }
	public      majNum: number;         // 买入马牌序号(0-107)
}

//广播选马牌结果（所有人选完以后统一广播）
export class Msg_SC_SelHorseRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SelHorseRslt ); }
	public selHorseRslt: HorseSelInfo[];    // 选择结果
}

//买马战绩，一手结束后给买马者单独推送的信息
export class Msg_SC_NewHorseScoreRslt extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_NewHorseScoreRslt ); }
	public   tid: string;                // 牌桌号
	public      hsit: number;               // 马位（0-1）
	public      handNum: number;            // 结束的是第几手，从0开始
	public      majID: number;              // 买中牌面
	public tar: PlayerInfo;  // 买中玩家信息
	public      win: number;                // 战绩
}

//买马后的给买马者单独推送的房间信息，上线重新登陆推送
export class Msg_SC_HorseRoomInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_HorseRoomInfo ); }
	public  info: HorserTableInfo;
	public                          isStart: number;    // 是否已经开局 1=开始
	public                          majNum: number;     // 买入马牌序号(0-107)
	public                          handNum: number;    // 当前进展到第几手，从0开始,-1=未开始
}

//给买马者单独推送的房间状态和结算信息（包括开局、关闭结算）
export class Msg_SC_HorseRoomState extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_HorseRoomState ); }
	public   tid: string;                // 牌桌号
	public      hsit: number;               // 马位（0-1）
	public      state: number;              // 0=未开始，1=开始，2=结束
	public      win: number;                // 本局总战绩
}

//给买马者单独推送的取消买马信息
export class Msg_SC_CancelBuyHorse extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_CancelBuyHorse ); }
	public   tid: string;                // 牌桌号
	public      hsit: number;               // 马位（0-1）
}

// 出现3番下叫，每手牌出现发送一次（只有3番时才发送，用于统计）
export class Msg_CS_Fan3Tin extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_Fan3Tin ); }
	public      tinDob: number;             // 番倍数
}

// 77出现受限制的胡碰消息（因过手胡过手碰和2分起胡限制的胡碰消息）
export class Msg_SC_LimitHuPeng extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_LimitHuPeng ); }
	public      reason: number;             // 0=过手胡，1=过手碰，2=2分起胡
}

//78广播谁点了下一手
export class Msg_SC_NextTrunOK extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_NextTrunOK ); }
	public      sit: number;                // 点了下一手的位置
}

// 79重新上线，同步当前局往手记录（含买马信息的往手战绩）
export class Msg_SC_SyncEndHandsInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SyncEndHandsInfo ); }
	public  hands: HandsInfo[];      // 牌局上已完成的每一手牌普基本信息
}

// 80重新上线，同步当前玩家买马记录（每一手买中信息）
export class Msg_SC_SyncEndHorseInfo extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SyncEndHorseInfo ); }
	public horseInfo: HorseScoreInfo;    // 本局房间的买马信息
}

// 81获取旁观者列表(打开牌局相应界面时获取)
export class Msg_CS_GetEyesList extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.CS_GetEyesList ); }
}

// 82返回旁观者列表
export class Msg_SC_SyncEyesList extends BaseIDMsg {
	public constructor() { super( MSG_MID.MID_TableMsg,  TabMSG_SID.SC_SyncEyesList ); }
	public eyes: PlayerInfo[];           // 所有旁观者列表，含离开的
	public                onlineAids: number[];     // 上面列表中目前仍在旁观的AID
}


