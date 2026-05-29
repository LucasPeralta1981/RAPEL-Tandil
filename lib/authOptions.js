import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './db';
import User from '../models/Users';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error('Usuario no encontrado');
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error('Contraseña incorrecta');

        return { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.company = token.company;
      }
      return session;
    }
  },
  pages: { signIn: '/' }
};
