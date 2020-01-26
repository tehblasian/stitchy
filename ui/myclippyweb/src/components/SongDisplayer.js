import React from "react"
import styled from "styled-components"
import { split } from "../api/queries"

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img  {
    height: 300px;
    width: auto;
  }
`

function SongDisplayer({ song }) {
  if (!song) return null
  const {
    id,
    genreName,
    duration,
    title,
    playUrl,
    artist: {
      name,
      jackets: { "290": image }
    }
  } = song
  return (
    <Main>
      <img alt="Art" src={image} />
      <p>{name}</p>
      <button
        onClick={e => {
          split({ imageUrl: image }).then(res => {
            console.log({ res })
          })
        }}
      >
        Generate
      </button>
    </Main>
  )
}

export default SongDisplayer

// {
//     "album": {
//       "trackCount": 0,
//       "jackets": {

//       },
//       "title": "string"
//     },
//     "title": "string",
//     "artist": {
//       "albumCount": 0,
//       "songCount": 0,
//       "name": "string",
//       "jackets": {}
//     },
//     "genreName": "string",
//     "duration": 0,
//     "styleName": "string",
//     "id": 0,
//     "playUrl": "string"
//   }
