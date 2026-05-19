import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAccounts, getDailyLog, upsertLogEntry, deleteLogEntry } from '../lib/supabase'
import { FIRMS, STATUS_META } from '../lib/firms'

function AnalyticsContent({accounts, dailyLog, setDailyLog, user}) {
  const [showFunded, setShowFunded] = useState(true)
  const [showEval, setShowEval] = useState(true)
  const evalAccts    = accounts.filter(a=>a.status==="Evaluation");
  const fundedAccts  = accounts.filter(a=>["Funded","Payout Eligible","Passed"].includes(a.status));
  const totalProfit  = accounts.reduce((s,a)=>s+(parseFloat(a.currentProfit)||0),0);
  const evalProfit   = evalAccts.reduce((s,a)=>s+(parseFloat(a.currentProfit)||0),0);
  const fundedProfit = fundedAccts.reduce((s,a)=>s+(parseFloat(a.currentProfit)||0),0);
  const logEntries   = Object.values(dailyLog||{});
  const winDays      = logEntries.filter(e=>e.total>0).length;
  const lossDays     = logEntries.filter(e=>e.total<0).length;
  const totalDays    = winDays + lossDays;
  const winPct       = totalDays>0 ? Math.round((winDays/totalDays)*100) : null;
  const avgWin       = winDays>0 ? (logEntries.filter(e=>e.total>0).reduce((s,e)=>s+e.total,0)/winDays) : 0;
  const avgLoss      = lossDays>0 ? Math.abs(logEntries.filter(e=>e.total<0).reduce((s,e)=>s+e.total,0)/lossDays) : 0;
  const fmt = v => (v>=0?"":"−")+"$"+Math.abs(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

  return <>
    {/* KPI row */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
      {[
        {label:"Total P+L",     val:totalProfit,  c:"#1D4ED8", sub:accounts.length+" accounts"},
        {label:"Funded P+L",    val:fundedProfit, c:"#059669", sub:fundedAccts.length+" accounts"},
        {label:"Evaluation P+L",val:evalProfit,   c:"#7C3AED", sub:evalAccts.length+" accounts"},
      ].map(k=>(
        <div key={k.label} style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #E2E8F0",borderTop:"3px solid "+k.c}}>
          <div style={{fontSize:10,color:"#94A3B8",fontWeight:600,marginBottom:6}}>{k.label.toUpperCase()}</div>
          <div style={{fontSize:24,fontWeight:800,color:k.val>=0?k.c:"#DC2626"}}>{fmt(k.val)}</div>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{k.sub}</div>
        </div>
      ))}
      <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",border:"1px solid #E2E8F0",borderTop:"3px solid #D97706"}}>
        <div style={{fontSize:10,color:"#94A3B8",fontWeight:600,marginBottom:6}}>DAY WIN RATE</div>
        <div style={{fontSize:24,fontWeight:800,color:winPct!==null?(winPct>=50?"#059669":"#DC2626"):"#94A3B8"}}>{winPct!==null?winPct+"%":"—"}</div>
        <div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{totalDays>0?winDays+"W / "+lossDays+"L ("+totalDays+" days)":"No days logged yet"}</div>
        {avgWin>0&&<div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>Avg win ${avgWin.toFixed(0)} · Avg loss ${avgLoss.toFixed(0)}</div>}
      </div>
    </div>

    {/* Funded accounts */}
    {fundedAccts.length>0&&<div style={{marginBottom:20}}>
      <div onClick={()=>setShowFunded(s=>!s)} style={{display:"flex",justifyContent:"space-between",cursor:"pointer",marginBottom:showFunded?10:0,userSelect:"none"}}>
        <div style={{fontSize:14,fontWeight:700}}>💰 Funded Accounts <span style={{fontSize:12,color:"#94A3B8",fontWeight:400}}>({fundedAccts.length})</span></div>
        <span style={{fontSize:12,color:"#94A3B8"}}>{showFunded?"▲ Hide":"▼ Show"}</span>
      </div>
      {showFunded&&<div style={{background:"#fff",borderRadius:12,border:"1px solid #E2E8F0",overflow:"hidden"}}>
        {fundedAccts.map((acct,i)=>{
          const firm=FIRMS[acct.firm]; const plan=firm?.plans[acct.plan];
          const profit=parseFloat(acct.currentProfit)||0;
          const buf=plan?.bufferAmounts?.[acct.accountSize];
          const wd=parseInt(acct.winningDays)||0;
          const sub=buf?Math.min(100,Math.round((profit/buf)*100))+"% to buffer ($"+buf.toLocaleString()+")":plan?.minWinDays>0?wd+"/"+plan.minWinDays+" winning days":"Funded — no target";
          return <div key={acct.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 20px",borderBottom:i<fundedAccts.length-1?"1px solid #F1F5F9":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:firm?.color}}/>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{firm?.name} · {acct.accountSize}</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>{plan?.label} · {acct.status}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:profit>=0?"#059669":"#DC2626"}}>{fmt(profit)}</div>
              <div style={{fontSize:11,color:"#94A3B8"}}>{sub}</div>
            </div>
          </div>;
        })}
        <div style={{padding:"11px 20px",background:"#F8FAFC",borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:600}}>Total Funded P+L</span>
          <span style={{fontSize:14,fontWeight:800,color:"#059669"}}>{fmt(fundedProfit)}</span>
        </div>
      </div>}
    </div>}

    {/* Eval accounts */}
    {evalAccts.length>0&&<div style={{marginBottom:24}}>
      <div onClick={()=>setShowEval(s=>!s)} style={{display:"flex",justifyContent:"space-between",cursor:"pointer",marginBottom:showEval?10:0,userSelect:"none"}}>
        <div style={{fontSize:14,fontWeight:700}}>🎯 Evaluation Accounts <span style={{fontSize:12,color:"#94A3B8",fontWeight:400}}>({evalAccts.length})</span></div>
        <span style={{fontSize:12,color:"#94A3B8"}}>{showEval?"▲ Hide":"▼ Show"}</span>
      </div>
      {showEval&&<div style={{background:"#fff",borderRadius:12,border:"1px solid #E2E8F0",overflow:"hidden"}}>
        {evalAccts.map((acct,i)=>{
          const firm=FIRMS[acct.firm]; const plan=firm?.plans[acct.plan];
          const profit=parseFloat(acct.currentProfit)||0;
          const target=parseFloat(acct.profitTarget)||((plan?.targets&&plan.targets[acct.accountSize])||0);
          const pct=target>0?Math.min(100,Math.round((profit/target)*100)):null;
          return <div key={acct.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 20px",borderBottom:i<evalAccts.length-1?"1px solid #F1F5F9":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:firm?.color}}/>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{firm?.name} · {acct.accountSize}</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>{plan?.label} · {acct.status}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:profit>=0?"#7C3AED":"#DC2626"}}>{fmt(profit)}</div>
              {pct!==null&&<div style={{fontSize:11,color:"#94A3B8"}}>{pct}% to target</div>}
            </div>
          </div>;
        })}
        <div style={{padding:"11px 20px",background:"#F8FAFC",borderTop:"1px solid #E2E8F0",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:12,fontWeight:600}}>Total Eval P+L</span>
          <span style={{fontSize:14,fontWeight:800,color:"#7C3AED"}}>{fmt(evalProfit)}</span>
        </div>
      </div>}
    </div>}

    {/* Daily log */}
    <DailyLog accounts={accounts} dailyLog={dailyLog} setDailyLog={setDailyLog}/>
  </>;
}

// ── DAILY LOG COMPONENT ───────────────────────────────────────────────────────

export default function Analytics() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [dailyLog, setDailyLog] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getAccounts(user.id), getDailyLog(user.id)]).then(([{data:accts},{data:log}]) => {
      if (accts) setAccounts(accts.map(a => ({...a, currentProfit: String(a.current_profit??0), accountSize: a.account_size, winningDays: String(a.winning_days??0), profitTarget: String(a.profit_target??'') })))
      if (log) { const m={}; log.forEach(e=>{m[e.date]={total:e.total,eval:e.eval_pnl,funded:e.funded_pnl,note:e.note}}); setDailyLog(m) }
      setLoading(false)
    })
  }, [user])

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh"}}><div style={{width:32,height:32,border:"3px solid #E2E8F0",borderTop:"3px solid #1D4ED8",borderRadius:"50%",animation:"spin .7s linear infinite"}}/></div>

  return <AnalyticsContent accounts={accounts} dailyLog={dailyLog} setDailyLog={setDailyLog} user={user}/>
}

