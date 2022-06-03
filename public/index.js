const socket = io()
const tablaProductos = document.getElementById('tablaProductos')
const productForm = document.getElementById('productForm')
const messageForm = document.getElementById('messageForm')
const emailInput = document.getElementById('emailInput')
const messageInput = document.getElementById('messageInput')
const messagesBox = document.getElementById('messagesBox')

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let productFormData = new FormData(e.target)
    let newProduct = {
        title: productFormData.get('title'),
        price: productFormData.get('price'),
        thumbnail: productFormData.get('thumbnail')
    }
    productForm.reset()
    socket.emit('nuevo producto', newProduct)
})

const productTemplate = Handlebars.compile(`
    <tr>
        <th scope="row">{{id}}</th>
        <td>{{title}}</td>
        <td>{{price}}</td>
        <td><img src={{thumbnail}} alt="" width="150"></td>
    </tr>
`)

fetch('/productos')
    .then(response => response.json())
    .then(data => {
        tablaProductos.innerHTML = ''
        data.length > 0 ?
            data.forEach(item => {
                tablaProductos.innerHTML += productTemplate(item)
            }) : 
            tablaProductos.innerHTML = `
                <div class="alert dark-warning text-center" role="alert">
                    No hay productos para mostrar
                </div>
            `
    })

socket.on('mostrar productos', (data) => {
    tablaProductos.innerHTML = ''
    data.length > 0 ?
            data.forEach(item => {
                tablaProductos.innerHTML += productTemplate(item)
            }) : 
            tablaProductos.innerHTML = `
                <div class="alert dark-warning text-center" role="alert">
                    No hay productos para mostrar
                </div>
            `
})

class Mensaje {
    constructor(user, message) {
        this.user = user
        this.message = message
    }
}

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let newMessage = new Mensaje(emailInput.value, messageInput.value)
    socket.emit('nuevo mensaje', newMessage)
    emailInput.value = ''
    messageInput.value = ''
})

socket.on('mostrar mensajes', (data) => {
    messagesBox.innerHTML = ''
    data.forEach(item => {
        messagesBox.innerHTML += `
            <div>
                <span style="color: #09f; font-weight: bold">${item.user} <small style="color: brown">(${(new Date).getDay()}/${(new Date).getMonth()}/${(new Date).getFullYear()} ${(new Date).getHours()}:${(new Date).getMinutes()})</small></span><br>
                <i style="color: #0f0; text-transform: italic">${item.message}</i>
            </div>
        `
    })
})