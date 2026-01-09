const { MongoClient } = require('mongodb');

class MongoDBDAO {
  constructor() {
    const client = new MongoClient(process.env.MONGO_URL);
    client.connect();
    this.db = client.db("farmers-market");
  }

  async createNewUser(user) {
    const collection = this.db.collection("users");
    const result = await collection.insertOne(user);
    return result;
  }
}

module.exports = { MongoDBDAO };