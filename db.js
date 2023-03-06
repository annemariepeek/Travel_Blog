require("dotenv").config({ path: path.resolve(__dirname, 'credentialsDontPost/.env') }) 
const userName = process.env.MONGO_DB_USERNAME
const password = process.env.MONGO_DB_PASSWORD
const db = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION}
const { MongoClient } = require('mongodb')
const uri = `mongodb+srv://${userName}:${password}@cluster0.tyfa3jx.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri)