const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000 // TODO: load from environment
const host = 'http://localhost' // TODO: load from enviroment

app.use(cors({
  origin: 'http://localhost:1234' // TODO: change this to read from ENV
}))

app.get('/health', (req, res) => res.send('Healthy'))
app.get('/search', searchHandler)

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`))

function searchHandler (req, res) {
  res.json([
    {
      year: 1990,
      count: 200
    },
    {
      year: 1991,
      count: 300
    }
  ])
}
