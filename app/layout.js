import './globals.css';
import { Toaster } from 'react-hot-toast';
import StoreHydration from './components/StoreHydration';

export const metadata = {
  title: 'BEAUTY | Luxury Makeup E-Commerce',
  description: 'Premium luxury makeup e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <StoreHydration>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#B76E79',
                  secondary: '#fff',
                },
              },
            }}
          />
        </StoreHydration>
      </body>
    </html>
  );
}
