import categoryModel from "../models/categoryModel.js";


const getAllCategories = (async (req, res, next) => {
    const categories = await categoryModel.find({});
    res.status(200).json({
    message: "success",
    data: categories,
    });
});

export{
    getAllCategories
}