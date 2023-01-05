// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CntScore, MonthRecord } from "../../proto/MagRecordDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PastGameRecordItem extends UIBase {

    @property(cc.Label)
    mothlabel: cc.Label = null;
    @property(cc.Label)
    yearlabel: cc.Label = null;

    @property(cc.Label)
    game_type_1: cc.Label = null;
    @property(cc.Label)
    game_type_2: cc.Label = null;
    @property(cc.Label)
    hands_label: cc.Label = null;
    @property(cc.Label)
    score_label: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    //public rcd_1_1: CntScore;            // 手数积分 - 血战_四人三房
	// public rcd_1_2: CntScore;            // 手数积分 - 血战_四人两房
	// public rcd_1_3: CntScore;            // 手数积分 - 血战_三人两房
	// public rcd_1_4: CntScore;            // 手数积分 - 血战_两人麻将
	// public rcd_2_1: CntScore;            // 手数积分 - 换三_四人三房
	// public rcd_2_2: CntScore;            // 手数积分 - 换三_四人两房
    initeValue(data:CntScore,type1:number,type2:number,ym,mothArr:string[]):void{
        let isFirst = !mothArr.includes(ym.toString());
        if (isFirst) {
            mothArr.push(ym.toString()) 
        }
        this.mothlabel.string = (ym % 100) + "月";
        this.yearlabel.string = Math.floor(ym / 100) + "";
        this.mothlabel.node.active=isFirst;
        this.yearlabel.node.active=isFirst;
     
        this.setGameRoomTypeStr(type1, type2);
        if (data) {
            this.hands_label.string = data.cnt + "局";
            Global.CCHelper.setLabelColorByValue(this.score_label,data.score);
        }
    }
    private setGameRoomTypeStr(gameType:number,roomType:number):void{
        this.game_type_1.string=Global.Utils.getGameNameByGameType(gameType);
        this.game_type_2.string=Global.Utils.getGameTypeNameByGameType(roomType);
    }
 

    // update (dt) {}
}
