const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        default: 'Customer'
    },
    customerMobile: {
        type: String,
        default: ''
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InventoryItem',
            required: true
        },
        name: String,
        qty: Number,
        rate: Number,
        amount: Number
    }],
    subtotal: {
        type: Number,
        required: true
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    taxable: {
        type: Number,
        required: true
    },
    gstPercent: {
        type: Number,
        default: 0
    },
    gstAmount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster date-based queries
saleSchema.index({ invoiceDate: 1 });
saleSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Sale', saleSchema);
