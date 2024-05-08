const { MongoClient, ObjectId  } = require("mongodb");

const url = '{YOUR_MONGODB_CONNECTION_STRING}';
const client = new MongoClient(url);

module.exports = async function (context, req) {
    try {
        await client.connect();
        const database = client.db("Chats");
        const collection = database.collection("Chat");

        // Convert the chat ID string to an ObjectId
        const id = req.query.id;

        // Delete the chat with the specified ID
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            context.res = {
                status: 200,
                body: 'Chat deleted successfully'
            };
        } else {
            context.res = {
                status: 404,
                body: 'Chat not found ' + id
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error deleting chat: ${error.message}`
        };
    } finally {
        // Close the connection
        await client.close();
    }
}
