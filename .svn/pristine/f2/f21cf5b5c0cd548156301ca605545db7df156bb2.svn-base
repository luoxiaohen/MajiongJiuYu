// import { App } from "../../App";
// import { CommonEvent } from "../../events/CommonEvent";
// import { CallBack } from "../../utils/CallBack";
// import { Logger, LoggerType } from "../../utils/Logger";
// import { ObjectPool } from "../../utils/ObjectPool";
// import { HttpMethod } from "./HttpMethod";
// import { WebHttpRequest } from "./WebHttpRequest";

// /**
//      * Http
//      */
// export class Http {
//     private static sHttpObjectPool: ObjectPool = new ObjectPool();
//     private static sReRequestTimes: number = 0;
//     private static sGlobalErrorHandler: CallBack;
//     private static sGlobalParams: Object = null;
//     private static sRequestHeaders: { header: string, value: string }[] = [];
//     /**
//      * 数据返回代理处理 参数为原始返回数据 需要返回一个判断标志，如果为 true 那么会调用完成回调，否则可以阻断完成回调
//      */
//     public static responseAgent: (_response: any) => boolean = null;
//     /**
//      * 数据请求代理处理 实际场景为：每个api接口均需要一个登录token验证，而token获取是单独接口，因此在非token接口外的其他接口每次请求时判断token是否存在
//      * 如果不存在 则先获取token,然后继续当前接口请求
//      * _url 请求时的url地址
//      * _continue 继续调用请求 
//      */
//     public static requestAgent: (_url:string,_continue:Function) =>void = null;

//     private mRequest: WebHttpRequest;
//     private mOnComplete: CallBack;
//     private mOnError: CallBack;
//     private mReRequestTimes: number = 0;
//     private mRequestData: { url: string, data: any, type: string } = { url: null, data: null, type: null };
//     private mRequestDataString: string;
//     /**
//      * 是否使用全局头部设置数据
//      */
//     public useGlobalHeaders: boolean = true;
//     /**
//      * 忽略掉的全局头部设置数据
//      */
//     public ingoreGlobalHeaders: string[] = [];
//     public constructor() {
//         this.mRequest = new WebHttpRequest();
//         this.mRequest.timeout = 30 * 1000;
//         this.mRequest.responseType = "text";
//     }
//     public set withCredentials(_value: boolean) {
//         this.mRequest.withCredentials = _value;
//     }
//     /**[public] 
//      * 注册回调函数
//      * @param _onComplete 
//      * @param _onError 
//      * @param _target 
//      */
//     public regCallBack(_onComplete: Function, _onError: Function, _target: any = null) {
//         this.mOnComplete = CallBack.bind(_onComplete, _target, true);
//         this.mOnError = CallBack.bind(_onError, _target, true);
//     }
//     public post(_url: string, _data?: Object) {
//         this.mRequestData.url = _url;
//         this.mRequestData.data = this.formatData(_data);
//         this.mRequest.setRequestHeader("Content-Type"
//             , "application/x-www-form-urlencoded");
//         this.mRequestData.type = HttpMethod.POST;
//         setTimeout(this.request.bind(this), 1);
//     }
//     public get(_url: string, _data?: Object) {
//         let _params = this.formatData(_data);
//         this.mRequestData.url = _params ? `${_url}?${_params}` : _url;
//         this.mRequestData.data = null;
//         this.mRequestData.type = HttpMethod.GET;
//         setTimeout(this.request.bind(this), 1);
//         // this.request();
//     }
//     private formatData(_data: any) {
//         if (_data == null) return null;
//         let _params = "";
//         for (let _key in _data) {
//             _params += `${_key}=${_data[_key]}&`;
//         }
//         return _params.substr(0, _params.length - 1);
//     }
//     public reRequest() {
//         this.log(`Http reRequest ${this.mReRequestTimes}`);
//         this.request();
//     }
//     private request() {
//         if( Http.requestAgent ){
//             Http.requestAgent(this.mRequestData.url,()=>{
//                 this.continueRequest();
//             })
//         }else{
//             this.continueRequest();
//         }
        
//         this.log(`Http request ${this.mRequestDataString}`);
//     }
//     private continueRequest(){
//         this.mRequest.open(this.mRequestData.url, this.mRequestData.type);
//         if (this.useGlobalHeaders) {
//             Http.sRequestHeaders.forEach((value) => {
//                 if (this.ingoreGlobalHeaders.indexOf(value.header) == -1) {
//                     this.mRequest.setRequestHeader(value.header, value.value);
//                 }
//             }, this);
//         }
//         this.mergeRequestData(this.mRequestData.data);
//         this.getRequestDataString();
//         this.mRequest.send(this.mRequestData.data);
//     }

