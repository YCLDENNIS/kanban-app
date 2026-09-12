import React, { useState } from 'react';
import { projectsData } from '../data/portfolioData';
import { ExternalLink, Github, Sparkles } from 'lucide-react';

export default function Projects() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'featured'
    ? projectsData.filter((p) => p.featured)
    : projectsData;

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">精選專案展示</h2>
          <p className="section-subtitle">
            每一個作品都經過深思熟慮的架構設計與細節打磨
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              onClick={() => setFilter('all')}
            >
              全部專案 ({projectsData.length})
            </button>
            <button
              className={`btn ${filter === 'featured' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              onClick={() => setFilter('featured')}
            >
              <Sparkles size={16} />
              精選專案
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-img-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-img"
                  loading="lazy"
                />
                {project.featured && (
                  <span className="project-badge">Featured</span>
                )}
              </div>

              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="project-tag">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-btn"
                  >
                    <span>即時預覽</span>
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-btn"
                  >
                    <Github size={16} />
                    <span>原始碼</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
