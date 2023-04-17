const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoOperations = require('../../modules/databaseQuery'); // assuming the provided code is in a file called "mongoOperations.js"

describe('MongoDB operations', () => {
  let mongoServer;
  let mongoClient;
  let testCollection;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = await mongoServer.getUri();

    mongoClient = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    const dbName = 'testDatabase';
    const coll = 'testCollection';

    testCollection = await mongoOperations(mongoUri, dbName, coll);
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  test('should insert, find, and delete documents', async () => {
    const testData = { name: 'John Doe', age: 30 };

    // Insert
    const insertResult = await testCollection.insertOne(testData);
    expect(insertResult.acknowledged).toBe(true);

    // Find
    const findResult = await testCollection.find({ name: 'John Doe' }, true);
    expect(findResult.length).toBe(1);
    expect(findResult[0].name).toBe('John Doe');

    // Update
    const updateResult = await testCollection.updateOne({ name: 'John Doe' }, { $set: { age: 31 } });
    expect(updateResult.modifiedCount).toBe(1);

    // FindOne
    const findOneResult = await testCollection.findOne({ name: 'John Doe' });
    expect(findOneResult.age).toBe(31);

    // Delete
    const deleteResult = await testCollection.deleteOne({ name: 'John Doe' });
    expect(deleteResult.deletedCount).toBe(1);
  });
});
