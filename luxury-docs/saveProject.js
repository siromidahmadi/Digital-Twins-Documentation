// saveProject.js
import { MongoClient } from "mongodb";

// Use environment variable for connection string; fallback is a clear placeholder.
const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/";
const client = new MongoClient(uri, { useUnifiedTopology: true });

export async function saveProject(data) {
  try {
    await client.connect();
    const db = client.db("luxury_projects");
    const collection = db.collection("project_entries");
    const result = await collection.insertOne({ ...data, createdAt: new Date() });
    console.log("✅ Project saved with ID:", result.insertedId);
    return result.insertedId;
  } catch (err) {
    console.error("❌ Error saving project:", err);
    throw err;
  } finally {
    await client.close();
  }
}
