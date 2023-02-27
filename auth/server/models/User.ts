import mongoose from "mongoose";
import { Password } from "../helpers/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Collection is similar to a table in a RDB. (User Table)
// Document is similar to a row in a RDB table. (User Record #1)
interface UserDoc extends mongoose.Document {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // User Document, Return
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs): UserDoc => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
