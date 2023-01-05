/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-23 11:54:40
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-25 10:36:17
 * @FilePath: \MajiongJiuYu\assets\Script\UI\buyHorse\MyHorsePanel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_SC_HorseRoomInfo } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import MyHorseItem from "./MyHorseItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyHorsePanel extends UIBase {
    @property (cc.Label)
    allHorseLabel : cc.Label = null;
    @property (cc.Label)
    openHorseLabel : cc.Label = null;
    @property (cc.Label)
    closeHorseLabel : cc.Label = null;
    @property (cc.Node)
    itemGroup : cc.Node = null;

    protected onLoad(): void {
        this.createElements();
    }

    private createElements(){
        this.allHorseLabel.string = "当前买马总桌数:" + UserInfo.ins.myBuyHorseArr.length;
        this.openHorseLabel.string = "已开局:" + this.getOpenLen();
        this.closeHorseLabel.string = "未开局:" + this.getCloseLen();
        let item : MyHorseItem;
        for(let i = 0 ; i < UserInfo.ins.myBuyHorseArr.length ; i++){
            item = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/MyHorseItem")).getComponent(MyHorseItem)
            item.setNewData(UserInfo.ins.myBuyHorseArr[i]);
            this.itemGroup.addChild(item.node);
            item.node.x = -515;
        }
    }

    private getOpenLen():number{
        let item : Msg_SC_HorseRoomInfo;
        let openIndex:number = 0;
        for(let i = 0 ; i < UserInfo.ins.myBuyHorseArr.length ; i++){
            item = UserInfo.ins.myBuyHorseArr[i];
            if(item.isStart == 1){
                openIndex++;
            }
        }
        return openIndex;
    }
    private getCloseLen():number{
        let item : Msg_SC_HorseRoomInfo;
        let openIndex:number = 0;
        for(let i = 0 ; i < UserInfo.ins.myBuyHorseArr.length ; i++){
            item = UserInfo.ins.myBuyHorseArr[i];
            if(item.isStart == 0){
                openIndex++;
            }
        }
        return openIndex;
    }

    onCloseClick(){
        this.disTory();
    }
}
