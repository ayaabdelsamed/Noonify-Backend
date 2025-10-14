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
    image: String,
},
{
    timestamps: true,
}
);

const setImageURL = (doc) =>{
    if(doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
}
// findOne, findAll and update
CategorySchema.post('init', (doc) => {
    setImageURL(doc);
});

// createOne
CategorySchema.post('save', (doc) => {
    setImageURL(doc);
});

export default mongoose.model("Category", CategorySchema);
