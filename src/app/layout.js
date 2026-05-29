import './globals.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'R.A.P.E.L',
  description: 'Distribuidora Automotriz',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}