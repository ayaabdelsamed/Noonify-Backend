import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
    name: {
        type: String,
        unique: [true, "Category name must be unique"],
        trim: true,
        required: [true, "Category name is required"],
        minLength: [2, "Too short category name"],
        maxLength: [32,"Too long category name"]
    },
    slug:{
        type: String,
        lowercase: true,
    },
    imge: String,
    // imageCover: {
    //     type: String,
    //     required: [true, "Category cover image is required"],
    // },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
},
{
    timestamps: true,
}
);

export default mongoose.model("Category", CategorySchema);
