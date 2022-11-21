import { TableRuleInfo } from "./LobbyMsgDef";
import { SitInfo, SitQueInfo, GameResultInfo, GameScoreInfo, ScoreEventInfo, MsgMajSer } from "./TableMsgDef";





/**
* Created by admin on 2022/8/3.
*/
export class MahjStepMsgDef {
}

export class BaseStepRcd{
	public     time: number;   // 记录时间，单位毫秒
	public      sid: number;    // 条目信息类型，直接使用了BaseIDMsg中的sid
	public   name: string;
	// java Ignore 
}

// 牌谱记录的简要信息，大厅打开牌谱列表中的内容
export class RcdSummInfo{
	public   tid: string;                    // 牌桌ID
	public   icon: string;                   // 俱乐部或创建者Icon
	public   roomName: string;               // 房间名称
	public   crtName: string;                // 创建者或俱乐部名字
	public      ruleType: number;               // 玩法类型-血战到底or换三张
	public      roomType: number;               // 玩法类型-四人三房or三人两房…
	public      baseScore: number;              // 底分
	public      handsCnt: number;               // 手数
	public      completeCnt: number;            // 实际完成手数
	
	public      partakeType: number;            // 参与方式，1=对局，2=买马，3=对局+买马
	public      horseCnt: number;               // 买马人数
	public      time: number;                   // 结束时间(时间戳单位秒)
}

// 牌谱记录列表单元信息
export class RcdSummUnit{
	public  roomSumm: RcdSummInfo;           // 简要信息
	public          winScore: number;           // 个人积分输赢
	public          handNum: number;            // 第几手，从0开始（仅限牌谱记录，历史记录=-1）
}

// 公共存储的参与者信息和积分
export class RcdSummScoreInfo{
	public          aid: number;
	public          sit: number;
	public       nike: string;
	public       face: string;
	public          winScore: number;
}



export class SitsStepRcd extends BaseStepRcd{
	public players: SitInfo[];       // 刷新玩家位置
	public rule: TableRuleInfo;          // 牌局规则
}

export class StartGameStepRcd extends BaseStepRcd{
	public      diceBig: number;            // 骰子数1
	public      diceSmall: number;          // 骰子数2
	public      bankerSite: number;         // 桩位
	public      startHands: number;         // 第几手
	public      baozi: number;              // 是否有豹子(0=无；1=豹子；2=双豹)
	public      piaoSit: number;            // 飘家位置，没有飘家则=-1
	public      horseType: number;          // 1=活马，2=死马
	public      horseMajNum1: number;       // 被买走的马位置号，没有 = -1
	public      horseMajNum2: number;       // 被买走的马位置号，没有 = -1
}

export class YouMajStepRcd extends BaseStepRcd{
	public           sit: number;               // 当前位置
	public lstMajID: number[];          // 手牌列表
}

export class StartChange3StepRcd extends BaseStepRcd{
}

export class You3StepRcd extends BaseStepRcd{
	public              sit: number;               // 当前位置
	public    lstOuts: number[];            // 换出三张牌
	public    lstMajID: number[];           // 换入三张牌
	public              bigNum: number;
	public              smlNum: number;
	public              type: number;               // 换三张的方式，也可以用上面的骰子推算
	public              baozi: number;              // 最后修正豹子(0=无；1=豹子；2=双豹)
}

export class StartDingQueStepRcd extends BaseStepRcd{
}

export class QueRsltStepRcd extends BaseStepRcd{
	public infos: SitQueInfo[];
}

export class SomeTurnStepRcd extends BaseStepRcd{
	public siteNum: number;                     // 现在摸牌的玩家
	public remPoolsNum: number;                 // 摸后牌墙剩余数量
}

export class GetMajStepRcd extends BaseStepRcd{
	public              sit: number;               // 当前位置
	public              majID: number;             // 万条筒的顺序（1-29）
	public              pickWay: number;           // 取得方式（0-2=摸碰杠）
}

