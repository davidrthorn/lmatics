const express = require('express')

const app = express()
const port = 3000 // TODO: load from environment
const host = 'http://localhost' // TODO: load from enviroment

app.get('/health', (req, res) => res.send('Healthy'))
app.get('/search', searchHandler)

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`))

function searchHandler (req, res) {
  // TODO: implement the search
}
