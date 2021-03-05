const express = require("express")
const mongoose = require("mongoose")
const Book = require("./models/book")

const app = express()

if (process.env.SERVICE_VERSION === "v2") {
  const MONGODB_URL = process.env.MONGODB_URL

  let connectDatabaseWithRetry = () => {
    return mongoose.connect(MONGODB_URL, { useNewUrlParser: true }, (err) => {
      if (err) {
        console.error(
          "Failed to connect to mongo on startup - retrying in 5 sec",
          err
        )
        setTimeout(connectDatabaseWithRetry, 5000)
      }
    })
  }

  connectDatabaseWithRetry()
}

const localBooks = [
  { id: "1", name: "alice" },
  { id: "2", name: "bob" },
]

app.get("/books", async (req, res) => {
  if (process.env.SERVICE_VERSION === "v2") {
    const books = await Book.find({}).select({ _id: 0 })
    res.json(books)
  } else {
    res.json(localBooks)
  }
})

app.get("/", (req, res) => {
  res.json({ message: "Hello, welcome to books service!" })
})

app.listen(8080, () => {
  console.log("Application is running on port 8080")
})
