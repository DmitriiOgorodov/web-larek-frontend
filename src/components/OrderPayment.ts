import { Form } from './common/Form';
import { IOrder, IOrderPayments } from '../types';
import { IEvents } from './base/events';

export class OrderPayments extends Form<IOrderPayments> {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._cardButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this._cardButton) {
			this._cardButton.addEventListener('click', () => {
				this.togglePayment(this._cardButton);
        events.emit(`order.1:change`,  { field: 'payment', value: 'cash' });
			});
		}

		if (this._cashButton) {
			this._cashButton.addEventListener('click', () => {
        this.togglePayment(this._cashButton);
				events.emit(`order.2:change`,  { field: 'payment', value: 'cash' });
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

  set payment(value: string) {
    switch (value) {
      case 'card':
        this.toggleClass(this._cardButton, 'button_alt-active', true);
     		this.toggleClass(this._cashButton, 'button_alt-active', false);

        break;
      case 'cash':
        this.toggleClass(this._cashButton, 'button_alt-active', true);
        this.toggleClass(this._cardButton, 'button_alt-active', false);
        break;
      default:
        this.toggleClass(this._cardButton, 'button_alt-active', false);
    		this.toggleClass(this._cashButton, 'button_alt-active', false);
        break;
    }
	}

  private	togglePayment(value: HTMLElement) {
		this.cancelPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	private cancelPayment() {
		this.toggleClass(this._cardButton, 'button_alt-active', false);
		this.toggleClass(this._cashButton, 'button_alt-active', false);
  }
}