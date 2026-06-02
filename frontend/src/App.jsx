import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function Uid({ value, onChange }){
  return (
    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>ID</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter your identification ID"
        style={styles.textInput}
      />
    </div>
  )
}


function Pass({ value, onChange }){
  return (
    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>Password</label>
      <input
        type="password"
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        style={styles.textInput}
      />
    </div>
  )
}

function App() {
  const [id, setId] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState(null)

  const navigate = useNavigate();
  const signin = async () => {
    setErr(null);
    if (id && pass){
      try {
        const response = await fetch("${API_BASE_URL}/attendance/signin/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "id" : id,
            "pass": pass 
          })
        })

        const res = await response.json();
        if (res.status == "success" && res.isstaff){
          navigate("/StaffHome", {state : {id : id}});
        } else if (res.status == "success" && !res.isstaff){
          navigate("/StuHome", { state : {id : id}});
        } else {
          setErr("Failed to Authenticate User!");
        }
      } catch (err) {
        console.log(err)
        setErr("Server connection error. Please try again.");
      }
    } else {
      setErr("Enter ID and Password to Proceed!")
    }
  }

  return (
    <div style={styles.pageViewport}>
      <div style={styles.glassAuthCard}>
        <div style={styles.brandHeader}>
          <h2 style={styles.brandHeading}>Welcome Back</h2>
          <p style={styles.brandSubtitle}>Sign in to access your tracking workspace portal</p>
        </div>

        <div style={styles.formContainer}>
          <Uid value={id} onChange={(e) => setId(e.target.value)}/>
          <Pass value={pass} onChange={(e) => setPass(e.target.value)}/>
          
          <div style={styles.actionWrapper}>
            <button style={styles.primaryActionButton} onClick={signin}>
              Sign In
            </button>
          </div>
        </div>

        
        {err && (
          <div style={styles.errorAlertContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <p style={styles.errorAlertText}>{err}</p>
          </div>
        )}
      </div>
    </div>
  )
};


const styles = {
  pageViewport: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
  glassAuthCard: {
    background: 'rgba(30, 41, 59, 0.65)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    transform: 'translateY(0px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  brandHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  brandHeading: {
    fontSize: '1.85rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    margin: 0,
    background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandSubtitle: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: '1.4',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    paddingLeft: '2px',
  },
  textInput: {
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    padding: '14px 16px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  actionWrapper: {
    marginTop: '8px',
  },
  primaryActionButton: {
    width: '100%',
    background: '#6366f1',
    color: '#ffffff',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
  },
  errorAlertContainer: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    fontSize: '1rem',
  },
  errorAlertText: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#fca5a5',
    margin: 0,
    lineHeight: '1.4',
  },
};

export default App;