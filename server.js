const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const { getMovieObj } = require('./api-fetcher')
const randomMovie = require('movies-names')

const PORT = process.env.PORT || 8000
const API_KEY = process.env.API_KEY

app.use(express.static('src'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'src/index.html')
})

io.on('connection', (socket) => {
    socket.on("random movie request", () => {
        (async function() {
            const movieObj = await getMovieObj(randomMovie.random().title, API_KEY)
            socket.emit('movie fetched', movieObj)
        })()
    })

    socket.on('movie request', title => {
        (async function() {
            const movieObj = await getMovieObj(title, API_KEY)
            socket.emit('movie fetched', movieObj)
        })()
    })
})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})