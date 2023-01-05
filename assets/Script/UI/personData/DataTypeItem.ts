// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { StatDataItemType } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DataTypeItem extends cc.Component {

    @property(cc.Label)
    item_title: cc.Label = null;

    @property(cc.Label)
    info_title: cc.Label = null;
    @property(cc.Label)
    info_content: cc.Label = null;

    @property(cc.Node)
    info_node:cc.Node=null;
    @property(cc.Sprite)
    info_bg:cc.Sprite=null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Sprite)
    none_data_sprite:cc.Sprite=null;
    @property(cc.Toggle)
    info_toggle:cc.Toggle=null;

    @property(cc.Node)
    data_value_root:cc.Node=null;

    @property(cc.Prefab)
    data_value_item_prefab:cc.Prefab[]=[];

    private showDataItem:cc.Node=null;

    private showTypeArr:cc.Label[]=[];

    private showServerArr:cc.Label[]=[];


    onLoad () {
        Global.EventCenter.addEventListener(EventType.DataTypeItemBgClick,this.onBgClick,this);
    }
  
    private itemType:number=0;
    private typeNumArr:number[]=[];
    public initeData(type:number):void{
        this.itemType=type;
        this.setItemTitleInfo();
        this.item_title.string=this.titleStr;
        this.info_title.string=this.titleStr;
        this.info_content.string=this.infoStr;
        this.info_toggle.node.active=type>StatDataItemType.AveragePer;
        this.info_toggle.node.active=type>StatDataItemType.AveragePer;
        let posSide=type%2;
        if(posSide==0){
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_tankuang_1",this.info_bg);
            this.info_node.x=444;
        }
        this.info_node.active=false;
        this.none_data_sprite.node.active=true;
        if(this.showDataItem){
            this.showDataItem.active=false;
        }

    }
    public setItemValue(type:number,strArr:string[],numArr:number[]):void{
        this.typeNumArr=numArr;
        this.itemType=type;
        this.initShowTypeArr();
       
        let labelArr=this.showTypeArr;
        let client_node=this.showDataItem.getChildByName("client_node");
        if(strArr.includes("-")){
            for(let index=0;index<labelArr.length;index++){
                labelArr[index].string="";
            }
            this.none_data_sprite.node.active=true;
            client_node.active=false
        }else{
            for(let index=0;index<labelArr.length;index++){
                labelArr[index].string=strArr[index];
            }
            client_node.active=true;
            this.none_data_sprite.node.active=false;
        }
    }
    private initShowTypeArr():void{
        let nowShowType=this.getShowType();
        if(!this.showDataItem){
            this.showDataItem=cc.instantiate(this.data_value_item_prefab[nowShowType]);
            this.data_value_root.addChild(this.showDataItem);
        }
        this.showDataItem.active=true;
        if(this.showTypeArr.length==0){
            let client_node=this.showDataItem.getChildByName("client_node")
            for(let insideIndex=0;insideIndex<nowShowType+1;insideIndex++){
                let label=client_node.getChildByName("value_label_"+insideIndex).getComponent(cc.Label);
                let serverRoot=this.showDataItem.getChildByName("server_node");
                if(serverRoot){
                    let serverLabelNode=serverRoot.getChildByName("serverLabel_"+insideIndex);
                    let serverLabel=serverLabelNode.getComponent(cc.Label);
                    this.showServerArr.push(serverLabel);
                }
                this.showTypeArr.push(label);
            }
        }
        this.setItemSeverValueObjShow(false);
    }

    public setSeverData(strArr:string[],serverNumArr:number[]){
        if(this.itemType<=2){
            return;
        }
        if(serverNumArr.length!=this.typeNumArr.length){
            Global.Utils.debugOutput("本地数据跟服务器数据长度不一致");
            return;
        }
        this.setItemSeverValueObjShow(true);
        let serverArr=this.showServerArr;
        let labelArr=this.showTypeArr;
        for(let index=0;index<strArr.length;index++ ){
            serverArr[index].string=strArr[index];
            if(this.typeNumArr[index]>=serverNumArr[index]){
                Global.CCHelper.setLabelColorByBool(labelArr[index],true);
            }else{
                Global.CCHelper.setLabelColorByBool(labelArr[index],false);
            }
        }
       
    }

    onToggleClick():void{
        this.info_node.active=this.info_toggle.isChecked;
        if(this.info_toggle.isChecked){
            Global.EventCenter.dispatchEvent(EventType.OpenDataTypeItemBgClick);
        }
    }
    private onBgClick():void{
        if(this.info_node.active){
            this.info_node.active=false;
            this.info_toggle.isChecked=false;
        }
    }
    private titleStr="";
    private infoStr="";
    private setItemTitleInfo():void{
        let titleStr="";
        let infoStr="";
        switch (this.itemType) {
            case StatDataItemType.Victory:
                titleStr = "胜利局数";
                break;
            case StatDataItemType.AveragePer:
                titleStr = "近七天场均战绩";
                break;
            case StatDataItemType.Zou:
                titleStr = "1走 / 2走 / 3走 / 垫底";
                infoStr="胡牌的先后顺序占比\n可以反映玩家快走慢做的打牌风格";
                break;
            case StatDataItemType.GuoHuLv:
                titleStr = "过胡率";
                infoStr="过胡率=过胡次数/总手数\n直接反映出玩家的自摸欲望强弱";
                break;
            case StatDataItemType.MenZhongKa:
                titleStr = "门清 / 中张 / 卡星五";
                infoStr="玩家在有“门清/中张/卡星五”规则的房间中胡牌时携带对应加番项的占比\n可以一定程度反映玩家的做牌思路";
                break;
            case StatDataItemType.LiuJu:
                titleStr = "流局未听率";
                infoStr="流局未听率=流局未听牌次数/总手数\n一定程度反映出玩家是否具有大心脏，能将牌局内关键牌张扣死";
                break;
            case StatDataItemType.SanFan:
                titleStr = "三番下叫率 / 三番胡牌率";
                infoStr="三番下叫率=三番下叫次数/总手数\n三番胡牌率=三番胡牌次数/总手数\n可以反映出玩家做大牌的欲望强弱和成功率";
                break;
            case StatDataItemType.SanFanDianPao:
                titleStr = "三番点炮率";
                infoStr="三番点炮率=三番点炮次数/总手数\n首先可以真实反映玩家对桌上势态发展的预判正确性，其次，点出三番不一定是损失，但一定具有极强的风险，同时结合三番胡牌率能看出此类打法的得失";
                break;
            case StatDataItemType.DianGang:
                titleStr = "点杠率";
                infoStr="点杠率=给他人点杠次数/总手数\n可以一定程度反映玩家打生张的冒险程度";
                break;
            case StatDataItemType.GangShang:
                titleStr = "杠上花率 / 杠上炮率";
                infoStr="杠上花率=杠上花次数/总手数\n杠上炮率=杠上炮次数/总手数\n高杠上花率能反映出玩家听牌的优劣程度，杠上炮率则能反映出玩家打牌的激进程度";
                break;
        }
        this.titleStr=titleStr;
        this.infoStr=infoStr;
    }
    private showType:number=0;
    private setItemSeverValueObjShow(isshow:boolean):void{
      let serverRoot=this.showDataItem.getChildByName("server_node");
       serverRoot&&(serverRoot.active=isshow);
    }
    private getShowType():number{
        let type=0;
        switch (this.itemType) {
            case StatDataItemType.Victory:
            case StatDataItemType.AveragePer:
            case StatDataItemType.GuoHuLv:
            case StatDataItemType.LiuJu:
            case StatDataItemType.SanFanDianPao:
            case StatDataItemType.DianGang:
                type = 0
                break;
            case StatDataItemType.GangShang:
            case StatDataItemType.SanFan:
                type = 1
                break;
            case StatDataItemType.MenZhongKa:
                type = 2
                break;
            case StatDataItemType.Zou:
                type = 3;
                break;
        }
        return type;
    }
    // update (dt) {}
}
