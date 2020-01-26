import axios from "axios"

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

export async function search({ query = "", size = 5, page = 10 }) {
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
    .catch(err => console.log({ err }))

  return results
}

export async function getSong({ songId }) {
  const results = await axios({
    baseURL: "https://conuhacks-2020.tsp.cld.touchtunes.com/v1",
    method: "get",
    url: "/songs/" + songId,
    headers
  })
    .then(res => res.data)
    .catch(err => console.log({ err }))

  return results
}
