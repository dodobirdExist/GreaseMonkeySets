// 本模块用于提供各种表单元素的封装

import { AppCore } from "../../base/appcore.js";
import { PluginBase } from "../../base/plugins.js";


abstract class FormBase extends PluginBase{
    readonly element: HTMLElement | null;
    parentElement: ContainerBase | null;
    childrenList: (ContainerBase|ContentFormBase<FormTypeKeys>)[];
    readonly hasValue: boolean;
    constructor() {
        super('FormBase');
        this.element = null;
        this.parentElement = null;
        this.childrenList = [];
        /**表示当前元素是否有value属性可以获取值*/
        this.hasValue = false
    }
    override use(context: AppCore): void {
        //
    }

    formatStyle(obj: CSSStyleDeclaration) {
        if (this.element?.style) {
            Object.assign(this.element.style, obj);
        }
    }
    get tagName() {
        return this.element?.tagName;
    }
    protected get [Symbol.iterator]() {
        return this.constructor.name + ':' + this.element?.tagName;
    }
    get id() {
        return this.element?.id;
    }
}
/**input元素的所有表单type类型*/
type FormTypeKeys = "button" | "checkbox" | "file" | "hidden" | "image" | "password" | "radio" | "reset"
    | "submit" | "text" | "color" | "date" | "datetime" | "datetime-local" | "email" | "month" | "number"
    | "range" | "search" | "tel" | "time" | "url" | "week";

/**所有具有value属性的元素，可以获取到值*/
abstract class ContentFormBase<T extends FormTypeKeys> extends FormBase {
    override element: HTMLInputElement;
    override readonly hasValue: true;
    constructor() {
        super();
        this.element = document.createElement('input');
        this.hasValue = true;
    }
    get type(): T {
        return this.element.type as T;
    }
    set type(val: T) {
        this.element.type = val;
    }
    get value() {
        return this.element.value
    }
    set value(val) {
        this.element.value = val;
    }
    get name() {
        return this.element.name;
    }
    set name(val: string) {
        this.element.name = val;
    }
}

/**所有容器类基类，能够形成树形架构，实例化存储等*/
abstract class ContainerBase extends FormBase {
    override readonly hasValue: false;
    constructor() {
        super();
        this.hasValue = false;
    }
    /**将所有子元素全部实例化组装到Dom*/
    _instanckify(){
        for (let item of this.childrenList) {
            item.element && this.element?.appendChild(item.element);
            if(!item.hasValue){
                item._instanckify();
            }
        }
    }
    instance() {
        this._instanckify();
    }
}

/**此表单用于文本和密码表单*/
class InputTextAndPasswdForm extends ContentFormBase<'text' | 'password'> {
    constructor() {
        super();
        this.type = 'text'
    }
}

/**用于单选框和复选框*/
class InputRadioAndCheckboxForm extends ContentFormBase<'checkbox' | 'radio'> {
    constructor() {
        super();
        this.type = 'radio'
    }
}

class InputColorForm extends ContentFormBase<'color'>{
    constructor() {
        super();
        this.type = 'color';
    }
}

class InputNumberForm extends ContentFormBase<'number'>{
    constructor() {
        super();
        this.type = 'number';
    }
}


//创建通用容器组件
class FormContainer extends ContainerBase {
    override element: HTMLFormElement;
    constructor() {
        super();
        this.element = document.createElement('form');
    }
}

class LabelContainer extends ContainerBase {
    override element: HTMLLabelElement;
    constructor() {
        super();
        this.element = document.createElement('label');
    }
}

class DivContainer extends ContainerBase {
    override element: HTMLDivElement;
    constructor() {
        super();
        this.element = document.createElement('div');
    }
}


let uu = new InputTextAndPasswdForm;
uu.hasValue

export { InputTextAndPasswdForm, InputRadioAndCheckboxForm, InputNumberForm, InputColorForm };