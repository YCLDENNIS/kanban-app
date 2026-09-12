import React from 'react';
import { skillsData } from '../data/portfolioData';
import { Layout, Server, Wrench } from 'lucide-react';

export default function Skills() {
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Layout':
        return <Layout size={24} />;
      case 'Server':
        return <Server size={24} />;
      case 'Wrench':
        return <Wrench size={24} />;
      default:
        return <Layout size={24} />;
    }
  };

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Skills & Stack</span>
          <h2 className="section-title">專業技能與技術版圖</h2>
          <p className="section-subtitle">
            持續跟進現代前端與雲端生態系，掌握高生產力工具鏈
          </p>
        </div>

        <div className="skills-grid">
          {skillsData.map((cat, idx) => (
            <div key={idx} className="skills-card">
              <div className="skills-card-header">
                <div className="skills-card-icon">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="skills-card-title">{cat.category}</h3>
              </div>

              <div>
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-item">
                    <div className="skill-meta">
                      <span>{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-progress-bg">
                      <div
                        className="skill-progress-bar"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
