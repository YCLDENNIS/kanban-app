import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Code2 } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Phase 1 權限測試', href: '#phase1-rbac' },
    { label: '關於我', href: '#about' },
    { label: '專業技能', href: '#skills' },
    { label: '精選作品', href: '#projects' },
    { label: '經歷歷程', href: '#experience' },
    { label: '聯絡我', href: '#contact' },
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="#" className="nav-brand">
          <div className="nav-brand-logo">
            <Code2 size={20} />
          </div>
          <span>{personalInfo.name}</span>
        </a>

        {/* Desktop Nav */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map((item, idx) => (
            <li key={idx}>
              <a
                href={item.href}
                className="nav-link"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="切換深淺模式"
            title={theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="開啟功能選單"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}
