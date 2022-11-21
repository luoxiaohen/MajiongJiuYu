// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EatCardEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { PengGangData } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongEatItem extends UIBase {
    @property(cc.Node)
    majiongEat0 : cc.Node = null;
    @property(cc.Node)
    majiongEat1 : cc.Node = null;
    @property(cc.Node)
    majiongEat2 : cc.Node = null;
    @property(cc.Node)
    majiongEat3 : cc.Node = null;

    public eatSplc:Array<number> = [20 , 10 , 20 , 10];

    private _size: cc.Vec2;
    public get size(): cc.Vec2 {
        return this._size;
    }
    public set size(value: cc.Vec2) {
        this._size = value;
    }

    private _eatData: PengGangData;
    public get eatData(): PengGangData {
        return this._eatData;
    }
    public set eatData(value: PengGangData) {
        this._eatData = value;
        this.creatElements();
    }
    protected onLoad(): void {
    }
    private creatElements(){
        this.changeSize();
        this.showCardValue();
        this.showItemNum();
        this.showByImage();
    }
    public setNewData(eatType:EatCardEnum){
        this.eatData.eatType = eatType;
        this.showItemNum();
    }

    public setPoint(addIndex:number){
        switch(this.eatData.havePointBySelf){
            case 0:
                this.node.x = (addIndex-1)*this.size.x + (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf];
            break;
            case 1:
                this.node.x = this.size.x*-1 - addIndex*6 ;
                this.node.y = this.size.y*(addIndex-1) + this.eatSplc[this.eatData.havePointBySelf]*(addIndex-1)
            break;
            case 2:
                this.node.x = 819 - addIndex*this.size.x - (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf]
            break;
            case 3:
                this.node.x = addIndex*-6 - this.size.x/2 ;
                this.node.y = 560 - addIndex*this.size.y - (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf]
            break;
        }
    }
    private showByImage(){
        let nowNode : cc.Node = this.getNowNode();
        let changeAngel : number = 0;
        switch(this.eatData.eatType){
            case EatCardEnum.EatOpposite , EatCardEnum.CrossOpposite , EatCardEnum.CrossAllOpp:
                changeAngel += 2;
            break;
            case EatCardEnum.EatUp , EatCardEnum.CrossUp , EatCardEnum.CrossAllUp:
                changeAngel += 3;
            break;
            case EatCardEnum.EatDown , EatCardEnum.CrossDown , EatCardEnum.CrossAllDown:
                changeAngel += 1;
            break;
        }
        let img : cc.Sprite = cc.find("selfImage" , nowNode).getComponent(cc.Sprite);
        let initRotation : number = img.node.angle;
        img.node.angle = initRotation + changeAngel*90;
    }
    private showItemNum(){
        let source : string = "myEat3";
        if(this.eatData.eatType < 3){
            let nowNode : cc.Node = this.getNowNode();
            cc.find(source , nowNode).active = false;
        }else{
            let nowNode : cc.Node = this.getNowNode();
            cc.find(source , nowNode).active = true;
        }
    }
    private showCardValue(){
        if(this.eatData.eatType == EatCardEnum.CrossSelf){
            let source : string = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf;
            let nowNode : cc.Node = this.getNowNode();
            let fontImage : cc.Sprite;
            let bgImage : cc.Sprite;
            fontImage = cc.find("myEat3/fontImage" , nowNode).getComponent(cc.Sprite);
            Global.Utils.setNewImageToSprite(fontImage , source);
            for(let i = 0 ; i < 3 ; i++){
                fontImage = cc.find("myEat"+i+"/fontImage" , nowNode).getComponent(cc.Sprite);
                fontImage.node.active = false;
                bgImage = cc.find("myEat"+i+"/majiongBg" , nowNode).getComponent(cc.Sprite);
                bgImage.node.active = true;
                let index:number = this.eatData.havePointBySelf ;
                if(index == 3){
                    index = 1
                }
                Global.Utils.setNewImageToSprite(bgImage , "majiongCard/resource/"+index+"_0_4_2",()=>{
                    this.getNowNode().active = true;
                });
            }
            
        }else{   
            let source : string = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf;
            let nowNode : cc.Node = this.getNowNode();
            let fontImage : cc.Sprite;
            for(let i = 0 ; i < 4 ; i++){
                let s : string = "myEat"+i+"/fontImage";
                fontImage = cc.find( s , nowNode).getComponent(cc.Sprite);
                Global.Utils.setNewImageToSprite(fontImage , source , ()=>{
                    nowNode.active = true;
                });
            }
        }
    }
    @property (cc.Sprite)
    XXfont : cc.Sprite = null;
    private getNowNode():cc.Node{
        switch(this.eatData.havePointBySelf){
            case 0:
                return this.majiongEat0;
            break;
            case 1:
                return this.majiongEat1;
            break;
            case 2:
                return this.majiongEat2;
            break;
            case 3:
                return this.majiongEat3;
            break;
        }
    }
    private changeSize(){
        switch(this.eatData.havePointBySelf){
            case 0:
                this.size = cc.v2(262,116);
            break;
            case 1:
                this.size = cc.v2(72,135.5);
            break;
            case 2:
                this.size = cc.v2(150,65);
            break;
            case 3:
                this.size = cc.v2(72,135.5);
            break;
        }
    }
}
