// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DataCompareType } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CompareDataItem extends cc.Component {
    @property
    view_type:number=0;
    @property(cc.Node)
    data_node_arr:cc.Node[]=[];
    @property(cc.Node)
    none_node:cc.Node=null;

    @property(cc.Label)
    type_name_arr: cc.Label[] = [];
    @property(cc.Label)
    compare_value_arr_1: cc.Label[] = [];
    @property(cc.Label)
    compare_value_arr_2: cc.Label[] = [];
    @property(cc.Label)
    compare_value_average: cc.Label[] = [];
    @property(cc.Node)
    none_spite_arr:cc.Node[]=[];
  

    private compareValue_1:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>};
    private compareValue_2:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>};
    private compareAverage:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>};
   
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    initValue(type:number):void{
        if(type==DataCompareType.HuNums||type==DataCompareType.MengQingZhongKa){
            let nameArr=this.getDataStr(type);
            for(let index=0;index<nameArr.length;index++){
                this.type_name_arr[index].string=nameArr[index];
            }
        }else{
            this.type_name_arr[0].string=this.getDataStr(type);
        }
        for(let item of this.data_node_arr){
            item.active=false;
        }
    }
    setValue_Compare(type:number,valueArr_1:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>},valueArr_2:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>}):void{
        this.none_node.active=true;
        this.compareValue_1=valueArr_1;
        this.compareValue_2=valueArr_2;
        this.data_node_arr[0].active=valueArr_1.dataStrArr[type].length>0&&!valueArr_1.dataStrArr[type].includes("-");
        this.data_node_arr[1].active=valueArr_2.dataStrArr[type].length>0&&!valueArr_2.dataStrArr[type].includes("-");

        for(let index=0;index<valueArr_1.dataStrArr[type].length;index++){
            this.compare_value_arr_1[index].string=valueArr_1.dataStrArr[type][index];
        }
        for(let index=0;index<valueArr_2.dataStrArr[type].length;index++){
            this.compare_value_arr_2[index].string=valueArr_2.dataStrArr[type][index];
        }
        this.none_spite_arr[0].active=valueArr_1.dataStrArr[type].length==0||valueArr_1.dataStrArr[type].includes("-");
        this.none_spite_arr[1].active=valueArr_2.dataStrArr[type].length==0||valueArr_2.dataStrArr[type].includes("-");
        this.setValueDataLabelColor(type)
       
    }
    private commonColor=cc.color(155,166,170);
    setValue_Server(type:number, average:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>}):void{
        this.compareAverage=average;
        this.setValueDataLabelColor(type);
        this.data_node_arr[2].active=true;
        if(type<=DataCompareType.ScorePer||type==DataCompareType.HuNums){
            this.none_spite_arr[2].active=false;
            this.compare_value_average[0].string="X";
            this.compare_value_average[0].node.color=this.commonColor;
            return;
        }
        for(let index=0;index<average.dataStrArr[type].length;index++){
            this.compare_value_average[index].string=average.dataStrArr[type][index]+"";
        }
        this.none_spite_arr[2].active=average.dataNumArr.length==0;
    }
    private setValueDataLabelColor(type:number):void{
        if(!this.compareAverage){
            return;
        }
        if(type>DataCompareType.ScorePer&&type<DataCompareType.HuNums){
            for(let index=0;index<this.compare_value_arr_1.length;index++){
                if(this.compareValue_1.dataStrArr[type][index]=="-"){
                    this.compare_value_arr_1[index].node.color=this.commonColor;
                    continue;
                }
                Global.CCHelper.setLabelColorByBool(this.compare_value_arr_1[index],this.compareValue_1.dataNumArr[type][index]>=this.compareAverage.dataNumArr[type][index]);
            }
            for(let index=0;index<this.compare_value_arr_2.length;index++){
                if(this.compareValue_2.dataStrArr[type][index]=="-"){
                    this.compare_value_arr_2[index].node.color=this.commonColor;
                    continue;
                }
                Global.CCHelper.setLabelColorByBool(this.compare_value_arr_2[index],this.compareValue_2.dataNumArr[type][index]>=this.compareAverage.dataNumArr[type][index]);
            }
        }
    }
    private typeStrArr=[
        "总局数",
        "总手数",
        "胜利局数",
        "场均战绩",
        "过胡率",
        "流局未听率",
        "三番下叫率",
        "三番胡牌率",
        "三番点炮率",
        "点杠率",
        "杠上花率",
        "杠上炮率",
        ["门清","中张","卡星五"],
        ["1走","2走","3走","垫走"],
    ]
    // update (dt) {}
    private getDataStr(type:DataCompareType):any{
        return this.typeStrArr[type];
    }
}
