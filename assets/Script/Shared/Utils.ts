// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeEnum, EatCardEnum, GameRuleTypeEnum } from "../enum/EnumManager";
import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import { GamePiaoTypeEnum, GamePlayTypeEnum, GameRoomTypeEnum, TableRuleInfo } from "../proto/LobbyMsgDef";
import { RoomTableInfo } from "../proto/TableMsgDef";
import MajiongHandCard from "../UI/card/MajiongHandCard";
import CreateRoomHelper, { GameOenRoomUseEnum } from "../UI/createRoom/CreateRoomHelper";
import { MajCardLight } from "../utils/InterfaceHelp";
import { Global } from "./GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Utils{
    private static _ins: Utils;
    public static get ins() {
        return this._ins || (this._ins = new Utils());
    }

    /**调试统一输入路劲,方便后期屏蔽*/
    debugOutput(...data:any[]){
        let str:string = data.length > 1 ? "" : data[0];
        if(str == ""){
            for(let i = 0 ; i < data.length ; i++){
                str += data[i];
            }
        }
        console.log(str);
    }
    /**输出对象*/
    debugObj(str:string , obj:any){
        console.log(str);
        for(let key in obj){
            console.log(key + "=" + obj[key]);
        }
    }
    /**暂时的弹窗或者提示类输出,后续会调用相对一的提示提示接口*/
    dialogOutput(data){
        console.log(data);
        //TODO   调用提示对应接口
    }
    /**获取时间日期格式*/
    getDataFormat(data:Date):any{
        let format;
        var date = {
            "M+": data.getMonth() + 1,
            "d+": data.getDate(),
            "h+": data.getHours(),
            "m+": data.getMinutes(),
            "s+": data.getSeconds(),
            "q+": Math.floor((data.getMonth() + 3) / 3),
            "S+": data.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    getPreFabBySource (source : string , type:any = cc.Prefab) : any{
        return cc.resources.get(source , type);
    }
    /*克隆**/
    clone(origin) {
        if (!origin) {
            return;
        }

        var obj = {};
        for (var f in origin) {
            if (origin.hasOwnProperty(f)) {
                obj[f] = origin[f];
            }
        }
        return obj;
    };
    /**克隆数组*/
    cloneArr(arr:Array<any>):Array<any>{
        let newArr:Array<any> = [];
        for(let i = 0 ; i < arr.length ; i++){
            newArr[i] = arr[i];
        }
        return newArr;
    }
    /**长度*/
    size(obj) {
        if (!obj) {
            return 0;
        }

        var size = 0;
        for (var f in obj) {
            if (obj.hasOwnProperty(f)) {
                size++;
            }
        }

        return size;
    };
    /***长度*/
    getLength(obj) {
        var total = 0;
        for (var k in obj) {
            total++;
        }
        return total;
    }

    /**空对象*/
    isEmptyObject(obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    /**格式*/
    isPositiveInteger(num) {
        var r = /^[1-9][0-9]*$/;
        return r.test(num);
    };
    /**IP转换*/
    ipToInt(ip) {
        var parts = ip.split(".");

        if (parts.length != 4) {
            return 0;
        }
        return (parseInt(parts[0], 10) << 24
            | parseInt(parts[1], 10) << 16
            | parseInt(parts[2], 10) << 8
            | parseInt(parts[3], 10)) >>> 0;
    };
    /**基础随机*/
    getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    };
    /**转换*/
    userId2Number(userId) {
        var hash = 5381,
            i = userId.length;

        while (i)
            hash = (hash * 33) ^ userId.charCodeAt(--i);

        /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
         * integers. Since we want the results to be always positive, convert the
         * signed int to an unsigned by doing an unsigned bitshift. */
        return Number(hash >>> 0);
    };

    /**时间转换*/
    DAY_MS = 24 * 60 * 60 * 1000;
    getIntervalDay(time1, time2) {
        return Math.abs((Math.floor(time1 / this.DAY_MS) - Math.floor(time2 / this.DAY_MS)));
    };

    /**使数字保留count个小数位*/
    numToFixed(number, count) {
        var count_ = count || 2;
        return parseFloat(parseFloat(number).toFixed(count_));
    };

    /**生成随机字符串*/
    randomString(len) {
        len = len || 16;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
    /**获取单位向量*/ 
    getUnitVector(startPoint, endPoint) {
        let point = cc.v2(0, 0);
        let distance;
        distance = Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2);
        distance = Math.sqrt(distance);
        if (distance === 0) return point;
        point.x = (endPoint.x - startPoint.x) / distance;
        point.y = (endPoint.y - startPoint.y) / distance;
        return point;
    };
    /**修改图片*/
    setNewImageToSprite(sprite : cc.Sprite , url:string ,cb = null){
        cc.loader.loadRes(url , cc.SpriteFrame , null , (err , res)=>{
            if(err){
                console.error("image err" + err)
            }
            sprite.spriteFrame = res;
            if(cb){
                Utils.ins.invokeCallback(cb);
            }
        })
    }
    /***通过游戏类型获取最大游戏人数*/
    getMaxPlayerByGameType(roomType:GameRoomTypeEnum):number{
        switch(roomType){
            case GameRoomTypeEnum.SiRenSanFang:
                return 4;
            case GameRoomTypeEnum.SiRenLiangFang:
                return 4;
            case GameRoomTypeEnum.SanRenLiangFang:
                return 3;
            case GameRoomTypeEnum.LiangRenMaJiang:
                return 2;
                
        }
    }
    /***通过游戏类型获取最大麻将张数*/
    getMaxMajiongByGameType(roomType:GameRoomTypeEnum):number{
        switch(roomType){
            case GameRoomTypeEnum.SiRenSanFang:
                return 108;
            case GameRoomTypeEnum.SiRenLiangFang:
                return 72;
            case GameRoomTypeEnum.SanRenLiangFang:
                return 72;
            case GameRoomTypeEnum.LiangRenMaJiang:
                return 72;
        }
    }
    /***通过游戏类型获取最大牌墙的基础排列*/
    getMajiongWallByGameType(roomType:GameRoomTypeEnum):Array<number>{
        switch(roomType){
            case GameRoomTypeEnum.SiRenSanFang:
                return [28,26,28,26];
            case GameRoomTypeEnum.SiRenLiangFang:
                return [];
            case GameRoomTypeEnum.SanRenLiangFang:
                return [];
            case GameRoomTypeEnum.LiangRenMaJiang:
                return [];
        }
    }
     /***通过游戏类型获取游戏名字*/
     getGameNameByGameType(roomType:GamePlayTypeEnum):string{
        switch(roomType){
            case GamePlayTypeEnum.HuanSanZhang:
                return "换三张";
            case GamePlayTypeEnum.XueZhanDaoDi:
                return "血战到底";
        }
    }
     /***通过游戏类型获取游戏名字*/
     getGameTypeNameByGameType(roomType:GameRoomTypeEnum):string{
        switch(roomType){
            case GameRoomTypeEnum.SiRenSanFang:
                return "四人三房";
            case GameRoomTypeEnum.SiRenLiangFang:
                return "四人两房";
            case GameRoomTypeEnum.SanRenLiangFang:
                return "三人两房";
            case GameRoomTypeEnum.LiangRenMaJiang:
                return "两人两房";
                
        }
    }
    /**
     * 创建一个预制体对象
     * @param file 路径
     * @param parent 父对象
     * @param parm : 参数
     * @param point : 位置
     * @param cb 回调
    */
    createObjToNode(file : string , parent:cc.Node , parm : any , point : cc.Vec2 = cc.v2(0,0) , cb = null){
        console.log("Utils ==> createObjToNode , file:" , file)
        let arr = file.split('/');
        let dialogType = arr[arr.length - 1];
        cc.loader.loadRes(file, function (err, data) {
            if (!!err) {
                cc.error(err);
                Utils.ins.invokeCallback(cb, err);
            }
            else {
                let createObj = cc.instantiate(data);
                createObj.getComponent(dialogType).dialogParameters = parm;
                createObj.getComponent(dialogType).isDestroy = false;
                createObj.parent = parent;
                createObj.x = point.x;
                createObj.y = point.y;
                Utils.ins.invokeCallback(cb, null, createObj);
            }
        }.bind(this));
    }
    /** 截取英文字符的长度*/
    getStringByRealLength(str, length) {
        let realLength = 0;
        for (let i = 0; i < str.length; ++i) {
            let count = str.charCodeAt(i);
            if (count >= 0 && count <= 128) {
                ++realLength;
            } else {
                realLength += 2;
            }
            if (realLength >= length) {
                break;
            }
        }
        return str.substring(0, realLength + 1);
    };
    /**获得从m中取n的所有组合*/
    getCombinationFlagArrs(m, n) {
        if (!n || n < 1 || m < n) {
            return [];
        }
        if (m === n) {
            return [[1, 1]];
        }
        let resultArrs = [],
            flagArr = [],
            isEnd = false,
            i, j, leftCnt;

        for (i = 0; i < m; i++) {
            flagArr[i] = i < n ? 1 : 0;
        }

        resultArrs.push(flagArr.concat());

        while (!isEnd) {
            leftCnt = 0;
            for (i = 0; i < m - 1; i++) {
                if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
                    for (j = 0; j < i; j++) {
                        flagArr[j] = j < leftCnt ? 1 : 0;
                    }
                    flagArr[i] = 0;
                    flagArr[i + 1] = 1;
                    let aTmp = flagArr.concat();
                    resultArrs.push(aTmp);
                    if (aTmp.slice(-n).join("").indexOf('0') === -1) {
                        isEnd = true;
                    }
                    break;
                }
                flagArr[i] === 1 && leftCnt++;
            }
        }
        return resultArrs;
    };


    stringFormat() {
        if (arguments.length === 0)
            return null;
        let str = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
            let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };

    getFileName(stack) {
        return stack[1].getFileName();
    }

    getLineNumber(stack) {
        return stack[1].getLineNumber();
    }
    /**
     * Check and invoke callback function
     */
     invokeCallback(cb, ...agrs) {
        if (!!cb && typeof cb === 'function') {
            cb.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    };


    getCardStrByValue(value:number):string{
        let str:string = "";
        let ten : number = Math.floor(value/10);
        let one : number = value%10;
        str = ten + "_" + one; 
        return str;
    }

    /**获取某一张牌是否是定缺牌*/
    getIsDice(value :number , type:CardTypeEnum):boolean{
        return Math.floor(value/10) == type;
    }
    compare(a,b){
        if(a<b){
            return -1;
        }else if(a > b){
            return 1;
        }else{
            return 0;
        }
    }
    compareV2(a:cc.Vec2,b:cc.Vec2){
        if(a.x<b.x){
            return -1;
        }else if(a.x > b.x){
            return 1;
        }else{
            return 0;
        }
    }
    compareX(a:MajiongHandCard,b:MajiongHandCard){
        if(a.node.x<b.node.x){
            return -1;
        }else if(a.node.x>b.node.x){
            return 1;
        }else{
            return 0;
        }
    }
    compareY(a:MajiongHandCard,b:MajiongHandCard){
        if(a.node.y>b.node.y){
            return -1;
        }else if(a.node.y<b.node.y){
            return 1;
        }else{
            return 0;
        }
    }
    compareLight(a:MajCardLight,b:MajCardLight){
        if(a.cardLight<b.cardLight){
            return -1;
        }else if(a.cardLight>b.cardLight){
            return 1;
        }else{
            return 0;
        }
    }
    compareValue(a:MajiongHandCard,b:MajiongHandCard){
        if(a.cardValue<b.cardValue){
            return -1;
        }else if(a.cardValue>b.cardValue){
            return 1;
        }else{
            return 0;
        }
    }
    getOutType(isGang : number,fromeNum : number , eatNum : number , isHave : boolean , haveEatType : EatCardEnum):EatCardEnum{
        console.log("isGang="+isGang)
        console.log("fromeNum="+fromeNum)
        console.log("eatNum="+eatNum)
        console.log("isHave="+isHave)
        console.log("haveEatType="+haveEatType)
        let num : number = (fromeNum - eatNum + 40)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
        if(isHave){
            if(haveEatType == EatCardEnum.EatUp){
                return EatCardEnum.CrossAllUp;
            }
            if(haveEatType == EatCardEnum.EatDown){
                return EatCardEnum.CrossAllDown;
            }
            if(haveEatType == EatCardEnum.EatOpposite){
                return EatCardEnum.CrossAllOpp;
            }
        }
        if(isGang == 0){
            switch(num){
                case 0:
                    return EatCardEnum.EndValue;
                case 1:
                    return EatCardEnum.EatDown;
                case 2:
                    return EatCardEnum.EatOpposite;
                case 3:
                    return EatCardEnum.EatUp;
            }
        }else{
            switch(num){
                case 0:
                    return EatCardEnum.CrossSelf;
                case 1:
                    return EatCardEnum.CrossDown;
                case 2:
                    return EatCardEnum.CrossOpposite;
                case 3:
                    return EatCardEnum.CrossUp;
            }
        }

        return EatCardEnum.EndValue;
    }

    webCopyString(str: string, cb?: Function) {
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt';
        const selection = getSelection()!;
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;
 
        var success = false;
        try {
            success = document.execCommand('copy');
        }
        catch (err) {
 
        }
 
        document.body.removeChild(el);
 
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
 
        cb && cb(success);
        if (success) {
            console.log("复制成功");
        }
        else {
            console.log("复制失败");
        }
        return success;
    }
    public getMaJiangValue(id:number):string{
        let mj:string = "";
        let num : number = id %10 ;
        let type:number = Math.floor(id / 10);
        if(type == 0){
            mj = num + "万";
        }
        else if(type == 1){
            mj = num + "条";
        }
        else if(type == 2){
            mj = num + "筒";
        }
        return mj;	
    }


    showPanelAction(panel:cc.Node , point:cc.Vec2 , time:number=0){
        cc.tween(panel).to(time ? time : TimeAndMoveManager.ins.showPanelTime , {x : point.x , y : point.y}).start();
    }
    hidePanelAction(panel:cc.Node, point:cc.Vec2 , callBack:Function , thisObj : any , time : number = 0){
        cc.tween(panel).to(time ? time : TimeAndMoveManager.ins.showPanelTime , {x : point.x , y : point.y}).call(()=>{
            callBack.bind(thisObj)();
        }).start();
    }
    setGray(sprite : cc.Sprite , isAdd:boolean){
        let meta = cc.Material.getBuiltinMaterial("builtin-2d-sprite");
        if(isAdd){
            meta = cc.Material.getBuiltinMaterial("builtin-2d-gray-sprite");
        }
        sprite.setMaterial(0 , meta);
    }
    showWait(){
        
    }
    hideWait(){

    }


    playSound(resource:string ,isLoop:boolean=false, voice:number=1){
        /**测试时候避免声音重复,所以目前只播放庄家相关的声音*/
        if(UserInfo.ins.mySitIndex != GameInfo.ins.nowBookMakerSit){
            return;
        }
        cc.loader.loadRes(resource, (err, clip)=>{
            if (!!err) { } else {
                cc.audioEngine.play(clip, isLoop, voice);
            }
        });
    }
    getSoundRandom():number{
        let math:number = Math.random()*100;
        return Math.floor(math/25) + 1
    }

    getNeedByRule(ruleInfo:TableRuleInfo):number{
        let initUse : number = CreateRoomHelper.ins.openRoomUseGlod[GameOenRoomUseEnum.Base - 1].createPlayerUse;
		let mut : number = ruleInfo.handsCnt/8;
		if(ruleInfo.baozi >= GamePiaoTypeEnum.ZhuangJiaBiPiao ){
			initUse += CreateRoomHelper.ins.openRoomUseGlod[GameOenRoomUseEnum.Piao - 1].createPlayerUse;
		}
		if(ruleInfo.haveHorse > 0){
			initUse += CreateRoomHelper.ins.openRoomUseGlod[GameOenRoomUseEnum.BuyHorse - 1].createPlayerUse;
			if(ruleInfo.isSelectBankerBuyHorse){
				initUse += CreateRoomHelper.ins.openRoomUseGlod[GameOenRoomUseEnum.BankerBuyHorse - 1].createPlayerUse;
			}
		}
        return initUse;
    }

    formNumToGivenStr(_str:string,_strArr:string[]):string{
        let str="";
        for(let index=0;index<_strArr.length;index++){
            str=_str.replace(`{${index}}`,_strArr[index]);
        }
        return str;
    }

    getlocalStorageItem(name){
        return cc.sys.localStorage.getItem(name);
    }
    addlocalStorageItem(name , value){
        return cc.sys.localStorage.setItem(name , value);
    }
    getRoomTableInfoStr(rule:TableRuleInfo):string{
        let str="规则:";
        let ruleMapInfo=this.getRuleMapInfo();
        if(!rule){
            return;
        }
        if(rule.ceiling){
            str+=Global.Utils.formNumToGivenStr(ruleMapInfo[GameRuleTypeEnum.FengDing][0],[rule.ceiling.toString()])+"、";
        }
        if(rule.zmType){
            str+=ruleMapInfo[GameRuleTypeEnum.ZiMo][rule.zmType]+"、";
        }
        if(rule.tiFan){
            str+=Global.Utils.formNumToGivenStr(ruleMapInfo[GameRuleTypeEnum.TiFan][0],[rule.tiFan.toString()])+"、";
        }
        if(rule.dianGangHua){
            str+=ruleMapInfo[GameRuleTypeEnum.DianGangHua][rule.dianGangHua]+"、";
        }
        if(rule.sunshine){
            str+=ruleMapInfo[GameRuleTypeEnum.ShaiTaiYang][rule.sunshine]+"、";
        }
        if(rule.baozi){
            str+=ruleMapInfo[GameRuleTypeEnum.Baozi][rule.baozi]+"、";
        }
        if(rule.baoziDouble){
            str+=ruleMapInfo[GameRuleTypeEnum.ShuangBao][0]+"、";
        }
        if(rule.caGua){
            str+=ruleMapInfo[GameRuleTypeEnum.BaoYu][0]+"、";
        }
        if(rule.jiShiYu){
            str+=ruleMapInfo[GameRuleTypeEnum.JiShiYu][0]+"、";
        }
        if(rule.allGangShift){
            str+=ruleMapInfo[GameRuleTypeEnum.LiangGangTongChuan][0]+"、";
        }
        if(rule.menqing){
            str+=ruleMapInfo[GameRuleTypeEnum.MenQing][0]+"、";
        }
        if(rule.zhongzhang){
            str+=ruleMapInfo[GameRuleTypeEnum.ZhongZhang][0]+"、";
        }
        if(rule.yao9){
            str+=ruleMapInfo[GameRuleTypeEnum.YaoJiu][0]+"、";
        }
        if(rule.jiangdui){
            str+=ruleMapInfo[GameRuleTypeEnum.JiangDui][0]+"、";
        }
        if(rule.tdHu){
            str+=ruleMapInfo[GameRuleTypeEnum.TianDiHu][0]+"、";
        }
        if(rule.jiaxin5){
            str+=ruleMapInfo[GameRuleTypeEnum.JiaXinWu][0]+"、";
        }
        if(rule.lunZhuang){
            str+=ruleMapInfo[GameRuleTypeEnum.LunZhuang][0]+"、";
        }
        if(rule.passHu){
            str+=ruleMapInfo[GameRuleTypeEnum.GuoShouHu][0]+"、";
        }
        if(rule.hu2Score){
            str+=ruleMapInfo[GameRuleTypeEnum.LiangFenQiHu][0]+"、";
        }
        if(rule.last4Hu){
            str+=ruleMapInfo[GameRuleTypeEnum.ZuiHouSiZhang][0]+"、";
        }
        if(rule.findMaxHu){
            str+=ruleMapInfo[GameRuleTypeEnum.ChaDaHu][0]+"、";
        }
        if(rule.zmOpen){
            str+=ruleMapInfo[GameRuleTypeEnum.ZiMoLiangPai][0]+"、";
        }
        if(rule.realTimeCalc){
            str+=ruleMapInfo[GameRuleTypeEnum.ShiShiJieSuan][0]+"、";
        }
        str=str.slice(0,str.length-1);
        return str;
    }
    private ruleMapInfo=null;
    private getRuleMapInfo():any{
        if(this.ruleMapInfo){
            return  this.ruleMapInfo;
        }
        this.ruleMapInfo={};
        this.ruleMapInfo[GameRuleTypeEnum.FengDing]=["封顶{0}倍"];
        this.ruleMapInfo[GameRuleTypeEnum.ZiMo]=["","自摸加番","自摸加底"];
        this.ruleMapInfo[GameRuleTypeEnum.GameType]=["","血战","换三张"];
        this.ruleMapInfo[GameRuleTypeEnum.Baozi]=["","豹子","甩飘","庄家必飘"];
        this.ruleMapInfo[GameRuleTypeEnum.ShuangBao]=["双豹"];
        this.ruleMapInfo[GameRuleTypeEnum.BaoYu]=["暴雨"];
        this.ruleMapInfo[GameRuleTypeEnum.JiShiYu]=["及时雨"];
        this.ruleMapInfo[GameRuleTypeEnum.LiangGangTongChuan]=["连杠通转"];
        this.ruleMapInfo[GameRuleTypeEnum.MenQing]=["门清"];
        this.ruleMapInfo[GameRuleTypeEnum.ZhongZhang]=["中张"];
        this.ruleMapInfo[GameRuleTypeEnum.YaoJiu]=["幺九"];
        this.ruleMapInfo[GameRuleTypeEnum.JiangDui]=["将对"];

        this.ruleMapInfo[GameRuleTypeEnum.TianDiHu]=["天地胡"];
        this.ruleMapInfo[GameRuleTypeEnum.JiaXinWu]=["夹心五"];
        this.ruleMapInfo[GameRuleTypeEnum.LunZhuang]=["轮庄"];
        this.ruleMapInfo[GameRuleTypeEnum.TiFan]=["梯番{0}倍"];
        this.ruleMapInfo[GameRuleTypeEnum.GuoShouHu]=["过手胡"];
        this.ruleMapInfo[GameRuleTypeEnum.LiangFenQiHu]=["两分起胡"];
        this.ruleMapInfo[GameRuleTypeEnum.ZuiHouSiZhang]=["最后四张必胡"];
        this.ruleMapInfo[GameRuleTypeEnum.ChaDaHu]=["查大叫"];
        this.ruleMapInfo[GameRuleTypeEnum.DianGangHua]=["","点杠花(自摸)","点杠花(点炮)"];
        this.ruleMapInfo[GameRuleTypeEnum.ShaiTaiYang]=["","晒太阳","晒太阳(反雨)"];
        this.ruleMapInfo[GameRuleTypeEnum.ZiMoLiangPai]=["自摸亮牌"];
        this.ruleMapInfo[GameRuleTypeEnum.ShiShiJieSuan]=["实时结算"];
        return this.ruleMapInfo;
    }
}
