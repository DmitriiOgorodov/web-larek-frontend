# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

```
API_ORIGIN=https://larek-api.nomoreparties.co
```
Это задаёт адрес API-сервера.

## Базовые классы
1. **EventEmitter**
  Броккер событий. Установка и удаление обработчиков событий. Вызов обработчиков при возникновении события.
***Конструктор:***
  - constructor();
***Свойства:***
  - _events: Map<EventName, Set<Subscriber>> - приватное свойство, хранящее множество подписчиков для каждого события.
***Методы***
  - on<T extends object>(eventName: EventName, callback: (event: T)) - Установить обработчик на событие;
  - off(eventName: EventName, callback: Subscriber) - Снять обработчик с события;
  - emit<T extends object>(eventName: string, data?: T) - Инициировать событие с данными;
  - onAll(callback: (event: EmitterEvent) => void) - Слушать все события;
  - offAll() - Сбросить все обработчики;
  - trigger<T extends object>(eventName: string, context?: Partial<T>) - Сделать коллбек триггер, генерирующий событие при вызове;

2. **Model**
  Базовый класс для моделей данных, обеспечивающий интеграцию с событиями. Хранение данных через конструктор с частичной типизацией. Генерация событий при изменении данных. Используется в AppState и ProductItem для управления состоянием приложения и данными товаров.
***Конструктор:***
  - constructor(data: Partial<T>, protected events: IEvents) - на вход принимает исходные данные для модели и объект событий для сообщения об изменениях модели;
  - <T> - обобщенный тип;
  - IEvents - интерфейс для работы с событиями;
***Методы***
  - emitChanges(event: string, payload?: object) - cообщаеть, что модель поменялась.

3. **Api**
  Базовый класс для работы с REST API.
***Конструктор:***
  - constructor(baseUrl: string, options: RequestInit = {}) - конструктор, который на вход принимает базовый URL и общие настройки запросов.
  - readonly baseUrl: string;
  - protected options: RequestInit;
***Методы***
  - get(uri: string)
  - post(uri: string, data: object, method: ApiPostMethods = 'POST')

4. **LarekAPI**
  Наследуется от Api. Выполняет запросы к серверу для получения списка товаров, данных о товаре и отправки заказа.
***Конструктор***
  - constructor(cdn: string, baseUrl: string, options?: RequestInit)
***Свойства***
  - readonly cdn: string;
***Методы***
  - getProductItem(id: string): Promise<IProduct> - Запрашивает данные о товаре по id
  - getProductList(): Promise<IProduct[]> - Запрашивает список товаров
  - orderProducts(order: IOrder): Promise<IOrderResult> - Отправляет заказ (IOrder) на сервер через POST-запрос

5. **Component**
Базовый класс для UI-компонентов, работающих с DOM. Предоставляет утилиты для работы с DOM (установка текста, изображений, классов, атрибутов disabled) и рендеринг компонента.
***Конструктор***
  - protected constructor(protected readonly container: HTMLElement)
***Свойства***
  - protected readonly container: HTMLElement - Корневой DOM-элемент компонента
***Методы***
  - toggleClass(element: HTMLElement, className: string, force?: boolean): void — Переключает CSS-класс className на элементе element.
  - setText(element: HTMLElement, value: unknown): void — Устанавливает текстовое содержимое элемента element в value, преобразованное в строку.
  - setDisabled(element: HTMLElement, state: boolean): void — Устанавливает или снимает атрибут disabled.
  - setHidden(element: HTMLElement): void — Скрывает элемент element, устанавливая display: none.
  - setVisible(element: HTMLElement): void — Показывает элемент element, удаляя стиль display
  - setImage(element: HTMLImageElement, src: string, alt?: string): void — Устанавливает атрибут src и, при наличии, alt для изображения element.

## Данные
1. **AppState**
Наследуется от Model. Отвечает за валидацию данных заказа и генерацию событий при изменениях.
***Конструктор***
  - constructor(data: Partial<IAppState>, events: IEvents):
  - data: Partial<IAppState> — Частичные данные состояния приложения.
  - events: IEvents — Объект для работы с событиями.
***Свойства***
  - basket: string[] — Массив ID товаров, добавленных в корзину.
  - catalog: IProduct[] — Список всех товаров, полученных с сервера.
  - order: IOrderForm — Данные формы заказа, включая поля payment, email, phone, address.
  - preview: string | null — ID товара, выбранного для предпросмотра.
  - formErrors: FormErrors — Объект с ошибками валидации формы заказа, где ключи — поля формы, а значения — строки ошибок.
