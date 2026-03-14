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
    collection.createIndex({ email: 1 }, { unique: true });
    const result = await collection.insertOne(user);
    return result;
  }

  async getEmailfromID(id){
    const collection = this.db.collection("users");
    return await collection.findOne({ _id: id });
  }

  async getUserByEmail(email) {
    const collection = this.db.collection("users");
    return await collection.findOne({ email });
  }

  async dumpEmailCode(code, id){
    const collection = this.db.collection("otpdump");
    collection.createIndex({ email: 1 }, { unique: true });
    const result = await collection.insertOne({ "code-type":"email-verification","code":code,"userid":id,"timestamp": Date.now() });
    return result;
  }

  async deleteAllEmailCodes(){
    const collection = this.db.collection("otpdump");
    return await collection.deleteMany({});
  }

  async getEmailCode(id){
    const collection = this.db.collection("otpdump");
    return await collection.findOne({ "userid":id });
  }

  async deleteEmailCode(id){
    const collection = this.db.collection("otpdump");
    return await collection.deleteOne({ "userid":id });
  }
}

module.exports = { MongoDBDAO };