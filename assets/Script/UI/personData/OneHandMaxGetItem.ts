// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Msg_SC_MaxScoreMajs } from "../../proto/LobbyMsg";
import { PlayerMaxMajs } from "../../proto/MsgCountDef";
import { Global } from "../../Shared/GloBal";
import OverHandCardItem from "../over/OverHandCardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OneHandMaxGetItem extends cc.Component {
    @property(cc.Label)
    base_score_label:cc.Label=null;
    @property(cc.Label)
    hupai_type_label:cc.Label=null;
    @property(cc.Label)
    card_times_label:cc.Label=null;
    @property(cc.Label)
    finail_score_lable:cc.Label=null;
    @property(cc.Label)
    game_rule_label:cc.Label=null;
    @property(cc.Label)
    finish_time_label:cc.Label=null;

    @property(cc.Node)
    play_back_btn:cc.Node=null;

    @property(cc.Node)
    data_root:cc.Node=null;
    @property(cc.Node)
    none_root:cc.Node=null;
    @property(cc.Node)
    cards_root:cc.Node=null;
    // onLoad () {}
    @property(OverHandCardItem)
    private overHandCardItem:OverHandCardItem=null;
    start () {

    }
    private ishaveData=false;
    IniteValue(data:Msg_SC_MaxScoreMajs=null):void{
        let haveData=!!data;
        this.setItemShowState(haveData);
        this.overHandCardItem.node.active=false;
        if(haveData){
            this.setItemValue(data);
        }
    }
    private setItemShowState(haveData:boolean):void{
        this.ishaveData=haveData;
        this.data_root.active=haveData;
        this.none_root.active=!haveData;
        let btn_bg_1=this.play_back_btn.getChildByName("bg_1");
        let btn_bg_2=this.play_back_btn.getChildByName("bg_2");
        btn_bg_1.active=haveData;
        btn_bg_2.active=!haveData;
    }
    private setItemValue(data:Msg_SC_MaxScoreMajs):void{
        let info=data.info;
        this.base_score_label.string=info.baseScore+"";
        this.card_times_label.string=info.huDob+"";
        this.finail_score_lable.string=info.score+"";
        this.finish_time_label.string=Global.Utils.timestampToTime(info.secTime*1000,0,"/");

        if(info.zm){
            this.hupai_type_label.string="自摸"+info.tarCnt+"家";
        }else{
            this.hupai_type_label.string="接炮"+info.tarCnt+"家";
        }

        // let huCatd : number= GameInfo.ins.hupaiArr[resultInfo.sitNum] ? GameInfo.ins.hupaiArr[resultInfo.sitNum] : -1;
        this.overHandCardItem.setNewData(info.lstPuts , info.lstHands , 0,0.5,info.sit);
        // this.overHandCardItem.setNewData([] , [1,1,1,2,3,4,4,5,6,7,8,9,9,9] , 0,0.5,info.sit);

        this.overHandCardItem.node.active=true;
        this.setGameRuleLable(info);
      
    }
    private setGameRuleLable(info: PlayerMaxMajs):void{
        let paxingStr="";
        for(let item of info.fanTypes){
            let str_1=Global.Utils.getAllFanStr(item);
            if(str_1!=""&&!paxingStr.includes(str_1)){
                paxingStr+=str_1;
            }
        }
        for(let item of info.huTypes){
            let str_1=Global.Utils.getAllHuStr(item);
            if(str_1!=""&&!paxingStr.includes(str_1)){
                paxingStr+=str_1;
            }
            let str_2=Global.Utils.getAllGangStr(item);
            if(str_2!=""&&!paxingStr.includes(str_2)){
                paxingStr+=str_2;
            }
        }
        this.game_rule_label.string=paxingStr;
    }
    onPlayBackBtn():void{
        if(this.ishaveData){
            Global.Utils.dialogOutTips("功能未开放！");
            return;
        }
    }

    // update (dt) {}
}
