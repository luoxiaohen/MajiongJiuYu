// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DismissPlayerItem extends UIBase {
    // LIFE-CYCLE CALLBACKS:

    private player_head_sprite:cc.Sprite;
    private player_name_label:cc.Label;
    private player_id_label:cc.Label;
    private agree_label:cc.Node;
    private nochoose_label:cc.Node;
    private _sitInfo: SitInfo;
    public get sitInfo():SitInfo{
        return this._sitInfo;
    }
    public set sitInfo(value: SitInfo) {
        this._sitInfo = value;
    }
    private _voteState: number;
    public get voteState(): number {
        return this._voteState;
    }
    public set voteState(value: number) {
        this._voteState = value;
    }
    onLoad () {
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.player_id_label=this.node.getChildByName("player_id_label").getComponent(cc.Label);
        this.agree_label=this.node.getChildByName("agree_label");
        this.nochoose_label=this.node.getChildByName("nochoose_label");
        this.voteState=0;
    }

    start () {

    }
    initeValue(sitInfo:SitInfo):void{
        if(!sitInfo){
            return;
        }
        this.sitInfo=sitInfo;
        Global.CCHelper.updateSpriteFrame("",this.player_head_sprite);
        this.player_name_label.string=sitInfo.player.nike;
        this.player_id_label.string="ID:"+sitInfo.player.aid+"";
    }
    /**
     * @param state 
     * 0:未选择 1:已选择
     */
    updateState(state:number):void{
        this.nochoose_label.active=state==0;
        this.agree_label.active=state==1;
        this.voteState=state;
    }

    // update (dt) {}
}
