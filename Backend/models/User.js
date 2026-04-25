import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v123456789/default_profile.png",
    },
    department: {
       type: String, 
       }, 
    
    profilePicId: {
      type: String, // store Cloudinary public_id
    },

    isVerified: { type: Boolean, default: false },
    verificationToken: String,
  },
  { timestamps: true, toJSON: { virtuals: true } },
)


userSchema.virtual("interviews", {
  ref: "Interview",
  localField: "_id",
  foreignField: "userId",
});


// Hide password when sending user object as JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password
    return ret
  },
})

const User = mongoose.model("User", userSchema);
export default User;
