import mongoose from 'mongoose'
import { Password } from '../services/password'

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

const userSchema = new mongoose.Schema({
  email: {
    type: String, // This type has no relationship to typescript types, but mongo db data type
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// Per-save hooks for password
userSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

// Ading method to a schema in mongoose using 'statics'
userSchema.statics.build = (props: UserProps) => {
  return new User(props)
}

const User = mongoose.model<UserDocument, UserModal>('User', userSchema)

export { User }