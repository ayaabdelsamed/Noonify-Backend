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
    image: String,
},
{
    timestamps: true,
}
);

const setImageURL = (doc) =>{
    if(doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
}
// findOne, findAll and update
BrandSchema.post('init', (doc) => {
    setImageURL(doc);
});

// createOne
BrandSchema.post('save', (doc) => {
    setImageURL(doc);
});

export default mongoose.model("Brand", BrandSchema);
