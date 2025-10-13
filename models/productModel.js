import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "too short product title"],
        maxLength: [200, "too long product title"],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [20, "Too short product description"],
    },
    quantity:{
        type: Number,
        required: [true, "Product quantity is required"],

    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        trim: true,
        min: 0,
    },
    priceAfterDiscount: {
        type: Number,
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product must be belong to category"],
    },
    subCategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        },
    ],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
    },
    ratingsAverage: {
        type: Number,
        min: [1,"Rating must be above or equal 1.0"],
        max: [5,"Rating must be below or equal 5.0"]
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    }
},
    { timestamps: true }
);


export default mongoose.model("Product", ProductSchema);
