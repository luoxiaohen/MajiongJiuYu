// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EatCardEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { PengGangData, SelectHandCardData } from "../../utils/InterfaceHelp";

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

    public eatSplc:Array<number> = [28 , 10 , 20 , 10];

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
        this.showByImage();
    }

    public setPoint(addIndex:number){
        switch(this.eatData.havePointBySelf){
            case 0:
                this.node.x = 20 + (addIndex-1)*this.size.x + (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf];
                this.node.y = 5;
            break;
            case 1:
                this.node.x = this.size.x*-1 - addIndex*6 ;
                this.node.y = this.size.y*(addIndex-1) + this.eatSplc[this.eatData.havePointBySelf]*(addIndex-1)
            break;
            case 2:
                this.node.x = 800 - addIndex*this.size.x - (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf]
                this.node.y = 5;
            break;
            case 3:
                this.node.x = 10 + addIndex*-6 - this.size.x/2 ;
                this.node.y = 600 - addIndex*this.size.y - (addIndex-1)*this.eatSplc[this.eatData.havePointBySelf]
            break;
        }
    }
    private showByImage(){
        let nowNode : cc.Node = this.getNowNode();
        let img : cc.Sprite = cc.find("/selfImage" , nowNode).getComponent(cc.Sprite);
        let changeAngel : number = 0;
        if(this.eatData.eatType == EatCardEnum.EatOpposite ||this.eatData.eatType ==  EatCardEnum.CrossOpposite ||this.eatData.eatType ==  EatCardEnum.CrossAllOpp){
            changeAngel += 2;
            
        }else if(this.eatData.eatType == EatCardEnum.EatUp ||this.eatData.eatType ==  EatCardEnum.CrossUp ||this.eatData.eatType ==  EatCardEnum.CrossAllUp){
            changeAngel += 3;
        }else if(this.eatData.eatType == EatCardEnum.EatDown ||this.eatData.eatType ==  EatCardEnum.CrossDown ||this.eatData.eatType ==  EatCardEnum.CrossAllDown){
            changeAngel += 1;
        }
        let initRotation : number = img.node.angle;
        img.node.angle = initRotation + changeAngel*90;
        if(this.eatData.eatType <= 2){
            switch(this.eatData.havePointBySelf){
                case 0 : 
                    img.node.y = 71;
                break;
                case 1 : 
                    img.node.x = 39;
                    img.node.y = 74;
                break;
                case 2 : 
                    img.node.y = 44.5;
                break;
                case 3 : 
                    img.node.x = 34.5;
                    img.node.y = 74;
                break;
            }
        }else{
            switch(this.eatData.havePointBySelf){
                case 0 : 
                    img.node.y = 98.3;
                break;
                case 1 : 
                    img.node.x = 50;
                    img.node.y = 86;
                break;
                case 2 : 
                    img.node.y = 58;
                break;
                case 3 : 
                    img.node.x = 26.5;
                    img.node.y = 83;
                break;
            }
            let bg:cc.Sprite;
            let font:cc.Sprite;
            if(this.eatData.eatType >= 3 && this.eatData.eatType <= 5){
                for(let i = 0 ; i < 4 ; i++){
                    bg = cc.find("myEat"+i+"/majiongBg" , nowNode).getComponent(cc.Sprite);
                    font = cc.find("myEat"+i+"/fontImage" , nowNode).getComponent(cc.Sprite);
                    if(i == 3){
                        // Global.Utils.setNewImageToSprite(bg,this.getBgSource(true));
                        Global.Utils.setMJImageToSprite(bg, this.getBgSource(true));
                        font.node.active = false;
                    }else{
                        // Global.Utils.setNewImageToSprite(bg,this.getBgSource(false));
                        Global.Utils.setMJImageToSprite(bg, this.getBgSource(false));
                        font.node.active = true;
                    }
                }
            }else if(this.eatData.eatType >= 7 && this.eatData.eatType <= 9){
                for(let i = 0 ; i < 4 ; i++){
                    bg = cc.find("myEat"+i+"/majiongBg" , nowNode).getComponent(cc.Sprite);
                    font = cc.find("myEat"+i+"/fontImage" , nowNode).getComponent(cc.Sprite);
                    // Global.Utils.setNewImageToSprite(bg,this.getBgSource(false));
                    Global.Utils.setMJImageToSprite(bg, this.getBgSource(false));
                    font.node.active = true;
                }
            }else if(this.eatData.eatType == 6){
                for(let i = 0 ; i < 4 ; i++){
                    bg = cc.find("myEat"+i+"/majiongBg" , nowNode).getComponent(cc.Sprite);
                    font = cc.find("myEat"+i+"/fontImage" , nowNode).getComponent(cc.Sprite);
                    if(i == 3){
                        // Global.Utils.setNewImageToSprite(bg,this.getBgSource(false));
                        Global.Utils.setMJImageToSprite(bg, this.getBgSource(false));
                        font.node.active = true;
                    }else{
                        // Global.Utils.setNewImageToSprite(bg,this.getBgSource(true));
                        Global.Utils.setMJImageToSprite(bg, this.getBgSource(true));
                        font.node.active = false;
                    }
                }
            }
        }
    }
    showSelectHandCard(data:SelectHandCardData){
        let nowNode : cc.Node = this.getNowNode();
        let selectImage:cc.Sprite;
        if(this.eatData.eatType >= 3 && this.eatData.eatType <= 5){
            for(let i = 0 ; i < 4 ; i++){
                selectImage = cc.find("myEat"+i+"/selectImage" , nowNode).getComponent(cc.Sprite);
                if(i == 3){
                    selectImage.node.active = false;
                }else{
                    selectImage.node.active = data.isSelect;
                }
            }
        }else if(this.eatData.eatType >= 7 && this.eatData.eatType <= 9){
            for(let i = 0 ; i < 4 ; i++){
                selectImage = cc.find("myEat"+i+"/selectImage" , nowNode).getComponent(cc.Sprite);
                selectImage.node.active = data.isSelect;
            }
        }else if(this.eatData.eatType == 6){
            for(let i = 0 ; i < 4 ; i++){
                selectImage = cc.find("myEat"+i+"/selectImage" , nowNode).getComponent(cc.Sprite);
                if(i == 3){
                    selectImage.node.active = data.isSelect;
                }else{
                    selectImage.node.active = false;
                }
            }
        }else{
            for(let i = 0 ; i < 4 ; i++){
                selectImage = cc.find("myEat"+i+"/selectImage" , nowNode).getComponent(cc.Sprite);
                if(i == 3){
                    selectImage.node.active = false;
                }else{
                    selectImage.node.active = data.isSelect;
                }
            }
        }
    }
    private getBgSource(isBei:boolean){
        // switch(this.eatData.havePointBySelf){
        //     case 0 :
        //         return isBei ? "majiongCard/resource/0_0_4_2" : "majiongCard/resource/0_0_4_0";
        //     case 1 :
        //     return isBei ? "majiongCard/resource/1_0_4_2" : "majiongCard/resource/1_0_4_0";
        //     case 2 :
        //     return isBei ? "majiongCard/resource/2_0_4_2" : "majiongCard/resource/2_0_4_0";
        //     case 3 :
        //     return isBei ? "majiongCard/resource/1_0_4_2" : "majiongCard/resource/1_0_4_0";
        // }
        switch(this.eatData.havePointBySelf){
            case 0 :
                return isBei ? "0_0_4_2" : "0_0_4_0";
            case 1 :
                return isBei ? "1_0_4_2" : "1_0_4_0";
            case 2 :
                return isBei ? "2_0_4_2" : "2_0_4_0";
            case 3 :
                return isBei ? "1_0_4_2" : "1_0_4_0";
        }
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
            // let source : string = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf;
            let nowNode : cc.Node = this.getNowNode();
            let fontImage : cc.Sprite;
            let bgImage : cc.Sprite;
            fontImage = cc.find("myEat3/fontImage" , nowNode).getComponent(cc.Sprite);
            // Global.Utils.setNewImageToSprite(fontImage , source);
            Global.Utils.setMJImageToSprite(fontImage, Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf);
            for(let i = 0 ; i < 3 ; i++){
                fontImage = cc.find("myEat"+i+"/fontImage" , nowNode).getComponent(cc.Sprite);
                fontImage.node.active = false;
                bgImage = cc.find("myEat"+i+"/majiongBg" , nowNode).getComponent(cc.Sprite);
                bgImage.node.active = true;
                let index:number = this.eatData.havePointBySelf ;
                if(index == 3){
                    index = 1
                }
                // Global.Utils.setNewImageToSprite(bgImage , "majiongCard/resource/"+index+"_0_4_2",()=>{
                Global.Utils.setMJImageToSprite(bgImage, index+"_0_4_2",()=>{
                    this.getNowNode().active = true;
                });
            }
            
        }else{   
            // let source : string = "majiongCard/resource/"+Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf;
            let nowNode : cc.Node = this.getNowNode();
            let fontImage : cc.Sprite;
            for(let i = 0 ; i < 4 ; i++){
                let s : string = "myEat"+i+"/fontImage";
                fontImage = cc.find( s , nowNode).getComponent(cc.Sprite);
                // Global.Utils.setNewImageToSprite(fontImage , source , ()=>{
                Global.Utils.setMJImageToSprite(fontImage , Global.Utils.getCardStrByValue(this.eatData.cardValue)+"_" + this.eatData.havePointBySelf , ()=>{
                    nowNode.active = true;
                });
            }
        }
    }
    private getNowNode():cc.Node{
        switch(this.eatData.havePointBySelf){
            case 0:
                return this.majiongEat0;
            case 1:
                return this.majiongEat1;
            case 2:
                return this.majiongEat2;
            case 3:
                return this.majiongEat3;
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
