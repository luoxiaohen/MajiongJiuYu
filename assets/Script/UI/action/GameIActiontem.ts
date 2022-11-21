/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-17 17:15:53
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-18 18:07:59
 * @FilePath: \MajiongJiuYu\assets\Script\UI\action\GameIActiontem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayStauteEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_GangSelfMsg, Msg_CS_HuMajMsg, Msg_CS_PassMsg, Msg_CS_PengMajMsg } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { EatCardClass, MyActionByOther } from "../../utils/InterfaceHelp";
import MajiongHandCard from "../card/MajiongHandCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameIActiontem extends UIBase {
    @property (cc.Sprite)
    gangBtn : cc.Sprite = null;
    @property (cc.Sprite)
    guoBtn : cc.Sprite = null;
    @property (cc.Sprite)
    pengBtn : cc.Sprite = null;
    @property (cc.Sprite)
    huBtn : cc.Sprite = null;
    @property (cc.Sprite)
    cardValueImage : cc.Sprite = null;
    @property (cc.Label)
    fenLabel : cc.Label = null;
    @property (cc.Node)
    huGroup : cc.Node = null;
    @property (cc.Node)
    pengMoreGroup : cc.Node = null;
    @property (cc.Node)
    moreBtnGroup : cc.Node = null;
    private actionData:MyActionByOther;
    protected onLoad(): void {
        this.actionData = this.dialogParameters;
        this.pengMoreGroup.active = false;
        this.moreBtnGroup.active = true;
        this.initItem();
    }
    private initItem(){
        this.guoBtn.node.active = this.actionData.canGuo;
        this.gangBtn.node.active = this.actionData.canGang;
        this.pengBtn.node.active = this.actionData.canPeng;
        this.huGroup.active = this.actionData.canHu;
        if(this.actionData.canHu){
            this.showHuGroup();
        }
    }
    private showHuGroup(){
        let newSource : string = "majiongCard/resource/" + Global.Utils.getCardStrByValue(this.actionData.huData.cardValue);
        Global.Utils.setNewImageToSprite(this.cardValueImage , newSource);
        this.fenLabel.string = this.actionData.huData.fanNum.toString();
    }
    /**碰*/
    onPengClick(){
        let msg : Msg_CS_PengMajMsg = new Msg_CS_PengMajMsg();
        msg.isGang = 0;
        Global.mgr.socketMgr.send(-1,msg);
        this.disTory();
    }
    /**杠*/
    onGangClick(){
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.PlayCard){
            let selfGameArr:Array<number> = UserInfo.ins.getSelfGang();
            let buGameArr:Array<number> = UserInfo.ins.getBuGang();
            if(selfGameArr.length + buGameArr.length > 1){
                this.pengMoreGroup.active = true;
                this.moreBtnGroup.active = false;
                let aaa:Array<number> = selfGameArr.concat(buGameArr);
                for(let i = 0 ; i < aaa.length  ; i++){
                    let hand : MajiongHandCard = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongHandCard")).getComponent(MajiongHandCard);
                    hand.cardValue = aaa[i];
                    hand.isLoadShow = true;
                    hand.bySelfPoint = 0;
                    hand.node.x = i*hand.cardSize._w + i*20
                    this.pengMoreGroup.addChild(hand.node);
                    hand.node.on(cc.Node.EventType.TOUCH_START , this.onCardItemClick , this)
                }
            }else{
                if(UserInfo.ins.getSelfGang().length > 0){
                    let msg : Msg_CS_GangSelfMsg = new Msg_CS_GangSelfMsg();
                    msg.majID = UserInfo.ins.getSelfGang()[0];
                    Global.mgr.socketMgr.send(-1 , msg);
                }else if(UserInfo.ins.getBuGang().length > 0){
                    let msg : Msg_CS_GangSelfMsg = new Msg_CS_GangSelfMsg();
                    msg.majID = UserInfo.ins.getBuGang()[0];
                    Global.mgr.socketMgr.send(-1 , msg);
                }
                this.disTory();
            }
        }else{
            let msg : Msg_CS_PengMajMsg = new Msg_CS_PengMajMsg();
            msg.isGang = 1;
            Global.mgr.socketMgr.send(-1,msg);
            this.disTory();
        }
    }
    private onCardItemClick(e:cc.Event){
        let item :MajiongHandCard = e.currentTarget.getComponent(MajiongHandCard);
        if(UserInfo.ins.getSelfGang().indexOf(item.cardValue) >= 0){
            let msg : Msg_CS_GangSelfMsg = new Msg_CS_GangSelfMsg();
            msg.majID = item.cardValue;
            Global.mgr.socketMgr.send(-1 , msg);
        }else if(UserInfo.ins.getBuGang().indexOf(item.cardValue) >= 0){
            let msg : Msg_CS_GangSelfMsg = new Msg_CS_GangSelfMsg();
            msg.majID = item.cardValue;
            Global.mgr.socketMgr.send(-1 , msg);
        }
        this.disTory();
    }
    /**胡*/
    onHuClick(){
        let msg : Msg_CS_HuMajMsg = new Msg_CS_HuMajMsg();
        Global.mgr.socketMgr.send(-1,msg);
        this.disTory();
    }
    /**过*/
    onGuoClick(){
        Global.mgr.socketMgr.send(-1 , new Msg_CS_PassMsg());
        this.disTory();
    }

    disTory(){
        super.disTory();
    }
}
