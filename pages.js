import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const EDUCATION = ["B.Tech / B.E.", "BCA / B.Sc (CS/IT)", "MBA / PGDM", "B.Com / M.Com", "B.A. / M.A.", "Diploma / ITI", "12th Pass / Intermediate", "Other Graduate / Post-Graduate"];
const SALARY = ["₹10,000 - ₹15,000", "₹15,000 - ₹25,000", "₹25,000 - ₹40,000", "₹40,000 - ₹60,000", "₹60,000+"];
const SECTORS = [
  { id: "it", en: "IT / Software", hi: "आईटी / सॉफ़्टवेयर" },
  { id: "digital", en: "Digital Marketing", hi: "डिजिटल मार्केटिंग" },
  { id: "sales", en: "Sales & BD", hi: "सेल्स" },
  { id: "finance", en: "Finance / Accounts", hi: "फ़ाइनेंस" },
  { id: "green", en: "Green Energy / Solar", hi: "सोलर एनर्जी" },
  { id: "ev", en: "EV & Manufacturing", hi: "EV / मैन्युफैक्चरिंग" },
  { id: "ecom", en: "E-commerce / Logistics", hi: "ई-कॉमर्स" },
  { id: "health", en: "Healthcare / Pharma", hi: "हेल्थकेयर" },
  { id: "edu", en: "Education / EdTech", hi: "एडटेक" },
  { id: "content", en: "Content / Media", hi: "कंटेंट / मीडिया" },
  { id: "govt", en: "Govt / PSU", hi: "सरकारी नौकरी" },
  { id: "freelance", en: "Freelance / Own Business", hi: "फ्रीलांस / खुद का काम" },
];

const T = {
  en: {
    sub: "India's Free Career Intelligence Tool",
    hero1: "Find your", hero2: "real career.",
    heroP: "Tell us where you are. We show you the skill gaps and a real roadmap to get where you want.",
    s1: "Step 1: Background", s2: "Step 2: Skills", s3: "Step 3: Goal",
    fName: "Full Name *", fNamePh: "e.g. Rahul Sharma",
    fEdu: "Highest Education *", fCity: "City / Town *", fCityPh: "e.g. Agra, Jaipur",
    fSkills: "Actual Skills (be honest) *", fSkillsPh: "e.g. Basic Python, Excel, talking to people...",
    fExp: "Work Experience", fExpPh: "e.g. 6 months internship at CA firm",
    fSector: "Target Industry *", fSalary: "Expected Salary", fExtra: "Anything else?",
    next: "Next", back: "← Back", go: "Analyze My Profile",
    loading: ["Reading profile...", "Checking skills...", "Analyzing market demand...", "Identifying gaps...", "Building roadmap..."],
    loadSub: "AI is thinking, please wait...",
    required: "Please fill all required fields.",
    errMsg: "Something went wrong. Please try again.",
    reset: "← Analyze another profile",
    langBtn: "हिंदी में देखें"
  },
  hi: {
    sub: "भारत का मुफ़्त करियर मार्गदर्शन",
    hero1: "अपनी", hero2: "असली नौकरी ढूंढो।",
    heroP: "बताओ अभी कहाँ हो - हम बताएंगे कहाँ जाना है। सही रास्ता और असली कमियाँ।",
    s1: "चरण 1: परिचय", s2: "चरण 2: स्किल्स", s3: "चरण 3: लक्ष्य",
    fName: "पूरा नाम *", fNamePh: "जैसे: राहुल शर्मा",
    fEdu: "उच्चतम शिक्षा *", fCity: "शहर / कस्बा *", fCityPh: "जैसे: आगरा, जयपुर",
    fSkills: "वास्तविक कौशल *", fSkillsPh: "जैसे: बेसिक पायथन, एक्सेल...",
    fExp: "कार्य अनुभव", fExpPh: "जैसे: सीए फर्म में इंटर्नशिप",
    fSector: "लक्ष्य उद्योग *", fSalary: "अपेक्षित वेतन", fExtra: "कुछ और?",
    next: "आगे", back: "← वापस", go: "प्रोफ़ाइल विश्लेषण करें",
    loading: ["प्रोफ़ाइल पढ़ रहे हैं...", "स्किल्स जाँच रहे हैं...", "बाज़ार की माँग देख रहे हैं...", "कमियाँ पहचान रहे हैं...", "रोडमैप बना रहे हैं..."],
    loadSub: "AI सोच रहा है, कृपया प्रतीक्षा करें...",
    required: "कृपया सभी आवश्यक फ़ील्ड भरें।",
    errMsg: "कुछ गड़बड़ हो गई।",
    reset: "← नया प्रोफ़ाइल देखें",
    langBtn: "View in English"
  }
};

