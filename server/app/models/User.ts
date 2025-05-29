import { Schema, model} from 'mongoose';
import {  User  } from "../interfaces/user";
import { v4 as uuidv4 } from 'uuid';



const userSchema = new Schema<User> ({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true },
  userId: {type: String, required: true, default: uuidv4},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
    phone: {type: String},
    company: {type: String},
    jobtitle: {type: String},
    description: {type: String},
    createdAt: {type: Date, timestamps: true },
    updatedAt: {type: Date, timestamps: true },
});


export const UserModel = model<User>('User', userSchema)


