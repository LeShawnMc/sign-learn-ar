import { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface AppContainerProps {
  children: ReactNode;
}

export function AppContainer({ children }: AppContainerProps) {
  const { theme } = useTheme();
  
  const outerBg = theme === 'dark' ? '#0A0A15' : 'linear-gradient(135deg, #BFDBFE 0%, #DDD6FE 50%, #FBCFE8 100%)';
  const innerBg = theme === 'dark' ? '#0F0F23' : 'linear-gradient(135deg, #E0F2FE 0%, #EDE9FE 50%, #FCE7F3 100%)';
  
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center" 
      style={{ background: outerBg }}
    >
      <div 
        className="relative overflow-hidden shadow-2xl w-full h-full"
        style={{
          maxWidth: '430px',
          minHeight: '100vh',
          minHeight: '100dvh', // Dynamic viewport height for mobile browsers
          background: innerBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}