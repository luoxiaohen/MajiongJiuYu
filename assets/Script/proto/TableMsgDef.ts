import { PlayerInfo, TableRuleInfo } from "./LobbyMsgDef";





/**
* Created by admin on 2022/5/30.
*/
export class TableMsgDef {
	public static BASE_TEST_TIME: number= 1660000000000;
}

export enum TableErrCode{
	eOK,
	eOtherErr,          // 1 详细见文字错误
	eNotSit,            // 2 座位已被占据
	eSitNumErr,         // 3 非法入座，座位号错误（0-3）
	eNotEnter,          // 4 需要先进入房间
	eNotRoom,           // 5 找不到你要的牌桌
	eErrDoing,          // 6 操作无效(碰杠胡无效)
	eErrDice,           // 7 操作无效(当前阶段不需要掷骰子)
	eOverSit,           // 8 不该你打牌(掷骰子)啊
	eNotMajID,          // 9 手上没有这张牌啊
	eIsOnSit,           // 10 已经在座位上
	eIsStarted,         // 11 牌局开始无法退出房间
	eLowGold,           // 12 金币数量不足以让你入座
	eErrChange3,        // 13 换三张的扣牌不合法
	eHu2ScoreLimit,     // 14  2分起胡(胡牌的时候)
	eMustHuLast4,       // 15 最后四张必胡（出牌的时候，不能碰杠）
	eTidHandNumErr,     // 16 不存在的牌局或手数
	eFavHasFav,         // 17 已经在收藏列表中
	eNotOpState,        // 18 当前状态不允许操作（比如定却中有人胡牌）
	eNeedQueFirst,      // 19 优先打缺，不缺不能打
	eErrReq,            // 20 请求无效（通用消息表示操作非法）
	eOverHorseCnt,      // 21 买马数量已达上限
	eOverHandNum,       // 22 超过一定手数，不让买马（目前是最后一手）
	eNotHorseSit,       // 23 买马人数已满
	eMajNumUsed,        // 24 所选择马牌已被其他玩家选择
	eLmtCancelStart,    // 25 牌局开始无法取消买马
	eLmtCancelNotIn,    // 26 不在买马位，非法取消买马
	eLmtMajNum,         // 27 所选择马牌不合法(100-107)
	eErrReady,          // 28 无效准备，不在位置上
	eRepeatRoom,        // 29 创建的牌桌已经存在（重复创建牌桌）
	
	eMax
}

// 牌桌信息
export class RoomTableInfo{
	public   tid: string;                    // 牌桌唯一编码
	public      code: number;                   // 查询码，个人创建才有，俱乐部创建的=0
	public   creater: string;                // 创建者昵称
	public      crtAid: number;                 // 创建者账号唯一ID
	public      overSec: number;                // 距离自动解散的倒计时时间，单位秒
	public   roomName: string;               // 房间名称
	public rule: TableRuleInfo;  // 牌桌规则
	// java Ignore public RoomTableInfo(){}
}

// 买马列表中的房间基础信息
export class HorserTableInfo{
	public   tid: string;                    // 牌桌唯一编码
	public   roomName: string;               // 房间名称
	public   roomIcon: string;               // 房间ICON
	public      gamePlayType : number;          // /**游戏玩法类型*/1=血战，2=换三  依照GamePlayTypeEnum
	public      roomType: number;               // 游戏房间类型   依照 GameRoomTypeEnum
	public      baseScore: number;              // 房间基础底分
	public      handsCnt: number;               // 房间总手数
	public      buyHorseNum: number;            ///**规则里的买马数量 0,1,2*/
}

// 上桌者信息
export class SitInfo{
	public                      sitNum: number;     // 座位编号 0-3(东北西南)
	public   player: PlayerInfo;     // 玩家基本信息
	public                      curGold: number;    // 当前金币数量
	public                      online: number;     // 在线状态，0=离线，1=在线
	public                      onReady: number;    // 准备状态，0=未准备，1=准备好
	// java Ignore public SitInfo(){}
}

// 买马者信息
export class HorserInfo{
	public                      horseSit: number;   // 马位置（0-1）
	public                      isBanker: number;   // 1=庄家买马
	public   player: PlayerInfo;     // 玩家基本信息
	public                      online: number;     // 在线状态，0=离线，1=在线
	public                      horseGold: number;  // 当前买马金币数量
	public                      majNum: number;     // 买的马牌牌池序号(0-107)
	// java Ignore public SitInfo(){}
}

