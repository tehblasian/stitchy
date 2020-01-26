import React, { useState } from "react"
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  transform: scale(.2);
`
function SongDisplayer({ song }) {
  const [grid, setGrid] = useState([])

  if (!song) return null

  console.log({grid})

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
          split({ imageUrl: image }).then(images => {
            setGrid(images)
          })
        }}
      >
        Generate
      </button>
      <Grid>
          {grid.map((item, i)=> {
              return <img alt="Grid part" src={item.assets.preview.url}/>
          })}
      </Grid>
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
