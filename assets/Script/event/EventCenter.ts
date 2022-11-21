import EventType from "./EventType";

export default class EventCenter {
    private eventTarget: cc.EventTarget = new cc.EventTarget();
  
    private static _ins: EventCenter;
    public static get ins() {
        if(!this._ins){
          this._ins=new EventCenter();
        }
        return this._ins ;
    }

  
    /**
     * Listen to a notification
     * @param name
     * @param callback
     */
    public addEventListener<T>(type: string, callback: ($type: string, $data: T) => void, target?: any): void {
      this.eventTarget.on(type, callback, target);
    }
  
    /**
     * Dispatch a notification
     * @param name
     */
    public dispatchEvent<T>(type: string, data?: T) {
      this.eventTarget.emit(type, type, data);
    }
  
    public hasEventListener($type): boolean {
      return this.eventTarget != null && this.eventTarget.hasEventListener($type);
    }
  
    /**
     * Cancel listen
     * @param name
     */
    public removeEventListener<T>(type: string, callback: ($type: string, $data: T) => void, target?: any): void {
      this.eventTarget.off(type, callback, target);
    }
}