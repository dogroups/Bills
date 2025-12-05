const mongoose = require('mongoose');

const invoiceSequenceSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    sequence: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InvoiceSequence', invoiceSequenceSchema);
