// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeThreeItem extends UIBase {

    @property(cc.Sprite)
    bgImage: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_0: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_1: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_2: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_3: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_4: cc.Sprite = null;
    @property(cc.Sprite)
    cardImage_5: cc.Sprite = null;
    
    protected onLoad(): void {
        this.createCard();
    }

    private createCard(){
        let myOut:Array<number> = GameInfo.ins.myYou3MajData.lstOuts;
        let myGet:Array<number> = GameInfo.ins.myYou3MajData.lstMajID;
        let chanegType:number = GameInfo.ins.myYou3MajData.type;

        let bgSource:string = ""
        if(chanegType == 0){
            bgSource = "changeThree/resource/changeThree_duijiahp";
        }else if(chanegType == 1){
            bgSource = "changeThree/resource/changeThree_shunshi";
        }else if(chanegType == -1){
            bgSource = "changeThree/resource/changeThree_nishi";
        }
        Global.Utils.setNewImageToSprite(this.bgImage , bgSource);


        let nowImage:cc.Sprite;
        for(let i = 0 ; i < myOut.length ; i++){
            nowImage = this["cardImage_"+i] as cc.Sprite;
            Global.Utils.setNewImageToSprite(nowImage , "majiongCard/resource/" + Global.Utils.getCardStrByValue(myOut[i]));
        }
        for(let i = 0 ; i < myGet.length ; i++){
            nowImage = this["cardImage_"+(i+3)] as cc.Sprite;
            Global.Utils.setNewImageToSprite(nowImage , "majiongCard/resource/" + Global.Utils.getCardStrByValue(myGet[i]));
        }
    }

    disTory(){
        super.disTory();
    }
}
