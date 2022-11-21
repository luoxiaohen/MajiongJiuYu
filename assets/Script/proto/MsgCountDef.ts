import { MsgMajSer } from "./TableMsgDef";







/**
* Created by admin on 2022/11/4.
*/
export class MsgCountDef {
	
	// 获取统计数据的类型参数
}

export class CountType{
	public      gameType: number;       // 游戏玩法类型 GamePlayTypeEnum
	public      roomType: number;       // 游戏房间类型 GameRoomTypeEnum
	public      timeType: number;       // 统计数据事件类型 CountTimeType
}

// 统计数据事件类型
export enum CountTimeType{
	eLives,         // 生涯数据
	eDay1,          // 近一天数据
	eDay3,          // 近3天数据
	eDay7,          // 近7天数据
	eWeek4,         // 近4周数据
	
	eMax
}

// 玩家基础统计数据
export class PlayerBaseCount{
	public      fan0: number;               // 0番平胡
	public      fan1: number;               // 1番平胡
	public      fan2: number;               // 2番平胡
	public      fan3: number;               // 3番平胡及以上
	public      ddh: number;                // 对子胡
	public      jgd: number;                // 金钩钓
	public      dui7: number;               // 七对
	public      l7d: number;                // 龙七对
	public      sl7d: number;               // 双龙七对及以上
	public      qys: number;                // 清一色
	public      qd: number;                 // 清对
	public      q7d: number;                // 清七对
	public      ql7d: number;               // 清龙七对及以上
	public      qjgd: number;               // 清金钩钓
	public      y9: number;                 // 幺九
	public      jd: number;                 // 将对
	public      gameCnt: number;            // 总局数
	public      handCnt: number;            // 总手数
}

// 玩家收费统计数据
export class PlayerFeeCount{
	public      gameWinCnt: number;         // 胜利局数
	public      winScore: number;           // 累计输赢
	public      huNum1: number;             // 1走
	public      huNum2: number;             // 2走
	public      huNum3: number;             // 3走
	public      huNone: number;             // 未胡
	public      fan3Tin: number;            // 三番下叫
	public      fan3Hu: number;             // 三番胡牌
	public      passHuCnt: number;          // 过胡次数
	public      huCnt: number;              // 胡牌次数
	public      fan3Pao: number;            // 三番点炮
	public      dgCnt: number;              // 点别人直杠次数
	public      gangPao: number;            // 杠上炮次数
	public      gangHua: number;            // 杠上花次数
	public      gangCnt: number;            // 杠牌次数
	public      mqCnt: number;              // 门清胡牌次数
	public      mqRuleCnt: number;          // 有门清规则手数
	public      zzCnt: number;              // 中张胡牌次数
	public      zzRuleCnt: number;          // 有中张规则手数
	public      jx5Cnt: number;             // 卡星五胡牌次数
	public      jx5RuleCnt: number;         // 有卡星五规则手数
	public      breakNoTin: number;         // 流局未听牌次数
}

// 玩家最大收益牌型数据
export class PlayerMaxMajs{
	public   tidNum: string;             // 牌局编号+手数（牌谱Key）
	public      sit: number;                // 自己位置(显示碰杠目标时用到)
	public      baseScore: number;          // 底分
	public      zm: number;                 // 1=自摸
	public      tarCnt: number;             // 胡牌对象数量
	public      huDob: number;              // 牌型倍数
	public      score: number;              // 得分
	public      secTime: number;            // 时间戳（秒）
	public huTypes: number[];        // 事件附加说明（牌型、杠类型）（HuTypeEnum、GangTypeEnum） 可能为null
	public fanTypes: number[];       // 事件附加说明（额外加倍类型）（FanTypeEnum） 可能为null
	public lstHands: number[];       // 手牌
	public  lstPuts: MsgMajSer[];//碰杠后手牌
}

// 全服数据
export class PubBaseCount{
	public      gameCnt: number;            // 总局数
	public      handCnt: number;            // 总手数
	public      fan3Tin: number;            // 三番下叫
	public      fan3Hu: number;             // 三番胡牌
	public      passHuCnt: number;          // 过胡次数
	public      huCnt: number;              // 胡牌次数
	public      fan3Pao: number;            // 三番点炮
	public      dianGangCnt: number;        // 点别人直杠次数
	public      gangPao: number;            // 杠上炮次数
	public      gangHua: number;            // 杠上花次数
	public      gangCnt: number;            // 杠牌次数
	public      mqCnt: number;              // 门清胡牌次数
	public      mqRuleCnt: number;          // 有门清规则手数
	public      zzCnt: number;              // 中张胡牌次数
	public      zzRuleCnt: number;          // 有中张规则手数
	public      jx5Cnt: number;             // 卡星五胡牌次数
	public      jx5RuleCnt: number;         // 有卡星五规则手数
	public      breakNoTin: number;         // 流局未听牌次数
}


