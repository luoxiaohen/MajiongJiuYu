// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HallShopVipItem from "./HallShopVipItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallShopPackageItem extends HallShopVipItem {
    @property(cc.Label)
    get_gold_label:cc.Label=null;
    public initeValue(data: any): void {
        this.item_type=data.type;
        this.type_cost.string=data.cost+"";
        this.type_label.string=data.title+"";
        this.get_gold_label.string=data.getAward+"";
    }
}
