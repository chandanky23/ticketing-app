import mongoose from "mongoose"
import { PasswordManager } from "../services/password-manager"

interface UserProps {
  email: string
  password: string
}

interface UserModal extends mongoose.Model<UserDocument> {
  build(props: UserProps): UserDocument
}

interface UserDocument extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // This type has no relationship to typescript types, but mongo db data type
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

// Per-save hooks for password
userSchema.pre("save", async function (next) {
  let error: any
  try {
    if (this.isModified("password")) {
      const hashed = await PasswordManager.hash(this.get("password"))
      this.set("password", hashed)
    }
    return next(error)
  } catch (err: any) {
    return next(err)
  }
})

// Ading method to a schema in mongoose using 'statics'
userSchema.statics.build = (props: UserProps) => {
  return new User(props)
}

const User = mongoose.model<UserDocument, UserModal>("User", userSchema)

export { User }
