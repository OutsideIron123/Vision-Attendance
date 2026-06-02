import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function Stuattendance() {
  const [date, setDate] = useState("");
  const [rdata, setRdata] = useState([]);
  const [msg, setMsg] = useState("")
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();

  const monthly = async () => {
    setMsg("Loading Monthly Report...")
    try {
      const response = await fetch(`http://${API_BASE_URL}/new/getmonthly/?id=${id}`)
      const resu = await response.json();
      if(resu.status == "success"){
        setRdata(resu.report);
        setMsg("");
      } else {
        setMsg("Failed to fetch Data!");
      }
    } catch (err) {
      setMsg("Error : ", err);
    }
  };

  return (
    <div style={styles.pageViewport}>
      <div style={styles.panelContainer}>
        
       
        <div style={styles.headerBlock}>
          <h1 style={styles.panelTitle}>Personal Attendance Log</h1>
          <p style={styles.panelSubtitle}>Track and inspect your monthly presence analytics matrix</p>
        </div>

        
        <div style={styles.controlRow}>
          <button onClick={monthly} style={{ ...styles.panelBtn, ...styles.btnPrimary }}>
            Fetch Monthly Sheet
          </button>
          <button onClick={() => navigate(-1)} style={{ ...styles.panelBtn, ...styles.btnBackOutline }}>
            ← Back to Dashboard
          </button>
        </div>

        
        {msg && (
          <div style={styles.feedbackMessageBox}>
            <span style={styles.statusPulseSymbol}>⚡</span>
            <p style={styles.feedbackMessageText}>{msg}</p>
          </div>
        )}

       
        {rdata.length > 0 && (
          <div style={styles.recordsLayoutContainer}>
            <div style={styles.recordsGridHeader}>
              <span style={styles.headerLabel}>Student ID</span>
              <span style={styles.headerLabel}>Name</span>
              <span style={styles.headerLabel}>Target Date</span>
              <span style={{ ...styles.headerLabel, textAlign: 'right' }}>Status</span>
            </div>

            <div style={styles.recordsListStack}>
              {rdata.map((record) => {
                const isFutureDate = record.date > getTodayString();
                return (
                  <div 
                    key={`${record.student__login_id}-${record.date}`} 
                    style={isFutureDate ? { ...styles.recordSlateRow, opacity: 0.45 } : styles.recordSlateRow}
                  >
                    <div style={styles.fieldId}>{record.student__login_id}</div>
                    <div style={styles.fieldName}>{record.student__sname}</div>
                    <div style={styles.fieldDate}>{record.date}</div>
                    <div style={styles.statusDisplayBlock}>
                      
                      <div style={{
                        ...styles.statusBadge,
                        ...(record.attendance ? styles.statePresent : styles.stateAbsent)
                      }}>
                        <span style={styles.bulletIndicator}></span>
                        <span style={styles.statusValueText}>
                          {record.attendance ? "Present" : "Absent"}
                        </span>
                        
                        
                        <input
                          type="checkbox"
                          checked={record.attendance}
                          onChange={() => {}}
                          disabled={isFutureDate}
                          style={styles.hiddenNativeCheckbox}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  pageViewport: {
    background: 'linear-gradient(135deg, #0b0f19 0%, #111827 100%)',
    minHeight: '100vh',
    color: '#f3f4f6',
    padding: '40px 24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
  panelContainer: {
    width: '100%',
    maxWidth: '800px',
    background: 'rgba(23, 28, 41, 0.55)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  headerBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  panelTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(to right, #ffffff, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  panelSubtitle: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    margin: 0,
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(15, 19, 30, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '16px 20px',
  },
  panelBtn: {
    border: 'none',
    padding: '12px 22px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.92rem',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  btnPrimary: {
    background: '#6366f1',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  btnBackOutline: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  feedbackMessageBox: {
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px dashed rgba(99, 102, 241, 0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statusPulseSymbol: {
    fontSize: '1rem',
    color: '#a5b4fc',
  },
  feedbackMessageText: {
    fontSize: '0.88rem',
    fontWeight: '500',
    color: '#a5b4fc',
    margin: 0,
  },
  recordsLayoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  recordsGridHeader: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.6fr 1.2fr 1fr',
    padding: '0 24px 12px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  headerLabel: {
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  recordsListStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '12px',
  },
  recordSlateRow: {
    background: 'rgba(31, 41, 55, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '14px',
    padding: '16px 24px',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.6fr 1.2fr 1fr',
    alignItems: 'center',
  },
  fieldId: { 
    fontWeight: '700', 
    color: '#ffffff', 
    fontSize: '0.95rem' 
  },
  fieldName: { 
    color: '#e2e8f0', 
    fontWeight: '500',
    fontSize: '0.95rem'
  },
  fieldDate: { 
    color: '#94a3b8', 
    fontSize: '0.9rem' 
  },
  statusDisplayBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    userSelect: 'none',
    position: 'relative',
  },
  statePresent: {
    background: 'rgba(16, 185, 129, 0.12)',
    color: '#10b981',
  },
  stateAbsent: {
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#ef4444',
  },
  bulletIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'currentColor',
  },
  statusValueText: {
    lineHeight: '1',
  },
  hiddenNativeCheckbox: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    margin: 0,
    pointerEvents: 'none',
  },
};

export default Stuattendance;