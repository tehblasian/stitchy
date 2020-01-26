import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { split } from '../api/queries';

const IMAGE_SIZE = 16;
const TEST_IMAGE_URL = 'https://ace-bootlegs.com/wp-content/uploads/BOOTLEGS%20ARTWORK/PINK%20FLOYD/PF_COMPILATIONS/1975-1976-Wish_you_hereAnimals_outtakes-front.jpg';

const Main = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 60px;

    img  {
        width: auto;
        height: 250px;
        margin-right: 50px;
    }

    .gridpc {
        margin-right: 0px;
        width: 10px;
        height: auto;
        transition: .3s;
    }

    .gridpc:hover {
        transform: scale(2);
    }

    .gridpc:active{
        transform: scale(65) translateY(-5px);
    }
    margin-bottom: 60px;

`

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(25, 1fr);
    object-fit: scale-down;
    width: 50%;
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

    const renderGrid = images => images.map((item, i) => <img className="gridpc" alt="Grid part" src={item.url}/>);

    return (
        <Main>
            <img alt="stuff" src={album}/>
            <Grid>
                {
                    renderGrid(imageUrls)
                }
            </Grid>
        </Main>
    )
};

export default StitchMosaic;
