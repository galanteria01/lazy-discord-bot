const fetch = require('node-fetch');

const getCovidStats = (country) => {
  return fetch("https://corona.lmao.ninja/v2/countries/" + country + "?yesterday=true&strict=true&query")
  .then(res => {
    return res.json();
  })
  .catch(e => console.log(e))
  .then(
    data => {
      return data;
    }
  ).catch((e) => console.log(e))
}

const getCovidTotalStats = () => {
  return fetch("https://corona.lmao.ninja/v2/all?yesterday")
  .then(res => {
    return res.json();
  })
  .then(
    data => {
      return data;
    }
  )
}

const getQuote = () => {
  return fetch(process.env.QUOTE_API)
  .then(res => {
    return res.json();
  })
  .then(data => {
    return data[0]['q'] + " - " + data[0]['a']; 
  })
}

const getJoke = () => {
  return fetch(process.env.JOKE_API)
  .then(res => {
    return res.json();
  })
  .then(data => {
    return data; 
  })
}

const getMeme = () => {
  return fetch(process.env.MEME_API)
  .then(res => {
    return res.json();
  })
  .then(data => {
    return data;
  })
}

module.exports = {
  getMeme,
  getJoke,
  getCovidStats,
  getCovidTotalStats,
  getQuote
}