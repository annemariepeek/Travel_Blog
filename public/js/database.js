import { config } from 'dotenv';
config();
console.log(process.env.DB_URI);

const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};


export async function connectToCluster(uri) {
    let mongoClient;
 
    try {
        mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        console.log('Connecting to MongoDB Atlas cluster...');
        
        console.log('Successfully connected to MongoDB Atlas!');
 
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }