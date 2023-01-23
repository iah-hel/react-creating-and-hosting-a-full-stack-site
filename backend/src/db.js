import { MongoClient } from 'mongodb';

const urlDB = 'mongodb://127.0.0.1:27017';
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