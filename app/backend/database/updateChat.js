const { MongoClient, ObjectId} = require("mongodb");

const url = '{YOUR_MONGODB_CONNECTION_STRING}';
const client = new MongoClient(url);

module.exports = async function (context, req) {
     try {
        await client.connect();
        const database = client.db("Chats");
        const collection = database.collection("Chat");

        const id = req.query.id; 
        const body = req.body; 

        const filter = { _id: new ObjectId(id) };
        const options = { returnOriginal: false };
        
        let update = {};
        // Check if "title" is present in the request body
        if (body.title) {
            update.$set = { title: body.title };
        } else {
            update.$push = { messages: { $each: body.messages } };
        }

        // Execute the update operation
        const result = await collection.findOneAndUpdate(filter, update, options);

        if (!result) {
            context.res = {
                status: 404,
                body: 'Chat not found',
            };
        } else {
            context.res = {
                status: 200,
                body: 'Updated successfully',
            };
        }
    } catch (error) {
         context.res = {
            status: 500,
            body: `Error updating chat: ${error.message}`,
        };
    } finally {
        // Close the connection
        await client.close();
    }
}