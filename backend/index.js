
const axios = require('axios');
const sharp = require('sharp');
const {search,getSong} = require('./catalog.queries')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const lyricsApi = require('node-lyrics');
const stopwords = require('stopword');

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

const COMPRESSED_IMAGE_RES = 16;


const toHex = (number) => number.toString(16).padStart(2, '0');

/**
 * Compresses the source image
 * @return stock images corresponding to each pixel in the compressed image
 */
const split = async (inputImageBuffer, lyrics) => {
    // Compress image
    const imageBuffer = await sharp(inputImageBuffer)
        .resize(COMPRESSED_IMAGE_RES, COMPRESSED_IMAGE_RES)
        .raw()
        .toBuffer();

    // Convert to hex array
    let hexColors = [];
    for (i = 0; i < imageBuffer.length; i+=3) {
        let r = imageBuffer[i];
        let g = imageBuffer[i+1];
        let b = imageBuffer[i+2];

        if (Math.abs(r-b) < RGB_THRESHOLD &&
            Math.abs(r-g) < RGB_THRESHOLD &&
            Math.abs(g-b) < RGB_THRESHOLD) {

                if (r < 110) {
                    hexColors.push('black');
                } else {
                    hexColors.push('white');
                }
                continue;
        }

        hexColors.push(`${toHex(r)}${toHex(g)}${toHex(b)}`)
    }

    // let out = '';
    // for (let i = 0; i < COMPRESSED_IMAGE_RES; i++) {
    //     for (let j = 0; j < COMPRESSED_IMAGE_RES; j++) {
    //         out += hexColors[i*COMPRESSED_IMAGE_RES + j] + " ";
    //     }
    //     out += "\n";
    // }

    // console.log(out);
    // return;
    // const requests = hexColors.map(hexColor => shutterstockApi.get('/v2/images/search', {
    //     params: {
    //         query: 'art',
    //         color: hexColor,
    //         per_page: 1,
    //     },
    // }));
    
    const numLyrics = lyrics.length;
    const requests = hexColors.map((hexColor, index) => {
        const bw = (hexColor == 'white' || hexColor == 'black');

        return shutterstockApi.get('/v2/images/search', {
            params: {
                query: `${lyrics[index % numLyrics]} ${bw ? hexColor : ''}`,
                color: hexColor,
                per_page: 1,
            },
        });   
    });

    const results = await Promise.all(requests);
    const data = results.map(({ data }) => data.data[0]);
    
    return data;
}

app.listen(PORT, () => console.log(`Ready to split on port ${PORT}`));

app.post('/split', async (req, res) => {
    const { artistName, songTitle, albumCoverUrl } = req.body;
    
    // Get lyrics for song
    const songLyrics = await lyricsApi.parseLyrics(artistName, songTitle);
    const lyrics = stopwords
        .removeStopwords(songLyrics.lyrics.replace(/[^a-zA-Z]/g, ' ')
        .split(' '))
        .filter(char => char !== '' && char.length > 2);

    // Fetch album cover image from url
    const response = await axios({
        method: 'GET',
        url: albumCoverUrl,
        responseType: 'arraybuffer',
    });

    const results = await split(response.data, lyrics);
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
