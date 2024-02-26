import express from 'express'
import { print } from 'listening-on'

let app = express()

app.get('/', (req, res, next) => {
  if (name.length === 0) {
    next()
  } else {
    res.end('welcome back, ' + name)
  }
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }))

let name = ''

app.post('/name', (req, res) => {
  console.log(req.body)
  name = req.body.nickname
  res.end('welcome ' + name)
})

app.get('/', (req, res) => {
  console.log('someone is visiting the home page')
  console.log(req.headers)
  res.write('hello')
  setTimeout(() => {
    res.write(' world')
    res.end()
  }, 1000)
})

app.use((req, res) => {
  res.end('404 page not found')
})

// console.log(app)

function report() {
  print(3000)
}

// app.listen(3000, report)

let port = 3000
// app.listen(port, function () {
//   print(3000)
// })

app.listen(port, () => print(port))

// let add = (a, b) => a + b

// console.log('the server is ready on http://localhost:3000')
