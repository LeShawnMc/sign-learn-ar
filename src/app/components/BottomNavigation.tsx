import { Home, BookOpen, Camera, Users, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface BottomNavigationProps {
  activeTab: 'home' | 'learn' | 'camera' | 'social' | 'profile';
  onTabChange: (tab: 'home' | 'learn' | 'camera' | 'social' | 'profile') => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { theme } = useTheme();
  
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'learn' as const, label: 'Learn', icon: BookOpen },
    { id: 'camera' as const, label: '', icon: Camera, isCenter: true },
    { id: 'social' as const, label: 'Social', icon: Users },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const colors = theme === 'dark' 
    ? {
        bg: 'var(--color-bg-elevated)',
        border: 'rgba(148, 163, 184, 0.2)',
        activeColor: 'var(--color-cyan)',
        inactiveColor: '#64748B',
        centerBg: 'linear-gradient(135deg, var(--color-cyan) 0%, #A78BFA 100%)',
        centerIcon: 'var(--color-bg-deep)',
        blur: 'none',
      }
    : {
        bg: 'rgba(255, 255, 255, 0.7)',
        border: 'rgba(255, 255, 255, 0.6)',
        activeColor: '#0EA5E9',
        inactiveColor: '#64748B',
        centerBg: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
        centerIcon: '#FFFFFF',
        blur: 'blur(20px)',
      };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 border-t safe-area-bottom"
      style={{ 
        maxWidth: '430px', 
        margin: '0 auto',
        background: colors.bg,
        borderTopColor: colors.border,
        backdropFilter: colors.blur,
        WebkitBackdropFilter: colors.blur,
        boxShadow: theme === 'light' ? '0 -4px 30px rgba(31, 38, 135, 0.1)' : 'none',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-end justify-around px-4 py-2 relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -mt-6"
                aria-label="AR Camera"
                aria-current={isActive ? 'page' : undefined}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ 
                    background: colors.centerBg,
                  }}
                >
                  <Icon className="w-8 h-8" style={{ color: colors.centerIcon }} />
                </motion.div>
              </button>
            );
          }
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center min-w-[60px] py-2"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                className="w-6 h-6 mb-1 transition-colors"
                style={{ color: isActive ? colors.activeColor : colors.inactiveColor }}
              />
              <span 
                className="text-xs transition-colors font-medium"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: isActive ? colors.activeColor : colors.inactiveColor,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}