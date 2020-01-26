import React, { useState } from "react"
import styled from "styled-components"
import { search, getSong } from "../api/queries"

const Input = styled.input`
  width: 400px;
  height: 40px;
  border-radius: 5px;
  font-size: 16px;
  padding: 5px 10px;
  box-shadow: 0px 4px 5px 5px #f2f2f2;
`

const Suggestions = styled.div`
  max-height: 200px;
  overflow-y: scroll;
  width: 100%;
  border: grey;
  background-color: white;
  box-shadow: 0px 1px 1px 1px #f2f2f2;

  div {
    border-radius: 2px;
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

export default function InputWithsuggestions({setSong}) {
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState("")
  const [suggestions, setSuggestions] = useState([])

  return (
    <Wrapper>
      <Input
        onKeyDown={e => {
          if (e.key === "Enter") {
            search({ query }).then(songs => setSuggestions(songs))
          }
        }}
        onFocus={e => setFocused(true)}
        onBlur={e => setFocused(false)}
        placeholder="Search a song"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Suggestions>
        {suggestions || focused
          ? suggestions.map(({ title, artistName, id: songId }, index) => (
              <div
                onClick={e => getSong({ songId }).then(res => setSong(res.song))}
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
