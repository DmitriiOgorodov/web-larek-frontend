import './scss/styles.scss';

import { LarekAPI } from "./components/LarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { AppState, CatalogChangeEvent, ProductItem } from "./components/AppData";
import { Page } from "./components/Page";
import { CatalogItem, PreviewItem, BasketItem } from "./components/Card";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
// import { Order } from "./components/Order";
import { OrderPayments } from './components/OrderPayment';
import { OrderContacts } from './components/OrderContact';
import { Success } from "./components/common/Success";
import { IOrderForm } from "./types";

// Инициализация брокера событий
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
console.log('Card catalog template:', cardCatalogTemplate); // Проверяем, найден ли шаблон
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const OrderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const OrderPaymentsTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(OrderContactsTemplate), events);
const orderPayments = new OrderPayments(cloneTemplate(OrderPaymentsTemplate), events);

// Загружаем товары с сервера
api.getProductList()
    .then(data => {
        console.log('API Response:', data); // Проверяем данные от API
        appData.setCatalog(data);
    })
    .catch(err => {
        console.error('API Error:', err);
    });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    console.log('Catalog changed:', appData.catalog); // Проверяем каталог
    const cards = appData.catalog.map(item => {
        console.log('Rendering card for item:', item); // Отладка: проверяем каждый товар
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });
    console.log('Generated cards:', cards); // Проверяем созданные карточки
    page.catalog = cards;
});

// Открыть товар
events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

// Изменён просматриваемый товар
events.on('preview:changed', (item: ProductItem) => {
    const showItem = (item: ProductItem) => {
        const card = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                events.emit('item:add', item);
            }
        });

        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                description: item.description,
                price: item.price,
                button: appData.basket.includes(item.id) ? 'Уже в корзине' : 'В корзину'
            })
        });
    };

    if (item) {
        api.getProductItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        modal.close();
    }
});

// Добавить товар в корзину
events.on('item:add', (item: ProductItem) => {
    appData.toggleBasketItem(item.id, true);
    modal.close();
});

// Изменения в корзине
events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.items = appData.basket.map((id, index) => {
        const item = appData.catalog.find(product => product.id === id);
        const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => appData.toggleBasketItem(item.id, false)
        });
        card.index = index + 1;
        return card.render({
            title: item.title,
            price: item.price
        });
    });
    basket.total = appData.getTotal();
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

// Открыть форму заказа
// events.on('order:open', () => {
//     modal.render({
//         content: order.render({
//             payment: '',
//             address: '',
//             valid: false,
//             errors: []
//         })
//     });
// });

events.on('order:open', () => {
	orderPayments.cancelPayment();
	modal.render({
		content: orderPayments.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	'order:change payment',
	(data: { payment: string; button: HTMLElement }) => {
		appData.setOrderPayment(data.payment);
		orderPayments.togglePayment(data.button);
		appData.validateOrder();
	}
);

events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение полей формы заказа
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Ошибки формы
// events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//     const { payment, address } = errors;
//     order.valid = !payment && !address;
//     order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
// });

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment, phone, email } = errors;
	orderPayments.valid = !payment && !address;
	orderPayments.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	orderContacts.valid = !phone && !email;
	orderContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});


// Отправка заказа
events.on('contacts:submit', () => {
    if (!appData.validateOrder()) {
        // Проверка валидации
        console.warn('Order validation failed, cannot submit');
        return;
    }

    appData.order.items = appData.basket;
    appData.order.total = appData.getTotal();

    api.orderProducts(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    appData.clearBasket();
                    modal.close();
                }
            });

            success.total = result.total;
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

