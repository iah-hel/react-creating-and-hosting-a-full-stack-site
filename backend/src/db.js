import { MongoClient } from 'mongodb';

//const urlDB = 'mongodb://127.0.0.1:27017';
const urlDB = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.rfxrjzt.mongodb.net/?retryWrites=true&w=majority`;
let db;

async function connectToDB(cb){
    const client = new MongoClient(urlDB);
    await client.connect();

    db = client.db('react-blog-db');
    cb();        
}

export {
    db,
    connectToDB,
};