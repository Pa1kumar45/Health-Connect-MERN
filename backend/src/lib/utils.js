import jwt from 'jsonwebtoken';


export const generateToken = (userId, role,res) => {
    try {
      const token= jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      //This cookie is sent automatically with future requests to your backend (no manual storage needed on the frontend).
      //urpose: Establishes a secure, stateless session. The token proves the user's identity without storing session data on the server.
      // It's "stateless" because the server can verify the token on each request without querying the DB every time
      
      // Dynamic cookie settings based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('token',token,{
         maxAge:7*24*60*60*1000,
         httpOnly:true,
         sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-domain (prod), 'lax' for same-domain (local)
         secure: isProduction // true in production (HTTPS), false in development (HTTP)
      });
  
      return token;
    } catch (error) {
      throw new Error('Failed to generate authentication token');
    }
  };