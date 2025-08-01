const router = require('express').Router();
const Dessert = require('../models/dessert');
const bcrypt = require('bcryptjs');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Obtener todos los postres
router.get('/desserts', verifyToken, isAdmin, async (req, res) => {
    try {
        const desserts = await Dessert.find();
        res.json(desserts);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener postres' });
    }
});

// Obtener un postre por ID
router.get('/desserts/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const dessert = await Dessert.findById(req.params.id);
        if (!dessert) return res.status(404).json({ message: 'Postre no encontrado' });
        res.json(dessert);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener postre' });
    }
});

// Crear postre
router.post('/desserts', verifyToken, isAdmin, async (req, res) => {
    try {
        const newDessert = new Dessert(req.body);
        const savedDessert = await newDessert.save();
        res.status(201).json(savedDessert);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear postre' });
    }
});

// Actualizar postre
router.put('/desserts/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedDessert = await Dessert.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDessert) return res.status(404).json({ message: 'Postre no encontrado' });
        res.json(updatedDessert);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar postre' });
    }
});

// Eliminar postre
router.delete('/desserts/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deletedDessert = await Dessert.findByIdAndDelete(req.params.id);
        if (!deletedDessert) return res.status(404).json({ message: 'Postre no encontrado' });
        res.json({ message: 'Postre eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar postre' });
    }
});

module.exports = router;