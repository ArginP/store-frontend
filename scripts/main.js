let goods = JSON.parse(localStorage.getItem('goods')) || [];

const setLocalStorage = (data) => {
    localStorage.setItem('goods', JSON.stringify(data));
};

let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
// Модальное окно via Bootstrap
let options = { // настройки List.js
    valueNames: ['name', 'price'] // задаются имена для значений поиска в виде их классов
};
let userList;

console.log(new Date())

const name = document.querySelector('#good_name');
const price = document.querySelector('#good_price');
const count = document.querySelector('#good_count');

const tbodyList = document.querySelector('tbody.list');
const tbodyCart = document.querySelector('tbody.cart');
const totalPrice = document.querySelector('.price_result');

const addNewButton = document.querySelector('button.add_new');

addNewButton.addEventListener('click', () => {
    if (name.value && price.value && count.value) {
        goods.push(['good_'+goods.length, name.value, price.value, count.value, 0, 0, 0]);

        name.value = '';
        price.value = '';
        count.value = '1';

        setLocalStorage(goods);
        update_goods();

        myModal.hide();
    } else {
        Swal.fire({
            icon: "error",
            title: "Ошибка",
            text: "Пожалуйста, заполните все поля!",
        })
    }
})

const update_goods = () => {
    let result_price = 0; // общая стоимость товаров в корзине
    tbodyList.innerHTML = '';
    tbodyCart.innerHTML = '';

    if (goods.length) {
        table1.hidden = false; // прямое обращение к элементу по его id
        table2.hidden = false;
        for (let i = 0; i < goods.length; i++) {
            tbodyList.insertAdjacentHTML('beforeend',
                `
                <tr class="alight-middle">
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
                    <tr class="alight-middle">
                        <td>${i+1}</td>
                        <td class="price_name">${goods[i][1]}</td>
                        <td class="price_one">${goods[i][2]}</td>
                        <td class="price_count">${goods[i][4]}</td>
                        <td class="price_discount"><input type="text" data-goodid="${goods[i][0]}" value="${goods[i][5]}" min="0" max="100"></td>
                        <td>${goods[i][6]}</td>
                        <td><button class="good_delete btn btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                    </tr>
                    `
                );
            }
        }

    userList = new List('goods', options); // инициализируем список для поиска List.js
        // Ищет раздел по id 'goods' и принимает настройки, заданные в начале модуля

    } else { // если список товаров пуст
        table1.hidden = true;
        table2.hidden = true;
    }

    totalPrice.innerHTML = result_price + ' &#8381;';
}

tbodyList.addEventListener('click', (e) => {
    if (!e.target.dataset.delete) {
        return;
    }
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

            setLocalStorage(goods)
            update_goods();

            Swal.fire (
                "Удалено!",
                "Выбранный товар был успешно удален",
                "success"
            )
        }
    })
})

update_goods();