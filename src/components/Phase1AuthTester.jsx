import React, { useState } from 'react';
import { Shield, Key, UserCheck, Lock, Unlock, AlertCircle, CheckCircle2, RefreshCw, Send } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

const PRESET_ACCOUNTS = [
  { role: 'super_admin', label: '超級管理員 (Super Admin)', email: 'admin@cms.dev', color: '#ef4444' },
  { role: 'editor', label: '內容主編 (Editor)', email: 'editor@cms.dev', color: '#f59e0b' },
  { role: 'author', label: '特約作者 (Peace Maker)', email: 'author@cms.dev', color: '#10b981' },
  { role: 'proofreader', label: '內容校對 (Proofreader)', email: 'proofreader@cms.dev', color: '#6366f1' },
];

export default function Phase1AuthTester() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState({ access: '', refresh: '' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (method, endpoint, status, message, data) => {
    setLogs((prev) => [
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        method,
        endpoint,
        status,
        message,
        data,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const handleLogin = async (email, password = 'Password123!') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setTokens({ access: data.access_token, refresh: data.refresh_token });
        addLog('POST', '/api/v1/auth/login', res.status, `登入成功：${data.user.name} (${data.user.role})`, data);
      } else {
        addLog('POST', '/api/v1/auth/login', res.status, `登入失敗：${data.detail}`, data);
      }
    } catch (err) {
      addLog('POST', '/api/v1/auth/login', 'ERR', `連線失敗 (請確認後端是否運行於 ${API_BASE})`, { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEndpoint = async (endpoint, label, options = {}) => {
    const headers = {};
    if (tokens.access && !options.noAuth) {
      headers['Authorization'] = `Bearer ${tokens.access}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers,
      });
      const data = await res.json();
      const summary = res.ok ? data.message : data.detail;
      addLog('GET', endpoint, res.status, `${label} -> ${summary}`, data);
    } catch (err) {
      addLog('GET', endpoint, 'ERR', `${label} 呼叫失敗`, { error: err.message });
    }
  };

  return (
    <section id="phase1-rbac" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Phase 1 Development</span>
          <h2 className="section-title">基礎資料層與 4 級 RBAC 權限測試</h2>
          <p className="section-subtitle">
            SQLite 資料層、Bcrypt 密碼雜湊、JWT 雙 Token 與角色的存取控制攔截演練
          </p>
        </div>

        {/* 快速角色登入切換區 */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {PRESET_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              onClick={() => handleLogin(acc.email)}
              disabled={loading}
              className="btn btn-outline"
              style={{
                borderColor: currentUser?.role === acc.role ? acc.color : 'var(--border-color)',
                background: currentUser?.role === acc.role ? 'var(--accent-light)' : 'var(--bg-card)',
                fontWeight: 600,
              }}
            >
              <UserCheck size={18} style={{ color: acc.color }} />
              <span>以 {acc.label} 登入</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem' }}>
          {/* 左側：身分狀態與測試動作 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 當前狀態卡片 */}
            <div className="stat-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={22} style={{ color: 'var(--accent)' }} />
                  <span>當前認證身分</span>
                </h3>
                {currentUser ? (
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    已登入 ({currentUser.role})
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    未登入 (訪客)
                  </span>
                )}
              </div>

              {currentUser ? (
                <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div><strong>姓名：</strong>{currentUser.name}</div>
                  <div><strong>Email：</strong>{currentUser.email}</div>
                  <div><strong>角色代碼：</strong><code>{currentUser.role}</code></div>
                  <div><strong>UUID：</strong><code>{currentUser.id}</code></div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Access Token：</strong>
                    <div style={{ wordBreak: 'break-all', fontSize: '0.78rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '8px' }}>
                      {tokens.access.slice(0, 70)}...
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  請點擊上方按鈕選擇一個預設角色快速登入，以測試對應的權限。
                </p>
              )}
            </div>

            {/* 權限測試動作面板 */}
            <div className="stat-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} style={{ color: 'var(--accent)' }} />
                <span>RBAC 權限攔截測試端點</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  className="btn btn-outline"
                  onClick={() => handleTestEndpoint('/api/v1/test/public', '公開端點測試', { noAuth: true })}
                >
                  <Unlock size={16} />
                  <span>公開端點 (Public)</span>
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => handleTestEndpoint('/api/v1/test/authenticated', '全體登入端點')}
                >
                  <UserCheck size={16} />
                  <span>已登入者 (Auth)</span>
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => handleTestEndpoint('/api/v1/test/author-access', '作者權限測試')}
                >
                  <Lock size={16} />
                  <span>作者權限 (Author)</span>
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => handleTestEndpoint('/api/v1/test/editor-access', '編輯權限測試')}
                >
                  <Shield size={16} />
                  <span>編輯權限 (Editor)</span>
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => handleTestEndpoint('/api/v1/test/admin-access', '超級管理員測試')}
                  style={{ gridColumn: 'span 2' }}
                >
                  <Lock size={16} style={{ color: '#ef4444' }} />
                  <span>超級管理員專屬 (Super Admin Only)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 右側：即時 HTTP 請求與攔截日誌 */}
          <div className="stat-card" style={{ textAlign: 'left', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>即時回應日誌 (Response Logs)</h3>
              <button
                onClick={() => setLogs([])}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
              >
                清空
              </button>
            </div>

            <div
              style={{
                flexGrow: 1,
                maxHeight: '480px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem',
              }}
            >
              {logs.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
                  尚無請求紀錄，請點擊左側按鈕執行測試
                </div>
              ) : (
                logs.map((log) => {
                  const isOk = log.status === 200 || log.status === 201;
                  const isForbidden = log.status === 403;
                  const isUnauthorized = log.status === 401;

                  let badgeColor = '#64748b';
                  if (isOk) badgeColor = '#10b981';
                  else if (isForbidden) badgeColor = '#ef4444';
                  else if (isUnauthorized) badgeColor = '#f59e0b';

                  return (
                    <div
                      key={log.id}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--accent)', marginRight: '0.5rem' }}>
                            {log.method}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{log.endpoint}</span>
                        </div>
                        <span
                          style={{
                            background: badgeColor,
                            color: '#ffffff',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                          }}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div style={{ color: isOk ? 'var(--text-secondary)' : '#ef4444', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                        {log.message}
                      </div>
                      <pre
                        style={{
                          background: 'rgba(0,0,0,0.15)',
                          padding: '0.4rem',
                          borderRadius: '6px',
                          overflowX: 'auto',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
