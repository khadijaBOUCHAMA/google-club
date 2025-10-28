const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const IdeaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Idea', IdeaSchema);
