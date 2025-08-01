const router = require('express').Router();
const verifyToken = require('../middleware/authMiddleware');

/**
 * Ruta protegida que requiere autenticación
 * Esta ruta solo es accesible si se proporciona un token JWT válido
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // req.user contiene la información del usuario que se incluyó en el token
    // En este caso, id y username
    res.json({
      message: 'Datos protegidos accesibles',
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Exportar el router
module.exports = router; 