class Base {
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    getCurrentDateTime() {
        return Date().toString().replace(/\s*\(.*?\)$/, '');
    }
}
export { Base };