***Методы***
  - toggleBasketItem(id: string, isIncluded: boolean): void — Добавляет или удаляет ID товара id в/из корзины (basket) в зависимости от isIncluded. Генерирует событие basket:changed.
  - clearBasket(): void — Очищает корзину (basket = []) и генерирует событие basket:changed.
  - getTotal(): number — Вычисляет общую стоимость товаров в корзине, суммируя цены товаров из catalog по ID из basket.
  - setCatalog(items: IProduct[]): void — Устанавливает каталог товаров (catalog) и генерирует событие items:changed.
  - setPreview(item: IProduct): void — Устанавливает ID товара для предпросмотра (preview) и генерирует событие preview:changed.
  - setOrderField(field: keyof IOrderForm, value: string): void — Устанавливает значение value для поля field формы заказа (order). Если форма валидна, генерирует событие order:ready
  - validateOrder(): boolean — Проверяет валидность формы заказа, обновляет formErrors и генерирует событие formErrors:change. Возвращает true, если ошибок нет.

## Компоненты отображения

**Page**
Назначение и зона ответственности:
Наследуется от Component<IPage>. Отвечает за управление основным контейнером страницы, включая счетчик корзины, каталог товаров и блокировку прокрутки при открытии модального окна.
***Конструктор:***
  - constructor(container: HTMLElement, protected events: IEvents):
  - container: HTMLElement — Корневой элемент страницы.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _counter: HTMLElement — Элемент для отображения количества товаров в корзине.
  - _catalog: HTMLElement — Контейнер для карточек товаров каталога.
  - _wrapper: HTMLElement — Обертка страницы для управления блокировкой прокрутки.
  - _basket: HTMLElement — Кнопка корзины в шапке страницы.
***Методы:***
  - set counter(value: number): void — Устанавливает текст счетчика корзины (_counter) в value.
  - set catalog(items: HTMLElement[]): void — Заменяет содержимое каталога (_catalog) переданными элементами items.
  - set locked(value: boolean): void — Блокирует или разблокирует прокрутку страницы, добавляя/удаляя класс page__wrapper_locked у _wrapper.

**Modal**
Наследуется от Component<IModalData>. Управляет модальным окном, отображая переданный контент, обеспечивая открытие/закрытие и обработку событий клика по кнопке закрытия или фону.
***Конструктор:***
  - constructor(container: HTMLElement, protected events: IEvents):
  - container: HTMLElement — Корневой элемент модального окна.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _closeButton: HTMLButtonElement — Кнопка закрытия модального окна.
  - _content: HTMLElement — Контейнер для содержимого модального окна.
***Методы:***
  - set content(value: HTMLElement): void — Заменяет содержимое модального окна (_content) элементом value.
  - open(): void — Открывает модальное окно, добавляя класс modal_active и генерируя событие modal:open.
  - close(): void — Закрывает модальное окно, убирая класс modal_active, очищая содержимое и генерируя событие modal:close.
  - render(data: IModalData): HTMLElement — Устанавливает данные (content) и открывает модальное окно, возвращая корневой элемент.

**Basket**
Наследуется от Component<IBasketView>. Отвечает за отображение корзины, включая список товаров, общую сумму и кнопку оформления заказа.
***Конструктор:***
  - constructor(container: HTMLElement, protected events: IEvents):
  - container: HTMLElement — Корневой элемент корзины.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _list: HTMLElement — Контейнер для списка товаров в корзине.
  - _total: HTMLElement — Элемент для отображения общей суммы.
  - _button: HTMLElement — Кнопка для перехода к оформлению заказа.
***Методы:***
  - set items(items: HTMLElement[]): void — Устанавливает список товаров в корзине (_list). Если список пуст, отображает сообщение "Корзина пуста" и отключает кнопку _button.
  - set total(total: number): void — Устанавливает текст общей суммы (_total) в формате ${total} синапсов.

**Form**
Абстрактный класс, наследуется от Component<IFormState>. Базовый класс для форм (например, OrderPayments, OrderContacts). Отвечает за обработку ввода, валидацию и отправку формы.
***Конструктор:***
  - constructor(protected container: HTMLFormElement, protected events: IEvents):
  - container: HTMLFormElement — Корневой элемент формы.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _submit: HTMLButtonElement — Кнопка отправки формы.
  - _errors: HTMLElement — Элемент для отображения ошибок валидации.
***Методы:***
  - protected onInputChange(field: keyof T, value: string): void — Вызывается при изменении поля ввода, генерирует событие {formName}.{field}:change с данными {field, value}.
  - set valid(value: boolean): void — Устанавливает состояние кнопки отправки (_submit), отключая её, если value = false.
  - set errors(value: string): void — Устанавливает текст ошибок валидации (_errors).
  - render(state: Partial<T> & IFormState): HTMLFormElement — Обновляет состояние формы (валидность, ошибки, поля ввода) и возвращает корневой элемент.

