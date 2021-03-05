const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema(
  {
    name: String,
  }
)

const bookModel = mongoose.model("Book", bookSchema)

module.exports = bookModel
