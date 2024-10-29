import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const SeekerSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  telnumber: { type: String, required: true, unique: true},
  password: { type: String},
  address: { type: String},
  notification: { type: Array},
  createdAt: { type: Date, default: Date.now },
});


SeekerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


SeekerSchema.statics.login = async function({email, password}){
  let user = await this.findOne({email});

  console.log(user);
  console.log({email, password});


  if(user){
      if(password !== ''){
          let passCheck = await bcrypt.compare(password,user.password)
          
          if(passCheck){
              return user;
          }
              throw Error('incorrect password');
      }
          throw Error('password field is empty')
  }
  throw Error('No account with this email');
}

const Seeker = mongoose.model('lunadrySeeker', SeekerSchema);
export default Seeker;