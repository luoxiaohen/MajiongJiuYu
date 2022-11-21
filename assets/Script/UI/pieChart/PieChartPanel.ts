// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PieChartItem from "./PieChartItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PieChartPanel extends UIBase {
    start () {

    }
    @property(cc.Node)
    group_0 : cc.Node = null;
    @property(cc.Node)
    group_1 : cc.Node = null;
    @property(cc.Node)
    group_2 : cc.Node = null;
    @property(cc.Node)
    group_3 : cc.Node = null;
    @property(cc.Node)
    group_4 : cc.Node = null;
    @property(cc.Node)
    group_5 : cc.Node = null;


    private picChartPrefab : cc.Prefab;

    /****牌型数据集合*/
    private _allDataList = {
        0: { data: { 0: 5, 1: 5, 2: 5, 3: 5 }, count: 20 },
        1: { data: { 0: 50, 1: 50, 2: 50, 3: 50 }, count: 200 },
        2: { data: { 0: 20, 1: 40, 2: 15, 3: 5 }, count: 80 },
        3: { data: { 0: 10, 1: 15, 2: 10, 3: 35 }, count: 70 },
        4: { data: { 0: 10, 1: 5, 2: 5, 3: 0 }, count: 20 },
        5: { data: { 0: 25, 1: 35, 2: 0, 3: 0 }, count: 60 },
    };
    public get allDataList() {
        return this._allDataList;
    }
    public set allDataList(value) {
        this._allDataList = value;
    }
    /***主属性画板集合*/
    private ctxArray :Array<cc.Graphics>= [];

    /**当前选中的主属性*/
    private nowSelect : cc.Graphics;
    /**当前选中的主属性序号*/
    private nowSelectKey : number = -1;
    /**是否还在属性选择动画进行中*/
    private isSHowAction : boolean = false;

    /***主属性颜色集合*/
    private baseColor : Array<cc.Color> = [cc.color(160,221,224,255),
                                            cc.color(125,145,211,255),
                                            cc.color(75,189,209,255),
                                            cc.color(97,199,56,255),
                                            cc.color(229,195,59,255),
                                            cc.color(228,105,62,255),
                                        ];
    /***主属性颜色集合*/
    private moreColor : Array<cc.Color> = [cc.color(227,15,15,255),
                                            cc.color(19,1,1,255),
                                            cc.color(20,168,214,255),
                                            cc.color(13,241,159,255)
                                        ];
    protected onLoad(): void {
        this.picChartPrefab = Global.Utils.getPreFabBySource('pieChart/prefab/PieChartItem');
        this.createBasePic();
        this.addEvent();
    }
    addEvent(){
    }
    /**添加主属性饼图*/
    private createBasePic(){
        let allBase : number = this.getAllBase();
        let nowValue : number;
        let lastP : number = 0;
        for(let key in this.allDataList){
            nowValue = this.allDataList[key].count/allBase;
            var ctx:cc.Graphics = this["group_" + key].getChildByName("baseGroup").getComponent(cc.Graphics);
            ctx.clear();
            ctx.fillColor = this.baseColor[Number(key)];
            ctx.moveTo(0,0);
            ctx.arc(0, 0, 246,  0, Math.PI * nowValue*2, true);
            ctx.lineTo(0,0);
            ctx.strokeColor = cc.color(160,221,224,1);
            ctx.stroke();
            ctx.fill();
            lastP += nowValue;
            let newMax : number = 360/allBase*this.allDataList[key].count;
            for(let i = 0 ; i < newMax ; i++){
                let item = cc.instantiate(this.picChartPrefab);
                item.getComponent(PieChartItem).setClick(key , this.onItemClick , this )
                this["group_" + key].addChild(item);
                item.angle = i - 90;
            }
            this["group_" + key].angle = -lastP*360 + 90;
            this.ctxArray.push(ctx);
        }
    }
    /**
     * 饼图个体点击
    */
    onItemClick(key : string){
        if(this.isSHowAction){
            return ;
        }
        if(Number(key) == this.nowSelectKey){
            return;
        }
        this.isSHowAction = true;
        if(this.nowSelect){
            let nowGrou : cc.Node = this["group_"+this.nowSelectKey];
            for(let i = 0 ; i < 4 ; i++){
                let moreGroup = nowGrou.getChildByName("moreGroup_" + i)
                let ctx = moreGroup.getComponent(cc.Graphics)
                ctx.clear();
            }
            cc.tween(this.nowSelect.node).to(0.2 , {scaleX : 1 , scaleY : 1}).start();
        }
        cc.tween(this.ctxArray[Number(key)].node).to(0.2 , {scaleX : 1.05 , scaleY : 1.05}).call(()=>{
            this.isSHowAction = false;
            this.nowSelect = this.ctxArray[Number(key)];
            this.nowSelectKey = Number(key);
            this.isSHowMoreData();
        }).start();
    }
    private isSHowMoreData(){
        let nowGrou : cc.Node = this["group_"+this.nowSelectKey];
        let moreGroup : cc.Node ;
        let ctx : cc.Graphics;
        let nowValue : number;
        let nowData = this.allDataList[this.nowSelectKey.toString()].data;
        let lastP : number = 0;
        for(let key in nowData){
            moreGroup = nowGrou.getChildByName("moreGroup_" + key)
            ctx = moreGroup.getComponent(cc.Graphics)
            nowValue = nowData[key]/this.getAllBase();
            ctx.clear();
            ctx.fillColor = this.moreColor[Number(key)];
            ctx.moveTo(0,0);
            ctx.arc(0, 0, 290,  0, nowValue*Math.PI*2, true);
            ctx.lineTo(0,0);
            ctx.strokeColor = cc.color(160,221,224,1);
            ctx.stroke();
            ctx.fill();
            let texmpKey : number = this.nowSelectKey > 0 ? this.nowSelectKey - 1 : 0;
            // moreGroup.angle = ;
            lastP += nowValue;
        }

       
    }
    /***获取所有主属性数据条数*/
    getAllBase(){
        let allBase:number = 0;
        for(let key in this.allDataList){
            allBase += this.allDataList[key].count;
        }
        return allBase;
    }
}