export default function SkillBridge() {
  const [lang, setLang] = useState("en");
  const [step, setStep] = useState(1);
  const [phase, setPhase] = useState("form"); // form | loading | result
  const [form, setForm] = useState({ name: "", edu: "", city: "", skills: "", exp: "", salary: "", extra: "" });
  const [sector, setSector] = useState("");
  const [loadIdx, setLoadIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [barsReady, setBarsReady] = useState(false);

  const t = T[lang];

  useEffect(() => {
    if (phase === "loading") {
      const interval = setInterval(() => setLoadIdx(i => (i + 1) % t.loading.length), 2000);
      return () => clearInterval(interval);
    }
  }, [phase, t]);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (step === 1 && (!form.name.trim() || !form.edu || !form.city.trim())) { setError(t.required); return false; }
    if (step === 2 && !form.skills.trim()) { setError(t.required); return false; }
    if (step === 3 && !sector) { setError(t.required); return false; }
    setError(""); return true;
  };

  const analyze = async () => {
    if (!validate()) return;
    setPhase("loading");
    const sectorObj = SECTORS.find(s => s.id === sector);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: form, sectorName: sectorObj.en }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setPhase("result");
      setTimeout(() => setBarsReady(true), 200);
    } catch (e) {
      setError(t.errMsg);
      setPhase("form");
    }
  };

  const reset = () => {
    setForm({ name: "", edu: "", city: "", skills: "", exp: "", salary: "", extra: "" });
    setSector(""); setStep(1); setResult(null); setPhase("form"); setBarsReady(false);
  };

  return (
    <div className="sb">
      <Head>
        <title>SkillBridge | AI Career Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>

      <div className="sb-hdr">
        <div className="sb-logo">SKILL<span>BRIDGE</span></div>
        <button className="sb-1btn" onClick={() => setLang(l => l === "en" ? "hi" : "en")}>{t.langBtn}</button>
      </div>

      {phase === "form" && (
        <>
          {step === 1 && (
            <div className="sb-hero">
              <div className="sb-ey">{t.sub}</div>
              <div className="sb-h1">{t.hero1} <em>{t.hero2}</em></div>
              <div className="sb-hp">{t.heroP}</div>
            </div>
          )}

          <div className="sb-prog">
            {[1, 2, 3].map(n => <div key={n} className={`sb-pb ${step >= n ? 'on' : ''}`} />)}
          </div>

          <div className="sb-wrap">
            {error && <div className="sb-err">{error}</div>}
            <div className="sb-pnl">
              <div className="sb-pnl-hd">
                <div className="sb-sdot">{step}</div>
                {step === 1 ? t.s1 : step === 2 ? t.s2 : t.s3}
              </div>
              <div className="sb-pbody">
                {step === 1 && (
                  <div className="sb-g2">
                    <div>
                      <label className="sb-lbl first">{t.fName}</label>
                      <input className="sb-inp" value={form.name} onChange={e => upd("name", e.target.value)} placeholder={t.fNamePh} />
                    </div>
                    <div>
                      <label className="sb-lbl first">{t.fEdu}</label>
                      <select className="sb-inp" value={form.edu} onChange={e => upd("edu", e.target.value)}>
                        <option value="">Select degree</option>
                        {EDUCATION.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div style={{gridColumn: 'span 2'}}>
                      <label className="sb-lbl">{t.fCity}</label>
                      <input className="sb-inp" value={form.city} onChange={e => upd("city", e.target.value)} placeholder={t.fCityPh} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <label className="sb-lbl first">{t.fSkills}</label>
                    <textarea className="sb-inp sb-ta" style={{ minHeight: 120 }} value={form.skills} onChange={e => upd("skills", e.target.value)} placeholder={t.fSkillsPh} />
                    <label className="sb-lbl">{t.fExp}</label>
                    <textarea className="sb-inp sb-ta" style={{ minHeight: 80 }} value={form.exp} onChange={e => upd("exp", e.target.value)} placeholder={t.fExpPh} />
                  </>
                )}

                {step === 3 && (
                  <>
                    <label className="sb-lbl first">{t.fSector}</label>
                    <div className="sb-chips">
                      {SECTORS.map(s => (
                        <div key={s.id} className={`sb-chip ${sector === s.id ? 'on' : ''}`} onClick={() => setSector(s.id)}>
                          {lang === "hi" ? s.hi : s.en}
                        </div>
                      ))}
                    </div>
                    <label className="sb-lbl" style={{ marginTop: 20 }}>{t.fSalary}</label>
                    <select className="sb-inp" value={form.salary} onChange={e => upd("salary", e.target.value)}>
                      <option value="">Select range</option>
                      {SALARY.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <label className="sb-lbl">{t.fExtra}</label>
                    <textarea className="sb-inp sb-ta" style={{ minHeight: 70 }} value={form.extra} onChange={e => upd("extra", e.target.value)} placeholder="Any other details..." />
                  </>
                )}
              </div>
            </div>

            <div className="sb-nav">
              {step > 1 && <button className="sb-btn sb-btn-g" onClick={() => setStep(s => s - 1)}>{t.back}</button>}
              {step < 3 ? (
                <button className="sb-btn sb-btn-p" onClick={() => { if(validate()) setStep(s => s + 1) }}>{t.next}</button>
              ) : (
                <button className="sb-btn sb-btn-p" onClick={analyze}>{t.go}</button>
              )}
            </div>
          </div>
        </>
      )}

      {phase === "loading" && (
        <div className="sb-load">
          <div className="sb-spin" />
          <div className="sb-lmsg">{t.loading[loadIdx]}</div>
          <div className="sb-lsub">{t.loadSub}</div>
        </div>
      )}

      {phase === "result" && result && (
        <div className="sb-res">
          <div className="sb-res-top">
            <div>
              <div className="sb-res-name">{form.name}</div>
              <div className="sb-res-meta">{form.edu} • {form.city}</div>
            </div>
            <div className="sb-scorebox">
              <div className="sb-scorenum" style={{ color: result.scoreColor === 'green' ? '#4ec469' : result.scoreColor === 'yellow' ? '#d4a435' : '#e05555' }}>
                {result.employabilityScore}
              </div>
              <div className="sb-scorelbl">/ 100</div>
            </div>
          </div>

          <Sec dot="#f5c842" title={`HONEST VERDICT: ${result.verdictTitle}`}>
            <div className="sb-verdict">{result.verdictBody}</div>
          </Sec>

          {result.crossIndustryDetected && (
            <Sec dot="#f5c842" title={`CAREER BRIDGE: ${result.bridgePath.fromField} → ${result.bridgePath.toField}`}>
              <div className="sb-verdict" style={{ fontSize: '13px', marginBottom: '15px' }}>{result.crossIndustryNote}</div>
              <div className="sb-bridge">
                <div className="sb-bridgetitle">Switch Plan</div>
                <ul className="sb-bsteps">
                  {result.bridgePath.steps.map((s, i) => (
                    <li key={i}>
                      <div className="sb-bnum">{s.n || i + 1}</div>
                      <div>
                        <span className="sb-bact">{s.action}</span>
                        <span className="sb-bres">{s.resource} • {s.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Sec>
          )}

          <Sec dot="#4ec469" title="YOUR REAL STRENGTHS">
            {result.currentStrengths.map((s, i) => (
              <div key={i} className="sb-barrow">
                <div className="sb-barname">{s.skill} <span className={`sb-mv ${s.mv === 'high' ? 'mv-hi' : s.mv === 'medium' ? 'mv-md' : 'mv-lo'}`}>{s.mv}</span></div>
                <div className="sb-track">
                  <div className="sb-fill" style={{ width: barsReady ? `${s.level}%` : '0%', background: s.mv === 'high' ? '#4ec469' : s.mv === 'medium' ? '#d4a435' : '#c46060' }} />
                </div>
                <div className="sb-barpct">{s.level}%</div>
              </div>
            ))}
          </Sec>

          <Sec dot="#e05555" title="CRITICAL GAPS TO CLOSE">
            <div className="sb-gg">
              {result.criticalGaps.map((g, i) => (
                <div key={i} className={`sb-gc ${g.priority === 'high' ? 'ph' : g.priority === 'medium' ? 'pm' : 'pl'}`}>
                  <div className="sb-gt">{g.skill}</div>
                  <div className="sb-gw">{g.why}</div>
                  <div className="sb-gh">{g.how}</div>
                  <div className="sb-gtime">{g.time}</div>
                </div>
              ))}
            </div>
          </Sec>

          <Sec dot="#4ec469" title="JOB MATCHES FOR YOU">
            {result.jobMatches.map((j, i) => (
              <div key={i} className="sb-job">
                <div className="sb-jobtop">
                  <div className="sb-jobtitle">{j.title}</div>
                  <div className={`sb-mpill ${j.match >= 75 ? 'mhi' : 'mmd'}`}>{j.match}% match</div>
                </div>
                <div className="sb-jobmeta">{j.sector} • {j.salary}</div>
                <div className="sb-jobdesc">{j.why}</div>
                <div className="sb-jobcta">
                  <strong>Pehla Kadam:</strong> {j.first}
                  <span>Apply on: {j.where}</span>
                </div>
              </div>
            ))}
          </Sec>

          <Sec dot="#f5c842" title="ACTION PLAN (AAJ SE SHURU KARO)">
            {result.actionPlan.map((a, i) => (
              <div key={i} className="sb-action">
                <div className="sb-anum">{i + 1}</div>
                <div>
                  <div className="sb-aweek">{a.when}</div>
                  <div className="sb-atitle">{a.title}</div>
                  <div className="sb-adet">{a.detail}</div>
                </div>
              </div>
            ))}
          </Sec>

          <Sec dot="#f5c842" title="HIDDEN OPPORTUNITY">
            <div className="sb-verdict">{result.hiddenOpportunity}</div>
          </Sec>

          <Sec dot="#8b949e" title="PLATFORMS TO APPLY ON">
            <div className="sb-plats">
              {result.platforms.map((p, i) => <div key={i} className="sb-plat">{p}</div>)}
            </div>
          </Sec>

          <button className="sb-reset" onClick={reset}>{t.reset}</button>
        </div>
      )}
    </div>
  );
}

function Sec({ dot, title, children }) {
  return (
    <div className="sb-sec">
      <div className="sb-shd">
        <div className="sb-dot" style={{ background: dot }} />
        {title}
      </div>
      <div className="sb-sbdy">{children}</div>
    </div>
  );
}