import NextAuth, { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "../../models/users.model"
import connectDb from '../../config/db'
import bcrypt from "bcrypt"


type Credentials={
  username:string,
  password:string,
}

export const authOptions:NextAuthConfig = {
  trustHost: true,
  providers: [
    CredentialsProvider({

      name: "Credentials",

      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
   
        await connectDb()
        const {username,password} = credentials as Credentials
        const user = await User.findOne({name:username})
        if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password)
          if(passwordMatch){
            return user
          }
          else{
            return false
          }
        }
        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  // Optional: Add custom pages
  pages: {
    signIn: '/auth/signin',
  },
  // Optional: Add callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      return session
    }
  }
}

export const {handlers,auth,signIn,signOut,unstable_update} =  NextAuth(authOptions)