import mongoose from "mongoose";
import productModel from "./productModel.js";

const ReviewSchema = new mongoose.Schema(
    {
    title: {
        type: String,
    },
    ratings:{
        type: Number,
        required: [true, "Review rating is required"],
        min: [1, 'Min rating value is 1.0'],
        max: [5, 'Max rating value is 5.0'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Review must be belong to user"],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Review must be belong to product"],
    },
},
{
    timestamps: true,
}
);

ReviewSchema.pre(/^find/, function (next) {
    this.populate({ path: "user", select: 'name'});
    next();
});

ReviewSchema.statics.calcAverageRatingsAndQuantity = async function(productId) {
    const result = await this.aggregate([
    // Stage 1: get all reviews in specific product
    { 
        $match: { product: productId } 
    },
    // Stage 2: Grouping reviews based on productId and calc avgRatings, ratingsQuantity
    { 
        $group: { 
            _id: 'product',
            avgRatings: { $avg: '$ratings'},
            ratingsQuantity: { $sum: 1}
        },
    },
    ]);
    console.log(result);
    if(result.length > 0){
        await productModel.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            ratingsQuantity: result[0].ratingsQuantity,
        });
    } else{
        await productModel.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

ReviewSchema.post("save", async function() {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

ReviewSchema.post("deleteOne", { document: true, query: false },async function() {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

export default mongoose.model("Review", ReviewSchema);