function DailyLog({accounts, dailyLog, setDailyLog}) {
  const log = dailyLog;
  const setLog = setDailyLog;
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().slice(0,10));
  const [entryTotal, setEntryTotal] = useState("");
  const [entryNote, setEntryNote]   = useState("");
  const [viewMonth, setViewMonth]   = useState(() => { const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); });

  const saveEntry = () => {
    const parsed = parseFloat(entryTotal);
    if (entryTotal === "" || isNaN(parsed)) return;
    const evalAccts   = accounts.filter(a=>a.status==="Evaluation");
    const fundedAccts = accounts.filter(a=>["Funded","Payout Eligible","Passed"].includes(a.status));
    const evalP  = evalAccts.reduce((s,a)=>s+(parseFloat(a.currentProfit)||0),0);
    const fundP  = fundedAccts.reduce((s,a)=>s+(parseFloat(a.currentProfit)||0),0);
    setLog(l=>({...l,[entryDate]:{total:parsed,eval:evalP,funded:fundP,note:entryNote,ts:Date.now()}}));
    setEntryTotal(""); setEntryNote("");
  };

  const deleteEntry = (date) => setLog(l=>{ const n={...l}; delete n[date]; return n; });

  // Calendar
  const [yr, mo] = viewMonth.split("-").map(Number);
  const firstDay = new Date(yr, mo-1, 1).getDay();
  const daysInMonth = new Date(yr, mo, 0).getDate();
  const prevMonth = () => { const d=new Date(yr,mo-2,1); setViewMonth(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); };
  const nextMonth = () => { const d=new Date(yr,mo,1);   setViewMonth(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); };
  const monthName = new Date(yr,mo-1,1).toLocaleString("default",{month:"long",year:"numeric"});

  const monthEntries = Object.entries(log).filter(([d])=>d.startsWith(viewMonth));
  const monthTotal   = monthEntries.reduce((s,[,v])=>s+v.total,0);
  const monthTradingDays = monthEntries.filter(([,v])=>v.total>0).length;

  // Build week totals: group days into calendar weeks
  const calCells = [...Array(firstDay).fill(null), ...Array(daysInMonth).fill(null).map((_,i)=>i+1)];
  // Pad to full weeks
  while (calCells.length % 7 !== 0) calCells.push(null);
  const weeks = [];
  for (let i=0; i<calCells.length; i+=7) weeks.push(calCells.slice(i,i+7));

  const sorted = Object.entries(log).sort(([a],[b])=>b.localeCompare(a));

  const iSx2 = {background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"8px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"};

  return <div>
    {/* Log entry form */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr auto",gap:10,marginBottom:20,alignItems:"end"}}>
      <div>
        <label style={{display:"block",fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>Date</label>
        <input type="date" value={entryDate} onChange={e=>setEntryDate(e.target.value)} style={{...iSx2,width:"100%"}}/>
      </div>
      <div>
        <label style={{display:"block",fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>Daily P+L ($)</label>
        <input type="number" value={entryTotal} onChange={e=>setEntryTotal(e.target.value)} placeholder="e.g. 450" style={{...iSx2,width:"100%"}}/>
      </div>
      <div>
        <label style={{display:"block",fontSize:11,fontWeight:600,color:"#374151",marginBottom:4}}>Note (optional)</label>
        <input value={entryNote} onChange={e=>setEntryNote(e.target.value)} placeholder="e.g. great NQ scalp" style={{...iSx2,width:"100%"}}/>
      </div>
      <button onClick={saveEntry} style={{padding:"8px 18px",background:"#1D4ED8",color:"#fff",border:"none",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",height:38}}>Log</button>
    </div>

    {/* Calendar */}
    <div style={{marginBottom:20}}>
      {/* Month header with totals */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={prevMonth} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"4px 14px",cursor:"pointer",fontSize:16,color:"#374151"}}>‹</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:15,fontWeight:800,color:"#0F172A"}}>{monthName}</div>
          <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:4}}>
            <span style={{fontSize:12,fontWeight:700,color:monthTotal>=0?"#059669":"#DC2626"}}>
              {monthTotal>=0?"+":"-"}${Math.abs(monthTotal).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} total
            </span>
            <span style={{fontSize:12,color:"#94A3B8"}}>{monthTradingDays} trading day{monthTradingDays!==1?"s":""}</span>
            {monthTradingDays>0&&<span style={{fontSize:12,color:"#94A3B8"}}>avg ${(monthTotal/monthTradingDays).toFixed(0)}/day</span>}
          </div>
        </div>
        <button onClick={nextMonth} style={{background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"4px 14px",cursor:"pointer",fontSize:16,color:"#374151"}}>›</button>
      </div>

      {/* Day headers + weekly total header */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr) 80px",gap:3,marginBottom:4}}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
          <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"#94A3B8",padding:"3px 0"}}>{d}</div>
        ))}
        <div style={{textAlign:"center",fontSize:10,fontWeight:600,color:"#7C3AED",padding:"3px 0"}}>Week</div>
      </div>

      {/* Calendar weeks */}
      {weeks.map((week,wi)=>{
        const weekTotal = week.reduce((s,day)=>{
          if (!day) return s;
          const ds = viewMonth+"-"+String(day).padStart(2,"0");
          return s + (log[ds]?.total||0);
        },0);
        const hasData = week.some(day=>{ if(!day) return false; const ds=viewMonth+"-"+String(day).padStart(2,"0"); return !!log[ds]; });
        return <div key={wi} style={{display:"grid",gridTemplateColumns:"repeat(7,1fr) 80px",gap:3,marginBottom:3}}>
          {week.map((day,di)=>{
            if (!day) return <div key={"e"+wi+di}/>;
            const dateStr = viewMonth+"-"+String(day).padStart(2,"0");
            const entry = log[dateStr];
            const isToday = dateStr===new Date().toISOString().slice(0,10);
            const bg = entry?(entry.total>=0?"#ECFDF5":"#FEF2F2"):isToday?"#EFF6FF":"#F8FAFC";
            const border = isToday?"2px solid #1D4ED8":"1px solid "+(entry?(entry.total>=0?"#A7F3D0":"#FECACA"):"#E2E8F0");
            return <div key={day} style={{background:bg,border,borderRadius:8,padding:"5px 3px",textAlign:"center",minHeight:52,cursor:entry?"pointer":"default",transition:"all .1s",position:"relative"}}
              onClick={()=>{ if(entry){ setEntryDate(dateStr); setEntryTotal(String(entry.total)); setEntryNote(entry.note||""); }}}
              title={entry?(entry.note||("$"+entry.total))+" — click to edit":isToday?"Today":""}>
              <div style={{fontSize:10,color:isToday?"#1D4ED8":"#94A3B8",fontWeight:isToday?700:400,marginBottom:2}}>{day}</div>
              {entry&&<div style={{fontSize:10,fontWeight:700,color:entry.total>=0?"#059669":"#DC2626",lineHeight:1.2}}>
                {entry.total>=0?"+$":"−$"}{Math.abs(entry.total).toLocaleString()}
              </div>}
              {entry?.note&&<div style={{fontSize:9,color:"#94A3B8",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{entry.note}</div>}
              {entry&&<button onClick={e=>{e.stopPropagation();if(window.confirm("Delete entry for "+dateStr+"?"))deleteEntry(dateStr);}} style={{position:"absolute",top:2,right:3,background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:11,lineHeight:1,padding:0}} title="Delete">×</button>}
            </div>;
          })}
          {/* Weekly total */}
          <div style={{background:hasData?(weekTotal>=0?"#F5F3FF":"#FEF2F2"):"#F8FAFC",border:"1px solid "+(hasData?(weekTotal>=0?"#DDD6FE":"#FECACA"):"#E2E8F0"),borderRadius:8,padding:"5px 4px",textAlign:"center",minHeight:52,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {hasData?<>
              <div style={{fontSize:9,color:"#7C3AED",fontWeight:600,marginBottom:2}}>WEEK</div>
              <div style={{fontSize:10,fontWeight:800,color:weekTotal>=0?"#7C3AED":"#DC2626"}}>
                {weekTotal>=0?"+$":"−$"}{Math.abs(weekTotal).toLocaleString()}
              </div>
            </>:<div style={{fontSize:9,color:"#CBD5E1"}}>—</div>}
          </div>
        </div>;
      })}
    </div>

    {/* Recent entries list */}
    {sorted.length>0&&<>
      <div style={{fontSize:12,fontWeight:600,color:"#94A3B8",marginBottom:8}}>RECENT ENTRIES</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:200,overflowY:"auto"}}>
        {sorted.slice(0,20).map(([date,entry])=>(
          <div key={date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:8,background:"#F8FAFC",border:"1px solid #E2E8F0"}}>
            <div>
              <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{new Date(date+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
              {entry.note&&<span style={{fontSize:11,color:"#94A3B8",marginLeft:8}}>{entry.note}</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:13,fontWeight:700,color:entry.total>=0?"#059669":"#DC2626"}}>{entry.total>=0?"+":""}{entry.total>=0?"$"+entry.total.toLocaleString():"-$"+Math.abs(entry.total).toLocaleString()}</span>
              <button onClick={()=>{if(window.confirm("Delete entry for "+date+"?"))deleteEntry(date);}} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:14,padding:"0 4px"}}>×</button>
            </div>
          </div>
        ))}
      </div>
    </>}
    {sorted.length===0&&<div style={{textAlign:"center",color:"#94A3B8",fontSize:13,padding:"24px 0"}}>No entries yet. Log your first day above.</div>}
  </div>;
}
