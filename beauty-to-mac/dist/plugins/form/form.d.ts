import { AppCore } from "../../base/appcore.js";
import { PluginBase } from "../../base/plugins.js";
declare abstract class FormBase extends PluginBase {
    readonly element: HTMLElement | null;
    parentElement: ContainerBase | null;
    childrenList: (ContainerBase | ContentFormBase<FormTypeKeys>)[];
    readonly hasValue: boolean;
    constructor();
    use(context: AppCore): void;
    formatStyle(obj: CSSStyleDeclaration): void;
    get tagName(): string | undefined;
    protected get [Symbol.iterator](): string;
    get id(): string | undefined;
}
type FormTypeKeys = "button" | "checkbox" | "file" | "hidden" | "image" | "password" | "radio" | "reset" | "submit" | "text" | "color" | "date" | "datetime" | "datetime-local" | "email" | "month" | "number" | "range" | "search" | "tel" | "time" | "url" | "week";
declare abstract class ContentFormBase<T extends FormTypeKeys> extends FormBase {
    element: HTMLInputElement;
    readonly hasValue: true;
    constructor();
    get type(): T;
    set type(val: T);
    get value(): string;
    set value(val: string);
    get name(): string;
    set name(val: string);
}
declare abstract class ContainerBase extends FormBase {
    readonly hasValue: false;
    constructor();
    _instanckify(): void;
    instance(): void;
}
declare class InputTextAndPasswdForm extends ContentFormBase<'text' | 'password'> {
    constructor();
}
declare class InputRadioAndCheckboxForm extends ContentFormBase<'checkbox' | 'radio'> {
    constructor();
}
declare class InputColorForm extends ContentFormBase<'color'> {
    constructor();
}
declare class InputNumberForm extends ContentFormBase<'number'> {
    constructor();
}
export { InputTextAndPasswdForm, InputRadioAndCheckboxForm, InputNumberForm, InputColorForm };