**OrderPayments**
Наследуется от Form<IOrderPayments>. Отвечает за форму выбора способа оплаты и ввода адреса доставки. Управляет состоянием кнопок оплаты и валидацией.
***Конструктор:***
  - constructor(container: HTMLFormElement, events: IEvents):
  - container: HTMLFormElement — Корневой элемент формы.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _cardButton: HTMLButtonElement — Кнопка выбора оплаты картой.
  - _cashButton: HTMLButtonElement — Кнопка выбора оплаты наличными.
  - _submit: HTMLButtonElement (унаследовано) — Кнопка отправки формы.
  - _errors: HTMLElement (унаследовано) — Элемент для ошибок.
***Методы:***
  - set address(value: string): void — Устанавливает значение поля адреса в форме.
  - set payment(value: string): void — Устанавливает активный способ оплаты (card или cash), обновляя классы button_alt-active на кнопках _cardButton и _cashButton.
  - private togglePayment(value: HTMLElement): void — Активирует выбранную кнопку оплаты, сбрасывая другие.
  - private cancelPayment(): void — Сбрасывает активность всех кнопок оплаты.

**OrderContacts**
Наследуется от Form<IOrderContacts>. Отвечает за форму ввода контактных данных (email, телефон) и их валидацию.
***Конструктор:***
  - constructor(container: HTMLFormElement, events: IEvents):
  - container: HTMLFormElement — Корневой элемент формы.
  - events: IEvents — Объект для работы с событиями.
***Свойства:***
  - _submit: HTMLButtonElement (унаследовано) — Кнопка отправки формы.
  - _errors: HTMLElement (унаследовано) — Элемент для ошибок.
***Методы:***
  - set phone(value: string): void — Устанавливает значение поля телефона в форме.
  - set email(value: string): void — Устанавливает значение поля email в форме.

**Success**
Наследуется от Component<ISuccess>. Отвечает за отображение окна успешного завершения заказа с указанием списанной суммы и кнопкой закрытия.
***Конструктор:***
  - constructor(container: HTMLElement, actions: ISuccessActions):
  - container: HTMLElement — Корневой элемент окна.
  - actions: ISuccessActions — Объект с обработчиком onClick для кнопки закрытия.
***Свойства:***
  - _total: HTMLElement — Элемент для отображения суммы заказа.
  - _close: HTMLElement — Кнопка закрытия окна.
***Методы:***
  - set total(value: number): void — Устанавливает текст суммы (_total) в формате Списано ${value} синапсов.

**Card**
Наследуется от Component<ICard>. Базовый класс для отображения карточек товаров (в каталоге, предпросмотре, корзине). Управляет отображением заголовка, цены и кнопки действия.
***Конструктор:***
  - constructor(container: HTMLElement, actions?: ICardActions):
  - container: HTMLElement — Корневой элемент карточки.
  - actions?: ICardActions — Объект с обработчиком onClick для кнопки или всей карточки.
***Свойства:***
  - _title: HTMLElement — Элемент заголовка карточки.
  - _price: HTMLElement — Элемент цены.
  - _button?: HTMLButtonElement — Кнопка действия (опционально).
***Методы:***
  - set title(value: string): void — Устанавливает текст заголовка (_title).
  - set price(value: number): void — Устанавливает текст цены (_price) в формате ${value} синапсов.

**CatalogItem**
Наследуется от Card. Используется для отображения карточек товаров в каталоге.
***Конструктор:***
  - constructor(container: HTMLElement, actions?: ICardActions):
  Аналогичен Card.
***Свойства:***
  - _image: HTMLImageElement — Изображение товара.
  - _category: HTMLElement — Элемент категории товара.
Унаследованные: _title, _price, _button.
***Методы:***
  - set id(value: string): void — Устанавливает data-id атрибут карточки.
  - set image(value: string): void — Устанавливает src и alt для изображения (_image).
  - set category(value: string): void — Устанавливает текст категории (_category).
  - set button(value: string): void — Устанавливает текст кнопки (_button).
  - set buttonDisabled(state: boolean): void — Устанавливает состояние disabled для кнопки.

**PreviewItem**
Наследуется от Card. Используется для отображения карточки товара в модальном окне предпросмотра с дополнительным описанием.
***Конструктор:***
  - constructor(container: HTMLElement, actions?: ICardActions):
Аналогичен Card.
***Свойства:***
  - _description: HTMLElement — Элемент описания товара.
Унаследованные: _image, _category, _title, _price, _button.
***Методы:***
  - set description(value: string): void — Устанавливает текст описания (_description).
  - set price(value: number): void — Переопределяет метод Card, отключает кнопку, если цена null.

**BasketItem**
Наследуется от Product (подкласс Card). Используется для отображения товара в корзине с индексом.
***Конструктор:***
  - constructor(container: HTMLElement, actions?: ICardActions):
***Свойства:***
  - _index: HTMLElement — Элемент для отображения индекса товара в корзине.
Унаследованные: _title, _price, _button.
***Методы:***
  - set index(value: number): void — Устанавливает текст индекса (_index).
