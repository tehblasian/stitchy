import axios from "axios"

const AuthToken = "sjwl77g5z17jlbdk3etr1xiiafh2rv42"

export async function search({ query = "", size = 5, page = 10 }) {
  const results = await axios({
    baseURL: "https://conuhacks-2020.tsp.cld.touchtunes.com/v1",
    method: "get",
    url: "/songs",
    headers: {
      Authorization: AuthToken,
      Accept: "*/*",
      Host: "conuhacks-2020.tsp.cld.touchtunes.com"
    },
    params: {
      query,
      size,
      page
    }
  })
    .then(res => res.data.songs) // TODO: Catch errors
    .catch(err => console.log({ err }))
}

export async function getSong({ songId }) {
  const results = await axios({
    baseURL: "https://conuhacks-2020.tsp.cld.touchtunes.com/v1",
    method: "get",
    url: "/songs/" + songId,
    headers: {
      Authorization: AuthToken,
      Accept: "*/*",
      Host: "conuhacks-2020.tsp.cld.touchtunes.com"
    }
  })
    .then(res => res.data)
    .catch(err => console.log({ err }))

  console.log({ results })
}

getSong({ songId: "45448104" })
