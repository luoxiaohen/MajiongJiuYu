// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeThreeTips extends UIBase {

    @property(cc.Button)
    changeBtn: cc.Button = null;

    protected onLoad(): void {
        
    }

    setBtnEnabled(boo){
        this.changeBtn.enabled = boo;
        // Global.Utils.setGray(cc.find("/Background" , this.changeBtn.node).getComponent(cc.Sprite) , !boo);
    }
    onChangeClick(){
        Global.EventCenter.dispatchEvent(EventType.OnChangThreeClick);
    }


    disTory(){
        super.disTory();
    }
}
