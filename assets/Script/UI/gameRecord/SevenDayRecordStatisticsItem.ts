// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MahjRecordScore} from "../../proto/MagRecordDef";
import { Global } from "../../Shared/GloBal";
import { StatisPlayerInfoData } from "../../utils/InterfaceHelp";
import ListItem from "../uiList/ListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SevenDayRecordStatisticsItem extends ListItem {

    @property(cc.Label)
    num_label: cc.Label = null;
    @property(cc.Sprite)
    head_sprite: cc.Sprite = null;
    @property(cc.Label)
    player_name_label: cc.Label = null;
    @property(cc.Label)
    player_id_label: cc.Label = null;
    @property(cc.Label)
    game_sum_label: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.RichText)
    game_detail_label: cc.RichText = null;
    @property(cc.Label)
    score_label: cc.Label = null;
    @property(cc.RichText)
    score_detail_label: cc.RichText = null;

    @property(cc.Node)
    sumgameNode:cc.Node=null;
    @property(cc.Node)
    horseDataNode:cc.Node=null;

    private sumLabelCommonY=30;
    private socreLabelCommonY=24;
    // onLoad () {}

    start () {

    }
    initeValue(info:StatisPlayerInfoData,index:number):void{
        this.num_label.string=(index+1)+"";
        this.player_name_label.string=info.player.nike;
        this.player_id_label.string="id:  "+info.player.aid;
        Global.CCHelper.setLabelColorByValue( this.score_label,info.score+info.bankerHScore+info.scoreHorse);
        let sumHorseScore=info.scoreHorse+info.bankerHScore;
        let gameScore=info.score;
        this.game_sum_label.string=info.game_play_game+"";
        this.sumgameNode.active=info.game_buyhorse>0;
        this.horseDataNode.active=info.game_buyhorse>0;
        if(info.game_buyhorse>0){
            this.game_detail_label.string=`<color=#646a73>对局</c><color=#9ba6aa>${info.game_tabel},</c><color=#646a73>买马</c><color=#9ba6aa>${info.game_buyhorse}</c>`;
            let gameScoreStr=gameScore>=0?("<color=#B50D0D>+"+gameScore+"</c>"):("<color=#108832>"+gameScore+"</c>");
            let horseNumStr=sumHorseScore>=0?("<color=#B50D0D>+"+sumHorseScore+"</c>"):("<color=#108832>"+sumHorseScore+"</c>");
            this.score_detail_label.string=`<color=#4b565b>对局</c>${gameScoreStr}<color=#4b565b>,买马</color>${horseNumStr}`;
            this.game_sum_label.node.y=this.sumLabelCommonY;
            this.score_label.node.y=this.socreLabelCommonY;
        }else{
           this.game_sum_label.node.y=0;
           this.score_label.node.y=0;
        }
        //("<color=#B50D0D>+"+gameScore+"</c>"):("<color=#108832>"+gameScore+"</c>")
      

    }

    // update (dt) {}
}
