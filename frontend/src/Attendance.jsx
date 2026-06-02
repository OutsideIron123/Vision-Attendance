import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function Attendance() {
  const [rtype, setRtype] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [id, setId] = useState("");
  const [rdata, setRdata] = useState([]);
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();

  const daily = async () => {
    if(!date){
      alert("Pick a Date first!");
      return;
    }
    setMsg("Loading Daily Report...")
    try {
      const response = await fetch(`http://${API_BASE_URL}/new/getdaily/?date=${date}`)
      const resu = await response.json();
      if(resu.status == "success"){
        setRdata(resu.report);
        setRtype("daily");
        setMsg("");
      } else {
        setMsg("Failed to fetch Data!");
      }
    } catch (err) {
      setMsg("Error : ", err);
    }
  };

  const monthly = async () => {
    if(!id){
      alert("Enter ID first!");
      return;
    }
    setMsg("Loading Monthly Report...")
    try {
      const response = await fetch(`http://${API_BASE_URL}/new/getmonthly/?id=${id}`)
      const resu = await response.json();
      if(resu.status == "success"){
        setRdata(resu.report);
        setRtype("monthly");
        setMsg("");
      } else {
        setMsg("Failed to fetch Data!");
      }
    } catch (err) {
      setMsg("Error : ", err);
    }
  };

  const modatt = async (record) => {
    const today = new Date().toISOString().split('T')[0];
    if (record.date > today) {
      alert("Cannot modify attendance for future dates.");
      return;
    }
    const upstat = !record.attendance;
    try {
      const response = await fetch("http://${API_BASE_URL}/new/modatt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recid: record.id,                    
          student_id: record.student__login_id,
          date: record.date,                    
          attendance: upstat
        })
      });

      const data = await response.json();
      if (data.status === "success") {
        if(rtype == "daily"){
          daily()
        } else if (rtype == "monthly") {
          monthly()
        } 
      } else {
        alert(data.message || "Failed to update attendance.");
      }
    } catch (error) {
      console.error("Network Error updating attendance:", error);
    }
  };

  return (
    <div style={styles.pageViewport}>
      <div style={styles.panelContainer}>
        <h1 style={styles.panelTitle}>Attendance Reporting Panel</h1>
        
        
        <div style={styles.reportCardSection}>
          <h3 style={styles.sectionHeader}>🧭 Option 1: Daily Report (All Students)</h3>
          <div style={styles.filterRow}>
            <div style={styles.inputWrapper}>
              <label style={styles.filterLabel}>Select Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                style={styles.dateInput}
              />
            </div>
            <button onClick={daily} style={{ ...styles.panelBtn, ...styles.btnPrimary }}>
              Get Daily Report
            </button>
          </div>
        </div>

        
        <div style={styles.reportCardSection}>
          <h3 style={styles.sectionHeader}>👤 Option 2: Current Month Report (Specific Student)</h3>
          <div style={styles.filterRow}>
            <div style={styles.inputWrapper}>
              <label style={styles.filterLabel}>Student Login ID</label>
              <input 
                type="text"  
                value={id} 
                placeholder="Enter Student ID..."
                onChange={(e) => setId(e.target.value)} 
                style={styles.textInput}
              />
            </div>
            <div style={styles.buttonButtonGroup}>
              <button onClick={monthly} style={{ ...styles.panelBtn, ...styles.btnPrimary }}>
                Get Monthly Report
              </button>
              <button onClick={() => navigate(-1)} style={{ ...styles.panelBtn, ...styles.btnBackOutline }}>
                ← Back
              </button>
            </div>
          </div>
        </div>

        {msg && (
          <div style={styles.feedbackMessageBox}>
            <span style={styles.loadingSpinnerSymbol}>⚡</span>
            <p style={styles.feedbackMessageText}>{msg}</p>
          </div>
        )}

        
        {rdata.length > 0 && (
          <div style={styles.recordsLayoutContainer}>
            <div style={styles.recordsGridHeader}>
              <span style={styles.headerLabel}>Student ID</span>
              <span style={styles.headerLabel}>Full Name</span>
              <span style={styles.headerLabel}>Target Date</span>
              <span style={{ ...styles.headerLabel, textAlign: 'right' }}>Status Toggle</span>
            </div>

            <div style={styles.recordsListStack}>
              {rdata.map((record) => {
                const isFutureDate = record.date > getTodayString();
                return (
                  <div 
                    key={`${record.student__login_id}-${record.date}`} 
                    style={isFutureDate ? { ...styles.recordSlateRow, opacity: 0.5 } : styles.recordSlateRow}
                  >
                    <div style={styles.fieldId}>{record.student__login_id}</div>
                    <div style={styles.fieldName}>{record.student__sname}</div>
                    <div style={styles.fieldDate}>{record.date}</div>
                    <div style={styles.statusActionBlock}>
                      <label style={{
                        ...styles.statusBadgeContainer,
                        ...(record.attendance ? styles.statePresent : styles.stateAbsent),
                        ...(isFutureDate ? styles.stateDisabledCursor : styles.stateInteractiveCursor)
                      }}>
                        <input
                          type="checkbox"
                          checked={record.attendance}
                          onChange={() => modatt(record)}
                          disabled={isFutureDate}
                          style={styles.hiddenNativeCheckbox}
                        />
                        <span style={styles.bulletIndicator}></span>
                        <span style={styles.statusValueText}>
                          {record.attendance ? "Present" : "Absent"}
                        </span>
                      </label>
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
    maxWidth: '850px',
    background: 'rgba(23, 28, 41, 0.55)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '40px 32px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  panelTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 10px 0',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(to right, #ffffff, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  reportCardSection: {
    background: 'rgba(15, 19, 30, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '18px',
    padding: '24px',
  },
  sectionHeader: {
    fontSize: '1.05rem',
    fontWeight: '600',
    margin: '0 0 18px 0',
    color: '#6366f1',
    letterSpacing: '-0.2px',
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '200px',
  },
  filterLabel: {
    color: '#94a3b8',
    fontSize: '0.78rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    paddingLeft: '2px',
  },
  textInput: {
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  dateInput: {
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  buttonButtonGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  panelBtn: {
    border: 'none',
    padding: '12px 22px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.92rem',
    outline: 'none',
    height: '46px',
    boxSizing: 'border-box',
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
  loadingSpinnerSymbol: {
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
    marginTop: '10px',
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
    transition: 'background 0.2s ease',
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
  statusActionBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusBadgeContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '6px 14px',
    borderRadius: '20px',
    userSelect: 'none',
    transition: 'all 0.2s ease',
  },
  stateInteractiveCursor: {
    cursor: 'pointer',
  },
  stateDisabledCursor: {
    cursor: 'not-allowed',
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
  },
};

export default Attendance;