import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6,"Too short password"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    active: {
        type: Boolean,
        default: true,
    }
},
    { timestamps: true }
);

// No hashing for code. Admin can read it plainly and share with users.

// Hash password if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   if (!this.password) return false;
//   return bcrypt.compare(enteredPassword, this.password);
// };

export default mongoose.model("User", UserSchema);
