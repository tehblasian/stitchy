import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { split } from '../api/queries';

const IMAGE_SIZE = 16;
const TEST_IMAGE_URL = 'https://ace-bootlegs.com/wp-content/uploads/BOOTLEGS%20ARTWORK/PINK%20FLOYD/PF_COMPILATIONS/1975-1976-Wish_you_hereAnimals_outtakes-front.jpg';

const Main = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    img  {
        width: 50px;
        height: 50px;
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

const StitchMosaic = ({ album, song }) => {
    const [imageUrls, setImageUrls] = useState([]);

    const splitImage = async (imageUrl) => {
        const splitResults = await split(imageUrl, song.title);
        const images = splitResults.map(splitResult => splitResult.assets.small_thumb);
        setImageUrls(images);
    }

    useEffect(() => {
        splitImage(album);
    }, [album]);

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
