const express = require('express')
const {config} = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const booksRoutes = require('./routes/book.routes')
config()

//Usamos expres para los midlewares
const app = express()
app.use(bodyParser.json()) //parseador de body

//Aca conectamos la base de datos
mongoose.connect(process.env.MONGO_URL,{dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection

app.use('/books',booksRoutes)

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`Servidor iniciado en el puerto ${port}`)
})