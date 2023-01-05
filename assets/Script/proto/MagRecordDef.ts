/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-24 17:18:56
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-07 13:37:50
 * @FilePath: \MajiongJiuYu\assets\Script\proto\MagRecordDef.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PlayerInfo } from "./LobbyMsgDef";
import { FinalPlayerCalcInfo } from "./TableMsgDef";




/**
* Created by admin on 2022/11/21.
*/
export class MagRecordDef {
	// 玩家7日战绩基础信息
}

export class RecordUnit{
	public   tid: string;                // 房间唯一编码
	public      playerType: number;         // 参与方式：（按位取值，0=旁观，0x01=牌局；0x02=买马）
	public      baseScore: number;          // 基础底分
	public      handsCnt: number;           // 手数
	public      gameType : number;          // /**游戏玩法类型*/1=血战，2=换三  依照GamePlayTypeEnum
	public      roomType: number;           // 游戏房间类型   依照 GameRoomTypeEnum
	public   name: string;               // 房间名字
	public   icon: string;               // 房间图标
	public      endTime: number;            // 牌局结束时间戳（按秒记录）
	public      score: number;              // 牌局积分
	public      bankerHScore: number;       // 庄马积分
	public      horseScore: number;         // 买马积分
	public   crter: string;              // 房间创建者
	public   crtClub: string;            // 来自俱乐部名字
	
	// java Ignore RecordUnit()
}

// 玩家往期战绩基础信息
export class MonthRecord{
	public      ym: number;                 // 年月数字（2022年9月=202209）
	public rcd_1_1: CntScore;            // 手数积分 - 血战_四人三房
	public rcd_1_2: CntScore;            // 手数积分 - 血战_四人两房
	public rcd_1_3: CntScore;            // 手数积分 - 血战_三人两房
	public rcd_1_4: CntScore;            // 手数积分 - 血战_两人麻将
	public rcd_2_1: CntScore;            // 手数积分 - 换三_四人三房
	public rcd_2_2: CntScore;            // 手数积分 - 换三_四人两房
	// java Ignore MonthRecord()
}
export class CntScore{
	public      cnt: number;                // 手数
	public      score: number;              // 积分
	// java Ignore CntScore()
}


// 牌局详情用到的数据
export class MahjTopInfo{
	public       qs: PlayerInfo;         // 雀神
	public       jz: PlayerInfo;         // 金主
	public       pw: PlayerInfo;         // 炮王
	public       mf: PlayerInfo;         // 马匪
	// java Ignore MahjTopInfo()
}
export class MahjPlayerInfo{
	public           player: PlayerInfo; // 玩家信息
	public  info: FinalPlayerCalcInfo;   // 战绩数据
	// java Ignore MahjPlayerInfo()
}

// 战绩统计涉及的牌局积分信息
export class MahjRecordScore{
	public       player: PlayerInfo;             // 玩家信息
	public                          sit: number;                // 玩家位置（0-3是牌局，4-5是买马）
	public                          score: number;              // 积分，牌局上的积分
	public                          bankerHScore: number;       // 庄家买马积分
	public                          scoreHorse: number;         // 单纯买马的积分
}

export class MahjScoreInfo{
	public                       tid: string;                // 房间唯一编码
	public        scores: MahjRecordScore[];             // 牌局积分信息
	public                          isBankerHorse: number;      // 1=打开庄家买马
}

