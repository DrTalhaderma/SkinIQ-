import { useState } from "react";
const T = {
  en: {
    appName: "SkinIQ", tagline: "AI-Powered Dermatology Platform",
    patientTab: "Patient", doctorTab: "Doctor",
    patientTitle: "Describe Your Skin Concern",
    patientSubtitle: "Get an AI assessment by Dr. Muhammad Talha Sarfraz",
    nameLabel: "Full Name", namePlaceholder: "Enter your full name",
    ageLabel: "Age", agePlaceholder: "Your age",
    genderLabel: "Gender", male: "Male", female: "Female",
    symptomsLabel: "Describe Your Symptoms",
    symptomsPlaceholder: "e.g. Red itchy patch on arm for 2 weeks...",
    durationLabel: "How long have you had this?",
    durationPlaceholder: "e.g. 2 weeks, 3 months",
    photoLabel: "Upload Photo (optional)", photoBtn: "Choose Photo",
    submitBtn: "Get AI Assessment", analyzing: "Analyzing...",
    assessmentTitle: "AI Assessment", newConsultation: "New Consultation",
    disclaimer: "This is for informational purposes only. Always consult Dr. Talha for diagnosis.",
    doctorTitle: "Doctor Dashboard", doctorSubtitle: "AI-assisted patient management",
    consultationsLabel: "Recent Consultations", noConsultations: "No consultations yet",
    generateNote: "Generate SOAP Note", generatingNote: "Generating...",
    clinicalNote: "Clinical Note", pending: "Pending", reviewed: "Reviewed",
    markReviewed: "Mark Reviewed", loginTitle: "Doctor Login",
    passwordLabel: "Password", passwordPlaceholder: "Enter password",
    loginBtn: "Login", wrongPassword: "Incorrect password", logout: "Logout",
    switchLang: "اردو",
  },
  ur: {
    appName: "سکن آئی کیو", tagline: "اے آئی جلد کا علاج",
    patientTab: "مریض", doctorTab: "ڈاکٹر",
    patientTitle: "اپنی جلد کی تکلیف بیان کریں",
    patientSubtitle: "ڈاکٹر طلحہ صرفراز کی نگرانی میں جائزہ",
    nameLabel: "پورا نام", namePlaceholder: "اپنا نام لکھیں",
    ageLabel: "عمر", agePlaceholder: "آپ کی عمر",
    genderLabel: "جنس", male: "مرد", female: "عورت",
    symptomsLabel: "علامات بیان کریں",
    symptomsPlaceholder: "مثلاً: بازو پر سرخ دھبہ دو ہفتوں سے...",
    durationLabel: "کتنے عرصے سے؟", durationPlaceholder: "مثلاً: دو ہفتے",
    photoLabel: "تصویر اپلوڈ کریں", photoBtn: "تصویر منتخب کریں",
    submitBtn: "جائزہ حاصل کریں", analyzing: "جائزہ لیا جا رہا ہے...",
    assessmentTitle: "اے آئی جائزہ", newConsultation: "نئی مشاورت",
    disclaimer: "یہ صرف معلومات کے لیے ہے۔ تشخیص کے لیے ڈاکٹر سے ملیں۔",
    doctorTitle: "ڈاکٹر ڈیش بورڈ", doctorSubtitle: "اے آئی مدد یافتہ انتظام",
    consultationsLabel: "حالیہ مشاورتیں", noConsultations: "کوئی مشاورت نہیں",
    generateNote: "طبی نوٹ بنائیں", generatingNote: "بنایا جا رہا ہے...",
    clinicalNote: "طبی نوٹ", pending: "زیر التواء", reviewed: "دیکھا گیا",
    markReviewed: "مکمل نشان لگائیں", loginTitle: "ڈاکٹر لاگ ان",
    passwordLabel: "پاس ورڈ", passwordPlaceholder: "پاس ورڈ درج کریں",
    loginBtn: "لاگ ان", wrongPassword: "غلط پاس ورڈ", logout: "لاگ آؤٹ",
    switchLang: "English",
  },
};
const inp = { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const lbl = { display:"block", fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)", marginBottom:6, letterSpacing:"0.5px", textTransform:"uppercase" };
export default function App() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("patient");
  const [form, setForm] = useState({ name:"", age:"", gender:"male", symptoms:"", duration:"" });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState(null);
  const [genNote, setGenNote] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = T[lang];
  const rtl = lang === "ur";
  const callAI = async (prompt) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user", content:prompt}] })
    });
    const d = await r.json();
    return d.content.map(i => i.text||"").join("\n");
  };
  const handleSubmit = async () => {
    if (!form.name || !form.symptoms) return;
    setLoading(true);
    try {
      const result = await callAI(`You are an AI dermatology assistant for Dr. Muhammad Talha Sarfraz in Pakistan. Patient: ${form.name}, ${form.age}y, ${form.gender}. Symptoms: ${form.symptoms}. Duration: ${form.duration}. Provide assessment in ${lang==="ur"?"Urdu":"English"} with: 1) Possible Conditions 2) Severity 3) Next Steps 4) Red Flags 5) Skincare Advice. Be empathetic and remind patient to consult Dr. Talha.`);
      setAssessment(result);
      setConsultations(p => [{ id:Date.now(), ...form, photo, assessment:result, status:"pending", time:new Date().toLocaleString() }, ...p]);
      setSubmitted(true);
    } catch { setAssessment("Error. Please try again."); }
    setLoading(false);
  };
  const handleNote = async (c) => {
    setGenNote(true); setNote(null);
    try {
      const result = await callAI(`Generate a professional SOAP clinical note for Dr. Muhammad Talha Sarfraz. Patient: ${c.name}, ${c.age}y, ${c.gender}. Complaint: ${c.symptoms}. Duration: ${c.duration}. AI Assessment: ${c.assessment}. Format as proper SOAP note.`);
      setNote(result);
    } catch { setNote("Error generating note."); }
    setGenNote(false);
  };
  const s = { minHeight:"100vh", background:"linear-gradient(135deg,#0a1628,#0d2347,#0a1628)", fontFamily: rtl?"'Noto Nastaliq Urdu',serif":"'DM Sans','Segoe UI',sans-serif", color:"#e8f4f8" };
  return (
    <div dir={rtl?"rtl":"ltr"} style={s}>
      <div style={{ background:"rgba(0,180,219,0.1)", borderBottom:"1px solid rgba(0,180,219,0.2)", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#00b4db,#0083b0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff" }}>S</div>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{t.appName}</div>
            <div style={{ fontSize:11, color:"rgba(0,180,219,0.8)" }}>{t.tagline}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setLang(lang==="en"?"ur":"en")} style={{ background:"rgba(0,180,219,0.15)", border:"1px solid rgba(0,180,219,0.3)", color:"#00b4db", padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:13, fontWeight:600 }}>{t.switchLang}</button>
          {loggedIn && tab==="doctor" && <button onClick={()=>{setLoggedIn(false);setPw("");}} style={{ background:"rgba(255,80,80,0.15)", border:"1px solid rgba(255,80,80,0.3)", color:"#ff5050", padding:"6px 14px", borderRadius:20, cursor:"pointer", fontSize:13 }}>{t.logout}</button>}
        </div>
      </div>
      <div style={{ display:"flex", padding:"20px 24px 0", gap:8, maxWidth:900, margin:"0 auto" }}>
        {["patient","doctor"].map(tb=>(
          <button key={tb} onClick={()=>setTab(tb)} style={{ padding:"10px 28px", borderRadius:"12px 12px 0 0", border:"none", cursor:"pointer", fontWeight:700, fontSize:14, background:tab===tb?"rgba(0,180,219,0.2)":"rgba(255,255,255,0.05)", color:tab===tb?"#00b4db":"rgba(255,255,255,0.5)", borderBottom:tab===tb?"2px solid #00b4db":"2px solid transparent" }}>
            {tb==="patient"?t.patientTab:t.doctorTab}
          </button>
        ))}
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px 40px" }}>
        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"0 16px 16px 16px", border:"1px solid rgba(0,180,219,0.15)", padding:28 }}>
          {tab==="patient" && (
            <div>
              {!submitted ? (
                <>
                  <div style={{ marginBottom:24 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>{t.patientTitle}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{t.patientSubtitle}</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <div><label style={lbl}>{t.nameLabel}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={t.namePlaceholder} style={inp}/></div>
                    <div><label style={lbl}>{t.ageLabel}</label><input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder={t.agePlaceholder} type="number" style={inp}/></div>
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <label style={lbl}>{t.genderLabel}</label>
                    <div style={{ display:"flex", gap:10 }}>
                      {["male","female"].map(g=>(
                        <button key={g} onClick={()=>setForm({...form,gender:g})} style={{ padding:"8px 20px", borderRadius:8, border:"1px solid", borderColor:form.gender===g?"#00b4db":"rgba(255,255,255,0.1)", background:form.gender===g?"rgba(0,180,219,0.2)":"transparent", color:form.gender===g?"#00b4db":"rgba(255,255,255,0.5)", cursor:"pointer", fontWeight:600, fontSize:13 }}>
                          {g==="male"?t.male:t.female}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom:16 }}><label style={lbl}>{t.symptomsLabel}</label><textarea value={form.symptoms} onChange={e=>setForm({...form,symptoms:e.target.value})} placeholder={t.symptomsPlaceholder} rows={4} style={{...inp,resize:"vertical"}}/></div>
                  <div style={{ marginBottom:16 }}><label style={lbl}>{t.durationLabel}</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder={t.durationPlaceholder} style={inp}/></div>
                  <div style={{ marginBottom:24 }}>
                    <label style={lbl}>{t.photoLabel}</label>
                    <label style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:8, cursor:"pointer", border:"1px dashed rgba(0,180,219,0.4)", background:"rgba(0,180,219,0.05)", color:"#00b4db", fontSize:13, fontWeight:600 }}>
                      📷 {t.photoBtn}<input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f)setPhoto(URL.createObjectURL(f));}} style={{ display:"none" }}/>
                    </label>
                    {photo && <img src={photo} alt="skin" style={{ display:"block", marginTop:12, maxHeight:150, borderRadius:8 }}/>}
                  </div>
                  <button onClick={handleSubmit} disabled={loading||!form.name||!form.symptoms} style={{ width:"100%", padding:14, borderRadius:12, border:"none", cursor:"pointer", background:loading||!form.name||!form.symptoms?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#00b4db,#0083b0)", color:"#fff", fontWeight:800, fontSize:16 }}>
                    {loading?`⏳ ${t.analyzing}`:`🔍 ${t.submitBtn}`}
                  </button>
                </>
              ) : (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                    <div style={{ fontSize:20, fontWeight:800, color:"#00b4db" }}>✅ {t.assessmentTitle}</div>
                    <button onClick={()=>{setForm({name:"",age:"",gender:"male",symptoms:"",duration:""});setPhoto(null);setAssessment(null);setSubmitted(false);}} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid rgba(0,180,219,0.3)", background:"transparent", color:"#00b4db", cursor:"pointer", fontSize:13, fontWeight:600 }}>+ {t.newConsultation}</button>
                  </div>
                  <div style={{ background:"rgba(0,180,219,0.07)", borderRadius:12, border:"1px solid rgba(0,180,219,0.15)", padding:20, marginBottom:16, fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,0.85)", whiteSpace:"pre-wrap" }}>{assessment}</div>
                  <div style={{ background:"rgba(255,200,0,0.07)", borderRadius:12, border:"1px solid rgba(255,200,0,0.2)", padding:16, fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>⚠️ {t.disclaimer}</div>
                </div>
              )}
            </div>
          )}
          {tab==="doctor" && (
            <div>
              {!loggedIn ? (
                <div style={{ maxWidth:360, margin:"0 auto", textAlign:"center", padding:"20px 0" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🩺</div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:24 }}>{t.loginTitle}</div>
                  <label style={lbl}>{t.passwordLabel}</label>
                  <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pw==="skiniq2024"?(setLoggedIn(true),setPwErr(false)):setPwErr(true))} placeholder={t.passwordPlaceholder} style={{...inp,textAlign:"center"}}/>
                  {pwErr && <div style={{ color:"#ff5050", fontSize:13, marginTop:8 }}>❌ {t.wrongPassword}</div>}
                  <button onClick={()=>pw==="skiniq2024"?(setLoggedIn(true),setPwErr(false)):setPwErr(true)} style={{ width:"100%", marginTop:16, padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#00b4db,#0083b0)", color:"#fff", fontWeight:800, fontSize:15, cursor:"pointer" }}>{t.loginBtn}</button>
                  <div style={{ marginTop:12, fontSize:12, color:"rgba(255,255,255,0.3)" }}>Password: skiniq2024</div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>👨‍⚕️ {t.doctorTitle}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>{t.doctorSubtitle}</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:selected?"1fr 1.4fr":"1fr", gap:20 }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:12, textTransform:"uppercase" }}>{t.consultationsLabel} ({consultations.length})</div>
                      {consultations.length===0 ? (
                        <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.3)" }}>📋 {t.noConsultations}</div>
                      ) : consultations.map(c=>(
                        <div key={c.id} onClick={()=>{setSelected(c);setNote(null);}} style={{ padding:"14px 16px", borderRadius:10, marginBottom:8, cursor:"pointer", border:"1px solid", borderColor:selected?.id===c.id?"#00b4db":"rgba(255,255,255,0.08)", background:selected?.id===c.id?"rgba(0,180,219,0.1)":"rgba(255,255,255,0.03)" }}>
                          <div style={{ display:"flex", justifyContent:"space-between" }}>
                            <div style={{ fontWeight:700, color:"#fff" }}>{c.name}</div>
                            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, fontWeight:700, background:c.status==="reviewed"?"rgba(0,200,100,0.2)":"rgba(255,180,0,0.2)", color:c.status==="reviewed"?"#00c864":"#ffb400" }}>{c.status==="reviewed"?t.reviewed:t.pending}</span>
                          </div>
                          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{c.age}y · {c.gender} · {c.time}</div>
                          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.symptoms}</div>
                        </div>
                      ))}
                    </div>
                    {selected && (
                      <div style={{ borderLeft:"1px solid rgba(0,180,219,0.15)", paddingLeft:20 }}>
                        <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:4 }}>{selected.name}</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16 }}>{selected.age}y · {selected.gender} · {selected.duration}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:6, textTransform:"uppercase" }}>Symptoms</div>
                        <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:16, lineHeight:1.6 }}>{selected.symptoms}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)", marginBottom:6, textTransform:"uppercase" }}>AI Assessment</div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:16, background:"rgba(0,180,219,0.05)", borderRadius:8, padding:12, whiteSpace:"pre-wrap", maxHeight:180, overflowY:"auto" }}>{selected.assessment}</div>
                        <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                          <button onClick={()=>handleNote(selected)} disabled={genNote} style={{ padding:"9px 16px", borderRadius:8, border:"none", cursor:"pointer", background:"linear-gradient(135deg,#00b4db,#0083b0)", color:"#fff", fontWeight:700, fontSize:13, flex:1 }}>
                            {genNote?`⏳ ${t.generatingNote}`:`📝 ${t.generateNote}`}
                          </button>
                          {selected.status==="pending" && (
                            <button onClick={()=>{setConsultations(p=>p.map(c=>c.id===selected.id?{...c,status:"reviewed"}:c));setSelected(s=>({...s,status:"reviewed"}));}} style={{ padding:"9px 16px", borderRadius:8, border:"1px solid rgba(0,200,100,0.3)", background:"rgba(0,200,100,0.1)", color:"#00c864", fontWeight:700, fontSize:13, cursor:"pointer", flex:1 }}>✅ {t.markReviewed}</button>
                          )}
                        </div>
                        {note && <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", lineHeight:1.8, whiteSpace:"pre-wrap", background:"rgba(255,255,255,0.04)", borderRadius:8, padding:14, maxHeight:220, overflowY:"auto" }}>{note}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
    }
