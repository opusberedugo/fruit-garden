const { MongoClient } = require('mongodb');

class MongoDBDAO {
  constructor() {
    if (!process.env.MONGO_URL) {
      console.error("CRITICAL: MONGO_URL is not defined in environment variables.");
      // We don't throw here to avoid immediate crash, but DB calls will fail if content isn't fixed
      return;
    }
    const client = new MongoClient(process.env.MONGO_URL);
    client.connect()
      .then(() => console.log("Connected to MongoDB successfully"))
      .catch(err => console.error("Failed to connect to MongoDB:", err));

    this.db = client.db("farmers-market");
  }

  async createNewUser(user) {
    const collection = this.db.collection("users");
    const result = await collection.insertOne(user);
    return result;
  }

  async getUserByEmail(email) {
    const collection = this.db.collection("users");
    return await collection.findOne({ email });
  }
}

module.exports = { MongoDBDAO };