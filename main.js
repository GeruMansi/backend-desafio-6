const express = require('express')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const fs = require('fs')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

let products = []
let messages = []

app.get('/', (req, res) => {
    // let data = {
    //     messages
    // }
    // if (products.length === 0) {
    //     data.alert = 'No hay productos para mostrar'
    // } else {
    //     data.products = products
    // }
    // return res.render('layouts/main', data)
})

app.get('/productos', (req, res) => {
    return res.json(products)
})

// app.post('/productos', (req, res) => {
//     const newProduct = req.body
//     newProduct.id = products.length + 1
    
//     products.push(newProduct)

//     return res.redirect('/')
// })

const PORT = 8080

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en servidor: ${error}`))

io.on('connection', (socket) => {
    socket.on('nuevo producto', (data) => {
        data.id = products.length + 1
        products.push(data)
        io.sockets.emit('mostrar productos', products)
    })

    socket.on('nuevo mensaje', (data) => {
        let dataMensajes
        try {
            dataMensajes = fs.readFileSync('./messages.json', 'utf-8')
            dataMensajes = JSON.parse(dataMensajes)
        } catch(err) {
            console.log(`Error al leer el archivo (${err})`)
            dataMensajes = []
        }
        dataMensajes.push(data)
        fs.writeFileSync('./messages.json', JSON.stringify(dataMensajes, null, 2))
        messages.push(data)
        io.sockets.emit('mostrar mensajes', messages)
    })
})