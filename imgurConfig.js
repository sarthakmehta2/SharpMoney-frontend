// imgurConfig.js
const axios = require('axios');

const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image.buffer.toString('base64'));

    const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data.data.link;
};

module.exports = uploadImage;
