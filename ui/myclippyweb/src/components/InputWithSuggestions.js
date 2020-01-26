import React, { useState } from "react"
import styled from "styled-components"
import { search, getSong } from "../api/queries"

const Input = styled.input`
  width: 500px;
  height: 38px;
  border-radius: 5px;
  font-size: 30px;
  padding: 20px 40px;
  box-shadow: 1px 4px 20px 10px rgba(0,0,0,.1);
  border: none;
  color: #424242;
  background-color: rgba(255,255,255,.8);
  transition: .3s;
  &:focus {
    box-shadow: 1px 4px 10px 2px rgba(0,0,0,.1);
    outline: none;

  }
`

const Suggestions = styled.div`
  max-height: 200px;
  overflow-y: scroll;
  width: 100%;
  border: grey;
  background-color: white;
  box-shadow: 0px 1px 1px 1px #f2f2f2;

  div {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 5px 20px;
    cursor: pointer;
  }
  .last {
    border-bottom: none;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export default function InputWithsuggestions({setSong, setAlbum}) {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const clickHandler = async (songId) => {
    const res = await getSong({ songId });
    setSong(res.song);
    setFocused(false);
    setAlbum(res.song.album.jackets[290]);
  };

  const show = suggestions && suggestions.length>0 && focused
  return (
    <Wrapper>
      <Input
        onKeyDown={e => {
          if (e.key === "Enter") {
            search({ query }).then(songs => setSuggestions(songs))
          }
        }}
        onFocus={e => setFocused(true)}
        // onBlur={e => setFocused(false)}
        placeholder="Search a song"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Suggestions style={{visibility: show?'visible':'hidden'}}>
        {show
          ? suggestions.map(({ title, artistName, id: songId }, index) => (
              <div
                onClick={() => clickHandler(songId)}
                key={index}
                className={index === suggestions.length - 1 ? "last" : null}
              >
                <h4>{title}</h4>
                <p>{artistName}</p>
              </div>
            ))
          : null}
      </Suggestions>
    </Wrapper>
  )
}

// const mockData = [
//   {
//     id: 45448104,
//     styleName: "Electro - Dance",
//     genreName: "Pop",
//     duration: 178,
//     title: "Purple Hat",
//     artistName: "Sofi Tukker"
//   },
//   {
//     id: 774301,
//     styleName: "Electro - Dance",
//     genreName: "Pop",
//     duration: 178,
//     title: "Purple Hat",
//     artistName: "Sofi Tukker"
//   },
//   {
//     id: 23652808,
//     styleName: "Alt - Rock",
//     genreName: "Rock",
//     duration: 244,
//     title: "Purple",
//     artistName: "Pop Evil"
//   },
//   {
//     id: 80147006,
//     styleName: "R&B - Funk",
//     genreName: "R&B \\ Hip-Hop",
//     duration: 265,
//     title: "Purple",
//     artistName: "Shuggie Otis"
//   }
// ]
