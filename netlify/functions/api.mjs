import mongoose from "mongoose";
import app from "../../app.js";

let serverPromise;
let connectionPromise;

// Run the Express app on an internal port once per function instance and reuse it.
const getServerOrigin = () => {
  serverPromise ??= new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
    server.on("error", reject);
  });
  return serverPromise;
};

// Reuse the MongoDB connection across invocations.
const connectToDatabase = () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  connectionPromise ??= mongoose.connect(process.env.MONGO_URI).catch((error) => {
    connectionPromise = undefined;
    throw error;
  });
  return connectionPromise;
};

export default async (req) => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return Response.json({ message: "Database connection failed" }, { status: 500 });
  }

  const origin = await getServerOrigin();
  const url = new URL(req.url);
  const hasBody = !["GET", "HEAD"].includes(req.method);

  const headers = new Headers(req.headers);
  headers.delete("host");

  const response = await fetch(`${origin}${url.pathname}${url.search}`, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
};

export const config = {
  path: ["/", "/api/*"],
};
