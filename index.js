const container = document.querySelector('.content')//контейнер для вставки
const template = document.querySelector('template').content //темплейт
const tableHeader = document.querySelector('.table__header')
const form = document.querySelector('.form')



const state = {
    topDirection: false,
    firstRender: true,
    currentData: []
}



function api() {
    return fetch('https://jsonplaceholder.typicode.com/posts')//запрос
        .then(res => checkResponse(res))//обрабатываем ошибку
}


function checkResponse(res) {//обрабатываем ошибку
    if (res.ok) {
        return res.json()//если все ок возвращаем данные 
    }
    return Promise.reject(`Ошибка: ${res.status}`)//иначе возвращаем ошибку
}

function render() {
    api()
        .then(data => state.topDirection ? data : data.reverse())
        .then(data => {
            state.currentData = data//состояние для использования в других компонентах
            if (state.firstRender) {
                state.firstRender = false
                data.forEach(item => createElement(item))//для каждого оъекта создаем елемент)
            }
            else {
                Array.from(document.querySelectorAll('.container')).reverse().forEach(item => item.remove())//удаляю все текущие елементы с верстки
                data.forEach(item => createElement(item))//для каждого оъекта создаем елемент)
            }
        })
        .catch(res => console.log(res))//ловим ошибку в консоль
}


function createElement(data) {
    const liElement = template.querySelector('li').cloneNode(true)//ищем елемент для клонирования в темплейте
    const titleElement = liElement.querySelector('h2')
    const bodyElement = liElement.querySelector('p')
    const userIdElement = liElement.querySelector('.userId')
    const idElement = liElement.querySelector('.id')
    idElement.textContent = data.id
    userIdElement.textContent = data.userId
    titleElement.textContent = data.title//наполняем данными 
    bodyElement.textContent = data.body//наполняем данными 
    insertCard(container, liElement)//вставляем в разметку
}


function insertCard(container, element) {
    container.prepend(element)
}


tableHeader.addEventListener('click', columnsSort)


function columnsSort(evt) {
    state.topDirection = !state.topDirection
    render()
}






form.addEventListener('input', (evt) => {
    getSearchInputValue(evt)
})



function getSearchInputValue(evt) {
    const currentINputValue = evt.target.value
    Array.from(document.querySelectorAll('.container')).reverse().forEach(item => item.remove())
    state.currentData.forEach(item => {
        if (item.title.match(currentINputValue) || item.body.match(currentINputValue)) {
            createElement(item)
        }
    })
}



render()