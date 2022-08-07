const http = require('http')
const { randomUUID } = require('crypto')
const { Readable } = require('stream')

function* dataGenerator () {
  for (let i = 0; i < 1_000_000; i++) {
    const user = {
      id: randomUUID(),
      username: `Davi-${i}`,
    }
    yield user
  }
}

function handler (request, response) {
  const readableStream = new Readable({
    read() {
      for (const data of dataGenerator()) {
        this.push(JSON.stringify(data) + "\n")
      }
      this.push(null)
    }
  }) 

  readableStream.pipe(response)
}

const server = http.createServer(handler)
server.listen(3000)
server.on('listening', () => console.log('started on server: 3000'))
