import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FIRMS } from '../lib/firms'

export default function FirmRules() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Firm Rules</h1>
        <p style={{fontSize:13,color:"#64748B"}}>
          {Object.keys(FIRMS).length} firms · {Object.values(FIRMS).reduce((s,f)=>s+Object.keys(f.plans).length,0)} plans. Click any plan for full details.
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"12px 16px",marginBottom:24,display:"flex",gap:10}}>
        <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
        <div style={{fontSize:12,color:"#92400E",lineHeight:1.6}}>
          <strong>Disclaimer:</strong> PropTrack provides a general summary of prop firm rules for convenience only. Rules change frequently — always verify current rules directly with each firm before trading. This is not financial or trading advice.
        </div>
      </div>

      {Object.entries(FIRMS).map(([firmKey, firm]) => (
        <div key={firmKey} style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:firm.color}}/>
            <span style={{fontSize:16,fontWeight:700}}>{firm.name}</span>
            <span style={{fontSize:12,color:"#94A3B8"}}>{Object.keys(firm.plans).length} plan{Object.keys(firm.plans).length>1?"s":""}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {Object.entries(firm.plans).map(([planKey, plan]) => (
              <div key={planKey} onClick={()=>setSelected({firmKey,planKey,firmName:firm.name,color:firm.color,...plan})}
                style={{background:"#fff",borderRadius:14,padding:"20px",border:"1px solid #E2E8F0",borderTop:`4px solid ${firm.color}`,cursor:"pointer",transition:"box-shadow .15s,transform .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(-1px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
                <div style={{fontWeight:800,fontSize:15,marginBottom:14}}>{plan.label}</div>

                {/* Key numbers */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {[
                    {l:"Profit Target",v:plan.targets?.["50K"]?"$"+plan.targets["50K"].toLocaleString():plan.targets?"Varies":"N/A",c:"#059669",bg:"#ECFDF5",b:"#A7F3D0"},
                    {l:"Max Drawdown",v:plan.drawdownAmounts?.["50K"]?"$"+plan.drawdownAmounts["50K"].toLocaleString():"--",c:"#DC2626",bg:"#FEF2F2",b:"#FECACA"},
                    {l:"Buffer (50K)",v:plan.bufferAmounts?.["50K"]?"$"+plan.bufferAmounts["50K"].toLocaleString():"None",c:plan.bufferAmounts?.["50K"]?"#1D4ED8":"#94A3B8",bg:plan.bufferAmounts?.["50K"]?"#EFF6FF":"#F8FAFC",b:plan.bufferAmounts?.["50K"]?"#BFDBFE":"#E2E8F0"},
                    {l:"Daily Limit",v:plan.dllAmounts?.["50K"]?"$"+plan.dllAmounts["50K"].toLocaleString():"None",c:plan.dllAmounts?.["50K"]?"#D97706":"#94A3B8",bg:plan.dllAmounts?.["50K"]?"#FFFBEB":"#F8FAFC",b:plan.dllAmounts?.["50K"]?"#FDE68A":"#E2E8F0"},
                  ].map(k=>(
                    <div key={k.l} style={{background:k.bg,border:`1px solid ${k.b}`,borderRadius:9,padding:"9px 12px"}}>
                      <div style={{fontSize:10,color:k.c,fontWeight:700,marginBottom:3}}>{k.l.toUpperCase()}</div>
                      <div style={{fontSize:15,fontWeight:800,color:k.c}}>{k.v}</div>
                    </div>
                  ))}
                </div>

                {[
                  ["Drawdown Type", plan.drawdown],
                  ["Consistency",   plan.consistencyRule?.label||"None"],
                  ["Winning Days",  plan.minWinDays>0?plan.minWinDays+" days required":"None"],
                  ["Min Eval Days", plan.minDays||"None"],
                  ["Payout Split",  plan.split],
                  ["Payout Speed",  plan.payoutSpeed],
                  ["Fee",           plan.fee],
                ].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 0",borderBottom:"1px solid #F1F5F9",gap:12}}>
                    <span style={{fontSize:12,color:"#64748B",flexShrink:0}}>{l}</span>
                    <span style={{fontSize:12,fontWeight:600,textAlign:"right"}}>{v}</span>
                  </div>
                ))}

                <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,padding:"3px 9px",borderRadius:5,fontWeight:600,background:plan.news?"#ECFDF5":"#FEF2F2",color:plan.news?"#059669":"#DC2626"}}>{plan.news?"News ✓":"No News"}</span>
                  <span style={{fontSize:11,padding:"3px 9px",borderRadius:5,fontWeight:600,background:plan.swing?"#ECFDF5":"#FEF2F2",color:plan.swing?"#059669":"#DC2626"}}>{plan.swing?"Swing ✓":"No Swing"}</span>
                  {plan.bufferAmounts&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:5,fontWeight:600,background:"#EFF6FF",color:"#1D4ED8"}}>Buffer Required</span>}
                  {plan.minWinDays>0&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:5,fontWeight:600,background:"#ECFDF5",color:"#059669"}}>{plan.minWinDays} Winning Days</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Plan detail modal */}
      {selected&&(
        <div onClick={e=>e.target===e.currentTarget&&setSelected(null)}
          style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
          <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.15)",borderTop:`4px solid ${selected.color}`}}>
            <div style={{padding:"20px 24px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <h2 style={{fontSize:16,fontWeight:700}}>{selected.firmName}</h2>
                <p style={{fontSize:12,color:"#94A3B8",marginTop:3}}>{selected.label}</p>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",fontSize:22,color:"#94A3B8",cursor:"pointer"}}>x</button>
            </div>
            <div style={{padding:"20px 24px"}}>
              {/* Per-size breakdown */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:600,color:"#94A3B8",marginBottom:8}}>AMOUNTS BY ACCOUNT SIZE</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:6}}>
                  {Object.keys(selected.targets||selected.drawdownAmounts||{}).map(sz=>(
                    <div key={sz} style={{background:"#F8FAFC",borderRadius:8,padding:"10px 12px",border:"1px solid #E2E8F0"}}>
                      <div style={{fontSize:12,fontWeight:800,marginBottom:6}}>{sz}</div>
                      {selected.targets?.[sz]&&<div style={{fontSize:11,color:"#059669"}}>Target: ${selected.targets[sz].toLocaleString()}</div>}
                      {selected.drawdownAmounts?.[sz]&&<div style={{fontSize:11,color:"#DC2626"}}>MDD: ${selected.drawdownAmounts[sz].toLocaleString()}</div>}
                      {selected.bufferAmounts?.[sz]&&<div style={{fontSize:11,color:"#1D4ED8"}}>Buffer: ${selected.bufferAmounts[sz].toLocaleString()}</div>}
                      {selected.dllAmounts?.[sz]&&<div style={{fontSize:11,color:"#D97706"}}>DLL: ${selected.dllAmounts[sz].toLocaleString()}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {[
                ["Drawdown Type",     selected.drawdown],
                ["Min Eval Days",     selected.minDays||"None"],
                ["Winning Days Req",  selected.minWinDays>0?selected.minWinDays+" winning days":"None"],
                ["Consistency Rule",  selected.consistencyRule?.label||"None"],
                ["Payout Split",      selected.split],
                ["Payout Speed",      selected.payoutSpeed],
                ["Fee",               selected.fee],
                ["News Trading",      selected.news?"Allowed":"Not Allowed"],
                ["Swing / Overnight", selected.swing?"Allowed":"Not Allowed"],
              ].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #F1F5F9",gap:12}}>
                  <span style={{fontSize:13,color:"#64748B"}}>{l}</span>
                  <span style={{fontSize:13,fontWeight:600,textAlign:"right"}}>{v}</span>
                </div>
              ))}

              <div style={{marginTop:12,padding:"12px 14px",background:"#F8FAFC",borderRadius:8,fontSize:13,color:"#64748B",lineHeight:1.7}}>
                {selected.notes}
              </div>

              <div style={{display:"flex",gap:10,marginTop:20}}>
                <button onClick={()=>{setSelected(null);navigate("/dashboard")}}
                  style={{flex:1,padding:"11px",background:selected.color,color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                  + Add This Account
                </button>
                <button onClick={()=>setSelected(null)}
                  style={{padding:"11px 18px",background:"transparent",color:"#6B7280",border:"1px solid #E2E8F0",borderRadius:8,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
