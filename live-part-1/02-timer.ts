// will be transpiled into javascript

console.log('hello')

// System.out.println('Hello')

type User = {
  id: number
  username: string
}

let alice: User = { id: 1, username: 'alice' }

function report() {
  // console.log(new Date().toTimeString())
  console.log(new Date().toLocaleTimeString('en-US', { hour12: false }))
}

setInterval(report, 1000)
