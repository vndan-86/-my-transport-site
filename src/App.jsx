import { useState, useEffect } from "react";

const FORMSPREE_URL = "https://formspree.io/f/xzdqzprd";
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby0ZVCF2M7Q2dj8cYxcf803Lnvg2T4VdYNX9-ipQURvlutvqwMj4VfqOGrfRH8z-bsU/exec";
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

const DEFAULT_CONTENT = {
  company: { name:"3P Transportation", tagline:"Reliable. Fast. Professional.", description:"Your trusted partner for freight and logistics solutions across Finland and Europe.", phone:"+358 40 123 4567", email:"info@3ptransportation.fi", address:"Teollisuuskatu 12, 00510 Helsinki, Finland", founded:"2008", logo:"3P" },
  hero: { headline:"Moving Cargo,\nConnecting Europe", subheadline:"Professional transportation & logistics services with 15+ years of experience", cta:"Get a Free Quote" },
  services: [
    { id:1, icon:"🚛", title:"Full Truckload (FTL)", desc:"Complete truck capacity for large shipments across Finland and Europe. Fast, direct, and reliable." },
    { id:2, icon:"📦", title:"Partial Load (LTL)", desc:"Cost-effective solution for smaller shipments. We consolidate loads to save you money." },
    { id:3, icon:"❄️", title:"Temperature Controlled", desc:"Specialized refrigerated transport for perishables, pharmaceuticals, and sensitive goods." },
    { id:4, icon:"🏗️", title:"Heavy & Special Cargo", desc:"Oversized, overweight, and special equipment transport with all necessary permits." },
    { id:5, icon:"🏭", title:"Warehouse & Storage", desc:"Modern warehousing solutions with full inventory management and distribution services." },
    { id:6, icon:"🌍", title:"International Freight", desc:"Cross-border logistics across all EU countries with customs handling included." },
  ],
  stats: [ { label:"Years Experience", value:"15+" }, { label:"Routes Covered", value:"200+" }, { label:"Happy Clients", value:"500+" }, { label:"Deliveries / Year", value:"50K+" } ],
  about: { title:"About 3P Transportation", body:"Founded in 2008, 3P Transportation has grown from a small Finnish carrier to a leading logistics provider serving clients across Europe. Our fleet of modern vehicles and experienced team ensure your cargo arrives safely and on time, every time.\n\nWe believe in transparency, reliability, and building long-term partnerships with our clients. Whether you need a single delivery or a full logistics solution, we have the resources and expertise to deliver.", image:"🚛", badge1:"🏆 Award Winning", badge2:"🛡️ Fully Insured", badge3:"📍 GPS Tracking" },
  testimonials: [
    { id:1, name:"Matti Korhonen", company:"Korhonen Oy", text:"3P Transportation has been our logistics partner for 5 years. Excellent reliability and professional service." },
    { id:2, name:"Anna Virtanen", company:"Nordic Goods Ltd", text:"The temperature-controlled transport solved all our pharmaceutical shipping challenges. Highly recommend!" },
    { id:3, name:"Jukka Mäkinen", company:"Mäkinen Industries", text:"Their team handled our oversized machinery transport perfectly. No surprises, no delays." },
  ],
  contact: { title:"Get a Free Quote", subtitle:"Fill out the form and we'll get back to you within 24 hours." },
  footer: { copy:"© 2024 3P Transportation. All rights reserved.", links:["Privacy Policy","Terms of Service","Cookie Policy"] },
  theme: { primary:"#1a3a6b", accent:"#e8a020", dark:"#0a1628", light:"#f4f7fc" },
  haircut: {
    badge:"New Service", title:"✂️ Haircut & Styling", description:"Chúng tôi vừa mở thêm dịch vụ cắt tóc chuyên nghiệp ngay tại văn phòng. Đặt lịch online, không cần chờ đợi!", buttonText:"Đặt lịch ngay", menuTitle:"Đặt lịch cắt tóc", confirmText:"Xác nhận đặt lịch", successTitle:"Đặt lịch thành công!", successMsg:"Chúng tôi sẽ xác nhận qua SĐT / email trong vòng 30 phút.",
    services:[ {id:1,label:"✂️ Cắt tóc nam"},{id:2,label:"✂️ Cắt tóc nữ"},{id:3,label:"🎨 Nhuộm tóc"},{id:4,label:"🎨 Highlights"},{id:5,label:"💆 Gội đầu & massage"},{id:6,label:"💈 Uốn tóc"},{id:7,label:"💈 Ép / duỗi tóc"},{id:8,label:"💈 Combo cắt + gội"} ],
    stylists:[ {id:1,val:"any",label:"Bất kỳ thợ nào"},{id:2,val:"minh",label:"Anh Minh (Senior)"},{id:3,val:"lan",label:"Chị Lan (Nhuộm/Uốn)"},{id:4,val:"tuan",label:"Anh Tuấn (Nam chuyên)"} ],
    timeSlots:["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"],
    priceList:[ {id:1,icon:"✂️",name:"Cắt tóc nam / nữ",price:"Từ 150.000đ"},{id:2,icon:"🎨",name:"Nhuộm tóc & highlights",price:"Từ 400.000đ"},{id:3,icon:"💆",name:"Gội đầu & massage",price:"Từ 80.000đ"},{id:4,icon:"💈",name:"Uốn / ép / duỗi",price:"Từ 500.000đ"} ],
  },
};

// ── Load saved content ──
function loadContent() {
  try {
    const saved = localStorage.getItem("site_content");
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_CONTENT;
}
function useIsMobile() {
  const [m, setM] = useState(window.innerWidth < 768);
  useEffect(() => { const h = () => setM(window.innerWidth < 768); window.addEventListener("resize",h); return () => window.removeEventListener("resize",h); }, []);
  return m;
}

// ── shared styles ──
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
        <span style={{ fontWeight:700,color:"#1a3a6b",fontSize:13 }}>{title}</span>
        {onRemove && <button onClick={onRemove} style={{ background:"#fee",border:"1px solid #fcc",color:"#c44",padding:"3px 9px",borderRadius:5,cursor:"pointer",fontSize:12 }}>Xóa</button>}
      </div>
      {children}
    </div>
  );
}
function STitle({ children }) { return <h2 style={{ marginBottom:18,color:"#1a2540",fontSize:19,borderBottom:"2px solid #e8a020",paddingBottom:8 }}>{children}</h2>; }

