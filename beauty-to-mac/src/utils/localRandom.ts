let randomSimpleID: () => string = function () {
    if (globalThis?.isSecureContext) {
        randomSimpleID = crypto.randomUUID.bind(crypto)
        return crypto.randomUUID();
    } else {
        randomSimpleID = function () {
            return [+Math.random().toString().slice(2),
            +performance.now().toString().replace('.', '')]
                .map(num => num.toString(36).toUpperCase())
                .join('-');
        }
        return randomSimpleID();
    }

}

function shuffle(arrX: any[]): any[];
function shuffle(arrX: string): string;
function shuffle(arrX: string | (any[])) {
    if (arrX.length < 2) return arrX;
    const arr = [...arrX];
    let l = arrX.length;
    while (l) {
        let j = Math.floor(Math.random() * l--);
        [arr[l], arr[j]] = [arr[j], arr[l]];
    }
    if (typeof arrX === 'string') {
        return arr.join('');
    } else {
        return arr;
    }
}

//不能使用default export
export { randomSimpleID, shuffle };