import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          © {new Date().getFullYear()} {personalInfo.name}. 保留所有權利。
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Crafted with</span>
          <Heart size={16} style={{ color: '#ef4444', fill: '#ef4444' }} />
          <span>using React & Vite</span>
        </div>

        <button
          onClick={scrollToTop}
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          title="回到頂部"
        >
          <ArrowUp size={16} />
          <span>TOP</span>
        </button>
      </div>
    </footer>
  );
}
