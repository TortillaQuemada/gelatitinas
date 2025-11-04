const router = require("express").Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importamos el módulo jsonwebtoken para generar tokens

// Registro
// Ruta para manejar el registro de usuarios
router.post("/register", async (req, res) => {
  try {
    // Validar que los campos no estén vacíos
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json("Por favor, complete todos los campos.");
    }
    // Validar que el email sea válido
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
      return res.status(400).json("Por favor, ingrese un email válido.");
    }
    // Validar que la contraseña cumpla con los requisitos
    if (req.body.password.length < 8) {
      return res.status(400).json("La contraseña debe tener al menos 8 caracteres.");
    }
    // Validar que el nombre de usuario no esté en uso
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json("El nombre de usuario ya está en uso.");
    }
    // Encriptar la contraseña
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    // Crear un nuevo usuario
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      role: req.body.role && req.body.role === "user" ? "user" : "admin" // Permite asignar admin solo si se envía explícitamente
    });
    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, role: savedUser.role }, // Incluye el rol en el token
      process.env.JWT_SECRET, // Clave secreta para firmar el token (definida en .env)
      { expiresIn: "1h" } // Opciones: el token expira en 1 hora
    );
    
    // Responder con el token y un mensaje de éxito
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token: token,
      userId: savedUser._id
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
// Ruta para manejar el inicio de sesión de usuarios
router.post("/login", async (req, res) => {
  try {
    // Validar que los campos no estén vacíos
    if (!req.body.email || !req.body.password) {
      return res.status(400).json("Por favor, complete todos los campos.");
    }

    // Buscar el usuario en la base de datos por correo
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("Correo no registrado");

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json("Contraseña incorrecta");

    // Si las credenciales son correctas, generar un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Responder con el token y datos del usuario
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: token,
      userId: user._id,
      email: user.email,
      username: user.username // puedes incluir otros datos si quieres
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
