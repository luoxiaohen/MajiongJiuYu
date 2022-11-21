import { Global } from "../Shared/GloBal";

/**
 * 对象池接口
 */
export interface IObjectPool {
	/**在获取时调用 */
	objectInit(_params?: any);
	/**在放回池子里面时调用 */
	objectReset();
}
/**
 * 对象池类
 */
export class ObjectPool {
	private mGroupMode: boolean;
	private mObjectMap: Object = {};
	private mObjectClassMap: Object = {};
	private mCurClassKey: string = null;
	/**[public] 
	 * 
	 * @param _groupMode 组模式 
	 */
	public constructor(_groupMode: boolean = false) {
		this.mGroupMode = _groupMode;
	}
	private getSaveKey(_class: any) {
		return cc.js.getClassName(_class);
	}
	/**[public] 
	 * 注册对象 以类注册 如果在此对象池初始化时 设置的是组模式 那么_objectType不可为空
	 * 如果是非组模式 则可设置为空
	 * @param _class 
	 * @param _objectType 
	 */
	public regObject(_class: any, _objectType: any = null) {
		if (!this.mGroupMode && this.mCurClassKey) {
			return;
		} else if (this.mGroupMode && (_objectType == null)) {
			Global.Utils.debugOutput(`${this.getSaveKey(_class)} 's type not null`)
			return;
		}
		if (!this.mGroupMode && (_objectType == null)) {
			this.mCurClassKey = this.getSaveKey(_class);
		}
		let _classKey = _objectType != null ? _objectType : this.mCurClassKey;
		this.mObjectClassMap[_classKey] = _class;
	}
	/**
	 * 是否注册过某个类
	 */
	public hasReg(_objectType: any): boolean {
		return this.getObjectClz(_objectType) != undefined;
	}
	public getObjectClz(_objectType: any): any {
		return this.mObjectClassMap[_objectType];
	}
	/**[public] 
	 * 取得对象
	 * @param _objectType 
	 */
	public getObject(_params: any = null, _objectType: any = null): any {
		_objectType = this.mCurClassKey ? this.mCurClassKey : _objectType;
		if (_objectType == null) {
			Global.Utils.debugOutput("_objectType can not null");
			return;
		}
		if (!this.hasReg(_objectType)) {
			Global.Utils.debugOutput(`objectType = ${_objectType} not regist`);
			return;
		}
		let _instanceList: IObjectPool[] = this.getObjectList(_objectType);
		let _iObjectPool: IObjectPool = null;
		if (_instanceList.length) {
			_iObjectPool = _instanceList.pop();
		} else {
			_iObjectPool = new this.mObjectClassMap[_objectType]();
			_iObjectPool["objectType"] = _objectType;
		}
		if (_iObjectPool.objectInit.length) {
			_iObjectPool.objectInit(_params);
		} else {
			_iObjectPool.objectInit();
		}

		return _iObjectPool;
	}
	/**[public] 
	 * 放回
	 * @param _iObjectPool 
	 */
	public putObject(_iObjectPool: IObjectPool) {
		if (!_iObjectPool) return;
		let _objectType = _iObjectPool["objectType"];
		if (_objectType == undefined || _objectType == null) {
			for (let _key in this.mObjectClassMap) {
				let _objectClass: any = this.mObjectClassMap[_key];
				if (_iObjectPool instanceof _objectClass) {
					_objectType = _key;
					break;
				}
			}
		}
		if (_objectType != undefined || _objectType != null) {
			let _instanceList: IObjectPool[] = this.getObjectList(_objectType);
			_iObjectPool.objectReset();
			_instanceList.unshift(_iObjectPool);
		} else {
			Global.Utils.debugOutput(`${this.getSaveKey(_iObjectPool)} not exist`);
		}
	}
	/**[public] 
	 * 批量放回
	 * @param _iObjectPools 
	 */
	public putObjects(_iObjectPools: IObjectPool[]) {
		_iObjectPools.forEach((value) => {
			this.putObject(value);
		})
	}
	/**
	 * 清空
	 * _objectType 类型 默认清空所有
	 */
	public clearObject(_objectType: any = null) {
		_objectType = this.mCurClassKey ? this.mCurClassKey : _objectType;
		if (_objectType) {
			delete this.mObjectMap[_objectType];
			delete this.mObjectClassMap[_objectType];
		} else {
			this.mObjectMap = {};
			this.mObjectClassMap = {};
		}
	}
	public getObjectList(_objectType: any): IObjectPool[] {
		let _tempList: IObjectPool[] = this.mObjectMap[_objectType];
		if (!_tempList) {
			_tempList = [];
			this.mObjectMap[_objectType] = _tempList;
		}
		return _tempList;
	}
}