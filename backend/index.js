
const axios = require('axios');
const sharp = require('sharp');
const {search,getSong} = require('./catalog.queries')
const express = require('express');
const shutterstock = require("shutterstock-api");
const cors = require('cors');

const app = express();
app.use(cors())

const PORT = 8080;

const SHUTTERSTOCK_API_TOKEN = 'QXJKWVIwUFNybFNGWU53bEVDdHVvYjVRd1ROWURyTEc6QVFRYVRvMWxKcjFHaXM4aw==';
const shutterstockApi = axios.create({ 
    baseURL: 'https://api.shutterstock.com',
    headers: { 'Authorization': `Basic ${SHUTTERSTOCK_API_TOKEN}`},
});

shutterstock.setBasicAuth(SHUTTERSTOCK_API_TOKEN);

const imagesApi = new shutterstock.ImagesApi();

const COMPRESSED_IMAGE_RES = 16;

const TEST_IMAGE_URL = "http://st.cdjapan.co.jp/pictures/s/13/48/NEOIMP-13200.jpg?v=6";

const stitch = async () => {
    // Download image
    const response = await axios({
        method: "GET",
        url: TEST_IMAGE_URL,
        responseType: "arraybuffer",
    });

    // Compress image
    const imageBuffer = await sharp(response.data)
        .resize(COMPRESSED_IMAGE_RES, COMPRESSED_IMAGE_RES)
        .raw()
        .toBuffer();


    hexColors = [];

    for (i = 0; i < imageBuffer.length; i+=3) {
        hexColors.push(`${imageBuffer[i].toString(16)}${imageBuffer[i+1].toString(16)}${imageBuffer[i+2].toString(16)}`)
    }

    console.log(hexColors);

    // For each pixel, search ShutterStock for images with color
    try {
        const response = await shutterstockApi.get('/v2/images/search', {
            params: {
                color: '00ff00',
                height_from: '128',
                height_to: '128',
                width_from: '128',
                width_to: '128',
            },
        });

        const firstResult = response.data.data[0];
        console.log(firstResult)
    } catch (error) {
        console.error(error);        
    }

    // Normalize 
}

app.listen(PORT, () => console.log(`Ready to stitch on port ${PORT}`));

app.post('/stitch', () => {
    stitch();
});

app.get("/songs/:query", async (req,res)=> {
    const {query} = req.params
    const songs = await 
    
    ({query})
                        .catch(e => res.status(500).send({error: e}))
    res.json({songs})
});

app.get("/song/:songId", async (req,res)=> {
    const {songId} = req.params
    const song = await getSong({songId})
                        .catch(e => res.status(500).send({error: e}))
    res.json({song})

});

app.get("/songs/:query", async (req,res)=> {
    const {query} = req.params
    const songs = await search({query})
                        .catch(e => res.status(500).send({error: e}))
    res.json({songs})
});

app.get("/song/:songId", async (req,res)=> {
    const {songId} = req.params
    const song = await getSong({songId})
                        .catch(e => res.status(500).send({error: e}))
    res.json({song})
});

app.get("/songs/:query", async (req,res)=> {
    const {query} = req.params
    const songs = await search({query})
                        .catch(e => res.status(500).send({error: e}))
    res.json({songs})
});

app.get("/song/:songId", async (req,res)=> {
    const {songId} = req.params
    const song = await getSong({songId})
                        .catch(e => res.status(500).send({error: e}))
    res.json({song})
});


stitch();