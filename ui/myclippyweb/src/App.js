import React, {useState} from 'react';
import styled from 'styled-components'
import InputWithsuggestions from './components/InputWithSuggestions';
import SongDisplayer from './components/SongDisplayer';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  
`

function App() {
  const [song, setSong] = useState()

  return (
    <Main>
      <Title>MyClippy</Title>
      <InputWithsuggestions setSong={song => setSong(song)}/>
      {song && <SongDisplayer song={song}/>}
    </Main>
  );
}

export default App;
