import React from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, Sparkles, Terminal } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Hero() {
  const getSocialIcon = (name) => {
    switch (name) {
      case 'Github':
        return <Github size={20} />;
      case 'Linkedin':
        return <Linkedin size={20} />;
      case 'Mail':
        return <Mail size={20} />;
      case 'Twitter':
        return <Twitter size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Text Content */}
          <div>
            <div className="hero-status-pill">
              <Sparkles size={16} className="text-gradient" />
              <span>{personalInfo.status}</span>
            </div>

            <h1 className="hero-title">
              打造兼具美感與效能的 <br />
              <span className="text-gradient">數位體驗</span>
            </h1>

            <div className="hero-role">
              {personalInfo.name} · {personalInfo.title}
            </div>

            <p className="hero-description">
              {personalInfo.bioShort}
            </p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                <span>探索精選作品</span>
                <ArrowRight size={18} />
              </a>
              <a href="#contact" className="btn btn-outline">
                <Mail size={18} />
                <span>立即聯絡</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="hero-socials">
              {personalInfo.socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  title={s.name}
                  aria-label={s.name}
                >
                  {getSocialIcon(s.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Right Avatar Card */}
          <div className="hero-avatar-wrapper">
            <div className="avatar-frame">
              <div className="avatar-inner">
                <img
                  src={personalInfo.avatar || "/peacemaker.jpg"}
                  alt={personalInfo.name}
                  className="avatar-img"
                />
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="floating-badge">
              <div className="floating-badge-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  DC 和平使者
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Eagly 最強戰術搭檔
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
