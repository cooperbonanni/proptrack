export const FIRMS = {

  // APEX TRADER FUNDING
  apex: { name:"Apex Trader Funding", color:"#0284C7", plans: {
    eod: {
      label:"EOD Trail",
      drawdown:"EOD Trailing (updates at 4:59 PM ET)",
      minDays:0, dailyLimit:"Per size (soft)", consistency:"None eval / 50% funded (PA)",
      swing:false, news:true, split:"100%",
      payoutSpeed:"5 qualifying days (min $100-$400/day by size)",
      fee:"25K: $109 / 50K: $119 / 100K: $139 / 150K: $159",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":250,"100K":300,"150K":400},
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      dllAmounts:{"25K":500,"50K":1000,"100K":1500,"150K":2000},
      bufferAmounts:{"25K":1100,"50K":2100,"100K":3100,"150K":4100},
      consistencyRule:{type:"percent",pct:50,phase:"funded",label:"50% max single day of total profit — PA only, none in eval"},
      notes:"DLL is soft (pauses day). Safety net = drawdown + $100. 5 qualifying days per cycle — 50K needs $250+/day. 50% consistency PA only. 100% split. 6 payouts max per PA."
    },
    intraday: {
      label:"Intraday Trail",
      drawdown:"Intraday Trailing (real-time, follows peak unrealized P+L)",
      minDays:0, dailyLimit:null, consistency:"None eval / 50% funded (PA)",
      swing:false, news:true, split:"100%",
      payoutSpeed:"5 qualifying days (min $100-$300/day by size)",
      fee:"25K: $89 / 50K: $69 / 100K: $119 / 150K: $139",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":200,"100K":250,"150K":300},
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      dllAmounts:null,
      bufferAmounts:{"25K":1100,"50K":2100,"100K":3100,"150K":4100},
      consistencyRule:{type:"percent",pct:50,phase:"funded",label:"50% max single day of total profit — PA only, none in eval"},
      notes:"No DLL. Trails peak unrealized in real-time. Same buffer and 50% consistency as EOD. Cheaper activation fees. 6 payouts max."
    },
  }},

  // TRADEIFY
  tradeify: { name:"Tradeify", color:"#059669", plans: {
    select_flex: {
      label:"Select Flex",
      drawdown:"EOD Trailing (locks at start + $100)",
      minDays:3, dailyLimit:null, consistency:"40% eval / None funded",
      swing:false, news:true, split:"90%",
      payoutSpeed:"5 winning days ($150/$200/$250 by size)",
      fee:"None",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":150,"100K":200,"150K":250},
      targets:{"25K":1500,"50K":2500,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1500,"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:40,phase:"eval",label:"40% eval only — no consistency once funded"},
      notes:"No DLL. No buffer. No consistency funded. 5 winning days — 50K needs $150+/day. 5 payouts then Tradeify Elite."
    },
    select_daily: {
      label:"Select Daily",
      drawdown:"EOD Trailing (locks at start + $100)",
      minDays:3, dailyLimit:"Per size", consistency:"40% eval / None funded",
      swing:false, news:true, split:"90%",
      payoutSpeed:"Daily (after buffer cleared)",
      fee:"None",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":2500,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1500,"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:{"25K":500,"50K":1000,"100K":1250,"150K":1750},
      bufferAmounts:{"25K":1100,"50K":2100,"100K":2600,"150K":3600},
      consistencyRule:{type:"percent",pct:40,phase:"eval",label:"40% eval only — no consistency funded"},
      notes:"Buffer = start + drawdown + $100. DLL soft. No winning days once buffer met. Payout = 2x profit above buffer."
    },
    growth: {
      label:"Growth",
      drawdown:"EOD Trailing (locks at start + $100)",
      minDays:1, dailyLimit:"Per size", consistency:"None eval / 35% funded",
      swing:false, news:true, split:"90%",
      payoutSpeed:"5 winning days ($100+ each)",
      fee:"None",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":100,"100K":100,"150K":100},
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1500,"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:{"25K":600,"50K":1250,"100K":2500,"150K":3750},
      bufferAmounts:null,
      consistencyRule:{type:"percent",pct:35,phase:"funded",label:"None eval / 35% funded"},
      notes:"No consistency eval. 35% consistency funded. DLL soft. 5 winning days $100+ each. 90% split."
    },
    lightning: {
      label:"Lightning (Skip Eval)",
      drawdown:"EOD Trailing (locks at start + $100)",
      minDays:0, dailyLimit:"Per size", consistency:"20% payout 1 / 25% payout 2 / 30% payout 3+",
      swing:false, news:true, split:"90%",
      payoutSpeed:"Any day (progressive consistency met)",
      fee:"None",
      minWinDays:0, winDayThresholds:null,
      targets:null,
      drawdownAmounts:{"25K":1500,"50K":2000,"100K":3000,"150K":5250},
      dllAmounts:{"25K":600,"50K":1250,"100K":2500,"150K":3000},
      bufferAmounts:null,
      consistencyRule:{type:"progressive",pct:20,label:"Progressive: 20% (1st) then 25% (2nd) then 30% (3rd+)"},
      notes:"Skip evaluation — no profit target. Progressive consistency starts at 20%. DLL soft. 150K: $5,250 drawdown, $3,000 DLL. No winning day req. 90% split."
    },
  }},

  // MY FUNDED FUTURES
  mffu: { name:"My Funded Futures", color:"#DC2626", plans: {
    flex: {
      label:"Flex (25K/50K)",
      drawdown:"EOD Trailing (3% — locks at start + $100)",
      minDays:2, dailyLimit:null, consistency:"50% eval / None funded",
      swing:true, news:false, split:"80%",
      payoutSpeed:"5 winning days ($100 on 25K / $150 on 50K)",
      fee:"None",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":150},
      targets:{"25K":1500,"50K":3000},
      drawdownAmounts:{"25K":1000,"50K":2000},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency funded"},
      notes:"No DLL. No T1 news on funded. No buffer. 5 winning days: $100+ on 25K, $150+ on 50K. Max payout: $3K (25K) or $5K (50K). 80/20 split."
    },
    rapid: {
      label:"Rapid (25K-150K)",
      drawdown:"Intraday Trailing (4% — locks at start + $100)",
      minDays:2, dailyLimit:null, consistency:"50% eval / None funded",
      swing:true, news:false, split:"90%",
      payoutSpeed:"Daily (24h after first funded trade, after buffer)",
      fee:"One-time",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:null,
      bufferAmounts:{"25K":1100,"50K":2100,"100K":3100,"150K":4600},
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency funded"},
      notes:"Intraday trailing on funded. Buffer required: $2,100 (50K). Daily payout after 24h + buffer met. No consistency funded. No T1 news funded. 90/10 split."
    },
    builder: {
      label:"Builder (50K only)",
      drawdown:"EOD Trailing (options: $2,000 or $1,500)",
      minDays:1, dailyLimit:"$1,000 (soft pause)", consistency:"50% eval / 50% funded",
      swing:true, news:true, split:"80%",
      payoutSpeed:"5 winning days (any green day)",
      fee:"None",
      minWinDays:5,
      winDayThresholds:{"50K":0},
      targets:{"50K":3000},
      drawdownAmounts:{"50K":2000},
      dllAmounts:{"50K":1000},
      bufferAmounts:{"50K":2100},
      consistencyRule:{type:"percent",pct:50,phase:"eval",fundedPct:50,label:"50% eval / 50% funded"},
      notes:"$50K only. Can choose $2,000 or $1,500 drawdown at checkout. $1,000 DLL (soft). Pass in 1 day. News allowed. Any green day = winning day. Buffer $2,100 on funded. 1 account max per user. 80/20 split."
    },
    pro: {
      label:"Pro (50K-150K)",
      drawdown:"EOD Trailing (3% — locks at start + $100)",
      minDays:2, dailyLimit:null, consistency:"50% eval / None funded",
      swing:true, news:true, split:"80%",
      payoutSpeed:"Every 14 calendar days (buffer required)",
      fee:"None",
      minWinDays:0, winDayThresholds:null,
      targets:{"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:null,
      bufferAmounts:{"50K":2100,"100K":3100,"150K":4600},
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency funded"},
      notes:"No DLL. No consistency funded. News allowed. Buffer required. 14 calendar days between payouts. $1,000 min withdrawal. $100K total payout cap. 80/20 split."
    },
  }},

  // ALPHA FUTURES
  alpha: { name:"Alpha Futures", color:"#B91C1C", plans: {
    premium: {
      label:"Premium (May 2026)",
      drawdown:"EOD Trailing (MLL 4%)",
      minDays:2, dailyLimit:null, consistency:"50% eval / None qualified",
      swing:false, news:true, split:"90%",
      payoutSpeed:"5 winning days ($200+ each)",
      fee:"$149 or $0 activation (two pricing options)",
      minWinDays:5,
      winDayThresholds:{"50K":200,"100K":200,"150K":200},
      targets:{"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"50K":2000,"100K":3000,"150K":4500},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency on qualified"},
      notes:"Replaced Standard May 2026. No DLG. No news restrictions. No consistency on qualified. 5 winning days $200+. Tiered caps $3K-$6K. 90% split."
    },
    advanced: {
      label:"Advanced",
      drawdown:"EOD Trailing (MLL 4%)",
      minDays:2, dailyLimit:null, consistency:"50% eval / None qualified",
      swing:false, news:true, split:"90%",
      payoutSpeed:"5 winning days ($200+ each)",
      fee:"$149 activation",
      minWinDays:5,
      winDayThresholds:{"50K":200,"100K":200,"150K":200},
      targets:{"50K":4000,"100K":8000,"150K":12000},
      drawdownAmounts:{"50K":2000,"100K":3500,"150K":5250},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency on qualified"},
      notes:"No DLG. No consistency qualified. News allowed. 5 winning days $200+. $15K max per request. 90% split. 8% profit target."
    },
    zero: {
      label:"Zero (1-Day Eval)",
      drawdown:"EOD Trailing (MLL 4%)",
      minDays:0, dailyLimit:"Per size (2% DLG — soft)", consistency:"None eval / 40% qualified",
      swing:false, news:false, split:"90%",
      payoutSpeed:"5 winning days ($200+ each)",
      fee:"$0 activation",
      minWinDays:5,
      winDayThresholds:{"25K":200,"50K":200,"100K":200},
      targets:{"25K":1500,"50K":3000,"100K":6000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000},
      dllAmounts:{"25K":500,"50K":1000,"100K":2000},
      bufferAmounts:null,
      consistencyRule:{type:"percent",pct:40,phase:"funded",label:"No consistency eval / 40% on qualified"},
      notes:"1-day eval (NOT skip eval — must complete 1 trading day). No activation fee. DLG 2% (soft). 40% consistency qualified. 5 winning days $200+. Caps: $1K/$1.5K/$2.5K. News restrictions on qualified."
    },
  }},

  // LUCID TRADING
  lucid: { name:"Lucid Trading", color:"#0369A1", plans: {
    flex: {
      label:"LucidFlex",
      drawdown:"EOD Trailing (MLL 4%)",
      minDays:0, dailyLimit:null, consistency:"50% eval / None funded",
      swing:false, news:true, split:"90%",
      payoutSpeed:"5 winning days ($150+ on 50K, varies by size)",
      fee:"One-time",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":150,"100K":200,"150K":250},
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":4000,"150K":6000},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval only — no consistency or DLL once funded"},
      notes:"No DLL ever. No buffer. No consistency funded. 5 winning days — $150+ on 50K, $200+ on 100K. Must have $1+ net cycle profit. 5 payouts max then LucidLive. 90/10."
    },
    pro: {
      label:"LucidPro",
      drawdown:"EOD Trailing (MLL 4% — scaling DLL ~60% of MLL)",
      minDays:0, dailyLimit:"Per size (scaling ~60% of MLL)", consistency:"None eval / 40% funded per cycle",
      swing:false, news:true, split:"90%",
      payoutSpeed:"3 calendar traded days + profit goal + 40% consistency",
      fee:"One-time",
      minWinDays:3, winDayThresholds:{"25K":0,"50K":0,"100K":0,"150K":0},
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":4000,"150K":6000},
      dllAmounts:{"25K":600,"50K":1200,"100K":2400,"150K":3600},
      bufferAmounts:{"25K":1100,"50K":2100,"100K":4100,"150K":6100},
      consistencyRule:{type:"percent",pct:40,phase:"funded",label:"40% per payout cycle — no consistency in eval"},
      notes:"Pass in 1 day. Must have 3 traded days (no profit min per day). Buffer = MLL + $100. 40% consistency per cycle. DLL scales (~60% of MLL). 5 payouts then LucidLive. 90/10."
    },
    direct: {
      label:"LucidDirect (Skip Eval)",
      drawdown:"EOD Trailing (MLL 4% — scaling DLL ~60% of MLL)",
      minDays:0, dailyLimit:"Per size (scaling ~60% of MLL)", consistency:"None / 20% funded per cycle",
      swing:false, news:true, split:"90%",
      payoutSpeed:"Any day after buffer + 20% consistency met",
      fee:"One-time",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":4000,"150K":4500},
      dllAmounts:{"25K":600,"50K":1200,"100K":2400,"150K":2700},
      bufferAmounts:{"25K":1100,"50K":2100,"100K":4100,"150K":4600},
      consistencyRule:{type:"percent",pct:20,phase:"funded",label:"20% funded per cycle — strictest at Lucid"},
      notes:"Skip eval. Buffer = MLL + $100. 20% consistency funded. DLL scales. 150K MLL $4,500 (Feb 2026). 6 payouts then LucidLive. No profitable day count required."
    },
  }},

  // TAKE PROFIT TRADER
  tpt: { name:"Take Profit Trader", color:"#7C3AED", plans: {
    test: {
      label:"Test (Evaluation)",
      drawdown:"EOD Trailing",
      minDays:5, dailyLimit:null, consistency:"50% eval",
      swing:false, news:true, split:"N/A",
      payoutSpeed:"N/A — pass to PRO",
      fee:"Monthly subscription",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:50,phase:"eval",label:"50% eval — no consistency in PRO or PRO+"},
      notes:"EOD trailing during eval. No DLL. 50% consistency eval only. 5 min trading days. News allowed. Monthly subscription. $130 activation on pass. Can reset for $100."
    },
    pro: {
      label:"PRO (Funded — Sim)",
      drawdown:"Intraday Trailing (real-time)",
      minDays:0, dailyLimit:null, consistency:"None",
      swing:false, news:false, split:"80%",
      payoutSpeed:"Day 1 (daily, after buffer cleared)",
      fee:"$130 one-time",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      dllAmounts:null,
      bufferAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      consistencyRule:{type:"none",label:"None — no consistency on PRO or PRO+"},
      notes:"Switches to intraday trailing when funded. Buffer = drawdown amount ($2K on 50K). No consistency. No DLL. No news on major events. Must trade 1 day/week. 3 resets allowed. 80/20 split. Simulated environment."
    },
    proplus: {
      label:"PRO+ (Live Account)",
      drawdown:"EOD Trailing (upgraded from PRO intraday)",
      minDays:0, dailyLimit:null, consistency:"None",
      swing:false, news:false, split:"90%",
      payoutSpeed:"Day 1 (daily, no buffer)",
      fee:"Invitation only (after $10K profit in PRO)",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":6000,"150K":9000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000,"150K":4000},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"none",label:"None — same as PRO but live"},
      notes:"LIVE market account — orders go to exchange. Invitation only after $10K+ profit in PRO (or consistent withdrawals). EOD drawdown (upgraded from intraday). No buffer. 90/10 split (up from 80/20). Same news restrictions and contract limits as PRO. Up to 5 PRO+PRO+ accounts simultaneously."
    },
  }},

  // FUNDEDNEXT FUTURES
  fundednext: { name:"FundedNext (Futures)", color:"#BE185D", plans: {
    legacy: {
      label:"Legacy Challenge",
      drawdown:"EOD Trailing (MLL locks at start on first payout)",
      minDays:0, dailyLimit:null, consistency:"40% eval / None funded",
      swing:false, news:true, split:"80% + 15% bonus",
      payoutSpeed:"5 benchmark days ($100 on 25K / $200 on 50K+100K)",
      fee:"One-time",
      minWinDays:5,
      winDayThresholds:{"25K":100,"50K":200,"100K":200},
      targets:{"25K":1250,"50K":3000,"100K":6000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":3000},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:40,phase:"eval",label:"40% eval only — removed from funded Jan 2026"},
      notes:"No DLL. No buffer. 5 benchmark days: $100 (25K), $200 (50K/100K). $500+ profit per cycle. Max 50% per withdrawal. First withdrawal locks MLL at start. 80% + 15% bonus. Path to Live Trading Program."
    },
    rapid: {
      label:"Rapid Challenge",
      drawdown:"EOD Trailing (MLL locks at start on first payout)",
      minDays:0, dailyLimit:null, consistency:"None eval / 40% funded",
      swing:false, news:true, split:"80%",
      payoutSpeed:"3 days after 40% consistency met",
      fee:"One-time",
      minWinDays:0, winDayThresholds:null,
      targets:{"25K":1500,"50K":3000,"100K":5000},
      drawdownAmounts:{"25K":1000,"50K":2000,"100K":2500},
      dllAmounts:null, bufferAmounts:null,
      consistencyRule:{type:"percent",pct:40,phase:"funded",label:"None eval / 40% funded per cycle"},
      notes:"No consistency eval. 40% consistency funded. No benchmark days. Earliest payout 3 days after consistency met. No DLL. No buffer. Caps: $800 (25K), $1,500 (50K), $2,500 (100K) until 5th payout then uncapped. $250 min."
    },
    bolt: {
      label:"Bolt ($50K only)",
      drawdown:"EOD Trailing (MLL locks at $50,100)",
      minDays:0, dailyLimit:1000, consistency:"40% eval / None funded",
      swing:false, news:true, split:"80%",
      payoutSpeed:"Any day after buffer ($52,100) and $250+ cycle profit",
      fee:"$69.99-$99.99",
      minWinDays:0, winDayThresholds:null,
      targets:{"50K":3000},
      drawdownAmounts:{"50K":2000},
      dllAmounts:{"50K":1000},
      bufferAmounts:{"50K":2100},
      consistencyRule:{type:"percent",pct:40,phase:"eval",label:"40% eval / no consistency funded"},
      notes:"$50K only. $1,000 DLL soft. 40% consistency eval only. Buffer $52,100. No winning day req. Max 5 total payouts then closes. $250 min, $1,200 max per payout. 5th payout: can withdraw buffer too (up to $7,700). 80% split."
    },
  }},

};


const STATUS_OPTIONS = ["Evaluation","Funded","Payout Eligible","Violated","Passed","Pending Reset"];
const STATUS_META = {
  "Evaluation":{"color":"#2563EB","bg":"#EFF6FF","border":"#BFDBFE"},
  "Funded":{"color":"#059669","bg":"#ECFDF5","border":"#A7F3D0"},
  "Payout Eligible":{"color":"#D97706","bg":"#FFFBEB","border":"#FDE68A"},
  "Violated":{"color":"#DC2626","bg":"#FEF2F2","border":"#FECACA"},
  "Passed":{"color":"#7C3AED","bg":"#F5F3FF","border":"#DDD6FE"},
  "Pending Reset":{"color":"#C2410C","bg":"#FFF7ED","border":"#FED7AA"},
};

function uid() { return Math.random().toString(36).slice(2,9); }

function calcElig(acct) {
  const firm = FIRMS[acct.firm];
  const plan = firm && firm.plans[acct.plan];
  if (!firm || !plan) return {eligible:false,met:[],missing:[],phase:"unknown"};
  const met=[], missing=[];
  const profit      = parseFloat(acct.currentProfit)||0;
  const days        = parseInt(acct.daysTraded)||0;
  const winDays     = parseInt(acct.winningDays)||0;
  const isFunded    = ["Funded","Payout Eligible"].includes(acct.status);
  const isEval      = acct.status==="Evaluation";
  const isPassed    = acct.status==="Passed";

  if (isFunded) {
    // Funded: check winning days for payout eligibility
    const minWin = plan.minWinDays||0;
    if (minWin>0) {
      winDays>=minWin
        ? met.push("Winning days ("+winDays+"/"+minWin+") complete")
        : missing.push((minWin-winDays)+" more winning day"+(minWin-winDays!==1?"s":"")+" needed");
    } else {
      met.push("No winning days minimum — "+plan.payoutSpeed);
    }
  } else if (isEval) {
    // Eval: check profit target + min trading days — eligible means PASSED not payout
    const target = parseFloat(acct.profitTarget)||((plan.targets&&plan.targets[acct.accountSize])||0);
    if (target>0) { profit>=target ? met.push("Profit target $"+target.toLocaleString()+" reached") : missing.push("$"+(target-profit).toLocaleString()+" more profit needed"); }
    else met.push("No profit target required");
    if (plan.minDays>0) { days>=plan.minDays ? met.push("Min "+plan.minDays+" trading days complete") : missing.push((plan.minDays-days)+" more day"+(plan.minDays-days!==1?"s":"")+" needed"); }
    else met.push("No minimum days required");
  } else if (isPassed) {
    met.push("Evaluation passed — waiting to be funded");
  } else {
    met.push("Check account status");
  }

  if (acct.status==="Violated") missing.push("Account is violated");
  const eligible = missing.length===0 && acct.status!=="Violated";
  return {eligible, met, missing, isFunded, isEval, isPassed};
}

function calcConsistency(acct) {
  const firm = FIRMS[acct.firm];
  const plan = firm && firm.plans[acct.plan];
  if (!plan || !plan.consistencyRule) return null;
  const rule = plan.consistencyRule;
  if (rule.type === "none") return { ok:true, label:"No consistency rule", detail:null };

  const totalProfit = parseFloat(acct.currentProfit) || 0;
  const bestDay     = parseFloat(acct.bestDayPnl)    || 0;
  const isFunded    = ["Funded","Payout Eligible"].includes(acct.status);
  const isEval      = acct.status === "Evaluation";

  let pct = null;
  if (rule.phase === "eval" && isEval)         pct = rule.pct;
  else if (rule.phase === "funded" && isFunded) pct = rule.fundedPct || rule.pct;
  else if (rule.phase === "both")               pct = isFunded ? (rule.fundedPct || rule.pct) : rule.pct;

  if (pct === null || !bestDay || !totalProfit) {
    return { ok:null, label:rule.label, detail:"Enter profit + best day to check", pct };
  }

  const maxAllowed = totalProfit * (pct / 100);
  const ratio = Math.round((bestDay / totalProfit) * 100);
  const ok = bestDay <= maxAllowed;
  return {
    ok, pct, ratio, maxAllowed, bestDay,
    label: rule.label,
    detail: ok
      ? "Best day ($"+bestDay.toLocaleString()+") is "+ratio+"% of profit — within "+pct+"% limit ✓"
      : "Best day ($"+bestDay.toLocaleString()+") is "+ratio+"% of profit — exceeds "+pct+"% limit by $"+(bestDay-maxAllowed).toFixed(0),
    needed: ok ? null : "Need $"+((bestDay/(pct/100))-totalProfit).toFixed(0)+" more total profit to fix",
  };
}

export const PLANS = [
  { id: "starter",  name: "Starter",  price: 19,  accounts: 5,   features: ["Up to 5 accounts", "All 7 firms + 22 plans", "P+L tracking", "Payout eligibility alerts", "Analytics dashboard"] },
  { id: "pro",      name: "Pro",      price: 39,  accounts: 25,  features: ["Up to 25 accounts", "Everything in Starter", "Bulk P+L updates", "Daily calendar + win rate", "Priority support"] },
  { id: "lifetime", name: "Lifetime", price: 299, accounts: 9999, features: ["Unlimited accounts", "Everything in Pro", "One-time payment", "All future updates", "Lifetime access"] },
]
