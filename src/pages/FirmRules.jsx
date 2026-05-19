import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FIRMS } from '../lib/firms'

export default function FirmRules() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)

  return (
            <div className="fade-in">
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:22,fontWeight:800}}>Firm Rules</h1>
          <p style={{fontSize:13,color:"#64748B",marginTop:4}}>All 7 supported futures prop firms · {Object.values(FIRMS).reduce((s,f)=>s+Object.keys(f.plans).length,0)} account plans. Click any plan for full details.</p>
        </div>
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
          <div style={{fontSize:12,color:"#92400E",lineHeight:1.6}}>
            <strong>Disclaimer:</strong> PropTrack provides a general summary of prop firm rules for convenience only. Rules change frequently — always verify current rules directly with each firm before trading. PropTrack is not responsible for inaccuracies or outdated information. This is not financial or trading advice.
          </div>
        </div>
        {Object.entries(FIRMS).map(([fk,firm])=>(
          <div key={fk} style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:firm.color}}/>
              <span style={{fontSize:15,fontWeight:700}}>{firm.name}</span>
              <span style={{fontSize:11,color:"#94A3B8"}}>{Object.keys(firm.plans).length} plan{Object.keys(firm.plans).length>1?"s":""}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
              {Object.entries(firm.plans).map(([pk,plan])=>(
                <div key={pk} className="card" onClick={()=>{setSelected({firmKey:fk,planKey:pk,firmName:firm.name,color:firm.color,...plan});setModal("planDetail")}}
                  style={{background:"#fff",borderRadius:14,padding:"22px",border:"1px solid #E2E8F0",borderTop:"4px solid "+firm.color,cursor:"pointer"}}>
                  <div style={{fontWeight:800,fontSize:15,marginBottom:16,color:"#0F172A"}}>{plan.label}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                    {[
                      {l:"Profit Target",v:plan.targets&&plan.targets["50K"]?"$"+plan.targets["50K"].toLocaleString():null,c:"#059669",bg:"#ECFDF5",b:"#A7F3D0"},
                      {l:"Max Drawdown",v:plan.drawdownAmounts?.["50K"]?"$"+plan.drawdownAmounts["50K"].toLocaleString():null,c:"#DC2626",bg:"#FEF2F2",b:"#FECACA"},
                      {l:"Buffer (50K)",v:plan.bufferAmounts?.["50K"]?"$"+plan.bufferAmounts["50K"].toLocaleString():"None",c:plan.bufferAmounts?.["50K"]?"#1D4ED8":"#94A3B8",bg:plan.bufferAmounts?.["50K"]?"#EFF6FF":"#F8FAFC",b:plan.bufferAmounts?.["50K"]?"#BFDBFE":"#E2E8F0"},
                      {l:"Daily Limit",v:plan.dllAmounts?.["50K"]?"$"+plan.dllAmounts["50K"].toLocaleString():"None",c:plan.dllAmounts?.["50K"]?"#D97706":"#94A3B8",bg:plan.dllAmounts?.["50K"]?"#FFFBEB":"#F8FAFC",b:plan.dllAmounts?.["50K"]?"#FDE68A":"#E2E8F0"},
                    ].map(k=>(
                      <div key={k.l} style={{background:k.bg,border:"1px solid "+k.b,borderRadius:9,padding:"10px 12px"}}>
                        <div style={{fontSize:10,color:k.c,fontWeight:700,marginBottom:4}}>{k.l.toUpperCase()}</div>
                        <div style={{fontSize:16,fontWeight:800,color:k.c}}>{k.v||"—"}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    ["Drawdown Type",  plan.drawdown],
                    ["Consistency",    plan.consistencyRule?.label||"None"],
                    ["Winning Days",   plan.minWinDays>0?plan.minWinDays+" days required":"None"],
                    ["Min Eval Days",  plan.minDays||"None"],
                    ["Payout Split",   plan.split],
                    ["Payout Speed",   plan.payoutSpeed],
                    ["Activation Fee", plan.fee],
                  ].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:"1px solid #F1F5F9",gap:16}}>
                      <span style={{fontSize:12,color:"#64748B",flexShrink:0,fontWeight:500}}>{l}</span>
                      <span style={{fontSize:12,fontWeight:700,textAlign:"right",color:"#0F172A",lineHeight:1.4}}>{v}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600,background:plan.news?"#ECFDF5":"#FEF2F2",color:plan.news?"#059669":"#DC2626"}}>{plan.news?"News ✓":"No News ✕"}</span>
                    <span style={{fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600,background:plan.swing?"#ECFDF5":"#FEF2F2",color:plan.swing?"#059669":"#DC2626"}}>{plan.swing?"Swing ✓":"No Swing ✕"}</span>
                    {plan.bufferAmounts&&<span style={{fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600,background:"#EFF6FF",color:"#1D4ED8"}}>Buffer Required</span>}
                    {plan.minWinDays>0&&<span style={{fontSize:11,padding:"4px 10px",borderRadius:6,fontWeight:600,background:"#ECFDF5",color:"#059669"}}>{plan.minWinDays} Winning Days</span>}
                  </div>
                  <div style={{marginTop:12,fontSize:11,color:"#94A3B8",lineHeight:1.6,borderTop:"1px solid #F1F5F9",paddingTop:10}}>
                    {plan.notes?.slice(0,160)}{plan.notes?.length>160?"...":""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}
    </div>

    {/* ADD/EDIT MODAL */}
    {(modal==="add"||modal==="edit")&&<Modal title={modal==="add"?"Add Account":"Edit Account"} sub={fp?ff?.name+" · "+fp.label:undefined} accent={ff?.color||"#1D4ED8"} onClose={()=>setModal(null)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Prop Firm"><FSel value={form.firm} onChange={changeFirm} options={Object.entries(FIRMS).map(([k,v])=>({v:k,l:v.name}))}/></Field>
        <Field label="Account Plan" span={1}><FSel value={form.plan} onChange={changePlan} options={Object.entries(FIRMS[form.firm]?.plans||{}).map(([k,v])=>({v:k,l:v.label}))}/></Field>
        <Field label="Account Size" span={1}><FSel value={form.accountSize} onChange={upd("accountSize")} options={fSizes}/></Field>
        <Field label="Status" span={1}><FSel value={form.status} onChange={upd("status")} options={STATUS_OPTIONS}/></Field>
        {fp&&<div style={{gridColumn:"1/-1",background:"#F8FAFC",borderRadius:10,padding:"12px 14px",border:"1px solid #E2E8F0"}}>
          <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>PLAN RULES</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[
              ["Profit Target", fp.targets&&fp.targets[form.accountSize]?"$"+fp.targets[form.accountSize].toLocaleString():"N/A"],
              ["Max Drawdown",  fp.drawdownAmounts?.[form.accountSize]?"$"+fp.drawdownAmounts[form.accountSize].toLocaleString():"—"],
              ["Buffer",        fp.bufferAmounts?.[form.accountSize]?"$"+fp.bufferAmounts[form.accountSize].toLocaleString():"None"],
              ["Daily Limit",   fp.dllAmounts?.[form.accountSize]?"$"+fp.dllAmounts[form.accountSize].toLocaleString():"None"],
              ["Min Eval Days", fp.minDays||"None"],
              ["Winning Days",  fp.minWinDays>0?fp.minWinDays+" required":"None"],
              ["Consistency",   fp.consistencyRule?.label||"None"],
              ["Drawdown Type", fp.drawdown],
              ["Payout Speed",  fp.payoutSpeed],
            ].map(([l,v])=>(
              <div key={l} style={{fontSize:11}}><span style={{color:"#94A3B8"}}>{l}: </span><span style={{fontWeight:600,color:"#374151"}}>{v}</span></div>
            ))}
          </div>
        </div>}
        <Field label="Current Profit ($)" span={1}><FInp value={form.currentProfit} onChange={upd("currentProfit")} placeholder="e.g. 1500"/></Field>
        <Field label={"Target Override (default: $"+(fp?.targets[form.accountSize]?.toLocaleString()||"—")+")"} span={1}><FInp value={form.profitTarget} onChange={upd("profitTarget")} placeholder="Optional"/></Field>
        <Field label="Days Traded" span={1}><FInp value={form.daysTraded} onChange={upd("daysTraded")} placeholder="e.g. 5"/></Field>
        {["Funded","Payout Eligible"].includes(form.status)&&fp?.minWinDays>0&&<Field label={"Winning Days (need "+fp.minWinDays+")"} span={1}><FInp value={form.winningDays||""} onChange={v=>setForm(f=>({...f,winningDays:v}))} placeholder={"e.g. 3 of "+fp.minWinDays}/></Field>}
        <Field label={"Min Days Required — "+(fp?.minDays||"none for this plan")} span={1}><div style={{...iSx,color:"#94A3B8",cursor:"default"}}>Auto-set by plan</div></Field>
        <Field label="Best Single Day P+L ($)" span={1}><FInp value={form.bestDayPnl||""} onChange={v=>setForm(f=>({...f,bestDayPnl:v}))} placeholder="Your biggest profit day"/></Field>
        <div style={{gridColumn:"span 1"}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Consistency Rule</label>
          <div style={{...iSx,color:"#94A3B8",cursor:"default",fontSize:11}}>{fp?.consistencyRule?.label||"—"}</div>
        </div>
        <Field label="Current Account Balance ($)" span={1}><FInp value={form.currentBalance||""} onChange={v=>setForm(f=>({...f,currentBalance:v}))} placeholder="e.g. 51200"/></Field>
        <div style={{gridColumn:"span 1"}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Max Trailing Drawdown</label>
          <div style={{...iSx,color:fp?.drawdownAmounts?.[form.accountSize]?"#DC2626":"#94A3B8",fontWeight:600,cursor:"default",background:fp?.drawdownAmounts?.[form.accountSize]?"#FEF2F2":"#F8FAFC",border:"1px solid "+(fp?.drawdownAmounts?.[form.accountSize]?"#FECACA":"#E2E8F0")}}>
            {fp?.drawdownAmounts?.[form.accountSize] ? "$"+fp.drawdownAmounts[form.accountSize].toLocaleString() : "—"}
          </div>
        </div>
        <div style={{gridColumn:"span 1"}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Daily Loss Limit</label>
          <div style={{...iSx,color:fp?.dllAmounts?.[form.accountSize]?"#D97706":"#94A3B8",fontWeight:600,cursor:"default",background:fp?.dllAmounts?.[form.accountSize]?"#FFFBEB":"#F8FAFC",border:"1px solid "+(fp?.dllAmounts?.[form.accountSize]?"#FDE68A":"#E2E8F0")}}>
            {fp?.dllAmounts?.[form.accountSize]?"$"+fp.dllAmounts[form.accountSize].toLocaleString():"None"}
          </div>
        </div>
        {fp?.drawdownAmounts?.[form.accountSize]&&form.currentBalance&&<div style={{gridColumn:"1/-1",padding:"12px 14px",borderRadius:9,background:"#FEF2F2",border:"1px solid #FECACA"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#DC2626",marginBottom:4}}>📉 Drawdown Floor</div>
          <div style={{fontSize:13,color:"#374151"}}>
            Your floor is at <strong style={{color:"#DC2626"}}>${Math.max(0,(parseFloat(form.currentBalance)||0)-fp.drawdownAmounts[form.accountSize]).toLocaleString()}</strong> — you have <strong style={{color:"#DC2626"}}>${fp.drawdownAmounts[form.accountSize].toLocaleString()}</strong> of drawdown remaining from your current balance.
          </div>
        </div>}
        <Field label="Notes"><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} placeholder="Any notes..." style={{...iSx,resize:"vertical"}}/></Field>
      </div>
      {form.currentProfit&&<div style={{marginTop:16,padding:"12px 14px",borderRadius:9,background:fElig.eligible?"#FFFBEB":"#F8FAFC",border:"1px solid "+(fElig.eligible?"#FDE68A":"#E2E8F0")}}>
        <div style={{fontSize:12,fontWeight:600,color:fElig.eligible?"#D97706":"#64748B",marginBottom:8}}>{fElig.eligible?(["Funded","Payout Eligible"].includes(form.status)?"⚡ Payout eligible with these values":"🎉 Eval target met — ready to pass"):"Eligibility preview"}</div>
        {fElig.met.map((m,i)=><div key={i} style={{fontSize:12,color:"#059669",marginTop:3}}>✓ {m}</div>)}
        {fElig.missing.map((m,i)=><div key={i} style={{fontSize:12,color:"#DC2626",marginTop:3}}>→ {m}</div>)}
      </div>}
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn onClick={save} sx={{flex:1}}>Save Account</Btn>
        {modal==="edit"&&<Btn v="danger" onClick={()=>del(form.id)}>Delete</Btn>}
        <Btn v="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
      </div>
    </Modal>}

    {/* ACCOUNT DETAIL */}
    {modal==="detail"&&selected&&(()=>{
      const acct=accounts.find(a=>a.id===selected.id)||selected;
      const firm=FIRMS[acct.firm]; const plan=firm?.plans[acct.plan];
      if(!firm||!plan) return null;
      const e=calcElig(acct);
      const profit=parseFloat(acct.currentProfit)||0;
      const target=parseFloat(acct.profitTarget)||((plan.targets&&plan.targets[acct.accountSize])||0);
      const profPct=target>0?(profit/target)*100:null;
      const days=parseInt(acct.daysTraded)||0;
      const daysPct=plan.minDays>0?Math.min(100,(days/plan.minDays)*100):100;
      return <Modal title={firm.name} sub={plan.label+" · "+acct.accountSize+" · "+acct.status} accent={firm.color} onClose={()=>setModal(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
          <div style={{background:"#F8FAFC",borderRadius:10,padding:14}}>
            <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>PROFIT</div>
            <div style={{fontSize:26,fontWeight:800,color:profit>=0?firm.color:"#DC2626"}}>${profit.toLocaleString()}</div>
            {(()=>{
              const isFundedAcct=["Funded","Payout Eligible"].includes(acct.status);
              const buf=plan.bufferAmounts&&plan.bufferAmounts[acct.accountSize];
              if(isFundedAcct&&buf){const bp=Math.min(100,Math.round((profit/buf)*100));return<><div style={{fontSize:12,color:"#94A3B8",margin:"4px 0 10px"}}>of ${buf.toLocaleString()} buffer</div><PBar pct={bp} color={firm.color}/><div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{bp}% to payout buffer</div></>;}
              if(isFundedAcct){return<><div style={{fontSize:12,color:"#94A3B8",margin:"4px 0 10px"}}>Funded — no profit target</div><div style={{background:"#F1F5F9",borderRadius:99,height:6}}/><div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>Track winning days for payouts</div></>;}
              return<><div style={{fontSize:12,color:"#94A3B8",margin:"4px 0 10px"}}>of ${target.toLocaleString()} target</div><PBar pct={profPct||0} color={firm.color}/><div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{profPct!==null?Math.min(100,Math.round(profPct))+"% complete":"No target"}</div></>;
            })()}
          </div>
          <div style={{background:"#F8FAFC",borderRadius:10,padding:14}}>
            {["Funded","Payout Eligible"].includes(acct.status)&&plan.minWinDays>0?<>
              <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>WINNING DAYS</div>
              <div style={{fontSize:26,fontWeight:800,color:"#059669"}}>{parseInt(acct.winningDays)||0}</div>
              <div style={{fontSize:12,color:"#94A3B8",margin:"4px 0 10px"}}>of {plan.minWinDays} needed ($200+)</div>
              <PBar pct={Math.min(100,((parseInt(acct.winningDays)||0)/plan.minWinDays)*100)} color="#059669"/>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{Math.min(100,Math.round(((parseInt(acct.winningDays)||0)/plan.minWinDays)*100))}% to payout req</div>
            </>:<>
              <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>TRADING DAYS</div>
              <div style={{fontSize:26,fontWeight:800,color:"#7C3AED"}}>{days}</div>
              <div style={{fontSize:12,color:"#94A3B8",margin:"4px 0 10px"}}>of {plan.minDays||"—"} min</div>
              <PBar pct={daysPct} color="#7C3AED"/>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:5}}>{Math.min(100,Math.round(daysPct))}% complete</div>
            </>}
          </div>
        </div>
        <div style={{padding:"12px 14px",borderRadius:9,marginBottom:16,background:e.eligible?"#FFFBEB":"#F8FAFC",border:"1px solid "+(e.eligible?"#FDE68A":"#E2E8F0")}}>
          <div style={{fontSize:13,fontWeight:700,color:e.eligible?(e.isFunded?"#D97706":"#7C3AED"):"#374151",marginBottom:8}}>{e.eligible?(e.isFunded?"⚡ Payout Eligible":"🎉 Evaluation Passed!"):"Eligibility Status"}</div>
          {e.met.map((m,i)=><div key={i} style={{fontSize:12,color:"#059669",marginBottom:3}}>✓ {m}</div>)}
          {e.missing.map((m,i)=><div key={i} style={{fontSize:12,color:"#DC2626",marginBottom:3}}>→ {m}</div>)}
          {e.eligible&&<div style={{fontSize:12,color:"#D97706",marginTop:6,fontWeight:500}}>{plan.split} · {plan.payoutSpeed}</div>}
        </div>
        <div style={{background:"#F8FAFC",borderRadius:10,padding:14,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:10}}>{plan.label.toUpperCase()} RULES</div>
          {[["Drawdown Type",plan.drawdown],["Max Trailing Drawdown",plan.drawdownAmounts?.[acct.accountSize]?"$"+plan.drawdownAmounts[acct.accountSize].toLocaleString():"—"],["Buffer Required",plan.bufferAmounts?.[acct.accountSize]?"$"+plan.bufferAmounts[acct.accountSize].toLocaleString():"None"],["Daily Loss Limit",plan.dllAmounts?.[acct.accountSize]?"$"+plan.dllAmounts[acct.accountSize].toLocaleString():"None"],["Winning Days",plan.minWinDays>0?plan.minWinDays+" required":"None"],["Consistency",plan.consistencyRule?.label||"None"],["News",plan.news?"✅ Allowed":"❌ Not Allowed"],["Swing",plan.swing?"✅ Allowed":"❌ Not Allowed"],["Fee",plan.fee]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #E2E8F0"}}>
              <span style={{fontSize:12,color:"#64748B"}}>{l}</span><span style={{fontSize:12,fontWeight:500}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:10,fontSize:12,color:"#94A3B8",fontStyle:"italic"}}>💡 {plan.notes}</div>
        </div>
        {acct.notes&&<div style={{fontSize:12,color:"#94A3B8",fontStyle:"italic",marginBottom:14}}>📝 {acct.notes}</div>}
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={()=>{setForm({...acct});setModal("edit")}} sx={{flex:1}}>Edit Account</Btn>
          <Btn v="ghost" onClick={()=>setModal(null)}>Close</Btn>
        </div>
      </Modal>;
    })()}

    {/* PLAN DETAIL */}
    {modal==="planDetail"&&selected&&<Modal title={selected.firmName} sub={selected.label} accent={selected.color} onClose={()=>setModal(null)}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {Object.entries(selected.targets||{}).map(([sz,tgt])=>(
          <div key={sz} style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:12,color:"#64748B"}}>{sz}</span>
            <span style={{fontSize:12,fontWeight:700,color:selected.color}}>${tgt.toLocaleString()} target</span>
          </div>
        ))}
      </div>
      {/* Drawdown + DLL per size */}
      {(selected.drawdownAmounts||selected.dllAmounts)&&<div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>DRAWDOWN & DLL BY SIZE</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:6}}>
          {Object.keys(selected.targets||{}).map(sz=>{
            const dd = selected.drawdownAmounts&&selected.drawdownAmounts[sz];
            const dll = selected.dllAmounts&&selected.dllAmounts[sz];
            return <div key={sz} style={{background:"#F8FAFC",borderRadius:8,padding:"8px 10px",border:"1px solid #E2E8F0"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#374151",marginBottom:4}}>{sz}</div>
              {dd&&<div style={{fontSize:10,color:"#DC2626"}}>MDD: ${dd.toLocaleString()}</div>}
              {dll&&<div style={{fontSize:10,color:"#D97706"}}>DLL: ${dll.toLocaleString()}</div>}
              {!dll&&<div style={{fontSize:10,color:"#94A3B8"}}>No DLL</div>}
            </div>;
          })}
        </div>
      </div>}
      {[["Drawdown Type",selected.drawdown],["Min Eval Days",selected.minDays||"None"],["Winning Days Required",selected.minWinDays>0?selected.minWinDays+" winning days":"None"],["Consistency Rule",selected.consistencyRule?.label||"None"],["Payout Split",selected.split],["Payout Speed",selected.payoutSpeed],["Activation Fee",selected.fee],["News Trading",selected.news?"✅ Allowed":"❌ Not Allowed"],["Swing / Overnight",selected.swing?"✅ Allowed":"❌ Not Allowed"]].map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #F1F5F9",gap:12}}>
          <span style={{fontSize:13,color:"#64748B"}}>{l}</span><span style={{fontSize:13,fontWeight:600,textAlign:"right"}}>{v}</span>
        </div>
      ))}
      <div style={{marginTop:14,padding:"12px 14px",background:"#F8FAFC",borderRadius:8,fontSize:13,color:"#64748B",lineHeight:1.7}}>💡 {selected.notes}</div>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn onClick={()=>{setForm(f=>({...f,firm:selected.firmKey,plan:selected.planKey}));setModal("add")}} sx={{flex:1}}>+ Add This Account</Btn>
        <Btn v="ghost" onClick={()=>setModal(null)}>Close</Btn>
      </div>
    </Modal>}
  {/* BULK PROFIT UPDATE MODAL */}
  {/* BULK ADD ACCOUNTS */}
  {modal==="bulkAdd"&&(()=>{
    const bFirm = FIRMS[bulkAddForm.firm];
    const bPlan = bFirm?.plans[bulkAddForm.plan];
    const bSizes = bPlan ? Object.keys(bPlan.targets) : ["50K"];
    const bCount = Math.min(50, Math.max(1, parseInt(bulkAddForm.count)||1));

    const changeBulkFirm = fk => {
      const pk = Object.keys(FIRMS[fk].plans)[0];
      const pl = FIRMS[fk].plans[pk];
      const sz = Object.keys(pl.targets)[1]||Object.keys(pl.targets)[0];
      setBulkAddForm(f=>({...f,firm:fk,plan:pk,accountSize:sz}));
    };
    const changeBulkPlan = pk => {
      const pl = FIRMS[bulkAddForm.firm].plans[pk];
      const sz = Object.keys(pl.targets)[1]||Object.keys(pl.targets)[0];
      setBulkAddForm(f=>({...f,plan:pk,accountSize:sz}));
    };

    return <div onClick={e=>e.target===e.currentTarget&&setModal(null)} style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:480,boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:"4px solid "+(bFirm?.color||"#1D4ED8")}}>
        <div style={{padding:"20px 24px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>Add Multiple Accounts</div>
            <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>Create up to 50 identical accounts at once</div>
          </div>
          <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:"#94A3B8",cursor:"pointer",fontSize:22}}>×</button>
        </div>
        <div style={{padding:"20px 24px"}}>

          {/* Firm */}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Prop Firm</label>
            <select value={bulkAddForm.firm} onChange={e=>changeBulkFirm(e.target.value)}
              style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}>
              {Object.entries(FIRMS).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>

          {/* Plan */}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Account Plan</label>
            <select value={bulkAddForm.plan} onChange={e=>changeBulkPlan(e.target.value)}
              style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}>
              {Object.entries(FIRMS[bulkAddForm.firm]?.plans||{}).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Size + Status row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Account Size</label>
              <select value={bulkAddForm.accountSize} onChange={e=>setBulkAddForm(f=>({...f,accountSize:e.target.value}))}
                style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}>
                {bSizes.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Status</label>
              <select value={bulkAddForm.status} onChange={e=>setBulkAddForm(f=>({...f,status:e.target.value}))}
                style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}>
                {STATUS_OPTIONS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Count */}
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:6}}>Number of Accounts</label>
            <input type="number" min="1" max="50" value={bulkAddForm.count}
              onChange={e=>setBulkAddForm(f=>({...f,count:e.target.value}))}
              style={{width:"100%",background:"#F8FAFC",border:"1px solid #E2E8F0",color:"#0F172A",padding:"9px 12px",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none"}}/>
          </div>

          {/* Preview */}
          <div style={{padding:"12px 14px",borderRadius:9,background:(bFirm?.color||"#1D4ED8")+"0D",border:"1px solid "+(bFirm?.color||"#1D4ED8")+"33",marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:bFirm?.color||"#1D4ED8",marginBottom:4}}>Preview</div>
            <div style={{fontSize:12,color:"#374151"}}>
              Will create <strong>{bCount}</strong> × <strong>{bFirm?.name}</strong> {bPlan?.label} {bulkAddForm.accountSize} accounts in <strong>{bulkAddForm.status}</strong> status
            </div>
            {bPlan&&<div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>
              Profit target: ${bPlan.targets[bulkAddForm.accountSize]?.toLocaleString()||"—"} · {bPlan.drawdown}
            </div>}
          </div>

          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{
              const newAccounts = Array.from({length:bCount}, ()=>({
                id:uid(), firm:bulkAddForm.firm, plan:bulkAddForm.plan,
                accountSize:bulkAddForm.accountSize, status:bulkAddForm.status,
                currentProfit:"", profitTarget:"", daysTraded:"",
                currentBalance:"", bestDayPnl:"", winningDays:"", notes:"",
                createdAt:Date.now()
              }));
              setAccounts(p=>[...p,...newAccounts]);
              setModal(null);
            }} style={{flex:1,padding:"11px",background:bFirm?.color||"#1D4ED8",color:"#fff",border:"none",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              Create {bCount} Account{bCount!==1?"s":""}
            </button>
            <button onClick={()=>setModal(null)} style={{padding:"11px 18px",background:"transparent",color:"#6B7280",border:"1px solid #E2E8F0",borderRadius:8,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    </div>;
  })()}

  {/* SINGLE ACCOUNT P&L UPDATE */}
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
        </div>
  )
}
