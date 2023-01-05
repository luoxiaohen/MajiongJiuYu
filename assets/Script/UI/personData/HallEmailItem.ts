// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ListItem from "../uiList/ListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallEmailItem extends ListItem{
    @property(cc.Label)
    title_label: cc.Label = null;
    @property(cc.Label)
    time_label: cc.Label = null;
    @property(cc.Label)
    content_label: cc.Label = null;
    @property(cc.Node)
    read_point:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    initeValue(title:string,time:string,content:string,readState:boolean):void{
        this.title_label.string=title;
        this.time_label.string=time;
        this.content_label.string=content;
        this.read_point.active=!readState;
    }

    // update (dt) {}
}
