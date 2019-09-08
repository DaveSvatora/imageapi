const fs = require('fs')
const path = require('path')
const dir = 'uploads'
const full = 'full'
const host = 'http://192.168.1.2:8080/'

module.exports = function getAllFiles() {
    const years = []
    const months = []
    const days = []
    const filenames = []
    fs.readdirSync(dir).forEach(year => {
        years.push(
            {
                year: year,
                months: months
            }
        )
        fs.readdirSync(path.join(dir, year)).forEach(month => {
            months.push(
                {
                    month: month,
                    days: days
                }
            )
            fs.readdirSync(path.join(dir, year, month)).forEach(day => {
                days.push(
                    {
                        day: day,
                        filenames: filenames
                    }
                )
                fs.readdirSync(path.join(dir, year, month, day)).forEach(file => {
                    filenames.push(
                        {
                            file: file,
                            url: path.join(host, dir, year, month, day, file),
                            fullUrl: path.join(host, full, year, month, day, file)
                        }
                    )
                })
            })
        })
    })
    return years
}
