// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerBaseCount } from "../../proto/MsgCountDef";
import { Global } from "../../Shared/GloBal";
import DataSectorItem from "./DataSectorItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CompareCircleItem extends cc.Component {

    @property(cc.Node)
    inside_node: cc.Node = null;
    @property(cc.Sprite)
    bg_sprite:cc.Sprite=null;

    private dataArr_inside=[];
    @property(cc.Label)
    percent_label_inside:cc.Label[]=[];
    @property(cc.Prefab)
    private inside_prefab:cc.Prefab=null;

    @property(cc.Label)
    title_label:cc.Label=null;
    protected onLoad(): void {
        for(let index=0;index<6;index++){
            this.percent_label_inside[index].string="0.0%";
        }
    }
    setTitle(titleStr:string):void{
        this.title_label.string=titleStr;
    }
    public setDataInfoShow(info:PlayerBaseCount):void{
        if(!info){
            return;
        }
        this.dataArr_inside=[];
        let pinghuValue=info.fan0+info.fan1+info.fan2+info.fan3;
        let duizhihuValue=info.ddh+info.jgd;
        let qiduiValue=info.dui7+info.l7d+info.sl7d;
        let qingyise=info.qys+info.qd+info.q7d+info.ql7d+info.qjgd;
        let yaojiuVlaue=info.y9;
        let jdVlaue=info.jd;
        this.dataArr_inside.push(pinghuValue,duizhihuValue,qiduiValue,qingyise,yaojiuVlaue,jdVlaue);
        let sumValue=0;
        for(let item of this.dataArr_inside){
            sumValue+=item;
        }
        for(let index=0;index<this.dataArr_inside.length;index++){
            if(sumValue==0){
                this.dataArr_inside[index]=0;
            }else{
                this.dataArr_inside[index]=this.dataArr_inside[index]/sumValue;
            }
        }
        Global.Utils.FormatArrToPresent100(this.dataArr_inside);
        if(sumValue==0){
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_tongjitudi",this.bg_sprite)
        }else{
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_yuanxin",this.bg_sprite)
        }
        this.setTypeLabelStr();
        for(let item of this.itemArr){
            item.disTory();
        }
        this.itemArr=[];
        this.addIitems();
    }

    private setTypeLabelStr():void{
        for(let index=0;index<6;index++){
            this.percent_label_inside[index].string=Global.Utils.formatPercentNum(this.dataArr_inside[index]);
        }
    }
    private addIitems():void{
        for(let index=0;index<this.dataArr_inside.length;index++){
            if(this.dataArr_inside[index]>0){
                this.addOneInsideNode(index,this.inside_node);
            }
         }
    }
    private itemArr:DataSectorItem[]=[];
    private addOneInsideNode(index:number,root:cc.Node,sidepos:number=1):void{
        let obj:cc.Node=null;
        obj=cc.instantiate(this.inside_prefab);
        obj.scale=0.7;
        root.addChild(obj);
        obj.x=0;
        obj.y=0;
        let compnet=obj.getComponent(DataSectorItem);
        compnet.initValue(this.dataArr_inside,index,0,sidepos);
        this.itemArr.push(compnet);
    }

    // update (dt) {}
}
