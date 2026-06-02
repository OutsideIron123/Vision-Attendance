import React, { useCallback, useRef, useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const RecogPage = () => {
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isrecog, setIsrecog] = useState(false);
    const [date, setDate] = useState(getTodayDateString())
    const videoref = useRef(null);
    const [error, setError] = useState(null);
    const [capimg, setCapimg] = useState(null);
    const [formError, setFormerror] = useState(null);
    const [processedImg, setProcessedImg] = useState(null);
    const [status, setStatus] = useState("Loading...");
    const location = useLocation();
    const id = location.state?.id;

    const FileUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
        if (!allowedTypes.includes(file.type)) {
          alert("Invalid file type. Please upload a JPG, JPEG, or PNG image.");
          e.target.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
            setCapimg(event.target.result);
            const res = await fetch(`http://${API_BASE_URL}/new/init/?date=${date}`)
            const resu = await res.json()
            console.log(resu.status)
            setProcessedImg("");
        };
        reader.readAsDataURL(file);
      }
      e.target.value = "";
    };

    const capFrame = async () => {
        const video = videoref.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgdata = canvas.toDataURL("image/png", 1.0);
        setCapimg(imgdata);
        const res = await fetch(`http://${API_BASE_URL}/new/init/?date=${date}`);
        const resu = await res.json();
        console.log(resu.status);
        setProcessedImg(null);
    }

    const recogframe = async () => {
        setIsrecog(true);
        try {
            const response = await fetch("http://${API_BASE_URL}/new/recog/", {
                method : "POST",
                headers: {
                    "Content-Type" : "application/json",
                        },
                body: JSON.stringify({
                    image: capimg,
                    date: date
                    }),
                });
            const result = await response.json();
            if(result.success){
                setProcessedImg(result.image)
            }
        } catch (err) {
            console.log("Error sending Data : ", err)
        } finally {
            setIsrecog(false);
        }
    }

    const startcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          if (videoref.current) {
            videoref.current.srcObject = stream;
          }
          setError(null);
        } catch (err) {
          console.log("Error in Accessing Camera : ", err)
          setError("Camera Access Denied by User!")
        }
    };

    return (
        <div style={styles.pageViewport}>
            <style>{`
                @keyframes suiteSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div style={styles.suiteContainer}>
                
                <div style={styles.monitorColumn}>
                    <h2 style={styles.sectionHeadingTitle}>Biometric Hardware Stream</h2>
                    {error && <p style={styles.errorMessageField}>{error}</p>}

                    <div style={styles.cameraFrameWrapper}>
                        <video
                            ref={videoref}
                            autoPlay
                            playsInline
                            style={styles.hardwareVideoFeed}
                        />
                        <div style={styles.cornerTargetTL} />
                        <div style={styles.cornerTargetTR} />
                        <div style={styles.cornerTargetBL} />
                        <div style={styles.cornerTargetBR} />
                    </div>

                    
                    {isrecog && (
                        <div style={styles.processingBarWrapper}>
                            <div style={styles.loadingSpinnerCircle} />
                            <span style={styles.processingStatusLabel}>Analyzing camera frames against database...</span>
                        </div>
                    )}

                    
                    {processedImg ? (
                        <div style={styles.outputImageDisplayBox}>
                            <h4 style={{ ...styles.outputPreviewTitle, color: '#10b981' }}>✓ Verification Finalized:</h4>
                            <img src={processedImg} style={{ ...styles.previewMediaElement, border: '2px solid #10b981' }} alt="Processed" />
                        </div>
                    ) : capimg ? (
                        <div style={styles.outputImageDisplayBox}>
                            <h4 style={{ ...styles.outputPreviewTitle, color: '#6366f1' }}>📷 Staged Snapshot Pending:</h4>
                            <img src={capimg} style={{ ...styles.previewMediaElement, opacity: 0.8, border: '1px dashed #6366f1' }} alt="Snapshot" />
                        </div>
                    ) : null}
                </div>

                
                <div style={styles.controlsColumn}>
                    <h2 style={styles.sectionHeadingTitle}>Automation Suite</h2>
                    
                    <div style={styles.configurationStackForm}>
                        <div style={styles.controlFieldBox}>
                            <label style={styles.metaFieldLabel}>Target Session Date</label>
                            <input
                             type="date"
                             value={date}
                             onChange={(e) => setDate(e.target.value)}
                             style={styles.dateSelectorField}
                            />
                        </div>

                        <div style={styles.controlFieldBox}>
                            <label style={styles.metaFieldLabel}>Alternative Static Media Source</label>
                            <div style={styles.customUploadFieldContainer}>
                                <input 
                                    type="file" 
                                    accept=".jpg,.png,.jpeg" 
                                    onChange={FileUpload}
                                    style={styles.invisibleNativeFilePicker}
                                    id="biometric-file-source"
                                />
                                <label htmlFor="biometric-file-source" style={styles.filePickerLabelDecorator}>
                                    📂 Import Image Blueprint
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={styles.actionGridButtonsStack}>
                        <button onClick={startcam} style={{ ...styles.suiteBtn, ...styles.btnSecondary }}>
                            Initialize Camera
                        </button>
                        
                        <button onClick={capFrame} style={{ ...styles.suiteBtn, ...styles.btnSecondary }}>
                            Capture Current Frame
                        </button>
                        
                        <button onClick={recogframe} disabled={isrecog} style={{ ...styles.suiteBtn, ...styles.btnPrimary }}>
                            {isrecog ? "Processing Verification..." : "Mark System Attendance"}
                        </button>

                        <div style={styles.panelDividerDivider} />

                        <Link to="/StaffHome" state={{"id" : id}} style={{ textDecoration: 'none', width: '100%' }}>
                            <button style={{ ...styles.suiteBtn, ...styles.btnBackOutline }}>
                                ← Terminate & Exit
                            </button>
                        </Link>
                    </div>
                </div>

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
        alignItems: 'center',
        color: '#f3f4f6',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
    },
    suiteContainer: {
        width: '100%',
        maxWidth: '960px',
        background: 'rgba(23, 28, 41, 0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '28px',
        padding: '36px',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '40px',
        flexWrap: 'wrap',
    },
    monitorColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    controlsColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        background: 'rgba(15, 19, 30, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '20px',
        padding: '28px',
    },
    sectionHeadingTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#ffffff',
        margin: 0,
        letterSpacing: '-0.3px',
    },
    errorMessageField: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px dashed #ef4444',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '0.85rem',
        color: '#fca5a5',
        margin: 0,
    },
    cameraFrameWrapper: {
        width: '100%',
        position: 'relative',
        background: '#090d16',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
    },
    hardwareVideoFeed: {
        width: '100%',
        height: 'auto',
        aspectRatio: '4/3',
        objectFit: 'cover',
    },
    cornerTargetTL: { position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', borderTop: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
    cornerTargetTR: { position: 'absolute', top: '16px', right: '16px', width: '20px', height: '20px', borderTop: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
    cornerTargetBL: { position: 'absolute', bottom: '16px', left: '16px', width: '20px', height: '20px', borderBottom: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
    cornerTargetBR: { position: 'absolute', bottom: '16px', right: '16px', width: '20px', height: '20px', borderBottom: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
    
    configurationStackForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    controlFieldBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    metaFieldLabel: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    dateSelectorField: {
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        padding: '12px 14px',
        borderRadius: '10px',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    customUploadFieldContainer: {
        position: 'relative',
        width: '100%',
    },
    invisibleNativeFilePicker: {
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer',
    },
    filePickerLabelDecorator: {
        display: 'block',
        background: 'rgba(31, 41, 55, 0.5)',
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '0.88rem',
        color: '#d1d5db',
        textAlign: 'center',
        cursor: 'pointer',
    },
    actionGridButtonsStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: 'auto',
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
    },
    btnSecondary: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.04)',
    },
    btnBackOutline: {
        background: 'transparent',
        color: '#94a3b8',
        border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    panelDividerDivider: {
        height: '1px',
        background: 'rgba(255, 255, 255, 0.06)',
        margin: '6px 0',
    },
    processingBarWrapper: {
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px dashed rgba(99, 102, 241, 0.25)',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    loadingSpinnerCircle: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderTop: '2px solid #6366f1',
        borderRadius: '50%',
        animation: 'suiteSpin 1s linear infinite',
    },
    processingStatusLabel: {
        fontSize: '0.85rem',
        fontWeight: '500',
        color: '#a5b4fc',
    },
    outputImageDisplayBox: {
        background: 'rgba(15, 19, 30, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    outputPreviewTitle: {
        fontSize: '0.85rem',
        fontWeight: '600',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    previewMediaElement: {
        width: '100%',
        maxWidth: '240px',
        height: 'auto',
        borderRadius: '8px',
        display: 'block',
    }
};

export default RecogPage;