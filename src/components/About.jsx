import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { CheckCircle2, Heart, Award, Zap } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: <Award size={22} className="text-gradient" />,
      title: "專注工程品質與擴展性",
      desc: "遵循代碼規範與模組化架構，注重測試覆蓋率與後續可維護性。"
    },
    {
      icon: <Zap size={22} className="text-gradient" />,
      title: "極致頁面加載速度與流暢體驗",
      desc: "深諳 Web 核心指標 (Core Web Vitals)，追求首屏秒開與絲滑動畫。"
    },
    {
      icon: <Heart size={22} className="text-gradient" />,
      title: "重視團隊協同與開放溝通",
      desc: "善於跨職能溝通，與產品經理、UI/UX 設計師高效推進專案成果。"
    }
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About Me</span>
          <h2 className="section-title">熱愛技術，更熱愛創造價值</h2>
          <p className="section-subtitle">
            融合工程嚴謹性與現代設計美學的軟體開發歷程
          </p>
        </div>

        <div className="about-grid">
          {/* Detailed Paragraphs */}
          <div>
            {personalInfo.bioDetailed.map((p, idx) => (
              <p key={idx} className="about-text-p">
                {p}
              </p>
            ))}

            <div className="about-features-list">
              {highlights.map((h, idx) => (
                <div key={idx} className="about-feature-item">
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>{h.icon}</div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                      {h.title}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {h.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div>
            <div className="stats-grid" style={{ marginTop: 0, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {personalInfo.stats.map((st, idx) => (
                <div key={idx} className="stat-card">
                  <div className="stat-value">{st.value}</div>
                  <div className="stat-label">
                    {st.label} {st.unit && `(${st.unit})`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
