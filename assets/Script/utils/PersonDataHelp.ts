// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameRuleTypeEnum } from "../enum/EnumManager";
import GameInfo from "../Game/info/GameInfo";
import { Msg_SC_FeeCountData, Msg_SC_PubBaseCountData } from "../proto/LobbyMsg";
import { TableRuleInfo } from "../proto/LobbyMsgDef";
import { GameResultInfo, HorserInfo } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import { OverBuyHorseInfoData } from "./InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonDataHelp {

    private static _ins: PersonDataHelp;
    public static get ins() {
        return this._ins || (this._ins = new PersonDataHelp());
    }

    public FormatFeeData(data:Msg_SC_FeeCountData,sumHandsNum:number):any[]{
        let dataStrArr=[];
        let dataNumArr=[];
        let info=data.info;
        let victoryStr=[info.gameWinCnt+""];
        let winScoreStr=[info.winScore+""];
        let zouStrArr=this.getFeeDataStrArr( [info.huNum1,info.huNum2,info.huNum3,info.huNone],sumHandsNum);
        let guohuStrArr=this.getFeeDataStrArr([info.passHuCnt],sumHandsNum);       
        let mqkStrArr=this.getFeeDataStrArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let ljwhStrArr=this.getFeeDataStrArr([info.breakNoTin],sumHandsNum);
        let sanfanStrArr=this.getFeeDataStrArr([info.fan3Tin,info.fan3Hu],sumHandsNum);
        let sanFanDianPaoStrArr=this.getFeeDataStrArr([info.fan3Pao],sumHandsNum);
        let diangangStrArr=this.getFeeDataStrArr([info.dgCnt],sumHandsNum);
        let gangshangStrArr=this.getFeeDataStrArr([info.gangPao,info.gangHua],sumHandsNum);
        dataStrArr.push(victoryStr,winScoreStr,zouStrArr,guohuStrArr,mqkStrArr,ljwhStrArr,sanfanStrArr,sanFanDianPaoStrArr,diangangStrArr,gangshangStrArr);

        let victoryNum=[info.gameWinCnt];
        let winScoreNum=[info.winScore];
        let zouNumArr=this.getFeeDataNumArr( [info.huNum1,info.huNum2,info.huNum3,info.huNone],sumHandsNum);
        let guohuNumArr=this.getFeeDataNumArr([info.passHuCnt],sumHandsNum);       
        let mqkNumArr=this.getFeeDataNumArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let ljwhNumArr=this.getFeeDataNumArr([info.breakNoTin],sumHandsNum);
        let sanfanNumArr=this.getFeeDataNumArr([info.fan3Tin,info.fan3Hu],sumHandsNum);
        let sanFanDianPaoNumArr=this.getFeeDataNumArr([info.fan3Pao],sumHandsNum);
        let diangangNumArr=this.getFeeDataNumArr([info.dgCnt],sumHandsNum);
        let gangshangNumArr=this.getFeeDataNumArr([info.gangPao,info.gangHua],sumHandsNum);
        dataNumArr.push(victoryNum,winScoreNum,zouNumArr,guohuNumArr,mqkNumArr,ljwhNumArr,sanfanNumArr,sanFanDianPaoNumArr,diangangNumArr,gangshangNumArr);
        return [dataStrArr,dataNumArr]
    }
    public FormatFeeData_Compare(data:Msg_SC_FeeCountData,sumGameNum:number,sumHandsNum:number):any[]{
        let dataStrArr=[];
        let dataNumArr=[];
        let info=data.info;
        let victoryStr_1=[info.gameWinCnt+""];
        let winScoreStr_2=[info.winScore+""];
        let guohuStrArr_3=this.getFeeDataStrArr([info.passHuCnt],sumHandsNum);       
        let ljwhStrArr_4=this.getFeeDataStrArr([info.breakNoTin],sumHandsNum);
        let sanfan_xj_StrArr_5=this.getFeeDataStrArr([info.fan3Tin],sumHandsNum);
        let sanfan_hp_StrArr_6=this.getFeeDataStrArr([info.fan3Hu],sumHandsNum);
        let sanfan_dp_StrArr_7=this.getFeeDataStrArr([info.fan3Pao],sumHandsNum);
        let diangangStrArr_8=this.getFeeDataStrArr([info.dgCnt],sumHandsNum);
        let gangshang_hua_StrArr_9=this.getFeeDataStrArr([info.gangHua],sumHandsNum);
        let gangshang_pao_StrArr_10=this.getFeeDataStrArr([info.gangPao],sumHandsNum);
        let mqkStrArr_11=this.getFeeDataStrArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let zouStrArr_12=this.getFeeDataStrArr( [info.huNum1,info.huNum2,info.huNum3,info.huNone],sumHandsNum);
        dataStrArr.push([sumGameNum],[sumHandsNum]);
        dataStrArr.push(victoryStr_1,winScoreStr_2,guohuStrArr_3,ljwhStrArr_4,sanfan_xj_StrArr_5,sanfan_hp_StrArr_6,
                        sanfan_dp_StrArr_7,diangangStrArr_8,gangshang_hua_StrArr_9,gangshang_pao_StrArr_10,mqkStrArr_11,zouStrArr_12);

        let victoryNum_1=[info.gameWinCnt];
        let winScoreNum_2=[info.winScore];
        let guohuNumArr_3=this.getFeeDataNumArr([info.passHuCnt],sumHandsNum);       
        let ljwhNumArr_4=this.getFeeDataNumArr([info.breakNoTin],sumHandsNum);
        let sanfan_xj_NumArr_5=this.getFeeDataNumArr([info.fan3Tin],sumHandsNum);
        let sanfan_hp_NumArr_6=this.getFeeDataNumArr([info.fan3Hu],sumHandsNum);
        let sanfan_dp_NumArr_7=this.getFeeDataNumArr([info.fan3Pao],sumHandsNum);
        let diangangNumArr_8=this.getFeeDataNumArr([info.dgCnt],sumHandsNum);
        let gangshang_hua_NumArr_9=this.getFeeDataNumArr([info.gangHua],sumHandsNum);
        let gangshang_pao_NumArr_10=this.getFeeDataNumArr([info.gangPao],sumHandsNum);
        let mqkNumArr_11=this.getFeeDataNumArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let zouNumArr_12=this.getFeeDataNumArr( [info.huNum1,info.huNum2,info.huNum3,info.huNone],sumHandsNum);
        dataNumArr.push([sumGameNum],[sumHandsNum]);
        dataNumArr.push(victoryNum_1,winScoreNum_2,guohuNumArr_3,ljwhNumArr_4,sanfan_xj_NumArr_5,sanfan_hp_NumArr_6,
                        sanfan_dp_NumArr_7,diangangNumArr_8,gangshang_hua_NumArr_9,gangshang_pao_NumArr_10,mqkNumArr_11,zouNumArr_12);
        return [dataStrArr,dataNumArr]
    }
    public FormatFeeServerData(data:Msg_SC_PubBaseCountData):any[]{
        let dataStrArr=[];
        let dataNumArr=[];
        let info=data.info;
        let victory=[];
        let winScore=[];
        let zouArr=[];
        let guohuStrArr=this.getFeeDataStrArr([info.passHuCnt],info.handCnt);       
        let mqkStrArr=this.getFeeDataStrArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let ljwhStrArr=this.getFeeDataStrArr([info.breakNoTin],info.handCnt);
        let sanfanStrArr=this.getFeeDataStrArr([info.fan3Tin,info.fan3Hu],info.handCnt);
        let sanFanDianPaoStr=this.getFeeDataStrArr([info.fan3Pao],info.handCnt);
        let diangangStr=this.getFeeDataStrArr([info.dianGangCnt],info.handCnt);
        let gangshangStr=this.getFeeDataStrArr([info.gangPao,info.gangHua],info.handCnt);
        dataStrArr.push(victory,winScore,zouArr,guohuStrArr,mqkStrArr,ljwhStrArr,sanfanStrArr,sanFanDianPaoStr,diangangStr,gangshangStr);

        let guohuNumArr=this.getFeeDataNumArr([info.passHuCnt],info.handCnt);       
        let mqkNumArr=this.getFeeDataNumArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let ljwhNumArr=this.getFeeDataNumArr([info.breakNoTin],info.handCnt);
        let sanfanNumArr=this.getFeeDataNumArr([info.fan3Tin,info.fan3Hu],info.handCnt);
        let sanFanDianPaoNum=this.getFeeDataNumArr([info.fan3Pao],info.handCnt);
        let diangangNumArr=this.getFeeDataNumArr([info.dianGangCnt],info.handCnt);
        let gangshangNumArr=this.getFeeDataNumArr([info.gangPao,info.gangHua],info.handCnt);
        dataNumArr.push(victory,winScore,zouArr,guohuNumArr,mqkNumArr,ljwhNumArr,sanfanNumArr,sanFanDianPaoNum,diangangNumArr,gangshangNumArr);
        return [dataStrArr,dataNumArr]
    }
    public FormatFeeServerData_Compare(data:Msg_SC_PubBaseCountData):any[]{
        let dataStrArr=[];
        let dataNumArr=[];
        let info=data.info;
        let victoryStr_1=[];
        let winScoreStr_2=[];
        let guohuStrArr_3=this.getFeeDataStrArr([info.passHuCnt],info.handCnt);       
        let ljwhStrArr_4=this.getFeeDataStrArr([info.breakNoTin],info.handCnt);
        let sanfan_xj_StrArr_5=this.getFeeDataStrArr([info.fan3Tin],info.handCnt);
        let sanfan_hp_StrArr_6=this.getFeeDataStrArr([info.fan3Hu],info.handCnt);
        let sanfan_dp_StrArr_7=this.getFeeDataStrArr([info.fan3Pao],info.handCnt);
        let diangangStrArr_8=this.getFeeDataStrArr([info.dianGangCnt],info.handCnt);
        let gangshang_hua_StrArr_9=this.getFeeDataStrArr([info.gangHua],info.handCnt);
        let gangshang_pao_StrArr_10=this.getFeeDataStrArr([info.gangPao],info.handCnt);
        let mqkStrArr_11=this.getFeeDataStrArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let zouStrArr_12=[];
        dataStrArr.push([],[]);
        dataStrArr.push(victoryStr_1,winScoreStr_2,guohuStrArr_3,ljwhStrArr_4,sanfan_xj_StrArr_5,sanfan_hp_StrArr_6,
                        sanfan_dp_StrArr_7,diangangStrArr_8,gangshang_hua_StrArr_9,gangshang_pao_StrArr_10,mqkStrArr_11,zouStrArr_12);

        let victoryNum_1=[];
        let winScoreNum_2=[];
        let guohuNumArr_3=this.getFeeDataNumArr([info.passHuCnt],info.handCnt);       
        let ljwhNumArr_4=this.getFeeDataNumArr([info.breakNoTin],info.handCnt);
        let sanfan_xj_NumArr_5=this.getFeeDataNumArr([info.fan3Tin],info.handCnt);
        let sanfan_hp_NumArr_6=this.getFeeDataNumArr([info.fan3Hu],info.handCnt);
        let sanfan_dp_NumArr_7=this.getFeeDataNumArr([info.fan3Pao],info.handCnt);
        let diangangNumArr_8=this.getFeeDataNumArr([info.dianGangCnt],info.handCnt);
        let gangshang_hua_NumArr_9=this.getFeeDataNumArr([info.gangHua],info.handCnt);
        let gangshang_pao_NumArr_10=this.getFeeDataNumArr([info.gangPao],info.handCnt);
        let mqkNumArr_11=this.getFeeDataNumArr_2([info.mqCnt,info.zzCnt,info.jx5Cnt],[info.mqRuleCnt,info.zzRuleCnt,info.jx5RuleCnt]);
        let zouNumArr_12=[];
        dataNumArr.push([],[]);
        dataNumArr.push(victoryNum_1,winScoreNum_2,guohuNumArr_3,ljwhNumArr_4,sanfan_xj_NumArr_5,sanfan_hp_NumArr_6,
                        sanfan_dp_NumArr_7,diangangNumArr_8,gangshang_hua_NumArr_9,gangshang_pao_NumArr_10,mqkNumArr_11,zouNumArr_12);
        return [dataStrArr,dataNumArr]
    }
    private getFeeDataStrArr(numArr:number[],sumNum:number):string[]{
        let strArr: string[] = [];
        for (let index = 0; index < numArr.length; index++) {
            let str = "-";
            if (sumNum != 0) {
                str = this.formatPercentNum_round(numArr[index] / sumNum);
            }
            strArr.push(str);
        }
        return strArr;
    }
    private getFeeDataNumArr(numArr:number[],sumNum:number):number[]{
        let returnnumArr: number[] = [];
        for (let index = 0; index < numArr.length; index++) {
            let num = 0;
            if (sumNum != 0) {
                num =numArr[index] / sumNum;
            }
            returnnumArr.push(num);
        }
        return returnnumArr;
    }
    private getFeeDataStrArr_2(numArr:number[],sumNum:number[]):string[]{
        let strArr:string[]=[];
        for(let index=0;index<numArr.length;index++){
            let str="-";
            if(sumNum[index]!=0){
                str=this.formatPercentNum_round(numArr[index]/sumNum[index]);
            }
            strArr.push(str);
        }
        return strArr;
    }
    private getFeeDataNumArr_2(numArr:number[],sumNum:number[]):number[]{
        let returnNumArr:number[]=[];
        for(let index=0;index<numArr.length;index++){
            let num=0;
            if(sumNum[index]!=0){
                num=numArr[index]/sumNum[index];
            }
            returnNumArr.push(num);
        }
        return returnNumArr;
    }


    public FormatArrToPresent100(arr:number[]):void{
        let changeIndex=-1;
        let otherSum=0;
        for(let index=0;index<arr.length;index++){
            if(arr[index]>0&&changeIndex==-1){
                changeIndex=index;
                continue;
            }
            otherSum+=arr[index];
        }
        if(changeIndex>-1){
            arr[changeIndex]=parseFloat((1-otherSum).toFixed(3))
        }
    }

    public getHorseData(result_4:GameResultInfo,result_5:GameResultInfo,nowHand:number):OverBuyHorseInfoData[]{
        let returnArr:OverBuyHorseInfoData[]=[];
        let maInfo =result_4;
		if(maInfo){
			let data1 : OverBuyHorseInfoData = new OverBuyHorseInfoData();
			data1.sitNum = maInfo.huNum;
			data1.buyCoun =0// GameInfo.ins.gameHorseArray[0].majNum;.
			data1.horesNum = -1;//maInfo.huNum;
            data1.sumbuyCount=0;
            let data=GameInfo.ins.realTimePreformanceData[nowHand];
            if(data){
                let arr=data.buyHorseInfo;
                if(arr&&arr[0]){
                    data1.buyCoun=arr[0].majNum;
                    data1.horesNum=arr[0].horseSit;
                    data1.playerInfo=arr[0].player;
                    if(arr[0].isBanker){
                        data1.sumbuyCount++;
                    }
                }
            }
            data1.sumbuyCount=0;
			data1.cardValue = maInfo.rain;
			data1.fen = maInfo.horseScore;
			data1.playerHead = 1;
			returnArr.push(data1);
		}
		maInfo = result_5;
		if(maInfo){
			let data2 : OverBuyHorseInfoData = new OverBuyHorseInfoData();
			data2.sitNum = maInfo.huNum;
			data2.buyCoun =0// GameInfo.ins.gameHorseArray[0].majNum;.
			data2.horesNum = -1//maInfo.huNum;
            data2.sumbuyCount=0;

            let data=GameInfo.ins.realTimePreformanceData[nowHand];
            if(data){
                let arr=data.buyHorseInfo;
                if(arr&&arr[1]){
                    data2.buyCoun=arr[1].majNum;
                    data2.horesNum=arr[1].horseSit;
                    data2.playerInfo=arr[1].player;
                    if(arr[0].isBanker){
                        data2.sumbuyCount++;
                    }
                }
            }
			data2.cardValue = maInfo.rain;
			data2.fen = maInfo.horseScore;
			data2.playerHead = 1;
			returnArr.push(data2);
		}
        return returnArr;
    }
    public getHorseData_2(item:HorserInfo):OverBuyHorseInfoData{
		if(item){
			let data1 : OverBuyHorseInfoData = new OverBuyHorseInfoData();
			data1.sitNum = 0;
			data1.buyCoun = 0;
			data1.cardValue = 0;
			data1.fen = 0;
			data1.horesNum = 0;
			data1.playerHead = 1;
            return data1;            
		}
		
    }
    
    public formatPercentNum(value:number,pointNum=1):string{
        if(!value){
            return (0).toFixed(pointNum)+"%";
        }
        return ((value*1000)/10).toFixed(pointNum)+"%";
    }
    public formatPercentNum_round(value:number,pointNum=1):string{
        if(!value){
            return (0).toFixed(pointNum)+"%";
        }
        return (Math.round(value*1000)/10).toFixed(pointNum)+"%";
    }
    getRoomTableInfoStr(rule:TableRuleInfo):string{
        let str="规则:";
        let ruleMapInfo=this.getRuleMapInfo();
        if(!rule){
            return;
        }
        if(rule.ceiling){
            str+=Global.Utils.formNumToGivenStr(ruleMapInfo[GameRuleTypeEnum.FengDing][0],[rule.ceiling.toString(),Global.Utils.get2PowNumer(rule.ceiling)+""])+"、";
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
            let piaoStr="飘("
            piaoStr+=ruleMapInfo[GameRuleTypeEnum.Baozi][rule.baozi]+"、";
            if(rule.baoziDouble){
                piaoStr+=ruleMapInfo[GameRuleTypeEnum.ShuangBao][0];
            }
            piaoStr=piaoStr.slice(0,piaoStr.length-1);
            piaoStr+=")、";
            str+=piaoStr;
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
        if(rule.limitIP){
            str+=ruleMapInfo[GameRuleTypeEnum.IPLimit][0]+"、";
        }
        if(rule.limitGPS){
            str+=ruleMapInfo[GameRuleTypeEnum.GPSLimit][0]+"、";
        }
        if(rule.passPeng){
            str+=ruleMapInfo[GameRuleTypeEnum.GuoShouPeng][0]+"、";
        }
        if(rule.buyHorseNum){
            let horseStr=Global.Utils.formNumToGivenStr(ruleMapInfo[GameRuleTypeEnum.BuyHorse][0],[rule.buyHorseNum.toString()])+"(";
            if(rule.buyHorseType==1){
                horseStr+="活马、";
            }else if(rule.buyHorseType==2){
                horseStr+="死马、";
            }
            if(rule.isSelectBankerBuyHorse){
                horseStr+="庄家买马、";
            }
            if(rule.isSelectEatHorse){
                horseStr+="马不吃马、"
            }
            horseStr=horseStr.slice(0,horseStr.length-1);
            horseStr+=")、";
            str+=horseStr;
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
        this.ruleMapInfo[GameRuleTypeEnum.FengDing]=["封顶{0}番({1}倍)"];
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
        this.ruleMapInfo[GameRuleTypeEnum.IPLimit]=["IP限制"];
        this.ruleMapInfo[GameRuleTypeEnum.GPSLimit]=["GPS限制"];
        this.ruleMapInfo[GameRuleTypeEnum.GuoShouPeng]=["过手碰"];
        this.ruleMapInfo[GameRuleTypeEnum.BuyHorse]=["买{0}马"];


        return this.ruleMapInfo;
    }
}
