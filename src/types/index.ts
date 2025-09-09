export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number; // Добавлено поле total
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}