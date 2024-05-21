
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const handleUpload = async (req, res) => {
    const images = req.files;
    const imageUrl = [];

    try {
        for (let image of images) {
            const res = await cloudinary.uploader.upload(image.path, {
                resource_type: "auto",
                upload_preset: "Product-Ecomerce",
                transformation: {
                    width: 400,
                    height: 400
                }
            });
            imageUrl.push(res.url)
        }
        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while uploading images',
            error: e.message
        });
    }

}

module.exports = handleUpload;