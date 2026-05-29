export const metadata = {
  title: 'R.A.P.E.L - Repuestos',
  description: 'Tu socio en repuestos automotrices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          
          <main style={{ flex: 1 }}>
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}