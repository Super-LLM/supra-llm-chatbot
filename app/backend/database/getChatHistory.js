const { MongoClient} = require("mongodb");

const url = '{YOUR_MONGODB_CONNECTION_STRING}';
const client = new MongoClient(url);

module.exports = async function (context, req) {
    try {
        await client.connect();
        const database = client.db("Chats");
        const collection = database.collection("Chat");

        const userId = req.query.userId; 
        const userChats = await collection.find({ userId }).toArray();

        if(userChats){
            context.res = {
                status: 200,
                body: userChats,
            }
        }else{
            context.res = {
                status: 404,
                body: 'User not found',
            };
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error retrieving chats: ${error.message} ${userId}`,
        };
    } finally {
        await client.close();
    }
}
