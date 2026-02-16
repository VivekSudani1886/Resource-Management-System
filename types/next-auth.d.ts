import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "admin" | "user" | "approver" | "maintenance"
            birthdate?: string | Date | null
        } & DefaultSession["user"]
    }

    interface User {
        role: "admin" | "user" | "approver" | "maintenance"
        birthdate?: string | Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: "admin" | "user" | "approver" | "maintenance"
        birthdate?: string | Date | null
    }
}
