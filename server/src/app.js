import Express from 'express'

const app = Express()
const port = 3000 // TODO: load from environment
const host = 'http://localhost' // TODO: load from enviroment

app.get('/health', (req, res) => res.send('Healthy'))

app.listen(port, () => console.log(`Example app listening at ${host}:${port}`))
