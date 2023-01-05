import MjSound_test from "../config/MjSound_test";

class ConfigContainer{
    private _list: Array<any>;
    public get list(): Array<any> {
        return this._list;
    }
    public set list(value: Array<any>) {
        this._list = value;
    }
    private _map: {};
    public get map(): {} {
        return this._map;
    }
    public set map(value: {}) {
        this._map = value;
    }
    
    public init<T>(list:Array<T>,map:{})
    {
        this._list =list;
        this._map = map;
    }
    public getDataItem<T>(key:any):T{
        return this.map[key];
    }
    
}
export enum ConfigName{
    MjSound_test="MjSound_test",
}
export default class ConfigManager{
    private static _ins: ConfigManager;
    public static get ins() {
        return this._ins || (this._ins = new ConfigManager());
    }
    public allConfigMap:{[key:string]:ConfigContainer};
    public init():void{
        this.allConfigMap={};
        this.addOneConfig(ConfigName.MjSound_test,new MjSound_test());
    }
    private addOneConfig(name:string, config:any):void{
        let configItemList=[];
        let configItemMap={};
        for(let index=0;index<config.dataLength;index++){
            let dataItem=config.getData(index);
            configItemMap[dataItem.id]=dataItem;
            configItemList.push(dataItem);
        }
        let configContainer=new ConfigContainer();
        configContainer.init(configItemList,configItemMap);
        this.allConfigMap[name]=configContainer;

    }

    public getConfigLength(cofingName:string):number{
        let num=0;
        let config=this.allConfigMap[cofingName];
        if(config){
            num=config.list.length;
        }
        return num;
    }
    //  let config=ConfigManager.ins.getConfigMap(ConfigName.MjSound_test);
    public getConfigMap(configName:string):{}{
        let config=this.allConfigMap[configName];
        if(config){
            return config.map;
        }
        return null;
    }
    // let configList:MjSound_testItem[]=ConfigManager.ins.getConifgList(ConfigName.MjSound_test);
    public getConifgList<T>(configName:string):T[]{
        let list:T[]=[];
        let config=this.allConfigMap[configName];
        if(config){
            return config.list;
        }
        return list;
    }
    // let configList_2:MjSound_testItem[]=ConfigManager.ins.getConfigListByFilter(ConfigName.MjSound_test,function(item){
    //     return item.num==2;
    // });
    public getConfigListByFilter<T>(configName:string,filter:Function):T[]{
        let list=[];
        let config=this.allConfigMap[configName];
        if(config){
            let configList=config.list;
            for(let configItem of configList){
                if(filter(configItem)){
                    list.push(configItem);
                }
            }
        }
        return list;
    }
    //  let coifngData:MjSound_testItem=ConfigManager.ins.getConfigDataItem(ConfigName.MjSound_test,"01015");
    public getConfigDataItem<T>(cofingName:string,key:string):T{
        let config=this.allConfigMap[cofingName];
        if(config){
            let data:T=config.getDataItem(key);;
            return data;
        }
        
        return null;
    }
   

}