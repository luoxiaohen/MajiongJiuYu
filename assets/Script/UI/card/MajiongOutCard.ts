// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongOutCard extends UIBase {
    @property (cc.Sprite)
    outCardBg:cc.Sprite = null;
    @property (cc.Sprite)
    outCardFont:cc.Sprite = null;
    @property (cc.Sprite)
    selectOutImage:cc.Sprite = null;


    /***当前牌组相对于第一视角属于那个位置*/
    private _bySelfPoint: CardGroupPointBySelfEnum = CardGroupPointBySelfEnum.Self;
    public get bySelfPoint(): CardGroupPointBySelfEnum {
        return this._bySelfPoint;
    }
    public set bySelfPoint(value: CardGroupPointBySelfEnum) {
        this._bySelfPoint = value;
    }
    /***当前牌的牌值*/
    private _cardValue: number = 1;
    public get cardValue(): number {
        return this._cardValue;
    }
    public set cardValue(value: number) {
        this._cardValue = value;
        this.showCard();
    }

    private fontPointArr:Array<cc.Vec2> = [cc.v2(34,56) , cc.v2(42,45) , cc.v2(28,47) , cc.v2(-42 , 45)]
    private outImgPointArr:Array<cc.Vec2> = [cc.v2(37,107) , cc.v2(40,87) , cc.v2(29,95) , cc.v2(-40 , 87)]

    protected onLoad(): void {
        this.selectOutImage.node.active = false;
    }

    private showCard(){
        let bgSource : string = "";
        let fontSource : string = "";
        switch(this.bySelfPoint){
            case 0:
                bgSource = "majiongCard/resource/0_0_0";
                this.outCardBg.node.scaleX = 1;
                fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_0";
            break;
            case 1:
                bgSource = "majiongCard/resource/1_0_0";
                this.outCardBg.node.scaleX = 1;
                fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_1";
            break;
            case 2:
                bgSource = "majiongCard/resource/2_0_0";
                this.outCardBg.node.scaleX = 1;
                fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_2";
            break;
            case 3:
                bgSource = "majiongCard/resource/1_0_0";
                this.outCardBg.node.scaleX = -1;
                fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_3";
            break;
        }
        Global.Utils.setNewImageToSprite(this.outCardBg,bgSource,()=>{
            this.outCardBg.node.active = true;
        });
        Global.Utils.setNewImageToSprite(this.outCardFont,fontSource,()=>{
            this.outCardFont.node.active = true;
            this.outCardFont.node.x = this.fontPointArr[this.bySelfPoint].x;
            this.outCardFont.node.y = this.fontPointArr[this.bySelfPoint].y;
        });
    }

    public disTory(){
        super.disTory()
    }
}
