import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true, "Brand name is required"],
        unique: [true, "Brand name must be unique"],
        minLength: [2, "Too short Brand name"],
        maxLength: [32,"Too long Brand name"]
    },
    slug:{
        type: String,
        lowercase: true,
    },
    imge: String,
},
{
    timestamps: true,
}
);

export default mongoose.model("Brand", BrandSchema);
