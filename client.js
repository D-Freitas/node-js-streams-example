const sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  }) 
}

async function request (url) {
  const response = await fetch(url)
  response.body[Symbol.asyncIterator] = function () {
    const reader = this.getReader()
    return {
      next: () => reader.read()
    }
  }

  async function* dataGenerator () {
    for await (const chunk of response.body) {
      yield chunk
    }
  }

  for await (const chunk of dataGenerator()) {
    await sleep(3000)
    const decoder = new TextDecoder('utf-8')
    const text = decoder.decode(chunk)
    console.log(text)
  }
}

request('http://localhost:3000')
