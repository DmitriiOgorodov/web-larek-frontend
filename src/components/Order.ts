// import {Form} from "./common/Form";
// import {IOrderForm} from "../types";
// import {IEvents} from "./base/events";
// import {ensureAllElements, ensureElement} from "../utils/utils";

// export class Order extends Form<IOrderForm> {
//     protected _buttons: HTMLButtonElement[];

//     constructor(container: HTMLFormElement, events: IEvents) {
//         super(container, events);

//         this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

//         this._buttons.forEach(button => {
//             button.addEventListener('click', () => {
//                 this.payment = button.name;
//                 events.emit('payment:change', { payment: button.name });
//             });
//         });
//     }

//     set payment(name: string) {
//         this._buttons.forEach(button => {
//             this.toggleClass(button, 'button_alt-active', button.name === name);
//         });
//     }

//     set address(value: string) {
//         (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
//     }
// }