export class PassStepRcd extends BaseStepRcd{
	public              sit: number;               // 当前位置
}

export class DownMajStepRcd extends BaseStepRcd{
	public              downSiteNum: number;
	public              majID: number;
}

export class PengMajStepRcd extends BaseStepRcd{
	public              pengSiteNum: number;        // 碰或杠的位置
	public              majID: number;              // 牌ID
	public              isGang: number;             // 0=碰，1=杠
	public              fromSiteNum: number;        // 打出的位置
}

export class GangSelfStepRcd extends BaseStepRcd{
	public              pengSiteNum: number;        // 杠的位置
	public              isPapo: number;             // 0=原手杠，1=碰了之后的杠
	public              majID: number;
}

export class HuMajStepRcd extends BaseStepRcd{
	public              huSit: number;              // 胡牌的位置
	public              zmType: number;             // 0=平湖，1=自摸；2=杠上花；3=杠上炮；4=抢杠胡
	public              tarSit: number;             // 点炮对象位置；如果是点杠花，这里就是点杠的人，如果是抢杠胡，这里是杠牌的人
	public              majID: number;              // 自摸亮牌，或平胡时所胡的牌
	public              huNum: number;              // 本次胡牌是第几批胡牌的，从0开始
	public              huCnt: number;              // 本次胡牌的人数
}

export class GameResultStepRcd extends BaseStepRcd{
	public isBreak: number;                             // 1=打黄
	public results: GameResultInfo[];// 结算列表
}

export class ScoreListStepRcd extends BaseStepRcd{
	public  lstScore: GameScoreInfo[];
}

export class ScoreTypeStepRcd extends BaseStepRcd{
	public   info: ScoreEventInfo;
	//        public int                          curSit;             // 自己位置
	//        public int                          majid;              // 对象牌ID
	//        public List<Integer>                tarSits;            // 对象位置(0-5，其中4-5是1、2马)
	//        public List<Integer>                tarSitsEx;          // 附加对象（擦挂）
	//        public int                          scoreType;          // 积分类型（事件类型）ScoreTypeEnum
	//        public List<Integer>                huGangTypes;        // 事件附加说明（牌型、杠类型）（HuTypeEnum、GangTypeEnum） 可能为null
	//        public List<Integer>                fanTypes;           // 事件附加说明（额外加倍类型）（FanTypeEnum） 可能为null
	//        public int                          param;              // 事件参数，比如根的数量
	//        public int                          win;                // 积分输赢
}

// 备选记录，用于调试或者可能发生的异常情况的信息记录，只有一个字符串用于记录信息
export class BackTempStepRcd extends BaseStepRcd{
	public   content: string;
}


///////////////////////////////////////////////////////////
// 历史牌局中的个人信息
export class RcdHandsPlayer{
	public              sit: number;            // 位置
	public              aid: number;            // 玩家账号唯一ID
	public           nike: string;           // 昵称
	public           face: string;           // 头像
	public              huNum: number;          // 第几波胡牌的，从0开始
	public    hands: number[];          // 手牌
	public  puts: MsgMajSer[];// 碰杠列表
	public              horseNum: number;       // 马数量
	public              scoreType: number;      // 积分类型（事件类型）ScoreTypeEnum
	public              winScore: number;       // 输赢积分
	public     huTypes: number[];        // 事件附加说明（牌型）（HuTypeEnum） 可能为null
	public     fanTypes: number[];       // 事件附加说明（额外加倍类型）（FanTypeEnum） 可能为null
	public              genCnt: number;         // 如果上面有根，表示根的数量
}

// 历史牌局的简要信息，房间内牌谱的信息
export class RcdHandsInfo{
	public                      handsNum: number;   // 手数
	public                      bankerSit: number;  // 庄位
	public                      piaoSit: number;    // 飘位置（-1=没有）
	public                      time: number;       // 结束时间(时间戳单位秒)
	public                      baozi: number;      // 豹子
	public     players: RcdHandsPlayer[];    // 各玩家信息
}


