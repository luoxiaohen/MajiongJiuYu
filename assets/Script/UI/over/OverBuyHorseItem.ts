// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverBuyHorseInfoData } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverBuyHorseItem extends UIBase {
    @property(cc.Label)
    buyCountLabel : cc.Label = null;
    @property(cc.Label)
    fenLabel : cc.Label = null;
    @property(cc.Sprite)
    playerHeadImage : cc.Sprite = null;
    @property(cc.Sprite)
    cardValueImage : cc.Sprite = null;
    @property(cc.Sprite)
    horseImage : cc.Sprite = null;

    private _buyHorseInfoData: OverBuyHorseInfoData;
    public get buyHorseInfoData(): OverBuyHorseInfoData {
        return this._buyHorseInfoData;
    }
    public set buyHorseInfoData(value: OverBuyHorseInfoData) {
        this._buyHorseInfoData = value;
        this.showElements();
    }

    private showElements(){
        let source : string = "smallOver/resource/game_ma" + (this.buyHorseInfoData.horesNum + 2) ;
        Global.Utils.setNewImageToSprite(this.horseImage , source);
        this.buyCountLabel.string = this.buyHorseInfoData.buyCoun + "张";
        Global.Utils.setNewImageToSprite(this.cardValueImage , "majiongCard/resource/" + Global.Utils.getCardStrByValue(this.buyHorseInfoData.cardValue)) 
        let fontSource:string = this.buyHorseInfoData.fen >= 0 ? "comResource/mapFont/jiesuanJiafen" : "comResource/mapFont/jiesuanJianfen";
        cc.loader.loadRes(fontSource , cc.Font , (error , assest)=>{
            if(error){
                return;
            }
            this.fenLabel.font = assest;
            this.fenLabel.string = this.buyHorseInfoData.fen >= 0 ? ("+" + this.buyHorseInfoData.fen) : this.buyHorseInfoData.fen.toString();
        })
    }
}


