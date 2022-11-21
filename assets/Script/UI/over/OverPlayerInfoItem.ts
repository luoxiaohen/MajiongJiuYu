// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverPlayerItemInfoData } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverPlayerInfoItem extends UIBase {
    @property (cc.Sprite)
    headImage : cc.Sprite = null;
    @property (cc.Sprite)
    piaoImage : cc.Sprite = null;
    @property (cc.Sprite)
    zhuangImage : cc.Sprite = null;
    @property (cc.Sprite)
    huImage : cc.Sprite = null;
    @property (cc.Label)
    IdLabel : cc.Label = null;
    @property (cc.Label)
    nameLabel : cc.Label = null;
    @property (cc.Label)
    fenLabel : cc.Label = null;

    private _itemInfoDat: OverPlayerItemInfoData;
    public get itemInfoDat(): OverPlayerItemInfoData {
        return this._itemInfoDat;
    }
    public set itemInfoDat(value: OverPlayerItemInfoData) {
        this._itemInfoDat = value;
        this.createElements();
    }

    protected onLoad(): void {
        
    }

    private createElements(){
        this.piaoImage.node.active = this.itemInfoDat.isPaio;
        this.zhuangImage.node.active = this.itemInfoDat.isZhuang;
        this.nameLabel.string = this.itemInfoDat.playerName;
        this.IdLabel.string = "ID:" + this.itemInfoDat.playerId;
        this.showHuImage();
        this.showFen();
    }
    private showFen(){
        let fontSource:string = this.itemInfoDat.fenCount >= 0 ? "comResource/mapFont/jiesuanJiafen" : "comResource/mapFont/jiesuanJianfen";
        cc.loader.loadRes(fontSource , cc.Font , (error , assest)=>{
            if(error){
                return;
            }
            this.fenLabel.font = assest;
            this.fenLabel.string = this.itemInfoDat.fenCount >= 0 ? ("+" + this.itemInfoDat.fenCount) : this.itemInfoDat.fenCount.toString();
        })
    }
    private showHuImage(){
        if(this.itemInfoDat.huType == -1){
            this.huImage.node.active = false;
            return;
        }
        this.huImage.node.active = true;
        let source : string = "smallOver/resource/game_hu";
        if(this.itemInfoDat.huType == 0){
            source = "smallOver/resource/game_hu";
        }
        if(this.itemInfoDat.huType == 1){
            source = "smallOver/resource/game_hu2";
        }
        if(this.itemInfoDat.huType == 2){
            source = "smallOver/resource/game_hu3";
        }
        Global.Utils.setNewImageToSprite(this.huImage , source);
        if(this.itemInfoDat.isZhuang == false){
            this.huImage.node.x = 189;
        }
    }

}

