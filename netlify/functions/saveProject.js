import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const client = new MongoClient(uri);
  try {
    const data = JSON.parse(event.body);
    await client.connect();
    const db = client.db("manodb");
    const collection = db.collection("projects");
    const result = await collection.insertOne(data);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.insertedId }),
    };
  } catch (err) {
    console.error("Error saving project:", err);
    return { statusCode: 500, body: "Error saving project" };
  } finally {
    await client.close();
  }
}
