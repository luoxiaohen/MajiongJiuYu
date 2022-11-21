// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";
import { HuData } from "../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HupaiTishiItem extends UIBase {

    @property (cc.Label)
    fanLabel : cc.Label = null;
    @property (cc.Sprite)
    cardImage : cc.Sprite = null;
    @property (cc.Sprite)
    haveImage : cc.Sprite = null;

    private _huData: HuData;
    public get huData(): HuData {
        return this._huData;
    }
    public set huData(value: HuData) {
        this._huData = value;
        this.showElements();
    }

    protected onLoad(): void {
    }
    private showElements(){
        Global.Utils.setNewImageToSprite(this.cardImage , "majiongCard/resource/" + Global.Utils.getCardStrByValue(this.huData.cardValue));
        Global.Utils.setNewImageToSprite(this.haveImage , "tips/HuPaiTiShiTips/resource/game_biaoqian" + this.getHave());
        this.fanLabel.string = this.huData.fanNum + "番";
    }
    public getHave():number{
		let have:number = GameInfo.ins.allOutCardArr[this.huData.cardValue] ? 4 - GameInfo.ins.allOutCardArr[this.huData.cardValue] : 4;
		for(let i = 0 ; i < UserInfo.ins.myHandCardArr.length ; i++){
			if(UserInfo.ins.myHandCardArr[i] == this.huData.cardValue){
				have--;
			}
		}
		if(have <= 0){
			have = 0;
		}
		return have;
	}
}
