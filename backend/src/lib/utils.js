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
         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-origin in production
         secure: process.env.NODE_ENV === 'production' // HTTPS required for sameSite=none
      });
  
      return token;
    } catch (error) {
      throw new Error('Failed to generate authentication token');
    }
  };