// 庄家买马选马信息
export class HorseSelInfo{
	public                      sitNum: number;     // 牌桌位置
	public                      majNum: number;     // 买的马牌牌池序号(0-107)
}

export class GameResultInfo {
	public                      sitNum: number;     // 座位编号 0-3(东北西南)，买马的放在4、5
	public                      state: number;      // 状态（0=无叫，1=有叫，2=胡牌），3=买马，4=庄家买马
	public                      huNum: number;      // 第几个胡牌，0开始；对于买马者，这是买中的位置(sit)
	public                      rain: number;       // 雨（无叫时用：0=正常无叫，1=退雨；2=退雨+反雨）对于买马者，这里是买中麻将牌MajID
	public                      score: number;      // 积分
	public                      curChips: number;   // 目前桌上剩余积分
	public            lstMajs: number[];    // 手牌
	public          lstPuts: MsgMajSer[];    // 杠碰牌
	public                      horseScore: number; // 买马积分
	public                      curHorseChips: number;   // 目前桌上剩余买马积分
	
	// java Ignore public GameResultInfo(){}
}

export class GameScoreInfo {
	public                      sitNum: number;     // 座位编号 0-3(东北西南)
	public     rcd: ScoreEventInfo[];        // 玩家积分记录
}

export class SitDiceInfo{
	public                      sitNum: number;     // 座位编号 0-3(东北西南)
	public                      dice: number;       // 骰子大小
}

export class SitQueInfo{
	public                      sitNum: number;     // 座位编号 0-3(东北西南)
	public                      wtt: number;        // 万条同（0-2）
}

// 成型牌信息
export class MsgMajSer {
	public                      majID: number;      // 麻将编号（顺子则是最小的一张牌）
	public                      type: number;       // 1=顺子,2=对子,3=刻子,4=杠;
	public                      targetNum: number;  // 碰杠目标位置
	public                      getType: number;    // 杠牌所得类型，0=自己原手的,1=后来摸的,2=点杠的
}

// 单个玩家完整牌局信息
export class GameOneScene{
	public          site: number;
	public lstDis: number[];
	public lstHands: number[];
	public  lstPuts: MsgMajSer[];//...
	public          curState: number;
	public          totalWin: number;
	public          theGamesWin: number;
	public          downCnt: number;
}

// 牌局背景信息
export class GameBackScene{
	public          bigDice: number;
	public          smallDice: number;
	public          picksCnt: number;
	public          handsCnt: number;
	public          bankerSit: number;
	public          fanjiID: number;
	public          gameState: number;
	public       askOverName: string;
	public         askOverTime: number;
}

// 产生积分事件的信息
export class ScoreEventInfo{
	public                          curSit: number;             // 事件主体位置，买马位置是4、5
	public                          majid: number;              // 对象牌ID
	public                tarSits: number[];            // 对象位置(0-5，其中4-5是1、2马) 可能为null
	public                tarSitsEx: number[];          // 附加对象（擦挂） 可能为null
	public                          scoreType: number;          // 积分类型（事件类型）ScoreTypeEnum
	public                 huGangTypes: number[];        // 事件附加说明（牌型、杠类型）（HuTypeEnum、GangTypeEnum） 可能为null
	public                 fanTypes: number[];           // 事件附加说明（额外加倍类型）（FanTypeEnum） 可能为null
	public                          param: number;              // 事件参数，比如根的数量
	public                          win: number;                // 积分输赢
	public                    debug: DebugInfo;              // 用于调试的信息
	
	public                tarScore: number[];           // 上面tarSits与tarSitsEx列表对象的扣分数，仅在杠胡是存在
}

export class DebugInfo{
	//        public int                          dbTotal;            // 根据牌型计算的番倍数
	public                          huNum: number;              // 胡顺序
	public                          zmType: number;             // 自摸
	
	public                          dobTotal: number;           // 总的牌型倍数
	public                          dobB: number;               // 基础牌型倍数(用于判断过手胡)
	public                          dobT: number;               // 加了自摸加番后的牌型倍数（相当于结算前的实际番倍）
	public                          dob: number;                // 封顶后牌型倍数
	public                          tiFan: number;              // 封顶后梯番牌型倍数
	public                          baseMo: number;             // 自摸加底
	public                          fanMo: number;              // 自摸加番
	
