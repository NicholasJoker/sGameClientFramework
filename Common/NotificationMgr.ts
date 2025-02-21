
export default class NotificationMgr {

	private static readonly _eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();


    /**
	 * 派发事件。
	 * @param type 事件类型。
	 * @param data （可选）回调数据。<b>注意：</b>如果是需要传递多个参数 p1,p2,p3,...可以使用数组结构如：[p1,p2,p3,...] ；如果需要回调单个参数 p ，且 p 是一个数组，则需要使用结构如：[p]，其他的单个参数 p ，可以直接传入参数 p。
	 * @return 此事件类型是否有侦听者，如果有侦听者则值为 true，否则值为 false。
	 */
	public static emit(type: string, data?: any) {
		NotificationMgr._eventDispatcher.event(type, data);
	}

    /**
	 * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知。
	 * @param type 事件的类型。
	 * @param caller 事件侦听函数的执行域。
	 * @param listener 事件侦听函数。
	 * @param args （可选）事件侦听函数的回调参数。
	 * @return 此 EventDispatcher 对象。
	 */
	public static on(type: string, caller: any, listener: Function, args?: any[]): void {
		NotificationMgr._eventDispatcher.on(type, caller, listener, args);
	}

    /**
	 * 使用 EventDispatcher 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知，此侦听事件响应一次后自动移除。
	 * @param type 事件的类型。
	 * @param caller 事件侦听函数的执行域。
	 * @param listener 事件侦听函数。
	 * @param args （可选）事件侦听函数的回调参数。
	 * @return 此 EventDispatcher 对象。
	 */
	public static once(type: string, caller: any, listener: Function, args?: any[]): void {
		NotificationMgr._eventDispatcher.once(type, caller, listener, args);
	}

    /**
	 * 从 EventDispatcher 对象中删除侦听器。
	 * @param type 事件的类型。
	 * @param caller 事件侦听函数的执行域。
	 * @param listener 事件侦听函数。
	 * @param onceOnly （可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
	 * @return 此 EventDispatcher 对象。
	 */
	public static removeEvent(type: string, caller: any, listener: Function, onceOnly?: boolean): void {
		NotificationMgr._eventDispatcher.off(type, caller, listener, onceOnly);
	}

    /**
	 * 从 EventDispatcher 对象中删除指定事件类型的所有侦听器。
	 * @param type （可选）事件类型，如果值为 null，则移除本对象所有类型的侦听器。
	 * @return 此 EventDispatcher 对象。
	 */
	public static removeAll(type?: string): Laya.EventDispatcher {
		return NotificationMgr._eventDispatcher.offAll(type);
	}
}