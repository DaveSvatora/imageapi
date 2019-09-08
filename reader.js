const fs = require('fs')
const path = require('path')
const dir = 'uploads'
const full = 'full'
const host = 'http://192.168.1.2:8080'

module.exports = function getAllFiles() {

    let years = []

    fs.readdirSync(dir).forEach(year => {
        let months = []
        let writeYear = true
        let stat = fs.statSync(path.join(dir, year));
        if (stat.isDirectory()) {
            if (writeYear) {
                years.push(
                    {
                        year: year,
                        months: months
                    }
                )
                writeYear = false;
            }
            fs.readdirSync(path.join(dir, year)).forEach(month => {
                let days = []
                let writeMonth = true
                let stat = fs.statSync(path.join(dir, year, month));
                if (stat.isDirectory()) {
                    if (writeMonth) {
                        months.push(
                            {
                                month: month,
                                days: days
                            }
                        )
                        writeMonth = false
                    }
                    fs.readdirSync(path.join(dir, year, month)).forEach(day => {
                        let filenames = []
                        let writeDay = true
                        let stat = fs.statSync(path.join(dir, year, month, day));
                        if (stat.isDirectory()) {
                            if (writeDay) {
                                days.push(
                                    {
                                        day: day,
                                        filenames: filenames
                                    }
                                )
                                writeDay = false
                            }
                            fs.readdirSync(path.join(dir, year, month, day)).forEach(file => {
                                console.log("pushing: " + host + '/' + dir + '/' + year + '/' + month + '/' + day + '/' + file)
                                filenames.push(
                                    {
                                        file: file,
                                        url: host + '/' + dir + '/' + year + '/' + month + '/' + day + '/' + file,
                                        fullUrl: host + '/' + full + '/' + year + '/' + month + '/' + day + '/' + file
                                    }
                                )
                            })
                        }
                    })
                }
            })
        }
    })
    return years
}
