const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'], // you can specify an error message by passing it in array.
    unique: true,   // You cannot specify error on this property. It will be handled differently!!!
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']  // You can validate any property. I've used a 3rd party dependency.
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Minimum password length is 6 characters!']
  }
});


// Fire a function after doc saved to db ---- Mongoose Hooks
// We have to call next() method. Otherwise we will not get any response. The process will hanged, Though user will be
// saved.
// userSchema.post('save', function(doc, next){
//   console.log('User saved ', doc);  
//   next();        
// });

// Fire a function before doc saved to db
// We are not using arrow function because we need the instance of the user
// Which we get using 'this' keyword, which we can't using arrow function.
userSchema.pre('save', async function(next) {  
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  //console.log('User about to get saved',this); 
  
  next();
})

// static method to login. 'this' keyword here reference to the User model.
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
 
  if(!user) throw Error('Email does not exit');
  const auth = await bcrypt.compare(password, user.password);
  if(!auth) throw Error('Incorrect Password!');
  return user;
}


const User = mongoose.model('user', userSchema);
module.exports = User;