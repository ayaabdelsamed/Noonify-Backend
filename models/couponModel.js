import mongoose from "mongoose";


const CouponSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: [true, 'Coupon name required'],
        unique: true,
    },
    expire: {
        type: Date,
        required: [true, 'Coupon expire time required'],
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount value required'],
    },
},{timestamps: true , versionKey: false})

export default mongoose.model('Coupon', CouponSchema);