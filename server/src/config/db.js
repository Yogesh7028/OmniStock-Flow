const mongoose = require("mongoose");
const dns = require("dns");

const configureMongoDns = (mongoUri) => {
  if (!mongoUri.startsWith("mongodb+srv://") || !process.env.MONGODB_DNS_SERVERS) return;

  dns.setServers(
    process.env.MONGODB_DNS_SERVERS.split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  );
};

const connectWithTimeout = (mongoUri, options) => {
  const timeoutMs = Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 20000);

  return Promise.race([
    mongoose.connect(mongoUri, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("MongoDB connection timed out")), timeoutMs)
    ),
  ]);
};

const verifyMongoSrvDns = async (mongoUri) => {
  if (!mongoUri.startsWith("mongodb+srv://")) return;

  const hostname = new URL(mongoUri).hostname;
  const lookupTimeoutMs = Number(process.env.MONGO_SRV_LOOKUP_TIMEOUT_MS || 5000);

  await Promise.race([
    dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`MongoDB Atlas SRV DNS lookup timed out for ${hostname}`)),
        lookupTimeoutMs
      )
    ),
  ]);
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/omnistock-flow";
  configureMongoDns(mongoUri);

  try {
    await verifyMongoSrvDns(mongoUri);
    const conn = await connectWithTimeout(mongoUri, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (
      mongoUri.startsWith("mongodb+srv://") &&
      (error.syscall === "querySrv" || error.message.includes("SRV DNS lookup"))
    ) {
      throw new Error(
        "MongoDB Atlas SRV DNS lookup failed. Check your internet/DNS settings, Atlas network access IP allowlist, or use Atlas' standard mongodb:// connection string."
      );
    }

    if (mongoUri.startsWith("mongodb+srv://") && error.message === "MongoDB connection timed out") {
      throw new Error(
        "MongoDB Atlas connection timed out. Your DNS/network cannot currently resolve Atlas from this machine; deploy on Render/Vercel or use Atlas' standard mongodb:// connection string."
      );
    }

    throw error;
  }
};

module.exports = connectDB;
