// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { GamePlayTypeEnum } from "../../proto/LobbyMsgDef";
import { RecordUnit } from "../../proto/MagRecordDef";
import DialogManager from "../../Shared/DialogManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import ListItem from "../uiList/ListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SevenRecordPlayerItem extends ListItem {

    @property(cc.Label)
    week_label:cc.Label=null;
    @property(cc.Label)
    day_label:cc.Label=null;
    @property(cc.Label)
    room_name_label:cc.Label=null;
    @property(cc.RichText)
    play_type_label_1: cc.RichText = null;
    @property(cc.Label)
    game_type_label_2: cc.Label = null;
    @property(cc.Label)
    hands_label: cc.Label = null;
    @property(cc.Label)
    base_score_label:cc.Label=null;
    @property(cc.Label)
    score_label: cc.Label = null;
    @property(cc.Label)
    end_time_label:cc.Label=null;
    @property(cc.Node)
    horseNode:cc.Node=null;
    @property(cc.RichText)
    game_score_label:cc.RichText=null;
    @property(cc.RichText)
    horse_score_label:cc.RichText=null;

    @property(cc.Label)
    create_name_label:cc.Label=null;
    @property(cc.Sprite)
    player_head_sprite:cc.Sprite=null;
    @property(cc.Sprite)
    game_type_sprite:cc.Sprite=null;

    @property(cc.Toggle)
    private chose_toggle:cc.Toggle=null;
    @property(cc.Label)
    flag_statis:cc.Label=null;
    @property(cc.Sprite)
    cha_sprite:cc.Sprite=null;
    // LIFE-CYCLE CALLBACKS:
    private recodData:RecordUnit=null;
    private tid:string="";
    private basePath="smallOver/resource/game_jstouxxiang";
    private isFirst:boolean=true;
    private _item_index: number;
    public get item_index(): number {
        return this._item_index;
    }
    public set item_index(value: number) {
        this._item_index = value;
    }
    
    initeValue(recodData:RecordUnit,isfirst:boolean,index:number):void{
        this._item_index=index;
        this.tid=recodData.tid;
        this.recodData=recodData;
        this.play_type_label_1.string=Global.Utils.getGameNameByGameType(recodData.gameType);
        this.game_type_label_2.string=Global.Utils.getGameTypeNameByGameType(recodData.roomType);
        this.hands_label.string=recodData.handsCnt.toString()+"手";
        this.room_name_label.string=recodData.name;
        let creatorStr="";
        if(recodData.crter){
            creatorStr+=recodData.crter;
        }
        if(recodData.crtClub){
            creatorStr+=`(${recodData.crtClub})`;
        }
        this.create_name_label.string=creatorStr;
        
        // Global.CCHelper.updateSpriteFrame(this.basePath+recodData.icon,this.player_head_sprite);
        this.setPlayerTypeStr_1(recodData.playerType);
        this.base_score_label.string=recodData.baseScore+"";
        this.end_time_label.string=Global.Utils.timestampToTime(recodData.endTime*1000,3);
        let dayArr=Global.Utils.getTimesNumArrByTamp(recodData.endTime*1000);
        this.day_label.string=dayArr[1]+"-"+dayArr[2];
        let weekStr=Global.Utils.getWeekStrByTamp(recodData.endTime*1000)
        this.week_label.string=weekStr;
        let sumScore=recodData.score+recodData.bankerHScore+recodData.horseScore;
        let gameScore=recodData.score;
        let horseSccore=recodData.bankerHScore+recodData.horseScore;
        //#B50D0D  #108832
        let gameScoreStr=gameScore>=0?("<color=#B50D0D>+"+gameScore+"</c>"):("<color=#108832>"+gameScore+"</c>");
        let horseNumStr=horseSccore>=0?("<color=#B50D0D>+"+horseSccore+"</c>"):("<color=#108832>"+horseSccore+"</c>");
        Global.CCHelper.setLabelColorByValue(this.score_label,sumScore);

        if(recodData.playerType==3){
            this.game_score_label.string=gameScoreStr;
            this.horse_score_label.string=horseNumStr;
            this.horseNode.active=true;
            // this.horse_label.string=`<color=#4b565b>(对局</c>${gameScoreStr}<color=#4b565b>,买马</color>${horseNumStr}<color=#4b565b>)</c>`;
        }else{
            this.horseNode.active=false;
        }
        if(recodData.playerType==0){
            this.horseNode.active=false;
            this.score_label.string="";
        }
        if(recodData.gameType==GamePlayTypeEnum.HuanSanZhang){
            Global.CCHelper.updateSpriteFrame("gameRecord/resource/createRoom_huansan",this.game_type_sprite);
        }else if(recodData.gameType==GamePlayTypeEnum.XueZhanDaoDi){
            Global.CCHelper.updateSpriteFrame("gameRecord/resource/createRoom_xuezhan",this.game_type_sprite);
        }else{
            this.game_type_sprite.node.active=false;
        }
    
        this.isFirst=isfirst;
        this.week_label.node.active=this.isFirst;
        this.day_label.node.active=this.isFirst;
        this.flag_statis.node.active=GameInfo.ins.recordStatisticsIDs.includes(recodData.tid);
        this.cha_sprite.node.active=false;
    }

    private setPlayerTypeStr_1(playerType:number):void{
        //（按位取值，0=旁观，0x01=牌局；0x02=买马）
        let first=playerType&1;
        let second=playerType&2;
        if(first==1&&second==2){
            this.play_type_label_1.string=`<color=#fe8a29>对局</c>/<color=#589bfb>买马</color>`;//"对局/买马";  3
        }else if(first==1){
            this.play_type_label_1.string="<color=#fe8a29>对局</c>";    //1
        }else if(second==2){
            this.play_type_label_1.string="<color=#589bfb>买马</color>";    //2
        }else{
            this.play_type_label_1.string="观战";
        }
    }

    onToggleBtnClick():void{
        Global.EventCenter.dispatchEvent(EventType.onSevenPlayerRecordChosed,{index:this.item_index,state:this.chose_toggle.isChecked});
    }

    public setChoseState(isshowChoose:boolean):void{
        this.week_label.node.active=!isshowChoose&&this.isFirst;
        this.day_label.node.active=!isshowChoose&&this.isFirst;
        if(this.recodData.playerType==0){
            this.chose_toggle.node.active=false;
            this.cha_sprite.node.active=isshowChoose;
            return;
        }
        this.chose_toggle.node.active=isshowChoose;
        if(!isshowChoose){
            this.chose_toggle.isChecked=false;
        }
    }

    public getChooseToggleValue():boolean{
        return this.chose_toggle.isChecked;
    }
    public setChooseToggleValue(value:boolean):void{
        this.chose_toggle.isChecked=value;
    }
    public getRecordUnitData():RecordUnit{
        return this.recodData;
    }

    // update (dt) {}
}
