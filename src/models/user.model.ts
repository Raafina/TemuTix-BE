import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';
import { renderMailHtml, sendMail } from '../utils/mail/mail';
import { CLIEN_HOST, EMAIL_SMTP_USER } from '../utils/env';
import { ROLES } from '../utils/contants';

export const USER_MODEL_NAME = 'User';

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: Date;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    fullName: { type: Schema.Types.String, required: true },
    username: { type: Schema.Types.String, required: true, unique: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },
    profilePicture: { type: Schema.Types.String, default: 'user.png' },
    isActive: { type: Schema.Types.Boolean, default: false },
    activationCode: { type: Schema.Types.String },
  },
  {
    timestamps: true,
  }
);

// middleware before save
UserSchema.pre('save', function (next) {
  const user = this;

  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id);

  next();
});

UserSchema.post('save', async function (doc, next) {
  try {
    const user = doc;

    console.log('user saved');

    const contentMail = await renderMailHtml('registration-success.ejs', {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationUrl: `${CLIEN_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: 'Temutix Account Activation',
      html: contentMail,
    });
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// jembatan dari controller ke database
const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema);

export default UserModel;
