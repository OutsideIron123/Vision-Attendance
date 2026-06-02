import React, { useCallback, useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Styled User Identifier Component 
function Uid({ value, onChange }){
  return (
    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>ID</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter Alphanumeric ID"
        style={styles.textInput}
      />
    </div>
  )
}

// Styled Password Component
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

// Styled Toggle State Component
function Staffornot({ label, checked, onToggle }){
  return (
    <label style={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
        style={styles.checkboxInput}
      />
      <span style={styles.checkboxText}>{label}</span>
    </label>
  )
}

// Styled Name Component
function Name({ value, onChange }){
  return (
    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>Name</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter Full Name"
        style={styles.textInput}
      />
    </div>
  )
}

function StaffHome() {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [stornot, setStornot] = useState(false)
  const [res, setRes] = useState("");
  const [dis, setDis] = useState(false);
  const [staffdata, setStaffdata] = useState([])
  const [errmsg, setErrmsg] = useState("")
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const trainmodel = async () => {
          const response = await fetch("http://${API_BASE_URL}/new/train/");
          const resu = await response.json();
          console.log(resu.status)
  }
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a CSV file first.');
      return;
    }

    setLoading(true);
    setUploadStatus('Processing file...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://${API_BASE_URL}/new/reccsv/', {
        method: 'POST',
        body: formData,
      });

      const res = await response.json();
      if (res.status === 'success') {
        setUploadStatus(res.message);
        setFile(null);
      } else {
        setUploadStatus(`Upload Failed: ${res.message || res.error}`);
      }
    } catch (err) {
      setUploadStatus(`Network Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const bclck = () => {
    setDis(true);
  }

  const setIsStaff = (checkedValue) => {
    setStornot(checkedValue);
  }

  const subdet = async () => {
    const response = await fetch("http://${API_BASE_URL}/new/reguser/", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            "uid" : uid,
            "name": name,
            "pass": pass,
            "stfornot" : stornot
        })
    })
    const resu = await response.json()
    console.log(resu.status); 
  };

  
  const StaffTable = ({ data }) => {
    return (
      <div style={styles.tableReplacementContainer}>
        {data.map((item) => (
          <div key={item.login_id || item.id} style={styles.staffProfileCard}>
            <div style={styles.cardInfoGroup}>
              <span style={styles.cardMetaLabel}>Staff Member ID</span>
              <span style={styles.cardValueText}>{item.login_id || item.id}</span>
            </div>
            <div style={styles.cardInfoGroupRight}>
              <span style={styles.cardMetaLabel}>Authorized Name</span>
              <span style={styles.cardValueText}>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!id) {
        setErrmsg("No ID provided! Please Login Again!")
    }
    const fetchdetails = async () => {
        try {    
            const response = await fetch(`http://${API_BASE_URL}/new/getstaff/?id=${id}`);
            const res = await response.json();
            if (res.status == "success") {
              setStaffdata(res.staffdetails)
            } else {
              setErrmsg("Record Retrieval Failure!")
            }
        } catch (err) {
            setErrmsg("Record Retrieval Failure : " + err)
        }
    }
    fetchdetails();
  }, [id]);

  return (
    <div style={styles.pageViewport}>
      <div style={styles.adminMainLayout}>
        
        
        <div style={styles.moduleCardSection}>
          <h1 style={styles.mainHeadingTitle}>Staff Dashboard</h1>
          {staffdata?.length > 0 ? (
              <StaffTable data={staffdata} />
          ) : (
            <h2 style={styles.statusFallbackMessage}>{errmsg || res || "Loading Profile Assets..."}</h2>
          )}
        </div>
    
       
        <div style={styles.moduleCardSection}>
          <h3 style={styles.sectionSubHeading}>System Controls & Automation</h3>
          
          <div style={styles.actionGridContainer}>
            <Link to="/recog" state={{ id: id }} style={{ textDecoration: 'none' }}>
              <button style={{ ...styles.actionBtn, ...styles.btnPrimary }}>Mark Attendance</button>
            </Link>
            
            <Link to="/Attendance" style={{ textDecoration: 'none' }}>
              <button style={{ ...styles.actionBtn, ...styles.btnSecondary }}>View Attendance</button>
            </Link>
            
            {!dis && (
              <button onClick={bclck} style={{ ...styles.actionBtn, ...styles.btnAccent }}>Create User Account</button>
            )}

            <button onClick={trainmodel} style={{ ...styles.suiteBtn, ...styles.btnAccent }}>
                Train Recognition Model
            </button>
            
            <button onClick={() => navigate(-1)} style={{ ...styles.actionBtn, ...styles.btnBackOutline }}>
              ← Go Back
            </button>
          </div>

          
          <div style={styles.csvUploadPanel}>
            <h4 style={styles.csvPanelTitle}>Batch Student Enrolment</h4>
            <form onSubmit={handleUpload} style={styles.csvFormLayout}>
              <div style={styles.fileInputContainer}>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  style={styles.nativeFileInput}
                  id="csv-file-picker"
                />
                <label htmlFor="csv-file-picker" style={styles.customFileLabel}>
                  {file ? `📄 ${file.name}` : "📂 Choose Student CSV File"}
                </label>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={loading ? { ...styles.submitCsvBtn, opacity: 0.6 } : styles.submitCsvBtn}
              >
                {loading ? 'Processing...' : 'Upload List'}
              </button>
            </form>
            {uploadStatus && (
              <p style={{
                ...styles.uploadFeedbackStatus,
                color: uploadStatus.toLowerCase().includes('failed') || uploadStatus.toLowerCase().includes('error') ? '#fca5a5' : '#10b981'
              }}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>

        
        {dis && (
          <div style={{ ...styles.moduleCardSection, ...styles.animatedDrawerPanel }}>
            <h3 style={styles.sectionSubHeading}>Account Provisioning System</h3>
            <div style={styles.formSplitGridField}>
              <Uid value={uid} onChange={(e) => setUid(e.target.value)}/>
              <Name value={name} onChange={(e) => setName(e.target.value)}/>
              <Pass value={pass} onChange={(e) => setPass(e.target.value)}/>
              
              <div style={styles.checkboxWrapperBlock}>
                <Staffornot
                  label="Grant Staff Elevation Permissions" 
                  isChecked={stornot} 
                  onToggle={setIsStaff}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={subdet} style={styles.finalizeCreationBtn}>
                Register Identity Assets
              </button>
            </div>
          </div>
        )}
         
      </div>
    </div>
  )
}


const styles = {
  pageViewport: {
    background: 'linear-gradient(135deg, #0b0f19 0%, #111827 100%)',
    minHeight: '100vh',
    padding: '40px 24px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: '#f3f4f6',
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },
  adminMainLayout: {
    width: '100%',
    maxWidth: '720px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  moduleCardSection: {
    background: 'rgba(31, 41, 55, 0.45)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
  },
  animatedDrawerPanel: {
    borderLeft: '4px solid #6366f1',
    animation: 'slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  mainHeadingTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    marginBottom: '20px',
    background: 'linear-gradient(to right, #ffffff, #9ca3af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sectionSubHeading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '-0.2px',
  },
  statusFallbackMessage: {
    fontSize: '0.95rem',
    color: '#9ca3af',
    fontWeight: '500',
  },
  tableReplacementContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  staffProfileCard: {
    background: 'rgba(17, 24, 39, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfoGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardInfoGroupRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'right',
  },
  cardMetaLabel: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    color: '#6366f1',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  cardValueText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  actionGridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
    marginBottom: '32px',
  },
  actionBtn: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  btnPrimary: {
    background: '#6366f1',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  btnSecondary: {
    background: '#374151',
    color: '#ffffff',
  },
  btnAccent: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: '#a5b4fc',
    border: '1px dashed rgba(99, 102, 241, 0.3)',
  },
  btnBackOutline: {
    background: 'transparent',
    color: '#9ca3af',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  csvUploadPanel: {
    background: 'rgba(17, 24, 39, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '16px',
    padding: '20px',
    marginTop: '10px',
  },
  csvPanelTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: '14px',
  },
  csvFormLayout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
  },
  fileInputContainer: {
    flex: 1,
    minWidth: '220px',
    position: 'relative',
  },
  nativeFileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  customFileLabel: {
    display: 'block',
    background: '#1f2937',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '0.88rem',
    color: '#d1d5db',
    cursor: 'pointer',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  submitCsvBtn: {
    background: '#10b981',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '0.88rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
  },
  uploadFeedbackStatus: {
    fontSize: '0.85rem',
    fontWeight: '500',
    marginTop: '12px',
    marginHeight: 0,
  },
  formSplitGridField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  suiteBtn: {
        width: '100%',
        padding: '13px 20px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
  },
  btnAccent: {
        background: 'rgba(99, 102, 241, 0.1)',
        color: '#a5b4fc',
        border: '1px solid rgba(99, 102, 241, 0.25)',
  },
  inputLabel: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    paddingLeft: '2px',
  },
  textInput: {
    background: 'rgba(17, 24, 39, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  checkboxWrapperBlock: {
    marginTop: '6px',
    paddingLeft: '2px',
  },
  checkboxLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkboxInput: {
    accentColor: '#6366f1',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '0.9rem',
    color: '#d1d5db',
    fontWeight: '500',
  },
  finalizeCreationBtn: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#ffffff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '0.92rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  },
};

export default StaffHome;