import { useState } from "react";
const T = {
  en: {
    appName: "SkinIQ", tagline: "Advanced Dermatology • AI Powered",
    patientTab: "Patient", doctorTab: "Doctor",
    patientTitle: "Describe Your Skin Concern",
    patientSubtitle: "Receive an AI-assisted assessment reviewed by Dr. Muhammad Talha Sarfraz, D.Derm",
    nameLabel: "Full Name", namePlaceholder: "Enter your full name",
    ageLabel: "Age", agePlaceholder: "Your age",
    genderLabel: "Gender", male: "Male", female: "Female",
    symptomsLabel: "Describe Your Symptoms",
    symptomsPlaceholder: "e.g. Red itchy patch on arm for 2 weeks...",
    durationLabel: "How long have you had this?", durationPlaceholder: "e.g. 2 weeks, 3 months",
    photoLabel: "Upload Photo (optional)", photoBtn: "Choose Photo",
    submitBtn: "Get AI Assessment", analyzing: "Analyzing your concern...",
    assessmentTitle: "Your Assessment", newConsultation: "New Consultation",
    disclaimer: "This AI assessment is for informational purposes only. Please consult Dr. Talha Sarfraz for proper evaluation.",
    doctorTitle: "Doctor Dashboard", doctorSubtitle: "AI-assisted patient management",
    consultationsLabel: "Consultations", noConsultations: "No consultations yet",
    generateNote: "Generate SOAP Note", generatingNote: "Generating note...",
    clinicalNote: "Clinical Note", pending: "Pending", reviewed: "Reviewed",
    markReviewed: "Mark as Reviewed", loginTitle: "Doctor Access",
    loginSubtitle: "Secure portal for Dr. Muhammad Talha Sarfraz",
    passwordLabel: "Password", passwordPlaceholder: "Enter your password",
    loginBtn: "Access Dashboard", wrongPassword: "Incorrect password.",
    logout: "Sign Out", switchLang: "اردو",
  },
  ur: {
    appName: "سکن آئی کیو", tagline: "جدید جلد کا علاج • اے آئی",
    patientTab: "مریض", doctorTab: "ڈاکٹر",
    patientTitle: "اپنی جلد کی تکلیف بیان کریں",
    patientSubtitle: "ڈاکٹر محمد طلحہ صرفراز کی نگرانی میں اے آئی جائزہ",
    nameLabel: "پورا نام", namePlaceholder: "اپنا پورا نام لکھیں",
    ageLabel: "عمر", agePlaceholder: "آپ کی عمر",
    genderLabel: "جنس", male: "مرد", female: "عورت",
    symptomsLabel: "علامات بیان کریں",
    symptomsPlaceholder: "مثلاً: بازو پر سرخ دھبہ دو ہفتوں سے...",
    durationLabel: "کتنے عرصے سے ہے؟", durationPlaceholder: "مثلاً: دو ہفتے",
    photoLabel: "تصویر اپلوڈ کریں", photoBtn: "تصویر منتخب کریں",
    submitBtn: "جائزہ حاصل کریں", analyzing: "جائزہ لیا جا رہا ہے...",
    assessmentTitle: "آپ کا جائزہ", newConsultation: "نئی مشاورت",
    disclaimer: "یہ صرف معلومات کے لیے ہے۔ تشخیص کے لیے ڈاکٹر طلحہ سے ملیں۔",
    doctorTitle: "ڈاکٹر ڈیش بورڈ", doctorSubtitle: "اے آئی مدد یافتہ انتظام",
    consultationsLabel: "مشاورتیں", noConsultations: "کوئی مشاورت نہیں",
    generateNote: "طبی نوٹ بنائیں", generatingNote: "بنایا جا رہا ہے...",
    clinicalNote: "طبی نوٹ", pending: "زیر التواء", reviewed: "مکمل",
    markReviewed: "مکمل نشان لگائیں", loginTitle: "ڈاکٹر رسائی",
    loginSubtitle: "ڈاکٹر محمد طلحہ صرفراز کا محفوظ پورٹل",
    passwordLabel: "پاس ورڈ", passwordPlaceholder: "پاس ورڈ درج کریں",
    loginBtn: "ڈیش بورڈ کھولیں", wrongPassword: "غلط پاس ورڈ",
    logout: "لاگ آؤٹ", switchLang: "English",
  },
};
const C = { cream:"#FAF7F2", beige:"#F0E8D8", gold:"#C9A96E", goldDark:"#A67C52", goldLight:"#E8D5B0", brown:"#6B4E35", text:"#2C1810", textLight:"#8B7355", textMuted:"#B8A89A", white:"#FFFFFF", border:"#E8D5B0", success:"#7A9E7E", warning:"#C4884A" };
const inp = { width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.white, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"sans-serif", transition:"border-color 0.2s" };
const lbl = { display:"block", fontSize:11, fontWeight:700, color:C.textLight, marginBottom:6, letterSpacing:"1px", textTransform:"uppercase", fontFamily:"sans-serif" };
const card = { background:C.white, borderRadius:16, border:`1px solid ${C.border}`, boxShadow:"0 4px 24px rgba(139,115,85,0.08)", padding:28 };export default function App() {
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
      const result = await callAI(`You are an AI dermatology assistant for Dr. Muhammad Talha Sarfraz, D.Derm resident at Faisalabad Medical University, Pakistan. Patient: ${form.name}, ${form.age}y, ${form.gender}. Symptoms: ${form.symptoms}. Duration: ${form.duration}. Provide a warm clear assessment in ${lang==="ur"?"Urdu":"English"} covering: 1) Possible Conditions 2) Severity Level 3) Recommended Next Steps 4) Warning Signs 5) Skincare Tips. Be empathetic and remind patient to consult Dr. Talha.`);
      setAssessment(result);
      setConsultations(p => [{id:Date.now(), ...form, photo, assessment:result, status:"pending", time:new Date().toLocaleString()}, ...p]);
      setSubmitted(true);
    } catch { setAssessment("Unable to generate assessment. Please try again."); }
    setLoading(false);
  };
  const handleNote = async (c) => {
    setGenNote(true); setNote(null);
    try {
      const result = await callAI(`Generate a professional SOAP clinical note for Dr. Muhammad Talha Sarfraz, D.Derm. Patient: ${c.name}, ${c.age}y, ${c.gender}. Complaint: ${c.symptoms}. Duration: ${c.duration}. AI Assessment: ${c.assessment}. Format as proper SOAP note with suggested investigations.`);
      setNote(result);
    } catch { setNote("Error generating note."); }
    setGenNote(false);
  };return (
    <div dir={rtl?"rtl":"ltr"} style={{minHeight:"100vh",background:C.cream,fontFamily:rtl?"'Noto Nastaliq Urdu',serif":"Georgia,serif",color:C.text}}>
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 24px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(139,115,85,0.08)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:70}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:C.white,boxShadow:"0 4px 12px rgba(201,169,110,0.4)"}}>S</div>
            <div>
              <div style={{fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.5px"}}>{t.appName}</div>
              <div style={{fontSize:10,color:C.gold,letterSpacing:"2px",textTransform:"uppercase",fontFamily:"sans-serif"}}>{t.tagline}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setLang(lang==="en"?"ur":"en")} style={{background:"transparent",border:`1.5px solid ${C.gold}`,color:C.gold,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>{t.switchLang}</button>
            {loggedIn&&tab==="doctor"&&<button onClick={()=>{setLoggedIn(false);setPw("");}} style={{background:"transparent",border:`1.5px solid ${C.textMuted}`,color:C.textLight,padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{t.logout}</button>}
          </div>
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${C.brown},${C.goldDark},${C.gold})`,padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:12,color:C.goldLight,letterSpacing:"3px",textTransform:"uppercase",marginBottom:8,fontFamily:"sans-serif"}}>Dr. Muhammad Talha Sarfraz • D.Derm</div>
        <div style={{fontSize:28,fontWeight:700,color:C.white,lineHeight:1.3}}>Smart Skin Care,<br/>Powered by AI</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:8,fontFamily:"sans-serif"}}>Faisalabad Medical University • Pakistan</div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 24px 0"}}>
        <div style={{display:"flex",gap:4,background:C.beige,borderRadius:12,padding:4,marginBottom:24,border:`1px solid ${C.border}`}}>
          {["patient","doctor"].map(tb=>(
            <button key={tb} onClick={()=>setTab(tb)} style={{flex:1,padding:"10px 20px",borderRadius:9,border:"none",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"sans-serif",background:tab===tb?C.white:"transparent",color:tab===tb?C.goldDark:C.textLight,boxShadow:tab===tb?"0 2px 8px rgba(139,115,85,0.12)":"none",transition:"all 0.2s"}}>
              {tb==="patient"?t.patientTab:t.doctorTab}
            </button>
          ))}
        </div>
        {tab==="patient"&&(
          <div>
            {!submitted?(
              <div style={card}>
                <div style={{marginBottom:28,paddingBottom:20,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:6}}>{t.patientTitle}</div>
                  <div style={{fontSize:13,color:C.textLight,fontFamily:"sans-serif",lineHeight:1.6}}>{t.patientSubtitle}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                  <div><label style={lbl}>{t.nameLabel}</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={t.namePlaceholder} style={inp}/></div>
                  <div><label style={lbl}>{t.ageLabel}</label><input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder={t.agePlaceholder} type="number" style={inp}/></div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={lbl}>{t.genderLabel}</label>
                  <div style={{display:"flex",gap:10}}>
                    {["male","female"].map(g=>(
                      <button key={g} onClick={()=>setForm({...form,gender:g})} style={{padding:"10px 24px",borderRadius:10,border:"1.5px solid",borderColor:form.gender===g?C.gold:C.border,background:form.gender===g?C.goldLight:"transparent",color:form.gender===g?C.goldDark:C.textLight,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"sans-serif"}}>
                        {g==="male"?t.male:t.female}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:20}}><label style={lbl}>{t.symptomsLabel}</label><textarea value={form.symptoms} onChange={e=>setForm({...form,symptoms:e.target.value})} placeholder={t.symptomsPlaceholder} rows={4} style={{...inp,resize:"vertical"}}/></div>
                <div style={{marginBottom:20}}><label style={lbl}>{t.durationLabel}</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder={t.durationPlaceholder} style={inp}/></div>
                <div style={{marginBottom:28}}>
                  <label style={lbl}>{t.photoLabel}</label>
                  <label style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,cursor:"pointer",border:`1.5px dashed ${C.gold}`,background:C.beige,color:C.goldDark,fontSize:13,fontWeight:700,fontFamily:"sans-serif"}}>
                    📷 {t.photoBtn}<input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f)setPhoto(URL.createObjectURL(f));}} style={{display:"none"}}/>
                  </label>
                  {photo&&<img src={photo} alt="skin" style={{display:"block",marginTop:12,maxHeight:160,borderRadius:10,border:`1px solid ${C.border}`}}/>}
                </div>
                <button onClick={handleSubmit} disabled={loading||!form.name||!form.symptoms} style={{width:"100%",padding:15,borderRadius:12,border:"none",cursor:"pointer",background:loading||!form.name||!form.symptoms?C.beige:`linear-gradient(135deg,${C.goldDark},${C.gold})`,color:loading||!form.name||!form.symptoms?C.textMuted:C.white,fontWeight:700,fontSize:15,fontFamily:"sans-serif",boxShadow:loading||!form.name||!form.symptoms?"none":"0 4px 20px rgba(201,169,110,0.4)"}}>
                  {loading?`⏳ ${t.analyzing}`:`✦ ${t.submitBtn}`}
                </button>
              </div>
            ):(
              <div>
                <div style={card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{fontSize:20,fontWeight:700,color:C.goldDark}}>✦ {t.assessmentTitle}</div>
                    <button onClick={()=>{setForm({name:"",age:"",gender:"male",symptoms:"",duration:""});setPhoto(null);setAssessment(null);setSubmitted(false);}} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${C.gold}`,background:"transparent",color:C.goldDark,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"sans-serif"}}>+ {t.newConsultation}</button>
                  </div>
                  <div style={{fontSize:14,lineHeight:1.9,color:C.text,whiteSpace:"pre-wrap",fontFamily:"sans-serif"}}>{assessment}</div>
                </div>
                <div style={{marginTop:16,background:C.beige,borderRadius:12,border:`1px solid ${C.border}`,padding:16,fontSize:12,color:C.textLight,lineHeight:1.7,fontFamily:"sans-serif"}}>⚠️ {t.disclaimer}</div>
              </div>
            )}
          </div>
        )}
        {tab==="doctor"&&(
          <div>
            {!loggedIn?(
              <div style={{maxWidth:400,margin:"0 auto"}}>
                <div style={card}>
                  <div style={{textAlign:"center",marginBottom:28}}>
                    <div style={{fontSize:40,marginBottom:12}}>🩺</div>
                    <div style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:6}}>{t.loginTitle}</div>
                    <div style={{fontSize:13,color:C.textLight,fontFamily:"sans-serif"}}>{t.loginSubtitle}</div>
                  </div>
                  <label style={lbl}>{t.passwordLabel}</label>
                  <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pw==="skiniq2024"?(setLoggedIn(true),setPwErr(false)):setPwErr(true))} placeholder={t.passwordPlaceholder} style={{...inp,textAlign:"center",letterSpacing:"4px",marginBottom:12}}/>
                  {pwErr&&<div style={{color:"#C0392B",fontSize:13,marginBottom:12,textAlign:"center",fontFamily:"sans-serif"}}>❌ {t.wrongPassword}</div>}
                  <button onClick={()=>pw==="skiniq2024"?(setLoggedIn(true),setPwErr(false)):setPwErr(true)} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,color:C.white,fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"sans-serif",boxShadow:"0 4px 16px rgba(201,169,110,0.35)"}}>{t.loginBtn}</button>
                  <div style={{textAlign:"center",marginTop:12,fontSize:12,color:C.textMuted,fontFamily:"sans-serif"}}>Password: skiniq2024</div>
                </div>
              </div>
            ):(
              <div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:22,fontWeight:700,color:C.text}}>{t.doctorTitle}</div>
                  <div style={{fontSize:13,color:C.textLight,fontFamily:"sans-serif"}}>{t.doctorSubtitle}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:selected?"1fr 1.4fr":"1fr",gap:20}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:C.textLight,marginBottom:12,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"sans-serif"}}>{t.consultationsLabel} ({consultations.length})</div>
                    {consultations.length===0?(
                      <div style={{...card,textAlign:"center",padding:40}}>
                        <div style={{fontSize:32,marginBottom:8}}>📋</div>
                        <div style={{color:C.textMuted,fontFamily:"sans-serif",fontSize:14}}>{t.noConsultations}</div>
                      </div>
                    ):consultations.map(c=>(
                      <div key={c.id} onClick={()=>{setSelected(c);setNote(null);}} style={{...card,marginBottom:10,cursor:"pointer",padding:"16px 20px",borderColor:selected?.id===c.id?C.gold:C.border,background:selected?.id===c.id?"#FFFBF5":C.white,transition:"all 0.2s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{fontWeight:700,color:C.text,fontSize:15,fontFamily:"sans-serif"}}>{c.name}</div>
                          <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,fontWeight:700,fontFamily:"sans-serif",background:c.status==="reviewed"?"rgba(122,158,126,0.15)":"rgba(196,136,74,0.15)",color:c.status==="reviewed"?C.success:C.warning}}>{c.status==="reviewed"?t.reviewed:t.pending}</span>
                        </div>
                        <div style={{fontSize:12,color:C.textMuted,marginTop:4,fontFamily:"sans-serif"}}>{c.age}y · {c.gender} · {c.time}</div>
                        <div style={{fontSize:12,color:C.textLight,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"sans-serif"}}>{c.symptoms}</div>
                      </div>
                    ))}
                  </div>
                  {selected&&(
                    <div style={card}>
                      <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:4}}>{selected.name}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginBottom:20,paddingBottom:16,borderBottom:`1px solid ${C.border}`,fontFamily:"sans-serif"}}>{selected.age}y · {selected.gender} · {selected.duration}</div>
                      <div style={{fontSize:11,fontWeight:700,color:C.textLight,marginBottom:6,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"sans-serif"}}>Symptoms</div>
                      <div style={{fontSize:13,color:C.text,marginBottom:16,lineHeight:1.7,fontFamily:"sans-serif"}}>{selected.symptoms}</div>
                      <div style={{fontSize:11,fontWeight:700,color:C.textLight,marginBottom:6,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"sans-serif"}}>AI Assessment</div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.8,marginBottom:20,background:C.beige,borderRadius:10,padding:14,whiteSpace:"pre-wrap",maxHeight:180,overflowY:"auto",fontFamily:"sans-serif"}}>{selected.assessment}</div>
                      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                        <button onClick={()=>handleNote(selected)} disabled={genNote} style={{padding:"10px 16px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,color:C.white,fontWeight:700,fontSize:13,flex:1,fontFamily:"sans-serif"}}>
                          {genNote?`⏳ ${t.generatingNote}`:`📝 ${t.generateNote}`}
                        </button>
                        {selected.status==="pending"&&(
                          <button onClick={()=>{setConsultations(p=>p.map(c=>c.id===selected.id?{...c,status:"reviewed"}:c));setSelected(s=>({...s,status:"reviewed"}));}} style={{padding:"10px 16px",borderRadius:10,border:`1.5px solid ${C.success}`,background:"rgba(122,158,126,0.1)",color:C.success,fontWeight:700,fontSize:13,cursor:"pointer",flex:1,fontFamily:"sans-serif"}}>✅ {t.markReviewed}</button>
                        )}
                      </div>
                      {note&&<div style={{fontSize:12,color:C.text,lineHeight:1.9,whiteSpace:"pre-wrap",background:C.beige,borderRadius:10,padding:14,maxHeight:240,overflowY:"auto",fontFamily:"sans-serif"}}>{note}</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{height:40}}/>
      </div>
    </div>
  );
                     }
