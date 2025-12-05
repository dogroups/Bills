const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const InventoryItem = require('../models/InventoryItem');
const InvoiceSequence = require('../models/InvoiceSequence');
const auth = require('../middleware/auth');

// @route   GET /api/sales
// @desc    Get all sales (with optional date filter)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { date, startDate, endDate } = req.query;
        let query = {};

        if (date) {
            // Filter by specific date
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.invoiceDate = { $gte: start, $lte: end };
        } else if (startDate && endDate) {
            // Filter by date range
            query.invoiceDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const sales = await Sale.find(query).sort({ timestamp: -1 });
        res.json(sales);
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/sales
// @desc    Create new sale and update inventory
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            customerName,
            customerMobile,
            items,
            subtotal,
            discountPercent,
            discountAmount,
            taxable,
            gstPercent,
            gstAmount,
            grandTotal
        } = req.body;

        // Validate input
        if (!invoiceNumber || !items || items.length === 0) {
            return res.status(400).json({ message: 'Please provide invoice number and items' });
        }

        // Check if invoice number already exists
        const existingSale = await Sale.findOne({ invoiceNumber });
        if (existingSale) {
            return res.status(400).json({ message: 'Invoice number already exists' });
        }

        // Update inventory stock for each item
        for (const item of items) {
            const inventoryItem = await InventoryItem.findById(item.itemId);
            if (!inventoryItem) {
                return res.status(404).json({ message: `Item ${item.name} not found` });
            }

            if (inventoryItem.stock < item.qty) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${inventoryItem.stock}`
                });
            }

            inventoryItem.stock -= item.qty;
            await inventoryItem.save();
        }

        // Create sale record
        const sale = new Sale({
            invoiceNumber,
            invoiceDate: invoiceDate || new Date(),
            customerName: customerName || 'Customer',
            customerMobile: customerMobile || '',
            items,
            subtotal,
            discountPercent: discountPercent || 0,
            discountAmount: discountAmount || 0,
            taxable,
            gstPercent: gstPercent || 0,
            gstAmount: gstAmount || 0,
            grandTotal,
            user: req.user.username
        });

        await sale.save();
        res.status(201).json(sale);
    } catch (error) {
        console.error('Create sale error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/sales/invoice-number
// @desc    Get next invoice number for the year
// @access  Private
router.get('/invoice-number', auth, async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        let sequence = await InvoiceSequence.findOne({ year: currentYear });

        if (!sequence) {
            sequence = new InvoiceSequence({ year: currentYear, sequence: 0 });
            await sequence.save();
        }

        const nextSeq = sequence.sequence + 1;
        const invoiceNumber = `INV-${currentYear}-${String(nextSeq).padStart(3, '0')}`;

        res.json({ invoiceNumber, sequence: nextSeq });
    } catch (error) {
        console.error('Get invoice number error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/sales/increment-invoice
// @desc    Increment invoice sequence after successful sale
// @access  Private
router.post('/increment-invoice', auth, async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        let sequence = await InvoiceSequence.findOne({ year: currentYear });

        if (!sequence) {
            sequence = new InvoiceSequence({ year: currentYear, sequence: 1 });
        } else {
            sequence.sequence += 1;
        }

        await sequence.save();
        res.json({ sequence: sequence.sequence });
    } catch (error) {
        console.error('Increment invoice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/sales/summary
// @desc    Get sales summary (total sales, items sold, etc.)
// @access  Private
router.get('/summary', auth, async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.invoiceDate = { $gte: start, $lte: end };
        }

        const sales = await Sale.find(query);

        const summary = {
            totalSales: sales.length,
            totalRevenue: sales.reduce((sum, sale) => sum + sale.grandTotal, 0),
            totalItems: sales.reduce((sum, sale) =>
                sum + sale.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
            )
        };

        res.json(summary);
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
