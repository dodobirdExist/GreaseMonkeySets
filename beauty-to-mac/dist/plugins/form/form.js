import { PluginBase } from "../../base/plugins.js";
class FormBase extends PluginBase {
    constructor() {
        super('FormBase');
        this.element = null;
        this.parentElement = null;
        this.childrenList = [];
        this.hasValue = false;
    }
    use(context) {
    }
    formatStyle(obj) {
        var _a;
        if ((_a = this.element) === null || _a === void 0 ? void 0 : _a.style) {
            Object.assign(this.element.style, obj);
        }
    }
    get tagName() {
        var _a;
        return (_a = this.element) === null || _a === void 0 ? void 0 : _a.tagName;
    }
    get [Symbol.iterator]() {
        var _a;
        return this.constructor.name + ':' + ((_a = this.element) === null || _a === void 0 ? void 0 : _a.tagName);
    }
    get id() {
        var _a;
        return (_a = this.element) === null || _a === void 0 ? void 0 : _a.id;
    }
}
class ContentFormBase extends FormBase {
    constructor() {
        super();
        this.element = document.createElement('input');
        this.hasValue = true;
    }
    get type() {
        return this.element.type;
    }
    set type(val) {
        this.element.type = val;
    }
    get value() {
        return this.element.value;
    }
    set value(val) {
        this.element.value = val;
    }
    get name() {
        return this.element.name;
    }
    set name(val) {
        this.element.name = val;
    }
}
class ContainerBase extends FormBase {
    constructor() {
        super();
        this.hasValue = false;
    }
    _instanckify() {
        var _a;
        for (let item of this.childrenList) {
            item.element && ((_a = this.element) === null || _a === void 0 ? void 0 : _a.appendChild(item.element));
            if (!item.hasValue) {
                item._instanckify();
            }
        }
    }
    instance() {
        this._instanckify();
    }
}
class InputTextAndPasswdForm extends ContentFormBase {
    constructor() {
        super();
        this.type = 'text';
    }
}
class InputRadioAndCheckboxForm extends ContentFormBase {
    constructor() {
        super();
        this.type = 'radio';
    }
}
class InputColorForm extends ContentFormBase {
    constructor() {
        super();
        this.type = 'color';
    }
}
class InputNumberForm extends ContentFormBase {
    constructor() {
        super();
        this.type = 'number';
    }
}
class FormContainer extends ContainerBase {
    constructor() {
        super();
        this.element = document.createElement('form');
    }
}
class LabelContainer extends ContainerBase {
    constructor() {
        super();
        this.element = document.createElement('label');
    }
}
class DivContainer extends ContainerBase {
    constructor() {
        super();
        this.element = document.createElement('div');
    }
}
let uu = new InputTextAndPasswdForm;
uu.hasValue;
export { InputTextAndPasswdForm, InputRadioAndCheckboxForm, InputNumberForm, InputColorForm };
