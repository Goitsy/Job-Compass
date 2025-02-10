import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.",
      },
    },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    weeklyReminder: { type: Boolean, default: false },
    monthlyReminder: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
