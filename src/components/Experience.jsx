import React from 'react';
import { experienceData } from '../data/portfolioData';
import { Briefcase, CheckCircle2, MapPin } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Journey & Milestones</span>
          <h2 className="section-title">經歷與職涯歷程</h2>
          <p className="section-subtitle">
            回顧成長軌跡，每一次的挑戰都是能力躍升的基石
          </p>
        </div>

        <div className="timeline">
          {experienceData.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-dot" />

              <div className="timeline-card">
                <div className="timeline-header">
                  <h3 className="timeline-role">{item.role}</h3>
                  <span className="timeline-period">{item.period}</span>
                </div>

                <div className="timeline-company">
                  <span>{item.company}</span> · <span style={{ color: 'var(--text-muted)' }}>{item.location}</span>
                </div>

                <p className="timeline-desc">{item.description}</p>

                <div className="timeline-highlights">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="timeline-highlight-item">
                      <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
