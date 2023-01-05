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
    @property (cc.Sprite)
    selectImage:cc.Sprite = null;


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
    private outImgPointArr:Array<cc.Vec2> = [cc.v2(35,65) , cc.v2(46,53) , cc.v2(29,53) , cc.v2(-38 , 54)]

    protected onLoad(): void {
        // this.selectOutImage.node.active = false;
    }
    showSelectImage(boo:boolean){
        if(boo){
            let bgSource : string = "";
            switch(this.bySelfPoint){
                case 0:
                    bgSource = "comResource/cardOther/game_paichi0";
                    this.selectImage.node.scaleX = 1;
                break;
                case 1:
                    bgSource = "comResource/cardOther/game_paichi1";
                    this.selectImage.node.scaleX = 1;
                break;
                case 2:
                    bgSource = "comResource/cardOther/game_paichi2";
                    this.selectImage.node.scaleX = 1;
                break;
                case 3:
                    bgSource = "comResource/cardOther/game_paichi1";
                    this.selectImage.node.scaleX = -1;
                break;
            }
            Global.Utils.setNewImageToSprite(this.selectImage,bgSource,()=>{
                this.selectImage.node.active = true;
            });
        }else{
            this.selectImage.node.active = boo;
        }
    }
    private showCard(){
        let bgSource : string = "";
        let fontSource : string = "";
        switch(this.bySelfPoint){
            case 0:
                // bgSource = "majiongCard/resource/0_0_0";
                bgSource = "0_0_0";
                this.outCardBg.node.scaleX = 1;
                // fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_0";
                fontSource = Global.Utils.getCardStrByValue(this.cardValue)+"_0";
            break;
            case 1:
                // bgSource = "majiongCard/resource/1_0_0";
                bgSource = "1_0_0";
                this.outCardBg.node.scaleX = 1;
                // fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_1";
                fontSource = Global.Utils.getCardStrByValue(this.cardValue)+"_1";
            break;
            case 2:
                // bgSource = "majiongCard/resource/2_0_0";
                bgSource = "2_0_0";
                this.outCardBg.node.scaleX = 1;
                // fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_2";
                fontSource = Global.Utils.getCardStrByValue(this.cardValue)+"_2";
            break;
            case 3:
                // bgSource = "majiongCard/resource/1_0_0";
                bgSource = "1_0_0";
                this.outCardBg.node.scaleX = -1;
                // fontSource = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.cardValue)+"_3";
                fontSource = Global.Utils.getCardStrByValue(this.cardValue)+"_3";
            break;
        }
        // Global.Utils.setNewImageToSprite(this.outCardBg,bgSource,()=>{
        Global.Utils.setMJImageToSprite(this.outCardBg,bgSource,()=>{
            this.outCardBg.node.active = true;
        });
        // Global.Utils.setNewImageToSprite(this.outCardFont,fontSource,()=>{
        Global.Utils.setMJImageToSprite(this.outCardFont,fontSource,()=>{
            this.outCardFont.node.active = true;
            this.outCardFont.node.x = this.fontPointArr[this.bySelfPoint].x;
            this.outCardFont.node.y = this.fontPointArr[this.bySelfPoint].y;
        });
        this.selectOutImage.node.active = true; 
        this.selectOutImage.node.x = this.outImgPointArr[this.bySelfPoint].x;
        this.selectOutImage.node.y = this.outImgPointArr[this.bySelfPoint].y;

    }
    hideOutSelectImage(){
        this.selectOutImage.node.active = false; 
    }

    setLiangpai(zmOpen){
        if(zmOpen){
            this.outCardFont.node.active = true;
        }else{
            let bgSource : string = "";
            switch(this.bySelfPoint){
                case 0:
                break;
                case 1:
                    // bgSource = "majiongCard/resource/1_0_1";
                    bgSource = "1_0_1";
                break;
                case 2:
                    // bgSource = "majiongCard/resource/2_0_1";
                    bgSource = "2_0_1";
                break;
                case 3:
                    // bgSource = "majiongCard/resource/1_0_1";
                    bgSource = "1_0_1";
                break;
            }
            // Global.Utils.setNewImageToSprite(this.outCardBg,bgSource);
            Global.Utils.setMJImageToSprite(this.outCardBg,bgSource);
            this.outCardFont.node.active = false;
        }
    }

    public disTory(){
        super.disTory()
    }
}
