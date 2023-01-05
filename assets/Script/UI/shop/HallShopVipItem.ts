// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallShopVipItem extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Sprite)
    type_sprite:cc.Sprite=null;
    @property(cc.Label)
    type_label:cc.Label=null;
    @property(cc.Label)
    type_cost:cc.Label=null;

    protected item_type:number=0;
    // onLoad () {} 

    start () {

    }
    initeValue(data:any):void{
        this.item_type=data.type;
        this.type_cost.string =data.cost+"";
        switch(this.item_type){
            case 1:
                this.type_label.string = "银卡";
                Global.CCHelper.updateSpriteFrame("shop/resource/jichu_yink", this.type_sprite);
                break;
            case 2:
                this.type_label.string = "金卡";
                Global.CCHelper.updateSpriteFrame("shop/resource/jichu_jink", this.type_sprite);
                break;
            case 3:
                this.type_label.string = "钻石卡";
                Global.CCHelper.updateSpriteFrame("shop/resource/jichu_zuanshik", this.type_sprite);
                break;
        }
    }
    onClickBuyItem():void{
        Global.Utils.dialogOutTips("点击购买：  "+this.item_type);
    }

    // update (dt) {}
}
