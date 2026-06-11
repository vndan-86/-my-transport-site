import { useState, useEffect } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xzdqzprd";
//const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby0ZVCF2M7Q2dj8cYxcf803Lnvg2T4VdYNX9-ipQURvlutvqwMj4VfqOGrfRH8z-bsU/exec";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzlcw3h2MsdyttgtwoFwzOJrf1zPPWzxWj1AX1MKX6qyjvguZBxpX7ECG0UzmILABM/exec";
const SUPABASE_URL = "https://pblyeugrcizcrrxzdkuo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHlldWdyY2l6Y3JyeHpka3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjEzMDMsImV4cCI6MjA5NjE5NzMwM30.WmoGZPMIiRzA-hKwKjYUlaiyn4lv3-TxQc1jxEOOwtQ";

const sbFetch = (path, opts={}) => fetch(`${SUPABASE_URL}${path}`, {
  ...opts,
  headers: { "Content-Type":"application/json", "apikey":SUPABASE_KEY, "Authorization":`Bearer ${SUPABASE_KEY}`, ...(opts.headers||{}) },
});
async function loadFromSupabase() {
  try {
    const res = await sbFetch("/rest/v1/site_content?id=eq.1&select=content");
    const data = await res.json();
    const c = data?.[0]?.content;
    if (c && typeof c === "object" && c.company) return c;
  } catch {}
  return null;
}
async function saveToSupabase(content) {
  await sbFetch("/rest/v1/site_content?id=eq.1", {
    method: "PATCH",
    headers: { "Prefer":"return=minimal" },
    body: JSON.stringify({ content, updated_at: new Date().toISOString() }),
  });
}

// Finland flag colors: Blue #003580, White #FFFFFF
const DEFAULT_CONTENT = {
  company: {
    name: "Easy Move Finland",
    tagline: "Trusted Home & Office Removals",
    description: "Your trusted moving partner in Finland. Residential & commercial moving — Reliable | Fast | Insured.",
    phone: "+358 449 329 719",
    email: "info@easymovefinland.fi",
    address: "Helsinki, Finland",
    founded: "2018",
    facebook: "https://www.facebook.com/easymovefinland",
    whatsapp: "+358449329719",
    logo: "/logo.jpg",
  },
  hero: {
    headline: "Your Trusted\nMoving Partner\nin Finland",
    subheadline: "Residential & Commercial Moving — Reliable | Fast | Insured",
    cta: "Get a Free Quote",
    bgImage: "/hinh_nen.jpg",
  },
  services: [
    { id:1, icon:"🚛", title:"Full Moving Service", desc:"All-In-One Package — Everything included: packing, loading, transport, unloading and furniture placement. Starting from 47€/hour." },
    { id:2, icon:"📦", title:"Standard Moving Service", desc:"Professional loading, transport and unloading of your belongings. Fast and reliable. Starting from 36€/hour." },
    { id:3, icon:"🧹", title:"Move-In & Move-Out Cleaning", desc:"Deep cleaning for your old or new home. Leave it spotless. Starting from 33€/hour per cleaner." },
    { id:4, icon:"🔧", title:"Furniture Assembly & Installation", desc:"Expert assembly and installation of all types of furniture — IKEA, flat-pack and more. Starting from 24€/hour per installer." },
    { id:5, icon:"➕", title:"Additional Options", desc:"Need something extra? Packing materials, storage, special item handling — we customize the service to fit your needs." },
  ],
  about: {
    title: "Why Choose Easy Move Finland?",
    body: "Easy Move Finland is a trusted moving company based in Helsinki. We provide professional, reliable, and affordable moving services for homes and offices across Finland.\n\nOur experienced team ensures your belongings are handled with the utmost care. We are fully insured, punctual, and committed to making your move as smooth and stress-free as possible.",
    image: "/logo.jpg",
    badge1: "✅ Fully Insured",
    badge2: "⏱️ On-Time Delivery",
    badge3: "💪 Experienced Team",
  },
  testimonials: [
    { id:1, name:"Mikael Leinonen", company:"Helsinki", text:"Easy Move Finland made our house move completely stress-free. Professional team, on time, and very careful with our furniture!" },
    { id:2, name:"Sarah Thompson", company:"Espoo", text:"Excellent service! They moved our office over the weekend with zero disruption to our business. Highly recommend." },
    { id:3, name:"Nguyen Van An", company:"Tampere", text:"Very professional and friendly team. They packed everything carefully and delivered on time. Great value for money!" },
  ],
  contact: {
    title: "Get a Free Quote",
    subtitle: "Fill out the form and we'll get back to you within 24 hours.",
  },
  footer: {
    copy: "© 2024 Easy Move Finland. All rights reserved.",
    links: ["Privacy Policy", "Terms of Service"],
  },
  theme: {
    primary: "#003580",
    accent: "#003580",
    dark: "#001f4d",
    light: "#f0f4ff",
    white: "#ffffff",
  },
  pricing: {
    title: "🚚 Intercity Moving Prices 2026",
    subtitle: "Affordable long-distance moving from Tampere to all major cities in Finland",
    customTitle: "📍 Custom Routes Available",
    customDesc: "If your destination is not listed, we offer custom pricing based on exact km distance and load size.",
    customBtn: "Get Custom Quote",
    routes: [
      {id:1,emoji:"🌿",from:"Tampere",to:"Helsinki",km:"~180 km",price:"€279"},
      {id:2,emoji:"✨",from:"Tampere",to:"Turku",km:"~170 km",price:"€269"},
      {id:3,emoji:"🌸",from:"Tampere",to:"Lahti",km:"~120 km",price:"€169"},
      {id:4,emoji:"🍃",from:"Tampere",to:"Hämeenlinna",km:"~75 km",price:"€129"},
      {id:5,emoji:"🌼",from:"Tampere",to:"Pori",km:"~140 km",price:"€239"},
      {id:6,emoji:"🌷",from:"Tampere",to:"Jyväskylä",km:"~150 km",price:"€229"},
      {id:7,emoji:"🌙",from:"Tampere",to:"Kouvola",km:"~210 km",price:"€289"},
      {id:8,emoji:"💫",from:"Tampere",to:"Mikkeli",km:"~230 km",price:"€309"},
      {id:9,emoji:"🌻",from:"Tampere",to:"Lappeenranta",km:"~260 km",price:"€339"},
      {id:10,emoji:"🍀",from:"Tampere",to:"Vaasa",km:"~240 km",price:"€319"},
      {id:11,emoji:"🪻",from:"Tampere",to:"Kuopio",km:"~290 km",price:"€379"},
      {id:12,emoji:"🌲",from:"Tampere",to:"Joensuu",km:"~390 km",price:"€489"},
      {id:13,emoji:"❄️",from:"Tampere",to:"Oulu",km:"~500 km",price:"€629"},
    ],
  },
};

