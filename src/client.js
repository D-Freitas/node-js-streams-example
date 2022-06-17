import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consume () {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
  return response.data
}

const stream = await consume()
stream
  .pipe(
    new Transform({
      transform(chunk, encode, callback) {
        const item = JSON.parse(chunk)
        const id = /\d+/.exec(item.name)[0]
        let name = item.name

        if (id % 2 === 0) name = name.concat(' is even')
        else name = name.concat(' is odd')
        item.name = name

        callback(null, JSON.stringify(item))
      }
    })
  )
  .pipe(
    new Transform({
      transform(chunk, encode, callback) {
        callback(null, chunk.toString().toUpperCase())
      }
    })
  )
  .pipe(
    new Writable({
      write(chunk, encode, callback) {
        const bufferToString = chunk.toString()
        console.log(bufferToString)

        callback()
      }
    })
  )
