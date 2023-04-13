require('dotenv').config();
const url = process.env.URL;
const {MongoClient} = require('mongodb');

exports.databaseQuery = async function databaseQuery(coll, type, data, toArray){

    const connection = await MongoClient.connect(url);

    const database = connection.db('mongodb');

    const collection = database.collection(coll);

    if(toArray){
        const documents = await collection[type](data).toArray();
        return await documents;
    }
    
    const documents = await collection[type](data);
    return await documents;
} 