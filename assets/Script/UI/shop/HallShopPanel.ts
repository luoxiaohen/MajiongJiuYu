// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import UIBase from "../../UIBase";
import HallShopPackageItem from "./HallShopPackageItem";
import HallShopVipItem from "./HallShopVipItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallShopPanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;
    @property(cc.Sprite)
    private type_bg_1:cc.Sprite=null;
    @property(cc.Sprite)
    private type_bg_2:cc.Sprite=null;

    @property(cc.Label)
    private card_type_label:cc.Label=null;
    @property(cc.Label)
    private god_label:cc.Label=null;
    @property(cc.Label)
    private diamond_label:cc.Label=null;

    @property(cc.Node)
    gold_node:cc.Node=null;

    @property(cc.Node)
    vip_item_content:cc.Node=null;
    @property(cc.Node)
    package_content:cc.Node=null;

    @property(cc.Prefab)
    vip_item_prefab:cc.Prefab=null;
    @property(cc.Prefab)
    gold_part_item:cc.Prefab=null;
    @property(cc.Prefab)
    gold_package_prefab:cc.Prefab=null;
    @property(cc.Prefab)
    vip_fenge_prefab:cc.Prefab=null;
    @property(cc.Prefab)
    package_fenge_prefab:cc.Prefab=null;

    private viewType:number=0;

    start () {
        this.viewType=this.dialogParameters.type;
        this.refreshView();
        this.createShopShow();
    }
    private refreshView():void{
        this.type_bg_1.node.active=this.viewType==0;
        this.type_bg_2.node.active=this.viewType==1;
        this.setLableSizeAndColor(this.card_type_label,this.viewType==0);
        this.setLableSizeAndColor(this.god_label,this.viewType==0);
        this.setLableSizeAndColor(this.diamond_label,this.viewType==1);
        this.gold_node.active=this.viewType==0;

    }
    private createShopShow():void{
        this.createVipItems();
        this.createPackages();
    }
    private vipConfigs:Array<any>=[];
    private createVipItems():void{
        this.vipConfigs=[];
        for(let index=1;index<=3;index++){
            let vipConfigItem:any={};
            vipConfigItem.type=index;
            vipConfigItem.cost=index*300;
            this.vipConfigs.push(vipConfigItem);
        }
        for(let index=0;index<this.vipConfigs.length;index++){
            let vip_item=cc.instantiate(this.vip_item_prefab);
            this.vip_item_content.addChild(vip_item);
            let vip_item_compent=vip_item.getComponent(HallShopVipItem);
            vip_item_compent.initeValue(this.vipConfigs[index]);
            if(index<this.vipConfigs.length-1){
                let fenge_item=cc.instantiate(this.vip_fenge_prefab);
                this.vip_item_content.addChild(fenge_item);
            }
        }
    }
    private packageConfigs:Array<any>=[];
    private createPackages():void{
        this.packageConfigs=[];
        for(let index=1;index<=6;index++){
            let configItem:any={};
            configItem.type=index;
            configItem.cost=300*index;
            configItem.getAward=1000*index;
            configItem.title="礼包"+index;
            this.packageConfigs.push(configItem);
        }
        let partItem:cc.Node=null;
        for(let index=0;index<this.packageConfigs.length;index++){
            if(index%3==0){
                partItem=cc.instantiate(this.gold_part_item);
                this.package_content.addChild(partItem);
            }
            let packageItem=cc.instantiate(this.gold_package_prefab);
            let content=partItem.getChildByName("content");
            content.addChild(packageItem);
            if(index%3<2){
                let fengeItem=cc.instantiate(this.package_fenge_prefab);
                content.addChild(fengeItem);
            }
            let compenent=packageItem.getComponent(HallShopPackageItem);
            compenent.initeValue(this.packageConfigs[index]);
        }
    }
    private chooseColor=cc.color(255,255,255);
    private unchooseColor=cc.color(155,166,170);
    private setLableSizeAndColor(label:cc.Label,ischoose:boolean):void{
        if(ischoose){
            label.fontSize=38,
            label.node.color=this.chooseColor;
        }else{
            label.fontSize=35;
            label.node.color=this.unchooseColor;
        }
    }
    onTagTypeClick(evnet,arg):void{
        this.viewType=Number(arg);
        this.refreshView();
    }
    onCloseBtn():void{
        this.disTory();
    }

    // update (dt) {}
}
