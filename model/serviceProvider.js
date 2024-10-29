import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'

const providerSchema = new Schema({
  businessName:{type: String},
  email:{type: String, required: [true, 'pls enter ur email'], unique: true},
  telnumber:{type: String, required: [true, 'pls enter ur phone number']},
  location:{type: String},
  services:{type: Object},
  password:{type: String},
  notification:{type: Array},
});

providerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

providerSchema.statics.login = async function({email, password}){
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
    throw Error('invalid user');
}

const Provider = model('lundryProvider', providerSchema);
export default Provider;
