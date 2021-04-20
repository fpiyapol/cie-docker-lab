const express = require('express')
const axios = require('axios')

const app = express()

app.get('/check', async (req, res) => {
  //   this endpoint call book service
  const url = process.env.BOOK_URL
  const resp = await axios.get(`${url}/books`)
  const books = resp.data
  res.json({ response: `Books service said ${JSON.stringify(books)}` })
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello, this is checking service.' })
})

app.listen(9090, () => {
  console.log('Application is running on port 9090')
})
