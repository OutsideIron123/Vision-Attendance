import React, { useCallback, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

function StuHome(){
    const location = useLocation();
    const id = location.state?.id;
    const [studata, setStudata] = useState([]);
    const [errmsg, setErrmsg] = useState(null);
    const navigate = useNavigate();

    
    const StudentProfileCard = ({ data }) => {
        return (
            <div style={styles.profileListContainer}>
                {data.map((item) => (
                    <div key={item.login_id || item.id} style={styles.glassProfileCard}>
                        <div style={styles.avatarSection}>
                            <div style={styles.avatarCircle}>
                                {item.sname ? item.sname.charAt(0).toUpperCase() : "S"}
                            </div>
                        </div>
                        <div style={styles.detailsSection}>
                            <div style={styles.infoRow}>
                                <span style={styles.profileLabel}>Student ID</span>
                                <span style={styles.profileValue}>{item.login_id || item.id}</span>
                            </div>
                            <div style={styles.divider} />
                            <div style={styles.infoRow}>
                                <span style={styles.profileLabel}>Full Name</span>
                                <span style={styles.profileValue}>{item.sname}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        if (!id) {
            setErrmsg("No ID provided! Please Login Again!")
            return;
        }
        const fetchdetails = async () => {
            try {    
                const response = await fetch(`http://${API_BASE_URL}/new/getstu/?id=${id}`);
                const res = await response.json();
                if (res.status === "success") {
                    setStudata(res.studetails)
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
            <div style={styles.dashboardPanel}>
                <h1 style={styles.panelHeading}>Student Portal</h1>
                
                {studata?.length > 0 ? (
                    <StudentProfileCard data={studata} />
                ) : (
                    <div style={styles.errorFeedbackWrapper}>
                        <span style={styles.errorIcon}>⚠️</span>
                        <h2 style={styles.errorHeadingText}>{errmsg || "Loading profile telemetry..."}</h2>
                    </div>
                )}
                
                <div style={styles.actionStack}>
                    <Link to="/Stuattendance" state={{ id: id }} style={{ textDecoration: 'none', width: '100%' }}>
                        <button style={{ ...styles.btn, ...styles.btnPrimary }}>
                            View Attendance Report
                        </button>
                    </Link>
                    
                    <button onClick={() => navigate(-1)} style={{ ...styles.btn, ...styles.btnSecondary }}>
                        ← Back
                    </button>
                </div>
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
    dashboardPanel: {
        background: 'rgba(30, 41, 59, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    panelHeading: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: '-0.5px',
        margin: 0,
        background: 'linear-gradient(to right, #ffffff, #94a3b8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    profileListContainer: {
        width: '100%',
    },
    glassProfileCard: {
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        boxSizing: 'border-box',
        width: '100%',
    },
    avatarSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarCircle: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: '700',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
    },
    detailsSection: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
    },
    profileLabel: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: '#6366f1',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    profileValue: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#f8fafc',
    },
    divider: {
        height: '1px',
        background: 'rgba(255, 255, 255, 0.06)',
        width: '100%',
    },
    actionStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
    },
    btn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 24px',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    btnPrimary: {
        background: '#6366f1',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
    },
    btnSecondary: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#94a3b8',
        border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    errorFeedbackWrapper: {
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.18)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    errorIcon: {
        fontSize: '1.25rem',
    },
    errorHeadingText: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: '#fca5a5',
        margin: 0,
        lineHeight: '1.4',
    },
};

export default StuHome;