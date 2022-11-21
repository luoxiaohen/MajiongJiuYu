// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EnumManager extends cc.Component {
}

 /**牌类枚举**/
 export enum CardTypeEnum{
	Wan,
	Tiao,
	Tong,
	EndValue
}
/***位置枚举*/
export enum DirectionEnum{
	/**东*/
	Dong,
	/**北*/
	Bei,
	/**西*/
	Xi,
	/**南*/
	Nan,
}
/***牌组相对于第一视角的位置定义*/
export enum CardGroupPointBySelfEnum{
	Self,
	Down,
	Opp,
	Up
}
/**开牌状态机*/
export enum PlayStauteEnum{
	/**观战**/
	LookGame,
	/**坐下*/
	Stand,
	/**准备*/
	Ready,
	/**掷庄*/
	ThrowBookMaker,
	/**矫座*/
	ChangeChar,
	/**定庄*/
	CheckBookMaker,
	/**砌牌*/
	PileCard,
	/**掷先*/
	ThrowFrist,
	/**摸手牌*/
	DrawHandCard,
	/**换三张*/
	ChangeThree,
	/**定缺*/
	CheckDice,
	/**摸新牌*/
	DrawNewCard,
	/**等待操作*/
	WaitOperate,
	/**出牌*/
	PlayCard,
	/**停牌**/
	StopCard,
	/**胡牌*/
	HuCard,
	/**小局结束*/
	EndInnings,
	/**小结算*/
	SmallGameSettlement,
	/**大结算*/
	BigGameSettlement,

	EndValue
}

/**吃碰杠胡过*/
export enum PlayEatTypeEnum{
	Peng,
	Gang,
	Hu,
	Guo
}

/**碰杠枚举*/
export enum EatCardEnum {
	/**碰对家*/
	EatOpposite,
	/**碰上家*/
	EatUp,
	/**碰下家*/
	EatDown,
	/**杠对家*/
	CrossOpposite,
	/**杠上家*/
	CrossUp,
	/**杠下家*/
	CrossDown,
	/**暗杠*/
	CrossSelf,
	/**巴杠上家*/
	CrossAllUp,
	/**巴杠下家*/
	CrossAllDown,
	/**巴杠对家*/
	CrossAllOpp,
	EndValue
}

/**摸牌来源*/
export enum FeelTypeEnum{
	/**常规摸牌*/
	CommonFeel,
	/**杠后摸牌*/
	GangFeel,
}
/**底注翻倍枚举**/
export enum AntesMultipleEnum{
	None,
	/**基础倍率*/
	initial,
	/**买马加倍*/
	openBuyHorse,
	/**飘加倍*/
	openDouble,
	/**16手加倍*/
	moreHand,
	/**换三加倍*/
	changeThree,
	/**庄家必买马加倍*/
	openBookmakerMustBuyHorse,
	EndValue
}

/**转盘元素状态 */
export enum TurnTableItemStateEnum{
	None,
	/**当前玩家回合 */
	CurrentRound,
	/**非当前玩家回合 */
	NotInRound,
	/**海底状态下 玩家回合 */
	CurRoundInSeabed,
	/**海底状态  非玩家回合 */
	NotCurRoundInSeabed,
	/**玩家结束状态 */
	Finish,
}

export enum BigOverTypeEnum{
	/**无马 */
	None,
	/**有马 */
	BuyMa,
	/**庄马 */
	ZhuangMa,
}

export enum GameRuleTypeEnum{
	FengDing=0,
	ZiMo,
	GameType,
	Baozi,
	ShuangBao,
	BaoYu,
	JiShiYu,
	LiangGangTongChuan,
	MenQing,
	ZhongZhang,
	YaoJiu,
	JiangDui,
	TianDiHu,
	JiaXinWu,
	LunZhuang,
	TiFan,
	GuoShouHu,
	LiangFenQiHu,
	ZuiHouSiZhang,
	ChaDaHu,
	DianGangHua,
	ShaiTaiYang,
	ZiMoLiangPai,
	ShiShiJieSuan,
}