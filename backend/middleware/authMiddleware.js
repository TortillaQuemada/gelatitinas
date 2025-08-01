const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar tokens JWT
 * Este middleware se utiliza para proteger rutas que requieren autenticación
 * Verifica que el token proporcionado en el header 'auth-token' sea válido
 */
const verifyToken = (req, res, next) => {
  // Obtener el token del header
  const token = req.header('auth-token');
  
  // Si no hay token, denegar el acceso
  if (!token) return res.status(401).json({ message: 'Acceso denegado. Se requiere un token.' });
  
  try {
    // Verificar el token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Si el token es válido, guardar el usuario en req.user
    req.user = verified;
    
    // Continuar con la siguiente función
    next();
  } catch (err) {
    // Si el token no es válido, denegar el acceso
    res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;