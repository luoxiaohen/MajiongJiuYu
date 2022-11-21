// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateRoomHelper from "./CreateRoomHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateCheckItem extends UIBase {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property (cc.Toggle)
    checkBox : cc.Toggle = null;

    @property (cc.Sprite)
    Background : cc.Sprite = null;
    
    @property (cc.Sprite)
    checkmark : cc.Sprite = null;

    private hasEvent:boolean = false;
    private _boxValue: number = 0;
    public get boxValue(): number {
        return this._boxValue;
    }
    public set boxValue(value: number) {
        this._boxValue = value;
    }
    private boxType : number;
    private currCheck : boolean = false;
    protected onLoad(): void {
        
    }
    /**
     * @param boxValue 选择内容,来自于CreateRoomHelper.ins.createRoomCkeckName的ID
     * @param initCheck 是否默认选中
     * @param boxType  选择类型 1：方形,多选  2：圆形,同级互斥
     * @param hasEvent 是否需要在点击的时候派发事件出去
    */
    setData(boxValue : number , initCheck:boolean = false ,  boxType : number = 1 , hasEvent:boolean = false){
        if(boxType == 1){
            Global.Utils.setNewImageToSprite(this.Background ,"createRoom/resource/createRoom_xuanze1" )
            Global.Utils.setNewImageToSprite(this.checkmark ,"createRoom/resource/createRoom_xuanze2" )
        }else{
            Global.Utils.setNewImageToSprite(this.Background ,"createRoom/resource/createRoom_xuanze4" )
            Global.Utils.setNewImageToSprite(this.checkmark ,"createRoom/resource/createRoom_xuanze5" )
        }
        this.nameLabel.string = CreateRoomHelper.ins.createRoomCkeckName[boxValue];
        this.hasEvent = hasEvent;
        this.boxValue = boxValue;
        this.currCheck = initCheck;
        this.boxType = boxType;
        this.showCheck();
    }
    onCheckClick(){
        if(CreateRoomHelper.ins.gameRuleItemIsMove && this.boxType == 1){
            this.showCheck();
            return;
        }
        
        if(this.boxType == 1){
            this.currCheck = !this.currCheck;
            this.showCheck();
        }
        if(this.hasEvent){
            Global.EventCenter.dispatchEvent(EventType.CreateRoom_Check_Click , this);   
        }
    }
    showEnabled(boo){
        this.enabled = boo;
        this.checkBox.enabled = boo;
    }
    isCheck():boolean{
        return this.currCheck;
    }

    showSelect (boo : boolean){
        this.currCheck = boo;
        this.showCheck();
    }

    private showCheck(){
        this.currCheck ? this.checkBox.check() : this.checkBox.uncheck();
    }

    textColor(_color : cc.Color){
        this.nameLabel.node.color = _color;
    }

}
