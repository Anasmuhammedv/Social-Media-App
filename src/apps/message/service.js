import chatModel from './model.js'
// Save a message to the database
export const saveMessage = async (userId, message) => {
    console.log(userId,message,"hai");
    
    try {
        const chatMessage = {
            userId,
            message,
            timestamp: new Date(),
        };

        // Save to MongoDB
        const savedMessage = await chatModel.create(chatMessage);

        return savedMessage;
    } catch (error) {
        throw new Error('Error saving the message');
    }
};

// Retrieve all messages from the database
export const getAllMessages = async () => {
    try {
        const messages = await chatModel.find({}).sort({ timestamp: 1 }); // Sort by oldest to newest
        return messages;
    } catch (error) {
        throw new Error('Error fetching messages');
    }
};
