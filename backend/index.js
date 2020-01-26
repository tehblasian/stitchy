axios = require('axios');
express = require('express');
sharp = require('sharp');

const app = express();
const PORT = 8080;
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
        .toBuffer();

    console.log(imageBuffer);

    // For each pixel, search ShutterStock for images with color

    // Normalize 
}

app.listen(PORT, () => console.log(`Ready to stitch on port ${PORT}`));

app.post('/stitch', () => {
    stitch();
});

stitch();