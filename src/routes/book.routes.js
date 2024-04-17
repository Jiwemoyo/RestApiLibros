const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

//MIDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del libro no es valido lince",
    });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "El libro no fue Encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
  res.book = book;
  next();
};

//Obtener todos los libros[GET ALL]
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Crear un nuevo libro [POST]

router.post("/", async (req, res) => {
  const { title, autor, genre, publication_date } = req?.body;
  if (!title || !autor || !genre || !publication_date) {
    return res.status(400).json({
      message: `Todos los campos son requeridos papu`,
    });
  }

  const book = new Book({
    title,
    autor,
    genre,
    publication_date,
  });

  try {
    const newBook = await book.save();
    res.status(200).json(newBook);
    console.log(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//obtener get individual

router.get("/:id", getBook, async (req, res) => {
  res.json(res.book);
});

//modificar un elemento
router.put("/:id", getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.autor = req.body.autor || book.autor;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.patch("/:id", getBook, async (req, res) => {

  if (!req.body.title && !req.body.autor && req.body.genre && req.body.publication_date) {
    res.status(400).json({
      message:'Al menos uno de los campos debe ser enviado'
    })
  }



  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.autor = req.body.autor || book.autor;
    book.genre = req.body.genre || book.genre;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Eliminar 

router.delete("/:id", getBook, async (req, res) => {
  try {
    const book = res.book
    await res.book.deleteOne({
      _id: book._id
    })
    res.json({
      message: `El libro ${book.title} fue eliminado correctamente`
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
});

module.exports = router;
