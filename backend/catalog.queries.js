const axios = require("axios")

const AuthToken = "sjwl77g5z17jlbdk3etr1xiiafh2rv42"
const headers = {
  Authorization: AuthToken,
  Accept: "*/*",
  Host: "conuhacks-2020.tsp.cld.touchtunes.com",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
}

exports.search = async function search({ query = "", size = 10, page = 0 }) {
  const results = await axios({
    baseURL: "https://conuhacks-2020.tsp.cld.touchtunes.com/v1",
    method: "get",
    url: "/songs",
    headers,
    params: {
      query,
      size,
      page
    }
  })
    .then(res => {
      console.log({ res })
      return res.data.songs
    }) // TODO: Catch errors
    .catch(err => {
      console.log({ err })
      return err
    })

  return results
}

exports.getSong = async function getSong({ songId }) {
  const results = await axios({
    baseURL: "https://conuhacks-2020.tsp.cld.touchtunes.com/v1",
    method: "get",
    url: "/songs/" + songId,
    headers
  })
    .then(res => res.data)
    .catch(err => {
      console.log({ err })
      return err
    })

  return results
}
