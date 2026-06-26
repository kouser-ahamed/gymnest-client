import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db(process.env.DATABASE_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        defaultvalue: "member",
      },
      plan: {
        defaultvalue: "free",
      },
      status: {
        defaultvalue: "active",
      },
    },
  },

session: {
  cookieCache: {
    enabled: true,
    strategy: "jwt",
    maxAge: 60 *  24 * 30, // 30 days
  }
},

  plugins: [
    jwt()
  ]
});
