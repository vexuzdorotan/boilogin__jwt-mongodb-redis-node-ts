import { Document } from 'mongoose'

interface IToken {
  token: string
  _id: string
}
interface IUser extends Document {
  name: string
  email: string
  password: string
  tokens: Array<IToken>
}

interface IUserDocument extends IUser, Document {
  generateAuthToken: () => Promise<string>
}

export default IUserDocument
