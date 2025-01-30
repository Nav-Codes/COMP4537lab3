const format = require('util');
const fs = require('fs');
const userMessages = require("../messages/lang/en/user")
const fileName = "file.txt"

exports.NameAndDatetime = class {
    static #getDate() {
        return new Date().toString()
    }

    static getNameAndDate(name) {
        return format.format(userMessages.NAME_AND_DATE, name, this.#getDate())
    }
}

exports.FileManager = class {
    static getFileContents(fileName) {
        if (fs.existsSync(fileName)) {
            //file reading provided by ChatGPT
            let data = fs.readFileSync(`./${fileName}`, "utf-8");
            return data
        } else {
            return false
        }
    }

    static writeToFile(fileContents) {
        if (fs.existsSync(fileName)) {
            fs.appendFileSync(`./${fileName}`, `${fileContents}\n`)
        } 
        else {
            fs.openSync(fileName, "w")
            this.writeToFile(fileContents)
        }
    }
}