//     private getRequestDataString() {
//         if (Logger.canLogger(LoggerType.HTTP)) {
//             this.mRequestDataString = "";
//             for (let _key in this.mRequestData) {
//                 let _data = this.mRequestData[_key];
//                 if (typeof _data == "object") _data = JSON.stringify(_data);
//                 this.mRequestDataString += `${_key}:${_data} `;
//             }
//         }
//     }
//     //将传入的请求数据 与全局请求数据进行合并
//     private mergeRequestData(_curData: Object) {
//         if (Http.sGlobalParams) {
//             _curData = _curData ? _curData : {};
//             for (let _key in Http.sGlobalParams) {
//                 _curData[_key] = Http.sGlobalParams[_key];
//             }
//         }
//     }
//     /**在获取时调用 */
//     public objectInit() {
//         this.mRequestData = { url: null, data: null, type: null };
//         this.mReRequestTimes = Http.sReRequestTimes;
//         this.mRequest.on(CommonEvent.COMPLETE, this.onRequestCompleteHandler, this);
//         this.mRequest.on(CommonEvent.IO_ERROR, this.onRequestErrorHandler, this);
//     }
//     private onRequestCompleteHandler() {
//         this.log(`Http response ${this.mRequest.response}`);
//         let _response = this.mRequest.response;
//         try {
//             _response = JSON.parse(_response);
//         } catch (e) {
//         }
//         let _excuteComplete = true;
//         if (Http.responseAgent) {
//             _excuteComplete = Http.responseAgent(_response);
//         }
//         if (_excuteComplete) {
//             this.mOnComplete && (this.mOnComplete.excute(_response));
//         }
//         Http.sHttpObjectPool.putObject(this);
//     }
//     private onRequestErrorHandler(err) {
//         if (this.mReRequestTimes == 0) {
//             this.log(`Http Err ${err}`);
//             this.mOnError && (this.mOnError.excute(err));
//             Http.sGlobalErrorHandler && (Http.sGlobalErrorHandler.excute(err,this.mRequestData.url))
//             Http.sHttpObjectPool.putObject(this);
//         } else {
//             this.reRequest();
//             this.mReRequestTimes--;
//         }
//     }
//     private log(_msg: string) {
//         Logger.log(_msg, LoggerType.HTTP);
//     }
//     /**在放回池子里面时调用 */
//     public objectReset() {
//         this.mRequest.clearRequestHeader();
//         this.mOnComplete = null;
//         this.mOnError = null;
//         this.mRequestData = null;
//         this.useGlobalHeaders = true;
//         this.mRequest.off(CommonEvent.COMPLETE, this.onRequestCompleteHandler, this);
//         this.mRequest.off(CommonEvent.IO_ERROR, this.onRequestErrorHandler, this);
//     }
//     public static setGlobalParams(_params: Object) {
//         this.sGlobalParams = _params;
//     }
//     /**[public | static] 
//      * 设置全局请求错误时的回调
//      * @param _onError 
//      * @param _target 
//      */
//     public static setGlobalErrorHandler(_onError: Function, _target: any) {
//         if (_onError) {
//             this.sGlobalErrorHandler = CallBack.bind(_onError, _target);
//         } else {
//             this.sGlobalErrorHandler = null;
//         }
//     }
//     /**[public | static] 
//      * 设置请求头列表
//      * * ..._params 
//      * * 
//      */
//     public static setRequestHeaders(..._params: { header: string, value: string }[]) {
//         this.sRequestHeaders.length = 0;
//         _params.forEach((value) => {
//             this.sRequestHeaders.push(value);
//         });
//     }
//     /**[public | static] 
//      * 当请求失败时尝试重新请求的次数 默认为0
//      * @param _value 
//      */
//     public static set reRequestTimesWhileError(_value: number) {
//         this.sReRequestTimes = _value <= 0 ? 0 : _value;
//     }
//     /**[public | static] 
//      * POST方式请求
//      * @param _url 
//      * @param _data 
//      * @param _onComplete 
//      * @param _onError 
//      * @param _target 
//      */
//     public static POST(_url: string, _data: Object = null, _onComplete: Function = null, _onError: Function = null, _target: any = null) {
//         this.sHttpObjectPool.regObject(this);
//         let _http: Http = this.sHttpObjectPool.getObject();
//         _http.regCallBack(_onComplete, _onError, _target);
//         _http.post(_url, _data);
//         return _http;
//     }
//     /**[public | static] 
//      * GET方式请求
//      * @param _url 
//      * @param _data 
//      * @param _onComplete 
//      * @param _onError 
//      * @param _target 
//      */
//     public static GET(_url: string, _data: Object = null, _onComplete: Function = null, _onError: Function = null, _target: any = null) {
//         this.sHttpObjectPool.regObject(this);
//         let _http: Http = this.sHttpObjectPool.getObject();
//         _http.regCallBack(_onComplete, _onError, _target);
//         _http.get(_url, _data);
//         return _http;
//     }
// }