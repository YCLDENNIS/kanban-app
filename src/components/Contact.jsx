import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate sending message
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title">保持聯繫與合作洽詢</h2>
          <p className="section-subtitle">
            有任何有趣的合作構想或技術交流？歡迎隨時填寫表單或透過 Email 聯繫我！
          </p>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-info-card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              聯絡方式
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              無論是自由接案、全職職缺或是技術分享邀請，我都很樂意與您深入交流。
            </p>

            <div className="contact-item">
              <div className="contact-icon-box">
                <Mail size={22} />
              </div>
              <div>
                <div className="contact-label">電子信箱</div>
                <a href={`mailto:${personalInfo.email}`} className="contact-val">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-box">
                <Phone size={22} />
              </div>
              <div>
                <div className="contact-label">聯絡電話</div>
                <span className="contact-val">{personalInfo.phone}</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon-box">
                <MapPin size={22} />
              </div>
              <div>
                <div className="contact-label">現居地點</div>
                <span className="contact-val">{personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="contact-form-card">
            {submitted && (
              <div className="alert-success">
                <CheckCircle size={20} />
                <span>感謝您的來信！訊息已成功送出，我將儘快與您聯繫。</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">姓名 / 稱呼</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="王大明"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">電子郵件</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">主旨</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="專案合作洽詢 / 職缺邀請"
                />
              </div>

              <div className="form-group">
                <label className="form-label">訊息內容</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="請描述您的合作需求或想聊聊的主題..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={18} />
                <span>送出訊息</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
