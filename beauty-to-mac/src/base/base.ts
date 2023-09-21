/**所有类的基类，上面有共性方法*/
class Base {
    protected get [Symbol.toStringTag](){
        return this.constructor.name;
    }
    /**获取当前日期时间(含时区)*/
    getCurrentDateTime(){
        return Date().toString().replace(/\s*\(.*?\)$/,'');
    }
}

export {Base};