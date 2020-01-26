
const axios = require('axios');
const sharp = require('sharp');
const {search,getSong} = require('./catalog.queries')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const nearestColor = require('nearest-color');

// SETUP EXPRESS
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

const PORT = 8080;
const RGB_THRESHOLD = 10;

// SETUP SHUTTERSTOCK API
const SHUTTERSTOCK_API_TOKEN = 'QXJKWVIwUFNybFNGWU53bEVDdHVvYjVRd1ROWURyTEc6QVFRYVRvMWxKcjFHaXM4aw==';
const shutterstockApi = axios.create({ 
    baseURL: 'https://api.shutterstock.com',
    headers: { 'Authorization': `Basic ${SHUTTERSTOCK_API_TOKEN}`},
});

const COMPRESSED_IMAGE_RES = 25;


const toHex = (number) => number.toString(16).padStart(2, '0');

/**
 * Compresses the source image
 * @return stock images corresponding to each pixel in the compressed image
 */
const split = async ({
    inputImageBuffer,
    songName,
}) => {
    // Compress image
    const imageBuffer = await sharp(inputImageBuffer)
        .resize(COMPRESSED_IMAGE_RES, COMPRESSED_IMAGE_RES)
        .raw()
        .toBuffer();

    const colorList = {
        black: 'rgb(0, 0, 0)',
        gray: 'rgb(210, 210, 210)',
        white: 'rgb(255, 255, 255)',
        red: 'rgb(231, 37, 37)',
        amber: 'rgb(244, 135, 0)',
        orange: 'rgb(236, 167, 29)',
        yellow: 'rgb(241, 241, 41)',
        lime: 'rgb(169, 228, 24)',
        green: 'rgb(6, 213, 6)',
        yellow: 'rgb(14, 203, 155)',
        turqoise: 'rgb(26, 224, 224)',
        aqua: 'rgb(11, 187, 245)',
        azure: 'rgb(31, 85, 248)',
        blue: 'rgb(0, 0, 255)',
        purple: 'rgb(127, 0, 255)',
        orchid: 'rgb(191, 0, 255)',
        magenta: 'rgb(234, 6, 177)',
    };

    const nearestColorCalculator = nearestColor.from(colorList);

    // Convert to hex array
    let colors = [];
    for (i = 0; i < imageBuffer.length; i+=3) {
        const color = {
            r: imageBuffer[i],
            g: imageBuffer[i+1],
            b: imageBuffer[i+2],
        }
        
        colors.push(nearestColorCalculator(color).name);
    }

    const colorMap = colors.reduce((acc, color) => {
        if (acc[color] == undefined) {
            return {
                ...acc,
                [color]: 1,
            };
        }
        return {
            ...acc,
            [color]: acc[color] + 1,
        };
    }, {});

    const results = await Promise.all(Object.keys(colorMap).map((color) => {
        const bw = (color == 'white' || color == 'black' || color == 'gray');

        return shutterstockApi.get('/v2/images/search', {
            params: {
                query: `${bw ? color : ''} texture`,
                color: bw ? 'bw' : color,
                category: 'Illustrations/Clip-Art',
                per_page: colorMap[color],
            },
        });
    }));

    const imageMap = Object.keys(colorMap).reduce((acc, color, index) => {
        return {
            ...acc,
            [color]: results[index].data.data,
        };
    }, {});

    const colorImages = colors.map(color => imageMap[color].pop());
    
    return colorImages;
}

app.listen(PORT, () => console.log(`Ready to split on port ${PORT}`));

app.post('/split', async (req, res) => {
    const { songName, albumCoverUrl } = req.body;

    // Fetch album cover image from url
    const response = await axios({
        method: 'GET',
        url: albumCoverUrl,
        responseType: 'arraybuffer',
    });

    const results = await split({
        inputImageBuffer: response.data,
        songName,
    });
    return res.json(results);
});

app.get("/songs/:query", async (req,res)=> {
    const {query} = req.params
    const songs = await search({query})
                        .catch(e => res.status(500).send({error: e}))
    if(songs)
        res.json({songs})
});

app.get("/song/:songId", async (req,res)=> {
    const {songId} = req.params
    const song = await getSong({songId})
                        .catch(e => res.status(500).send({error: e}))
    if(song)
        res.json({song})
});
