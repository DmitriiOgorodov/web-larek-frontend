import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import {ICardActions, IProduct} from "../types";

interface ICard<T> {
    title: string;
    description?: string;
    image: string;
    category: string;
    price: number;
    button?: string;
}

export class Card extends Component<ICard<string>> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
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
        super('card', container, actions);
    }
}

export class PreviewItem extends Card {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
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

export class BasketItem extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);
    }
}