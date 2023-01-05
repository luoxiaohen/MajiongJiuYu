import UIBase from "../UIBase";
import { Global } from "./GloBal";
import MessageCallback from "./MessageCallback";
import Utils from "./Utils";

class Layer{
    layerNode:cc.Node;
    layerWindows:UIBase[]=[];
    constructor(_layerNode){
        this.layerNode=_layerNode;
        this.layerWindows=[];
    }
}

export default class DialogManager {
    private static _ins: DialogManager;
    public static get ins() {
        return this._ins || (this._ins = new DialogManager());
    }
    public rootNode: cc.Node;
    public dialogNode: cc.Node;
    public frontNode: cc.Node;
    public loadedDialogPrefabs: any;
    public createdDialogs: any;
    private layerMap:Map<string,Layer>;
    init(rootNode) {
        this.rootNode = rootNode;
        // 创建dialog node
        this.dialogNode = this.rootNode.getChildByName("tipsLayar");
        this.dialogNode.width = rootNode.width;
        this.dialogNode.height = rootNode.height;
        this.frontNode = this.rootNode.getChildByName("frontNode");
        this.frontNode.width = rootNode.width;
        this.frontNode.height = rootNode.height;
        this.loadedDialogPrefabs = {};
        this.createdDialogs = {};
        this.layerMap=new Map();
        let dialogLayer=new Layer(this.dialogNode);
        let fontNode=new Layer(this.frontNode);
        this.layerMap.set("tipsLayar",dialogLayer);
        this.layerMap.set("frontNode",fontNode);
        MessageCallback.ins.addListener("DesignResolutionChanged", this);
    };

    messageCallbackHandler(route, msg) {
        if (route === "DesignResolutionChanged") {
            this.updateDialogNodeSize(msg);
        }
    };

    updateDialogNodeSize(size) {
        this.dialogNode.width = size.width;
        this.dialogNode.height = size.height;

        this.frontNode.width = size.width;
        this.frontNode.height = size.height;
    };

    /**
     * 创建dialog
     * @param dialogRes dialog种类，必须与prefab和dialog对应的管理js脚本名字相同
     * @param params 创建dialog需要传入的参数
     * @param cb 创建完成的会调
     */
    createDialog(dialogRes, params = {},cb = null,parent=null,layer:number=0) {
        cc.log("create dialog:" + dialogRes)
        // console.log("create dialog:" + dialogRes);
        let fileName = dialogRes;
        let arr = dialogRes.split('/');
        let dialogType = arr[arr.length - 1];
        // 验证数据
        if (!dialogRes) {
            cc.error('Create Dialog failed: dialog type is null');
            console.log("DialogManager ===> 数据验证错误");
            return;
        }
        let createdDialogs = this.createdDialogs;
        let createDialog =  null;
        let loadedDialogPrefabs = this.loadedDialogPrefabs;
        if (!!loadedDialogPrefabs[dialogRes]) {
            console.log("DialogManager ==> not loadedDialogPrefabs")
            createDialog = cc.instantiate(loadedDialogPrefabs[dialogRes]);
            createdDialogs[dialogRes] = createDialog;
            let compenent= createDialog.getComponent(dialogType);
            compenent.dialogParameters = params || {};
            compenent.isDestroy = false;
            createDialog.parent = parent ? parent :(layer?this.frontNode: this.dialogNode);
            createDialog.y = -1920;
            this.onCreatOneDialog(createDialog.parent.name,compenent)
            Global.Utils.invokeCallback(cb, null, createDialog);
        } else {
            console.log("DialogManager ==> to load a new prefab")
            cc.loader.loadRes(fileName, function (err, data) {
                if (!!err) {
                    cc.error(err);
                    Global.Utils.invokeCallback(cb, err);
                }
                else {
                    console.log("DialogManager ==> load handler")
                    loadedDialogPrefabs[dialogRes] = data;
                    createDialog = cc.instantiate(data);
                    console.log("DialogManager ==> load handler"+createDialog.getComponent(dialogType))
                    createdDialogs[dialogRes] = createDialog;
                    let compenent= createDialog.getComponent(dialogType);
                    compenent.dialogParameters = params || {};
                    compenent.isDestroy = false;
                    createDialog.parent = parent ? parent : (layer?this.frontNode: this.dialogNode);
                    createDialog.y = 0;
                    this.onCreatOneDialog(createDialog.parent.name,compenent)
                    Global.Utils.invokeCallback(cb, null, createDialog);
                }
            }.bind(this));
        }
    };
    onCreatOneDialog(parent:string,newDialog:UIBase):void{
        let mapData=this.layerMap.get(parent);
        if(mapData){
            if(newDialog.z_order){
                for(let item of mapData.layerWindows){
                    if(item.z_order==newDialog.z_order){
                        item.node.active=false;
                    }
                }
            }
            mapData.layerWindows.push(newDialog);
        }
    }
    onDestroyOneDialog(dialog:UIBase):void{
        let mapData=this.layerMap.get(dialog.node.parent.name);
        if(mapData){
            let destoryZorder=dialog.z_order;
            for(let index=0;index<mapData.layerWindows.length;index++){
                let item=mapData.layerWindows[index];
                if(item==dialog){
                    mapData.layerWindows.splice(index,1);
                }
            }
            if(destoryZorder){
                for(let index=mapData.layerWindows.length-1;index>=0;index--){
                    let item=mapData.layerWindows[index];
                    if(item.z_order==destoryZorder){
                        item.node.active=true;
                        break;
                    }
                }
            }
        }
    }
    isDialogExit(dialogRes) {
        return !!this.createdDialogs[dialogRes];
    };

