import { Global } from "../Shared/GloBal";
import { IObjectPool, ObjectPool } from "./ObjectPool";

/**
	 * 回调函数 封装
	 */
 export class CallBack implements IObjectPool{
	private static sCallBackPool:ObjectPool = new ObjectPool();
	private mOnCallBackFunction: Function;
	private mRef: any;
	private mOnce:boolean;
	private mParams:any;
	public constructor() {
	}
	public create(_call: Function, _targetRef: any,_once:boolean = false,..._params ) {
		if (_call ) {
			this.mOnce = _once;
			this.mOnCallBackFunction = _targetRef ? _call.bind(_targetRef) : _call;
			this.mRef = _targetRef;
			this.mParams = _params;
		}
	}
	public excute(..._params) {
		if (this.mOnCallBackFunction) {
			let _newParams = _params.length == 0 ? this.mParams : _params;
			Global.Utils.debugOutput("回调的消息："+_newParams)
			this.mOnCallBackFunction.apply(this.mRef, _newParams );
			if( this.mOnce ){
				CallBack.unbind( this );
			}
		}else{
			//Log.warn("无效的回调函数调用");
		}
	}
	/**
	 * 延迟执行
	 * @param _delay 
	 * @param _params 
	 */
	public delayExcute(_delay:number=1,..._params ){
		_delay = _delay < 0 ? 0 :_delay;
		setTimeout(( _p )=>{
			this.excute.apply( this,_p );
		},_delay,_params );
	}
	public checkEqual( _call:Function,_targetRef:any ){
		return _call == this.mOnCallBackFunction && _targetRef == this.mRef;
	}
	public equalTarget( _targetRef:any ){
		return this.mRef == _targetRef;
	}
	/**在获取时调用 */
	public objectInit(){
	}
	public objectReset(){
		this.mOnce = false;
		this.mOnCallBackFunction = null;
		this.mRef = null;
		this.mParams = null;
	}
	/**[public | static] 
	 * 
	 * @param _call 
	 * @param _targetRef 
	 * @param _once 是否执行一次 执行后主动释放
	 * @param _params 执行参数 可预先缓存参数 也可以在excute时传入参数 excute的参数优先
	 */
	public static bind(_call: Function, _targetRef: any,_once:boolean = false,..._params ): CallBack {
		this.sCallBackPool.regObject( CallBack );
		let _callBack: CallBack =  this.sCallBackPool.getObject();
		// _callBack.create(_call, _targetRef,_once,_params );
		_params.unshift(_call,_targetRef,_once );
		_callBack.create.apply(_callBack,_params)
		return _callBack;
	}
	/**[public | static] 
	 * 
	 * @param _callBack 
	 */
	public static unbind(_callBack:CallBack ){
		_callBack && this.sCallBackPool.putObject(_callBack);
	}
}