import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

const deleteOne = (model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    if (!document) {
        return next(new ApiError(`document not found for this ${id}`, 404))
    }
    res.status(200).json({ message: "success" });
});

const updateOne = (model) => asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true });

    if (!document) {
        return next(new ApiError(`Document not found for this ${req.params.id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: document });
});
const createOne = (model) => asyncHandler(async (req, res, next) => {
    const document = await model.create(req.body);
    res.status(201).json({message: "success", data: document });
});

const getOne = (model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById({ _id: id });
    if (!document) {
        return next(new ApiError(`Document not found for this ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: document });
});

const getAll = (model, modelName = '') => 
    asyncHandler(async (req, res) => {
    let filter = {};
    if(req.filterObj) { 
        filter = req.filterObj
    }
        // Build query
    const documentsCounts = await model.countDocuments();
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
        .paginate(documentsCounts)
        .filter()
        .search(modelName)
        .limitFields()
        .sort();

        // Execute query 
    const {mongooseQuery, paginationResult} = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({ message: "success", results: documents.length, paginationResult, data: documents });
});
export{
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}
