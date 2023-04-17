const {MongoClient} = require('mongodb');
require('dotenv').config();
const uri = process.env.URL;

async function main(){
  const client = new MongoClient(uri);

  //index for post collection that make likes.user_id unique
  try {
    await client.connect();
    const db = client.db("BeeHive");
    const postsCollection = db.collection("posts");
    
    const res = await postsCollection.createIndex(
      { "_id": 1, "likes.user_id": 1 }, { unique: true, partialFilterExpression: { "likes.user_id": { $exists: true } } }
    );
    
    console.log(res);
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await client.close();
  }

  //index for users collection to make username and followers.username unique
  try {
    await client.connect();

    const db = client.db('BeeHive');
    const usersCollection = db.collection('users');

    // Create a unique index on the 'username' field
    const res = await usersCollection.createIndex({ username: 1 }, { unique: true });

    // Create a compound unique index on the 'username' field and the 'followers.username' field
    const res1 = await usersCollection.createIndex(
      { username: 1, 'followers.username': 1 },
      {
        unique: true,
        partialFilterExpression: {
          'followers.username': { $exists: true },
        },
      }
    );

    console.log(res, res1);
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
  }
}


main();
