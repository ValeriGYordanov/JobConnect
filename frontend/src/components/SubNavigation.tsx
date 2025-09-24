import { useState } from 'react';

type TabType = 'home' | 'job-offerings' | 'users' | 'placeholder';

interface SubNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SubNavigation({ activeTab, onTabChange }: SubNavigationProps) {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: '🏠' },
    { id: 'job-offerings' as TabType, label: 'Job Offerings', icon: '💼' },
    { id: 'users' as TabType, label: 'Users', icon: '👥' },
    { id: 'placeholder' as TabType, label: 'More', icon: '🔧' },
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: '80px', // Below the main header
      zIndex: 40
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
        <nav style={{ display: 'flex', gap: '0.5rem', padding: '1rem 0' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '600',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'rgba(59, 130, 246, 0.1)';
                  target.style.color = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = 'transparent';
                  target.style.color = '#6b7280';
                }
              }}
            >
              <span style={{ fontSize: '1rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
