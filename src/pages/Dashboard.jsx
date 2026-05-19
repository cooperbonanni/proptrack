import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getAccounts, upsertAccount, upsertManyAccounts, deleteAccount, getDailyLog, upsertLogEntry } from '../lib/supabase'
import { FIRMS, STATUS_OPTIONS, STATUS_META } from '../lib/firms'

const iSx = {width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"};

function PBar({pct,color}) {
  return <div style={{background:"#F1F5F9",borderRadius:99,height:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:Math.min(100,Math.max(0,pct||0))+"%",background:color,transition:"width .5s ease"}}/></div>;
}

function Logo({size=32}) {
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1D4ED8"/><path d="M9 29L16 17L23 23L31 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="31" cy="10" r="3" fill="#93C5FD"/><line x1="9" y1="33" x2="31" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.35"/></svg>;
}

function Btn({children,onClick,v="primary",small=false,sx={}}) {
  const base={cursor:"pointer",border:"none",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,transition:"all .15s",fontSize:small?12:13,padding:small?"6px 14px":"10px 20px"};
  const vs={primary:{background:"#1D4ED8",color:"#fff"},secondary:{background:"#F8FAFC",color:"#374151",border:"1px solid #E2E8F0"},danger:{background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA"},ghost:{background:"transparent",color:"#6B7280",border:"1px solid #E2E8F0"}};
  return <button onClick={onClick} style={{...base,...vs[v],...sx}}>{children}</button>;
}

function FInp({value,onChange,placeholder="",type="text"}) {
  const [f,setF]=useState(false);
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...iSx,borderColor:f?"#2563EB":"#E2E8F0"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>;
}

function FSel({value,onChange,options}) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{...iSx,cursor:"pointer"}}>{options.map(o=>typeof o==="string"?<option key={o} value={o}>{o}</option>:<option key={o.v} value={o.v}>{o.l}</option>)}</select>;
}

function Modal({title,sub,accent="#1D4ED8",onClose,children,wide=false}) {
  return <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:wide?640:520,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:"4px solid "+accent}}>
      <div style={{padding:"22px 28px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontSize:17,fontWeight:700,color:"#0F172A"}}>{title}</div>{sub&&<div style={{fontSize:12,color:"#94A3B8",marginTop:3}}>{sub}</div>}</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
      </div>
      <div style={{padding:"24px 28px"}}>{children}</div>
    </div>
  </div>;
}

function Field({label,children,span=2}) {
  return <div style={{gridColumn:"span "+span}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>{label}</label>{children}</div>;
}


export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) return
    getAccounts(user.id).then(({ data }) => {
      if (data) setAccounts(data.map(a => ({
        ...a,
        currentProfit: String(a.current_profit ?? ''),
        profitTarget: String(a.profit_target ?? ''),
        daysTraded: String(a.days_traded ?? ''),
        winningDays: String(a.winning_days ?? ''),
        currentBalance: String(a.current_balance ?? ''),
        bestDayPnl: String(a.best_day_pnl ?? ''),
        accountSize: a.account_size,
        payoutsCount: String(a.payouts_count ?? 0),
      })))
      setLoading(false)
    })
  }, [user])

  async function saveAccount(acct) {
    const row = {
      id: acct.id,
      user_id: user.id,
      firm: acct.firm,
      plan: acct.plan,
      account_size: acct.accountSize,
      status: acct.status,
      current_profit: parseFloat(acct.currentProfit) || 0,
      profit_target: parseFloat(acct.profitTarget) || null,
      days_traded: parseInt(acct.daysTraded) || 0,
      winning_days: parseInt(acct.winningDays) || 0,
      payouts_count: parseInt(acct.payoutsCount) || 0,
      current_balance: parseFloat(acct.currentBalance) || null,
      best_day_pnl: parseFloat(acct.bestDayPnl) || null,
      notes: acct.notes || '',
    }
    await upsertAccount(row)
  }

  async function saveManyAccounts(accts) {
    const rows = accts.map(a => ({
      id: a.id,
      user_id: user.id,
      firm: a.firm,
      plan: a.plan,
      account_size: a.accountSize,
      status: a.status,
      current_profit: parseFloat(a.currentProfit) || 0,
      profit_target: parseFloat(a.profitTarget) || null,
      days_traded: parseInt(a.daysTraded) || 0,
      winning_days: parseInt(a.winningDays) || 0,
      payouts_count: parseInt(a.payoutsCount) || 0,
      current_balance: parseFloat(a.currentBalance) || null,
      best_day_pnl: parseFloat(a.bestDayPnl) || null,
      notes: a.notes || '',
    }))
    await upsertManyAccounts(rows)
  }
  
  // placeholder for loading state check
  const [view,setView]         = useState("dashboard");
  const [modal,setModal]       = useState(null);
  const [selected,setSelected] = useState(null);
  const [filterStatus,setFilterStatus] = useState("All");
  const [bulkModal,setBulkModal] = useState(false);
  const [bulkAmount,setBulkAmount] = useState("");
  const [bulkSelected,setBulkSelected] = useState({});
  const [bulkMode,setBulkMode] = useState("add");
  const [dailyLog, setDailyLog] = useState({})
  
  useEffect(() => {
    if (!user) return
    getDailyLog(user.id).then(({ data }) => {
      if (data) {
        const map = {}
        data.forEach(e => { map[e.date] = { total: e.total, eval: e.eval_pnl, funded: e.funded_pnl, note: e.note } })
        setDailyLog(map)
      }
    })
  }, [user])
  const [showFunded,setShowFunded] = useState(true);
  const [showEval,setShowEval] = useState(true);
  const [quickView,setQuickView] = useState(false);
  const [updatePnlAcct,setUpdatePnlAcct] = useState(null);
  const [payoutAcct,setPayoutAcct] = useState(null);
  const [payoutAmount,setPayoutAmount] = useState("");
  const [bulkAddForm,setBulkAddForm] = useState({firm:"apex",plan:"eod",accountSize:"50K",status:"Evaluation",count:"5"});
  const [dismissedAlerts, setDismissedAlerts] = useState({})
  const [updatePnlAmount,setUpdatePnlAmount] = useState("");
  const [updatePnlMode,setUpdatePnlMode] = useState("add");
  const [filterFirm,setFilterFirm]     = useState("All");
  const [search,setSearch]     = useState("");

  const blankAcct = (fk="apex") => {
    const pk = Object.keys(FIRMS[fk].plans)[0];
    const pl = FIRMS[fk].plans[pk];
    const sz = Object.keys(pl.targets)[1]||Object.keys(pl.targets)[0];
    return {id:uid(),firm:fk,plan:pk,accountSize:sz,currentProfit:"",profitTarget:"",daysTraded:"",currentBalance:"",bestDayPnl:"",winningDays:"",status:"Evaluation",notes:"",createdAt:Date.now()};
  };

  const [form,setForm] = useState(blankAcct());
  const upd = k => v => setForm(f=>({...f,[k]:v}));

  const changeFirm = fk => {
    const pk=Object.keys(FIRMS[fk].plans)[0];
    const pl=FIRMS[fk].plans[pk];
    const sz=Object.keys(pl.targets)[1]||Object.keys(pl.targets)[0];
    setForm(f=>({...f,firm:fk,plan:pk,accountSize:sz,profitTarget:""}));
  };

  const changePlan = pk => {
    const pl=FIRMS[form.firm].plans[pk];
    const sz=Object.keys(pl.targets)[1]||Object.keys(pl.targets)[0];
    setForm(f=>({...f,plan:pk,accountSize:sz,profitTarget:""}));
  };

  const save = () => {
    modal==="add" ? setAccounts(p=>[...p,form]) : setAccounts(p=>p.map(a=>a.id===form.id?form:a));
    setModal(null);
  };

  const del = id => { setAccounts(p=>p.filter(a=>a.id!==id)); setModal(null); };

  const filtered = accounts.filter(a => {
    if (filterStatus!=="All"&&a.status!==filterStatus) return false;
    if (filterFirm!=="All"&&a.firm!==filterFirm) return false;
    if (search&&!FIRMS[a.firm]?.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const kpis = {
    total:    accounts.length,
    funded:   accounts.filter(a=>["Funded","Payout Eligible","Passed"].includes(a.status)).length,
    payout:   accounts.filter(a=>calcElig(a).eligible).length,
    violated: accounts.filter(a=>a.status==="Violated").length,
    eval:     accounts.filter(a=>a.status==="Evaluation").length,
  };

  const ff = FIRMS[form.firm];
  const fp = ff?.plans[form.plan];
  const fSizes = fp ? Object.keys(fp.targets) : ["50K"];
  const fElig  = calcElig(form);

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:32,height:32,border:"3px solid #E2E8F0",borderTop:"3px solid #1D4ED8",borderRadius:"50%",animation:"spin .7s linear infinite"}}/></div>
  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><div style={{width:32,height:32,border:"3px solid #E2E8F0",borderTop:"3px solid #1D4ED8",borderRadius:"50%",animation:"spin .7s linear infinite"}}/></div>

  return <div style={{minHeight:"100vh",fontFamily:"'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",color:"#0F172A"}}>
    <style>{`*{box-sizing:border-box} .fade{animation:fadeUp .22s ease both} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} .card{transition:box-shadow .18s,transform .18s} .card:hover{box-shadow:0 6px 24px rgba(0,0,0,.07);transform:translateY(-1px)} input::placeholder{color:#CBD5E1}`}</style>
    <div className="fade">
          <div>
            <h1 style={{fontSize:22,fontWeight:800}}>Accounts</h1>
            <p style={{fontSize:13,color:"#64748B",marginTop:4}}>Track all your prop firm accounts, rules, and payout eligibility.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            {accounts.length>0&&<Btn v="ghost" onClick={()=>setQuickView(v=>!v)}>{quickView?"🔍 Detail View":"⚡ Quick View"}</Btn>}
            {accounts.length>0&&<Btn v="ghost" onClick={()=>{setBulkSelected(Object.fromEntries(accounts.map(a=>[a.id,true])));setBulkAmount("");setBulkModal(true);}}>📊 Bulk Update P+L</Btn>}
            <Btn onClick={()=>{setForm(blankAcct());setModal("add")}}>+ Add Account</Btn>
            <Btn v="secondary" onClick={()=>setModal("bulkAdd")}>+ Add Multiple</Btn>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:28}}>
          {[{label:"Accounts",val:kpis.total,c:"#1D4ED8"},{label:"Funded",val:kpis.funded,c:"#059669"},{label:"Payout Ready",val:kpis.payout,c:"#D97706",pulse:true},{label:"Violated",val:kpis.violated,c:"#DC2626"},{label:"In Evaluation",val:kpis.eval,c:"#7C3AED"}].map(k=>(
            <div key={k.label} className={k.pulse&&k.val>0?"payout-pop":""} style={{background:"#fff",borderRadius:12,padding:"16px 18px",border:"1px solid #E2E8F0",borderTop:"3px solid "+k.c}}>
              <div style={{fontSize:28,fontWeight:800,color:k.c,lineHeight:1}}>{k.val}</div>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:6,fontWeight:500}}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Smart Alerts */}
        {(()=>{
          const alerts = [];
          accounts.forEach(acct => {
            const firm = FIRMS[acct.firm]; const plan = firm?.plans[acct.plan];
            if (!firm || !plan) return;
            const profit = parseFloat(acct.currentProfit)||0;
            const target = parseFloat(acct.profitTarget)||((plan.targets&&plan.targets[acct.accountSize])||0);
            const e = calcElig(acct);
            const alertKey = acct.id;

            if (acct.status === "Violated" && !dismissedAlerts[alertKey+"_violated"]) {
              alerts.push({key:alertKey+"_violated", type:"danger", icon:"🚨", title:"Account Violated", msg:firm.name+" "+acct.accountSize+" ("+plan.label+") has been violated.", acct});
            }
            // Payout eligible — ONLY on funded accounts (Funded or Payout Eligible status)
            if (e.isFunded && e.eligible && !dismissedAlerts[alertKey+"_payout"]) {
              alerts.push({key:alertKey+"_payout", type:"success", icon:"⚡", title:"Payout Eligible!", msg:firm.name+" "+acct.accountSize+" is eligible for a payout — "+plan.split+" · "+plan.payoutSpeed, acct});
            }
            // Eval passed — status is Passed OR eval criteria all met
            const evalPassed = acct.status==="Passed" || (e.isEval && e.eligible);
            if (evalPassed && !dismissedAlerts[alertKey+"_passed"]) {
              alerts.push({key:alertKey+"_passed", type:"purple", icon:"🎉", title:"Evaluation Passed!", msg:firm.name+" "+acct.accountSize+" ("+plan.label+") has met all evaluation requirements. Time to get funded!", acct});
            }
            // Drawdown warning — within 15% of floor (requires current balance entered)
            const dd = plan.drawdownAmounts?.[acct.accountSize];
            const bal = parseFloat(acct.currentBalance)||0;
            if (dd && bal > 0 && acct.status !== "Violated") {
              const floor = bal - dd;
              const room = bal - floor;
              if (room <= dd * 0.15 && !dismissedAlerts[alertKey+"_dd_warn"]) {
                alerts.push({key:alertKey+"_dd_warn", type:"warning", icon:"⚠️", title:"Drawdown Warning", msg:firm.name+" "+acct.accountSize+" — only $"+room.toFixed(0)+" remaining before floor ($"+floor.toFixed(0)+"). Be careful.", acct});
              }
            }
            // Close to target — within $200 on eval accounts not yet eligible
            if (e.isEval && !e.eligible) {
              const target2 = parseFloat(acct.profitTarget)||((plan.targets&&plan.targets[acct.accountSize])||0);
              const profit2 = parseFloat(acct.currentProfit)||0;
              const rem = target2 - profit2;
              if (target2 > 0 && rem > 0 && rem <= 200 && !dismissedAlerts[alertKey+"_target_warn"]) {
                alerts.push({key:alertKey+"_target_warn", type:"info", icon:"🎯", title:"Almost There!", msg:firm.name+" "+acct.accountSize+" — just $"+rem.toFixed(0)+" away from the profit target!", acct});
              }
            }
          });

          if (alerts.length === 0) return null;

          const colors = {
            danger:  {bg:"#FEF2F2",border:"#FECACA",title:"#DC2626",text:"#991B1B"},
            success: {bg:"#FFFBEB",border:"#FDE68A",title:"#D97706",text:"#92400E"},
            purple:  {bg:"#F5F3FF",border:"#DDD6FE",title:"#7C3AED",text:"#5B21B6"},
            warning: {bg:"#FFF7ED",border:"#FED7AA",title:"#C2410C",text:"#9A3412"},
            info:    {bg:"#EFF6FF",border:"#BFDBFE",title:"#1D4ED8",text:"#1E3A8A"},
          };

          return <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
            {alerts.map(a=>{
              const c = colors[a.type];
              return <div key={a.key} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px",borderRadius:10,background:c.bg,border:"1px solid "+c.border}}>
                <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{a.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:c.title}}>{a.title}</div>
                  <div style={{fontSize:12,color:c.text,marginTop:1}}>{a.msg}</div>
                </div>
                <button onClick={()=>setDismissedAlerts(d=>({...d,[a.key]:true}))} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:16,flexShrink:0,padding:"0 2px",lineHeight:1}}>×</button>
              </div>;
            })}
          </div>;
        })()}

        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search firm..." style={{...iSx,width:190,fontSize:13}}/>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...iSx,width:160,fontSize:13}}><option>All</option>{STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}</select>
          <select value={filterFirm} onChange={e=>setFilterFirm(e.target.value)} style={{...iSx,width:200,fontSize:13}}><option value="All">All Firms</option>{Object.entries(FIRMS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}</select>
        </div>

        {filtered.length===0&&<div style={{background:"#fff",border:"2px dashed #E2E8F0",borderRadius:14,padding:"72px 24px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:14}}>📊</div>
          <div style={{fontSize:15,fontWeight:600,color:"#374151",marginBottom:6}}>{accounts.length===0?"No accounts yet":"No accounts match your filters"}</div>
          <div style={{fontSize:13,color:"#94A3B8",marginBottom:20}}>{accounts.length===0?"Add your first prop firm account to start tracking.":"Try adjusting the filters above."}</div>
          {accounts.length===0&&<Btn onClick={()=>{setForm(blankAcct());setModal("add")}}>+ Add First Account</Btn>}
        </div>}

        {/* Quick View grid */}
        {quickView&&filtered.length>0&&<div style={{background:"#fff",borderRadius:12,border:"1px solid #E2E8F0",overflow:"hidden",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))"}}>
            {filtered.map((acct,i)=>{
              const firm=FIRMS[acct.firm]; const plan=firm?.plans[acct.plan];
              const profit=parseFloat(acct.currentProfit)||0;
              const target=parseFloat(acct.profitTarget)||(plan?.targets[acct.accountSize]||0);
              const profPct=target>0?Math.min(100,Math.round((profit/target)*100)):null;
              const isFundedAcct=["Funded","Payout Eligible"].includes(acct.status);
              const e=calcElig(acct);
              const sm=STATUS_META[acct.status]||STATUS_META["Evaluation"];
              return <div key={acct.id} onClick={()=>{setSelected(acct);setModal("detail");}}
                style={{padding:"12px 14px",borderLeft:"3px solid "+firm?.color,borderBottom:"1px solid #F1F5F9",cursor:"pointer",transition:"background .1s",background:"#fff"}}
                onMouseEnter={ev=>ev.currentTarget.style.background="#F8FAFC"}
                onMouseLeave={ev=>ev.currentTarget.style.background="#fff"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:4,marginBottom:2}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#0F172A",lineHeight:1.3,flex:1}}>{firm?.name}</div>
                  <span style={{fontSize:9,padding:"2px 5px",borderRadius:3,background:sm.bg,color:sm.color,fontWeight:600,flexShrink:0}}>{acct.status}</span>
                </div>
                <div style={{fontSize:10,color:"#94A3B8",marginBottom:6}}>{plan?.label} · {acct.accountSize}</div>
                <div style={{fontSize:15,fontWeight:800,color:profit>=0?(firm?.color||"#1D4ED8"):"#DC2626",marginBottom:isFundedAcct?4:2}}>${profit.toLocaleString()}</div>
                {!isFundedAcct&&profPct!==null&&<><div style={{background:"#F1F5F9",borderRadius:99,height:3,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:profPct+"%",background:firm?.color}}/></div><div style={{fontSize:9,color:"#94A3B8",marginTop:2}}>{profPct}% to target</div></>}
                {e.eligible&&isFundedAcct&&<div style={{fontSize:9,fontWeight:700,color:"#D97706"}}>⚡ Payout Eligible</div>}{e.eligible&&!isFundedAcct&&<div style={{fontSize:9,fontWeight:700,color:"#7C3AED"}}>🎉 Ready to Pass</div>}
                {isFundedAcct&&!e.eligible&&plan?.minWinDays>0&&<div style={{fontSize:9,color:"#94A3B8"}}>{parseInt(acct.winningDays)||0}/{plan.minWinDays} winning days</div>}
              </div>;
            })}
          </div>
        </div>}

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(acct=><AcctCard key={acct.id} acct={acct}
            onEdit={()=>{setForm({...acct});setModal("edit")}}
            onDetail={()=>{setSelected(acct);setModal("detail")}}
            onStatusChange={async s=>{
                  const updated={...acct,status:s};
                  setAccounts(p=>p.map(a=>a.id===acct.id?updated:a));
                  await saveAccount(updated);
                }}
            onDelete={()=>del(acct.id)}
            onUpdatePnl={a=>{setUpdatePnlAcct(a);setUpdatePnlAmount("");setUpdatePnlMode("add");}}
            onPayout={a=>{setPayoutAcct(a);setPayoutAmount("");}}/>)}
        </div>
      </div>}

    {/* TAKE PAYOUT MODAL */}
  {payoutAcct&&(()=>{
    const firm=FIRMS[payoutAcct.firm]; const plan=firm?.plans[payoutAcct.plan];
    const current=parseFloat(payoutAcct.currentProfit)||0;
    const withdrawn=parseFloat(payoutAmount)||0;
    const remaining=current-withdrawn;
    const winDays=parseInt(payoutAcct.winningDays)||0;
    return <div onClick={e=>e.target===e.currentTarget&&setPayoutAcct(null)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:420,boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:"4px solid #D97706"}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>Take Payout</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{firm?.name} · {payoutAcct.accountSize} · {plan?.label}</div>
            <div style={{fontSize:12,color:"#7C3AED",marginTop:3,fontWeight:600}}>Payout #{(parseInt(payoutAcct.payoutsCount)||0)+1}</div>
          </div>
          <button onClick={()=>setPayoutAcct(null)} style={{background:"none",border:"none",fontSize:22,color:"#94A3B8",cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"20px 24px"}}>
          {/* Info box */}
          <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:9,padding:"12px 14px",marginBottom:16,fontSize:12,color:"#92400E",lineHeight:1.7}}>
            <strong>What this does:</strong><br/>
            Resets your winning days counter back to 0 so you can start a new payout cycle. Your profit stays — only enter the amount you actually withdrew if you want to track your remaining balance.
          </div>

          {/* Current state */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            <div style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",border:"1px solid #E2E8F0"}}>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:600,marginBottom:3}}>CURRENT P+L</div>
              <div style={{fontSize:16,fontWeight:800,color:"#059669"}}>${current.toLocaleString()}</div>
            </div>
            <div style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",border:"1px solid #E2E8F0"}}>
              <div style={{fontSize:10,color:"#94A3B8",fontWeight:600,marginBottom:3}}>WINNING DAYS</div>
              <div style={{fontSize:16,fontWeight:800,color:"#D97706"}}>{winDays} / {plan?.minWinDays||0}</div>
            </div>
          </div>

          {/* Amount withdrawn */}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>
              Amount Withdrawn ($) <span style={{color:"#94A3B8",fontWeight:400}}>— optional</span>
            </label>
            <input type="number" value={payoutAmount} onChange={e=>setPayoutAmount(e.target.value)}
              placeholder={"e.g. "+Math.round(current*0.5).toLocaleString()}
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #E2E8F0",background:"#F8FAFC",fontSize:13,outline:"none"}}/>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>
              Leave blank to just reset winning days without changing your P+L
            </div>
          </div>

          {/* Preview */}
          {payoutAmount&&<div style={{padding:"10px 12px",borderRadius:8,background:"#F0FDF4",border:"1px solid #A7F3D0",marginBottom:14,fontSize:12}}>
            <div style={{color:"#059669",fontWeight:600,marginBottom:2}}>After payout:</div>
            <div style={{color:"#374151"}}>P+L: <strong>${Math.max(0,remaining).toLocaleString()}</strong> remaining</div>
            <div style={{color:"#374151"}}>Winning days: <strong>0</strong> (reset for new cycle)</div>
          </div>}
          {!payoutAmount&&<div style={{padding:"10px 12px",borderRadius:8,background:"#F0FDF4",border:"1px solid #A7F3D0",marginBottom:14,fontSize:12}}>
            <div style={{color:"#059669",fontWeight:600,marginBottom:2}}>After payout:</div>
            <div style={{color:"#374151"}}>P+L: <strong>${current.toLocaleString()}</strong> (unchanged)</div>
            <div style={{color:"#374151"}}>Winning days: <strong>0</strong> (reset for new cycle)</div>
          </div>}

          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{
              const updated = {
                ...payoutAcct,
                winningDays: "0",
                currentProfit: payoutAmount ? String(Math.max(0,remaining)) : String(current),
                payoutsCount: String((parseInt(payoutAcct.payoutsCount)||0) + 1),
              };
              setAccounts(p=>p.map(a=>a.id===payoutAcct.id?updated:a));
              await saveAccount(updated);
              setPayoutAcct(null);
              setPayoutAmount("");
            }} style={{flex:1,padding:"11px",background:"#D97706",color:"#fff",border:"none",borderRadius:8,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              Confirm Payout
            </button>
            <button onClick={()=>setPayoutAcct(null)} style={{padding:"11px 18px",background:"transparent",color:"#6B7280",border:"1px solid #E2E8F0",borderRadius:8,fontFamily:"inherit",fontWeight:600,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>;
  })()}

  {updatePnlAcct&&(()=>{
    const firm=FIRMS[updatePnlAcct.firm]; const plan=firm?.plans[updatePnlAcct.plan];
    const current=parseFloat(updatePnlAcct.currentProfit)||0;
    const preview=updatePnlMode==="add"?(current+(parseFloat(updatePnlAmount)||0)):(parseFloat(updatePnlAmount)||0);
    return <div onClick={e=>e.target===e.currentTarget&&setUpdatePnlAcct(null)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:"4px solid "+(firm?.color||"#1D4ED8")}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>{firm?.name} · {updatePnlAcct.accountSize}</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{plan?.label} · Current P+L: ${current.toLocaleString()}</div>
          </div>
          <button onClick={()=>setUpdatePnlAcct(null)} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:22}}>×</button>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[{id:"add",label:"➕ Add",sub:"Add to current"},{id:"set",label:"📝 Set",sub:"Replace total"}].map(opt=>(
              <div key={opt.id} onClick={()=>setUpdatePnlMode(opt.id)} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",border:"2px solid "+(updatePnlMode===opt.id?(firm?.color||"#1D4ED8"):"#E2E8F0"),background:updatePnlMode===opt.id?(firm?.color||"#1D4ED8")+"0D":"#F8FAFC",textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:updatePnlMode===opt.id?(firm?.color||"#1D4ED8"):"#374151"}}>{opt.label}</div>
                <div style={{fontSize:10,color:"#94A3B8"}}>{opt.sub}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>{updatePnlMode==="add"?"Amount to Add ($)":"Set P+L to ($)"}</label>
            <input type="number" value={updatePnlAmount} onChange={e=>setUpdatePnlAmount(e.target.value)} placeholder={updatePnlMode==="add"?"e.g. 250":"e.g. 1500"}
              style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"10px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,outline:"none"}} autoFocus/>
          </div>
          {updatePnlAmount&&<div style={{padding:"10px 12px",borderRadius:8,background:"#EFF6FF",border:"1px solid #BFDBFE",marginBottom:14,fontSize:12,color:"#1D4ED8"}}>
            P+L will become: <strong>${preview.toFixed(2)}</strong>
          </div>}
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{
              if(!updatePnlAmount) return;
              const amt=parseFloat(updatePnlAmount); if(isNaN(amt)) return;
              const newProfit=(updatePnlMode==="add"?current+amt:amt).toFixed(2);
              // Check winning day for funded accounts
              const plan2=FIRMS[updatePnlAcct.firm]?.plans[updatePnlAcct.plan];
              const isFundedAcct=["Funded","Payout Eligible"].includes(updatePnlAcct.status);
              const sizeThresh=plan2?.winDayThresholds?.[updatePnlAcct.accountSize];
              const isWinDay=updatePnlMode==="add" && isFundedAcct && plan2?.minWinDays>0 && sizeThresh!==null && sizeThresh!==undefined && amt>(sizeThresh||0);
              const curWinDays=parseInt(updatePnlAcct.winningDays)||0;
              setAccounts(p=>p.map(a=>a.id===updatePnlAcct.id?{...a,currentProfit:newProfit,...(isWinDay?{winningDays:String(curWinDays+1)}:{})}:a));
              // Log to daily calendar if adding
              if(updatePnlMode==="add"){
                const today=new Date().toISOString().slice(0,10);
                setDailyLog(l=>{const ex=l[today]||{total:0,eval:0,funded:0,note:""};return {...l,[today]:{total:parseFloat((ex.total+amt).toFixed(2)),eval:ex.eval+(["Evaluation"].includes(updatePnlAcct.status)?amt:0),funded:ex.funded+(isFundedAcct?amt:0),note:ex.note||(firm?.name+" +$"+amt),ts:Date.now()}};});
              }
              setUpdatePnlAcct(null); setUpdatePnlAmount("");
            }} style={{flex:1,padding:"11px",background:firm?.color||"#1D4ED8",color:"#fff",border:"none",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              Apply
            </button>
            <button onClick={()=>setUpdatePnlAcct(null)} style={{padding:"11px 18px",background:"transparent",color:"#6B7280",border:"1px solid #E2E8F0",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>;
  })()}

  {bulkModal&&<div onClick={e=>e.target===e.currentTarget&&setBulkModal(false)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:560,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:"4px solid #1D4ED8"}}>
      <div style={{padding:"22px 28px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={{fontSize:17,fontWeight:700,color:"#0F172A"}}>Bulk P+L Update</div><div style={{fontSize:12,color:"#94A3B8",marginTop:3}}>Update profit across multiple accounts at once</div></div>
        <button onClick={()=>setBulkModal(false)} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
      </div>
      <div style={{padding:"24px 28px"}}>
        {/* Mode toggle */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {[{id:"add",label:"➕ Add to P+L",sub:"Add today's profit to each account"},{id:"set",label:"📝 Set P+L",sub:"Replace current profit with this amount"}].map(opt=>(
            <div key={opt.id} onClick={()=>setBulkMode(opt.id)} style={{padding:"12px 14px",borderRadius:10,cursor:"pointer",border:"2px solid "+(bulkMode===opt.id?"#1D4ED8":"#E2E8F0"),background:bulkMode===opt.id?"#EFF6FF":"#F8FAFC",transition:"all .15s"}}>
              <div style={{fontSize:13,fontWeight:700,color:bulkMode===opt.id?"#1D4ED8":"#374151"}}>{opt.label}</div>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{opt.sub}</div>
            </div>
          ))}
        </div>

        {/* Amount input */}
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>{bulkMode==="add"?"Amount to Add ($)":"Set P+L to ($)"}</label>
          <input type="number" value={bulkAmount} onChange={e=>setBulkAmount(e.target.value)} placeholder={bulkMode==="add"?"e.g. 250 (today's profit)":"e.g. 1500 (total profit so far)"}
            style={{...{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}}/>
        </div>

        {/* Account selection */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <label style={{fontSize:12,fontWeight:600,color:"#374151"}}>Select Accounts</label>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setBulkSelected(Object.fromEntries(accounts.map(a=>[a.id,true])))} style={{fontSize:11,color:"#1D4ED8",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Select All</button>
              <button onClick={()=>setBulkSelected({})} style={{fontSize:11,color:"#94A3B8",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Clear</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:240,overflowY:"auto"}}>
            {accounts.map(acct=>{
              const firm = FIRMS[acct.firm];
              const plan = firm?.plans[acct.plan];
              const on = !!bulkSelected[acct.id];
              return <div key={acct.id} onClick={()=>setBulkSelected(p=>({...p,[acct.id]:!p[acct.id]}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,cursor:"pointer",border:"1px solid "+(on?(firm?.color||"#1D4ED8")+"44":"#E2E8F0"),background:on?(firm?.color||"#1D4ED8")+"08":"#F8FAFC",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:on?(firm?.color||"#1D4ED8"):"#CBD5E1",flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:on?"#0F172A":"#64748B"}}>{firm?.name} · {acct.accountSize}</div>
                    <div style={{fontSize:11,color:"#94A3B8"}}>{plan?.label} · Current P+L: ${parseFloat(acct.currentProfit||0).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{width:18,height:18,borderRadius:4,border:"2px solid "+(on?"#1D4ED8":"#CBD5E1"),background:on?"#1D4ED8":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {on&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                </div>
              </div>;
            })}
          </div>
        </div>

        {/* Preview */}
        {bulkAmount&&Object.values(bulkSelected).some(Boolean)&&<div style={{padding:"12px 14px",borderRadius:9,background:"#EFF6FF",border:"1px solid #BFDBFE",marginBottom:16,fontSize:12,color:"#1D4ED8"}}>
          {bulkMode==="add"
            ? `Will add $${parseFloat(bulkAmount).toLocaleString()} to ${Object.values(bulkSelected).filter(Boolean).length} account${Object.values(bulkSelected).filter(Boolean).length!==1?"s":""}`
            : `Will set P+L to $${parseFloat(bulkAmount).toLocaleString()} on ${Object.values(bulkSelected).filter(Boolean).length} account${Object.values(bulkSelected).filter(Boolean).length!==1?"s":""}`}
        </div>}

        <div style={{display:"flex",gap:10}}>
          <Btn onClick={()=>{
            if (!bulkAmount||!Object.values(bulkSelected).some(Boolean)) return;
            const amt = parseFloat(bulkAmount);
            if (isNaN(amt)) return;
            const selectedAccts = accounts.filter(a=>bulkSelected[a.id]);
            const today = new Date().toISOString().slice(0,10);

            // Update account P+L and winning days
            setAccounts(p=>p.map(a=>{
              if (!bulkSelected[a.id]) return a;
              const firm = FIRMS[a.firm];
              const plan = firm?.plans[a.plan];
              const current = parseFloat(a.currentProfit)||0;
              const newProfit = bulkMode==="add" ? (current+amt).toFixed(2) : amt.toFixed(2);

              // Check if this qualifies as a winning day for this account
              // Winning day thresholds vary by firm/plan — use $100 for most, $200 for Alpha
              let winThreshold = 100; // default
              if (a.firm === "alpha") winThreshold = 200;
              else if (a.firm === "fundednext" && a.plan === "legacy") winThreshold = 200;

              const isFundedAcct = ["Funded","Payout Eligible"].includes(a.status);
              // Get the per-size winning day threshold for this specific plan
              const sizeThreshold = plan?.winDayThresholds?.[a.accountSize];
              const qualifiesAsWinDay = bulkMode==="add"
                && plan?.minWinDays > 0
                && isFundedAcct
                && sizeThreshold !== null
                && sizeThreshold !== undefined
                && amt >= sizeThreshold
                && (sizeThreshold === 0 ? amt > 0 : true); // threshold 0 = any green day
              const currentWinDays = parseInt(a.winningDays)||0;

              return {
                ...a,
                currentProfit: newProfit,
                ...(qualifiesAsWinDay ? {winningDays: String(currentWinDays + 1)} : {}),
              };
            }));

            // Log to daily calendar — only for "add" mode since "set" isn't a daily amount
            if (bulkMode==="add") {
              const selectedCount = selectedAccts.length;
              const totalAdded = amt * selectedCount;
              const evalAdded = selectedAccts.filter(a=>a.status==="Evaluation").length * amt;
              const fundedAdded = selectedAccts.filter(a=>["Funded","Payout Eligible","Passed"].includes(a.status)).length * amt;
              setDailyLog(l=>{
                const existing = l[today] || {total:0,eval:0,funded:0,note:""};
                return {...l, [today]:{
                  total: parseFloat((existing.total + totalAdded).toFixed(2)),
                  eval:  parseFloat((existing.eval  + evalAdded).toFixed(2)),
                  funded:parseFloat((existing.funded + fundedAdded).toFixed(2)),
                  note:  existing.note || (selectedCount + " account" + (selectedCount!==1?"s":"") + " · $" + amt + "/ea"),
                  ts:    Date.now(),
                }};
              });
            }

            setBulkModal(false);
            setBulkAmount("");
            setBulkSelected({});
          }} sx={{flex:1}} disabled={!bulkAmount||!Object.values(bulkSelected).some(Boolean)}>
            Apply to {Object.values(bulkSelected).filter(Boolean).length} Account{Object.values(bulkSelected).filter(Boolean).length!==1?"s":""}
          </Btn>
          <Btn v="ghost" onClick={()=>setBulkModal(false)}>Cancel</Btn>
        </div>
      </div>
    </div>
  </div>}

  </div>;
}

function AcctCard({acct,onEdit,onDetail,onStatusChange,onDelete,onUpdatePnl,onPayout}) {
  const firm=FIRMS[acct.firm]; const plan=firm?.plans[acct.plan];
  if(!firm||!plan) return null;
  const e=calcElig(acct);
  const profit=parseFloat(acct.currentProfit)||0;
  const target=parseFloat(acct.profitTarget)||((plan.targets&&plan.targets[acct.accountSize])||0);
  const profPct=target>0?(profit/target)*100:null;
  const days=parseInt(acct.daysTraded)||0;
  const daysPct=plan.minDays>0?Math.min(100,(days/plan.minDays)*100):100;
  const winDays=parseInt(acct.winningDays)||0;
  const isFunded=["Funded","Payout Eligible"].includes(acct.status);
  const sm=STATUS_META[acct.status]||STATUS_META["Evaluation"];
  return <div className="card fade" style={{background:"#fff",borderRadius:12,padding:"18px 22px",border:"1px solid #E2E8F0",borderLeft:"4px solid "+firm.color}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
      <div style={{cursor:"pointer",flex:1}} onClick={onDetail}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:firm.color,flexShrink:0}}/>
          <span style={{fontSize:15,fontWeight:700}}>{firm.name}</span>
          <span style={{fontSize:12,color:"#94A3B8"}}>{acct.accountSize}</span>
          <span style={{fontSize:11,background:firm.color+"18",color:firm.color,borderRadius:4,padding:"1px 7px",fontWeight:600}}>{plan.label}</span>
        </div>
        <div style={{fontSize:12,color:"#94A3B8",marginTop:4,marginLeft:17}}>{plan.drawdown} · {plan.split}</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
        <select value={acct.status} onChange={e=>onStatusChange(e.target.value)} style={{background:sm.bg,border:"1px solid "+sm.border,color:sm.color,padding:"5px 10px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer",outline:"none"}}>
          {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
        </select>
        <Btn small v="ghost" onClick={()=>onUpdatePnl&&onUpdatePnl(acct)} sx={{background:"#EFF6FF",color:"#1D4ED8",border:"1px solid #BFDBFE"}}>+ P+L</Btn>
        {isFunded&&<Btn small v="ghost" onClick={()=>onPayout&&onPayout(acct)} sx={{background:"#FFFBEB",color:"#D97706",border:"1px solid #FDE68A"}}>Payout</Btn>}
        <Btn small v="secondary" onClick={onEdit}>Edit</Btn>
        <Btn small v="danger" onClick={onDelete} sx={{padding:"6px 10px"}}>×</Btn>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:16}}>
      {isFunded ? <>
        {/* Funded left bar: buffer if applicable, else just P+L */}
        <div>{(()=>{
          const buf=plan.bufferAmounts&&plan.bufferAmounts[acct.accountSize];
          if(buf){const bp=Math.min(100,Math.round((profit/buf)*100));return<>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#64748B"}}>Buffer Progress</span><span style={{fontSize:12,fontWeight:600,color:firm.color}}>${profit.toLocaleString()} / ${buf.toLocaleString()}</span></div>
            <PBar pct={bp} color={firm.color}/>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{bp}% to payout buffer</div>
          </>;}
          return<>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#64748B"}}>Current P+L</span><span style={{fontSize:12,fontWeight:600,color:profit>=0?firm.color:"#DC2626"}}>${profit.toLocaleString()}</span></div>
            <div style={{background:"#F1F5F9",borderRadius:99,height:6,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,width:profit>0?"100%":"0%",background:profit>=0?firm.color:"#DC2626"}}/></div>
            <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>Funded — no profit target</div>
          </>;
        })()}</div>
        {/* Funded right bar: winning days */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#64748B"}}>Winning Days</span>
            <span style={{fontSize:12,fontWeight:600,color:"#059669"}}>{winDays} / {plan.minWinDays||"—"}</span>
          </div>
          <PBar pct={plan.minWinDays>0?Math.min(100,(winDays/plan.minWinDays)*100):100} color="#059669"/>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{plan.minWinDays>0?Math.min(100,Math.round((winDays/plan.minWinDays)*100))+"% to payout req":"No winning days req"}</div>
        </div>
      </> : <>
        {/* Eval left bar: profit progress */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#64748B"}}>Profit Progress</span>
            <span style={{fontSize:12,fontWeight:600,color:firm.color}}>${profit.toLocaleString()} / ${target.toLocaleString()}</span>
          </div>
          <PBar pct={profPct||0} color={firm.color}/>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{profPct!==null?Math.min(100,Math.round(profPct))+"% to target":"No target set"}</div>
        </div>
        {/* Eval right bar: trading days */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#64748B"}}>Trading Days</span>
            <span style={{fontSize:12,fontWeight:600,color:"#7C3AED"}}>{days} / {plan.minDays||"—"}</span>
          </div>
          <PBar pct={daysPct} color="#7C3AED"/>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{Math.round(daysPct)}% of minimum</div>
        </div>
      </>}
    </div>
    {e.eligible&&isFunded&&<div style={{marginTop:14,padding:"10px 14px",borderRadius:8,background:"#FFFBEB",border:"1px solid #FDE68A",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <span>⚡</span><span style={{fontSize:13,fontWeight:600,color:"#D97706"}}>Payout Eligible</span>
      <span style={{fontSize:12,color:"#92400E"}}>— {plan.split} · {plan.payoutSpeed}</span>
      <span style={{marginLeft:"auto",fontSize:12,color:"#D97706",cursor:"pointer",fontWeight:600}} onClick={onDetail}>Details →</span>
    </div>}
    {e.eligible&&!isFunded&&<div style={{marginTop:14,padding:"10px 14px",borderRadius:8,background:"#F5F3FF",border:"1px solid #DDD6FE",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <span>🎉</span><span style={{fontSize:13,fontWeight:600,color:"#7C3AED"}}>Evaluation Passed!</span>
      <span style={{fontSize:12,color:"#5B21B6"}}>All requirements met — set status to Passed</span>
      <span style={{marginLeft:"auto",fontSize:12,color:"#7C3AED",cursor:"pointer",fontWeight:600}} onClick={onEdit}>Update →</span>
    </div>}
    {!e.eligible&&e.missing.length>0&&acct.status!=="Violated"&&<div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
      {e.missing.map((m,i)=><span key={i} style={{fontSize:12,background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA",borderRadius:6,padding:"3px 10px"}}>→ {m}</span>)}
    </div>}
    {acct.status==="Violated"&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:"#FEF2F2",border:"1px solid #FECACA",fontSize:13,color:"#DC2626"}}>
      ⚠️ Account violated — {plan.fee!=="None"?"Reset fee: "+plan.fee:"Check firm for reset options"}
    </div>}
    {/* Consistency tracker */}
    {(()=>{
      const c = calcConsistency(acct);
      if (!c || c.label === "No consistency rule") return null;
      return <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:c.ok===true?"#ECFDF5":c.ok===false?"#FEF2F2":"#F8FAFC",border:"1px solid "+(c.ok===true?"#A7F3D0":c.ok===false?"#FECACA":"#E2E8F0")}}>
        <div style={{fontSize:10,fontWeight:600,color:c.ok===true?"#059669":c.ok===false?"#DC2626":"#94A3B8",marginBottom:2}}>
          CONSISTENCY RULE — {c.label.toUpperCase()}
        </div>
        {c.detail
          ? <div style={{fontSize:12,color:c.ok===false?"#DC2626":c.ok===true?"#059669":"#64748B"}}>{c.detail}</div>
          : <div style={{fontSize:11,color:"#94A3B8"}}>Enter your best single day P+L to check consistency</div>}
        {c.needed&&<div style={{fontSize:11,color:"#D97706",marginTop:2}}>{c.needed}</div>}
      </div>;
    })()}
    {/* Drawdown info */}
    {(()=>{
      const dd = plan.drawdownAmounts&&plan.drawdownAmounts[acct.accountSize];
      const dll = plan.dllAmounts&&plan.dllAmounts[acct.accountSize];
      const floor = dd&&acct.currentBalance ? Math.max(0,(parseFloat(acct.currentBalance)||0)-dd) : null;
      return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
        <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,padding:"8px 12px"}}>
          <div style={{fontSize:10,color:"#DC2626",fontWeight:600,marginBottom:2}}>MAX TRAILING DRAWDOWN</div>
          <div style={{fontSize:13,fontWeight:700,color:"#DC2626"}}>{dd?"$"+dd.toLocaleString():"—"}</div>
          {floor!==null&&<div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>Floor: ${floor.toLocaleString()}</div>}
        </div>
        <div style={{background:dll?"#FFFBEB":"#F8FAFC",border:"1px solid "+(dll?"#FDE68A":"#E2E8F0"),borderRadius:8,padding:"8px 12px"}}>
          <div style={{fontSize:10,color:dll?"#D97706":"#94A3B8",fontWeight:600,marginBottom:2}}>DAILY LOSS LIMIT</div>
          <div style={{fontSize:13,fontWeight:700,color:dll?"#D97706":"#94A3B8"}}>{dll?"$"+dll.toLocaleString():"None"}</div>
        </div>
      </div>;
    })()}
    <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
      {[
        {l:plan.news?"News ✓":"No News ✗",ok:plan.news},
        {l:plan.swing?"Swing ✓":"No Swing ✗",ok:plan.swing},
        {l:"Fee: "+plan.fee,ok:null},
      ].map((t,i)=>(
        <span key={i} style={{fontSize:11,borderRadius:5,padding:"3px 9px",fontWeight:500,
          background:t.ok===true?"#ECFDF5":t.ok===false?"#FEF2F2":"#F1F5F9",
          color:t.ok===true?"#059669":t.ok===false?"#DC2626":"#64748B"}}>{t.l}</span>
      ))}
    </div>
    {/* Payout counter - only show on funded accounts */}
    {isFunded&&(()=>{
      const count = parseInt(acct.payoutsCount)||0;
      const plan = FIRMS[acct.firm]?.plans[acct.plan];
      // Plans with a max payout limit before moving to live
      const maxPayouts = acct.firm==="lucid"?5:acct.firm==="apex"?6:acct.firm==="tradeify"?5:null;
      if (count===0&&!maxPayouts) return null;
      return <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
        <div style={{fontSize:12,background:"#F5F3FF",color:"#7C3AED",border:"1px solid #DDD6FE",borderRadius:6,padding:"3px 10px",fontWeight:600}}>
          {count} payout{count!==1?"s":""} taken
        </div>
        {maxPayouts&&<div style={{fontSize:11,color:"#94A3B8"}}>
          {count>=maxPayouts
            ? <span style={{color:"#D97706",fontWeight:600}}>Max reached — move to live account</span>
            : (maxPayouts-count)+" more until live account"}
        </div>}
      </div>;
    })()}
    {acct.notes&&<div style={{marginTop:8,fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>📝 {acct.notes}</div>}
  </div>;
}

