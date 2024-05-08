const { MongoClient } = require("mongodb");

const url = '{YOUR_MONGODB_CONNECTION_STRING}';
const client = new MongoClient(url)

module.exports = async function (context, req) {
      try {
        await client.connect();
        const database = client.db("Chats")
        const collection = database.collection("Chat")

        const chatData = req.body;

        const result = await collection.insertOne(chatData);
        
        const newChat = {
            ...chatData,
            id: result.insertedId.toHexString() // Convert ObjectId to string
        };

        // Remove the _id field from the response
        delete newChat._id;

        context.res = {
            status: 200,
            body: newChat
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error storing chat: ${error.message}`,
        };
    } finally {
        await client.close();
    }
}