import './globals.css';

export const metadata = {
  title: 'R.A.P.E.L',
  description: 'Distribuidora Automotriz',
};

function Navbar() {
  return (
    <nav style={{
      background: 'black',
      color: 'white',
      padding: '20px'
    }}>
      R.A.P.E.L
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      background: '#111',
      color: 'white',
      padding: '20px',
      marginTop: '40px'
    }}>
      © 2026 R.A.P.E.L
    </footer>
  );
}

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