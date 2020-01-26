
const axios = require('axios');
const sharp = require('sharp');
const {search,getSong} = require('./catalog.queries')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const lyricsApi = require('node-lyrics');

// SETUP EXPRESS
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

const PORT = 8080;

// SETUP SHUTTERSTOCK API
const SHUTTERSTOCK_API_TOKEN = 'QXJKWVIwUFNybFNGWU53bEVDdHVvYjVRd1ROWURyTEc6QVFRYVRvMWxKcjFHaXM4aw==';
const shutterstockApi = axios.create({ 
    baseURL: 'https://api.shutterstock.com',
    headers: { 'Authorization': `Basic ${SHUTTERSTOCK_API_TOKEN}`},
});

const COMPRESSED_IMAGE_RES = 16;

/**
 * Compresses the source image
 * @return stock images corresponding to each pixel in the compressed image
 */
const split = async (inputImageBuffer) => {
    // Compress image
    const imageBuffer = await sharp(inputImageBuffer)
        .resize(COMPRESSED_IMAGE_RES, COMPRESSED_IMAGE_RES)
        .raw()
        .toBuffer();

    // Convert to hex array
    let hexColors = [];
    for (i = 0; i < imageBuffer.length; i+=3) {
        hexColors.push(`${imageBuffer[i].toString(16)}${imageBuffer[i+1].toString(16)}${imageBuffer[i+2].toString(16)}`)
    }

    const requests = hexColors.map(hexColor => shutterstockApi.get('/v2/images/search', {
        params: {
            color: hexColor,
            per_page: 1,
        },
    }));
    
    const results = await Promise.all(requests);
    const data = results.map(({ data }) => data.data[0]);
    
    return data;
}

app.listen(PORT, () => console.log(`Ready to split on port ${PORT}`));

app.post('/split', async (req, res) => {
    const { artistName, songTitle, albumCoverUrl } = req.body;
    
    // Get lyrics for song
    // const lyrics = await getLyrics({ ...geniusApiOptions, title: songTitle, artist: artistName });

    // Fetch album cover image from url
    const response = await axios({
        method: 'GET',
        url: albumCoverUrl,
        responseType: 'arraybuffer',
    });
    const results = await split(response.data);
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

const test = async () => {
    const result = await lyricsApi.getSong('Drake', 'One Dance')
    console.log(result);
}

test();
