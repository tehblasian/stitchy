import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { split } from '../api/queries';

const IMAGE_SIZE = 16;
const TEST_IMAGE_URL = 'http://st.cdjapan.co.jp/pictures/s/13/48/NEOIMP-13200.jpg?v=6';

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img  {
        width: 75px;
        height: 75px;
        margin-top: -13px;
        margin-right: -13px;
    }
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    object-fit: scale-down;
    width: 256px;
`

const StitchMosaic = () => {
    const [imageUrls, setImageUrls] = useState([]);

    const splitImage = async (imageUrl) => {
        const splitResults = await split(imageUrl);
        const images = splitResults.map(splitResult => splitResult.assets.small_thumb);
        setImageUrls(images);
    }

    useEffect(() => {
        splitImage(TEST_IMAGE_URL);
    }, []);

    const renderGrid = images => images.map((item, i) => <img alt="Grid part" src={item.url}/>);

    return (
        <Main>
            <Grid>
                {
                    renderGrid(imageUrls)
                }
            </Grid>
        </Main>
    )
};

export default StitchMosaic;
