import { getAllMessages, saveMessage } from "./service.js";

export const chatController = (io, socket) => {
    // Listen for new messages from the client
    socket.on('chat message', async ({ userId, message }) => {  // Destructure the userId and message
        console.log(userId, message);

        try {
            // Save the message to the database
            const savedMessage = await saveMessage(userId, message);

            // Emit the saved message to all connected clients
            io.emit('chat message', savedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    // Send all previous messages to the new client when they connect
    socket.on('get messages', async () => {
        try {
            const messages = await getAllMessages();
            socket.emit('all messages', messages);  // Send messages to the connected client
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    });
};
