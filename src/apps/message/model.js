import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatModel = mongoose.model('Chat', chatSchema);

export default chatModel;
