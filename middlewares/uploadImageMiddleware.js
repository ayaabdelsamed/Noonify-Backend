// eslint-disable-next-line import/no-extraneous-dependencies
import multer from "multer";
import ApiError from "../utils/apiError.js";

const multerOptions = () => {
    const multerStorage = multer.memoryStorage()
    const multerFilter = function (req, file, cb) {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    }else {
        cb(new ApiError("Onle Images allowed",400), false);
    }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
return upload;
}
const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

const uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);

export{
    uploadSingleImage,
    uploadMixOfImages
}