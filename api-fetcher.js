module.exports.getMovieObj = async (title, API_KEY) => {
    const axios = require('axios')

    const res = await axios.get(`http://www.omdbapi.com/?apikey=${API_KEY}&t=${title.split(' ').join('%20')}`)
    return res.data
}