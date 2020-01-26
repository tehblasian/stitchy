import React, {useState} from 'react';
import InputWithsuggestions from './components/InputWithSuggestions';
import StitchMosaic from './components/StitchMosaic';
import styled, {createGlobalStyle} from 'styled-components'
import SongDisplayer from './components/SongDisplayer';
import "./index.css"

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("https://files.slack.com/files-tmb/TRXST6RTL-FT67E26QP-935ebc93c1/omar_khayyam_720.png"), #8C52FF;
  height: 100vh;
  overflow-y: scroll;
  background-repeat: no-repeat;
  background-position: center 10vh;
  background-size: auto 40%;
`

const Title = styled.h1`

  margin-top: 50vh;
  color: #f2f2f2;
  font-family: 'Pacifico';
  font-weight: bold;
  font-size: 50px;
`

function App() {
  const [song, setSong] = useState();
  const [album, setAlbum] = useState();

  return (
    <Main>
      <Title>Skitchy</Title>
      <InputWithsuggestions setSong={song => setSong(song)} setAlbum={setAlbum}/>
      { song && album &&
        <StitchMosaic album={album} song={song} />
      }
    </Main>
  );
}

export default App;
