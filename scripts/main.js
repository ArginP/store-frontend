let goods = JSON.parse(localStorage.getItem('goods')) || [];
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

const name = document.querySelector('#good_name');
const price = document.querySelector('#good_price');
const count = document.querySelector('#good_count');

const addNewButton = document.querySelector('button.add_new');

addNewButton.addEventListener('click', () => {
    if (name.value && price.value && count.value) {
        goods.push(['good_'+goods.length, name.value, price.value, count.value, 0, 0, 0]);
        name.value = '';
        price.value = '';
        count.value = '1';
        localStorage.setItem('goods', JSON.stringify(goods));
        // update_goods();
        myModal.hide();
    } else {
        Swal.fire({
            icon: "error",
            title: "Ошибка",
            text: "Пожалуйста, заполните все поля!",
        })
    }
})