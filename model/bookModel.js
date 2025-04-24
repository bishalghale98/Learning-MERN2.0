const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    unique: true,
  },
  bookPrice: {
    type: Number,
  },
  isbnNumber: {
    type: String,
  },
  authorName: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  publication: {
    type: String,
  },
  imagePath: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
