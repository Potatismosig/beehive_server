const {MongoClient} = require('mongodb');

module.exports = async (url, coll, dbName) => {
  const connection = await MongoClient.connect(url);
  const database = connection.db('testDatabase');
  const collection = database.collection(coll);

  return {
    deleteOne: async (data) => {return await collection.deleteOne(data)},
    find: async (data = {}, toArray = false) => {return (toArray) ? await collection.find(data).toArray() : await collection.find(data)},
    findOne: async (data = {}) => {return await collection.findOne(data)},
    insertOne: async (data) => {return await collection.insertOne(data)},
    updateOne: async (filter, data) => {return await collection.updateOne(filter, data)},
  }
}