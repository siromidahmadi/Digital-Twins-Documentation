import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;

export async function handler() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("manodb");
    const collection = db.collection("projects");
    const projects = await collection.find().toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (err) {
    console.error("Error fetching projects:", err);
    return { statusCode: 500, body: "Error fetching projects" };
  } finally {
    await client.close();
  }
}
