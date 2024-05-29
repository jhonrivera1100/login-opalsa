import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: "dtqiwgbbp",
    api_key: "343282343578318",
    api_secret: "kVTXyfowyo6y6fRXlGXKqtBuPwA"
})


export const uploadImage = async filePath => {
    
return await cloudinary.v2.uploader.upload(filePath, {
    folder: 'Imagenes'
})

}

export const deleteImage = async (publicId) => {
    return await cloudinary.v2.uploader.destroy(publicId);
  };