import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true, index: true },

  

  password: { type: String, required: true },

  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },

  avatar: { type: String },

  seller: {
    shopName: { type: String },
    bio: { type: String },
  }
}, { timestamps: true });


//  Hash password BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//  Correct password matcher (THIS MUST EXIST)
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
