// --- HTML элементы страницы ---

const searchBox = document.querySelector('#search_box');
const totalPrice = document.querySelector('.price_result');

const tableLeft = document.querySelector('#table1');
const tableRight = document.querySelector('#table2');

const name = document.querySelector('#good_name');
const price = document.querySelector('#good_price');
const count = document.querySelector('#good_count');
const addNewButton = document.querySelector('button.add_new');

const tbodyList = document.querySelector('tbody.list');
const tbodyCart = document.querySelector('tbody.cart');

// Получение данных о товарах из localStorage
let goods = JSON.parse(localStorage.getItem('goods')) || [];

// Запись данных в localStorage
const setLocalStorage = (data) => {
    localStorage.setItem('goods', JSON.stringify(data));
};

// Модальное окно via Bootstrap
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

// Обработка события открытия модального окна Bootstrap
const myModalEl = document.getElementById('exampleModal')
myModalEl.addEventListener('shown.bs.modal', () => {
    name.focus(); // первое окно ввода (название) попадает в фокус
})


// --- Поиск через List.js ---
let options = { // настройки List.js
    valueNames: ['name', 'price'] // задаются имена для значений поиска в виде их классов
};

let userList; // для фильтров по поиску (List.js)
let sort = []; // для сортировки таблиц

// --- Скрипты динамической отрисовки товаров ---

