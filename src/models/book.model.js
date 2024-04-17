const mongoose = require('mongoose')

const books_schema = new mongoose.Schema(
    {
        title:String,
        autor:String,
        genre:String,
        publication_date:String
    }
)


module.exports =mongoose.model('Book',books_schema)

//comentario pa despistar