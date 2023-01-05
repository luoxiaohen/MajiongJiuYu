// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EatCardEnum, FeelTypeEnum, PlayEatTypeEnum } from "../enum/EnumManager";
import { PlayerInfo } from "../proto/LobbyMsgDef";
import { Msg_SC_GameResultMsg, Msg_SC_ScoreListMsg } from "../proto/TableMsg";
import { GameResultInfo, GameScoreInfo, HorserInfo, HuTypeEnum, RoomTableInfo, ScoreEventInfo, SitInfo } from "../proto/TableMsgDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InterfaceHelp{
}

/**牌权重计算*/
export class MajCardLight{
	cardValue : number;
	cardLight : number;
}

export class EatCardClass{
	value : number;
	type: PlayEatTypeEnum;
}
export class PengGangData{
	/**吃牌类型*/
	public eatType:EatCardEnum;
	/**吃牌牌值*/
	public cardValue : number;
	/***持有者相对于第一视角位置*/
	public havePointBySelf : number;
}

/**最新的摸牌信息*/
export class FeelCardData{
	/**牌值*/
	cardValue : number;
	/**来源*/
	cardType:FeelTypeEnum;
	/**牌池剩余*/
	poolRemaining : number;
}

/**检测当前牌组
 * 其他人打出牌时候检测 碰 杠 胡 
 * 自己进牌时候检测出牌可听
 * 自己出牌时候检测是否听牌以及停牌数据
*/
export class DeckData{
	/**可以碰的牌 手中有两张以上*/
	public pengValue : Array<number> = [];
	/*可以杠的牌 手中有3张**/
	public gangValue : Array<number> = [];
	/**本身可以暗杠的牌 手中已有4张*/
	public anGangValue : Array<number> = [];
	/**所有的胡牌可能,目前计算只做可胡的牌,*/
	/**补杠*/
	public buGangValue : Array<number> = [];
	public allTingValue : Array<ListenCard> = [];
	/**所有胡牌数据*/
	public huValue : Array<CanHuCard> = [];
	/**胡牌啦*/
	public huData : HuData = null;
}
export class HuData{
	/**胡牌牌值*/
	public cardValue:number;
	/**所胡番数*/
	public fanNum : number;
	/**所胡倍数*/
	public beiNum : number;
	/**所胡牌型*/
	public HuType : Array<HuTypeEnum> = [];
}
/**自己进牌后,需要出牌时候检测出牌可听 并保存*/
export class ListenCard {
	/**出牌可听*/
	public outCardValue : number;
	/**对应胡牌数据*/
	public huData : Array<CanHuCard> = [];
}
/**自己出牌之后 根据出牌可听数据检测当前是否处于停牌等胡状态 并保存数据*/
export class CanHuCard{
	/**胡牌牌值*/
	public cardValue:number;
	/**所胡番数*/
	public fanNum : number;
	/**所胡倍数*/
	public beiNum : number;
	/**所胡牌型*/
	public HuType : Array<HuTypeEnum> = [];
}

export class HandCardGroup {
	public four : Array<number> = [];
	public three : Array<number> = [];
	public shun : Array<number> = [];
}

/***别人出牌我的操作数据*/
export class MyActionByOther{
	public canHu : boolean = false;
	public canPeng : boolean = false;
	public canGang : boolean = false;
	public canGuo : boolean = false;
	public huData : HuData = null;
	public gangValue : Array<number> = [];
	public showHu : number = 0;
}
/***结算界面个人信息item数据*/
export class OverPlayerItemInfoData{
    playerName : string;
    playerId:string;
    isZhuang : boolean;
    isPaio : boolean;
    /**-1 : 未胡牌 0-2 :123胡* */
    huType : number = -1;
    fenCount : number = 0;
} 
/**结算界面个人买吗信息数据*/
export class OverBuyHorseInfoData{
	/**座位*/
	sitNum : number;
	/**马位 0-1*/
	horesNum : number;
	/**麻将位置 100-107*/
	buyCoun : number;
	/**头像Icon*/
	playerHead : number;
	/**牌值*/
	cardValue : number;
	/**积分*/
	fen:number;
	/**玩家信息 */
	playerInfo:PlayerInfo;
	/**买马次数*/
	sumbuyCount:number
}

export class RealTimePreformanceData {
	/**当前手数 */
	curHand: number;
	/**座位信息 */
	sitInfoArr: SitInfo[];
	/**游戏结束信息 */
	gameResultArr:GameResultInfo[];
	/**游戏得分 */
	gameSoreArr:GameScoreInfo[];
	/**规则 */
	gameRuleArr:RoomTableInfo;
	/**胡牌数组 */
	hupaiArr: number[];
	/**胡牌类型  自摸、点炮 */
	zimoTypeArr:number[];
	/**当前坐庄位置 */
	nowBookMakerSit: number;
	/**飘的位置 */
	piaoSitNum:number;
	/**豹子信息 1豹子 2双豹 */
	baoziNum: number=0;
	/**当前手数结束时间戳 */
	finishTime:number=0;
	/**买马数据*/
	buyHorseInfo:HorserInfo[];
} 

export class PlayerWinRecodItemData{
	playerInfo:PlayerInfo;
	resultInfo:GameResultInfo;
	scoreEventInfo:ScoreEventInfo[];
	isZhuang : boolean;
    isPaio : boolean;
    /**-1 : 未胡牌 0-2 :123胡* */
    huType : number = -1;
    scoreCount : number = 0;
	winType:number;
	huCard:number;
	horseNum:number;
}
export class StatisPlayerInfoData {
    player: PlayerInfo;         // 玩家信息
    game_play_game: number;        // 参与游戏数
	game_tabel:number;				//对局桌子
    game_buyhorse:number;         //买马对局
    score: number;              // 积分，牌局上的积分
    bankerHScore: number;       // 庄家买马积分
    scoreHorse: number;         // 单纯买马的积分
	t_id:string;				//为了统计时区分局数
}
export class SitSortData{
	sitData:SitInfo;
	point:number;
	gpid:number;
	dice:number;
}
export class SelectHandCardData{
	isSelect:boolean;
	cardValue:number;
}
