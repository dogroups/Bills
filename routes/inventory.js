const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const auth = require('../middleware/auth');

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/inventory
// @desc    Add new inventory item
// @access  Private (admin only)
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { name, type, price, stock } = req.body;

        // Validate input
        if (!name || !type || price === undefined || stock === undefined) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const item = new InventoryItem({
            name,
            type,
            price,
            stock
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error('Add inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { name, type, price, stock } = req.body;

        const item = await InventoryItem.findByIdAndUpdate(
            req.params.id,
            { name, type, price, stock },
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Update inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/inventory/:id/stock
// @desc    Adjust stock (increment/decrement)
// @access  Private (admin only)
router.patch('/:id/stock', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { delta } = req.body;

        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const newStock = item.stock + delta;
        if (newStock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        item.stock = newStock;
        await item.save();

        res.json(item);
    } catch (error) {
        console.error('Adjust stock error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const item = await InventoryItem.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Delete inventory error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