    /**
     * 将dialog添加进dialogManager
     * @param dialogType dialog类型
     * @param dialog dialog节点
     */
    addDialogToManager(dialogType, dialog) {
        this.createdDialogs[dialogType] = this.createdDialogs[dialogType] || dialog;
    };

    /**
     * 删除dialog
     * @param dialogRes 删除的dialog类型
     * @param isClearPrefabs 是否清除dialog对应的prefab
     */
    destroyDialog(dialogRes, isClearPrefabs = false) {
        isClearPrefabs = isClearPrefabs || false;
        let createdDialogs = this.createdDialogs;
        let dialog = null;
        let dialogController = null;
        if (typeof (dialogRes) === 'object') {
            dialog = dialogRes.node;
            dialogController = dialogRes;

            for (let key in createdDialogs) {
                if (createdDialogs.hasOwnProperty(key)) {
                    if (createdDialogs[key] === dialog) {
                        dialogRes = key;
                        break;
                    }
                }
            }
        } else {
            dialog = createdDialogs[dialogRes] || null;

            let arr = dialogRes.split('/');
            let dialogType = arr[arr.length - 1];

            if (dialog) {
                dialogController = dialog.getComponent(dialogType);
            }
        }
        if (!dialog) {
            cc.warn('destroy dialog not exist:' + dialogRes);
        }
        else {
            let dialogActionWidgetCtrl = dialog.getComponent("DialogActionWidgetCtrl");
            if (!!dialogActionWidgetCtrl) {
                dialogActionWidgetCtrl.dialogOut(function () {
                    // 删除界面
                    this.onDestroyOneDialog(dialogController);
                    dialog.destroy();
                    dialogController.isDestroy = true;
                    // 移除属性
                    delete createdDialogs[dialogRes];
                    if (isClearPrefabs) {
                        cc.loader.releaseRes(dialogRes);
                        delete this.loadedDialogPrefabs[dialogRes];
                    }
                    cc.log('destroy dialog succeed:' + dialogRes);
                }.bind(this))
            } else {
                // 删除界面
                this.onDestroyOneDialog(dialogController);
                dialog.destroy();
                dialogController.isDestroy = true;
                // 移除属性
                delete createdDialogs[dialogRes];
                if (isClearPrefabs) {
                    cc.loader.releaseRes(dialogRes);
                    delete this.loadedDialogPrefabs[dialogRes];
                }
                cc.log('destroy dialog succeed:' + dialogRes);
            }
        }
    };

    destroyAllDialog(exceptArr = null) {
        cc.log('destroyAllDialog');
        for (let key in this.createdDialogs) {
            if (this.createdDialogs.hasOwnProperty(key)) {
                if (!!exceptArr && exceptArr.indexOf(key) >= 0) continue;
                let dialog = this.createdDialogs[key];
                // 删除界面
                dialog.destroy();
                let arr = key.split('/');
                let dialogType = arr[arr.length - 1];
                let dialogController= dialog.getComponent(dialogType);
                this.onDestroyOneDialog(dialogController);
                dialogController.isDestroy = true;
                // 移除属性
                delete this.createdDialogs[key];
            }
        }
    };

}