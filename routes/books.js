const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

// All Books Route
router.get('/', async (req, res) => {
  res.send('All books')
})

// New Book Route
router.get('/new', async (req, res) => {
  try {
    const authors = await Author.find({})
    const book = new Book()
    res.render('books/new', {
      authors: authors,
      book: book
    })
  } catch {
    res.redirect('/books')
  }
})

// Create Book Route
router.post('/', upload.single('cover') , async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.descrition
  })

  try {
    const newBook = await book.save()
    //res.redirect(`books/${newBook.id}`)
    res.redirect('books')
  } catch {

  }
})

module.exports = router