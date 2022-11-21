// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongWallCard extends UIBase {
    start () {
    }
    @property (cc.Sprite)
    majiongImage : cc.Sprite = null;
    /**当前牌在牌墙的位置*/
    private _cardId: number = 0;
    public get cardId(): number {
        return this._cardId;
    }
    public set cardId(value: number) {
        this._cardId = value;
    }

    /**牌墙在桌子的位置*/
    private _cardPoint: number = 0;
    public get cardPoint(): number {
        return this._cardPoint;
    }
    public set cardPoint(value: number) {
        this._cardPoint = value;
        this.showImage();
    }

    /***麻将摸牌顺序,依据庄家位置和摸牌起点得出*/
    private _majiongDrawOeder: number = 0;
    public get majiongDrawOeder(): number {
        return this._majiongDrawOeder;
    }
    public set majiongDrawOeder(value: number) {
        this._majiongDrawOeder = value;
    }
    protected onLoad(): void {
        
    }

    /**设置当前是否可见*/
    public setVisible(boo:boolean){
        this.node.active = boo;
    }

    private showImage(){
        if(this.cardPoint == 3){
            Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/1_0_1" , null)
        }else{
            Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/"+this.cardPoint+"_0_1" , null)
        }
        if(this.cardPoint == 3){
            this.majiongImage.node.scaleX = -1;
        }else{
            this.majiongImage.node.scaleX = 1;
        }
    }
}
