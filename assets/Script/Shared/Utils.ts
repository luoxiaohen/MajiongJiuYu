// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../com/CallBack";
import DialogTip from "../com/dialog/DialogTip";
import { ArtFontEnum as ArtFontEnum, CardTypeEnum, EatCardEnum, GameRuleTypeEnum, LocalStorageKeyEnum } from "../enum/EnumManager";
import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import { Msg_SC_FeeCountData, Msg_SC_PubBaseCountData } from "../proto/LobbyMsg";
import { GamePiaoTypeEnum, GamePlayTypeEnum, GameRoomTypeEnum, PlayerInfo, TableRuleInfo } from "../proto/LobbyMsgDef";
import { FanTypeEnum, GameResultInfo, GangTypeEnum, HorserInfo, HuTypeEnum, RoomTableInfo, ScoreEventInfo, SitInfo } from "../proto/TableMsgDef";
import MajiongHandCard from "../UI/card/MajiongHandCard";
import CreateRoomHelper, { GameOenRoomUseEnum } from "../UI/createRoom/CreateRoomHelper";
import { MajCardLight, OverBuyHorseInfoData } from "../utils/InterfaceHelp";
import DialogManager from "./DialogManager";
import { Global } from "./GloBal";
import MajiongRes from "../UI/MajiongRes";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Utils{
    private static _ins: Utils;
    public static get ins() {
        return this._ins || (this._ins = new Utils());
    }
    /**
     * 是否打开报错提示弹窗
     * @param _state 
     */
    setErroShow(_state:boolean=true):void{
        if(_state){
            window.onerror = function (msg, url, line, column, detail) {
                alert("出错啦，请把此信息给客户端查看解决报错！！！\n" + msg + "\n" + detail.stack);
            };
        }else{
            window.onerror= function (msg, url, line, column, detail){
                // console.error("报错了！！！");
            }
        }
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
        this.dialogOutTips(data);
    }
    diaLogOutBy00(str:string){
        Global.Utils.dialogOutTips(str, null , (dialog)=>{
            dialog.x = 540;
            dialog.y = -960;
        } , this);
    }
    dialogOutTips(str:string,callBack:CallBack=null,loadCallBack=null,thisObj=null){
        DialogManager.ins.createDialog("comResource/prefab/DialogTip",{str:str,callBack:callBack},(e,dialog)=>{
            if(loadCallBack && thisObj){
                loadCallBack.bind(thisObj)(dialog);
            }
            (dialog.getComponent(DialogTip) as DialogTip).startAction();
        },null,1);
    }
    /**
     * 通用询问弹窗 
     * @param content 提示内容
     * @param dilogType 1:只有一个确定按钮  2:有确定和取消按钮
     * @param confirmCallback 点击确定按钮回调 
     * @param cancelCallBack 点击取消按钮回调
     * 
     */
    dialogOutConfirm(content:string,dialogType:number=2,confirmCallback:CallBack=null,cancelCallBack:CallBack=null,loadCallBack=null,thisObj:any=null,eventTypes:string[]=[]):void{
        let param={
            content:content,
            dialogType:dialogType,
            confirm:confirmCallback,
            cancel:cancelCallBack,
            eventTypes:eventTypes
        }
        DialogManager.ins.createDialog("comResource/prefab/DialogConfirm",param,function(data,dialog){
            let scenename=GameInfo.ins.nowSceneName;
            if(scenename=="majiong"){
                dialog.width=1080;
                dialog.height=1920;
                dialog.y=-1920/2;
                dialog.x=1080/2;
            }else{
                dialog.width=1920;
                dialog.height=1080;
                dialog.y=0;
                dialog.x=0;
            }
            if(loadCallBack&& thisObj){
                loadCallBack.bind(thisObj)(dialog);
            }
        },null,1);
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
    /**
     * 时间戳为10位需*1000，时间戳为13位的话不需乘1000
     *时间戳转换成日期年月日 时分秒 如 2022/11/23 10:12:58
     * @param timestamp 
     * @param type  0:年月日 1:时分秒 2:年月日时分秒 3:年月日时分
     * @returns 
     */
    public timestampToTime(timestamp,type=0,split:string="/"):string {
        let date = new Date(timestamp);
        let Y = date.getFullYear() + split;
        let M_num=date.getMonth();
        let M = ( M_num+ 1 < 10 ? '0' + (M_num + 1) : M_num + 1) + split;
        let D_num= date.getDate();
        let D =  ( D_num < 10 ? '0' + (D_num) : D_num) + ' ';
        let h_num=date.getHours();
        let h = (h_num>=10?h_num:"0"+h_num);
        let m_num=date.getMinutes();
        let m =":"+(m_num>=10?m_num:"0"+m_num);
        let s_num=date.getSeconds();
        let s =":"+ (s_num>=10?s_num:"0"+s_num);
        let str="";
        switch (type) {
            case 0:
                str = Y + M + D ;
                break;
            case 1:
                str= h+m+s;
                break;
            case 2:
                str=Y+M+D+h+m+s;
                break;
            case 3:
                str = Y + M + D + h + m;
                break;
        }
        return str;
    }

    public getTimesNumArrByTamp(timestamp):number[]{
        let date = new Date(timestamp);
        let Y = date.getFullYear();
        let M = date.getMonth() + 1 ;
        let D = date.getDate();
        let h = date.getHours() ;
        let m = date.getMinutes() ;
        let s = date.getSeconds();
        return [Y,M,D,h,m,s];
    }
    
    public getWeekStrByTamp(timestamp):string{
        let weekday=["周日","周一","周二","周三","周四","周五","周六"];
        let data=new Date(timestamp);
        return weekday[data.getDay()];
    }
    public  getRemainTime(timeDiff: number): string {
        let days = Math.floor(timeDiff / (24 * 3600));
        let hours = Math.floor(timeDiff % (24 * 3600) / 3600);
        let minutes = Math.floor(timeDiff % 3600 / 60);
        let sec = Math.floor(timeDiff % 60);
        let str = (days > 0 ? String(days) + ":" : "") +(hours>0?this.formatTime(hours)+":":"")+ this.formatTime(minutes) + ":" + this.formatTime(sec);
        return str;
    }
    private  formatTime(value: number): string {
        if (value < 0) {
            value = 0;
        }
        if (Number(value) >= 10) {
            return String(value);
        }
        return "0" + String(value);
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

    /**设置麻将*/
    setMJImageToSprite(sprite: cc.Sprite, url: string, cb = null){
        let res = cc.find("mainMajiong/mjRes");
        if(!res){
            if(cb){
                Utils.ins.invokeCallback(cb);
            }
            cc.error("没有找到麻将图Res资源");
            return;
        }

        sprite.spriteFrame = res.getComponent(MajiongRes).getSpriteFrame(url);
        if(cb){
            Utils.ins.invokeCallback(cb);
        }
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
    public getAllFanStr(code : FanTypeEnum,info:ScoreEventInfo=null):string{
		let str : string = "";
        switch (code) {
            case FanTypeEnum.Gen:
                if (info) {
                    str = info.param + "根";
                }
                break;
            case FanTypeEnum.GangShangHua:
                str = "杠上花";
                break;
            case FanTypeEnum.GangShangPao:
                str = "杠上炮";
                break;
            case FanTypeEnum.QiangGangHu:
                str = "抢杠胡";
                break;
            case FanTypeEnum.HaiDiLaoYue:
                str = "海底捞月";
                break;
            case FanTypeEnum.MenQing:
                str = "门清";
                break;
            case FanTypeEnum.ZhongZhang:
                str = "中张";
                break;
            case FanTypeEnum.JiaXinWu:
                str = "夹心五";
                break;
            case FanTypeEnum.ZiMo:
                str = "自摸加番";
                break;
            case FanTypeEnum.TianHu:
                str = "天胡";
                break;
            case FanTypeEnum.DiHu:
                str = "地胡";
                break;
        }
        if(str!=""){
            return str + ",";
        }
        return str;
	}

    public getAllHuStr(code : HuTypeEnum):string{
		let str : string = "";
		switch(code){
			case HuTypeEnum.PingHu : 
				str = "平胡";
			break;
			case HuTypeEnum.DuiDuiHu : 
				str = "对对胡";
			break;
			case HuTypeEnum.QingYiSe : 
				str = "清一色";
			break;
			case HuTypeEnum.QiDui : 
				str = "七对";
			break;
			case HuTypeEnum.LongQiDui : 
				str = "龙七对";
			break;
			case HuTypeEnum.JinGouDiao : 
				str = "金钩钓";
			break;
			case HuTypeEnum.YaoJiu : 
				str = "幺九";
			break;
			case HuTypeEnum.JiangDui : 
				str = "将对";
			break;
		}
		return str + ",";
	}
    public getAllGangStr(code : GangTypeEnum):string{
		let str : string = "";
		switch(code){
			case GangTypeEnum.eAnGang : 
				str = "暗杠";
			break;
			case GangTypeEnum.eDianGang : 
				str = "点杠";
			break;
			case GangTypeEnum.eBuGang : 
				str = "补杠";
			break;
			case GangTypeEnum.eCaGua : 
				str = "擦挂";
			break;
		}
		return str + ",";
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
        if(type == CardTypeEnum.EndValue){
            return false;
        }
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
        // console.log("isGang="+isGang)
        // console.log("fromeNum="+fromeNum)
        // console.log("eatNum="+eatNum)
        // console.log("isHave="+isHave)
        // console.log("haveEatType="+haveEatType)
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
        let meta = cc.Material.getBuiltinMaterial("2d-sprite");
        if(isAdd){
            meta = cc.Material.getBuiltinMaterial("2d-gray-sprite");
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
    getDairuByRule(ruleInfo : TableRuleInfo):number{
        let isOpenBookmakerMustBuyHorse:boolean = false;
        let allMut : number = 0;
		allMut += CreateRoomHelper.ins.initialMultiple;
		if(ruleInfo.haveHorse){
			allMut += CreateRoomHelper.ins.openBuyHorseMultiple;
		}
		if(ruleInfo.baozi){
			allMut += CreateRoomHelper.ins.openDoubleMultiple;
		}
		if(ruleInfo.handsCnt==16){
			allMut += CreateRoomHelper.ins.moreHandMultiple;
		}
		if(ruleInfo.gamePlayType==2){
			allMut += CreateRoomHelper.ins.changeThreeMultiple;
		}
		if(ruleInfo.isSelectBankerBuyHorse){
			isOpenBookmakerMustBuyHorse = true;
		}
		let need : number = ruleInfo.baseScore*allMut;
		if(isOpenBookmakerMustBuyHorse){
			need *= CreateRoomHelper.ins.openBookmakerMustBuyHorseMultiple;
		}
        let have : number = UserInfo.ins.myInfo.gold;
        return have;
    }

    formNumToGivenStr(_str:string,_strArr:string[]):string{
        for(let index=0;index<_strArr.length;index++){
            _str=_str.replace(`{${index}}`,_strArr[index]);
        }
        return _str;
    }

    getlocalStorageItem(name){
        return cc.sys.localStorage.getItem(name);
    }
    setlocalStorageItem(name , value){
        return cc.sys.localStorage.setItem(name , value);
    }
    public clearAllStorage():void{
        cc.sys.localStorage.clear();
    }
  

    getMapLength(map:any):number{
        let num=0;
        for(let key in map){
            num++;
        }
        return num;
    }

   

    public getPlayerInfo(sitInfo:SitInfo[],sitNum:number):PlayerInfo{
        let player:PlayerInfo=null;
        for(let item of sitInfo){
            if(item.sitNum==sitNum){
                player=item.player;
            }
        }
        return player;
    }
    public setLabelFont(artFont:ArtFontEnum,targetlabel:cc.Label):void{
        let fontSource="comResource/mapFont/"+artFont;
        cc.loader.loadRes(fontSource , cc.Font , (error , assest)=>{
            if(error){
                return;
            }
            targetlabel.font = assest;
        })
    }


   
    public formatStrToByteLenth(contentStr:string,maxByteLength:number):string{
        let str="";
        let byteNum=0;
        for(let index=0;index<contentStr.length;index++){
            let charByteLength=this.getBytesLenght(contentStr[index]);
            let num=byteNum+charByteLength;
            if(num<=maxByteLength){
                str+=contentStr[index];
                byteNum=num;
            }else{
                break;
            }
        }
        return str;
    }
    private getBytesLenght(str: string):number {
        var bytesCount = 0;
        if (str != null) {
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (c.match(/[^\x00-\xff]/ig) != null) //全角
                {
                    bytesCount += 2;
                }
                else {
                    bytesCount += 1;
                }
            }
        }
        return bytesCount;
    }
    private strToUtf8Bytes(str) {
        const utf8 = [];
        for (let ii = 0; ii < str.length; ii++) {
            let charCode = str.charCodeAt(ii);
            if (charCode < 0x80) utf8.push(charCode);
            else if (charCode < 0x800) {
                utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
            } else if (charCode < 0xd800 || charCode >= 0xe000) {
                utf8.push(0xe0 | (charCode >> 12), 0x80 | ((charCode >> 6) & 0x3f), 0x80 | (charCode & 0x3f));
            } else {
                ii++;
                // Surrogate pair:
                // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
                // splitting the 20 bits of 0x0-0xFFFFF into two halves
                charCode = 0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
                utf8.push(
                    0xf0 | (charCode >> 18),
                    0x80 | ((charCode >> 12) & 0x3f),
                    0x80 | ((charCode >> 6) & 0x3f),
                    0x80 | (charCode & 0x3f),
                );
            }
        }
        //兼容汉字，ASCII码表最大的值为127，大于127的值为特殊字符
        for (let jj = 0; jj < utf8.length; jj++) {
            var code = utf8[jj];
            if (code > 127) {
                utf8[jj] = code - 256;
            }
        }
        return utf8;
    }

    public get2PowNumer(value:number):number{
        let data=1;
        while(true){
            let buffer=Math.pow(2,data);
            if(buffer==value){
                break;
            }
            if(buffer>value){
                data=0;
                break;
            }
            data++;
        }
        return data;
    }
   
  
}
