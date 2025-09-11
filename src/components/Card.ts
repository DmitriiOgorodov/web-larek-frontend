import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import {ICardActions, IProduct} from "../types";
import { categoryMap } from '../utils/constants';

export class Product extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = container.querySelector(`.card__button`);
        if (actions?.onClick && this._button) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);
    }
}

interface ICard extends IProduct {
    // title: string;
    // description: string;
    // image: string;
    // category: string;
    // price: number;
    button?: string;
}

export class Card extends Product {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _modifier: string;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._category = ensureElement<HTMLElement>(`.card__category`, container);

        if (actions?.onClick && !this._button) {
                container.addEventListener('click', actions.onClick);
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this.toggleClass(this._category, categoryMap.get(value), true);
    }

    set price(value: number) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }

    set button(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        }
    }

    // Добавлен метод для управления состоянием кнопки
    set buttonDisabled(state: boolean) {
        if (this._button) {
            this.setDisabled(this._button, state);
        }
    }
}

export class CatalogItem extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
    }
}

export class PreviewItem extends Card {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._description = ensureElement<HTMLElement>(`.card__text`, container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    // Переопределён метод set price для управления кнопкой
    set price(value: number) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        this.buttonDisabled = value === null; // Отключаем кнопку, если цена null
    }
}

export class BasketItem extends Product {
 
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}