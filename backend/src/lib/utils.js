import jwt from 'jsonwebtoken';


export const generateToken = (userId, role,res) => {
    try {
      const token= jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      res.cookie('token',token,{
         maxAge:7*24*60*60*1000,
         httpOnly:true,
         sameSite:'strict',
        //  secure:false,
         secure:true
      });
  
      return token;
    } catch (error) {
      throw new Error('Failed to generate authentication token');
    }
  };