	public                          param: number;              // 灵活测试参数
	public                          param2: number;             // 灵活测试参数
	//        public int                          sitBaseScore;       // 位置的基础底分（=基础底分*豹子*飘倍
	//        public int                          tiFan;           // 梯番加倍
	//        public int                          zmBaseOver;         // 自摸加底之后
	
	//        public int                          tarCnt;             // 赢取对象数量
	
	// java Ignore public DebugInfo(){}
}

// 总结算时玩家信息
export class FinalPlayerCalcInfo{
	public                          sit: number;                // 位置(买马的放在4、5)
	public                          score: number;              // 积分，牌局上的积分
	public                          bankerHScore: number;       // 庄家买马积分
	public                          scoreHorse: number;         // 单纯买马的积分
	public                          winChips: number;           // 带出牌桌的金币，不会为负
	public                          zmCnt: number;              // 自摸次数
	public                          jpCnt: number;              // 接炮次数
	public                          gpCnt: number;              // 杠牌次数
	public                          dpCnt: number;              // 点炮次数
}

// 积分类型
export enum ScoreTypeEnum{
	None,               //
	eZiMo,              // 1 自摸 +
	eHuPai,             // 2 胡牌 +
	eBeiZiMo,           // 3 被自摸 -
	eDianPao,           // 4 点炮 -
	eGang,              // 5 杠 +
	eBeiGang,           // 6 被杠 -
	eSunshine,          // 7 晒太阳
	eSunshineRain,      // 8 晒太阳反雨
	eChaHuaZhu,         // 9 查花猪
	eChaDaJiao,         // 10 查大叫
	eChaXiaoJiao,       // 11 查小叫
	eTuiShui,           // 12 退税
	eZhuanYu,           // 13 转雨
	
	eHorserWin,         // 14 买马者处赢取，或者对于买马者就是赢取积分
	eHorserLose,        // 15 输给买马者，或者对于买马者就是输出积分
	eMAX
}


// 牌型
export enum HuTypeEnum{
	None,
	PingHu,             /** 1 平胡     1 */
	DuiDuiHu,           /** 2 对对胡   2 */
	QingYiSe,           /** 3 清一色   4 */
	QiDui,              /** 4 七对     4 */
	LongQiDui,          /** 5 龙七对   8 */
	JinGouDiao,         /** 6 金钩钓   4 */
	YaoJiu,             /** 7 幺九     8 */
	JiangDui,           /** 8 将对     16 */
	MAX
}

// 额外加倍类型
export enum FanTypeEnum{
	None,
	Gen,                /** 1 根       2 -*/
	GangShangHua,       /** 2 杠上花   2 */
	GangShangPao,       /** 3 杠上炮   2 */
	QiangGangHu,        /** 4 抢杠胡   2 */
	HaiDiLaoYue,        /** 5 海底捞月 2 */
	MenQing,            /** 6 门清     2 -*/
	ZhongZhang,         /** 7 中张     2 -*/
	JiaXinWu,           /** 8 夹心五   2 -*/
	ZiMo,               /** 9 自摸加番 2 */
	TianHu,             /** 10 天胡    8 */
	DiHu,               /** 11 地胡    8 */
	MAX
}

export enum GangTypeEnum{
	eNone,
	eAnGang,            // 暗杠
	eDianGang,          // 点杠
	eBuGang,            // 补杠
	eCaGua,             // 擦挂
	eMax
}

export enum EMGameState{
	eGS_WaitReady,          // 待准备阶段（超时自动关闭房间）
	eGS_DiceEast,           // 定庄
	eGS_DicePos,            // 定位
	eGS_StartDice,          // 游戏开始，掷Dice
	eGS_WaitDeal,           // DoDiceOver 后待发牌
	eGS_WaitChange3,        // 等待换三张
	eGS_WaitChange3Dice,    // 等待换三张掷骰子
	eGS_WaitQue,            // 等待定缺
	eGS_WaitDown,           // 待出
	eGS_WaitPeng,           // 待碰杠胡
	eGS_WaitQiangG,         // 待抢杠
	eGS_GameEnd,            // 结束一手
	eGS_GameClose,          // 游戏关闭               <-
	eGS_GameSysClose        // 游戏被系统关闭
}