const updateGoods = () => {
    let result_price = 0; // общая стоимость товаров в корзине
    tbodyList.innerHTML = '';
    tbodyCart.innerHTML = '';

    if (goods.length) {
        tableLeft.hidden = false;
        tableRight.hidden = false;
        for (let i = 0; i < goods.length; i++) {
            tbodyList.insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td class="name">${goods[i][1]}</td>
                    <td class="price">${goods[i][2]}</td>
                    <td>${goods[i][3]}</td>
                    <td><button class="good_delete btn btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                    <td><button class="good_delete btn btn-primary" data-goods="${goods[i][0]}">&#10149;</button></td>
                </tr>
                `
            );
            if (goods[i][4] > 0) {
                goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01;
                // [6] — цена с учетом скидки; [5] — размер скидки; [4] — количество товаров в корзине
                result_price += goods[i][6];

                tbodyCart.insertAdjacentHTML('beforeend',
                    `
                    <tr class="align-middle">
                        <td>${i+1}</td>
                        <td class="price_name">${goods[i][1]}</td>
                        <td class="price_one">${goods[i][2]}</td>
                        <td class="price_count">${goods[i][4]}</td>
                        <td class="price_discount">
                            <input type="text" 
                                oninput="this.value = this.value.replace(/[^0-9.]/g, '');" 
                                onfocus="this.select();"
                                data-goodid="${goods[i][0]}" value="${goods[i][5]}" 
                                min="0" max="100">
                            </td>
                        <td>${goods[i][6].toFixed(2)}</td>
                        <td><button class="good_delete btn btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                    </tr>
                    `
                );
            }
        }

    userList = new List('goods', options); // инициализируем список для поиска List.js
        // Ищет раздел по id 'goods' и принимает настройки, заданные в начале модуля

    searchBox.value = '';

    } else { // если список товаров пуст
        tableLeft.hidden = true;
        tableRight.hidden = true;
    }

    totalPrice.innerHTML = result_price.toFixed(2) + ' &#8381;'; // Общая сумма товаров в корзине, округленная до 2
}

// --- Сортировка таблиц ---

const sortTable = (colNum, type, id) => {
    let elem = document.getElementById(id);
    let tbody = elem.querySelector('tbody');
    let rowsArray = Array.from(tbody.rows);
    let compare;

    const sortAscending = (type) => {
        switch (type) {
            case 'number': // отсылается к data-type="number" в HTML
                compare = function (rowA, rowB) { // сортировка по возрастанию чисел
                    return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
                }
                break
            case 'string': // отсылается к data-type="string" в HTML
                compare = function (rowA, rowB) { // сортировка по алфавиту
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
                }
                break
        }
        rowsArray.sort(compare)
        tbody.append(...rowsArray)
    }


    if (sort[0] === colNum) { // Если по колонке уже отсортировано:
        if (sort[1] === 'desc') {
            // Если отсортировано по убыванию, сортирует по возрастанию
            sortAscending(type);
            sort[1] = 'asc'
        } else { // Сортирует по убыванию
            switch (type) {
                case 'number':
                    compare = function (rowA, rowB) {
                        return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML
                    }
                    break
                case 'string':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? -1 : 1
                    }
                    break
            }
            rowsArray.sort(compare)
            tbody.append(...rowsArray)
            sort[1] = 'desc'
        }
    } else { // Если по колонке сейчас не отсортировано, то сортируем по возрастанию
        sortAscending(type);

        sort[0] = colNum
        sort[1] = 'asc'
    }
}

// --- Отслеживание кликов по кнопке "Добавить новый товар" ---

addNewButton.addEventListener('click', () => {
    if (name.value && price.value && count.value) {
        goods.push([`good_${Date.now()}_${goods.length}`, name.value, price.value, count.value, 0, 0, 0]);

        name.value = '';
        price.value = '';
        count.value = '1';

        setLocalStorage(goods);
        updateGoods();

        myModal.hide();
    } else {
        Swal.fire({
            icon: "error",
            title: "Ошибка",
            text: "Пожалуйста, заполните все поля!",
        })
    }
})

// --- Отслеживание кликов по кнопам в списке товаров ---

tbodyList.addEventListener('click', (e) => {
    if (e.target.dataset.delete) { // Отслеживание кликов по кнопам "Удалить товар из списка"

        Swal.fire({
            title: 'Внимание!',
            text: 'Вы действительно хотите удалить товар?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
            cancelButtonText: 'Отмена',
        }).then((result) => {
            if (result.isConfirmed) {
                for (let i = 0; i < goods.length; i++) {
                    if (goods[i][0] === e.target.dataset.delete) {
                        goods.splice(i, 1);
                    }
                }

                setLocalStorage(goods);
                updateGoods();

                Swal.fire (
                    "Удалено!",
                    "Выбранный товар был успешно удален",
                    "success"
                )
            }
        })
    } else if (e.target.dataset.goods) { // Отслеживание кликов по кнопкам "Добавить товар в корзину"

        for (let i = 0; i < goods.length; i++) {
            if (goods[i][3] > 0 && goods[i][0] === e.target.dataset.goods) {
                goods[i].splice(3, 1, goods[i][3] - 1); // уменьшит количество товаров в магазине на 1
                goods[i].splice(4, 1, goods[i][4] + 1); // увеличит количество товаров в корзине на 1
                setLocalStorage(goods);
                updateGoods();
            }
        }
    }
});

// --- Отслеживание кликов по кнопкам "Удалить товар из корзины" ---

tbodyCart.addEventListener('click', (e) => {
    if (!e.target.dataset.delete) {
        return;
    }

    for (let i = 0; i < goods.length; i++) {
        if (goods[i][4] > 0 && goods[i][0] === e.target.dataset.delete) {
            goods[i].splice(3, 1, goods[i][3] + 1); // увеличит количество товаров в магазине на 1
            goods[i].splice(4, 1, goods[i][4] - 1); // уменьшит количество товаров в корзине на 1
            setLocalStorage(goods);
            updateGoods();
        }
    }
})

// --- Отслеживание ввода в поле "Скидка" в корзине ---

tbodyCart.addEventListener('input', (e) => {
    if (!e.target.dataset.goodid) {
        return;
    }
    let discount = e.target.value;

    // следит за тем, чтобы значение скидки было в диапазоне от 0 до 100
    if (discount > 100) discount = 100;

    for (let i = 0; i < goods.length; i++) {
        if (goods[i][0] === e.target.dataset.goodid) {
            goods[i][5] = discount;
            goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01;

            setLocalStorage(goods);
            updateGoods(); // обновится dom-дерево, и слетит фокус с окна ввода скидки

            // найдет input в который мы вводим
            let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`);
            input.focus(); // возьмет его в фокус
            input.selectionStart = input.value.length; // поставит курсор в конец введенных значений
        }
    }
})

// --- Отслеживание кликов по заголовкам таблиц для сортировки ---

tableLeft.onclick = (e) => {
    if (e.target.tagName !== 'TH') return; // если клик не по элементу заголовка таблицы, то ничего не делать
    let th = e.target;
    sortTable(th.cellIndex, th.dataset.type, 'table1');
    // передаваемые атрибуты: HTMLTableCellElement (позиция ячейки в столбце таблицы),
    // тип данных из data-type="..." в HTML и id
}

tableRight.onclick = (e) => {
    if (e.target.tagName !== 'TH') return;
    let th = e.target;
    sortTable(th.cellIndex, th.dataset.type, 'table2');
}

updateGoods();