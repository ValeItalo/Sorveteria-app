import { iceCreamData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const toggleThemeBtn = document.getElementById('checkbox-toggle')
const languageSelected = document.getElementById('language')
const completeOrderBtn = document.getElementById('complete-order-btn')
const modal = document.getElementById('order-modal')
const modalImage = document.getElementById('order-modal-image')
const confirmBtnModal = document.getElementById('confirm-btn-modal')
const closeBtnModal = document.getElementById('back-btn-modal')
const containerBtnModal = document.getElementById('container-btn-modal')
const totalOrderInModal = document.getElementById('total-price-value-modal')
const endOrderNewBtn = document.getElementById('end-order-new')
const endOrderCloseBtn = document.getElementById('end-order-close')
const finalMessageModal = document.getElementById('final-message-modal')

let portugueseSelected = true
languageSelected.addEventListener('change', changeLanguage)

function changeLanguage() {
    portugueseSelected = !portugueseSelected

    if (languageSelected.value === "Portuguese") {
        document.querySelector('.order-title').textContent = 'Seu Pedido'
        endOrderNewBtn.textContent = 'Novo Pedido'
        endOrderCloseBtn.textContent = 'Fechar'
    } else {
        document.querySelector('.order-title').textContent = 'Your Order'
        endOrderNewBtn.textContent = 'New Order'
        endOrderCloseBtn.textContent = 'Close'
    }
    render()
}

let orderArray = []
document.addEventListener('click', function (e) {

    if (e.target.dataset.theme) {
        console.log('themou')
        document.body.classList.toggle('dark-bg')
    }

    if (e.target.dataset.plus || e.target.dataset.minus) {
        if (e.target.dataset.plus) {
            const amount = document.querySelector(`#amount-${e.target.dataset.plus}`)
            amount.textContent = Number(amount.textContent) + 1
            setItemsArray(e.target.dataset.plus)
        }

        else if (e.target.dataset.minus) {
            const amount = document.querySelector(`#amount-${e.target.dataset.minus}`)
            if (Number(amount.textContent) > 0) {
                amount.textContent = Number(amount.textContent) - 1
                removeItemsFromArray(e.target.dataset.minus)
            }
        }
    }

    if (e.target.dataset.removeItem) {
        removeItemFromOrder(e.target.dataset.removeItem)
    }
})

function getIceCreamHtml() {
    let iceCreamHTML = ``

    iceCreamData.forEach(function (iceCream) {
        let userLanguageDescription = ''
        if (portugueseSelected) {
            userLanguageDescription = iceCream.portugueseDescription
        } else {
            userLanguageDescription = iceCream.englishDescription
        }

        iceCreamHTML += `
        <section>
        <h3 class="iceCream-title">Gelado<span class="iceCream-title-span">${iceCream.name}</span>
        </h3>
        <div class="container-iceCream">
            <img src=${iceCream.image} class="iceCream-img">
            <div class="container-iceCream-content">
                <div class="container-description">
                <h3 class="iceCream-title-description">Gelado<span class="iceCream-title-span">${iceCream.name}</span>
                </h3>
                        <p class="iceCream-description">${userLanguageDescription}</p>
                        <p class="iceCream-price">${iceCream.price}</p>
                </div>
                <div class="container-btn-plus-minus">
                    <i class="fa-solid fa-circle-minus" data-minus="${iceCream.uuid}"></i>
                    <p class="amount" id="amount-${iceCream.uuid}"> ${iceCream.amount}</p>
                    <i class="fa-solid fa-circle-plus" data-plus="${iceCream.uuid}"></i>
                </div>
            </div>
        </div>
        </section>
        `
    })
    return iceCreamHTML
}

/* OrderId is an array with a maximum of 4 ID's*/
function getOrderHtml(orderArray) {
    let orderHtml = ''
    let orderTotalPrice = 0
    orderArray.forEach(function (order) {
        let itemTotalPrice = (order.price * order.amount).toFixed(2)
        orderTotalPrice += (order.price * order.amount)
        orderHtml += `
            <div class="order">
                <p class="order-iceCream-name">Gelado${order.name}</p>
                <button class="order-remove-btn" data-remove-item="${order.uuid}">
                    excluir
                </button>
                <p class="order-total" id="price-${order.uuid}">
                R$ ${itemTotalPrice}
                <span class="order-count">(${order.amount} x R$ ${order.price})
                </span> 
                </p>
            </div>
           `
    })
    document.getElementById('order')
        .innerHTML = orderHtml
    document.getElementById('total-price-value')
        .textContent = `R$ ${orderTotalPrice.toFixed(2)}`

    /* Modal open after click button "Continue" */
    const containerModalText = document.getElementById('container-modal-text')
    let containerModalTextOpen = containerModalText ? containerModalText.innerHTML = orderHtml : ''
    containerModalTextOpen = orderHtml

    const totalPriceValueModalOpen = totalOrderInModal ?
        totalOrderInModal.textContent = `R$ ${orderTotalPrice.toFixed(2)}` : ''

    closeModalWhenTotalIsZero()
}

function closeModalWhenTotalIsZero() {
    //Validation if totalOrderInModal already exist in the DOM 
    let totalOrderInModalValue = totalOrderInModal ? totalOrderInModal.textContent : ''

    if (totalOrderInModalValue.includes('R$ 0.00')) {
        containerBtnModal.style.display = 'none'
        setTimeout(closeOrderModal, 900)
    }
}

function setItemsArray(iceCreamId) {
    //Return one ice cream object
    const targetIceCreamObj = iceCreamData.filter(function (iceCream) {
        return iceCream.uuid === iceCreamId
    })[0]
    targetIceCreamObj.amount = targetIceCreamObj.amount + 1

    if (orderArray.find(iceCreamObj => iceCreamObj.uuid === targetIceCreamObj.uuid)) {
        getOrderHtml(orderArray)
    }
    else {
        orderArray.push(targetIceCreamObj)
        getOrderHtml(orderArray)
    }
}

function removeItemsFromArray(iceCreamId) {
    //Return one ice cream object
    const targetIceCreamObj = iceCreamData.filter(function (iceCreamObj) {
        return iceCreamObj.uuid === iceCreamId
    })[0]

    if (targetIceCreamObj.amount > 0) {
        targetIceCreamObj.amount = targetIceCreamObj.amount - 1
    }
    if (targetIceCreamObj.amount === 0) {
        let indexIceCreamObj = orderArray.indexOf(targetIceCreamObj)
        orderArray.splice(indexIceCreamObj, 1)
    }
    getOrderHtml(orderArray)
}

function removeItemFromOrder(itemId) {
    const targetIceCreamObj = orderArray.filter(function (iceCream) {
        return iceCream.uuid === itemId
    })[0]
    targetIceCreamObj.amount = 0
    removeItemsFromArray(targetIceCreamObj.uuid)
    render()
}

function renderCompleteOrder() {
    getOrderHtml(orderArray)
    let totalOrderInModalValue = totalOrderInModal ? totalOrderInModal.textContent : ''

    if (!totalOrderInModalValue.includes('R$ 0.00')) {
        containerBtnModal.style.display = 'flex'
        modal.showModal()
    }
    else {
        setTimeout(closeOrderModal, 1000)
    }
    if (languageSelected.value === "Portuguese") {
        confirmBtnModal.textContent = 'Avançar'
        closeBtnModal.textContent = 'Voltar'
    }
    else {
        confirmBtnModal.textContent = 'Confirm'
        closeBtnModal.textContent = 'Back'
    }
    toggleThemeBtn.addEventListener('change', () => {
        document.body.classList.toggle('dark-bg')
    })
}

function openOrderFinalMessage() {
    const finalMessageContainer = document.getElementById("final-message-container")
    finalMessageModal.showModal()
    finalMessageContainer.innerHTML = `
            <h2 class="final-message-title pt-br"> Obrigado por seu pedido!</h2>
        <h2 class="final-message-title en-us"> Thank you for your order!</h2>
        <img src="./assets/sorvete-agradecendo.png" class="final-image" alt="imagem de um sorvete agradecendo o pedido">
    `
    const ptBr = document.querySelector('.pt-br')
    if (languageSelected.value === "Portuguese") {
        ptBr.style.display = 'block'
        document.querySelector('.en-us').style.display = 'none'
    }
    else {
        ptBr.style.display = 'none'
        document.querySelector('.en-us').style.display = 'block'
    }
}

function closeOrderImage() {
    modalImage.close()
}
function loadOrderImage() {
    modalImage.showModal()
    modalImage.innerHTML = `
        <img src="./assets/sorvete-dancando.gif" alt="um gif animado de um sorvete dançando">
    `
}

function clearIceCreamAmount() {
    iceCreamData.forEach(function (iceCream) {
        return iceCream.amount = 0
    })
    orderArray = []
    render()
    getOrderHtml(orderArray)
}

function confirmModalOrder() {
    setTimeout(loadOrderImage, 100)
    setTimeout(closeOrderModal, 2000)
    setTimeout(closeOrderImage, 2000)
    setTimeout(openOrderFinalMessage, 1900)
    setTimeout(clearIceCreamAmount, 2000)
}

function closeFinalMessage() {
    finalMessageModal.close()
}

function closeOrderModal() {
    modal.close()
}

function render() {
    document.getElementById('main').innerHTML = getIceCreamHtml()
}
render()

endOrderNewBtn.addEventListener('click', closeFinalMessage)
endOrderCloseBtn.addEventListener('click', closeFinalMessage)
completeOrderBtn.addEventListener('click', renderCompleteOrder)
confirmBtnModal.addEventListener('click', confirmModalOrder)
closeBtnModal.addEventListener('click', closeOrderModal)
