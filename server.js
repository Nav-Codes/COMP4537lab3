'use strict';

const http = require('http');
const url = require('url');
const format = require('util');
const utils = require("./modules/utils");
const userMessages = require("./messages/lang/en/user");

class ServerManager {
    #server
    #portNum

    /** Creates the server and lists all the different endpoints of this server */
    constructor(portNum) {
        this.#portNum = portNum

        this.#server = http.createServer((req, res) => {
            if (req.method === "GET") {
                
                //generated by ChatGPT and modified. 
                //when true, the switch/case handler will check each case to see if it is true
                switch (true) {
                    case req.url.includes("/getDate?name=") : {
                        this.#getDateAndName(req, res)
                        break
                    }
                    case req.url.includes("/readFile?fileName=") : {
                        this.#readFromFile(req, res)
                        break
                    }
                    case req.url.includes("/writeFile?text=") : {
                        this.#writeToFile(req, res)
                        break
                    }
                    default : {
                        this.#wrongEndpoint(req, res)
                    }
                }
            }
        })
        
        this.#launchServer()
    }

    #launchServer() {
        this.#server.listen(this.#portNum, () => {
            console.log(`Server listening on port ${this.#portNum}`)
        })
    }

    #getDateAndName(req, res) {
        //query param parsing done by ChatGPT
        const parsedUrl = url.parse(req.url, true); // `true` makes it parse query params into an object
        const queryParams = parsedUrl.query; // extract the query params and stores them into an object 

        const nameAndDate = utils.NameAndDatetime.getNameAndDate(queryParams.name)

        res.writeHead(200, {"content-type" : "text/html"})
        res.end(`<p style='color:blue;'>${nameAndDate}</p>`)
    }

    #readFromFile(req, res) {
        //gets the file name stored in the url param named "fileName"
        const fileName = url.parse(req.url, true).query.fileName
        
        //stores file contents
        const fileContents = utils.FileManager.getFileContents(fileName)

        if (!fileContents) {
            res.writeHead(404, {"content-type" : "text/html"})
            res.end(format.format(userMessages.FILE_NOT_FOUND, fileName))
        } else {
            res.writeHead(200, {"content-type" : "text"})
            res.end(fileContents)
        }
    }

    #writeToFile(req, res) {
        const contentsToWrite = url.parse(req.url, true).query.text

        utils.FileManager.writeToFile(contentsToWrite)
        
        res.writeHead(200, {"content-type" : "text/html"})
        res.end()
    }

    #wrongEndpoint(req, res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`${userMessages.INVALID_ENDPOINT}`);
    }

}

let myServer = new ServerManager(8000);