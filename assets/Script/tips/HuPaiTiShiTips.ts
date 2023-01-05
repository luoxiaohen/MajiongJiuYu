/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-19 11:02:52
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-12 17:05:57
 * @FilePath: \MajiongJiuYu\assets\Script\tips\HuPaiTiShiTips.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
import { HuData, ListenCard } from "../utils/InterfaceHelp";
import HupaiTishiItem from "./HupaiTishiItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HuPaiTiShiTips extends UIBase {

    @property(cc.Sprite)
    bgImage : cc.Sprite = null;
    @property(cc.Label)
    mapLabel : cc.Label = null;
    @property(cc.ScrollView)
    itemScroller : cc.ScrollView = null;
    @property(cc.Node)
    itemGroup : cc.Node = null;
    @property(cc.Node)
    itemView : cc.Node = null;


    private listenData : ListenCard;
    protected onLoad(): void {
        this.listenData = this.dialogParameters;
        this.showItem(Global.Utils.getPreFabBySource("tips/HuPaiTiShiTips/prefab/HupaiTishiItem"));
        this.showWidth();
        this.showHave();
    }
    private showHave(){
        let allHave : number = 0;
        for(let i = 0 ; i < this.listenData.huData.length ; i++){
            allHave += this.getHave(this.listenData.huData[i]);
       }
       this.mapLabel.string = "s" + allHave + "z";
    }
    public getHave(huData : HuData):number{
		let have:number = GameInfo.ins.allOutCardArr[huData.cardValue] ? 4 - GameInfo.ins.allOutCardArr[huData.cardValue] : 4;
		for(let i = 0 ; i < UserInfo.ins.myHandCardArr.length ; i++){
			if(UserInfo.ins.myHandCardArr[i] == huData.cardValue){
				have--;
			}
		}
		if(have <= 0){
			have = 0;
		}
		return have;
	}
    private showWidth(){
        let count : number = this.listenData.huData.length;
        if(count < 8){
            let viewWidth : number = count*126 + (count-1)*17;
            this.itemView.width = viewWidth;
            this.itemScroller.node.width = viewWidth;
            this.bgImage.node.width = this.itemScroller.node.x + viewWidth + 30;
        }
    }
    private showItem(assest : cc.Prefab){
        let item:HupaiTishiItem;
        for(let i = 0 ; i < this.listenData.huData.length ; i++){
             item = cc.instantiate(assest).getComponent(HupaiTishiItem);
             item.huData = this.listenData.huData[i]
             this.itemGroup.addChild(item.node);
        }
    }

    public disTory(){
        super.disTory()
    }
}
