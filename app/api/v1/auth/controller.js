const { StatusCodes } = require('http-status-codes');
const User = require('../users/model');
const CustomAPI = require("../../../errors");
const { createTokenUser, createJWT } = require('../../../utils');

const signup = async(req, res, next)=>{
try {
    const {email, password, name, role} = req.body;

    const result = new User({email, password, name, role});

    await result.save();

    delete result._doc.password;
    res.status(StatusCodes.CREATED).json({data: result})

} catch (err) {
    next(err)
}
};

const signin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        throw new CustomAPI.BadRequestError("Please Provide Email and Password");
      }
  
      const result = await User.findOne({ email: email });
  
      if (!result) {
        throw new CustomAPI.UnauthorizedError("Invalid Credentials");
      }

      const isPasswordCorrect = await result.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new CustomAPI.UnauthorizedError('invalid Credentials')
      }

      const token = createJWT({ payload: createTokenUser(result)})

      res.status(StatusCodes.OK).json({ data: {token}});
    } catch (err) {
        next(err)
    }
};

module.exports = {signup, signin};