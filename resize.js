const fs = require('fs')
const sharp = require('sharp')

module.exports = function resize(path) {
    let transform = sharp()
    const format = 'png'
    const readStream = fs.createReadStream(path)
    transform = transform.toFormat(format)
    transform = transform.resize(400, 400)
    return readStream.pipe(transform)
}