function loadContent() {
  try { const s = localStorage.getItem("site_content"); if(s) return JSON.parse(s); } catch {}
  return DEFAULT_CONTENT;
}

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const h = () => setM(window.innerWidth < 768); window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h); },[]);
  return m;
}

const IS = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #d0d7e3", fontSize:14, marginBottom:12, boxSizing:"border-box", fontFamily:"inherit" };
const AIS = { width:"100%", padding:"8px 10px", borderRadius:6, border:"1px solid #d0d7e3", fontSize:14, marginBottom:10, background:"#fff", color:"#1a2540", boxSizing:"border-box" };
const LS = { fontSize:12, fontWeight:600, color:"#5a6a8a", marginBottom:4, display:"block", textTransform:"uppercase", letterSpacing:"0.05em" };

function Field({ label, value, onChange, type="text", rows }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={LS}>{label}</label>
      {rows ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} style={{...AIS,resize:"vertical"}} />
        : type==="color" ? (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{ width:44,height:34,border:"1px solid #d0d7e3",borderRadius:6,cursor:"pointer",padding:2 }} />
            <span style={{ fontSize:12,color:"#8899bb" }}>{value}</span>
            <div style={{ marginLeft:"auto",width:46,height:26,borderRadius:6,background:value,border:"1px solid rgba(0,0,0,0.1)" }} />
          </div>
        ) : <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={AIS} />}
    </div>
  );
}
function CardWrap({ title, onRemove, children }) {
  return (
    <div style={{ background:"#fff",borderRadius:10,padding:16,marginBottom:12,border:"1px solid #e0e7f0" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <span style={{ fontWeight:700,color:"#003580",fontSize:13 }}>{title}</span>
        {onRemove && <button onClick={onRemove} style={{ background:"#fee",border:"1px solid #fcc",color:"#c44",padding:"3px 9px",borderRadius:5,cursor:"pointer",fontSize:12 }}>Remove</button>}
      </div>
      {children}
    </div>
  );
}
function STitle({ children }) { return <h2 style={{ marginBottom:18,color:"#1a2540",fontSize:19,borderBottom:"2px solid #003580",paddingBottom:8 }}>{children}</h2>; }

// ── ADMIN ──
function AdminPanel({ content, onSave, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(content)));
  const [tab, setTab] = useState("company");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);
  const isMobile = useIsMobile();

  const tabs = [
    {key:"company",label:"Company Info",icon:"🏢"},
    {key:"hero",label:"Hero Section",icon:"🖼️"},
    {key:"services",label:"Services",icon:"🚛"},
    {key:"pricing",label:"Pricing Table",icon:"💰"},
    {key:"about",label:"About",icon:"📝"},
    {key:"testimonials",label:"Testimonials",icon:"💬"},
    {key:"contact",label:"Contact & Footer",icon:"📞"},
    {key:"theme",label:"Colors",icon:"🎨"},
  ];

  const save = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="website-content.json"; a.click();
    URL.revokeObjectURL(url);
  };
  const importJSON = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = (ev) => { try { const p=JSON.parse(ev.target.result); setData(p); onSave(p); alert("✅ Import successful!"); } catch { alert("❌ Invalid JSON file."); } };
    r.readAsText(file); e.target.value="";
  };
  const upd = (s,f,v) => setData(p=>({...p,[s]:{...p[s],[f]:v}}));
  const updArr = (s,i,f,v) => setData(p=>{ const a=[...p[s]]; a[i]={...a[i],[f]:v}; return {...p,[s]:a}; });
  const addArr = (s,t) => setData(p=>({...p,[s]:[...p[s],{...t,id:Date.now()}]}));
  const delArr = (s,i) => setData(p=>({...p,[s]:p[s].filter((_,j)=>j!==i)}));
  const addBtn = (label,fn) => <button onClick={fn} style={{ padding:"8px 18px",background:"#003580",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:13,marginTop:4 }}>+ {label}</button>;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,21,64,0.92)",zIndex:9999,display:"flex",flexDirection:isMobile?"column":"row",fontFamily:"'Segoe UI',sans-serif" }}>
      {isMobile && (
        <div style={{ background:"#001f4d",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <span style={{ color:"#fff",fontWeight:800,fontSize:15 }}>⚙️ Admin Panel</span>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{ padding:"6px 12px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontSize:13 }}>{sideOpen?"Hide":"Menu"}</button>
            <button onClick={save} style={{ padding:"6px 14px",background:saved?"#22c55e":saving?"#6b7280":"#003580",border:"none",borderRadius:6,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13 }}>{saved?"✅":saving?"⏳":"💾"}</button>
            <button onClick={onClose} style={{ padding:"6px 12px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontSize:13 }}>✕</button>
          </div>
        </div>
      )}
      {(!isMobile || sideOpen) && (
        <div style={{ width:isMobile?"100%":220,background:"#001f4d",display:"flex",flexDirection:"column",flexShrink:0,maxHeight:isMobile?"50vh":"100%" }}>
          {!isMobile && (
            <div style={{ padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontWeight:800,fontSize:15,color:"#fff" }}>⚙️ Admin Panel</div>
              <div style={{ fontSize:11,color:"#8899bb",marginTop:3 }}>Easy Move Finland</div>
            </div>
          )}
          <nav style={{ flex:1,overflowY:"auto",padding:"6px 0",display:isMobile?"grid":"block",gridTemplateColumns:isMobile?"1fr 1fr":"unset" }}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>{ setTab(t.key); if(isMobile) setSideOpen(false); }} style={{
                width:"100%",textAlign:"left",padding:isMobile?"8px 12px":"9px 14px",
                background:tab===t.key?"rgba(255,255,255,0.15)":"transparent",
                border:"none",borderLeft:!isMobile&&tab===t.key?"3px solid #fff":"3px solid transparent",
                color:tab===t.key?"#fff":"#8899bb",cursor:"pointer",fontSize:12,display:"flex",gap:6,alignItems:"center",
              }}>
                <span style={{ fontSize:14 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
          {!isMobile && (
            <div style={{ padding:14,borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",flexDirection:"column",gap:8 }}>
              <button onClick={save} disabled={saving} style={{ padding:"10px",background:saved?"#22c55e":saving?"#6b7280":"#003580",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#fff",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontSize:14 }}>{saved?"✅ Saved!":saving?"⏳ Saving...":"💾 Save Changes"}</button>
              <button onClick={exportJSON} style={{ padding:"9px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13 }}>📥 Export JSON</button>
              <label style={{ padding:"9px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#8899bb",cursor:"pointer",fontSize:13,textAlign:"center",display:"block" }}>
                📂 Import JSON<input type="file" accept=".json" onChange={importJSON} style={{ display:"none" }} />
              </label>
              <button onClick={onClose} style={{ padding:"8px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#5a6a8a",cursor:"pointer",fontSize:13 }}>✕ Close Admin</button>
            </div>
          )}
        </div>
      )}
      {(!isMobile || !sideOpen) && (
        <div style={{ flex:1,overflowY:"auto",padding:isMobile?"20px 16px":"28px 36px",background:"#f4f7fc" }}>
          <div style={{ maxWidth:700 }}>
            {tab==="company" && <><STitle>🏢 Company Information</STitle>
              <Field label="Company Name" value={data.company.name} onChange={v=>upd("company","name",v)} />
              <Field label="Tagline" value={data.company.tagline} onChange={v=>upd("company","tagline",v)} />
              <Field label="Description" value={data.company.description} onChange={v=>upd("company","description",v)} rows={3} />
              <Field label="Phone" value={data.company.phone} onChange={v=>upd("company","phone",v)} />
              <Field label="Email" value={data.company.email} onChange={v=>upd("company","email",v)} />
              <Field label="Address" value={data.company.address} onChange={v=>upd("company","address",v)} />
              <Field label="Founded Year" value={data.company.founded} onChange={v=>upd("company","founded",v)} />
              <Field label="Facebook URL" value={data.company.facebook} onChange={v=>upd("company","facebook",v)} />
              <Field label="WhatsApp Number (with country code, no +)" value={data.company.whatsapp} onChange={v=>upd("company","whatsapp",v)} />
              <Field label="Logo Image Path (e.g. /logo.jpg)" value={data.company.logo} onChange={v=>upd("company","logo",v)} />
            </>}
            {tab==="hero" && <><STitle>🖼️ Hero Section</STitle>
              <Field label="Main Headline (\\n = new line)" value={data.hero.headline} onChange={v=>upd("hero","headline",v)} rows={3} />
              <Field label="Sub-headline" value={data.hero.subheadline} onChange={v=>upd("hero","subheadline",v)} rows={2} />
              <Field label="CTA Button Text" value={data.hero.cta} onChange={v=>upd("hero","cta",v)} />
              <Field label="Background Image Path (e.g. /hinh_nen.jpg)" value={data.hero.bgImage} onChange={v=>upd("hero","bgImage",v)} />
            </>}
            {tab==="services" && <><STitle>🚛 Services</STitle>
              {data.services.map((s,i)=>(
                <CardWrap key={s.id} title={`Service #${i+1}`} onRemove={()=>delArr("services",i)}>
                  <div style={{ display:"flex",gap:8 }}>
                    <div style={{ width:70 }}><Field label="Icon" value={s.icon} onChange={v=>updArr("services",i,"icon",v)} /></div>
                    <div style={{ flex:1 }}><Field label="Title" value={s.title} onChange={v=>updArr("services",i,"title",v)} /></div>
                  </div>
                  <Field label="Description" value={s.desc} onChange={v=>updArr("services",i,"desc",v)} rows={2} />
                </CardWrap>
              ))}
              {addBtn("Add Service",()=>addArr("services",{icon:"📦",title:"New Service",desc:"Service description."}))}
            </>}
            {tab==="about" && <><STitle>📝 About Section</STitle>
              <Field label="Title" value={data.about.title} onChange={v=>upd("about","title",v)} />
              <Field label="Content (\\n\\n = new paragraph)" value={data.about.body} onChange={v=>upd("about","body",v)} rows={6} />
              <Field label="Image Path (e.g. /logo.jpg)" value={data.about.image} onChange={v=>upd("about","image",v)} />
              <Field label="Badge 1" value={data.about.badge1} onChange={v=>upd("about","badge1",v)} />
              <Field label="Badge 2" value={data.about.badge2} onChange={v=>upd("about","badge2",v)} />
              <Field label="Badge 3" value={data.about.badge3} onChange={v=>upd("about","badge3",v)} />
            </>}
            {tab==="testimonials" && <><STitle>💬 Testimonials</STitle>
              {data.testimonials.map((t,i)=>(
                <CardWrap key={t.id} title={`Testimonial #${i+1}`} onRemove={()=>delArr("testimonials",i)}>
                  <Field label="Name" value={t.name} onChange={v=>updArr("testimonials",i,"name",v)} />
                  <Field label="City/Company" value={t.company} onChange={v=>updArr("testimonials",i,"company",v)} />
                  <Field label="Review" value={t.text} onChange={v=>updArr("testimonials",i,"text",v)} rows={3} />
                </CardWrap>
              ))}
              {addBtn("Add Testimonial",()=>addArr("testimonials",{name:"Customer Name",company:"City",text:"Review text."}))}
            </>}
            {tab==="pricing" && <>
              <STitle>💰 Pricing Table</STitle>
              <Field label="Section Title" value={data.pricing?.title||""} onChange={v=>upd("pricing","title",v)} />
              <Field label="Section Subtitle" value={data.pricing?.subtitle||""} onChange={v=>upd("pricing","subtitle",v)} rows={2} />
              <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid #e0e7f0",marginBottom:16 }}>
                <label style={{...LS,marginBottom:12}}>CUSTOM ROUTE BANNER</label>
                <Field label="Banner Title" value={data.pricing?.customTitle||""} onChange={v=>upd("pricing","customTitle",v)} />
                <Field label="Banner Description" value={data.pricing?.customDesc||""} onChange={v=>upd("pricing","customDesc",v)} rows={2} />
                <Field label="Button Text" value={data.pricing?.customBtn||""} onChange={v=>upd("pricing","customBtn",v)} />
              </div>
              <label style={{...LS,marginBottom:12}}>PRICE ROUTES</label>
              {(data.pricing?.routes||[]).map((r,i)=>(
                <CardWrap key={r.id} title={`Route #${i+1}: ${r.from} → ${r.to}`} onRemove={()=>setData(p=>({...p,pricing:{...p.pricing,routes:p.pricing.routes.filter((_,j)=>j!==i)}}))}>
                  <div style={{ display:"grid",gridTemplateColumns:"60px 1fr 1fr",gap:8 }}>
                    <Field label="Icon" value={r.emoji} onChange={v=>{ const a=[...data.pricing.routes]; a[i]={...a[i],emoji:v}; setData(p=>({...p,pricing:{...p.pricing,routes:a}})); }} />
                    <Field label="From" value={r.from} onChange={v=>{ const a=[...data.pricing.routes]; a[i]={...a[i],from:v}; setData(p=>({...p,pricing:{...p.pricing,routes:a}})); }} />
                    <Field label="To" value={r.to} onChange={v=>{ const a=[...data.pricing.routes]; a[i]={...a[i],to:v}; setData(p=>({...p,pricing:{...p.pricing,routes:a}})); }} />
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                    <Field label="Distance" value={r.km} onChange={v=>{ const a=[...data.pricing.routes]; a[i]={...a[i],km:v}; setData(p=>({...p,pricing:{...p.pricing,routes:a}})); }} />
                    <Field label="Price" value={r.price} onChange={v=>{ const a=[...data.pricing.routes]; a[i]={...a[i],price:v}; setData(p=>({...p,pricing:{...p.pricing,routes:a}})); }} />
                  </div>
                </CardWrap>
              ))}
              <button onClick={()=>setData(p=>({...p,pricing:{...p.pricing,routes:[...(p.pricing?.routes||[]),{id:Date.now(),emoji:"🚛",from:"City A",to:"City B",km:"~100 km",price:"€199"}]}}))} style={{ padding:"8px 18px",background:"#003580",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:13,marginTop:4 }}>+ Add Route</button>
            </>}
            {tab==="contact" && <><STitle>📞 Contact & Footer</STitle>
              <Field label="Form Title" value={data.contact.title} onChange={v=>upd("contact","title",v)} />
              <Field label="Form Subtitle" value={data.contact.subtitle} onChange={v=>upd("contact","subtitle",v)} rows={2} />
              <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid #e0e7f0" }}>
                <label style={{...LS,marginBottom:10}}>FOOTER</label>
                <Field label="Copyright" value={data.footer.copy} onChange={v=>setData(p=>({...p,footer:{...p.footer,copy:v}}))} />
                {data.footer.links.map((l,i)=>(
                  <Field key={i} label={`Footer Link #${i+1}`} value={l} onChange={v=>{ const a=[...data.footer.links]; a[i]=v; setData(p=>({...p,footer:{...p.footer,links:a}})); }} />
                ))}
              </div>
            </>}
            {tab==="theme" && <><STitle>🎨 Colors</STitle>
              <div style={{ background:"#fff",borderRadius:12,padding:18,border:"1px solid #e0e7f0" }}>
                <p style={{ fontSize:13,color:"#5a6a8a",marginBottom:16 }}>Finland flag colors: Blue #003580 | White #FFFFFF</p>
                {[["primary","Primary Blue"],["dark","Dark Blue (navbar/footer)"],["light","Light Background"]].map(([f,l])=>(
                  <Field key={f} label={l} value={data.theme[f]} onChange={v=>upd("theme",f,v)} type="color" />
                ))}
              </div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── QUOTE MODAL ──
function QuoteModal({ onClose, theme }) {
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [form,setForm]=useState({name:"",email:"",phone:"",from:"",to:"",date:"",service:"",message:""});
  const set=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const submit=async()=>{
    if(!form.name||!form.email||!form.phone){setError("Please fill in Name, Email and Phone.");return;}
    setError("");setLoading(true);
    try {
      await Promise.allSettled([
        fetch(FORMSPREE_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({...form,type:"MOVING QUOTE"})}),
        fetch(GOOGLE_SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,company:"",email:form.email,phone:form.phone,service:form.service,origin:form.from,destination:form.to,cargo:form.message,type:"MOVING QUOTE"})}),
      ]);
      setSubmitted(true);
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };
  const iS = {...IS, marginBottom:14};
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:500,width:"100%",maxHeight:"92vh",overflowY:"auto" }}>
        {submitted ? (
          <div style={{ textAlign:"center",padding:"24px 0" }}>
            <div style={{ fontSize:60,marginBottom:14 }}>✅</div>
            <h2 style={{ color:theme.primary }}>Quote Request Sent!</h2>
            <p style={{ color:"#5a6a8a" }}>We'll get back to you within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop:16,padding:"12px 28px",background:theme.primary,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer" }}>Close</button>
          </div>
        ):(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
              <div>
                <h2 style={{ color:theme.primary,margin:0,fontSize:20 }}>Get a Free Quote</h2>
                <p style={{ color:"#8899bb",margin:"4px 0 0",fontSize:13 }}>We'll respond within 24 hours</p>
              </div>
              <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8899bb" }}>✕</button>
            </div>
            {error&&<div style={{ background:"#fee",border:"1px solid #fcc",borderRadius:8,padding:"9px 12px",marginBottom:12,color:"#c44",fontSize:14 }}>⚠️ {error}</div>}
            <input placeholder="Full Name *" value={form.name} onChange={set("name")} style={iS} />
            <input placeholder="Email Address *" type="email" value={form.email} onChange={set("email")} style={iS} />
            <input placeholder="Phone Number *" type="tel" value={form.phone} onChange={set("phone")} style={iS} />
            <select value={form.service} onChange={set("service")} style={iS}>
              <option value="">Select Service Type...</option>
              <option>Full Moving Service (All-In-One) — 47€/hour</option>
              <option>Standard Moving Service — 36€/hour</option>
              <option>Move-In & Move-Out Cleaning — 33€/hour per cleaner</option>
              <option>Furniture Assembly & Installation — 24€/hour per installer</option>
              <option>Additional Options (Custom)</option>
            </select>
            <div style={{ display:"flex",gap:10 }}>
              <input placeholder="Moving From (City) *" value={form.from} onChange={set("from")} style={{...iS,flex:1}} />
              <input placeholder="Moving To (City) *" value={form.to} onChange={set("to")} style={{...iS,flex:1}} />
            </div>
            <input placeholder="Preferred Moving Date" type="date" value={form.date} onChange={set("date")} style={iS} />
            <textarea placeholder="Additional details (size of home, special items, etc.)" rows={3} value={form.message} onChange={set("message")} style={{...iS,resize:"vertical"}} />
            <button onClick={submit} disabled={loading} style={{ width:"100%",padding:"13px",background:loading?"#8899bb":theme.primary,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontSize:16 }}>
              {loading?"⏳ Sending...":"Send Quote Request →"}
            </button>
            <p style={{ fontSize:12,color:"#aab8d4",textAlign:"center",marginTop:10,marginBottom:0 }}>📧 Email + 📊 Google Sheets</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── CONTACT SECTION ──
function ContactSection({ content, BLUE, isMobile }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"", service:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const iS = { width:"100%", padding:"11px 13px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:8, color:"#fff", fontSize:14, marginBottom:12, boxSizing:"border-box", fontFamily:"inherit" };

  const submit = async () => {
    if (!form.name || !form.email || !form.phone) { setError("Please fill in Name, Email and Phone."); return; }
    setError(""); setLoading(true);
    try {
      await Promise.allSettled([
        // Formspree — gửi email thông báo đến easymovefi@gmail.com
        fetch(FORMSPREE_URL, {
          method: "POST",
          headers: { "Content-Type":"application/json", "Accept":"application/json" },
          body: JSON.stringify({
            _replyto: form.email,
            _subject: `New Quote Request from ${form.name}`,
            name: form.name,
            email: form.email,
            phone: form.phone,
            service: form.service,
            message: form.message,
            type: "CONTACT FORM",
          }),
        }),
        // Google Sheets
        fetch(GOOGLE_SHEET_URL, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify({ name:form.name, company:"", email:form.email, phone:form.phone, service:form.service, origin:"", destination:"", cargo:form.message, type:"CONTACT FORM" }),
        }),
      ]);
      setSubmitted(true);
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="grid2" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:isMobile?40:80 }}>
      {/* Left info */}
      <div>
        <h2 style={{ fontSize:isMobile?24:36, fontWeight:900, color:"#fff", marginBottom:12 }}>{content.contact.title}</h2>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, marginBottom:36, lineHeight:1.7 }}>{content.contact.subtitle}</p>
        {[["📞","Phone",content.company.phone],["✉️","Email",content.company.email],["📍","Address",content.company.address]].map(([icon,label,val])=>(
          <div key={label} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:20 }}>
            <div style={{ width:42, height:42, background:"rgba(255,255,255,0.12)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
            <div><div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:3 }}>{label}</div><div style={{ color:"#fff", fontSize:15 }}>{val}</div></div>
          </div>
        ))}
        <div style={{ display:"flex", gap:12, marginTop:28 }}>
          <a href={content.company.facebook} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"rgba(255,255,255,0.12)", color:"#fff", borderRadius:8, fontWeight:600, fontSize:14, border:"1px solid rgba(255,255,255,0.2)", textDecoration:"none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Facebook
          </a>
          <a href={`https://wa.me/${content.company.whatsapp}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"#25D366", color:"#fff", borderRadius:8, fontWeight:600, fontSize:14, textDecoration:"none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Right form */}
      <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:16, padding:isMobile?20:32, border:"1px solid rgba(255,255,255,0.15)", overflow:"visible", position:"relative", zIndex:10 }}>
        {submitted ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
            <h3 style={{ color:"#fff", fontSize:20, marginBottom:10 }}>Request Sent Successfully!</h3>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:14, lineHeight:1.6 }}>
              Thank you <strong style={{ color:"#fff" }}>{form.name}</strong>!<br/>
              We'll get back to you within 24 hours.<br/>
              A confirmation has been sent to <strong style={{ color:"#fff" }}>easymovefi@gmail.com</strong>
            </p>
            <button onClick={()=>{ setSubmitted(false); setForm({name:"",email:"",phone:"",service:"",message:""}); }} style={{ marginTop:20, padding:"10px 24px", background:"rgba(255,255,255,0.15)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", borderRadius:8, cursor:"pointer", fontSize:14 }}>Send Another Request</button>
          </div>
        ) : (
          <>
            {error && <div style={{ background:"rgba(255,100,100,0.2)", border:"1px solid rgba(255,100,100,0.4)", borderRadius:8, padding:"9px 12px", marginBottom:12, color:"#ffcccc", fontSize:14 }}>⚠️ {error}</div>}
            <input placeholder="Full Name *" value={form.name} onChange={set("name")} style={iS} />
            <input placeholder="Email Address *" type="email" value={form.email} onChange={set("email")} style={iS} />
            <input placeholder="Phone Number *" type="tel" value={form.phone} onChange={set("phone")} style={iS} />
            <select value={form.service} onChange={set("service")} style={{ width:"100%",padding:"11px 13px",background:"#1a3a6b",border:"1px solid rgba(255,255,255,0.3)",borderRadius:8,color:form.service?"#fff":"rgba(255,255,255,0.6)",fontSize:14,marginBottom:12,boxSizing:"border-box",cursor:"pointer",appearance:"auto" }}>
              <option value="" style={{ background:"#1a3a6b",color:"rgba(255,255,255,0.6)" }}>Select Service...</option>
              <option value="Full Moving Service (All-In-One) — 47€/hour" style={{ background:"#1a3a6b",color:"#fff" }}>Full Moving Service (All-In-One) — 47€/hour</option>
              <option value="Standard Moving Service — 36€/hour" style={{ background:"#1a3a6b",color:"#fff" }}>Standard Moving Service — 36€/hour</option>
              <option value="Move-In & Move-Out Cleaning — 33€/hour per cleaner" style={{ background:"#1a3a6b",color:"#fff" }}>Move-In & Move-Out Cleaning — 33€/hour per cleaner</option>
              <option value="Furniture Assembly & Installation — 24€/hour per installer" style={{ background:"#1a3a6b",color:"#fff" }}>Furniture Assembly & Installation — 24€/hour per installer</option>
              <option value="Additional Options (Custom)" style={{ background:"#1a3a6b",color:"#fff" }}>Additional Options (Custom)</option>
            </select>
            <textarea placeholder="Tell us about your move..." rows={3} value={form.message} onChange={set("message")} style={{...iS, resize:"vertical"}} />
            <button onClick={submit} disabled={loading} style={{ width:"100%", padding:"14px", background:loading?"rgba(255,255,255,0.5)":"#fff", color:BLUE, border:"none", borderRadius:10, fontWeight:800, fontSize:16, cursor:loading?"not-allowed":"pointer", transition:"all 0.2s" }}>
              {loading ? "⏳ Sending..." : "Send Request →"}
            </button>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"center", marginTop:10, marginBottom:0 }}>
              📧 Sent to easymovefi@gmail.com + 📊 Google Sheets
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [content,setContent]=useState(loadContent);
  const [showAdmin,setShowAdmin]=useState(false);
  const [showQuote,setShowQuote]=useState(false);
  const [adminCode,setAdminCode]=useState("");
  const [adminPrompt,setAdminPrompt]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const isMobile=useIsMobile();

  useEffect(()=>{
    loadFromSupabase().then(data=>{
      if(data){ setContent(data); localStorage.setItem("site_content",JSON.stringify(data)); }
    }).catch(()=>{});
  },[]);

  // Truy cập admin qua URL: yoursite.com?admin
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if(params.has("admin")){
      setAdminPrompt(true);
      // Xóa ?admin khỏi URL để không lộ
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },[]);

  const saveContent = async (newContent) => {
    setContent(newContent);
    localStorage.setItem("site_content",JSON.stringify(newContent));
    await saveToSupabase(newContent);
  };

  const {theme}=content;
  const scrollTo=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenuOpen(false);};
  const login=()=>{ if(adminCode==="July2021@"){setShowAdmin(true);setAdminPrompt(false);setAdminCode("");}else alert("Wrong password!"); };

  const BLUE="#003580";
  const navH=64;

  return (
    <div style={{ fontFamily:"'Segoe UI','Helvetica Neue',sans-serif",color:"#1a2540",overflowX:"hidden",background:"#fff" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @media(max-width:767px){
          .grid2{grid-template-columns:1fr!important;}
          .hide-mobile{display:none!important;}
          .sec-pad{padding:60px 20px!important;}
          .hero-h1{font-size:32px!important;line-height:1.2!important;}
          .hero-sub{font-size:15px!important;}
        }
        a{text-decoration:none;}
        .nav-btn:hover{color:#fff!important;background:rgba(255,255,255,0.1)!important;}
        .svc-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,53,128,0.15)!important;}
        .svc-card{transition:transform 0.2s,box-shadow 0.2s;}
      `}</style>

      {/* Admin login */}
      {adminPrompt&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,minWidth:280,width:"100%",maxWidth:360,border:"3px solid "+BLUE }}>
            <div style={{ textAlign:"center",marginBottom:16 }}>
              <img src={content.company.logo} alt="logo" style={{ width:70,height:70,objectFit:"contain",marginBottom:8 }} />
              <h3 style={{ color:BLUE,fontSize:18 }}>Admin Login</h3>
            </div>
            <input type="password" placeholder="Enter admin password" value={adminCode} onChange={e=>setAdminCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
              style={{ width:"100%",padding:"10px 12px",border:"2px solid "+BLUE,borderRadius:8,fontSize:15,marginBottom:12,boxSizing:"border-box" }} />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={login} style={{ flex:1,padding:"10px",background:BLUE,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer" }}>Login</button>
              <button onClick={()=>setAdminPrompt(false)} style={{ flex:1,padding:"10px",background:"#f4f7fc",border:"1px solid #d0d7e3",borderRadius:8,cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showAdmin&&<AdminPanel content={content} onSave={saveContent} onClose={()=>setShowAdmin(false)} />}
      {showQuote&&<QuoteModal onClose={()=>setShowQuote(false)} theme={theme} />}

      {/* NAVBAR */}
      <nav style={{ position:"fixed",top:0,width:"100%",zIndex:100,background:"#fff",boxShadow:"0 2px 20px rgba(0,53,128,0.12)",height:navH,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px" }}>
        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <img src={content.company.logo} alt={content.company.name} style={{ height:44,width:44,objectFit:"contain",borderRadius:8 }} />
          <div>
            <div style={{ fontWeight:800,color:BLUE,fontSize:isMobile?13:16,lineHeight:1.2 }}>{content.company.name}</div>
            {!isMobile&&<div style={{ fontSize:11,color:"#8899bb" }}>{content.company.tagline}</div>}
          </div>
        </div>

        {/* Desktop nav */}
        {!isMobile&&(
          <div style={{ display:"flex",gap:4,alignItems:"center" }}>
            {["Home","Services","Pricing","About","Contact"].map(s=>(
              <button key={s} className="nav-btn" onClick={()=>scrollTo(s.toLowerCase())} style={{ background:"none",border:"none",color:BLUE,cursor:"pointer",fontSize:14,padding:"7px 12px",borderRadius:6,fontWeight:600 }}>{s}</button>
            ))}
            {/* Facebook */}
            <a href={content.company.facebook} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 12px",color:BLUE,fontWeight:600,fontSize:14,borderRadius:6,border:"1px solid "+BLUE }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={BLUE}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
            {/* WhatsApp */}
            <a href={`https://wa.me/${content.company.whatsapp}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 12px",background:"#25D366",color:"#fff",borderRadius:6,fontWeight:600,fontSize:14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <button onClick={()=>setShowQuote(true)} style={{ padding:"8px 18px",background:BLUE,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14 }}>Get Quote</button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile&&(
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none",border:"none",cursor:"pointer",padding:6 }}>
            {menuOpen ? <span style={{ fontSize:24,color:BLUE }}>✕</span> : (
              <div>{[0,1,2].map(i=><div key={i} style={{ width:24,height:2,background:BLUE,marginBottom:i<2?5:0,borderRadius:2 }} />)}</div>
            )}
          </button>
        )}
      </nav>

      {/* Mobile menu */}
      {isMobile&&menuOpen&&(
        <div style={{ position:"fixed",top:navH,left:0,right:0,background:"#fff",zIndex:99,padding:"12px 0",borderBottom:"2px solid "+BLUE,boxShadow:"0 4px 20px rgba(0,53,128,0.1)" }}>
          {["Home","Services","Pricing","About","Contact"].map(s=>(
            <button key={s} onClick={()=>scrollTo(s.toLowerCase())} style={{ display:"block",width:"100%",textAlign:"left",padding:"12px 24px",background:"none",border:"none",color:BLUE,cursor:"pointer",fontSize:15,fontWeight:600 }}>{s}</button>
          ))}
          <div style={{ padding:"12px 24px",display:"flex",flexDirection:"column",gap:10 }}>
            <a href={content.company.facebook} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 16px",color:BLUE,fontWeight:600,border:"1px solid "+BLUE,borderRadius:8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={BLUE}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Facebook
            </a>
            <a href={`https://wa.me/${content.company.whatsapp}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:"#25D366",color:"#fff",borderRadius:8,fontWeight:600 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp: {content.company.phone}
            </a>
            <button onClick={()=>{setShowQuote(true);setMenuOpen(false);}} style={{ padding:"12px",background:BLUE,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:15 }}>Get Free Quote</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight:"100vh",position:"relative",display:"flex",flexDirection:"column",paddingTop:navH,overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,backgroundImage:`url(${content.hero.bgImage})`,backgroundSize:"cover",backgroundPosition:"center",zIndex:0 }} />
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right, rgba(0,0,0,0.0) 20%, rgba(0,21,64,0.38) 65%)",zIndex:1 }} />
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,21,64,0.28) 0%, transparent 40%)",zIndex:1 }} />

        {/* BOTTOM RIGHT — text only, no box */}
        <div style={{ position:"relative",zIndex:2,flex:1,display:"flex",alignItems:"flex-end",justifyContent:isMobile?"center":"flex-end",padding:isMobile?"32px 24px":"52px 64px" }}>
          <div style={{ maxWidth:isMobile?"100%":440,textAlign:isMobile?"center":"right" }}>
            <h1 style={{ fontSize:isMobile?"clamp(20px,5vw,26px)":"clamp(22px,2.6vw,36px)",fontWeight:900,color:"#fff",lineHeight:1.15,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.03em",textShadow:"0 2px 16px rgba(0,0,0,0.6)",whiteSpace:"pre-line" }}>{content.hero.headline}</h1>
            <p style={{ fontSize:isMobile?11:12,color:"rgba(255,255,255,0.92)",marginBottom:20,lineHeight:1.6,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",textShadow:"0 1px 8px rgba(0,0,0,0.7)" }}>{content.hero.subheadline}</p>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap",justifyContent:isMobile?"center":"flex-end" }}>
              <button onClick={()=>setShowQuote(true)} style={{ padding:"11px 24px",background:"#fff",color:BLUE,border:"none",borderRadius:8,fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>{content.hero.cta} →</button>
              <a href={`https://wa.me/${content.company.whatsapp}`} target="_blank" rel="noreferrer" style={{ display:"flex",alignItems:"center",gap:7,padding:"11px 20px",background:"#25D366",color:"#fff",borderRadius:8,fontWeight:700,fontSize:14,textDecoration:"none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
            <div style={{ display:"flex",gap:14,marginTop:18,flexWrap:"wrap",justifyContent:isMobile?"center":"flex-end" }}>
              {["✅ Fully Insured","⏱️ On-Time","💪 Experienced","🌍 All Finland"].map(b=>(
                <div key={b} style={{ color:"rgba(255,255,255,0.9)",fontSize:12,fontWeight:600,textShadow:"0 1px 6px rgba(0,0,0,0.6)" }}>{b}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="sec-pad" style={{ padding:"80px 24px",background:"#fff" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:50 }}>
            <div style={{ display:"inline-block",background:`${BLUE}12`,color:BLUE,padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.08em" }}>What We Offer</div>
            <h2 style={{ fontSize:isMobile?28:40,fontWeight:900,color:BLUE,margin:"0 0 12px" }}>Our Services</h2>
            <p style={{ color:"#5a6a8a",fontSize:16,maxWidth:500,margin:"0 auto" }}>Professional moving solutions for every need</p>
          </div>
          <div className="grid2" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:22 }}>
            {content.services.map(s=>(
              <div key={s.id} className="svc-card" style={{ background:"#fff",borderRadius:16,padding:28,border:`1px solid ${BLUE}22`,boxShadow:"0 2px 12px rgba(0,53,128,0.06)" }}>
                <div style={{ width:56,height:56,background:`${BLUE}12`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:18 }}>{s.icon}</div>
                <h3 style={{ fontWeight:800,fontSize:18,color:BLUE,marginBottom:10 }}>{s.title}</h3>
                <p style={{ color:"#5a6a8a",lineHeight:1.7,margin:0,fontSize:14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="sec-pad" style={{ padding:"80px 24px",background:"#f0f4ff" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div style={{ display:"inline-block",background:`${BLUE}15`,color:BLUE,padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.08em" }}>Transparent Pricing</div>
            <h2 style={{ fontSize:isMobile?26:38,fontWeight:900,color:BLUE,margin:"0 0 10px" }}>{content.pricing?.title||"Moving Prices"}</h2>
            <p style={{ color:"#5a6a8a",fontSize:15,maxWidth:540,margin:"0 auto" }}>{content.pricing?.subtitle||""}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginBottom:32 }}>
            {(content.pricing?.routes||[]).map((r,i)=>(
              <div key={r.id||i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:12,padding:"14px 20px",border:`1px solid ${BLUE}18`,boxShadow:"0 2px 8px rgba(0,53,128,0.05)",gap:12 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:20 }}>{r.emoji}</span>
                  <div>
                    <div style={{ fontWeight:700,color:BLUE,fontSize:14 }}>{r.from} → {r.to}</div>
                    <div style={{ fontSize:12,color:"#8899bb",marginTop:2 }}>{r.km}</div>
                  </div>
                </div>
                <div style={{ fontWeight:900,fontSize:20,color:BLUE,flexShrink:0 }}>{r.price}</div>
              </div>
            ))}
          </div>
          <div style={{ background:BLUE,borderRadius:16,padding:"28px 32px",display:"flex",flexDirection:isMobile?"column":"row",alignItems:"center",justifyContent:"space-between",gap:20 }}>
            <div>
              <div style={{ fontSize:16,fontWeight:800,color:"#fff",marginBottom:6 }}>{content.pricing?.customTitle||"Custom Routes Available"}</div>
              <div style={{ fontSize:14,color:"rgba(255,255,255,0.8)" }}>{content.pricing?.customDesc||""}</div>
            </div>
            <button onClick={()=>setShowQuote(true)} style={{ padding:"13px 28px",background:"#fff",color:BLUE,border:"none",borderRadius:10,fontWeight:800,fontSize:15,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0 }}>{content.pricing?.customBtn||"Get Custom Quote"} →</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="sec-pad" style={{ padding:"80px 24px",background:theme.light||"#f0f4ff" }}>
        <div className="grid2" style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:isMobile?40:80,alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-block",background:`${BLUE}12`,color:BLUE,padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:18,textTransform:"uppercase",letterSpacing:"0.08em" }}>About Us</div>
            <h2 style={{ fontSize:isMobile?26:36,fontWeight:900,color:BLUE,marginBottom:20 }}>{content.about.title}</h2>
            {content.about.body.split("\n\n").map((p,i)=><p key={i} style={{ color:"#5a6a8a",lineHeight:1.8,fontSize:15,marginBottom:16 }}>{p}</p>)}
            <div style={{ display:"flex",gap:12,marginTop:24,flexWrap:"wrap" }}>
              {[content.about.badge1,content.about.badge2,content.about.badge3].map(b=>(
                <div key={b} style={{ fontSize:13,fontWeight:700,color:BLUE,background:"#fff",padding:"8px 16px",borderRadius:99,border:`1px solid ${BLUE}33`,boxShadow:"0 2px 8px rgba(0,53,128,0.08)" }}>{b}</div>
              ))}
            </div>
            <button onClick={()=>setShowQuote(true)} style={{ marginTop:28,padding:"13px 32px",background:BLUE,color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:15,cursor:"pointer" }}>Get Free Quote →</button>
          </div>
          <div className="hide-mobile" style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>
            <img src={content.about.image} alt="Easy Move Finland" style={{ width:320,height:320,objectFit:"contain",filter:"drop-shadow(0 8px 32px rgba(0,53,128,0.2))" }} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="sec-pad" style={{ padding:"80px 24px",background:"#fff" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div style={{ display:"inline-block",background:`${BLUE}12`,color:BLUE,padding:"5px 16px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.08em" }}>Reviews</div>
            <h2 style={{ fontSize:isMobile?26:36,fontWeight:900,color:BLUE }}>What Our Customers Say</h2>
          </div>
          <div className="grid2" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:22 }}>
            {content.testimonials.map(t=>(
              <div key={t.id} style={{ background:theme.light||"#f0f4ff",borderRadius:16,padding:28,border:`1px solid ${BLUE}15` }}>
                <div style={{ color:"#FFB800",fontSize:18,marginBottom:12 }}>★★★★★</div>
                <p style={{ color:"#1a2540",lineHeight:1.7,fontSize:15,marginBottom:20,fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:42,height:42,background:BLUE,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,flexShrink:0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight:700,color:BLUE,fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:"#8899bb" }}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sec-pad" style={{ padding:"80px 24px",background:BLUE }}>
        <ContactSection content={content} BLUE={BLUE} isMobile={isMobile} onQuote={()=>setShowQuote(true)} />
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#001233",padding:"32px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:isMobile?"column":"row",alignItems:isMobile?"center":"center",justifyContent:"space-between",gap:20 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <img src={content.company.logo} alt="logo" style={{ width:40,height:40,objectFit:"contain" }} />
            <div>
              <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{content.company.name}</div>
              <div style={{ color:"#5a6a8a",fontSize:12 }}>{content.company.tagline}</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center" }}>
            {content.footer.links.map(l=><a key={l} href="#" style={{ color:"#5a6a8a",fontSize:12 }}>{l}</a>)}
          </div>
          <p style={{ color:"#3a4a6a",fontSize:12,margin:0 }}>{content.footer.copy}</p>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a href={`https://wa.me/${content.company.whatsapp}`} target="_blank" rel="noreferrer"
        style={{ position:"fixed",bottom:24,right:24,width:56,height:56,background:"#25D366",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(37,211,102,0.5)",zIndex:500,transition:"transform 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </a>
    </div>
  );
}
