import {Model} from "./base/Model";
import {FormErrors, IAppState, IOrder, IOrderForm, IProduct} from "../types";
import {IEvents} from "./base/events";

export type CatalogChangeEvent = {
    catalog: IProduct[]
};

export class AppState extends Model<IAppState> {
    basket: string[] = []; // Добавлена инициализация пустого массива
    catalog: IProduct[];
    order: IOrderForm = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleBasketItem(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.basket = [...new Set([...this.basket, id])];
        } else {
            this.basket = this.basket.filter(item => item !== id);
        }
      
        this.emitChanges('basket:changed', this.basket);
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed', this.basket);
    }

    getTotal() {
        return this.basket.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        this.events.emit('order:changed', this.order);
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    // setOrderPayment(value: string) {
	// 	if (this.order.payment !== value) this.order.payment = value;
    //     this.events.emit('order:changed', this.order);
	// }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearOrder() {
        this.order = {
            payment: '',
            email: '',
            phone: '',
            address: '',
        };

        this.formErrors = {};
    }
}