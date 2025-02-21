

export default class LocalStorageMgr {

    /**
	 * 存储指定键名和键值，字符串类型。
	 * @param key 键名。
	 * @param value 键值。
	 */
    public static setItem(key: string, value: string): void {
        Laya.LocalStorage.setItem(key, value || '');
    }

    /**
     * 获取指定键名的值。
     * @param key 键名。
     * @return 字符串型值。
     */
    public static getItem(key: string, defaultValue:any = ''): any {
        var dataStr = Laya.LocalStorage.getItem(key);
        if (!dataStr) {
            dataStr = defaultValue;
        }
        return dataStr;
    }

    /**
     * 存储指定键名及其对应的 <code>Object</code> 类型值。
     * @param key 键名。
     * @param value 键值。是 <code>Object</code> 类型，此致会被转化为 JSON 字符串存储。
     */
    public static setJSON(key: string, value: any): void {
        Laya.LocalStorage.setJSON(key, value);
    }

    /**
     * 获取指定键名对应的 <code>Object</code> 类型值。
     * @param key 键名。
     * @return <code>Object</code> 类型值
     */
    public static getJSON(key: string, defaultValue: any = null): any {
        var data = Laya.LocalStorage.getJSON(key);
        if (!data) {
            data = defaultValue;
        }
        return data;
    }

    /**
     * 删除指定键名的信息。
     * @param key 键名。
     */
    static removeItem(key: string): void {
        Laya.LocalStorage.removeItem(key);
    }

    /**
     * 清除本地存储信息。
     */
    static clear(): void {
        Laya.LocalStorage.clear();
    }


}