import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {

                    if(user.id) {
                    await initializeUserBoard(user.id)
                }
                }
            }
        }
    }
})

export async function getSession() {
    const res = await auth.api.getSession({
        headers: await headers()
    })

    return res
}

export async function logout() {
  const res = await auth.api.signOut({
    headers: await headers(),
  });

  if (res.success) {
    redirect("/login");
  }
}