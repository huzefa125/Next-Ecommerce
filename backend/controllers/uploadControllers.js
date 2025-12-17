import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async(req,res)=>{
    try {
        const file = req.body.image;
        const upload = await cloudinary.v2.uploader.upload(file,{
            folder:"profile-images"
        });
        res.json({success:true, url:upload.secure_url});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Image upload failed"})
    }
}