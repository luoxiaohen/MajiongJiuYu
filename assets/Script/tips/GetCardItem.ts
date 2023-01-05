// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GetCardItem extends UIBase {
    @property(cc.Sprite)
    cardValueImage : cc.Sprite = null;
    @property(cc.Sprite)
    haveNumImage : cc.Sprite = null;

    private have:number;
    private cardValue:number;
    private clickFun : Function;
    private thisObj;
    protected onLoad(): void {
        
    }
    setData(cardValue : number , have:number=-1 , clickFun , thisObj ){
        this.clickFun = clickFun;
        this.have = have;
        this.cardValue = cardValue;
        this.thisObj = thisObj;
        if(have >= 0){
            this.haveNumImage.node.active = true;
			let source : string =  "tips/HuPaiTiShiTips/resource/game_biaoqian" + have;
            Global.Utils.setNewImageToSprite(this.haveNumImage , source);
		}else{
			this.haveNumImage.node.active = false;
		}
        // let cardSource : string = "majiongCard/resource/" + Global.Utils.getCardStrByValue(cardValue);
        // Global.Utils.setNewImageToSprite(this.cardValueImage , cardSource);
        Global.Utils.setMJImageToSprite(this.cardValueImage, Global.Utils.getCardStrByValue(cardValue));
    }
    onItemClick(){
        
        this.clickFun.bind(this.thisObj)(this);
    }
    disTory(){
        super.disTory();
    }
    getCardNum():number{
        return this.have;
    }

    getCardValue():number{
        return this.cardValue;
    }
}
