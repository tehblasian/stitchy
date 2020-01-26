import React from 'react';
import styled from 'styled-components'
import InputWithsuggestions from './components/InputWithSuggestions';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h1`
  
`

function App() {
  return (
    <Main>
      <Title>MyClippy</Title>
      <InputWithsuggestions/>
    </Main>
  );
}

export default App;
