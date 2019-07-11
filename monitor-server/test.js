const got = require('got')

async function test(){
  var d1 = new Date()
  try {
    const response = await got('http://10.1.1.106', {
      json: true,
      timeout: 500
    })
    var d2 = new Date()
    // console.log(response.body, 'took', d2 - d1, 'ms')
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(JSON.stringify(response.body))
    process.stdout.write(' took: ' + (d2 - d1) + 'ms')
  }
  catch(error) {
    console.log(error)
  }

  setTimeout( () => {
    test()
  }, 10)
}

test()