// ── ADMIN ──
function AdminPanel({ content, onSave, onClose }) {
  const [data, setData] = useState(JSON.parse(JSON.stringify(content)));
  const [tab, setTab] = useState("company");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);
  const isMobile = useIsMobile();

  const save = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  const tabs = [
    {key:"company",label:"Thông tin công ty",icon:"🏢"},{key:"hero",label:"Hero Section",icon:"🖼️"},
    {key:"services",label:"Dịch vụ vận tải",icon:"🚛"},{key:"stats",label:"Thống kê",icon:"📊"},
    {key:"about",label:"Giới thiệu",icon:"📝"},{key:"testimonials",label:"Đánh giá khách",icon:"💬"},
    {key:"contact",label:"Liên hệ & Footer",icon:"📞"},{key:"haircut_info",label:"Haircut – Nội dung",icon:"✂️"},
    {key:"haircut_svc",label:"Haircut – Dịch vụ",icon:"💈"},{key:"haircut_staff",label:"Haircut – Thợ",icon:"👨‍💼"},
    {key:"haircut_price",label:"Haircut – Bảng giá",icon:"💰"},{key:"haircut_time",label:"Haircut – Khung giờ",icon:"🕐"},
    {key:"theme",label:"Màu sắc",icon:"🎨"},
  ];

  const exportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "website-content.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setData(parsed); onSave(parsed);
        alert("✅ Import thành công! Nội dung đã được cập nhật.");
      } catch { alert("❌ File JSON không hợp lệ."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const upd = (s,f,v) => setData(p=>({...p,[s]:{...p[s],[f]:v}}));
  const updArr = (s,i,f,v) => setData(p=>{ const a=[...p[s]]; a[i]={...a[i],[f]:v}; return {...p,[s]:a}; });
  const addArr = (s,t) => setData(p=>({...p,[s]:[...p[s],{...t,id:Date.now()}]}));
  const delArr = (s,i) => setData(p=>({...p,[s]:p[s].filter((_,j)=>j!==i)}));
  const updH = (f,v) => setData(p=>({...p,haircut:{...p.haircut,[f]:v}}));
  const updHArr = (k,i,f,v) => setData(p=>{ const a=[...p.haircut[k]]; a[i]={...a[i],[f]:v}; return {...p,haircut:{...p.haircut,[k]:a}}; });
  const addHArr = (k,t) => setData(p=>({...p,haircut:{...p.haircut,[k]:[...p.haircut[k],{...t,id:Date.now()}]}}));
  const delHArr = (k,i) => setData(p=>({...p,haircut:{...p.haircut,[k]:p.haircut[k].filter((_,j)=>j!==i)}}));
  const addBtn = (label,fn) => <button onClick={fn} style={{ padding:"8px 18px",background:"#1a3a6b",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:13,marginTop:4 }}>+ {label}</button>;

  const sidebarW = isMobile ? "100%" : 220;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(10,22,40,0.92)",zIndex:9999,display:"flex",flexDirection:isMobile?"column":"row",fontFamily:"'Segoe UI',sans-serif" }}>
      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ background:"#0a1628",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <span style={{ color:"#e8a020",fontWeight:800,fontSize:15 }}>⚙️ Admin Panel</span>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setSideOpen(!sideOpen)} style={{ padding:"6px 12px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontSize:13 }}>{sideOpen?"Ẩn menu":"Menu"}</button>
            <button onClick={save} style={{ padding:"6px 14px",background:saved?"#22c55e":saving?"#6b7280":"#e8a020",border:"none",borderRadius:6,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13 }}>{saved?"✅":saving?"⏳":"💾"}</button>
            <button onClick={onClose} style={{ padding:"6px 12px",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,color:"#aab8d4",cursor:"pointer",fontSize:13 }}>✕</button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {(!isMobile || sideOpen) && (
        <div style={{ width:isMobile?"100%":220,background:"#0a1628",display:"flex",flexDirection:"column",flexShrink:0,maxHeight:isMobile?"50vh":"100%" }}>
          {!isMobile && (
            <div style={{ padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontWeight:800,fontSize:15,color:"#e8a020" }}>⚙️ Admin Panel</div>
              <div style={{ fontSize:11,color:"#5a6a8a",marginTop:3 }}>Chỉnh sửa toàn bộ nội dung</div>
            </div>
          )}
          <nav style={{ flex:1,overflowY:"auto",padding:"6px 0",display:isMobile?"grid":"block",gridTemplateColumns:isMobile?"1fr 1fr":"unset" }}>
            {tabs.map(t=>(
              <button key={t.key} onClick={()=>{ setTab(t.key); if(isMobile) setSideOpen(false); }} style={{
                width:"100%",textAlign:"left",padding:isMobile?"8px 12px":"9px 14px",background:tab===t.key?"rgba(232,160,32,0.12)":"transparent",
                border:"none",borderLeft:!isMobile&&tab===t.key?"3px solid #e8a020":"3px solid transparent",
                color:tab===t.key?"#e8a020":"#8899bb",cursor:"pointer",fontSize:12,display:"flex",gap:6,alignItems:"center",
              }}>
                <span style={{ fontSize:14 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
          {!isMobile && (
            <div style={{ padding:14,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column",gap:8 }}>
              <button onClick={save} disabled={saving} style={{ padding:"10px",background:saved?"#22c55e":saving?"#6b7280":"#e8a020",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontSize:14 }}>{saved?"✅ Đã lưu!":saving?"⏳ Đang lưu...":"💾 Lưu thay đổi"}</button>
              <button onClick={exportJSON} style={{ padding:"9px",background:"#1e4a8c",border:"none",borderRadius:8,color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13 }}>📥 Xuất file JSON</button>
              <label style={{ padding:"9px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#aab8d4",cursor:"pointer",fontSize:13,textAlign:"center",display:"block" }}>
                📂 Nhập file JSON
                <input type="file" accept=".json" onChange={importJSON} style={{ display:"none" }} />
              </label>
              <button onClick={onClose} style={{ padding:"8px",background:"transparent",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#5a6a8a",cursor:"pointer",fontSize:13 }}>✕ Đóng Admin</button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {(!isMobile || !sideOpen) && (
        <div style={{ flex:1,overflowY:"auto",padding:isMobile?"20px 16px":"28px 36px",background:"#f4f7fc" }}>
          <div style={{ maxWidth:700 }}>
            {tab==="company" && <><STitle>🏢 Thông tin công ty</STitle>
              <Field label="Tên công ty" value={data.company.name} onChange={v=>upd("company","name",v)} />
              <Field label="Tagline" value={data.company.tagline} onChange={v=>upd("company","tagline",v)} />
              <Field label="Mô tả" value={data.company.description} onChange={v=>upd("company","description",v)} rows={3} />
              <Field label="Số điện thoại" value={data.company.phone} onChange={v=>upd("company","phone",v)} />
              <Field label="Email" value={data.company.email} onChange={v=>upd("company","email",v)} />
              <Field label="Địa chỉ" value={data.company.address} onChange={v=>upd("company","address",v)} />
              <Field label="Năm thành lập" value={data.company.founded} onChange={v=>upd("company","founded",v)} />
              <Field label="Logo text" value={data.company.logo} onChange={v=>upd("company","logo",v)} />
            </>}
            {tab==="hero" && <><STitle>🖼️ Hero Section</STitle>
              <Field label="Tiêu đề chính" value={data.hero.headline} onChange={v=>upd("hero","headline",v)} rows={3} />
              <Field label="Sub-headline" value={data.hero.subheadline} onChange={v=>upd("hero","subheadline",v)} rows={2} />
              <Field label="Nút CTA" value={data.hero.cta} onChange={v=>upd("hero","cta",v)} />
            </>}
            {tab==="services" && <><STitle>🚛 Dịch vụ vận tải</STitle>
              {data.services.map((s,i)=>(
                <CardWrap key={s.id} title={`Dịch vụ #${i+1}`} onRemove={()=>delArr("services",i)}>
                  <div style={{ display:"flex",gap:8 }}>
                    <div style={{ width:70 }}><Field label="Icon" value={s.icon} onChange={v=>updArr("services",i,"icon",v)} /></div>
                    <div style={{ flex:1 }}><Field label="Tên" value={s.title} onChange={v=>updArr("services",i,"title",v)} /></div>
                  </div>
                  <Field label="Mô tả" value={s.desc} onChange={v=>updArr("services",i,"desc",v)} rows={2} />
                </CardWrap>
              ))}
              {addBtn("Thêm dịch vụ",()=>addArr("services",{icon:"📦",title:"Dịch vụ mới",desc:"Mô tả."}))}
            </>}
            {tab==="stats" && <><STitle>📊 Thống kê</STitle>
              {data.stats.map((s,i)=>(
                <CardWrap key={i} title={`Stat #${i+1}`}>
                  <div style={{ display:"flex",gap:10 }}>
                    <div style={{ width:90 }}><Field label="Giá trị" value={s.value} onChange={v=>updArr("stats",i,"value",v)} /></div>
                    <div style={{ flex:1 }}><Field label="Nhãn" value={s.label} onChange={v=>updArr("stats",i,"label",v)} /></div>
                  </div>
                </CardWrap>
              ))}
            </>}
            {tab==="about" && <><STitle>📝 Giới thiệu</STitle>
              <Field label="Tiêu đề" value={data.about.title} onChange={v=>upd("about","title",v)} />
              <Field label="Nội dung" value={data.about.body} onChange={v=>upd("about","body",v)} rows={6} />
              <Field label="Icon trang trí" value={data.about.image} onChange={v=>upd("about","image",v)} />
              <Field label="Badge 1" value={data.about.badge1} onChange={v=>upd("about","badge1",v)} />
              <Field label="Badge 2" value={data.about.badge2} onChange={v=>upd("about","badge2",v)} />
              <Field label="Badge 3" value={data.about.badge3} onChange={v=>upd("about","badge3",v)} />
            </>}
            {tab==="testimonials" && <><STitle>💬 Đánh giá khách hàng</STitle>
              {data.testimonials.map((t,i)=>(
                <CardWrap key={t.id} title={`Đánh giá #${i+1}`} onRemove={()=>delArr("testimonials",i)}>
                  <Field label="Tên khách" value={t.name} onChange={v=>updArr("testimonials",i,"name",v)} />
                  <Field label="Công ty" value={t.company} onChange={v=>updArr("testimonials",i,"company",v)} />
                  <Field label="Nội dung" value={t.text} onChange={v=>updArr("testimonials",i,"text",v)} rows={3} />
                </CardWrap>
              ))}
              {addBtn("Thêm đánh giá",()=>addArr("testimonials",{name:"Tên khách",company:"Công ty",text:"Nội dung."}))}
            </>}
            {tab==="contact" && <><STitle>📞 Liên hệ & Footer</STitle>
              <Field label="Tiêu đề form" value={data.contact.title} onChange={v=>upd("contact","title",v)} />
              <Field label="Mô tả form" value={data.contact.subtitle} onChange={v=>upd("contact","subtitle",v)} rows={2} />
              <div style={{ marginTop:20,paddingTop:16,borderTop:"1px solid #e0e7f0" }}>
                <label style={{...LS,marginBottom:10}}>FOOTER</label>
                <Field label="Copyright" value={data.footer.copy} onChange={v=>setData(p=>({...p,footer:{...p.footer,copy:v}}))} />
                {data.footer.links.map((l,i)=>(
                  <Field key={i} label={`Link #${i+1}`} value={l} onChange={v=>{ const a=[...data.footer.links]; a[i]=v; setData(p=>({...p,footer:{...p.footer,links:a}})); }} />
                ))}
              </div>
            </>}
            {tab==="haircut_info" && <><STitle>✂️ Haircut – Nội dung</STitle>
              <Field label="Badge" value={data.haircut.badge} onChange={v=>updH("badge",v)} />
              <Field label="Tiêu đề section" value={data.haircut.title} onChange={v=>updH("title",v)} />
              <Field label="Mô tả" value={data.haircut.description} onChange={v=>updH("description",v)} rows={3} />
              <Field label="Nút đặt lịch" value={data.haircut.buttonText} onChange={v=>updH("buttonText",v)} />
              <Field label="Tiêu đề modal" value={data.haircut.menuTitle} onChange={v=>updH("menuTitle",v)} />
              <Field label="Nút xác nhận" value={data.haircut.confirmText} onChange={v=>updH("confirmText",v)} />
              <Field label="Tiêu đề thành công" value={data.haircut.successTitle} onChange={v=>updH("successTitle",v)} />
              <Field label="Thông báo thành công" value={data.haircut.successMsg} onChange={v=>updH("successMsg",v)} rows={2} />
            </>}
            {tab==="haircut_svc" && <><STitle>💈 Haircut – Dịch vụ</STitle>
              {data.haircut.services.map((s,i)=>(
                <CardWrap key={s.id} title={`#${i+1}`} onRemove={()=>delHArr("services",i)}>
                  <Field label="Tên dịch vụ" value={s.label} onChange={v=>updHArr("services",i,"label",v)} />
                </CardWrap>
              ))}
              {addBtn("Thêm dịch vụ",()=>addHArr("services",{label:"✂️ Dịch vụ mới"}))}
            </>}
            {tab==="haircut_staff" && <><STitle>👨‍💼 Haircut – Thợ</STitle>
              {data.haircut.stylists.map((s,i)=>(
                <CardWrap key={s.id} title={`Thợ #${i+1}`} onRemove={i>0?()=>delHArr("stylists",i):null}>
                  <div style={{ display:"flex",gap:8 }}>
                    <div style={{ width:120 }}><Field label="ID" value={s.val} onChange={v=>updHArr("stylists",i,"val",v)} /></div>
                    <div style={{ flex:1 }}><Field label="Tên hiển thị" value={s.label} onChange={v=>updHArr("stylists",i,"label",v)} /></div>
                  </div>
                </CardWrap>
              ))}
              {addBtn("Thêm thợ",()=>addHArr("stylists",{val:"staff"+Date.now(),label:"Thợ mới"}))}
            </>}
            {tab==="haircut_price" && <><STitle>💰 Haircut – Bảng giá</STitle>
              {data.haircut.priceList.map((p,i)=>(
                <CardWrap key={p.id} title={`#${i+1}`} onRemove={()=>delHArr("priceList",i)}>
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    <div style={{ width:60 }}><Field label="Icon" value={p.icon} onChange={v=>updHArr("priceList",i,"icon",v)} /></div>
                    <div style={{ flex:2,minWidth:120 }}><Field label="Tên" value={p.name} onChange={v=>updHArr("priceList",i,"name",v)} /></div>
                    <div style={{ flex:1,minWidth:100 }}><Field label="Giá" value={p.price} onChange={v=>updHArr("priceList",i,"price",v)} /></div>
                  </div>
                </CardWrap>
              ))}
              {addBtn("Thêm",()=>addHArr("priceList",{icon:"✂️",name:"Dịch vụ mới",price:"Từ 0đ"}))}
            </>}
            {tab==="haircut_time" && <><STitle>🕐 Haircut – Khung giờ</STitle>
              <p style={{ color:"#5a6a8a",fontSize:13,marginBottom:14 }}>Định dạng HH:MM (vd: 09:00)</p>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8 }}>
                {data.haircut.timeSlots.map((t,i)=>(
                  <div key={i} style={{ display:"flex",gap:4,alignItems:"center" }}>
                    <input value={t} onChange={e=>{ const a=[...data.haircut.timeSlots]; a[i]=e.target.value; updH("timeSlots",a); }} style={{...AIS,marginBottom:0,flex:1}} placeholder="09:00" />
                    <button onClick={()=>updH("timeSlots",data.haircut.timeSlots.filter((_,j)=>j!==i))} style={{ padding:"5px 7px",background:"#fee",border:"1px solid #fcc",color:"#c44",borderRadius:5,cursor:"pointer",fontSize:11 }}>✕</button>
                  </div>
                ))}
              </div>
              <button onClick={()=>updH("timeSlots",[...data.haircut.timeSlots,""])} style={{ marginTop:12,padding:"8px 18px",background:"#1a3a6b",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:600,fontSize:13 }}>+ Thêm khung giờ</button>
            </>}
            {tab==="theme" && <><STitle>🎨 Màu sắc</STitle>
              <div style={{ background:"#fff",borderRadius:12,padding:18,border:"1px solid #e0e7f0" }}>
                {[["primary","Màu chủ đạo"],["accent","Màu nhấn"],["dark","Nền tối"],["light","Nền sáng"]].map(([f,l])=>(
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
  const [form,setForm]=useState({name:"",company:"",email:"",phone:"",service:"",origin:"",destination:"",cargo:""});
  const set=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const submit=async()=>{
    if(!form.name||!form.email){setError("Vui lòng điền Họ tên và Email.");return;}
    setError("");setLoading(true);
    try{ await Promise.allSettled([
      fetch(FORMSPREE_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(form)}),
      fetch(GOOGLE_SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,type:"TRANSPORT QUOTE"})}),
    ]); setSubmitted(true); }catch{setError("Lỗi kết nối.");}
    setLoading(false);
  };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:16,padding:28,maxWidth:480,width:"100%",maxHeight:"92vh",overflowY:"auto" }}>
        {submitted ? (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:60,marginBottom:14 }}>✅</div>
            <h2 style={{ color:theme.primary }}>Gửi thành công!</h2>
            <p style={{ color:"#5a6a8a" }}>Phản hồi trong 24 giờ.</p>
            <button onClick={onClose} style={{ marginTop:16,padding:"12px 28px",background:theme.accent,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer" }}>Đóng</button>
          </div>
        ):(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:20 }}>
              <h2 style={{ color:theme.primary,margin:0,fontSize:20 }}>Get a Free Quote</h2>
              <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8899bb" }}>✕</button>
            </div>
            {error&&<div style={{ background:"#fee",border:"1px solid #fcc",borderRadius:8,padding:"9px 12px",marginBottom:12,color:"#c44",fontSize:14 }}>⚠️ {error}</div>}
            <input placeholder="Họ tên *" value={form.name} onChange={set("name")} style={IS} />
            <input placeholder="Tên công ty" value={form.company} onChange={set("company")} style={IS} />
            <input placeholder="Email *" type="email" value={form.email} onChange={set("email")} style={IS} />
            <input placeholder="Số điện thoại" type="tel" value={form.phone} onChange={set("phone")} style={IS} />
            <select value={form.service} onChange={set("service")} style={IS}>
              <option value="">Chọn dịch vụ...</option>
              {["Full Truckload (FTL)","Partial Load (LTL)","Temperature Controlled","Heavy & Special Cargo","Warehouse & Storage","International Freight"].map(o=><option key={o}>{o}</option>)}
            </select>
            <input placeholder="Điểm xuất phát *" value={form.origin} onChange={set("origin")} style={IS} />
            <input placeholder="Điểm đến *" value={form.destination} onChange={set("destination")} style={IS} />
            <textarea placeholder="Chi tiết hàng hóa..." rows={3} value={form.cargo} onChange={set("cargo")} style={{...IS,resize:"vertical"}} />
            <button onClick={submit} disabled={loading} style={{ width:"100%",padding:"13px",background:loading?"#8899bb":theme.primary,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontSize:16 }}>
              {loading?"⏳ Đang gửi...":"Gửi yêu cầu →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── HAIRCUT MODAL ──
function HaircutModal({ onClose, theme, haircut }) {
  const [submitted,setSubmitted]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",phone:"",email:"",service:"",stylist:haircut.stylists[0]?.val||"any",date:"",time:"",note:""});
  const set=f=>e=>setForm(p=>({...p,[f]:e.target.value}));
  const today=new Date().toISOString().split("T")[0];
  const purple="#7c3aed"; const purpleLight="#f5f0ff";
  const submit=async()=>{
    if(!form.name||!form.phone||!form.date||!form.time||!form.service){setError("Vui lòng điền đầy đủ (*)");return;}
    setError("");setLoading(true);
    try{ await Promise.allSettled([
      fetch(FORMSPREE_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({...form,type:"HAIRCUT BOOKING"})}),
      fetch(GOOGLE_SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,company:"Haircut",email:form.email,phone:form.phone,service:form.service,origin:form.date+" "+form.time,destination:form.stylist,cargo:form.note,type:"HAIRCUT BOOKING"})}),
    ]); setSubmitted(true); }catch{setError("Lỗi xảy ra.");}
    setLoading(false);
  };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:20,padding:24,maxWidth:500,width:"100%",maxHeight:"92vh",overflowY:"auto" }}>
        {submitted?(
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:60,marginBottom:14 }}>🎉</div>
            <h2 style={{ color:purple }}>{haircut.successTitle}</h2>
            <div style={{ background:purpleLight,borderRadius:12,padding:16,margin:"16px 0",textAlign:"left",fontSize:14 }}>
              <div style={{ marginBottom:6 }}><strong>👤</strong> {form.name} · <strong>📱</strong> {form.phone}</div>
              <div style={{ marginBottom:6 }}><strong>✂️</strong> {form.service}</div>
              <div style={{ marginBottom:6 }}><strong>👨‍💼</strong> {haircut.stylists.find(s=>s.val===form.stylist)?.label}</div>
              <div><strong>📅</strong> {form.date} · <strong>🕐</strong> {form.time}</div>
            </div>
            <p style={{ color:"#5a6a8a",fontSize:13 }}>{haircut.successMsg}</p>
            <button onClick={onClose} style={{ marginTop:12,padding:"11px 28px",background:purple,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer" }}>Đóng</button>
          </div>
        ):(
          <>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <div>
                <h2 style={{ color:purple,margin:0,fontSize:19 }}>{haircut.menuTitle}</h2>
                <p style={{ color:"#8899bb",margin:"3px 0 0",fontSize:12 }}>Bước {step} / 2</p>
              </div>
              <button onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#8899bb" }}>✕</button>
            </div>
            <div style={{ display:"flex",gap:6,marginBottom:20 }}>
              {[1,2].map(s=><div key={s} style={{ flex:1,height:4,borderRadius:99,background:s<=step?purple:"#e0e7f0" }} />)}
            </div>
            {error&&<div style={{ background:"#fee",border:"1px solid #fcc",borderRadius:8,padding:"9px 12px",marginBottom:12,color:"#c44",fontSize:13 }}>⚠️ {error}</div>}
            {step===1&&<>
              <p style={{ fontWeight:700,color:"#1a2540",marginBottom:10,fontSize:14 }}>Chọn dịch vụ *</p>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16 }}>
                {haircut.services.map(s=>(
                  <button key={s.id} onClick={()=>setForm(p=>({...p,service:s.label}))} style={{ padding:"10px 8px",borderRadius:8,border:`2px solid ${form.service===s.label?purple:"#e0e7f0"}`,background:form.service===s.label?purpleLight:"#fff",color:form.service===s.label?purple:"#5a6a8a",cursor:"pointer",fontSize:12,fontWeight:form.service===s.label?700:400,textAlign:"left" }}>{s.label}</button>
                ))}
              </div>
              <p style={{ fontWeight:700,color:"#1a2540",marginBottom:10,fontSize:14 }}>Chọn thợ</p>
              <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
                {haircut.stylists.map(st=>(
                  <button key={st.id} onClick={()=>setForm(p=>({...p,stylist:st.val}))} style={{ padding:"10px 14px",borderRadius:8,border:`2px solid ${form.stylist===st.val?purple:"#e0e7f0"}`,background:form.stylist===st.val?purpleLight:"#fff",color:form.stylist===st.val?purple:"#5a6a8a",cursor:"pointer",fontSize:13,fontWeight:form.stylist===st.val?700:400,textAlign:"left" }}>{st.label}</button>
                ))}
              </div>
              <button onClick={()=>{if(!form.service){setError("Chọn dịch vụ");return;}setError("");setStep(2);}} style={{ width:"100%",padding:"13px",background:purple,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:15 }}>Tiếp theo →</button>
            </>}
            {step===2&&<>
              <div style={{ background:purpleLight,borderRadius:10,padding:"9px 14px",marginBottom:16,fontSize:13,color:purple,fontWeight:600 }}>{form.service} · {haircut.stylists.find(s=>s.val===form.stylist)?.label}</div>
              {[["HỌ TÊN *","name","text","Nguyễn Văn A"],["SỐ ĐIỆN THOẠI *","phone","tel","0901 234 567"],["EMAIL","email","email","email@example.com"]].map(([l,f,t,ph])=>(
                <div key={f}><label style={LS}>{l}</label><input placeholder={ph} type={t} value={form[f]} onChange={set(f)} style={IS} /></div>
              ))}
              <label style={LS}>CHỌN NGÀY *</label>
              <input type="date" min={today} value={form.date} onChange={set("date")} style={IS} />
              <label style={{...LS,marginBottom:8}}>CHỌN GIỜ *</label>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12 }}>
                {haircut.timeSlots.filter(Boolean).map(t=>(
                  <button key={t} onClick={()=>setForm(p=>({...p,time:t}))} style={{ padding:"8px 2px",borderRadius:7,border:`2px solid ${form.time===t?purple:"#e0e7f0"}`,background:form.time===t?purpleLight:"#fff",color:form.time===t?purple:"#5a6a8a",cursor:"pointer",fontSize:12,fontWeight:form.time===t?700:400 }}>{t}</button>
                ))}
              </div>
              <label style={LS}>GHI CHÚ</label>
              <textarea placeholder="Yêu cầu đặc biệt..." rows={2} value={form.note} onChange={set("note")} style={{...IS,resize:"vertical"}} />
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>{setStep(1);setError("");}} style={{ flex:1,padding:"12px",background:"#f4f7fc",border:"1px solid #d0d7e3",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:14,color:"#5a6a8a" }}>← Lại</button>
                <button onClick={submit} disabled={loading} style={{ flex:2,padding:"12px",background:loading?"#a78bfa":purple,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontSize:14 }}>{loading?"⏳ Đang đặt...":haircut.confirmText+" ✓"}</button>
              </div>
            </>}
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
  const [showHaircut,setShowHaircut]=useState(false);
  const [adminCode,setAdminCode]=useState("");
  const [adminPrompt,setAdminPrompt]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const isMobile=useIsMobile();

  useEffect(()=>{
    loadFromSupabase().then(data=>{
      if(data) { setContent(data); localStorage.setItem("site_content",JSON.stringify(data)); }
    }).catch(()=>{});
  },[]);

  // Không block render - hiển thị ngay với DEFAULT_CONTENT hoặc localStorage
  // Supabase load xong sẽ tự update

  const saveContent = async (newContent) => {
    setContent(newContent);
    localStorage.setItem("site_content", JSON.stringify(newContent));
    await saveToSupabase(newContent);
  };

  const {theme,haircut}=content;
  const scrollTo=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setMenuOpen(false);};
  const login=()=>{ if(adminCode==="admin123"){setShowAdmin(true);setAdminPrompt(false);setAdminCode("");}else alert("Sai mật khẩu!"); };

  return (
    <div style={{ fontFamily:"'Segoe UI','Helvetica Neue',sans-serif",color:"#1a2540",overflowX:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;}
        @media(max-width:767px){
          .grid2{grid-template-columns:1fr!important;}
          .grid4{grid-template-columns:1fr 1fr!important;}
          .hide-mobile{display:none!important;}
          .sec-pad{padding:60px 20px!important;}
          .hero-h1{font-size:36px!important;}
          .about-img{width:200px!important;height:200px!important;font-size:80px!important;}
        }
      `}</style>

      {/* Admin login modal */}
      {adminPrompt&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:5000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
          <div style={{ background:"#fff",borderRadius:16,padding:28,minWidth:280,width:"100%",maxWidth:360 }}>
            <h3 style={{ margin:"0 0 14px",color:"#1a3a6b" }}>🔐 Admin Login</h3>
            <input type="password" placeholder="Mật khẩu admin" value={adminCode} onChange={e=>setAdminCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
              style={{ width:"100%",padding:"10px 12px",border:"1px solid #d0d7e3",borderRadius:8,fontSize:15,marginBottom:12 }} />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={login} style={{ flex:1,padding:"10px",background:"#1a3a6b",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer" }}>Đăng nhập</button>
              <button onClick={()=>setAdminPrompt(false)} style={{ flex:1,padding:"10px",background:"#f4f7fc",border:"1px solid #d0d7e3",borderRadius:8,cursor:"pointer" }}>Hủy</button>
            </div>
            <p style={{ fontSize:12,color:"#8899bb",marginTop:10,marginBottom:0 }}>Mặc định: <code>admin123</code></p>
          </div>
        </div>
      )}

      {showAdmin&&<AdminPanel content={content} onSave={saveContent} onClose={()=>setShowAdmin(false)} />}
      {showQuote&&<QuoteModal onClose={()=>setShowQuote(false)} theme={theme} />}
      {showHaircut&&<HaircutModal onClose={()=>setShowHaircut(false)} theme={theme} haircut={haircut} />}

      {/* NAVBAR */}
      <nav style={{ position:"fixed",top:0,width:"100%",zIndex:100,background:theme.dark,boxShadow:"0 2px 20px rgba(0,0,0,0.4)",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:36,height:36,background:theme.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:13,flexShrink:0 }}>{content.company.logo}</div>
          <span style={{ fontWeight:700,color:"#fff",fontSize:isMobile?15:17 }}>{content.company.name}</span>
        </div>

        {/* Desktop nav */}
        {!isMobile&&(
          <div style={{ display:"flex",gap:4,alignItems:"center" }}>
            {["Home","Services","About","Contact"].map(s=>(
              <button key={s} onClick={()=>scrollTo(s.toLowerCase())} style={{ background:"none",border:"none",color:"#aab8d4",cursor:"pointer",fontSize:14,padding:"6px 10px",borderRadius:6 }} onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#aab8d4"}>{s}</button>
            ))}
            <button onClick={()=>scrollTo("haircut")} style={{ background:"none",border:"none",color:"#c084fc",cursor:"pointer",fontSize:14,padding:"6px 10px",borderRadius:6 }}>✂️ Haircut</button>
            <button onClick={()=>setShowQuote(true)} style={{ padding:"7px 16px",background:theme.accent,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14 }}>Get Quote</button>
            <button onClick={()=>setShowHaircut(true)} style={{ padding:"7px 14px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14 }}>✂️ Book</button>
            <button onClick={()=>setAdminPrompt(true)} style={{ padding:"5px 10px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#aab8d4",borderRadius:6,cursor:"pointer",fontSize:12 }}>Admin</button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile&&(
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:"none",border:"none",cursor:"pointer",padding:6 }}>
            <div style={{ width:24,height:2,background:"#fff",marginBottom:5,borderRadius:2 }} />
            <div style={{ width:24,height:2,background:"#fff",marginBottom:5,borderRadius:2 }} />
            <div style={{ width:24,height:2,background:"#fff",borderRadius:2 }} />
          </button>
        )}
      </nav>

      {/* Mobile menu dropdown */}
      {isMobile&&menuOpen&&(
        <div style={{ position:"fixed",top:60,left:0,right:0,background:theme.dark,zIndex:99,padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
          {["Home","Services","About","Contact"].map(s=>(
            <button key={s} onClick={()=>scrollTo(s.toLowerCase())} style={{ display:"block",width:"100%",textAlign:"left",padding:"12px 20px",background:"none",border:"none",color:"#aab8d4",cursor:"pointer",fontSize:15 }}>{s}</button>
          ))}
          <button onClick={()=>{scrollTo("haircut");setMenuOpen(false);}} style={{ display:"block",width:"100%",textAlign:"left",padding:"12px 20px",background:"none",border:"none",color:"#c084fc",cursor:"pointer",fontSize:15 }}>✂️ Haircut</button>
          <div style={{ padding:"12px 20px",display:"flex",gap:10 }}>
            <button onClick={()=>{setShowQuote(true);setMenuOpen(false);}} style={{ flex:1,padding:"10px",background:theme.accent,color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14 }}>Get Quote</button>
            <button onClick={()=>{setShowHaircut(true);setMenuOpen(false);}} style={{ flex:1,padding:"10px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:8,fontWeight:700,cursor:"pointer",fontSize:14 }}>✂️ Book</button>
          </div>
          <button onClick={()=>{setAdminPrompt(true);setMenuOpen(false);}} style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 20px",background:"none",border:"none",color:"#5a6a8a",cursor:"pointer",fontSize:13 }}>⚙️ Admin</button>
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight:"100vh",background:`linear-gradient(135deg,${theme.dark} 0%,${theme.primary} 60%,#1e4a8c 100%)`,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",paddingTop:60,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,opacity:0.05,backgroundImage:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px" }} />
        <div style={{ maxWidth:800,padding:"40px 20px",position:"relative" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,160,32,0.15)",border:"1px solid rgba(232,160,32,0.3)",borderRadius:99,padding:"6px 14px",marginBottom:24 }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:theme.accent,display:"inline-block" }} />
            <span style={{ color:theme.accent,fontSize:12,fontWeight:600 }}>Professional Logistics Since {content.company.founded}</span>
          </div>
          <h1 className="hero-h1" style={{ fontSize:"clamp(32px,7vw,70px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:20,whiteSpace:"pre-line" }}>{content.hero.headline}</h1>
          <p style={{ fontSize:isMobile?16:19,color:"#aab8d4",marginBottom:36,lineHeight:1.6 }}>{content.hero.subheadline}</p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <button onClick={()=>setShowQuote(true)} style={{ padding:isMobile?"13px 28px":"15px 34px",background:theme.accent,color:"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:isMobile?15:17,cursor:"pointer" }}>{content.hero.cta} →</button>
            <button onClick={()=>scrollTo("services")} style={{ padding:isMobile?"13px 28px":"15px 34px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",borderRadius:10,fontWeight:600,fontSize:isMobile?15:17,cursor:"pointer" }}>Our Services</button>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:isMobile?"20px 32px":32,justifyContent:"center",marginTop:56,maxWidth:500,margin:"56px auto 0" }} className="grid4">
            {content.stats.map((s,i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:isMobile?26:32,fontWeight:900,color:theme.accent }}>{s.value}</div>
                <div style={{ fontSize:12,color:"#8899bb",marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="sec-pad" style={{ padding:"80px 32px",background:theme.light }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <div style={{ display:"inline-block",background:`${theme.primary}15`,color:theme.primary,padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.08em" }}>What We Offer</div>
            <h2 style={{ fontSize:isMobile?28:40,fontWeight:900,color:theme.primary,margin:"0 0 12px" }}>Our Services</h2>
          </div>
          <div className="grid2" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20 }}>
            {content.services.map(s=>(
              <div key={s.id} style={{ background:"#fff",borderRadius:16,padding:isMobile?20:28,border:"1px solid #e0e7f0" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 30px rgba(26,58,107,0.1)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
                <div style={{ width:52,height:52,background:`${theme.primary}12`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:16 }}>{s.icon}</div>
                <h3 style={{ fontWeight:800,fontSize:17,color:theme.primary,marginBottom:8 }}>{s.title}</h3>
                <p style={{ color:"#5a6a8a",lineHeight:1.7,margin:0,fontSize:14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="sec-pad" style={{ padding:"80px 32px",background:"#fff" }}>
        <div className="grid2" style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:isMobile?40:80,alignItems:"center" }}>
          <div>
            <h2 style={{ fontSize:isMobile?26:38,fontWeight:900,color:theme.primary,marginBottom:20 }}>{content.about.title}</h2>
            {content.about.body.split("\n\n").map((p,i)=><p key={i} style={{ color:"#5a6a8a",lineHeight:1.8,fontSize:isMobile?14:16,marginBottom:14 }}>{p}</p>)}
            <div style={{ display:"flex",gap:16,marginTop:24,flexWrap:"wrap" }}>
              {[content.about.badge1,content.about.badge2,content.about.badge3].map(b=>(
                <div key={b} style={{ fontSize:13,fontWeight:600,color:theme.primary,background:`${theme.primary}10`,padding:"6px 12px",borderRadius:99 }}>{b}</div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div className="about-img" style={{ width:isMobile?200:300,height:isMobile?200:300,background:`linear-gradient(135deg,${theme.primary},${theme.accent})`,borderRadius:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isMobile?80:120 }}>{content.about.image}</div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ padding:"50px 20px",background:theme.primary }}>
        <div className="grid4" style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20 }}>
          {content.stats.map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:isMobile?28:40,fontWeight:900,color:theme.accent }}>{s.value}</div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="sec-pad" style={{ padding:"80px 32px",background:theme.light }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <h2 style={{ fontSize:isMobile?26:38,fontWeight:900,color:theme.primary }}>What Our Clients Say</h2>
          </div>
          <div className="grid2" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20 }}>
            {content.testimonials.map(t=>(
              <div key={t.id} style={{ background:"#fff",borderRadius:16,padding:isMobile?20:28,border:"1px solid #e0e7f0" }}>
                <div style={{ fontSize:24,color:theme.accent,marginBottom:12 }}>❝</div>
                <p style={{ color:"#5a6a8a",lineHeight:1.7,fontSize:14,marginBottom:20 }}>{t.text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:40,height:40,background:theme.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:15,flexShrink:0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight:700,color:theme.primary,fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:"#8899bb" }}>{t.company}</div>
                  </div>
                  <div style={{ marginLeft:"auto",color:theme.accent,fontSize:13 }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sec-pad" style={{ padding:"80px 32px",background:theme.dark }}>
        <div className="grid2" style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:isMobile?40:80 }}>
          <div>
            <h2 style={{ fontSize:isMobile?24:38,fontWeight:900,color:"#fff",marginBottom:12 }}>{content.contact.title}</h2>
            <p style={{ color:"#8899bb",fontSize:15,marginBottom:32,lineHeight:1.7 }}>{content.contact.subtitle}</p>
            {[["📞","Phone",content.company.phone],["✉️","Email",content.company.email],["📍","Address",content.company.address]].map(([icon,label,val])=>(
              <div key={label} style={{ display:"flex",gap:14,alignItems:"flex-start",marginBottom:18 }}>
                <div style={{ width:40,height:40,background:"rgba(255,255,255,0.08)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{icon}</div>
                <div><div style={{ fontSize:12,color:"#8899bb",marginBottom:3 }}>{label}</div><div style={{ color:"#fff",fontSize:14 }}>{val}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,255,255,0.05)",borderRadius:16,padding:isMobile?20:32,border:"1px solid rgba(255,255,255,0.1)" }}>
            {["Họ tên","Tên công ty","Email","Số điện thoại"].map(p=>(
              <input key={p} placeholder={p} style={{ width:"100%",padding:"11px 13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#fff",fontSize:14,marginBottom:12,boxSizing:"border-box" }} />
            ))}
            <textarea placeholder="Nhu cầu vận chuyển..." rows={3} style={{ width:"100%",padding:"11px 13px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#fff",fontSize:14,marginBottom:12,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit" }} />
            <button onClick={()=>setShowQuote(true)} style={{ width:"100%",padding:"14px",background:theme.accent,color:"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:15,cursor:"pointer" }}>Gửi yêu cầu →</button>
          </div>
        </div>
      </section>

      {/* HAIRCUT */}
      <section id="haircut" className="sec-pad" style={{ padding:"80px 32px",background:"#1a0533" }}>
        <div className="grid2" style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:isMobile?40:80,alignItems:"center" }}>
          <div>
            <div style={{ display:"inline-block",background:"rgba(124,58,237,0.2)",color:"#c084fc",padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:700,marginBottom:18,textTransform:"uppercase",letterSpacing:"0.08em" }}>{haircut.badge}</div>
            <h2 style={{ fontSize:isMobile?26:38,fontWeight:900,color:"#fff",marginBottom:14 }}>{haircut.title}</h2>
            <p style={{ color:"#b899cc",fontSize:isMobile?14:16,lineHeight:1.8,marginBottom:28 }}>{haircut.description}</p>
            <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:32 }}>
              {haircut.priceList.map(p=>(
                <div key={p.id} style={{ display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"11px 16px",border:"1px solid rgba(124,58,237,0.3)" }}>
                  <span style={{ fontSize:20 }}>{p.icon}</span>
                  <span style={{ color:"#e2d4f0",flex:1,fontSize:14 }}>{p.name}</span>
                  <span style={{ color:"#c084fc",fontWeight:700,fontSize:14 }}>{p.price}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowHaircut(true)} style={{ padding:"14px 36px",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,fontWeight:800,fontSize:16,cursor:"pointer" }}>{haircut.buttonText} →</button>
          </div>
          <div className="hide-mobile" style={{ display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div style={{ width:260,height:260,background:"linear-gradient(135deg,#7c3aed,#c084fc)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:110 }}>✂️</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#060e1a",padding:"28px 20px",textAlign:"center" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14 }}>
          <div style={{ width:28,height:28,background:theme.accent,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#fff",fontSize:11 }}>{content.company.logo}</div>
          <span style={{ color:"#aab8d4",fontWeight:700,fontSize:14 }}>{content.company.name}</span>
        </div>
        <div style={{ display:"flex",gap:16,justifyContent:"center",marginBottom:14,flexWrap:"wrap" }}>
          {content.footer.links.map(l=><a key={l} href="#" style={{ color:"#5a6a8a",textDecoration:"none",fontSize:12 }}>{l}</a>)}
        </div>
        <p style={{ color:"#3a4a6a",fontSize:12,margin:0 }}>{content.footer.copy}</p>
      </footer>
    </div>
  );
}
