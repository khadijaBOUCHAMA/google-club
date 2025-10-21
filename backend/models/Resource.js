const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: false // Not required for file uploads
    },
    filePath: {
        type: String,
        required: false // For uploaded files
    },
    fileName: {
        type: String,
        required: false // Original file name
    },
    fileSize: {
        type: Number,
        required: false // File size in bytes
    },
    mimeType: {
        type: String,
        required: false // MIME type of the file
    },
    category: {
        type: String,
        enum: ['documentation', 'tool', 'tutorial', 'other'],
        default: 'other'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
