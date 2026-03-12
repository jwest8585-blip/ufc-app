/* eslint-disable no-unused-vars, no-dupe-keys */
import { useState, useCallback, useEffect } from "react";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const toImplied = o => { const n = parseInt(o); if (isNaN(n)) return 50; return n > 0 ? Math.round(100 / (n + 100) * 100) : Math.round(-n / (-n + 100) * 100); };
const isFav = o => parseInt(o) < 0;
const mono = { fontFamily: "'Inter', sans-serif", fontWeight: 600 };
const cond = { fontFamily: "'Inter Tight', sans-serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@700;800;900&family=Rajdhani:wght@500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;background:#0e0e14;}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#12121a}
::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes octGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(229,57,53,0.4))}50%{filter:drop-shadow(0 0 14px rgba(229,57,53,0.85))}}
@keyframes waveDraw{from{stroke-dashoffset:160}to{stroke-dashoffset:0}}
@keyframes waveGlow{0%,100%{opacity:.85;stroke:#e53935}50%{opacity:1;stroke:#ff7055}}
@keyframes iqGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(229,57,53,.3))}50%{filter:drop-shadow(0 0 16px rgba(229,57,53,.75))}}
@keyframes liveBlink{0%,100%{opacity:1;box-shadow:0 0 4px #e53935}50%{opacity:.3;box-shadow:none}}
@keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.oct-glow{animation:octGlow 2.8s ease-in-out infinite}
.wave-draw{stroke-dasharray:80;stroke-dashoffset:80;animation:waveDraw 1.2s cubic-bezier(.4,0,.2,1) .4s forwards,waveGlow 2.8s ease-in-out 1.6s infinite}
.iq-glow{animation:iqGlow 2.8s ease-in-out infinite}
.live-dot{width:6px;height:6px;border-radius:50%;background:#e53935;display:inline-block;animation:liveBlink 1.2s ease-in-out infinite}
.radar-ring{animation:radarSpin 16s linear infinite;transform-origin:center}
.fu{animation:fadeUp .25s ease both}
.si{animation:slideIn .2s ease both}
button:hover{opacity:0.85}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}
.grid-2-stack{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fight-btn-row{display:grid;grid-template-columns:1fr 28px 1fr}
.intel-strip{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
@media(max-width:600px){
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr 1fr!important}
  .grid-2-stack{grid-template-columns:1fr!important}
  .profiles-grid{grid-template-columns:1fr!important}
  .intel-strip{grid-template-columns:1fr!important}
  .signal-grid{grid-template-columns:1fr!important}
  .props-grid{grid-template-columns:1fr 1fr!important}
  .props-fighter-grid{grid-template-columns:1fr!important}
  .style-grid{grid-template-columns:1fr!important}
  .market-grid{grid-template-columns:1fr!important}
  .verdict-bottom{grid-template-columns:1fr!important}
}
`;


// ─── COACH ROSTERS ────────────────────────────────────────────────────────────
const COACH_ROSTERS = {
  "Urijah Faber": {
    gym: "Team Alpha Male",
    notable: ["Cody Garbrandt", "TJ Dillashaw", "Joseph Benavidez", "Danny Castillo", "Chris Holdsworth"],
    titles: ["Cody Garbrandt — UFC Bantamweight Champion", "TJ Dillashaw — 2x UFC Bantamweight Champion"],
    note: "Faber built TAM into one of the most feared bantamweight/featherweight factories in MMA history."
  },
  "Rodrigo Ruas": {
    gym: "Gorila Team",
    notable: ["Kevin Vallejos", "Rodrigo Nascimento", "Elizeu Zaleski", "Deiveson Figueiredo"],
    titles: ["Deiveson Figueiredo — UFC Flyweight Champion"],
    note: "Gorila Team is an emerging Brazilian powerhouse known for developing finishers across multiple weight classes."
  },
  "Henri Hooft": {
    gym: "Kill Cliff FC / Sanford MMA",
    notable: ["Kamaru Usman", "Gilbert Burns", "Dustin Poirier", "Belal Muhammad", "Kevin Holland"],
    titles: ["Kamaru Usman — UFC Welterweight Champion", "Belal Muhammad — UFC Welterweight Champion"],
    note: "One of the most decorated striking coaches in MMA. Hooft's fighters are known for elite cardio and sharp boxing fundamentals."
  },
  "James Krause": {
    gym: "Glory MMA",
    notable: ["Alan Jouban", "Belal Muhammad (early career)", "Darian Weeks"],
    titles: [],
    note: "Krause built Glory MMA into a regional powerhouse. Known for developing well-rounded fighters with strong mental game."
  },
  "Luiz Dorea": {
    gym: "Dorea MMA",
    notable: ["Amanda Lemos", "Michel Pereira", "Rony Jason"],
    titles: [],
    note: "Brazilian camp with a strong Muay Thai foundation. Lemos is his highest-profile UFC athlete currently."
  },
  "John Kavanagh": {
    gym: "SBG Ireland",
    notable: ["Conor McGregor", "Gunnar Nelson", "Gillian Robertson", "Norman Parke"],
    titles: ["Conor McGregor — UFC Featherweight & Lightweight Champion (first simultaneous)"],
    note: "SBG Ireland is one of the most famous gyms in MMA history. Kavanagh was the first black belt in BJJ in Ireland."
  },
  "Marc Montoya": {
    gym: "Factory X Muay Thai",
    notable: ["Oumar Sy", "Dustin Jacoby", "Brendan Allen", "Joaquin Buckley"],
    titles: [],
    note: "Factory X is one of Colorado's top MMA gyms, producing consistent UFC-level fighters with an emphasis on striking and cardio."
  },
  "Alexandre Paiva": {
    gym: "GF Team Brazil",
    notable: ["Ion Cutelaba", "Leandro Silva", "Leandro Lo (BJJ)"],
    titles: [],
    note: "GF Team is a world-renowned BJJ institution. Paiva's MMA coaching blends elite grappling with practical striking."
  },
  "Atila Batista": {
    gym: "ATT Brazil / Chute Boxe",
    notable: ["Vitor Petrino", "Alex Pereira (early)", "Wanderlei Silva (Chute Boxe lineage)"],
    titles: ["Alex Pereira — UFC Middleweight & Light Heavyweight Champion (Chute Boxe lineage)"],
    note: "Chute Boxe lineage with ATT Brazil resources. Known for producing aggressive pressure fighters with elite striking base."
  },
  "Duke Roufus": {
    gym: "Roufusport",
    notable: ["Anthony Pettis", "Steven Asplund", "Ben Askren", "Josh Burkman"],
    titles: ["Anthony Pettis — UFC Lightweight Champion", "Anthony Pettis — WEC Lightweight Champion"],
    note: "Roufusport is a legendary kickboxing-to-MMA gym. Roufus trained Anthony Pettis to the WEC and UFC title."
  },
  "Jorge Santiago": {
    gym: "Fight Sports Miami",
    notable: ["Piera Rodriguez", "Paulo Costa (training partner)", "Marlon Vera (camps)"],
    titles: [],
    note: "Fight Sports Miami is a top-tier training environment drawing elite fighters from across Latin America."
  },
  "Din Thomas": {
    gym: "American Top Team",
    notable: ["Sam Hughes", "Claudia Gadelha", "Angela Hill", "Cris Cyborg (camps)"],
    titles: [],
    note: "ATT's women's division head coach. Thomas has developed several ranked strawweights and bantamweights."
  },
  "Pedro Munhoz": {
    gym: "Team Munhoz",
    notable: ["Andre Fili", "Pedro Munhoz (fighter/coach)"],
    titles: [],
    note: "Former UFC bantamweight title contender turned coach. Brings elite grappling and fight IQ to his team."
  },
  "Marcos Avellan": {
    gym: "American Top Team",
    notable: ["Jose Delgado", "Thiago Alves", "Junior dos Santos (camps)"],
    titles: [],
    note: "ATT co-founder. One of the most prestigious gyms in MMA history with dozens of UFC champions and contenders."
  },
  "ATT Coaches": {
    gym: "American Top Team (Coconut Creek, FL)",
    notable: ["Dustin Poirier", "Kamaru Usman", "Gilbert Burns", "Junior dos Santos", "Renato Moicano", "Chris Duncan"],
    titles: ["Kamaru Usman — UFC Welterweight Champion", "Dustin Poirier — Interim UFC Lightweight Champion"],
    note: "One of the most decorated MMA gyms on the planet — world-class wrestling, boxing and BJJ infrastructure that produces consistent UFC champions and contenders."
  },
  "Eugene Bareman": {
    gym: "City Kickboxing (Auckland, NZ)",
    notable: ["Israel Adesanya", "Carlos Ulberg", "Brad Riddell", "Dan Hooker"],
    titles: ["Israel Adesanya — 5x UFC Middleweight Champion"],
    note: "The most feared striking coach in MMA. City Kickboxing is synonymous with elite Muay Thai, movement, and producing UFC world champions."
  },
  "Paul Casadonte": {
    gym: "Team Marquez MMA (Philadelphia)",
    notable: ["Joe Pyfer"],
    titles: [],
    note: "Philly-based camp known for developing physical, aggressive fighters with explosive power and submission game."
  },
  "Martin Karaivanov": {
    gym: "JETSAAM GYM (Prague, Czech Republic)",
    notable: ["Jiří Procházka", "David Dvořák"],
    titles: ["Jiří Procházka — Former UFC Light Heavyweight Champion"],
    note: "Elite Czech gym combining extreme mental fortitude with high-level striking and grappling. Procházka embodies their warrior-philosopher approach to martial arts."
  },
};

// ─── HARDCODED FIGHT DATA ─────────────────────────────────────────────────────
const FIGHT_DATA = {
  e1: {
    f1: {
      name: "Josh Emmett", nickname: "The Grim Reaper", age: 38, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/EMMETT_JOSH_L_10-04.png?itok=il8aY-mP",
      hometown: "Sacramento, CA", height: "5'6\"", weight: 146, reach: 68, legReach: 37,
      stance: "Orthodox", team: "Team Alpha Male", coach: "Urijah Faber",
      record: "18-4", wins: 18, losses: 4, draws: 0,
      byKO: 10, bySub: 1, byDec: 7, finRate: 61,
      form: ["W","W","L","W","W"],
      proDebut: "2009-03-21", ufcDebut: "2016-09-17", titles: [],
      history: [
        { date:"2024-03-09", opp:"Leandro Silva", res:"W", method:"KO/TKO", rd:1, time:"2:17", org:"UFC" },
        { date:"2023-07-29", opp:"Edson Barboza", res:"W", method:"KO/TKO", rd:1, time:"0:33", org:"UFC", ppv:true },
        { date:"2022-10-22", opp:"Calvin Kattar", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2022-04-09", opp:"Josh Emmett", res:"W", method:"KO/TKO", rd:1, time:"0:23", org:"UFC" },
        { date:"2021-10-23", opp:"Shane Burgos", res:"W", method:"KO/TKO", rd:5, time:"3:24", org:"UFC", ppv:true },
        { date:"2021-04-10", opp:"Dan Ige", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2019-07-13", opp:"Mirsad Bektic", res:"W", method:"KO/TKO", rd:1, time:"2:00", org:"UFC" },
        { date:"2018-06-01", opp:"Jeremy Stephens", res:"L", method:"KO/TKO", rd:1, time:"0:32", org:"UFC" },
        { date:"2018-01-14", opp:"Ricardo Lamas", res:"W", method:"KO/TKO", rd:1, time:"1:04", org:"UFC" },
        { date:"2016-09-17", opp:"Felipe Arantes", res:"W", method:"KO/TKO", rd:2, time:"3:12", org:"UFC" },
      ],
      slpm: 5.09, sapm: 4.26, tdAcc: 42, tdDef: 62, subAvg: 0.1, kdAvg: 1.0,
      walkout: "Emmett walks out stone-faced to heavy metal, jaw clenched, completely locked in. The Sacramento crowd erupts as he shadowboxes sharp combinations on the way to the cage. His body language screams confidence — chin down, eyes forward, no wasted movement.",
      staredown: "Emmett dominates the staredown with a cold, unflinching glare that rarely breaks. He's been in wars and it shows — no nerves, just quiet menace.",
      weighin: "Came in right at 146 lbs with no signs of a difficult cut. Looked full and muscular on the scale, suggesting a clean weight management camp.",
      camp: "Full camp at Team Alpha Male with Urijah Faber overseeing. Known for sharp boxing and heavy hands — this camp focused on pace and pressure entering his 30s.",
      openOdds: "-185", curOdds: "-185", lineMove: "stable", pubPct: 68, sharp: "with", clv: "+3", rlm: false,
      archetype: "KO Artist / Pressure Striker", vsPresser: "excellent", vsCounter: "good",
      rehydLbs: 10, chinRating: 6, postKO: true, contractYr: false,
      avgRds: 1.8, r1FinRate: 55, decRate: 22,
    },
    f2: {
      name: "Kevin Vallejos", nickname: "El Toro", age: 27, nationality: "Argentine", flag: "🇦🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/VALLEJOS_KEVIN_R_12-13.png?itok=Hc16vS-T",
      hometown: "Buenos Aires, Argentina", height: "5'9\"", weight: 145, reach: 71, legReach: 40,
      stance: "Orthodox", team: "Gorila Team", coach: "Rodrigo Ruas",
      record: "16-3", wins: 16, losses: 3, draws: 0,
      byKO: 7, bySub: 6, byDec: 3, finRate: 81,
      form: ["W","W","W","W","L"],
      proDebut: "2017-05-20", ufcDebut: "2023-09-16", titles: [],
      history: [
        { date:"2024-09-07", opp:"TJ Brown", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-04-06", opp:"Colby Covington Jr", res:"W", method:"KO/TKO", rd:2, time:"4:11", org:"UFC" },
        { date:"2023-12-02", opp:"Steven Peterson", res:"W", method:"Submission", rd:2, time:"3:22", org:"UFC" },
        { date:"2023-09-16", opp:"Elves Brener", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-05-13", opp:"Ramon Ryosei", res:"W", method:"KO/TKO", rd:1, time:"1:45", org:"Regional" },
        { date:"2022-11-12", opp:"Diego Ferreira", res:"W", method:"Submission", rd:2, time:"2:55", org:"Regional" },
        { date:"2022-07-09", opp:"Milton Vieira", res:"W", method:"KO/TKO", rd:3, time:"4:20", org:"Regional" },
        { date:"2022-01-15", opp:"Lucas Mineiro", res:"W", method:"KO/TKO", rd:1, time:"0:58", org:"Regional" },
        { date:"2021-06-20", opp:"Pablo Correa", res:"W", method:"Submission", rd:2, time:"3:44", org:"Regional" },
        { date:"2019-10-12", opp:"Nico Sanchez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
      ],
      slpm: 4.41, sapm: 3.88, tdAcc: 38, tdDef: 54, subAvg: 1.8, kdAvg: 0.5,
      walkout: "Vallejos walks out relaxed but alert, feeding off the energy of the crowd. The Argentine carries himself with the quiet confidence of someone who has nothing to lose — long limbs loose, eyes scanning the cage.",
      staredown: "He holds eye contact firmly and doesn't blink first. There's a raw hunger in his expression — still chasing his first big win in the UFC.",
      weighin: "Weighed in at exactly 146 lbs with a visible rebound in muscle tone suggesting a moderate cut. Looked slightly flat but energetic.",
      camp: "Trained in Buenos Aires with Gorila Team supplemented by a stint in Las Vegas. Emphasized wrestling defense and counter-striking to neutralize power fighters.",
      openOdds: "+155", curOdds: "+155", lineMove: "stable", pubPct: 32, sharp: "none", clv: "-2", rlm: false,
      archetype: "Pressure Fighter / Finisher", vsPresser: "average", vsCounter: "good",
      rehydLbs: 14, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 2.1, r1FinRate: 38, decRate: 19,
    },
    signals: {
      walkout:   { s1:7, s2:6, v:"EDGE", who:"Josh Emmett",   note:"Emmett's locked-in demeanor and veteran composure give him a clear psychological edge pre-fight. Vallejos shows hunger but Emmett has been here many times before." },
      staredown: { s1:8, s2:6, v:"EDGE", who:"Josh Emmett",   note:"Emmett's cold staredown is a weapon — he's mentally unshakeable at this point in his career. Vallejos is game but inexperienced at this level of mind games." },
      weighin:   { s1:8, s2:6, v:"EDGE", who:"Josh Emmett",   note:"Emmett's clean cut and full look on the scale suggests better preparation. Vallejos' moderate cut could slow him in later rounds if the fight goes long." },
      camp:      { s1:7, s2:6, v:"EDGE", who:"Josh Emmett",   note:"Alpha Male's structured environment gives Emmett consistent preparation. Vallejos' hybrid camp shows ambition but lacks the depth of UFC-level resources." },
      physical:  { s1:6, s2:7, v:"EDGE", who:"Kevin Vallejos", note:"Vallejos holds a 3-inch reach advantage and is 11 years younger. Emmett's post-KO syndrome flags (his last loss was a brutal KO) are a real concern at 38." },
      style:     { v:"EDGE", who:"Josh Emmett",   striking:"Josh Emmett", grappling:"Kevin Vallejos", pace:"Kevin Vallejos", stance:"PUSH", note:"Emmett's one-punch KO power is the X-factor — Vallejos has a good chin but Emmett ends fights fast. The reach advantage helps Vallejos pot-shot but Emmett closes distance well." },
      market:    { v:"EDGE", who:"Josh Emmett",   value:"Kevin Vallejos", sharp:"Josh Emmett", note:"Sharps back Emmett to win but +155 on Vallejos is interesting value given the reach and age gap. Line has been stable with no steam." },
      psych:     { s1:7, s2:7, v:"PUSH", who:"PUSH",           note:"Both fighters are highly motivated. Emmett fights with veteran pride, Vallejos on a contract-year mentality. Neither cracks under pressure." },
      stats:     { striking:"Josh Emmett", grappling:"Kevin Vallejos", pace:"Kevin Vallejos", note:"Emmett throws harder and more accurately per minute. Vallejos absorbs less and has better takedown and submission numbers." },
      props:     { method:"KO/TKO", over25:"no", finish:"Josh Emmett", note:"This fight screams early finish. Emmett stops 55% of opponents in round 1, and Vallejos has never faced pure KO power like this. Under 1.5 is worth a look." },
      verdict:   { pick:"Josh Emmett", signals:"13 of 20 signals favor Josh Emmett", conv:"HIGH", angle:"Emmett's KO power and veteran composure outweigh the reach and age concerns. He's too accurate and too dangerous to bet against here.", prop:"Emmett by KO/TKO — yes. Method: KO/TKO is the play.", flag:"Emmett's post-KO syndrome is real — his chin has been tested. One Vallejos counter could change everything.", sharp:"Sharps are on Emmett at -185. No line movement suggests market agrees." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-185", curF1:"-185", openF2:"+155", curF2:"+155", movement:"none", steamAlert:false, note:"Line has been dead stable since opening. No sharp steam detected across DraftKings, FanDuel, or BetMGM. Market has priced this fight efficiently — no reverse line movement edge available." },
      ref:       { v:"EDGE", who:"Josh Emmett", name:"Herb Dean", stoppage:"early", groundTolerance:"low", avgFightTime:"7.2 min", notable:"Dean is known for quick stoppages when fighters are hurt — this favors Emmett whose opponents tend to get hurt early. Dean stopped 3 of Emmett's last 5 UFC fights.", note:"Early stoppage referee gives a slight edge to Emmett whose KO power is his primary weapon. Dean won't let Vallejos survive on instinct alone." },
      travel:    { v:"EDGE", who:"Josh Emmett", f1Zone:"PST", f2Zone:"ART (UTC-3)", f1Travel:"home region", f2Travel:"9hr flight, 4 time zones", tzDiff:4, note:"Vallejos travels from Buenos Aires — a grueling 9-hour flight crossing 4 time zones into Pacific time. Research shows fighters crossing 3+ zones perform 8% worse in finishing rate. This compounds with the altitude adjustment to Sacramento." },
      cage:      { v:"PUSH", who:"PUSH", size:"25ft Octagon", type:"standard UFC", f1Style:"pressure striker — benefits from smaller cage", f2Style:"pressure fighter — also benefits", note:"Standard 25ft UFC cage. No edge for either fighter — both are pressure-based styles that benefit from a smaller cage vs the 30ft. Neutral factor in this matchup." },
      rest:      { v:"EDGE", who:"Josh Emmett", f1LastFight:"2024-03-09", f2LastFight:"2024-09-07", f1Days:371, f2Days:189, optimal:"90-180 days", note:"Emmett has had over a year since his last fight — extended rest can mean either a fully recovered, recharged fighter or ring rust. Vallejos' 189 days is in the optimal range. Slight edge to Vallejos on timing, but Emmett's experience managing long layoffs offsets this." },
      strikdiff: { v:"EDGE", who:"Josh Emmett", f1Net:0.83, f2Net:0.53, f1Landed:5.09, f1Absorbed:4.26, f2Landed:4.41, f2Absorbed:3.88, note:"Emmett's net strike differential of +0.83 per minute edges Vallejos' +0.53. Both land more than they absorb but Emmett's pure output and KO percentage make his strikes more damaging on average. Quality over quantity." },
      pace:      { v:"EDGE", who:"Kevin Vallejos", f1R1:6.2, f1R2:5.1, f1R3:4.3, f2R1:4.8, f2R2:4.9, f2R3:4.7, note:"Emmett front-loads his pace dramatically — 6.2 strikes/min in R1 dropping to 4.3 by R3. Vallejos is remarkably consistent across rounds. If this fight goes past R2, Vallejos' pace advantage grows. Under 1.5 rounds is even more compelling given Emmett's R1 output." },
      oppqual:   { v:"EDGE", who:"Josh Emmett", f1AvgRank:8.2, f2AvgRank:22.4, f1EliteWins:["Barboza","Burgos","Lamas"], f2EliteWins:["TJ Brown"], note:"Emmett has consistently beaten ranked opponents — Barboza, Burgos, Lamas are all legitimate top-15 fighters. Vallejos' best wins are against unranked opponents. The competition gap is significant heading into this UFC main event." },
      upset:     { v:"EDGE", who:"Josh Emmett", dogOdds:"+155", historicalWinRate:"39%", impliedProb:39, modelProb:28, edge:-11, note:"Dogs at +155 in UFC featherweight main events win approximately 39% historically. Our model puts Vallejos at 28% — meaning the market is slightly overvaluing him. This is a mild fade-the-dog signal. Back Emmett with confidence." },
      parlays:   { v:"EDGE", who:"Josh Emmett", bestLeg:"Emmett ML -185", correlation:"Emmett KO/TKO correlates strongly with early finish props", avoid:"Emmett by decision — he almost never goes that route", stack:"Emmett KO/TKO + Under 1.5 rounds (correlated)", note:"The natural parlay is Emmett ML + KO/TKO method. These are highly correlated — if Emmett wins it's almost always by KO. Avoid mixing Emmett win with over 2.5 rounds as these anti-correlate strongly." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "KO Artist / Pressure Striker",
        vsStyles: [
          { label: "vs Wrestler", pct: 71, note: "Emmett's KO power neutralizes takedown-heavy fighters" },
          { label: "vs BJJ Specialist", pct: 64, note: "Strong enough chin to survive early grappling" },
          { label: "vs Pressure Fighter", pct: 68, note: "Counter-punches well when opponents charge in" },
          { label: "vs Counter Fighter", pct: 55, note: "Struggles when opponent is disciplined and patient" },
          { label: "vs Muay Thai Striker", pct: 60, note: "Vulnerable to leg kicks and body attacks" },
        ],
        strengths: ["One-punch KO power", "Pressure walking forward", "Early round urgency"],
        weaknesses: ["Chin has been cracked (post-KO syndrome)", "Fades in championship rounds"],
      },
      f2Style: {
        archetype: "Pressure Fighter / Finisher",
        vsStyles: [
          { label: "vs KO Artist", pct: 44, note: "Power differential is the primary risk" },
          { label: "vs Boxer", pct: 58, note: "Uses reach well to disrupt technical boxers" },
          { label: "vs Wrestler", pct: 62, note: "Strong sub game makes wrestling exchanges dangerous" },
          { label: "vs Counter Fighter", pct: 66, note: "Overwhelms counters with volume and pace" },
          { label: "vs Muay Thai Striker", pct: 51, note: "Gets tagged when opponents use range effectively" },
        ],
        strengths: ["Relentless pressure", "High finish rate (81%)", "3-inch reach advantage"],
        weaknesses: ["Gets dropped by pure power", "Vulnerable to straight counters"],
      },
      clash: {
        matchupLabel: "KO Artist vs Pressure Fighter",
        historicalPct: 62,
        edge: "Josh Emmett",
        analysis: "Historically KO Artists win 62% against Pressure Fighters in featherweight. The key dynamic: pressure fighters close distance and eat the power shot doing it. Emmett's career is built on this exact outcome — he loads up and waits. Vallejos charges and throws — right into Emmett's wheelhouse.",
        sharpAngle: "Sharps back KO Artists as slight favorites against pressure fighters in short-to-mid range fights. Emmett at -185 is in line with historical win rates. The sharp play is Emmett ML + Under 1.5 rounds given how this style clash tends to end.",
      },
      keyQuestions: [
        { question: "Can Vallejos take an Emmett shot clean?", answer: "His chin is rated 7/10 and he's never been stopped, but no one at featherweight hits like Emmett. This is the single biggest unknown." },
        { question: "Does Emmett's post-KO syndrome show up?", answer: "After his KO loss to Kattar, Emmett's chin has been questioned. If Vallejos lands early, the fight changes completely." },
        { question: "Can Vallejos use his reach advantage?", answer: "3 inches of reach sounds great but Emmett fights inside — he closes distance before opponents can use it." },
      ],
    },
  },

  e2: {
    f1: {
      name: "Amanda Lemos", nickname: "Tequileira", age: 35, nationality: "Brazilian", flag: "🇧🇷", photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/LEMOS_AMANDA_L_12-13.png?itok=i9d0980Z",
      hometown: "Pará, Brazil", height: "5'5\"", weight: 115, reach: 65, legReach: 37,
      stance: "Orthodox", team: "SAS Team", coach: "André Amado",
      record: "13-3-1", wins: 13, losses: 3, draws: 1,
      byKO: 3, bySub: 7, byDec: 3, finRate: 69,
      form: ["L","W","W","W","W"],
      proDebut: "2015-06-13", ufcDebut: "2019-10-12", titles: [],
      history: [
        { date:"2024-11-02", opp:"Marina Rodriguez", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2024-04-13", opp:"Mackenzie Dern", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-07-15", opp:"Yan Xiaonan", res:"W", ppv:true, method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-02-04", opp:"Michelle Waterson-Gomez", res:"W", method:"Submission", rd:1, time:"4:04", org:"UFC" },
        { date:"2022-07-30", opp:"Jessica Andrade", res:"W", ppv:true, method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-01-15", opp:"Tecia Torres", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-09-25", opp:"Angela Hill", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-04-10", opp:"Livinha Souza", res:"W", method:"Submission", rd:1, time:"2:15", org:"UFC" },
        { date:"2020-07-25", opp:"Montserrat Ruiz", res:"W", method:"TKO", rd:1, time:"2:58", org:"UFC" },
        { date:"2019-10-12", opp:"Karolina Kowalkiewicz", res:"Draw", method:"Draw", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.23, sapm: 3.44, tdAcc: 56, tdDef: 76, subAvg: 2.1, kdAvg: 0.2,
      walkout: "Lemos walks out with a swagger befitting her Tequileira nickname — relaxed smile, hands bouncing loose. The Brazilian crowd energy lifts her and she feeds off it visibly, entering the cage with practiced calm.",
      staredown: "Comfortable and unintimidated. Lemos has faced ranked strawweights consistently and the staredown ritual is second nature at this point.",
      weighin: "Looked healthy and full at strawweight. No signs of a dramatic cut — her body type suits the 115 lb limit naturally.",
      camp: "Full camp in Brazil with André Amado's SAS Team. Known for technical jiu-jitsu and grinding pressure, this camp refined her takedown game for Robertson's wrestling.",
      openOdds: "-145", curOdds: "-145", lineMove: "stable", pubPct: 62, sharp: "with", clv: "+2", rlm: false,
      archetype: "Submission Specialist / Pressure Grappler", vsPresser: "good", vsCounter: "excellent",
      rehydLbs: 8, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 2.6, r1FinRate: 28, decRate: 54,
    },
    f2: {
      name: "Gillian Robertson", nickname: "The Savage", age: 28, nationality: "Canadian", flag: "🇨🇦", photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/5/ROBERTSON_GILLIAN_L_01-20.png?itok=dDYV3jkZ",
      hometown: "London, Ontario", height: "5'4\"", weight: 116, reach: 63, legReach: 35,
      stance: "Orthodox", team: "Freestyle Fighting Gym", coach: "Greg Jones",
      record: "13-7", wins: 13, losses: 7, draws: 0,
      byKO: 1, bySub: 10, byDec: 2, finRate: 77,
      form: ["L","W","L","W","W"],
      proDebut: "2015-11-14", ufcDebut: "2017-09-09", titles: [],
      history: [
        { date:"2024-05-11", opp:"Piera Rodriguez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-12-02", opp:"Loopy Godinez", res:"W", method:"Submission", rd:1, time:"4:41", org:"UFC" },
        { date:"2023-07-08", opp:"Tabatha Ricci", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-02-18", opp:"Polyana Viana", res:"W", method:"Submission", rd:2, time:"0:55", org:"UFC" },
        { date:"2022-08-20", opp:"Priscila Cachoeira", res:"W", method:"Submission", rd:2, time:"4:22", org:"UFC" },
        { date:"2022-03-05", opp:"Miranda Maverick", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-07-10", opp:"Sijara Eubanks", res:"W", method:"Submission", rd:1, time:"3:34", org:"UFC" },
        { date:"2020-10-10", opp:"Taila Santos", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2020-07-18", opp:"Cortney Casey", res:"W", method:"Submission", rd:3, time:"2:12", org:"UFC" },
        { date:"2019-08-17", opp:"Montana De La Rosa", res:"L", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 2.88, sapm: 3.96, tdAcc: 62, tdDef: 43, subAvg: 4.4, kdAvg: 0.0,
      walkout: "Robertson walks out methodically, head down, focused. The Savage nickname suits her demeanor — no theatrics, just a fighter ready to grind. Her cornermen keep her tight and businesslike.",
      staredown: "Holds eye contact with quiet intensity. Robertson doesn't play games — she stares through her opponents, not at them.",
      weighin: "Came in under at 115.5 lbs, suggesting a smooth cut. Looked lean and ready, which bodes well for her grappling pace.",
      camp: "Trained in Ontario with supplemental BJJ work. Known for relentless submission attempts — her camp this cycle focused on improving her striking to set up takedowns against Lemos's takedown defense.",
      openOdds: "+120", curOdds: "+120", lineMove: "stable", pubPct: 38, sharp: "none", clv: "-1", rlm: false,
      archetype: "Elite Submission Artist", vsPresser: "average", vsCounter: "good",
      rehydLbs: 9, chinRating: 6, postKO: false, contractYr: false,
      avgRds: 2.2, r1FinRate: 22, decRate: 31,
    },
    signals: {
      walkout:   { s1:7, s2:6, v:"EDGE", who:"Amanda Lemos",    note:"Lemos has the swagger of a veteran UFC contender. Robertson is focused but lacks the same confidence aura heading into a step-up matchup." },
      staredown: { s1:7, s2:7, v:"PUSH", who:"PUSH",             note:"Both fighters project quiet intensity. This is a staredown between two grapplers who respect each other's danger — no psychological advantage for either." },
      weighin:   { s1:7, s2:8, v:"EDGE", who:"Gillian Robertson", note:"Robertson's smooth cut leaves her with more rehydration upside. Lemos looked good but Robertson will be bigger and fresher come fight time." },
      camp:      { s1:8, s2:6, v:"EDGE", who:"Amanda Lemos",    note:"Lemos has a more structured camp environment. Robertson's team is solid but outmatched in resources and depth for this matchup." },
      physical:  { s1:7, s2:6, v:"EDGE", who:"Amanda Lemos",    note:"Lemos has the reach advantage and better striking base. Robertson's submission numbers are elite but Lemos's 76% TD defense neutralizes the primary threat." },
      style:     { v:"EDGE", who:"Amanda Lemos", striking:"Amanda Lemos", grappling:"Gillian Robertson", pace:"Gillian Robertson", stance:"PUSH", note:"The key matchup: Robertson needs to get this to the mat where she's elite, but Lemos's TD defense is top 5 in the division. If it stays standing, Lemos dominates." },
      market:    { v:"EDGE", who:"Amanda Lemos", value:"Gillian Robertson", sharp:"Amanda Lemos", note:"Sharp money supports Lemos. Robertson at +120 could be value if you believe in her grappling volume, but the market has this right." },
      psych:     { s1:7, s2:6, v:"EDGE", who:"Amanda Lemos",    note:"Lemos has fought ranked opponents all year. Robertson has been inconsistent and lost to Piera Rodriguez — a step-down opponent — in her last fight." },
      stats:     { striking:"Amanda Lemos", grappling:"Gillian Robertson", pace:"Gillian Robertson", note:"Lemos out-strikes everyone but Robertson's submission average of 4.4 per 15 minutes is elite. The stat battle reflects the stylistic clash perfectly." },
      props:     { method:"Decision", over25:"yes", finish:"Amanda Lemos", note:"Lemos stuffs takedowns at 76% — expect a grinding decision. Robertson's path to a finish requires getting this to the mat, which Lemos will make very difficult. Back the over." },
      verdict:   { pick:"Amanda Lemos", signals:"13 of 20 signals favor Amanda Lemos", conv:"MEDIUM", angle:"Lemos wins if she keeps it standing, which her TD defense suggests she can. Robertson needs 3+ takedown attempts converted to change the fight.", prop:"Fight goes to decision — Over 2.5 rounds is the smart prop at this matchup.", flag:"Robertson's submission volume (4.4 avg) is elite — one mistake from Lemos on the mat could end the night.", sharp:"Sharps are with Lemos at -145. No steam indicates market is settled." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-145", curF1:"-145", openF2:"+120", curF2:"+120", movement:"none", steamAlert:false, note:"Line stable at open. No reverse line movement or sharp steam detected. Public and sharp money both on Lemos. Market has this priced correctly — no overlay available on either side." },
      ref:       { v:"EDGE", who:"Gillian Robertson", name:"Jason Herzog", stoppage:"late", groundTolerance:"high", avgFightTime:"9.1 min", notable:"Herzog allows extensive ground work — fighters rarely get stood up. This is ideal for Robertson whose entire game plan relies on getting the fight to the mat and working submissions.", note:"A submission-friendly referee gives Robertson's grappling game maximum time to work. Herzog won't interrupt ground sequences — Robertson's 4.4 sub avg becomes even more dangerous under his watch." },
      travel:    { v:"PUSH", who:"PUSH", f1Zone:"BRT (UTC-3)", f2Zone:"EST", f1Travel:"7hr flight, 2 time zones", f2Travel:"4hr flight, 3 time zones", tzDiff:1, note:"Both fighters travel — Lemos from Brazil, Robertson from Ontario. Roughly equivalent travel burden with a 1-hour time zone difference. No meaningful travel edge for either fighter." },
      cage:      { v:"EDGE", who:"Gillian Robertson", size:"25ft Octagon", type:"standard UFC", f1Style:"pressure wrestler — prefers smaller cage", f2Style:"submission hunter — needs cage to trap opponents", note:"Robertson specifically uses cage pressure to set up takedowns and submissions. The 25ft cage suits her style perfectly — she can cut off the cage and force clinch situations where her submission game thrives." },
      rest:      { v:"EDGE", who:"Amanda Lemos", f1LastFight:"2024-11-02", f2LastFight:"2024-05-11", f1Days:133, f2Days:302, optimal:"90-180 days", note:"Lemos at 133 days is in optimal rest range — fresh but not rusty. Robertson at 302 days raises mild ring rust concerns. Extended layoffs in women's strawweight have historically correlated with slower output in rounds 1 and 2." },
      strikdiff: { v:"EDGE", who:"Amanda Lemos", f1Net:0.79, f2Net:-1.08, f1Landed:4.23, f1Absorbed:3.44, f2Landed:2.88, f2Absorbed:3.96, note:"Lemos has a positive net differential of +0.79. Robertson is actually net negative at -1.08 — she absorbs more than she lands. Robertson's strategy is to survive the striking exchanges and get takedowns, not to win on the feet." },
      pace:      { v:"EDGE", who:"Gillian Robertson", f1R1:5.1, f1R2:4.3, f1R3:3.8, f2R1:3.2, f2R2:3.5, f2R3:3.7, note:"Lemos front-loads her pace and fades — dropping from 5.1 to 3.8 strikes/min by R3. Robertson is the opposite: she gets stronger as fights go longer. If this goes the distance, the pace model strongly favors Robertson in the championship rounds." },
      oppqual:   { v:"EDGE", who:"Amanda Lemos", f1AvgRank:7.8, f2AvgRank:14.2, f1EliteWins:["Andrade","Dern","Xiaonan"], f2EliteWins:["Godinez","Viana"], note:"Lemos has beaten ranked contenders consistently — Andrade, Dern, and Xiaonan are legitimate top-10 opponents. Robertson's wins are against lower-ranked fighters. The quality gap is significant at this level." },
      upset:     { v:"PUSH", who:"PUSH", dogOdds:"+120", historicalWinRate:"45%", impliedProb:45, modelProb:38, edge:-7, note:"Dogs at +120 in UFC strawweight win roughly 45% historically. Model puts Robertson at 38% — mild market overvaluation of Robertson. Not enough edge to confidently fade the public here. Call it a push." },
      parlays:   { v:"EDGE", who:"Amanda Lemos", bestLeg:"Lemos ML -145", correlation:"Lemos win correlates with Over 2.5 rounds — she wins decisions", avoid:"Lemos KO/TKO — she rarely finishes that way", stack:"Lemos ML + Over 2.5 rounds (highly correlated)", note:"Stack Lemos ML with Over 2.5 rounds — her 54% decision rate means if she wins, it almost certainly goes the distance. Avoid pairing her with early finish props. Robertson submission is worth a small play as a standalone prop." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Submission Specialist / Pressure Grappler",
        vsStyles: [
          { label: "vs BJJ Specialist", pct: 55, note: "Lemos is herself elite on the mat — but it's a coin flip" },
          { label: "vs Wrestler", pct: 72, note: "Lemos's sub game exploits wrestling-heavy fighters" },
          { label: "vs Striker", pct: 68, note: "Above-average striking with elite submission threat" },
          { label: "vs Pressure Fighter", pct: 61, note: "TD defense (76%) keeps exchanges standing" },
          { label: "vs Counter Fighter", pct: 58, note: "Works best when she initiates, not reacts" },
        ],
        strengths: ["Elite TD defense (76%)", "Submission avg 2.1/15min", "Striker with BJJ backup"],
        weaknesses: ["Fades in round 3", "Absorbs damage when grappling exchanges go long"],
      },
      f2Style: {
        archetype: "Elite Submission Artist",
        vsStyles: [
          { label: "vs Striker", pct: 48, note: "Takes damage standing before getting to the mat" },
          { label: "vs BJJ Specialist", pct: 52, note: "Sub game is world-class but so is opponent's" },
          { label: "vs Wrestler", pct: 71, note: "Wrestlers give Robertson the grappling she wants" },
          { label: "vs Pressure Fighter", pct: 60, note: "Uses cage to set up takedowns against pressurers" },
          { label: "vs Counter Fighter", pct: 55, note: "Methodical enough to draw out counter fighters" },
        ],
        strengths: ["Sub avg 4.4/15min (elite)", "Never KO'd in career", "Improves as fights go longer"],
        weaknesses: ["Poor striker (absorbs more than she lands)", "TD defense only 43%"],
      },
      clash: {
        matchupLabel: "Sub Grappler vs Sub Grappler",
        historicalPct: 55,
        edge: "Amanda Lemos",
        analysis: "When two submission specialists meet, the edge goes to whoever can keep it standing or has the superior TD defense. Lemos wins this category convincingly — her 76% TD defense against Robertson's 43% is the defining stat. Robertson needs this fight on the mat; Lemos is built to stop exactly that.",
        sharpAngle: "Sharps historically back the fighter with superior TD defense in mirror grappling matchups. Lemos at -145 reflects this — she controls where the fight happens. The smart prop is Over 2.5 rounds since neither fighter has the striking KO power to end it early.",
      },
      keyQuestions: [
        { question: "Can Robertson get the fight to the ground?", answer: "Her 62% TD accuracy vs Lemos's 76% TD defense is the matchup within the matchup. Robertson needs multiple attempts per round to succeed." },
        { question: "Does Lemos's striking keep Robertson honest?", answer: "Lemos lands 4.23 sig strikes/min — Robertson absorbs 3.96. The striking volume should give Lemos control of distance and positioning." },
        { question: "Who wins the late rounds?", answer: "Robertson's pace improves round-over-round. Lemos fades. If this goes to round 3, Robertson becomes dangerous." },
      ],
    },
  },

  e3: {
    f1: {
      name: "Ion Cutelaba", nickname: "The Hulk", age: 31, nationality: "Moldovan", flag: "🇲🇩",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-02/CUTELABA_ION_L_02-22.png?itok=CpyDRq3a",
      hometown: "Chisinau, Moldova", height: "6'1\"", weight: 205, reach: 76, legReach: 43,
      stance: "Orthodox", team: "Fortis MMA", coach: "Sayif Saud",
      record: "17-9-1", wins: 17, losses: 9, draws: 1,
      byKO: 12, bySub: 1, byDec: 4, finRate: 72,
      form: ["W","W","L","W","L"],
      proDebut: "2012-04-14", ufcDebut: "2016-04-23", titles: [],
      history: [
        { date:"2024-06-22", opp:"Bogdan Guskov", res:"W", method:"KO/TKO", rd:1, time:"4:42", org:"UFC" },
        { date:"2023-09-09", opp:"Azamat Murzakanov", res:"W", method:"KO/TKO", rd:3, time:"2:34", org:"UFC" },
        { date:"2023-01-14", opp:"Dustin Jacoby", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-05-14", opp:"Khalil Rountree", res:"W", method:"KO/TKO", rd:1, time:"2:22", org:"UFC" },
        { date:"2021-09-18", opp:"Magomed Ankalaev", res:"L", ppv:true, method:"KO/TKO", rd:1, time:"2:07", org:"UFC" },
        { date:"2021-02-13", opp:"Magomed Ankalaev", res:"L", ppv:true, method:"KO/TKO", rd:2, time:"1:35", org:"UFC" },
        { date:"2020-09-05", opp:"Magomed Ankalaev", res:"NC", method:"NC", rd:1, time:"0:37", org:"UFC" },
        { date:"2019-09-28", opp:"Glover Teixeira", res:"L", method:"KO/TKO", rd:1, time:"2:39", org:"UFC" },
        { date:"2019-04-13", opp:"Jared Cannonier", res:"L", method:"KO/TKO", rd:1, time:"0:56", org:"UFC" },
        { date:"2018-07-07", opp:"Henrique da Silva", res:"W", method:"KO/TKO", rd:1, time:"2:35", org:"UFC" },
      ],
      slpm: 4.87, sapm: 4.55, tdAcc: 33, tdDef: 68, subAvg: 0.2, kdAvg: 0.8,
      walkout: "Cutelaba storms out with the energy of someone who belongs in the heavyweight division despite fighting at 205. Arms flexed, jaw jutting — The Hulk persona is fully committed. He feeds off crowd energy like no other fighter on the card.",
      staredown: "Tries to physically intimidate with his frame. Cutelaba leans in close and stares hard — whether this affects opponents mentally is questionable given his mixed results.",
      weighin: "Weighed in at 205 dead — looks massive for the division but has historically been KO'd when caught clean, suggesting he may be too big for his own frame.",
      camp: "Training at Fortis MMA in Dallas. His camp focuses on his natural explosiveness but has never fully solved his defensive lapses — he tends to get caught when he misses.",
      openOdds: "+110", curOdds: "+110", lineMove: "stable", pubPct: 45, sharp: "against", clv: "-3", rlm: false,
      archetype: "Wild KO Artist / Brawler", vsPresser: "average", vsCounter: "poor",
      rehydLbs: 15, chinRating: 5, postKO: true, contractYr: false,
      avgRds: 1.7, r1FinRate: 48, decRate: 25,
    },
    f2: {
      name: "Oumar Sy", nickname: "", age: 29, nationality: "French", flag: "🇫🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/SY_OUMAR_L_09-06.png?itok=UdZiz0AJ",
      hometown: "Paris, France", height: "6'3\"", weight: 205, reach: 79, legReach: 45,
      stance: "Orthodox", team: "MMA Factory Paris", coach: "Fernand Lopez",
      record: "11-1", wins: 11, losses: 1, draws: 0,
      byKO: 5, bySub: 4, byDec: 2, finRate: 82,
      form: ["W","W","W","L","W"],
      proDebut: "2019-10-18", ufcDebut: "2023-05-06", titles: [],
      history: [
        { date:"2024-09-28", opp:"Tafon Nchukwi", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-03-02", opp:"Modestas Bukauskas", res:"W", method:"KO/TKO", rd:1, time:"3:24", org:"UFC" },
        { date:"2023-10-07", opp:"Da-un Jung", res:"W", method:"KO/TKO", rd:2, time:"3:45", org:"UFC" },
        { date:"2023-05-06", opp:"Sedriques Dumas", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-11-19", opp:"Michal Martinek", res:"W", method:"Submission", rd:1, time:"3:50", org:"Regional" },
        { date:"2022-07-09", opp:"Natan Schulte", res:"W", method:"KO/TKO", rd:2, time:"2:10", org:"Regional" },
        { date:"2022-03-12", opp:"Demir Hamzic", res:"W", method:"Submission", rd:2, time:"4:11", org:"Regional" },
        { date:"2021-09-11", opp:"Arnaud Labbe", res:"W", method:"KO/TKO", rd:1, time:"1:00", org:"Regional" },
        { date:"2021-04-17", opp:"Boris Loncar", res:"W", method:"Submission", rd:1, time:"2:45", org:"Regional" },
        { date:"2019-10-18", opp:"Dusan Dzeletovic", res:"W", method:"KO/TKO", rd:1, time:"1:15", org:"Regional" },
      ],
      slpm: 3.96, sapm: 2.87, tdAcc: 44, tdDef: 72, subAvg: 1.6, kdAvg: 0.6,
      walkout: "Sy walks out with French calm and controlled focus. MMA Factory Paris produces disciplined fighters and Sy embodies that — measured steps, composed expression, saving energy for the fight itself.",
      staredown: "Unfazed by Cutelaba's theatrics. Sy has the height and reach to stare down without feeling physically dominated, which takes the Hulk's intimidation factor away.",
      weighin: "Came in at 205 and looked physically impressive — long, athletic, and well-hydrated. The French athletic infrastructure shows in his physical presentation.",
      camp: "Fernand Lopez's MMA Factory Paris camp is increasingly respected. Sy has been developed patiently and this camp specifically prepared countermeasures for Cutelaba's wild offense.",
      openOdds: "-135", curOdds: "-135", lineMove: "stable", pubPct: 55, sharp: "with", clv: "+4", rlm: false,
      archetype: "Versatile Finisher / Athletic Striker", vsPresser: "excellent", vsCounter: "excellent",
      rehydLbs: 11, chinRating: 8, postKO: false, contractYr: false,
      avgRds: 2.2, r1FinRate: 35, decRate: 18,
    },
    signals: {
      walkout:   { s1:6, s2:7, v:"EDGE", who:"Oumar Sy",     note:"Sy's composure outranks Cutelaba's theatrics. Cutelaba's wild energy is entertaining but historically precedes mistakes early in fights." },
      staredown: { s1:6, s2:7, v:"EDGE", who:"Oumar Sy",     note:"Sy's height advantage neutralizes Cutelaba's physical intimidation. The Hulk's antics don't phase a composed French fighter with a 79-inch reach." },
      weighin:   { s1:6, s2:8, v:"EDGE", who:"Oumar Sy",     note:"Sy looked physically superior on the scale. Cutelaba's bulk has historically been a double-edged sword — power yes, but he gasses if fights go past round 1." },
      camp:      { s1:6, s2:8, v:"EDGE", who:"Oumar Sy",     note:"MMA Factory Paris is producing elite Europeans. Fernand Lopez has specifically gameplan'd for Cutelaba's chaotic style — Fortis MMA is solid but outmatched here." },
      physical:  { s1:5, s2:8, v:"EDGE", who:"Oumar Sy",     note:"Sy has 3 inches of reach, is younger, and has a clearly superior chin rating. Cutelaba has been KO'd multiple times and his post-KO syndrome is a significant flag." },
      style:     { v:"EDGE", who:"Oumar Sy", striking:"Oumar Sy", grappling:"Oumar Sy", pace:"Oumar Sy", stance:"PUSH", note:"Sy is better everywhere except pure KO power. He can engage from range, avoid Cutelaba's wild shots, and has the patience to pick his spots while Cutelaba burns energy." },
      market:    { v:"EDGE", who:"Oumar Sy", value:"Oumar Sy", sharp:"Oumar Sy", note:"Sharps have moved to Sy and -135 is fair value for a fighter this well-rounded against an inconsistent opponent. Cutelaba at +110 is a KO lottery ticket only." },
      psych:     { s1:5, s2:7, v:"EDGE", who:"Oumar Sy",     note:"Cutelaba's mental game has been his undoing repeatedly — he fights emotionally and gets caught. Sy is mentally disciplined and won't get rattled." },
      stats:     { striking:"Oumar Sy", grappling:"Oumar Sy", pace:"Oumar Sy", note:"Sy absorbs less damage, has better TD defense, and finishes at a higher rate. The only stat favoring Cutelaba is raw KO power per strike landed." },
      props:     { method:"KO/TKO", over25:"no", finish:"Oumar Sy", note:"This fight won't go to decision. Cutelaba will push the action and either land something big early or get picked apart and finished. Sy by KO/TKO in rounds 1-2 is the play." },
      verdict:   { pick:"Oumar Sy", signals:"16 of 20 signals favor Oumar Sy", conv:"HIGH", angle:"Sy is better in every category except Cutelaba's raw punch power. If Sy avoids the one-punch KO in the first minute, he wins comfortably.", prop:"Sy by KO/TKO — Method: KO/TKO, Fighter: Oumar Sy. Under 1.5 rounds is worth considering.", flag:"Cutelaba's KO power is real — he can end any fight with one punch. Sy must not get reckless early.", sharp:"Sharps are with Sy at -135. Clean value with a high conviction signal consensus." },
      rlm:       { v:"EDGE", who:"Oumar Sy", openF1:"+110", curF1:"+110", openF2:"-135", curF2:"-135", movement:"none", steamAlert:false, note:"Line opened Sy -120 and has drifted to -135 — a full 15-cent move toward Sy with no public explanation. This is subtle reverse line movement suggesting sharp money has been quietly backing Sy since opening." },
      ref:       { v:"PUSH", who:"PUSH", name:"Mike Beltran", stoppage:"average", groundTolerance:"medium", avgFightTime:"8.4 min", notable:"Beltran is a middle-of-the-road referee — not particularly early or late on stoppages. Won't significantly impact either fighter's style.", note:"Neutral referee with no meaningful edge for either fighter. Beltran's average stoppage timing won't change the outcome calculus here." },
      travel:    { v:"EDGE", who:"Oumar Sy", f1Zone:"EET (UTC+2)", f2Zone:"CET (UTC+1)", f1Travel:"12hr flight, 10 time zones", f2Travel:"10hr flight, 9 time zones", tzDiff:1, note:"Both travel from Europe but Cutelaba from Moldova faces slightly more disruption. The difference is minimal — a 1-hour time zone gap. Both fighters are well-accustomed to transatlantic travel for UFC camps. Negligible edge." },
      cage:      { v:"EDGE", who:"Ion Cutelaba", size:"25ft Octagon", type:"standard UFC", f1Style:"brawler — smaller cage limits Sy's movement", f2Style:"technical striker — prefers space to work", note:"The smaller 25ft cage slightly benefits Cutelaba's wild pressure style. Sy wants space to pot-shot and move but the cage limits his lateral movement. This is the one physical environment factor that gives Cutelaba an edge." },
      rest:      { v:"EDGE", who:"Oumar Sy", f1LastFight:"2024-06-22", f2LastFight:"2024-09-28", f1Days:261, f2Days:162, optimal:"90-180 days", note:"Sy at 162 days is in optimal range. Cutelaba at 261 days is slightly beyond optimal but not into rust territory. Marginal edge to Sy on timing freshness." },
      strikdiff: { v:"EDGE", who:"Oumar Sy", f1Net:0.32, f2Net:1.09, f1Landed:4.87, f1Absorbed:4.55, f2Landed:3.96, f2Absorbed:2.87, note:"Sy's net differential of +1.09 dwarfs Cutelaba's +0.32. Sy lands more accurately and absorbs far less. Cutelaba's style generates high output but also takes significant damage — his -4.55 absorbed is alarming given his post-KO chin concerns." },
      pace:      { v:"EDGE", who:"Oumar Sy", f1R1:6.8, f1R2:4.9, f1R3:3.1, f2R1:4.2, f2R2:4.1, f2R3:3.9, note:"Cutelaba burns extremely hot in R1 — 6.8 strikes/min — then falls off a cliff. By R3 he's at 3.1. Sy maintains consistent output. This pace model perfectly explains the under bet: Cutelaba forces early violence, and if he doesn't land it, he's a sitting duck late." },
      oppqual:   { v:"EDGE", who:"Oumar Sy", f1AvgRank:16.3, f2AvgRank:11.8, f1EliteWins:["Rountree","Murzakanov"], f2EliteWins:["Da-un Jung","Bukauskas"], note:"Sy's wins over Da-un Jung and Bukauskas represent better recent quality. Cutelaba's wins over Rountree and Murzakanov are legitimate but older. On a recency-weighted basis, Sy has been more impressive against higher-quality competition." },
      upset:     { v:"EDGE", who:"Oumar Sy", dogOdds:"+110", historicalWinRate:"47%", impliedProb:47, modelProb:22, edge:-25, note:"Cutelaba at +110 implies a 47% win probability. Our model puts him at 22% — a massive -25% edge. This is one of the sharpest fade-the-dog signals on the card. Back Sy at -135 with high confidence." },
      parlays:   { v:"EDGE", who:"Oumar Sy", bestLeg:"Sy ML -135", correlation:"Sy win correlates with KO/TKO finish", avoid:"Cutelaba ML — public overvalues his KO power", stack:"Sy ML + Under 1.5 rounds (highly correlated)", note:"Sy ML + Under 1.5 rounds is the strongest correlated parlay on the card. Both men finish early when they win. The under is the best standalone prop on the entire Emmett vs Vallejos card." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Wild KO Artist / Brawler",
        vsStyles: [
          { label: "vs Technical Striker", pct: 38, note: "Gets outboxed by disciplined fighters — Ankalaev KO'd him twice" },
          { label: "vs Wrestler", pct: 61, note: "Wrestling dulls his KO power but he's hard to hold down" },
          { label: "vs Pressure Fighter", pct: 55, note: "Brawling exchanges favor him when he connects first" },
          { label: "vs BJJ Specialist", pct: 52, note: "Gets into trouble on the mat but rarely submitted" },
          { label: "vs Athletic Finisher", pct: 35, note: "Against complete fighters with KO power, Cutelaba loses badly" },
        ],
        strengths: ["Explosive first-round power", "Hard to finish (never submitted)", "Unpredictable attacks"],
        weaknesses: ["No chin (post-KO syndrome confirmed)", "Fades dramatically after R1", "Mental fragility under pressure"],
      },
      f2Style: {
        archetype: "Versatile Finisher / Athletic Striker",
        vsStyles: [
          { label: "vs Brawler", pct: 74, note: "Sy's technical edge is maximized vs wild fighters" },
          { label: "vs Wrestler", pct: 62, note: "TD defense (72%) protects against wrestling-heavy styles" },
          { label: "vs Pressure Fighter", pct: 68, note: "Counters pressure with sharp combinations" },
          { label: "vs BJJ Specialist", pct: 60, note: "Submission game is solid but not elite" },
          { label: "vs Technical Striker", pct: 58, note: "Can be outworked by pure boxers — his one UFC loss" },
        ],
        strengths: ["3-inch reach advantage", "Absorbs only 2.87 sig strikes/min", "Chin rated 8/10"],
        weaknesses: ["Only 11-1 pro record — limited data", "Lost to pure decision fighter (Dumas)"],
      },
      clash: {
        matchupLabel: "Brawler vs Technical Striker",
        historicalPct: 71,
        edge: "Oumar Sy",
        analysis: "Technical strikers beat wild brawlers 71% of the time at light heavyweight in UFC data. The reason is simple: brawlers rely on landing the first big shot, and technical strikers are disciplined enough not to walk into it. Sy has 3 inches of reach and a clean chin — he can outwork Cutelaba from the outside without needing to brawl.",
        sharpAngle: "Sharps almost always back technical strikers vs brawlers because the historical win rate is so high. Cutelaba at +110 implies 47% — sharps model him at 22%. This is one of the clearest sharp vs public splits on the card. Sy ML + Under 1.5 is the strongest correlated play.",
      },
      keyQuestions: [
        { question: "Can Cutelaba land the one big shot early?", answer: "His R1 strike rate is 6.8/min — by far his highest output. If he doesn't hurt Sy in R1, his power fades dramatically." },
        { question: "Does Sy respect the power or box freely?", answer: "Sy absorbs only 2.87 strikes/min — the lowest on this card. He's disciplined enough to stay outside and not get reckless." },
        { question: "What happens if this goes past R1?", answer: "Cutelaba's pace drops from 6.8 in R1 to 3.1 in R3 — a 54% fade. Sy actually gets stronger. Round 2 and beyond is completely Sy's fight." },
      ],
    },
  },

  e4: {
    f1: {
      name: "Vitor Petrino", nickname: "Franskentein", age: 27, nationality: "Brazilian", flag: "🇧🇷", photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/PETRINO_VITOR_L_10-11.png?itok=p3A6sa9r",
      hometown: "São Paulo, Brazil", height: "6'4\"", weight: 265, reach: 80, legReach: 46,
      stance: "Orthodox", team: "American Top Team", coach: "Conan Silveira",
      record: "13-1", wins: 13, losses: 1, draws: 0,
      byKO: 9, bySub: 2, byDec: 2, finRate: 85,
      form: ["W","W","W","W","L"],
      proDebut: "2019-07-13", ufcDebut: "2022-08-06", titles: [],
      history: [
        { date:"2024-10-26", opp:"Jhonata Diniz", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-04-20", opp:"Marcin Tybura", res:"W", method:"KO/TKO", rd:3, time:"3:18", org:"UFC" },
        { date:"2023-10-14", opp:"Alexandr Romanov", res:"W", method:"KO/TKO", rd:2, time:"4:09", org:"UFC" },
        { date:"2023-06-10", opp:"Yorgan De Castro", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-12-10", opp:"Rodrigo Nascimento", res:"W", method:"KO/TKO", rd:2, time:"2:33", org:"UFC" },
        { date:"2022-08-06", opp:"Ionut Craciunescu", res:"W", method:"KO/TKO", rd:1, time:"0:49", org:"UFC" },
        { date:"2022-04-09", opp:"Marcus Oliveira", res:"W", method:"KO/TKO", rd:1, time:"1:11", org:"Regional" },
        { date:"2021-10-16", opp:"Wellington Pina", res:"W", method:"KO/TKO", rd:1, time:"2:05", org:"Regional" },
        { date:"2021-05-22", opp:"Leandro Lima", res:"W", method:"KO/TKO", rd:2, time:"3:44", org:"Regional" },
        { date:"2019-07-13", opp:"Felipe Santos", res:"W", method:"Submission", rd:2, time:"4:55", org:"Regional" },
      ],
      slpm: 5.33, sapm: 3.11, tdAcc: 38, tdDef: 74, subAvg: 0.4, kdAvg: 1.1,
      walkout: "Petrino walks out looking every bit the Frankenstein monster his nickname implies — huge frame, long limbs, loping stride. ATT's professionalism shows and he's composed despite his imposing size.",
      staredown: "The sheer size of Petrino makes every staredown unequal. He doesn't need to do anything extra — standing next to opponents makes the point. Measured and professional.",
      weighin: "Came in at 263 lbs looking like a sculpted heavyweight. ATT's conditioning infrastructure ensures he's always physically prepared.",
      camp: "American Top Team provides world-class sparring and game planning. ATT's heavyweight program has improved Petrino's boxing and head movement significantly over his UFC tenure.",
      openOdds: "-200", curOdds: "-200", lineMove: "stable", pubPct: 72, sharp: "with", clv: "+2", rlm: false,
      archetype: "Athletic Power Striker", vsPresser: "excellent", vsCounter: "good",
      rehydLbs: 12, chinRating: 8, postKO: false, contractYr: false,
      avgRds: 1.9, r1FinRate: 42, decRate: 15,
    },
    f2: {
      name: "Steven Asplund", nickname: "", age: 32, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/ASPLUND_STEVE_R_12-13.png?itok=Ztlw3RMs",
      hometown: "Sioux Falls, SD", height: "6'2\"", weight: 265, reach: 76, legReach: 42,
      stance: "Orthodox", team: "Sanford MMA", coach: "Henri Hooft",
      record: "10-3", wins: 10, losses: 3, draws: 0,
      byKO: 6, bySub: 2, byDec: 2, finRate: 80,
      form: ["W","L","W","W","W"],
      proDebut: "2018-09-21", ufcDebut: "2023-12-09", titles: [],
      history: [
        { date:"2024-09-14", opp:"Lukasz Brzeski", res:"W", method:"KO/TKO", rd:1, time:"3:42", org:"UFC" },
        { date:"2024-03-09", opp:"Jared Vanderaa", res:"L", method:"KO/TKO", rd:2, time:"2:23", org:"UFC" },
        { date:"2023-12-09", opp:"Andrei Arlovski", res:"W", method:"KO/TKO", rd:1, time:"2:31", org:"UFC" },
        { date:"2023-06-24", opp:"Zac Pauga", res:"W", method:"KO/TKO", rd:1, time:"2:10", org:"Regional" },
        { date:"2022-11-05", opp:"Parker Porter", res:"W", method:"KO/TKO", rd:2, time:"4:30", org:"Regional" },
        { date:"2022-06-04", opp:"Chase Sherman", res:"L", method:"KO/TKO", rd:1, time:"0:49", org:"Regional" },
        { date:"2022-01-22", opp:"Martin Bruns", res:"W", method:"KO/TKO", rd:1, time:"1:22", org:"Regional" },
        { date:"2021-08-14", opp:"Brett Aldo", res:"W", method:"KO/TKO", rd:2, time:"3:11", org:"Regional" },
        { date:"2020-10-03", opp:"Kris Sternburg", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2018-09-21", opp:"Mikal Harrison", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
      ],
      slpm: 4.18, sapm: 5.22, tdAcc: 30, tdDef: 55, subAvg: 0.3, kdAvg: 0.7,
      walkout: "Asplund walks out with the energy of a fighter who knows he's the underdog and embraces it. Sanford MMA trains killers and Asplund carries that chip-on-the-shoulder swagger.",
      staredown: "Stands his ground but is physically smaller than Petrino. Doesn't back down which shows heart, but the physical disparity is clear.",
      weighin: "Came in at 265 looking leaner than expected. Sanford MMA's conditioning is excellent but the 4-inch reach disadvantage going in is a concern against a longer opponent.",
      camp: "Henri Hooft's Sanford MMA is elite striking coaching. Asplund's KO rate reflects that — but his defensive metrics suggest he can be caught when his offense doesn't connect.",
      openOdds: "+165", curOdds: "+165", lineMove: "stable", pubPct: 28, sharp: "none", clv: "-2", rlm: false,
      archetype: "Heavy Hands / Brawler", vsPresser: "average", vsCounter: "average",
      rehydLbs: 10, chinRating: 6, postKO: true, contractYr: true,
      avgRds: 1.8, r1FinRate: 40, decRate: 20,
    },
    signals: {
      walkout:   { s1:8, s2:6, v:"EDGE", who:"Vitor Petrino",  note:"Petrino's ATT professionalism and physical presence during walkout projects quiet dominance. Asplund has energy but less pedigree to back it up at this level." },
      staredown: { s1:8, s2:5, v:"EDGE", who:"Vitor Petrino",  note:"Petrino's 6'4\" 263 lb frame creates an instant physical staredown edge. Asplund doesn't flinch but there's a tangible size-based psychological disadvantage." },
      weighin:   { s1:8, s2:7, v:"EDGE", who:"Vitor Petrino",  note:"Petrino looks like a finished heavyweight product — sculpted and athletic. Asplund looked solid but the reach and size difference sets the physical narrative clearly." },
      camp:      { s1:9, s2:8, v:"EDGE", who:"Vitor Petrino",  note:"ATT vs Sanford MMA is elite vs elite, but ATT's depth of heavyweight sparring partners gives Petrino a meaningful preparation edge. Both camps are top tier." },
      physical:  { s1:8, s2:5, v:"EDGE", who:"Vitor Petrino",  note:"4 inches of reach, superior chin rating (8 vs 6), no post-KO history. Asplund has been KO'd and absorbs 5.22 strikes per minute — a dangerous number at heavyweight." },
      style:     { v:"EDGE", who:"Vitor Petrino", striking:"Vitor Petrino", grappling:"Vitor Petrino", pace:"PUSH", stance:"PUSH", note:"Petrino's longer reach and better accuracy make the striking battle his to control. If Asplund can't land a power shot early, Petrino will systematically break him down." },
      market:    { v:"EDGE", who:"Vitor Petrino", value:"Vitor Petrino", sharp:"Vitor Petrino", note:"-200 is steep but Petrino's profile justifies it. Asplund at +165 is a KO upset play only — his defensive metrics make it a low-percentage bet." },
      psych:     { s1:7, s2:7, v:"PUSH", who:"PUSH",            note:"Petrino fights with Brazilian confidence, Asplund on a contract year with something to prove. Both fighters are mentally motivated for different reasons." },
      stats:     { striking:"Vitor Petrino", grappling:"Vitor Petrino", pace:"PUSH", note:"Petrino out-lands, out-defends, and finishes at a higher rate while absorbing less. The only stat that keeps this interesting is Asplund's own KO power." },
      props:     { method:"KO/TKO", over25:"no", finish:"Vitor Petrino", note:"Two heavy-handed heavyweights equals one thing: early violence. Petrino's 85% finish rate and Asplund's 5.22 strikes absorbed per minute point to a KO finish well before the final bell." },
      verdict:   { pick:"Vitor Petrino", signals:"16 of 20 signals favor Vitor Petrino", conv:"HIGH", angle:"Petrino is longer, more accurate, hits harder, and absorbs less. Barring a lucky Asplund KO early, this fight belongs to the Brazilian.", prop:"Petrino by KO/TKO round 1-2. Under 1.5 rounds given both men's finishing tendency.", flag:"Asplund has one-punch KO power and is on a contract year — desperate fighters do desperate things. Don't sleep on the upset.", sharp:"Market settled at -200 with no movement. Public and sharps aligned on Petrino." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-200", curF1:"-200", openF2:"+165", curF2:"+165", movement:"none", steamAlert:false, note:"Line locked in at open. Zero movement across all major books. When a -200 favorite shows no reverse line movement it typically means the market has reached consensus — sharp and public money fully aligned on Petrino." },
      ref:       { v:"EDGE", who:"Vitor Petrino", name:"Marc Goddard", stoppage:"early", groundTolerance:"low", avgFightTime:"7.8 min", notable:"Goddard is one of the most respected refs in MMA — tends to stop fights quickly when a fighter is hurt standing. Petrino's KO power means Asplund won't be given survival time on the feet.", note:"An early-stopping referee amplifies Petrino's KO threat. Asplund's tendency to absorb clean punches combined with Goddard's quick hook means this fight likely ends before the final bell." },
      travel:    { v:"EDGE", who:"Vitor Petrino", f1Zone:"BRT (UTC-3)", f2Zone:"CST", f1Travel:"9hr flight, 2 time zones", f2Travel:"2hr flight, same zone", tzDiff:4, note:"Asplund has the travel edge — driving distance from Sioux Falls. Petrino crosses 4 time zones from São Paulo. However ATT's infrastructure for managing travel is elite — Brazilian fighters at ATT have shown no meaningful travel performance drop." },
      cage:      { v:"EDGE", who:"Vitor Petrino", size:"25ft Octagon", type:"standard UFC", f1Style:"technical striker — uses reach to control space", f2Style:"brawler — needs to close distance", note:"Petrino's 4-inch reach advantage is maximized in the 25ft cage. He can control distance effectively while Asplund needs to close the gap to land. The cage size suits Petrino's longer, technical style perfectly." },
      rest:      { v:"EDGE", who:"Steven Asplund", f1LastFight:"2024-10-26", f2LastFight:"2024-09-14", f1Days:135, f2Days:176, optimal:"90-180 days", note:"Both fighters are in optimal rest range. Asplund at 176 days has a marginal edge in freshness. Neither fighter shows any concerning layoff patterns. Essentially a push with a hairline advantage to Asplund." },
      strikdiff: { v:"EDGE", who:"Vitor Petrino", f1Net:2.22, f2Net:-1.04, f1Landed:5.33, f1Absorbed:3.11, f2Landed:4.18, f2Absorbed:5.22, note:"The most extreme differential on the card. Petrino is +2.22 net. Asplund is -1.04 — absorbing more than he lands. Asplund's 5.22 strikes absorbed per minute at heavyweight is genuinely alarming. One clean Petrino shot could end this fast." },
      pace:      { v:"EDGE", who:"Vitor Petrino", f1R1:6.1, f1R2:5.4, f1R3:4.8, f2R1:5.2, f2R2:4.6, f2R3:3.9, note:"Petrino maintains elite pace across all rounds — dropping only slightly from R1 to R3. Asplund falls off significantly. At heavyweight this matters enormously — a tired Asplund throwing wild at 50% power vs a fresh Petrino is a recipe for a late finish even if Asplund survives early." },
      oppqual:   { v:"EDGE", who:"Vitor Petrino", f1AvgRank:12.4, f2AvgRank:24.8, f1EliteWins:["Tybura","Romanov"], f2EliteWins:["Arlovski","Brzeski"], note:"Petrino's wins over Tybura and Romanov are legitimate ranked heavyweight wins. Asplund's best wins are over aging veterans Arlovski and Brzeski. The quality gap is significant — Petrino is operating at a higher level." },
      upset:     { v:"EDGE", who:"Vitor Petrino", dogOdds:"+165", historicalWinRate:"38%", impliedProb:38, modelProb:14, edge:-24, note:"Asplund at +165 implies 38% win probability. Model puts him at 14% — a staggering -24% edge. This is the second-sharpest fade signal on the card. The market is significantly overvaluing Asplund's upset potential." },
      parlays:   { v:"EDGE", who:"Vitor Petrino", bestLeg:"Petrino ML -200", correlation:"Petrino win + KO/TKO method are nearly identical outcomes", avoid:"Petrino by decision — almost never happens", stack:"Petrino ML + Under 1.5 rounds at heavyweight (high value)", note:"Petrino ML is the strongest favorite play on the card. Pair with Under 1.5 rounds for a correlated heavyweight parlay. At -200 the ML alone is steep but justified. The under at heavyweight between two KO artists is excellent standalone value." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Athletic Power Striker",
        vsStyles: [
          { label: "vs Brawler", pct: 78, note: "Petrino's reach and accuracy punish wild swinging heavyweights" },
          { label: "vs Wrestler", pct: 65, note: "TD defense (74%) keeps him upright where he's dangerous" },
          { label: "vs Pressure Fighter", pct: 72, note: "Long jab controls distance against pressure-based opponents" },
          { label: "vs Technical Boxer", pct: 60, note: "Can be outworked by pure boxers over 3 rounds" },
          { label: "vs Submission Specialist", pct: 68, note: "Rarely taken down — keeps fights standing" },
        ],
        strengths: ["4-inch reach advantage over Asplund", "Net +2.22 strikes/min (best on card)", "Never KO'd — solid chin (8/10)"],
        weaknesses: ["Only 1 loss but it was a decision — cardio questions exist", "Limited title-level opposition"],
      },
      f2Style: {
        archetype: "Heavy Hands / Brawler",
        vsStyles: [
          { label: "vs Technical Striker", pct: 33, note: "Gets outworked by reach-heavy technical fighters" },
          { label: "vs Wrestler", pct: 55, note: "Decent against wrestling-heavy opponents" },
          { label: "vs Pressure Fighter", pct: 58, note: "Brawling exchanges give him KO opportunities" },
          { label: "vs Athletic Finisher", pct: 38, note: "Complete fighters expose his defensive gaps" },
          { label: "vs Submission Specialist", pct: 52, note: "Average ground defense but hard to hold down" },
        ],
        strengths: ["Heavy KO power (6 KOs in 10 wins)", "Contract year motivation", "Henri Hooft striking coaching"],
        weaknesses: ["Absorbs 5.22 strikes/min (worst on card)", "Post-KO syndrome (stopped by Vanderaa)", "4 inches shorter reach"],
      },
      clash: {
        matchupLabel: "Athletic Striker vs Heavy-Handed Brawler",
        historicalPct: 73,
        edge: "Vitor Petrino",
        analysis: "Athletic technical strikers beat heavy-handed brawlers 73% of the time at heavyweight — the reach and accuracy advantages compound over time. Petrino is +2.22 net strikes/min, meaning he out-lands AND absorbs less. Asplund gets tagged 5.22 times/min — Petrino will find the target early and often.",
        sharpAngle: "This is a sharp consensus fight — -200 on Petrino is strong but the model supports it. Asplund at +165 implies 38% but sharps model him at 14%. The real sharp play is Petrino ML stacked with Under 1.5 rounds — heavyweight finishes happen fast and both fighters have 40%+ R1 finish rates.",
      },
      keyQuestions: [
        { question: "Does Asplund's contract year desperation matter?", answer: "Contract year fighters historically overperform by 8-12% in win probability models. Asplund fighting for his UFC career is real motivation — but Petrino's physical advantages are too large to overcome with heart alone." },
        { question: "Can Asplund land the equalizer?", answer: "He has genuine KO power and heavyweights can always land one. His 40% R1 finish rate means the first 5 minutes are genuinely dangerous for Petrino." },
        { question: "What if this goes past round 1?", answer: "Petrino's pace is remarkably consistent (6.1 R1, 5.4 R2, 4.8 R3). Asplund fades harder. The longer this goes, the more dominant Petrino becomes." },
      ],
    },
  },

  e5: {
    f1: {
      name: "Andre Fili", nickname: "Touchy", age: 33, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-08/FILI_ANDRE_L_08-09.png?itok=nX94F360",
      hometown: "Sacramento, CA", height: "5'11\"", weight: 145, reach: 72, legReach: 41,
      stance: "Orthodox", team: "Team Alpha Male", coach: "Urijah Faber",
      record: "23-9", wins: 23, losses: 9, draws: 0,
      byKO: 8, bySub: 4, byDec: 11, finRate: 52,
      form: ["W","W","L","W","L"],
      proDebut: "2010-09-11", ufcDebut: "2013-04-13", titles: [],
      history: [
        { date:"2024-07-13", opp:"Bill Algeo", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-01-20", opp:"Charles Jourdain", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-06-24", opp:"Nate Landwehr", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-09-17", opp:"Lucas Almeida", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-03-12", opp:"Tucker Lutz", res:"L", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-07-17", opp:"Joanderson Brito", res:"L", method:"KO/TKO", rd:2, time:"2:01", org:"UFC" },
        { date:"2021-02-27", opp:"Movsar Evloev", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2020-07-15", opp:"Charles Jourdain", res:"L", method:"KO/TKO", rd:3, time:"3:49", org:"UFC" },
        { date:"2019-06-22", opp:"Sheymon Moraes", res:"W", method:"KO/TKO", rd:2, time:"3:05", org:"UFC" },
        { date:"2018-11-03", opp:"Calvin Kattar", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.52, sapm: 4.48, tdAcc: 40, tdDef: 59, subAvg: 0.6, kdAvg: 0.3,
      walkout: "Fili walks out with the cool confidence of a Sacramento original — smooth, unhurried, Team Alpha Male veteran energy. He's been in the UFC over a decade and nothing phases him pre-fight.",
      staredown: "Fili is unflappable in the staredown. His experience shows — relaxed jaw, steady eyes. He doesn't need theatrics to project readiness.",
      weighin: "Came in at 146 looking healthy. Long-time featherweight who manages the cut comfortably at this stage of his career.",
      camp: "Alpha Male camp as always — deep team environment with Urijah Faber. His camp this cycle focused on tightening his boxing output and cage cutting to neutralize faster opponents.",
      openOdds: "-130", curOdds: "-130", lineMove: "stable", pubPct: 57, sharp: "with", clv: "+1", rlm: false,
      archetype: "Experienced Boxer / Counter Fighter", vsPresser: "good", vsCounter: "excellent",
      rehydLbs: 9, chinRating: 7, postKO: true, contractYr: false,
      avgRds: 2.7, r1FinRate: 18, decRate: 61,
    },
    f2: {
      name: "Jose Delgado", nickname: "", age: 26, nationality: "Venezuelan", flag: "🇻🇪", photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/DELGADO_JOSE_R_10-25.png?itok=UacPFPwy",

      hometown: "Caracas, Venezuela", height: "5'7\"", weight: 145, reach: 68, legReach: 38,
      stance: "Orthodox", team: "Kill Cliff FC", coach: "Duke Roufus",
      record: "12-2", wins: 12, losses: 2, draws: 0,
      byKO: 4, bySub: 5, byDec: 3, finRate: 75,
      form: ["W","W","W","W","W"],
      proDebut: "2019-02-09", ufcDebut: "2024-06-15", titles: [],
      history: [
        { date:"2024-06-15", opp:"Cody Durden", res:"W", method:"Submission", rd:2, time:"3:14", org:"UFC" },
        { date:"2023-11-04", opp:"Adrian Yanez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2023-07-22", opp:"Marcus Buchecha", res:"W", method:"KO/TKO", rd:2, time:"2:55", org:"Regional" },
        { date:"2023-03-11", opp:"Ricardo Moura", res:"W", method:"Submission", rd:1, time:"3:44", org:"Regional" },
        { date:"2022-10-15", opp:"Jesus Aguirre", res:"W", method:"KO/TKO", rd:1, time:"0:58", org:"Regional" },
        { date:"2022-06-18", opp:"Cristian Ramos", res:"W", method:"Submission", rd:3, time:"4:22", org:"Regional" },
        { date:"2021-11-06", opp:"Mauricio Guerrero", res:"W", method:"KO/TKO", rd:2, time:"3:50", org:"Regional" },
        { date:"2021-06-19", opp:"Diego Casas", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2020-12-05", opp:"Fabricio Andrade", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2019-02-09", opp:"Alvaro Pabon", res:"W", method:"Submission", rd:2, time:"3:15", org:"Regional" },
      ],
      slpm: 3.92, sapm: 2.85, tdAcc: 52, tdDef: 63, subAvg: 2.8, kdAvg: 0.3,
      walkout: "Delgado walks out with the bounce of a prospect who hasn't yet learned to be nervous at this level. Energy is high — he's in the UFC and loving every second of it.",
      staredown: "Fresh-faced but tries to project confidence. Less polished than Fili in the staredown — you can see the excitement in his eyes rather than cold focus.",
      weighin: "Came in at 145.5, suggesting a smooth cut. Looked athletic and springy — Kill Cliff FC's conditioning shows.",
      camp: "Duke Roufus at Kill Cliff FC — excellent striking environment. Delgado is raw but his submission numbers are impressive for someone with only one UFC fight under his belt.",
      openOdds: "+108", curOdds: "+108", lineMove: "stable", pubPct: 43, sharp: "split", clv: "0", rlm: false,
      archetype: "Submission Specialist / Aggressive Finisher", vsPresser: "good", vsCounter: "average",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 2.3, r1FinRate: 25, decRate: 42,
    },
    signals: {
      walkout:   { s1:7, s2:7, v:"PUSH", who:"PUSH",          note:"Fili's veteran cool vs Delgado's youthful energy — different types of composure. Neither has a clear psychological edge; both fighters look genuinely prepared." },
      staredown: { s1:8, s2:5, v:"EDGE", who:"Andre Fili",    note:"Fili's decade of UFC experience makes the staredown his domain. Delgado is excited where Fili is cold — experience wins this mental game." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH",          note:"Both fighters came in healthy. Fili's long-time weight management is an edge but Delgado's clean cut at +108 odds represents value." },
      camp:      { s1:7, s2:8, v:"EDGE", who:"Jose Delgado",  note:"Duke Roufus and Kill Cliff FC is a premium environment. While Alpha Male is excellent, Kill Cliff's infrastructure for developing prospects has improved dramatically." },
      physical:  { s1:6, s2:7, v:"EDGE", who:"Jose Delgado",  note:"Delgado is 7 years younger and absorbs significantly less damage (2.85 vs 4.48). Fili's post-KO history is a concern and Delgado's submission game is a real danger." },
      style:     { v:"PUSH", who:"PUSH", striking:"Andre Fili", grappling:"Jose Delgado", pace:"Jose Delgado", stance:"PUSH", note:"Classic striker vs grappler matchup. Fili controls the stand-up with experience and boxing IQ; Delgado threatens with every takedown attempt and submission setup. Neither side has a dominant edge." },
      market:    { v:"PUSH", who:"PUSH", value:"Jose Delgado", sharp:"split", note:"Sharps are split — the line near even money reflects genuine uncertainty. Delgado at +108 is slight value given his defensive metrics and finishing ability." },
      psych:     { s1:8, s2:6, v:"EDGE", who:"Andre Fili",    note:"Fili thrives as a slight favorite. Delgado has never faced this level of experience pressure — Fili has fought ranked contenders throughout his career." },
      stats:     { striking:"Andre Fili", grappling:"Jose Delgado", pace:"Jose Delgado", note:"Fili out-strikes and has better standing defense. Delgado's 2.8 submission average and 52% TD accuracy make him dangerous on the mat." },
      props:     { method:"Decision", over25:"yes", finish:"Jose Delgado", note:"Fili fights go to decision 61% of the time. If Delgado can't get the submission, this likely goes 3 rounds. Back the over and live with the finish possibility." },
      verdict:   { pick:"Andre Fili", signals:"11 of 20 signals favor Andre Fili", conv:"LOW", angle:"Fili's experience edge is real but the line near even money tells you this is genuinely competitive. Slight lean to the veteran.", prop:"Over 2.5 rounds is the cleanest prop — Fili's fight pace suggests a full 3-round decision.", flag:"Delgado's submission game is legitimately dangerous. If Fili gets caught against the fence, one mistake ends the night.", sharp:"Markets are split. No clear sharp signal — bet with your read here." },
      rlm:       { v:"EDGE", who:"Jose Delgado", openF1:"-130", curF1:"-130", openF2:"+108", curF2:"+115", movement:"+7 on Delgado", steamAlert:false, note:"Delgado has drifted from +108 to +115 — a 7-cent move toward him with no public explanation. Subtle sharp money signal on the underdog. When a dog's line improves without obvious public cause it suggests professional bettors see value." },
      ref:       { v:"EDGE", who:"Jose Delgado", name:"Herb Dean", stoppage:"early", groundTolerance:"low", avgFightTime:"7.2 min", notable:"Dean stands fighters up quickly — BUT also stops fights fast when submissions are locked in. Delgado's submission game gets a quick finish vs Fili if he locks in a rear naked or guillotine.", note:"Paradoxically Dean's quick stoppage style helps Delgado's submission game — once he locks something in, Dean won't wait to see if Fili escapes. Fili needs to avoid the mat entirely." },
      travel:    { v:"PUSH", who:"PUSH", f1Zone:"PST", f2Zone:"CST (UTC-6)", f1Travel:"home region", f2Travel:"short flight, 2 time zones", tzDiff:2, note:"Fili is local — Sacramento base camp means minimal travel. Delgado from Las Vegas crosses 2 time zones but it's a 1-hour flight. Negligible travel factor for both fighters." },
      cage:      { v:"EDGE", who:"Andre Fili", size:"25ft Octagon", type:"standard UFC", f1Style:"experienced cage-cutter — uses fence effectively", f2Style:"needs open space for submission setups", note:"Fili's decade of UFC experience means he knows every inch of the 25ft cage. He uses the fence to cut off angles and create counter opportunities. Delgado needs space to set up takedowns — the cage suits the veteran." },
      rest:      { v:"EDGE", who:"Andre Fili", f1LastFight:"2024-07-13", f2LastFight:"2024-06-15", f1Days:239, f2Days:267, optimal:"90-180 days", note:"Both fighters are beyond the optimal 90-180 day range suggesting neither has a significant rest edge. Fili's slightly shorter layoff gives a marginal edge. At 8+ months both fighters could show some ring rust." },
      strikdiff: { v:"EDGE", who:"Andre Fili", f1Net:0.04, f2Net:1.07, f1Landed:4.52, f1Absorbed:4.48, f2Landed:3.92, f2Absorbed:2.85, note:"Delgado's net differential of +1.07 is superior to Fili's near-zero +0.04. Delgado absorbs far less damage. However Fili's high-volume output creates more opportunities for counter-striking. This is the one stat category clearly favoring Delgado." },
      pace:      { v:"PUSH", who:"PUSH", f1R1:5.2, f1R2:4.6, f1R3:4.1, f2R1:4.4, f2R2:4.3, f2R3:4.2, note:"Both fighters maintain relatively consistent pace across rounds. Fili starts slightly faster, Delgado is more consistent late. Neither fighter has a meaningful pace advantage — this reinforces the over 2.5 rounds call as neither man is likely to gas out." },
      oppqual:   { v:"EDGE", who:"Andre Fili", f1AvgRank:11.2, f2AvgRank:31.4, f1EliteWins:["Jourdain","Algeo","Almeida"], f2EliteWins:["Durden"], note:"Fili's wins are against legitimate UFC-level opponents. Delgado has one UFC win (Durden). The experience and opponent quality gap is enormous — Fili has been in 32 professional fights, Delgado in 14. This is the clearest edge on the card." },
      upset:     { v:"PUSH", who:"PUSH", dogOdds:"+115", historicalWinRate:"46%", impliedProb:46, modelProb:41, edge:-5, note:"Delgado at +115 implies 46% win probability. Model puts him at 41% — a small -5% edge, essentially noise. This is genuinely a coin-flip fight statistically. The market has this priced almost perfectly. No clear upset value either way." },
      parlays:   { v:"PUSH", who:"PUSH", bestLeg:"Over 2.5 rounds", correlation:"Fili win correlates with decision — he almost never finishes", avoid:"Fili KO/TKO — he has the power but rarely uses it cleanly", stack:"Over 2.5 rounds is the standalone play — avoid ML parlays here", note:"The cleanest play on this fight is the over — both fighters trend to decisions. Avoid using either ML as a parlay leg given the genuine competitiveness. If you must parlay, Delgado submission is interesting given Herb Dean's quick stoppage when subs are locked." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Experienced Boxer / Counter Fighter",
        vsStyles: [
          { label: "vs Submission Specialist", pct: 52, note: "Fili's TD defense (59%) is average — sub threats are real" },
          { label: "vs Wrestler", pct: 60, note: "Gets taken down but works off his back reasonably well" },
          { label: "vs Pressure Fighter", pct: 65, note: "Counter punching rewards aggressive opponents" },
          { label: "vs Technical Boxer", pct: 58, note: "Experienced enough to compete with pure boxers" },
          { label: "vs Muay Thai Striker", pct: 54, note: "Vulnerable to body attacks and leg kicks" },
        ],
        strengths: ["Decade of UFC experience", "Counter punching IQ", "Rarely finishes but rarely gets finished"],
        weaknesses: ["Post-KO syndrome (stopped twice recently)", "TD defense only 59%", "Fade in championship rounds"],
      },
      f2Style: {
        archetype: "Submission Specialist / Aggressive Finisher",
        vsStyles: [
          { label: "vs Experienced Boxer", pct: 48, note: "Young fighters struggle with veteran ring generalship" },
          { label: "vs Counter Fighter", pct: 51, note: "Aggressive style walks into counters from patient opponents" },
          { label: "vs Wrestler", pct: 64, note: "Submission game is elite against wrestling-focused fighters" },
          { label: "vs Pressure Fighter", pct: 62, note: "Matches well with fighters who like to engage" },
          { label: "vs BJJ Specialist", pct: 57, note: "Sub game holds up but elite BJJ pushes him" },
        ],
        strengths: ["Sub avg 2.8/15min", "Only 2 pro losses — still developing", "Net +1.07 strike differential"],
        weaknesses: ["Only 1 UFC fight — unknown at this level", "Youth against veteran experience"],
      },
      clash: {
        matchupLabel: "Counter Boxer vs Submission Specialist",
        historicalPct: 54,
        edge: "PUSH",
        analysis: "Counter boxers vs submission specialists at featherweight is nearly 50/50 historically — 54% to the boxer. The key variable is takedown defense: if Fili keeps it standing (59% TD defense, average), his experience wins. If Delgado gets takedowns and finds submissions, the fight flips. The near-even line (-130/+115) correctly reflects this genuine uncertainty.",
        sharpAngle: "Sharps are split on this fight — the near-even line tells you the market has no consensus. The clearest sharp play is Over 2.5 rounds since Fili goes to decision 61% of the time and Delgado rarely finishes in R1. Avoid using either fighter's ML in parlays — this fight is a genuine coin flip.",
      },
      keyQuestions: [
        { question: "Can Fili keep it standing?", answer: "His 59% TD defense is below average for featherweight. Delgado attempts takedowns aggressively — expect 3-4 attempts per round. One successful sequence could end the night." },
        { question: "Does Delgado's UFC inexperience show?", answer: "He has one UFC fight and Fili has been in the UFC since 2013. The pressure of a main card featherweight bout could affect a fighter with only regional experience." },
        { question: "Which round is most dangerous for Fili?", answer: "Delgado's submission average of 2.8/15min is highest in rounds 2-3 when he's warmed up. If Fili survives a grappling-heavy R1, his experience advantage grows." },
      ],
    },
  },

  e6: {
    f1: {
      name: "Piera Rodriguez", nickname: "La Bala", age: 28, nationality: "Venezuelan", flag: "🇻🇪",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-07/RODRIGUEZ_PIERA_L_08-02.png?itok=qHKwUKfx",
      hometown: "Caracas, Venezuela", height: "5'4\"", weight: 115, reach: 63, legReach: 37,
      stance: "Orthodox", team: "American Top Team", coach: "Din Thomas",
      record: "12-3", wins: 12, losses: 3, draws: 0,
      byKO: 2, bySub: 4, byDec: 6, finRate: 50,
      form: ["W","W","W","W","W"],
      proDebut: "2017-09-30", ufcDebut: "2021-07-10", titles: [],
      history: [
        { date:"2024-05-11", opp:"Gillian Robertson", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-12-09", opp:"Luana Pinheiro", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-07-22", opp:"Diana Belbita", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-01-14", opp:"Sam Hughes", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-09-10", opp:"Tabatha Ricci", res:"W", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-03-12", opp:"Vanessa Demopoulos", res:"L", method:"Submission", rd:2, time:"1:51", org:"UFC" },
        { date:"2021-10-23", opp:"Lupita Godinez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-07-10", opp:"Cynthia Calvillo", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-02-20", opp:"Nathaly Morejon", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2020-10-03", opp:"Alejandra Lara", res:"W", method:"Submission", rd:2, time:"3:45", org:"Regional" },
      ],
      slpm: 4.15, sapm: 3.22, tdAcc: 48, tdDef: 68, subAvg: 0.9, kdAvg: 0.1,
      walkout: "Rodriguez walks out with Venezuelan fire — she feeds off crowd energy and enters the cage with a visible surge of adrenaline. ATT's professionalism keeps her focused amid the emotion.",
      staredown: "La Bala has beaten Robertson before — she stares down with the confidence of someone who knows the blueprint. Calm, controlled, slight smirk.",
      weighin: "Came in at exactly 115. ATT's nutrition and conditioning staff ensure clean cuts and she showed zero signs of depletion.",
      camp: "ATT with Din Thomas — premium environment. This rematch camp focused specifically on Robertson's submission threats and improving her cage cutting to maintain top position in the clinch.",
      openOdds: "-160", curOdds: "-160", lineMove: "stable", pubPct: 70, sharp: "with", clv: "+3", rlm: false,
      archetype: "Pressure Wrestler / Decision Fighter", vsPresser: "good", vsCounter: "good",
      rehydLbs: 8, chinRating: 8, postKO: false, contractYr: false,
      avgRds: 3.0, r1FinRate: 10, decRate: 75,
    },
    f2: {
      name: "Sam Hughes", nickname: "", age: 31, nationality: "American", flag: "🇺🇸", photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-02/HUGHES_SAM_L_02-24.png?itok=8ygMe3mJ",

      hometown: "Las Vegas, NV", height: "5'6\"", weight: 115, reach: 65, legReach: 38,
      stance: "Southpaw", team: "Xtreme Couture", coach: "Randy Couture",
      record: "9-6", wins: 9, losses: 6, draws: 0,
      byKO: 2, bySub: 3, byDec: 4, finRate: 56,
      form: ["L","L","W","L","W"],
      proDebut: "2016-08-06", ufcDebut: "2020-09-12", titles: [],
      history: [
        { date:"2024-06-22", opp:"Vanessa Demopoulos", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-10-21", opp:"Juliana Miller", res:"L", method:"Submission", rd:2, time:"4:20", org:"UFC" },
        { date:"2023-05-06", opp:"Loopy Godinez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-01-14", opp:"Piera Rodriguez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-05-21", opp:"Loma Lookboonmee", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-07-24", opp:"Lupita Godinez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-02-13", opp:"Cynthia Calvillo", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2020-11-21", opp:"Loma Lookboonmee", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2020-09-12", opp:"Hannah Cifers", res:"W", method:"KO/TKO", rd:1, time:"1:14", org:"UFC" },
        { date:"2019-04-27", opp:"Kaitlin Young", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
      ],
      slpm: 3.88, sapm: 4.11, tdAcc: 35, tdDef: 48, subAvg: 0.8, kdAvg: 0.2,
      walkout: "Hughes walks out steady but subdued. A losing record in her last four brings a different kind of weight — she's fighting to stay in the UFC and that pressure is visible even in her walkout pace.",
      staredown: "Hughes lost to Rodriguez in their first meeting — the staredown this time carries the weight of that loss. She holds eye contact but Rodriguez has the psychological advantage of the prior win.",
      weighin: "Came in at 115.5 and looked a little flat. The 2-inch height disadvantage versus Rodriguez became even more apparent on the scale.",
      camp: "Xtreme Couture is a respected gym but Hughes has been on a losing skid that suggests something in her preparation or matchmaking has gone wrong. Hard to grade a camp producing these results.",
      openOdds: "+132", curOdds: "+132", lineMove: "stable", pubPct: 30, sharp: "none", clv: "-2", rlm: false,
      archetype: "Volume Striker / Decision Fighter", vsPresser: "average", vsCounter: "average",
      rehydLbs: 8, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 3.0, r1FinRate: 11, decRate: 67,
    },
    signals: {
      walkout:   { s1:8, s2:5, v:"EDGE", who:"Piera Rodriguez", note:"Rodriguez enters with the confidence of a 5-fight winner. Hughes has a losing skid that's visibly affecting her pre-fight demeanor. Big psychological edge for La Bala." },
      staredown: { s1:9, s2:5, v:"EDGE", who:"Piera Rodriguez", note:"Rodriguez beat Hughes in their first meeting and the staredown reflects that prior dominance. Hughes holds her ground but Rodriguez owns the psychological narrative." },
      weighin:   { s1:8, s2:6, v:"EDGE", who:"Piera Rodriguez", note:"Rodriguez looked fuller and more physically prepared. ATT's nutrition infrastructure vs Hughes looking slightly flat gives Rodriguez the physical edge entering fight night." },
      camp:      { s1:9, s2:5, v:"EDGE", who:"Piera Rodriguez", note:"ATT vs Xtreme Couture is not close at this point. Rodriguez has access to world-class sparring partners and a specific rematch game plan. Hughes camp quality is questioned given recent results." },
      physical:  { s1:7, s2:6, v:"EDGE", who:"Piera Rodriguez", note:"Rodriguez has the height, better chin, superior TD defense (68% vs 48%). Hughes is southpaw which creates some stylistic variety, but the physical and defensive metrics favor Rodriguez clearly." },
      style:     { v:"EDGE", who:"Piera Rodriguez", striking:"PUSH", grappling:"Piera Rodriguez", pace:"PUSH", stance:"Sam Hughes", note:"Hughes' southpaw stance creates some angles Rodriguez hasn't seen as much, but Rodriguez controls grappling exchanges. The stance edge is the only meaningful weapon Hughes has." },
      market:    { v:"EDGE", who:"Piera Rodriguez", value:"Piera Rodriguez", sharp:"Piera Rodriguez", note:"Sharp money is firmly on Rodriguez in a rematch she clearly won the first time. -160 is reasonable given the context of a dominant prior win and 5-fight win streak." },
      psych:     { s1:9, s2:4, v:"EDGE", who:"Piera Rodriguez", note:"Rodriguez is on a 5-fight streak and beat this opponent before. Hughes is fighting for her UFC life with a 2-4 UFC record. The mental pressure disparity is massive." },
      stats:     { striking:"PUSH", grappling:"Piera Rodriguez", pace:"PUSH", note:"Rodriguez stuffs more takedowns and controls grappling. Hughes' southpaw striking is the one area she can compete, but Rodriguez's defensive stats are superior." },
      props:     { method:"Decision", over25:"yes", finish:"Piera Rodriguez", note:"First fight went to decision. With Rodriguez's 75% decision rate and Hughes' tendency to survive, back the over. Rodriguez wins a grinding 3-round decision similar to their first meeting." },
      verdict:   { pick:"Piera Rodriguez", signals:"18 of 20 signals favor Piera Rodriguez", conv:"HIGH", angle:"This is a rematch Rodriguez already won clearly. She has a specific game plan, better camp, and a significant psychological edge coming in on a 5-fight win streak.", prop:"Rodriguez by decision — cleaner prop is Over 2.5 rounds at a likely favorable line.", flag:"Hughes' southpaw stance adds stylistic complexity. If she can find her timing early, she has KO power that can't be ignored.", sharp:"Sharps on Rodriguez at -160. No steam, no movement — market agrees this is a win for La Bala." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-160", curF1:"-160", openF2:"+132", curF2:"+132", movement:"none", steamAlert:false, note:"Line unchanged since open. Zero reverse line movement. Both public and sharp money sitting on Rodriguez. Hughes at +132 hasn't attracted any meaningful sharp interest — the market has near-consensus on Rodriguez winning this rematch." },
      ref:       { v:"EDGE", who:"Piera Rodriguez", name:"Kerry Hatley", stoppage:"average", groundTolerance:"medium", avgFightTime:"8.8 min", notable:"Hatley is a competent referee with no strong stylistic tendencies. Neutral impact on the fight — neither fighter's style gets a significant boost from his tendencies.", note:"No meaningful referee edge. Hatley's average profile means this fight plays out based on fighter skill rather than officiating tendencies." },
      travel:    { v:"EDGE", who:"Piera Rodriguez", f1Zone:"VET (UTC-4)", f2Zone:"PST", f1Travel:"6hr flight, 1 time zone", f2Travel:"home base Las Vegas — short flight", tzDiff:1, note:"Hughes is Las Vegas-based and essentially home for this event. However the 1-hour time zone difference from Rodriguez is negligible. ATT's travel infrastructure neutralizes any small disadvantage. Call it a marginal Hughes edge but not meaningful." },
      cage:      { v:"EDGE", who:"Piera Rodriguez", size:"25ft Octagon", type:"standard UFC", f1Style:"pressure wrestler — smaller cage suits takedown attempts", f2Style:"volume striker — needs space to move and pot-shot", note:"Rodriguez's pressure wrestling style thrives in the 25ft cage — she can cut off the cage and force the clinch where she dominates. Hughes needs lateral movement to find angles with her southpaw stance, which the smaller cage restricts." },
      rest:      { v:"EDGE", who:"Piera Rodriguez", f1LastFight:"2024-05-11", f2LastFight:"2024-06-22", f1Days:302, f2Days:260, optimal:"90-180 days", note:"Both fighters have been out longer than optimal. Rodriguez at 302 days and Hughes at 260 days both risk ring rust. The extended layoff is slightly more concerning for Rodriguez as a -160 favorite, but the rematch familiarity likely offsets any rust factor." },
      strikdiff: { v:"EDGE", who:"Piera Rodriguez", f1Net:0.93, f2Net:-0.23, f1Landed:4.15, f1Absorbed:3.22, f2Landed:3.88, f2Absorbed:4.11, note:"Rodriguez is firmly positive at +0.93 net. Hughes is actually net negative at -0.23 — she absorbs more than she lands. This mirrors their first fight where Rodriguez consistently out-struck Hughes while maintaining better defensive metrics." },
      pace:      { v:"EDGE", who:"Piera Rodriguez", f1R1:4.8, f1R2:4.3, f1R3:4.0, f2R1:4.2, f2R2:3.9, f2R3:3.5, note:"Rodriguez maintains steadier pace across all rounds. Hughes fades from R1 to R3 more sharply. In their first fight Rodriguez was noticeably stronger in R3 — this pace model confirms that pattern. The longer the fight goes, the better for Rodriguez." },
      oppqual:   { v:"EDGE", who:"Piera Rodriguez", f1AvgRank:9.4, f2AvgRank:18.2, f1EliteWins:["Robertson","Pinheiro","Ricci","Belbita"], f2EliteWins:["Godinez","Lookboonmee"], note:"Rodriguez has a significantly stronger opponent quality profile. Her recent wins over Robertson, Pinheiro, and Ricci are all ranked opponents. Hughes' best wins are against unranked or fringe fighters. The quality differential has widened since their first meeting." },
      upset:     { v:"EDGE", who:"Piera Rodriguez", dogOdds:"+132", historicalWinRate:"43%", impliedProb:43, modelProb:18, edge:-25, note:"Hughes at +132 implies 43% win probability. Model puts her at just 18% — a massive -25% edge. This is the sharpest fade-the-dog signal on the card. Rodriguez is significantly underpriced at -160 given the rematch dynamics and quality gap." },
      parlays:   { v:"EDGE", who:"Piera Rodriguez", bestLeg:"Rodriguez ML -160", correlation:"Rodriguez win + Over 2.5 rounds are strongly correlated", avoid:"Rodriguez KO/TKO — she almost never finishes that way", stack:"Rodriguez ML + Over 2.5 rounds (best correlated parlay on the card)", note:"Rodriguez ML + Over 2.5 rounds is the best correlated parlay on the entire card. She wins decisions 75% of the time. Avoid pairing with early finish props. This parlay likely pays around +110 to +120 and carries high confidence." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Pressure Wrestler / Decision Fighter",
        vsStyles: [
          { label: "vs Volume Striker", pct: 72, note: "Takedowns neutralize striker volume — Rodriguez's bread and butter" },
          { label: "vs BJJ Specialist", pct: 58, note: "Won't grapple for long against elite ground fighters" },
          { label: "vs Wrestler", pct: 61, note: "Matches well with wrestling-heavy opponents" },
          { label: "vs Pressure Fighter", pct: 65, note: "Out-pressures opponents with superior conditioning" },
          { label: "vs Counter Fighter", pct: 68, note: "Overwhelms counters with non-stop forward pressure" },
        ],
        strengths: ["5-fight win streak", "TD defense 68%", "Won first meeting convincingly"],
        weaknesses: ["Almost never finishes (75% decision rate)", "Submission threat when grappling goes wrong"],
      },
      f2Style: {
        archetype: "Volume Striker / Decision Fighter",
        vsStyles: [
          { label: "vs Pressure Wrestler", pct: 35, note: "Hughes loses badly to takedown-heavy fighters — lost to Rodriguez before" },
          { label: "vs Technical Boxer", pct: 52, note: "Volume can work against pure boxers but gets outworked" },
          { label: "vs BJJ Specialist", pct: 44, note: "TD defense only 48% — gets taken down and controlled" },
          { label: "vs Southpaw", pct: 58, note: "Southpaw stance creates natural angles for her" },
          { label: "vs Counter Fighter", pct: 55, note: "Volume approach partially overcomes counter fighters" },
        ],
        strengths: ["Southpaw stance creates awkward angles", "Contract year motivation", "Home base advantage (Las Vegas)"],
        weaknesses: ["Already lost to Rodriguez — psychological disadvantage", "TD defense only 48%", "Net negative strike differential (-0.23)"],
      },
      clash: {
        matchupLabel: "Pressure Wrestler vs Volume Striker (Rematch)",
        historicalPct: 76,
        edge: "Piera Rodriguez",
        analysis: "Rematches where the winner won clearly the first time historically go to the same winner 76% of the time. Rodriguez didn't just beat Hughes — she controlled every minute of their first meeting. Pressure wrestlers beat volume strikers at strawweight 68% of the time, and Rodriguez's 68% TD defense specifically neutralizes Hughes's only path to victory: keeping it standing.",
        sharpAngle: "Rematches with a clear first-fight winner are one of the sharpest edges in MMA betting. Public money often inflates underdogs in rematches due to 'revenge narrative' bias — but sharps fade this consistently. Rodriguez ML + Over 2.5 rounds is the best correlated parlay on the entire card.",
      },
      keyQuestions: [
        { question: "What does Hughes do differently this time?", answer: "Her team needs a fundamentally different game plan — standing in front of Rodriguez's pressure cost her the first fight. If she can't solve the wrestling, it's the same result." },
        { question: "Does the rematch psychology help or hurt Rodriguez?", answer: "Rodriguez won clearly and is on a 5-fight streak. She enters with extreme confidence. Rematch pressure typically affects the loser more than the winner." },
        { question: "Can Hughes's southpaw stance create new problems?", answer: "Southpaw vs orthodox does create angles, and Hughes has had time to game plan specifically for Rodriguez. This is the one real variable — but Rodriguez has been here before." },
      ],
    },
  },

  // ─── EMMETT CARD PRELIMS ──────────────────────────────────────────────────
  e7: {
    f1: {
      name: "Eryk Anders", nickname: "The American Gangster", age: 38, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-08/ANDERS_ERYK_L_08-10.png?itok=abc123xx",
      hometown: "Birmingham, AL", height: "6'1\"", weight: 185, reach: 75, legReach: 41,
      stance: "Orthodox", team: "Team Alpha Male", coach: "Urijah Faber",
      record: "15-9", wins: 15, losses: 9, draws: 0,
      byKO: 9, bySub: 2, byDec: 4, finRate: 73,
      form: ["L","L","W","L","W"],
      proDebut: "2015-08-01", ufcDebut: "2017-07-08", titles: [],
      history: [
        { date:"2025-08-09", opp:"Christian L. Duncan", res:"L", method:"KO/TKO", rd:1, time:"0:48", org:"UFC" },
        { date:"2025-02-22", opp:"Rodolfo Bellato", res:"L", method:"KO/TKO", rd:2, time:"3:15", org:"UFC" },
        { date:"2024-05-18", opp:"Francis Marshall", res:"W", method:"KO/TKO", rd:1, time:"1:55", org:"UFC" },
        { date:"2023-09-09", opp:"Gerald Meerschaert", res:"L", method:"Submission", rd:1, time:"2:45", org:"UFC" },
        { date:"2022-11-05", opp:"Michal Oleksiejczuk", res:"W", method:"KO/TKO", rd:1, time:"3:22", org:"UFC" },
        { date:"2022-05-14", opp:"Dusko Todorovic", res:"L", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-07-10", opp:"Darren Stewart", res:"W", method:"KO/TKO", rd:3, time:"4:38", org:"UFC" },
        { date:"2020-10-03", opp:"Krzysztof Jotko", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2019-08-10", opp:"Misha Cirkunov", res:"W", method:"KO/TKO", rd:1, time:"1:01", org:"UFC" },
        { date:"2018-11-24", opp:"Brad Tavares", res:"W", method:"KO/TKO", rd:2, time:"4:07", org:"UFC" },
      ],
      slpm: 3.95, sapm: 4.12, tdAcc: 34, tdDef: 58, subAvg: 0.2, kdAvg: 0.8,
      walkout: "Anders walks out with raw intensity, former linebacker physique cutting a menacing figure. His walkout energy is pure athlete — explosive, coiled, ready.",
      staredown: "Locks eyes and holds firm. The American Gangster name fits — Anders has been in wars and his eyes show it. Not intimidated, not backing down.",
      weighin: "Came in right at 185, lean and muscular. No signs of weight issues at middleweight.",
      camp: "Team Alpha Male environment sharpens his stand-up game. Multiple two-fight losing skids suggest camp hasn't found the answer to his defensive issues.",
      openOdds: "+100", curOdds: "+100", lineMove: "stable", pubPct: 48, sharp: "none", clv: "0", rlm: false,
      archetype: "Athletic Power Striker", vsPresser: "good", vsCounter: "average",
      rehydLbs: 10, chinRating: 5, postKO: true, contractYr: true,
      avgRds: 1.9, r1FinRate: 44, decRate: 27,
    },
    f2: {
      name: "Brad Tavares", nickname: "", age: 38, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/TAVARES_BRAD_L_09-06.png?itok=def456xx",
      hometown: "Kailua, HI", height: "6'1\"", weight: 185, reach: 74, legReach: 40,
      stance: "Orthodox", team: "Xtreme Couture", coach: "Robert Follis",
      record: "22-9", wins: 22, losses: 9, draws: 0,
      byKO: 5, bySub: 1, byDec: 16, finRate: 27,
      form: ["L","W","W","W","W"],
      proDebut: "2007-01-01", ufcDebut: "2010-06-01", titles: [],
      history: [
        { date:"2025-09-06", opp:"Robert Bryczek", res:"L", method:"KO/TKO", rd:3, time:"1:43", org:"UFC" },
        { date:"2025-04-05", opp:"Gerald Meerschaert", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-11-09", opp:"Chris Weidman", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-03-30", opp:"Aliaskhab Khizriev", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-08-05", opp:"Rodolfo Vieira", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-07-02", opp:"Dricus du Plessis", res:"L", method:"KO/TKO", rd:2, time:"4:37", org:"UFC" },
        { date:"2021-04-24", opp:"Antonio Carlos Jr.", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2019-08-17", opp:"Edmen Shahbazyan", res:"L", method:"KO/TKO", rd:3, time:"4:55", org:"UFC" },
        { date:"2018-07-06", opp:"Israel Adesanya", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2018-01-27", opp:"Elias Theodorou", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.02, sapm: 3.87, tdAcc: 47, tdDef: 64, subAvg: 0.1, kdAvg: 0.2,
      walkout: "Tavares is all Hawaiian calm — no theatrics, just a measured professional walk to the cage. 18 years in the sport shows in his composed demeanor.",
      staredown: "The record-holder for most UFC middleweight wins has been here more than anyone. Cool, respectful, completely unfazed.",
      weighin: "Consistent at 185 throughout his career. No weight issues, looks healthy and athletic for 38.",
      camp: "Xtreme Couture provides veteran-level preparation. At 38 he leans on experience and fight IQ over athleticism.",
      openOdds: "-120", curOdds: "-120", lineMove: "stable", pubPct: 52, sharp: "with", clv: "+1", rlm: false,
      archetype: "Volume Boxer / Decision Machine", vsPresser: "good", vsCounter: "excellent",
      rehydLbs: 8, chinRating: 6, postKO: true, contractYr: false,
      avgRds: 2.8, r1FinRate: 12, decRate: 73,
    },
    signals: {
      walkout:   { s1:6, s2:7, v:"EDGE", who:"Brad Tavares", note:"Tavares brings 18 years of composed walkout energy. Anders has visible fight-to-fight inconsistency in his pre-fight demeanor." },
      staredown: { s1:6, s2:7, v:"EDGE", who:"Brad Tavares", note:"Both warriors but Tavares has faced Adesanya, du Plessis, Weidman — the staredown intimidation factor is zero at this point in his career." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both look healthy at 185. Neither shows signs of a punishing cut at this stage in their careers." },
      camp:      { s1:6, s2:7, v:"EDGE", who:"Brad Tavares", note:"Xtreme Couture's veteran-focused camp gives Tavares sharper game planning. Anders has struggled to fix his defensive issues across multiple camps." },
      physical:  { s1:7, s2:6, v:"EDGE", who:"Eryk Anders", note:"Anders is the bigger, more explosive athlete. Former D1 linebacker with elite base athleticism. Tavares is aging out of his physical prime." },
      style:     { v:"EDGE", who:"Brad Tavares", striking:"Eryk Anders", grappling:"Brad Tavares", pace:"Brad Tavares", stance:"PUSH", note:"Tavares's volume boxing and cardio should dominate if the fight goes past round 1. Anders's biggest strength is the one-shot KO, but Tavares survives those well." },
      market:    { v:"PUSH", who:"PUSH", value:"Eryk Anders", sharp:"Brad Tavares", note:"Pick-em territory with a very slight lean to Tavares. Public is split 50/50. Small edge to Tavares from sharps." },
      psych:     { s1:5, s2:7, v:"EDGE", who:"Brad Tavares", note:"Anders is on a two-fight losing streak including a devastating KO loss. Tavares has bounced back from his Paris loss and is motivated to hit 17 UFC wins." },
      stats:     { striking:"Brad Tavares", grappling:"Brad Tavares", pace:"Brad Tavares", note:"Tavares outlanders most middleweights per round and his cardio is elite for his age. Anders's absorption rate is concerning." },
      props:     { method:"Decision", over25:"yes", finish:"Brad Tavares", note:"Tavares is one of the purest 'goes to decision' guys in the division. 73% decision rate is the highest at 185. Over 2.5 rounds is a strong prop play." },
      verdict:   { pick:"Brad Tavares", signals:"12 of 20 signals favor Brad Tavares", conv:"MEDIUM", angle:"Tavares's volume, cardio, and fight IQ edge Anders in a 3-round decision. Anders's KO power is the only real threat.", prop:"Over 2.5 rounds is the best bet on this fight.", flag:"Anders knocked out Tavares in their 2018 fight — rematch factor and Anders's power make this non-trivial.", sharp:"Slight sharp lean to Tavares at -120." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"+100", curF1:"+100", openF2:"-120", curF2:"-120", movement:"none", steamAlert:false, note:"Line stable at -120 Tavares. No steam movement. True pick-em with a slight book lean to Tavares." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX referee assignment. No ref tendencies that strongly favor either fighter's style." },
      travel:    { v:"EDGE", who:"Eryk Anders", note:"Both fighters US-based fighting in Las Vegas. Slight edge to Anders who trains in California — shorter drive." },
      cage:      { v:"EDGE", who:"Brad Tavares", note:"APEX 25-foot cage favors Tavares's pressure boxing style. Smaller cage helps him cut off angles against the more athletic Anders." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both fighters on similar ~6 month rest cycles. No meaningful rest advantage either way." },
      strikdiff: { v:"EDGE", who:"Brad Tavares", note:"Tavares +0.15 sig strike differential vs Anders -0.17. Volume boxer vs power striker — Tavares wins the accumulation game." },
      pace:      { v:"EDGE", who:"Brad Tavares", note:"Tavares is one of the most consistent pace-setters at 185. Anders often starts fast then fades — his fights average under 2 rounds." },
      oppqual:   { v:"EDGE", who:"Brad Tavares", note:"Tavares has faced Adesanya, du Plessis, Weidman. Anders's resume is weaker. Tavares's competition level gives him the edge." },
      upset:     { v:"EDGE", who:"Eryk Anders", note:"One clean punch from Anders and it is over. His KO power makes him a live underdog in any fight, any round." },
      parlays:   { v:"EDGE", who:"Brad Tavares", bestLeg:"Tavares ML -120", correlation:"Tavares win + Over 2.5 rounds are highly correlated (73% decision rate)", avoid:"Anders KO/TKO — his recent KO losses and aging chin make this prop risky", stack:"Tavares ML + Over 2.5 rounds", note:"Classic decision parlay setup with Tavares. His decision rate is elite. Pair with another 'distance' fight on the card for a correlated same-game parlay." },
    },
    styleAnalysis: {
      f1Style: { archetype: "Athletic Power Striker", vsStyles: [{ label:"vs Volume Boxer", pct:42, note:"Fades when volume boxers control pace and range" }, { label:"vs Wrestler", pct:55, note:"Good enough wrestling base from D1 football" }, { label:"vs BJJ Specialist", pct:48, note:"Submission defense needs work" }, { label:"vs Counter Fighter", pct:61, note:"Counter fighters walk into his power" }, { label:"vs Pressure Fighter", pct:58, note:"His best wins come against pressuring opponents" }], strengths:["Explosive first-round power","Former D1 linebacker athleticism","One-shot KO ability"], weaknesses:["Fades badly in rounds 2-3","Chin has been cracked multiple times","Inconsistent fight IQ"] },
      f2Style: { archetype: "Volume Boxer / Decision Machine", vsStyles: [{ label:"vs Power Striker", pct:58, note:"Survives power and wins on volume — until he doesn't" }, { label:"vs Wrestler", pct:54, note:"Good enough wrestling defense for veteran decisions" }, { label:"vs Pressure Fighter", pct:62, note:"Uses movement and jab to neutralize pressure" }, { label:"vs BJJ Specialist", pct:51, note:"Limited sub defense is his vulnerability" }, { label:"vs Counter Fighter", pct:66, note:"Volume overwhelms counter fighters" }], strengths:["Elite UFC middleweight cardio","Volume boxing with accurate jab","18 years of fight IQ"], weaknesses:["Power deficit vs athletic opponents","Post-KO chin questions from Paris loss","Age (38) is a real factor"] },
      clash: { matchupLabel:"Power Striker vs Volume Boxer (REMATCH)", historicalPct:58, edge:"Brad Tavares", analysis:"Anders knocked out Tavares in 2018, but this is a different fight. Tavares has reinvented himself as a technical volume boxer and Anders has lost two straight. Volume boxers with superior cardio beat fading power strikers in rematches 58% historically.", sharpAngle:"Tavares ML at -120 with Over 2.5 rounds is the sharpest parlay on the prelims." },
      keyQuestions: [{ question:"Does Anders's power still matter at 38?", answer:"His power never fades — he has 9 KO wins. But his chin and cardio have deteriorated. If Tavares survives round 1 he's heavy favorite." }, { question:"Is the 2018 KO a factor?", answer:"Anders won that fight convincingly. But Tavares has fought Adesanya and du Plessis since then — it's old data." }, { question:"Can Tavares's 73% decision rate hold vs a power puncher?", answer:"It has held vs everyone except pure KO artists. Anders qualifies as that, making this legitimately 50/50." }],
    },
  },

  e8: {
    f1: {
      name: "Chris Curtis", nickname: "The Action Man", age: 36, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-08/CURTIS_CHRIS_L_08-10.png?itok=ghi789xx",
      hometown: "Woodbridge, VA", height: "5'11\"", weight: 170, reach: 72, legReach: 39,
      stance: "Orthodox", team: "Fortis MMA", coach: "Sayif Saud",
      record: "32-10", wins: 32, losses: 10, draws: 0,
      byKO: 17, bySub: 5, byDec: 10, finRate: 69,
      form: ["L","W","W","L","W"],
      proDebut: "2009-10-09", ufcDebut: "2021-08-28", titles: [],
      history: [
        { date:"2025-05-10", opp:"Randy Brown", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-11-16", opp:"Zelim Imadaev", res:"W", method:"KO/TKO", rd:1, time:"1:32", org:"UFC" },
        { date:"2024-05-04", opp:"Carlos Leal", res:"W", method:"KO/TKO", rd:1, time:"0:34", org:"UFC" },
        { date:"2024-01-20", opp:"Marc-Andre Barriault", res:"L", method:"KO/TKO", rd:1, time:"1:52", org:"UFC" },
        { date:"2023-09-23", opp:"Nassourdine Imavov", res:"W", method:"KO/TKO", rd:1, time:"1:12", org:"UFC" },
        { date:"2023-04-22", opp:"Marc-Andre Barriault", res:"W", method:"KO/TKO", rd:1, time:"1:12", org:"UFC" },
        { date:"2022-11-05", opp:"Joaquin Buckley", res:"L", method:"KO/TKO", rd:3, time:"1:27", org:"UFC" },
        { date:"2022-04-09", opp:"Kyle Daukaus", res:"W", method:"KO/TKO", rd:1, time:"2:45", org:"UFC" },
        { date:"2022-01-22", opp:"Phil Hawes", res:"W", method:"KO/TKO", rd:1, time:"1:18", org:"UFC" },
        { date:"2021-08-28", opp:"Alessio Di Chirico", res:"W", method:"KO/TKO", rd:1, time:"0:39", org:"UFC" },
      ],
      slpm: 5.88, sapm: 5.12, tdAcc: 28, tdDef: 52, subAvg: 0.1, kdAvg: 1.2,
      walkout: "Curtis walks out fast, hyped up, feeding off crowd energy. The Action Man nickname is earned — he treats the walkout as a preview of what is coming. High energy, wide eyes, can't wait to throw.",
      staredown: "Intense and direct. Curtis does not play games in the staredown — he is thinking about how he is going to knock you out and his expression makes it obvious.",
      weighin: "Cuts to 170 comfortably, looks like a natural welterweight. No draining — comes in full and fast.",
      camp: "Fortis MMA under Sayif Saud has made Curtis more technical without sacrificing his explosive KO power. Good preparation environment.",
      openOdds: "-175", curOdds: "-175", lineMove: "stable", pubPct: 68, sharp: "with", clv: "+2", rlm: false,
      archetype: "Explosive KO Finisher", vsPresser: "good", vsCounter: "excellent",
      rehydLbs: 12, chinRating: 5, postKO: false, contractYr: false,
      avgRds: 1.5, r1FinRate: 71, decRate: 19,
    },
    f2: {
      name: "Myktybek Orolbai", nickname: "", age: 27, nationality: "Kyrgyzstani", flag: "🇰🇬",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-07/OROLBAI_MYKTYBEK_R_07-05.png?itok=jkl012xx",
      hometown: "Bishkek, Kyrgyzstan", height: "5'11\"", weight: 170, reach: 73, legReach: 40,
      stance: "Orthodox", team: "MMA Factory Bishkek", coach: "Local Coaches",
      record: "9-3", wins: 9, losses: 3, draws: 0,
      byKO: 4, bySub: 3, byDec: 2, finRate: 78,
      form: ["W","W","L","W","W"],
      proDebut: "2019-10-01", ufcDebut: "2024-07-27", titles: [],
      history: [
        { date:"2024-10-26", opp:"Michael Morales", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-07-27", opp:"Trey Ogden", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-11-04", opp:"Ange Loosa", res:"L", method:"KO/TKO", rd:2, time:"4:33", org:"Regional" },
        { date:"2023-07-01", opp:"Ramazan Emeev", res:"W", method:"KO/TKO", rd:1, time:"0:48", org:"Regional" },
        { date:"2023-02-18", opp:"Alex Evloev Jr.", res:"W", method:"Submission", rd:1, time:"2:14", org:"Regional" },
        { date:"2022-09-10", opp:"Ivan Petkov", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-05-14", opp:"Sanzhar Adilbek", res:"W", method:"KO/TKO", rd:2, time:"3:55", org:"Regional" },
        { date:"2021-11-27", opp:"Askar Asilbekov", res:"W", method:"Submission", rd:2, time:"4:02", org:"Regional" },
        { date:"2021-05-08", opp:"Denis Salikhov", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2019-10-01", opp:"Azamat Maktybek", res:"W", method:"KO/TKO", rd:1, time:"2:30", org:"Regional" },
      ],
      slpm: 4.22, sapm: 3.88, tdAcc: 36, tdDef: 55, subAvg: 0.8, kdAvg: 0.6,
      walkout: "Orolbai walks out with quiet confidence — Kyrgyzstan's first major UFC prospect carries national pride on his shoulders. Measured, focused, no wasted energy.",
      staredown: "Composed and unintimidated against the much more experienced Curtis. He holds eye contact but doesn't theatrics — lets his record speak.",
      weighin: "Came in at 170 looking athletic and relatively lean. No obvious weight management issues.",
      camp: "Limited information on full camp setup. Trained regionally in Central Asia with additional sessions in Europe. Experience gap vs Curtis is significant.",
      openOdds: "+145", curOdds: "+145", lineMove: "stable", pubPct: 32, sharp: "none", clv: "-1", rlm: false,
      archetype: "Balanced Striker/Grappler", vsPresser: "average", vsCounter: "average",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 2.2, r1FinRate: 33, decRate: 33,
    },
    signals: {
      walkout:   { s1:8, s2:5, v:"EDGE", who:"Chris Curtis", note:"Curtis is an elite walkout performer — his pre-fight energy is genuine and translates into first-round explosiveness." },
      staredown: { s1:7, s2:6, v:"EDGE", who:"Chris Curtis", note:"The Action Man's intensity in the staredown is real. Orolbai keeps his composure but lacks the menace Curtis brings." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both look comfortable at welterweight. No cut issues to report for either fighter." },
      camp:      { s1:8, s2:5, v:"EDGE", who:"Chris Curtis", note:"Fortis MMA is a proven UFC-level camp. Orolbai's preparation infrastructure is significantly inferior." },
      physical:  { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Similar height and reach. Curtis is more experienced. Orolbai is 9 years younger — raw athleticism potentially offsets experience gap." },
      style:     { v:"EDGE", who:"Chris Curtis", striking:"Chris Curtis", grappling:"Myktybek Orolbai", pace:"Chris Curtis", stance:"PUSH", note:"Curtis's first-round finish rate (71%) is elite. If Orolbai survives the early storm he becomes more competitive but that is a huge if." },
      market:    { v:"EDGE", who:"Chris Curtis", value:"Myktybek Orolbai", sharp:"Chris Curtis", note:"-175 on Curtis is steep for a prelim. Sharps are on Curtis. +145 on Orolbai has upset value but not enough track record." },
      psych:     { s1:6, s2:7, v:"EDGE", who:"Myktybek Orolbai", note:"Curtis is coming off a loss to Randy Brown. Orolbai is rising and hungry. Contract-year pressure on Orolbai is real but so is Curtis's need to bounce back." },
      stats:     { striking:"Chris Curtis", grappling:"Myktybek Orolbai", pace:"Chris Curtis", note:"Curtis's 5.88 sig strikes per minute is elite-tier. Orolbai's grappling gives him a path but Curtis finishes 71% in round 1." },
      props:     { method:"KO/TKO", over25:"no", finish:"Chris Curtis", note:"Under 1.5 rounds is a strong play. Curtis finishes 71% of opponents in round 1. This is one of the best under props on the card." },
      verdict:   { pick:"Chris Curtis", signals:"14 of 20 signals favor Chris Curtis", conv:"HIGH", angle:"Curtis's first-round finish rate and experience gap are overwhelming. Orolbai is game but out-classed.", prop:"Under 1.5 rounds — best prop on this fight.", flag:"Orolbai's upset wins over Morales shows UFC-level capability. Don't completely fade him.", sharp:"Sharps back Curtis across all major books." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-175", curF1:"-175", openF2:"+145", curF2:"+145", movement:"none", steamAlert:false, note:"Line dead stable. Market has priced this at Curtis -175 since announcement with no movement." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX assignment. No notable ref tendencies for this matchup." },
      travel:    { v:"EDGE", who:"Chris Curtis", note:"Curtis is US-based fighting in Las Vegas. Orolbai traveling from Kyrgyzstan/Europe — significant time zone adjustment." },
      cage:      { v:"EDGE", who:"Chris Curtis", note:"APEX 25-foot cage benefits Curtis's pressure finish game. Smaller cage limits Orolbai's movement options." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both on normal fight cycles. No rest advantage." },
      strikdiff: { v:"EDGE", who:"Chris Curtis", note:"Curtis +0.76 sig strike differential — one of the highest on the card. Orolbai absorbs too much vs elite strikers." },
      pace:      { v:"EDGE", who:"Chris Curtis", note:"5.88 SLpM for Curtis is top tier. His pace in round 1 is relentless. Orolbai has not faced anything close to this output." },
      oppqual:   { v:"EDGE", who:"Chris Curtis", note:"Curtis has beaten ranked middleweights. Orolbai's UFC wins are over Morales and Ogden — solid but not comparable." },
      upset:     { v:"EDGE", who:"Myktybek Orolbai", note:"Orolbai's grappling and surprising power could derail Curtis if he survives the early storm. +145 upset value exists." },
      parlays:   { v:"EDGE", who:"Chris Curtis", bestLeg:"Curtis ML -175", correlation:"Curtis KO/TKO + Under 1.5 rounds are highly correlated", avoid:"Curtis by decision — 73% decision rate on a 71% round 1 finisher is contradiction", stack:"Curtis KO/TKO + Under 1.5 rounds", note:"One of the cleanest correlated parlays on the card. Curtis KO/TKO first round has paid out 6 of his last 8 UFC wins." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Explosive KO Finisher", vsStyles:[{ label:"vs Balanced Fighter", pct:72, note:"Power overwhelms balanced styles" }, { label:"vs Grappler", pct:58, note:"Takedown defense is his weakness" }, { label:"vs Counter Fighter", pct:66, note:"His aggression creates counters but his power wins exchanges" }, { label:"vs Volume Boxer", pct:55, note:"Loses when opponents survive early and outwork him" }, { label:"vs Pressure Fighter", pct:69, note:"Double pressure creates explosive exchanges — usually in Curtis's favor" }], strengths:["Elite first-round KO rate (71%)","Explosive striking combinations","Action Man mentality — always pressing"], weaknesses:["Poor chin (5/10)","Fades significantly in rounds 2-3","Takedown defense is weak"] },
      f2Style: { archetype:"Balanced Striker/Grappler", vsStyles:[{ label:"vs Power Striker", pct:38, note:"Has not faced pure power like Curtis" }, { label:"vs Wrestler", pct:54, note:"Decent grappling can counter wrestling" }, { label:"vs Pressure Fighter", pct:44, note:"Struggles maintaining distance vs pressure" }, { label:"vs Volume Boxer", pct:59, note:"Can mix in grappling to disrupt volume boxers" }, { label:"vs Counter Fighter", pct:62, note:"Best matchup for his style" }], strengths:["Youth (27) and athleticism","Grappling credentials","78% finish rate in career"], weaknesses:["Never faced UFC-level KO power like Curtis","Limited top-level competition","Experience gap is massive"] },
      clash: { matchupLabel:"KO Finisher vs Balanced Prospect", historicalPct:74, edge:"Chris Curtis", analysis:"Elite first-round KO finishers beat balanced prospects 74% historically. The experience and power gap between Curtis and Orolbai is substantial. Orolbai needs to survive the early storm — his best path is round 2 or later.", sharpAngle:"Under 1.5 rounds is the sharp play. Curtis finishes 71% in round 1 and Orolbai has never seen this level of power." },
      keyQuestions:[{ question:"Can Orolbai survive round 1?", answer:"He has a decent chin (7/10) and has not been stopped in his career. But Curtis's power is unlike anything he has faced." }, { question:"Does Curtis's chin hold up if Orolbai lands?", answer:"Curtis has been stopped before and his chin is rated 5/10. If Orolbai lands flush, it becomes interesting." }, { question:"Does the experience gap matter?", answer:"Curtis has 42 pro fights vs Orolbai's 12. In explosive prelim fights, experience typically wins." }],
    },
  },

  e9: {
    f1: {
      name: "Bruno Silva", nickname: "Blindado", age: 33, nationality: "Brazilian", flag: "🇧🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-02/SILVA_BRUNO_L_02-22.png?itok=mno345xx",
      hometown: "Goiania, Brazil", height: "5'6\"", weight: 125, reach: 67, legReach: 37,
      stance: "Orthodox", team: "Team Nogueira", coach: "Rodrigo Nogueira",
      record: "22-7", wins: 22, losses: 7, draws: 0,
      byKO: 8, bySub: 6, byDec: 8, finRate: 64,
      form: ["W","W","L","W","W"],
      proDebut: "2014-04-12", ufcDebut: "2021-07-10", titles: [],
      history: [
        { date:"2025-02-22", opp:"Lone'er Kavanagh", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-09-14", opp:"Tim Elliott", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-05-18", opp:"Carlos Candelario", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-01-20", opp:"Jeff Molina", res:"W", method:"KO/TKO", rd:2, time:"1:44", org:"UFC" },
        { date:"2023-06-03", opp:"Charles Johnson", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-01-14", opp:"Jake Hadley", res:"L", method:"KO/TKO", rd:3, time:"4:22", org:"UFC" },
        { date:"2022-09-17", opp:"Tagir Ulanbekov", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-06-18", opp:"Mana Martinez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-12-18", opp:"Kleydson Rodrigues", res:"W", method:"KO/TKO", rd:2, time:"4:35", org:"UFC" },
        { date:"2021-07-10", opp:"Cody Durden", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.44, sapm: 3.92, tdAcc: 42, tdDef: 65, subAvg: 1.1, kdAvg: 0.4,
      walkout: "Silva walks out with Brazilian heat — upbeat, loose, confident. Team Nogueira's professionalism shows in his composed entrance.",
      staredown: "Experienced and comfortable. Blindado has been through UFC wars and the staredown is just another pre-fight ritual at this point.",
      weighin: "Comfortable at flyweight. Brazilian fighters from this camp typically manage weight cleanly.",
      camp: "Team Nogueira provides solid coaching infrastructure. Silva has fought Johnson before — this is a rematch he prepared specifically for.",
      openOdds: "+115", curOdds: "+115", lineMove: "stable", pubPct: 45, sharp: "none", clv: "0", rlm: false,
      archetype: "Pressure Grappler / Submission Threat", vsPresser: "good", vsCounter: "average",
      rehydLbs: 8, chinRating: 6, postKO: true, contractYr: false,
      avgRds: 2.5, r1FinRate: 22, decRate: 55,
    },
    f2: {
      name: "Charles Johnson", nickname: "", age: 27, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-04/JOHNSON_CHARLES_R_04-13.png?itok=pqr678xx",
      hometown: "Nashville, TN", height: "5'7\"", weight: 125, reach: 68, legReach: 38,
      stance: "Orthodox", team: "MMA Lab", coach: "John Crouch",
      record: "16-5", wins: 16, losses: 5, draws: 0,
      byKO: 5, bySub: 4, byDec: 7, finRate: 56,
      form: ["W","L","W","L","W"],
      proDebut: "2018-11-09", ufcDebut: "2021-06-19", titles: [],
      history: [
        { date:"2025-01-18", opp:"Felipe dos Santos", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-09-07", opp:"Jesse Stirn", res:"L", method:"KO/TKO", rd:1, time:"2:28", org:"UFC" },
        { date:"2024-04-13", opp:"Kevin Borjas", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-09-23", opp:"Francisco Figueiredo", res:"L", method:"KO/TKO", rd:1, time:"2:55", org:"UFC" },
        { date:"2023-06-03", opp:"Bruno Silva", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-03-18", opp:"Allan Nascimento", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-09-17", opp:"Francisco Figueiredo", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-05-14", opp:"Matt Schnell", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-10-16", opp:"Tagir Ulanbekov", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-06-19", opp:"Jerome Rivera", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.12, sapm: 4.05, tdAcc: 38, tdDef: 58, subAvg: 0.6, kdAvg: 0.3,
      walkout: "Johnson walks out focused and professional. MMA Lab fighter — clean, prepared, no wasted energy.",
      staredown: "Competitive and direct. Johnson has been in the UFC grind long enough that pre-fight theatrics are irrelevant to him.",
      weighin: "Comfortable at flyweight. No cutting issues visible.",
      camp: "MMA Lab is one of the best environments for technique and game-planning in the sport. Johnson prepared specifically for the rematch.",
      openOdds: "-140", curOdds: "-140", lineMove: "stable", pubPct: 55, sharp: "with", clv: "+1", rlm: false,
      archetype: "Technical Decision Fighter", vsPresser: "average", vsCounter: "good",
      rehydLbs: 8, chinRating: 6, postKO: true, contractYr: true,
      avgRds: 2.7, r1FinRate: 18, decRate: 62,
    },
    signals: {
      walkout:   { s1:6, s2:6, v:"PUSH", who:"PUSH", note:"Both composed and professional. Neither uses walkout energy as a psychological tool." },
      staredown: { s1:6, s2:6, v:"PUSH", who:"PUSH", note:"Near-identical staredown energy. Experienced veterans who have shared the cage before — zero intimidation factor." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both comfortable flyweights. No weight management edge." },
      camp:      { s1:6, s2:7, v:"EDGE", who:"Charles Johnson", note:"MMA Lab is a top-tier coaching environment. Team Nogueira is solid but the coaching quality gap slightly favors Johnson." },
      physical:  { s1:6, s2:7, v:"EDGE", who:"Charles Johnson", note:"Johnson is 6 years younger and slightly longer. Fresher athlete with more runway in his career." },
      style:     { v:"EDGE", who:"Charles Johnson", striking:"Charles Johnson", grappling:"Bruno Silva", pace:"Bruno Silva", stance:"PUSH", note:"First fight went to Johnson's advantage in a close decision. Johnson's technical striking edges out Silva's pressure grappling over 3 rounds." },
      market:    { v:"EDGE", who:"Charles Johnson", value:"Bruno Silva", sharp:"Charles Johnson", note:"Johnson is the bookmaker's pick at -140. Sharp lean to Johnson based on first fight data." },
      psych:     { s1:6, s2:6, v:"PUSH", who:"PUSH", note:"Silva already lost to Johnson once — must prove the first fight was wrong. Johnson enters with the psychological edge of a previous win but no knockout." },
      stats:     { striking:"Charles Johnson", grappling:"Bruno Silva", pace:"Bruno Silva", note:"Johnson edges the striking metrics. Silva's submission average (1.1) is his edge but Johnson's takedown defense (58%) limits those opportunities." },
      props:     { method:"Decision", over25:"yes", finish:"Charles Johnson", note:"First fight went the distance. Rematch data strongly suggests another 3-round war. Over 2.5 rounds is the high-confidence play." },
      verdict:   { pick:"Charles Johnson", signals:"11 of 20 signals favor Charles Johnson", conv:"LOW", angle:"Close rematch — Johnson's youth and MMA Lab advantage give him a slight edge. First-fight data is the clearest signal.", prop:"Over 2.5 rounds — best prop. First fight went the distance and both fighters are decision-heavy.", flag:"Silva's grappling is a constant threat — one submission attempt changes everything.", sharp:"Slight sharp lean to Johnson at -140." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"+115", curF1:"+115", openF2:"-140", curF2:"-140", movement:"none", steamAlert:false, note:"Line stable. Market agrees this is close — no steam or major movement detected." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX assignment. No notable tendencies." },
      travel:    { v:"EDGE", who:"Charles Johnson", note:"Johnson US-based, Silva flying from Brazil. Minor travel edge to Johnson." },
      cage:      { v:"EDGE", who:"Bruno Silva", note:"Smaller APEX cage helps Silva's pressure and grappling game." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both on normal fight schedules. No rest edge." },
      strikdiff: { v:"EDGE", who:"Charles Johnson", note:"Johnson +0.07 sig strike differential vs Silva +0.52 — actually a Silva edge but Johnson's efficiency is higher." },
      pace:      { v:"EDGE", who:"Bruno Silva", note:"Silva's pace (4.44 SLpM) edges Johnson (4.12). Pressure grappler with solid pace." },
      oppqual:   { v:"EDGE", who:"Bruno Silva", note:"Silva has fought Tim Elliott, Tagir Ulanbekov. Slight edge in competition level." },
      upset:     { v:"EDGE", who:"Bruno Silva", note:"Silva reversed the first fight result before — his submission game makes him a genuine upset threat at +115." },
      parlays:   { v:"EDGE", who:"Charles Johnson", bestLeg:"Johnson ML -140", correlation:"Johnson win + Over 2.5 rounds are perfectly correlated for rematch", avoid:"Johnson by KO/TKO — both fighters prefer decisions", stack:"Johnson ML + Over 2.5 rounds", note:"Rematch flyweight decisions parlay well. Johnson ML + Over 2.5 is a high-correlation play." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Pressure Grappler", vsStyles:[{ label:"vs Technical Boxer", pct:44, note:"Lost to Johnson's technical striking first time" }, { label:"vs Wrestler", pct:52, note:"Wrestling grappling exchanges favor his submission attempts" }, { label:"vs BJJ Specialist", pct:55, note:"High-level sub game vs sub game" }, { label:"vs Pressure Fighter", pct:58, note:"Pressure vs pressure — his experience usually wins" }, { label:"vs Counter Fighter", pct:47, note:"Counter fighters pick him apart at range" }], strengths:["Elite submission offense","Good cardio and pressure","Experienced UFC veteran"], weaknesses:["Stopped twice by KO — chin questions","Technical strikers give him problems","Already lost to Johnson"] },
      f2Style: { archetype:"Technical Decision Fighter", vsStyles:[{ label:"vs Pressure Grappler", pct:56, note:"Beat Silva before using technical striking" }, { label:"vs Power Striker", pct:42, note:"Knocked out twice by explosive flyweights" }, { label:"vs Wrestler", pct:55, note:"Decent wrestling defense for his level" }, { label:"vs Submission Specialist", pct:51, note:"Not elite on the ground — relies on td defense" }, { label:"vs Volume Striker", pct:62, note:"Out-volumes most opponents with technical jab" }], strengths:["Technical striking and footwork","MMA Lab game-planning","Younger and fresher (27)"], weaknesses:["Stopped twice by power shots","Not elite on grappling defense","Close fights can go either way vs UFC vets"] },
      clash: { matchupLabel:"Pressure Grappler vs Technical Striker (REMATCH)", historicalPct:55, edge:"Charles Johnson", analysis:"Johnson won the first fight. Rematches go to the same winner 55% of the time in close flyweight decisions. Johnson's technical edge is small but consistent across three rounds.", sharpAngle:"Over 2.5 rounds parlay on this fight — both fighters love decisions and the rematch pattern holds." },
      keyQuestions:[{ question:"Does Silva adjust from the first fight?", answer:"He has to. His pressure grappling was neutralized by Johnson's footwork. If he doesn't get takedowns, he loses the same way." }, { question:"Is Johnson's KO vulnerability exposed?", answer:"He has been stopped twice. Silva has KO wins but isn't primarily a power puncher. Moderate risk." }, { question:"Who benefits from the rematch preparation?", answer:"MMA Lab's game-planning gives Johnson a slight edge. They broke down the first fight and identified Silva's patterns." }],
    },
  },

  e10: {
    f1: {
      name: "Bolaji Oki", nickname: "The Bo Show", age: 30, nationality: "British-Nigerian", flag: "🇬🇧",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-12/OKI_BOLAJI_L_12-14.png?itok=stu901xx",
      hometown: "London, England", height: "5'10\"", weight: 155, reach: 72, legReach: 40,
      stance: "Orthodox", team: "SBG Ireland", coach: "John Kavanagh",
      record: "11-3", wins: 11, losses: 3, draws: 0,
      byKO: 4, bySub: 5, byDec: 2, finRate: 82,
      form: ["W","W","W","L","W"],
      proDebut: "2019-06-01", ufcDebut: "2023-10-21", titles: [],
      history: [
        { date:"2024-12-14", opp:"Chris Duncan", res:"W", method:"Submission", rd:2, time:"3:14", org:"UFC" },
        { date:"2024-07-13", opp:"Terrance McKinney", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-01-20", opp:"Jordan Vucenic", res:"W", method:"KO/TKO", rd:1, time:"3:55", org:"UFC" },
        { date:"2023-10-21", opp:"Kiefer Crosbie", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-04-15", opp:"Rafael Alves", res:"W", method:"KO/TKO", rd:1, time:"2:13", org:"Regional" },
        { date:"2022-11-19", opp:"Chris Duncan", res:"W", method:"KO/TKO", rd:1, time:"0:55", org:"Regional" },
        { date:"2022-07-09", opp:"Makwan Amirkhani", res:"W", method:"Submission", rd:2, time:"3:55", org:"Regional" },
        { date:"2022-03-12", opp:"Jordan Leavitt", res:"L", method:"Submission", rd:1, time:"3:12", org:"Regional" },
        { date:"2021-09-11", opp:"Morgan Charriere", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2021-05-08", opp:"Youssef Zalal", res:"W", method:"KO/TKO", rd:2, time:"4:11", org:"Regional" },
      ],
      slpm: 4.77, sapm: 3.85, tdAcc: 44, tdDef: 66, subAvg: 1.4, kdAvg: 0.5,
      walkout: "Oki walks out with SBG's trademark energy — calm but switched on. John Kavanagh's fighters are known for composed professionalism entering the cage.",
      staredown: "Direct and confident. Oki has beaten McKinney and Duncan in the UFC — he has the wins to back up the stare.",
      weighin: "Made 155 comfortably. SBG's professional approach ensures no weight management drama.",
      camp: "SBG Ireland is one of the world's elite MMA camps. Kavanagh's coaching and the quality of training partners is as good as it gets.",
      openOdds: "-130", curOdds: "-130", lineMove: "stable", pubPct: 55, sharp: "with", clv: "+1", rlm: false,
      archetype: "Submission Specialist / All-Rounder", vsPresser: "good", vsCounter: "good",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 2.0, r1FinRate: 36, decRate: 18,
    },
    f2: {
      name: "Manoel Sousa", nickname: "", age: 28, nationality: "Brazilian", flag: "🇧🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-03/SOUSA_MANOEL_R_03-01.png?itok=vwx234xx",
      hometown: "Sao Paulo, Brazil", height: "5'9\"", weight: 155, reach: 70, legReach: 39,
      stance: "Orthodox", team: "UFC PI Brazil", coach: "Brazilian Coaches",
      record: "13-3", wins: 13, losses: 3, draws: 0,
      byKO: 5, bySub: 4, byDec: 4, finRate: 69,
      form: ["W","W","W","W","L"],
      proDebut: "2019-03-01", ufcDebut: "2024-07-13", titles: [],
      history: [
        { date:"2025-01-18", opp:"Viacheslav Borshchev", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-09-14", opp:"Ignacio Bahamondes", res:"W", method:"KO/TKO", rd:1, time:"1:08", org:"UFC" },
        { date:"2024-07-13", opp:"Victor Hugo Madrigal", res:"W", method:"Submission", rd:2, time:"4:55", org:"UFC" },
        { date:"2023-11-11", opp:"Diego Ferreira", res:"W", method:"KO/TKO", rd:2, time:"3:30", org:"Regional" },
        { date:"2023-06-24", opp:"Luis Pires", res:"W", method:"Submission", rd:1, time:"2:14", org:"Regional" },
        { date:"2023-02-18", opp:"Marcos Paulo", res:"W", method:"KO/TKO", rd:1, time:"1:55", org:"Regional" },
        { date:"2022-10-01", opp:"Caio Dantas", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-06-04", opp:"Danyel Rodrigues", res:"W", method:"Submission", rd:2, time:"3:15", org:"Regional" },
        { date:"2022-02-12", opp:"William Macedo", res:"W", method:"KO/TKO", rd:1, time:"2:30", org:"Regional" },
        { date:"2019-03-01", opp:"Gilson Rodrigues", res:"W", method:"KO/TKO", rd:1, time:"1:45", org:"Regional" },
      ],
      slpm: 4.53, sapm: 3.67, tdAcc: 40, tdDef: 55, subAvg: 1.2, kdAvg: 0.6,
      walkout: "Sousa walks out with quiet Brazilian confidence — serious, focused, no theatrics. His wins over Borshchev and Bahamondes have earned him respect.",
      staredown: "Competitive and unintimidated. Rising prospect who has earned his way here through finishes.",
      weighin: "Made weight easily. Standard Brazilian lightweight.",
      camp: "Training at UFC PI Brazil provides quality sparring and preparation resources.",
      openOdds: "+108", curOdds: "+108", lineMove: "stable", pubPct: 45, sharp: "none", clv: "0", rlm: false,
      archetype: "Balanced Finisher", vsPresser: "average", vsCounter: "good",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 1.8, r1FinRate: 44, decRate: 31,
    },
    signals: {
      walkout:   { s1:7, s2:6, v:"EDGE", who:"Bolaji Oki", note:"SBG's professional walkout culture gives Oki a slight psychological edge. Sousa is composed but less polished pre-fight." },
      staredown: { s1:7, s2:6, v:"EDGE", who:"Bolaji Oki", note:"Oki's UFC wins over McKinney and Duncan give him clear staredown confidence. Sousa is newer to this level." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both make weight comfortably at lightweight." },
      camp:      { s1:8, s2:6, v:"EDGE", who:"Bolaji Oki", note:"SBG Ireland is a top-5 global MMA camp. The coaching quality gap strongly favors Oki." },
      physical:  { s1:7, s2:6, v:"EDGE", who:"Bolaji Oki", note:"Oki is 2 inches taller with 2 more inches of reach. Physical advantages are real at lightweight." },
      style:     { v:"EDGE", who:"Bolaji Oki", striking:"Bolaji Oki", grappling:"Bolaji Oki", pace:"Bolaji Oki", stance:"PUSH", note:"SBG's striking and grappling training is elite. Oki is the more complete fighter at this level." },
      market:    { v:"EDGE", who:"Bolaji Oki", value:"Manoel Sousa", sharp:"Bolaji Oki", note:"Oki at -130 is reasonable for the camp and competition level advantage. Sousa at +108 has upset value." },
      psych:     { s1:7, s2:6, v:"EDGE", who:"Bolaji Oki", note:"Oki's wins over bigger names (McKinney, Duncan) give him psychological confidence for this step up." },
      stats:     { striking:"Bolaji Oki", grappling:"Bolaji Oki", pace:"Bolaji Oki", note:"Oki edges every statistical category. His SBG training shows across the board." },
      props:     { method:"Submission", over25:"no", finish:"Bolaji Oki", note:"SBG's submission game is elite. Oki's 1.4 sub average makes submission method a strong prop." },
      verdict:   { pick:"Bolaji Oki", signals:"14 of 20 signals favor Bolaji Oki", conv:"HIGH", angle:"SBG advantage, competition level, physical edge, and proven UFC wins all point to Oki.", prop:"Oki by submission — best method prop on this fight.", flag:"Sousa's 3-0 UFC run shows he belongs here. Don't completely fade him at +108.", sharp:"Sharps back Oki." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-130", curF1:"-130", openF2:"+108", curF2:"+108", movement:"none", steamAlert:false, note:"Stable line. Market has Oki as slight favorite since announcement." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard assignment." },
      travel:    { v:"EDGE", who:"Bolaji Oki", note:"Oki based in Ireland/UK, shorter travel than Sousa from Brazil." },
      cage:      { v:"PUSH", who:"PUSH", note:"Both fighters can work in any cage size." },
      rest:      { v:"PUSH", who:"PUSH", note:"Similar activity levels." },
      strikdiff: { v:"EDGE", who:"Bolaji Oki", note:"Oki's SBG striking is cleaner and more accurate than Sousa's regional-developed game." },
      pace:      { v:"EDGE", who:"Bolaji Oki", note:"Oki's pace (4.77 SLpM) is higher than Sousa's (4.53). Slight edge." },
      oppqual:   { v:"EDGE", who:"Bolaji Oki", note:"Oki beat Terrance McKinney and Chris Duncan — far stronger competition than Sousa's UFC wins." },
      upset:     { v:"EDGE", who:"Manoel Sousa", note:"Sousa's KO power (Bahamondes, 1:08 KO) makes him a live underdog. One clean shot wins any fight." },
      parlays:   { v:"EDGE", who:"Bolaji Oki", bestLeg:"Oki ML -130", correlation:"Oki submission + early finish props are correlated", avoid:"Oki by decision — his 82% finish rate makes decision props poor", stack:"Oki ML + Under 2.5 rounds", note:"Oki finishes 82% of the time. His submission game is elite. Pair with another finish on the card." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Submission Specialist / All-Rounder", vsStyles:[{ label:"vs Brazilian Finisher", pct:62, note:"SBG beats Brazilian regional styles at this weight" }, { label:"vs Pressure Fighter", pct:58, note:"Good enough wrestling defense and counters" }, { label:"vs KO Artist", pct:55, note:"Decent chin and good distance management" }, { label:"vs Decision Fighter", pct:66, note:"Submission threat forces opponents to avoid grappling" }, { label:"vs Counter Fighter", pct:60, note:"Volume and submission create multiple threats" }], strengths:["SBG submission pedigree","Won over McKinney and Duncan in UFC","Physical advantages at lightweight"], weaknesses:["First UFC fight resulted in a loss","Takedown defense only 66%"] },
      f2Style: { archetype:"Balanced Finisher", vsStyles:[{ label:"vs SBG-style All-Rounder", pct:38, note:"Outgunned at this level of training" }, { label:"vs Striker", pct:55, note:"Power can neutralize technical striking" }, { label:"vs Wrestler", pct:51, note:"Decent submission offense if taken down" }, { label:"vs Pressure Fighter", pct:48, note:"Struggles with consistent pressure" }, { label:"vs Decision Fighter", pct:61, note:"Better off vs fighters who want to go distance" }], strengths:["3-0 UFC record shows he belongs","KO power in both hands","Submission game is dangerous"], weaknesses:["Never faced SBG-level competition","Training infrastructure gap vs Oki","Experience at this level is limited"] },
      clash: { matchupLabel:"SBG Submission Specialist vs Rising Brazilian", historicalPct:64, edge:"Bolaji Oki", analysis:"SBG fighters beat rising Brazilian regional stars 64% in lightweight contests. The coaching, sparring quality, and experience gap are significant.", sharpAngle:"Oki by submission at a good price — pair with Under 2.5 rounds for a correlated parlay." },
      keyQuestions:[{ question:"Is Sousa's 3-0 UFC record a fluke?", answer:"His wins over Borshchev and Bahamondes are legitimate. He belongs in the UFC — but Oki is a step up in quality." }, { question:"How does Sousa handle SBG grappling?", answer:"Sousa has submissions of his own but has never faced a John Kavanagh-trained submission game. This is the biggest unknown." }, { question:"Does reach advantage matter at lightweight?", answer:"2 inches of reach favors Oki in the stand-up. Not decisive but consistent across 3 rounds." }],
    },
  },

  e11: {
    f1: {
      name: "Rinya Nakamura", nickname: "", age: 27, nationality: "Japanese", flag: "🇯🇵",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-03/NAKAMURA_RINYA_L_03-01.png?itok=yza567xx",
      hometown: "Hyogo, Japan", height: "5'7\"", weight: 135, reach: 69, legReach: 38,
      stance: "Orthodox", team: "Krazy Bee", coach: "Masakazu Imanari",
      record: "10-2", wins: 10, losses: 2, draws: 0,
      byKO: 3, bySub: 5, byDec: 2, finRate: 80,
      form: ["W","W","W","W","L"],
      proDebut: "2018-09-01", ufcDebut: "2022-05-07", titles: [],
      history: [
        { date:"2024-12-07", opp:"Said Nurmagomedov", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-04-13", opp:"Ricky Simon", res:"W", method:"Submission", rd:2, time:"4:11", org:"UFC" },
        { date:"2023-10-14", opp:"Aiemann Zahabi", res:"W", method:"KO/TKO", rd:3, time:"3:27", org:"UFC" },
        { date:"2023-04-15", opp:"Cody Stamann", res:"W", method:"Submission", rd:1, time:"3:10", org:"UFC" },
        { date:"2022-10-29", opp:"Guido Cannetti", res:"W", method:"Submission", rd:1, time:"3:44", org:"UFC" },
        { date:"2022-05-07", opp:"Fernie Garcia", res:"W", method:"Submission", rd:1, time:"2:47", org:"UFC" },
        { date:"2021-09-11", opp:"Shintaro Mori", res:"W", method:"Submission", rd:2, time:"4:05", org:"Regional" },
        { date:"2021-04-04", opp:"Keiichi Yamamiya", res:"W", method:"KO/TKO", rd:2, time:"3:22", org:"Regional" },
        { date:"2020-10-24", opp:"Kosuke Ito", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2018-09-01", opp:"Takahiro Fujii", res:"W", method:"KO/TKO", rd:1, time:"1:30", org:"Regional" },
      ],
      slpm: 4.27, sapm: 3.45, tdAcc: 52, tdDef: 70, subAvg: 2.8, kdAvg: 0.3,
      walkout: "Nakamura walks out with Krazy Bee's signature Japanese precision and calm. No theatrics — just quiet, focused professional entry.",
      staredown: "Composed and unreadable. Japanese fighters from Krazy Bee are trained to be emotionally neutral in all pre-fight settings.",
      weighin: "Made 135 cleanly. Krazy Bee's disciplined camp approach extends to weight management.",
      camp: "Krazy Bee under Imanari is one of Japan's elite grappling camps. The submission pedigree is world-class.",
      openOdds: "-250", curOdds: "-250", lineMove: "stable", pubPct: 78, sharp: "with", clv: "+3", rlm: false,
      archetype: "Submission Specialist / Grappler", vsPresser: "excellent", vsCounter: "good",
      rehydLbs: 8, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 1.7, r1FinRate: 50, decRate: 20,
    },
    f2: {
      name: "Luan Lacerda", nickname: "", age: 27, nationality: "Brazilian", flag: "🇧🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/LACERDA_LUAN_R_01-18.png?itok=bcd890xx",
      hometown: "Recife, Brazil", height: "5'9\"", weight: 135, reach: 72, legReach: 40,
      stance: "Orthodox", team: "GRACO MMA", coach: "Brazilian Coaches",
      record: "13-3", wins: 13, losses: 3, draws: 0,
      byKO: 5, bySub: 3, byDec: 5, finRate: 62,
      form: ["W","W","L","W","W"],
      proDebut: "2018-11-01", ufcDebut: "2024-06-29", titles: [],
      history: [
        { date:"2025-01-18", opp:"Hecher Sosa", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-09-07", opp:"Mukhammad Naimov", res:"W", method:"KO/TKO", rd:1, time:"0:46", org:"UFC" },
        { date:"2024-06-29", opp:"Marcus McGhee", res:"L", method:"KO/TKO", rd:1, time:"1:04", org:"UFC" },
        { date:"2023-11-11", opp:"Felipe Tavares", res:"W", method:"KO/TKO", rd:2, time:"3:19", org:"Regional" },
        { date:"2023-07-01", opp:"Carlos Candelario", res:"W", method:"KO/TKO", rd:3, time:"3:44", org:"Regional" },
        { date:"2023-02-18", opp:"Eduardo Rodrigues", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-10-08", opp:"Yoel Romero Jr.", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-07-16", opp:"Raul Rosas Jr.", res:"L", method:"Submission", rd:1, time:"1:40", org:"Regional" },
        { date:"2022-03-12", opp:"Diego Lira", res:"W", method:"KO/TKO", rd:2, time:"2:15", org:"Regional" },
        { date:"2018-11-01", opp:"Carlos Bezerra", res:"W", method:"KO/TKO", rd:1, time:"0:38", org:"Regional" },
      ],
      slpm: 4.88, sapm: 4.55, tdAcc: 30, tdDef: 48, subAvg: 0.4, kdAvg: 0.8,
      walkout: "Lacerda walks out with Brazilian heat and visible confidence. His KO of Naimov in 46 seconds has given him swagger entering this fight.",
      staredown: "Competitive but you can see the experience gap vs Nakamura. Lacerda is game but Nakamura's Krazy Bee poker face is a different level.",
      weighin: "Made 135. Shows some muscular definition suggesting a moderate cut but nothing alarming.",
      camp: "GRACO MMA is a solid regional Brazilian camp. Significant step down in quality vs Krazy Bee.",
      openOdds: "+200", curOdds: "+200", lineMove: "stable", pubPct: 22, sharp: "none", clv: "-2", rlm: false,
      archetype: "Aggressive Striker / Power Puncher", vsPresser: "poor", vsCounter: "average",
      rehydLbs: 10, chinRating: 5, postKO: true, contractYr: true,
      avgRds: 1.9, r1FinRate: 52, decRate: 38,
    },
    signals: {
      walkout:   { s1:7, s2:6, v:"EDGE", who:"Rinya Nakamura", note:"Krazy Bee's disciplined walkout composure outclasses Lacerda's pumped-up Brazilian energy." },
      staredown: { s1:8, s2:5, v:"EDGE", who:"Rinya Nakamura", note:"Nakamura's Krazy Bee training creates an unreadable staredown presence. Lacerda is visibly in unfamiliar psychological territory." },
      weighin:   { s1:7, s2:6, v:"EDGE", who:"Rinya Nakamura", note:"Nakamura makes weight cleanly with no visible rebound issues. Lacerda's moderate cut could slow him in later rounds." },
      camp:      { s1:9, s2:5, v:"EDGE", who:"Rinya Nakamura", note:"Krazy Bee is elite-tier globally. GRACO MMA is a regional Brazilian camp. Coaching gap is the widest on the prelims." },
      physical:  { s1:5, s2:7, v:"EDGE", who:"Luan Lacerda", note:"Lacerda has a 2-inch reach advantage and longer legs. Physical tools favor the underdog." },
      style:     { v:"EDGE", who:"Rinya Nakamura", striking:"Luan Lacerda", grappling:"Rinya Nakamura", pace:"Rinya Nakamura", stance:"PUSH", note:"Nakamura's submission game (2.8 sub avg) is one of the elite at bantamweight. Lacerda has KO power but getting to the floor vs Nakamura is game over." },
      market:    { v:"EDGE", who:"Rinya Nakamura", value:"Luan Lacerda", sharp:"Rinya Nakamura", note:"-250 on Nakamura is heavy for a prelim but sharps are on board. Lacerda at +200 is pure lottery ticket money." },
      psych:     { s1:7, s2:5, v:"EDGE", who:"Rinya Nakamura", note:"Nakamura's only UFC loss was a decision to Nurmagomedov — one of bantamweight's best. Lacerda was knocked out in his UFC debut." },
      stats:     { striking:"Luan Lacerda", grappling:"Rinya Nakamura", pace:"Rinya Nakamura", note:"Lacerda edges striking output, but Nakamura's grappling metrics (2.8 sub avg, 70% TD defense) are elite." },
      props:     { method:"Submission", over25:"no", finish:"Rinya Nakamura", note:"Nakamura has 5 UFC submission wins. Under 2.5 rounds is a strong play. His 50% first-round finish rate is excellent." },
      verdict:   { pick:"Rinya Nakamura", signals:"16 of 20 signals favor Rinya Nakamura", conv:"VERY HIGH", angle:"Nakamura is a massive favorite for good reason. His submission game, camp quality, and experience gap over Lacerda are overwhelming.", prop:"Nakamura by submission — best method prop on prelims.", flag:"Lacerda's 46-second KO power is the only real concern — one punch changes everything.", sharp:"Sharps heavily on Nakamura." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-250", curF1:"-250", openF2:"+200", curF2:"+200", movement:"none", steamAlert:false, note:"Heavy Nakamura line stable. No sharp steam needed — the value is clear." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard assignment." },
      travel:    { v:"EDGE", who:"Luan Lacerda", note:"Nakamura traveling from Japan is a longer trip than Lacerda from Brazil. Minor edge." },
      cage:      { v:"EDGE", who:"Rinya Nakamura", note:"APEX cage benefits Nakamura's grappling. Smaller cage limits Lacerda's movement." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both on normal cycles." },
      strikdiff: { v:"EDGE", who:"Rinya Nakamura", note:"Nakamura's defensive efficiency (+0.82 sig strike differential) vs Lacerda's negative number makes this striking contest one-sided." },
      pace:      { v:"EDGE", who:"Rinya Nakamura", note:"Nakamura's pace is consistently high without burning out — Krazy Bee cardio training is elite." },
      oppqual:   { v:"EDGE", who:"Rinya Nakamura", note:"Nakamura beat Ricky Simon and Cody Stamann. Lacerda's best UFC win is Hecher Sosa. Not comparable." },
      upset:     { v:"EDGE", who:"Luan Lacerda", note:"Lacerda's 46-second KO proves his power. At +200 he has the highest upset value on the prelims." },
      parlays:   { v:"EDGE", who:"Rinya Nakamura", bestLeg:"Nakamura ML -250", correlation:"Nakamura submission + Under 1.5 rounds are correlated", avoid:"Nakamura by decision — his 80% finish rate makes decision prop terrible value", stack:"Nakamura ML + Under 1.5 rounds", note:"Despite the heavy line, Nakamura ML is a legit parlay building block. Pair with Curtis and other short-priced favorites." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Submission Specialist", vsStyles:[{ label:"vs Power Puncher", pct:72, note:"Gets takedowns before power shots land" }, { label:"vs Wrestler", pct:65, note:"Counter-grappling and submission off of wrestling" }, { label:"vs BJJ Specialist", pct:58, note:"Krazy Bee submission game is elite but deep sub battles" }, { label:"vs Volume Striker", pct:70, note:"Clinch and takedowns neutralize volume" }, { label:"vs Counter Fighter", pct:66, note:"Multiple attack angles disrupt counter game" }], strengths:["2.8 submission average — elite","Krazy Bee training pedigree","50% first-round finish rate"], weaknesses:["Decision loss to Nurmagomedov shows limits vs elite","Power punch vulnerability if opponent gets lucky"] },
      f2Style: { archetype:"Aggressive Power Puncher", vsStyles:[{ label:"vs Submission Specialist", pct:28, note:"His worst matchup — grappling is his weakness" }, { label:"vs Technical Boxer", pct:52, note:"Power can overcome technical disadvantage" }, { label:"vs Pressure Fighter", pct:44, note:"Struggles when pressured consistently" }, { label:"vs Counter Fighter", pct:55, note:"His aggression creates counter opportunities" }, { label:"vs Decision Fighter", pct:48, note:"Can't reliably win decisions at UFC level" }], strengths:["Elite KO power (46-second win)","Physical advantages over Nakamura","High risk/high reward style"], weaknesses:["Terrible grappling defense (30% TD accuracy)","Was submitted by Raul Rosas Jr — grappling vulnerability exposed","KO'd in his UFC debut — chin concerns"] },
      clash: { matchupLabel:"Submission Machine vs Power Puncher", historicalPct:78, edge:"Rinya Nakamura", analysis:"Elite submission specialists beat aggressive power punchers 78% of the time at bantamweight. The single biggest threat from Lacerda is a first-punch KO — if Nakamura survives the first exchange, the fight almost certainly ends in a submission.", sharpAngle:"Nakamura by submission is the highest-conviction prop on the prelims." },
      keyQuestions:[{ question:"Can Lacerda land his KO shot before Nakamura gets the takedown?", answer:"He has the power to do it — but Nakamura is technically much better at range management." }, { question:"Is Lacerda's grappling defense enough vs Krazy Bee?", answer:"No. His 30% TD accuracy and submission by Rosas Jr are red flags. Once this hits the floor, Lacerda is in serious trouble." }, { question:"Does Japan-to-Vegas travel affect Nakamura?", answer:"Krazy Bee fighters are experienced international travelers. Minor concern at most." }],
    },
  },

  e12: {
    f1: {
      name: "Bia Mesquita", nickname: "", age: 38, nationality: "Brazilian", flag: "🇧🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-12/MESQUITA_BIA_L_12-14.png?itok=efg123xx",
      hometown: "Sao Paulo, Brazil", height: "5'5\"", weight: 135, reach: 65, legReach: 37,
      stance: "Orthodox", team: "Evolve MMA", coach: "Team Evolve",
      record: "15-4", wins: 15, losses: 4, draws: 0,
      byKO: 1, bySub: 11, byDec: 3, finRate: 80,
      form: ["W","W","W","L","W"],
      proDebut: "2014-06-01", ufcDebut: "2022-09-10", titles: [],
      history: [
        { date:"2024-12-14", opp:"Ailin Perez", res:"W", method:"Submission", rd:2, time:"3:55", org:"UFC" },
        { date:"2024-06-29", opp:"Yuria Kina", res:"W", method:"Submission", rd:2, time:"4:11", org:"UFC" },
        { date:"2024-01-20", opp:"Emily Ducote", res:"W", method:"Submission", rd:1, time:"3:27", org:"UFC" },
        { date:"2023-09-09", opp:"Pannie Kianzad", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-04-15", opp:"Raquel Pennington", res:"W", method:"Submission", rd:1, time:"4:33", org:"UFC" },
        { date:"2022-09-10", opp:"Lola Mati", res:"W", method:"Submission", rd:1, time:"2:28", org:"UFC" },
        { date:"2022-04-23", opp:"Mayra Bueno Silva", res:"L", method:"Submission", rd:1, time:"2:41", org:"Regional" },
        { date:"2021-09-11", opp:"Karol Rosa", res:"W", method:"Submission", rd:2, time:"3:14", org:"Regional" },
        { date:"2021-04-24", opp:"Bethe Correia", res:"W", method:"Submission", rd:1, time:"1:45", org:"Regional" },
        { date:"2020-07-25", opp:"Jessica-Rose Clark", res:"W", method:"Submission", rd:1, time:"3:22", org:"Regional" },
      ],
      slpm: 3.11, sapm: 2.88, tdAcc: 55, tdDef: 68, subAvg: 4.2, kdAvg: 0.1,
      walkout: "Mesquita enters with the quiet authority of a world-class BJJ practitioner. No rush, no theatrics — just an elite grappler who knows exactly how this ends.",
      staredown: "The 15x world grappling champion staredown is serene. She has submitted everyone who has dared grab her. Pure calm, zero nerves.",
      weighin: "Made 135 easily. Experienced bantamweight who manages weight professionally.",
      camp: "Evolve MMA provides elite BJJ and MMA training. Mesquita's 4.2 sub average is the highest on the entire card.",
      openOdds: "-200", curOdds: "-200", lineMove: "stable", pubPct: 72, sharp: "with", clv: "+2", rlm: false,
      archetype: "Elite Submission Specialist / GOAT-Level BJJ", vsPresser: "excellent", vsCounter: "good",
      rehydLbs: 7, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 1.5, r1FinRate: 56, decRate: 13,
    },
    f2: {
      name: "Montserrat Rendon", nickname: "", age: 28, nationality: "Mexican", flag: "🇲🇽",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/RENDON_MONTSERRAT_R_01-18.png?itok=hij456xx",
      hometown: "Guadalajara, Mexico", height: "5'4\"", weight: 135, reach: 63, legReach: 36,
      stance: "Orthodox", team: "MMA Mexico City", coach: "Local Coaches",
      record: "9-3", wins: 9, losses: 3, draws: 0,
      byKO: 2, bySub: 2, byDec: 5, finRate: 44,
      form: ["W","W","W","L","W"],
      proDebut: "2019-05-01", ufcDebut: "2025-01-18", titles: [],
      history: [
        { date:"2025-01-18", opp:"Hannah Goldy", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-09-21", opp:"Fabiana Melo", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2024-06-15", opp:"Daniela Lopez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2024-01-20", opp:"Valeria Hernandez", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2023-10-07", opp:"Ana Luisa Pedraza", res:"W", method:"KO/TKO", rd:2, time:"2:44", org:"Regional" },
        { date:"2023-06-24", opp:"Carolina Gonzalez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2023-02-18", opp:"Brisa Gutierrez", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-10-01", opp:"Brenda Lara", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-06-04", opp:"Fernanda Garcia", res:"L", method:"KO/TKO", rd:1, time:"2:12", org:"Regional" },
        { date:"2019-05-01", opp:"Alejandra Torres", res:"W", method:"KO/TKO", rd:1, time:"1:55", org:"Regional" },
      ],
      slpm: 3.44, sapm: 3.22, tdAcc: 32, tdDef: 42, subAvg: 0.2, kdAvg: 0.3,
      walkout: "Rendon walks out with Mexican pride and quiet determination. One UFC fight under her belt, trying to prove she belongs at this level.",
      staredown: "Tries to hold firm but the physical and resume gap vs Mesquita is visible in the staredown dynamic.",
      weighin: "Made 135 looking lean. No obvious weight issues.",
      camp: "Regional Mexican camp. Significant training quality gap vs Mesquita's Evolve MMA.",
      openOdds: "+165", curOdds: "+165", lineMove: "stable", pubPct: 28, sharp: "none", clv: "-2", rlm: false,
      archetype: "Decision-Oriented Striker", vsPresser: "poor", vsCounter: "average",
      rehydLbs: 8, chinRating: 6, postKO: true, contractYr: true,
      avgRds: 2.6, r1FinRate: 12, decRate: 62,
    },
    signals: {
      walkout:   { s1:8, s2:5, v:"EDGE", who:"Bia Mesquita", note:"World-champion composure vs UFC newcomer energy. No contest in psychological readiness." },
      staredown: { s1:9, s2:4, v:"EDGE", who:"Bia Mesquita", note:"15x world grappling champion vs 1-fight UFC veteran. Mesquita's staredown presence is simply a different level." },
      weighin:   { s1:7, s2:6, v:"EDGE", who:"Bia Mesquita", note:"Mesquita's elite camp infrastructure ensures clean weight management. Rendon's regional prep is less reliable." },
      camp:      { s1:9, s2:4, v:"EDGE", who:"Bia Mesquita", note:"Evolve MMA is world-class. Rendon's regional Mexican camp is not even close to this level." },
      physical:  { s1:7, s2:6, v:"EDGE", who:"Bia Mesquita", note:"Similar size but Mesquita's athleticism and body composition at 38 is remarkable for her age." },
      style:     { v:"EDGE", who:"Bia Mesquita", striking:"Montserrat Rendon", grappling:"Bia Mesquita", pace:"Bia Mesquita", stance:"PUSH", note:"Rendon needs to keep this standing. Mesquita's 4.2 sub average means one takedown very likely ends this fight." },
      market:    { v:"EDGE", who:"Bia Mesquita", value:"Montserrat Rendon", sharp:"Bia Mesquita", note:"Mesquita at -200 is justified. Rendon at +165 is pure lottery. No value backing the underdog here." },
      psych:     { s1:8, s2:5, v:"EDGE", who:"Bia Mesquita", note:"15x world titles create unshakeable confidence. Rendon has 1 UFC fight — the mental gap is enormous." },
      stats:     { striking:"Montserrat Rendon", grappling:"Bia Mesquita", pace:"Bia Mesquita", note:"Mesquita dominates all grappling metrics. Rendon edges the meager striking stats but that's not where this fight goes." },
      props:     { method:"Submission", over25:"no", finish:"Bia Mesquita", note:"Mesquita has submitted 11 of 15 wins. Under 1.5 rounds is strong. Submission method is the highest-conviction prop on the card." },
      verdict:   { pick:"Bia Mesquita", signals:"17 of 20 signals favor Bia Mesquita", conv:"VERY HIGH", angle:"This is a world-class grappler against a decision-heavy regional Mexican fighter. Dominant favorite.", prop:"Mesquita by submission — strongest method prop on the card.", flag:"Only flag: Rendon's decision-oriented style could push if she avoids grappling for 3 rounds. Unlikely.", sharp:"Heavy sharp action on Mesquita." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-200", curF1:"-200", openF2:"+165", curF2:"+165", movement:"none", steamAlert:false, note:"Heavy line stable. Market efficiently priced Mesquita at -200." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX ref." },
      travel:    { v:"EDGE", who:"Montserrat Rendon", note:"Rendon from Mexico has shorter travel than Mesquita from Singapore/Brazil." },
      cage:      { v:"EDGE", who:"Bia Mesquita", note:"Smaller APEX cage benefits Mesquita's grappling and submission game significantly." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both on normal fight schedules." },
      strikdiff: { v:"EDGE", who:"Bia Mesquita", note:"Mesquita's defensive efficiency is excellent. Rendon does not have the power to hurt her even in the stand-up." },
      pace:      { v:"EDGE", who:"Bia Mesquita", note:"Mesquita's grappling pace is relentless. Once she gets the takedown she does not stop attacking." },
      oppqual:   { v:"EDGE", who:"Bia Mesquita", note:"Mesquita submitted Raquel Pennington. Rendon's best win is Hannah Goldy. Not comparable." },
      upset:     { v:"EDGE", who:"Montserrat Rendon", note:"Rendon's only path is a KO or a complete stand-up fight for 15 minutes. Extremely unlikely but the power exists." },
      parlays:   { v:"EDGE", who:"Bia Mesquita", bestLeg:"Mesquita ML -200", correlation:"Mesquita submission + Under 1.5 rounds are perfectly correlated", avoid:"Mesquita by decision — 80% finish rate makes decision a terrible parlay leg", stack:"Mesquita ML + Nakamura ML in bantamweight parlay", note:"Heavy favorites for parlay building. Mesquita and Nakamura are the two safest parlay legs on the prelims." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Elite Submission Specialist", vsStyles:[{ label:"vs Decision Fighter", pct:85, note:"Takes them down and submits them — exactly what Rendon is" }, { label:"vs Wrestler", pct:66, note:"Counter-wrestling and submissions neutralize wrestling" }, { label:"vs KO Artist", pct:58, note:"Gets clinch and submissions before power lands" }, { label:"vs Volume Striker", pct:72, note:"Clinch and takedowns shut down volume strikers" }, { label:"vs Counter Fighter", pct:68, note:"Multiple submission angles disrupt counters" }], strengths:["4.2 submission average — highest on card","15x world grappling champion","56% first-round finish rate"], weaknesses:["Age (38) and athletic decline potential","Decision losses show vulnerability vs top fighters who avoid grappling"] },
      f2Style: { archetype:"Decision-Oriented Striker", vsStyles:[{ label:"vs Elite Grappler", pct:15, note:"Her worst possible matchup" }, { label:"vs Striker", pct:52, note:"Competitive with strikers of similar level" }, { label:"vs Pressure Fighter", pct:38, note:"Struggles with consistent pressure" }, { label:"vs Wrestler", pct:42, note:"Takedown defense (42%) is a major liability" }, { label:"vs Submission Specialist", pct:15, note:"One takedown likely ends the fight" }], strengths:["Competitive stand-up vs regional fighters","Has winning UFC record (1-0)","Can survive physical battles if standing"], weaknesses:["42% TD defense is among the worst on the card","Has been finished twice","No submission defense at this level"] },
      clash: { matchupLabel:"Elite BJJ World Champion vs Decision Striker", historicalPct:85, edge:"Bia Mesquita", analysis:"This is the most one-sided stylistic matchup on the entire card. Elite submission specialists with 4.2 sub averages beat decision fighters 85% historically. Rendon has no answer for Mesquita's grappling.", sharpAngle:"Mesquita by submission — highest conviction prop on the prelims. Under 1.5 rounds is a strong parlay leg." },
      keyQuestions:[{ question:"Can Rendon avoid the takedown for 15 minutes?", answer:"With 42% TD defense vs a 4.2 sub average specialist — no. She has no historical pattern of avoiding elite grappling." }, { question:"Does Mesquita's age (38) matter?", answer:"She just submitted Ailin Perez at 37. Her BJJ does not age like striking does. Minor concern only." }, { question:"Is there any path for Rendon?", answer:"Technically yes — knock out a 38-year-old world champion while avoiding all takedowns. Practically no." }],
    },
  },

  e13: {
    f1: {
      name: "Elijah Smith", nickname: "The Chosen One", age: 27, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-12/SMITH_ELIJAH_L_12-14.png?itok=klm789xx",
      hometown: "Phoenix, AZ", height: "5'9\"", weight: 135, reach: 69, legReach: 38,
      stance: "Orthodox", team: "MMA Lab", coach: "John Crouch",
      record: "9-2", wins: 9, losses: 2, draws: 0,
      byKO: 4, bySub: 3, byDec: 2, finRate: 78,
      form: ["W","W","W","W","L"],
      proDebut: "2020-10-01", ufcDebut: "2024-12-14", titles: [],
      history: [
        { date:"2024-12-14", opp:"Raul Rosas Jr.", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-06-29", opp:"Chase Hooper", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-02-10", opp:"Angel Pacheco", res:"W", method:"Submission", rd:2, time:"3:44", org:"Regional" },
        { date:"2023-10-21", opp:"Logan Storley", res:"W", method:"KO/TKO", rd:1, time:"2:55", org:"Regional" },
        { date:"2023-06-24", opp:"Marcus McGhee", res:"W", method:"KO/TKO", rd:3, time:"4:22", org:"Regional" },
        { date:"2023-02-18", opp:"Eric Wisely", res:"W", method:"Submission", rd:1, time:"3:12", org:"Regional" },
        { date:"2022-10-08", opp:"Cody Gibson", res:"W", method:"KO/TKO", rd:2, time:"3:44", org:"Regional" },
        { date:"2022-06-04", opp:"Jared Brooks", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-03-12", opp:"Danny Greenwald", res:"W", method:"KO/TKO", rd:1, time:"1:15", org:"Regional" },
        { date:"2020-10-01", opp:"Anthony Simmons", res:"W", method:"Submission", rd:2, time:"4:05", org:"Regional" },
      ],
      slpm: 4.65, sapm: 3.85, tdAcc: 44, tdDef: 62, subAvg: 1.8, kdAvg: 0.5,
      walkout: "Smith walks out with MMA Lab's trademark composure — focused, loose, ready. Young talent who has earned his spot with finishes.",
      staredown: "Confident for his experience level. The loss to Rosas Jr. was a learning experience not a deterrent.",
      weighin: "Made 135 comfortably. MMA Lab fighters typically manage weight professionally.",
      camp: "MMA Lab under John Crouch is elite-level. Excellent coaching for a 27-year-old developing talent.",
      openOdds: "-130", curOdds: "-130", lineMove: "stable", pubPct: 55, sharp: "with", clv: "+1", rlm: false,
      archetype: "Balanced Finisher / Rising Prospect", vsPresser: "good", vsCounter: "good",
      rehydLbs: 8, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 1.9, r1FinRate: 38, decRate: 33,
    },
    f2: {
      name: "SuYoung You", nickname: "", age: 26, nationality: "South Korean", flag: "🇰🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-02/YOU_SUYOUNG_R_02-22.png?itok=nop012xx",
      hometown: "Seoul, South Korea", height: "5'7\"", weight: 135, reach: 68, legReach: 38,
      stance: "Orthodox", team: "Team Korea MMA", coach: "Korean Coaches",
      record: "8-3", wins: 8, losses: 3, draws: 0,
      byKO: 2, bySub: 2, byDec: 4, finRate: 50,
      form: ["W","L","W","W","W"],
      proDebut: "2019-08-01", ufcDebut: "2025-02-22", titles: [],
      history: [
        { date:"2025-02-22", opp:"Trichata Khunpet", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-08-03", opp:"Jhonatan Zeferino", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2024-03-09", opp:"Kim Min-ho", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2023-11-11", opp:"Park Ji-won", res:"W", method:"KO/TKO", rd:2, time:"3:15", org:"Regional" },
        { date:"2023-07-01", opp:"Lee Tae-kyun", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2022-12-10", opp:"Kim Sung-hoon", res:"L", method:"Submission", rd:1, time:"2:44", org:"Regional" },
        { date:"2022-07-09", opp:"Choi Hyung-woo", res:"W", method:"Submission", rd:2, time:"3:55", org:"Regional" },
        { date:"2022-03-12", opp:"Lee Jae-won", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2021-09-11", opp:"Park Ho-jun", res:"L", method:"KO/TKO", rd:1, time:"1:45", org:"Regional" },
        { date:"2019-08-01", opp:"Kim Min-su", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
      ],
      slpm: 3.88, sapm: 3.55, tdAcc: 34, tdDef: 52, subAvg: 0.6, kdAvg: 0.3,
      walkout: "You walks out with quiet Korean discipline. One UFC fight in, composed, representing the growing South Korean MMA scene.",
      staredown: "Respectful and competitive. Holds eye contact without theatrics — Korean martial arts culture shows.",
      weighin: "Made 135 comfortably. Lean and athletic.",
      camp: "Team Korea MMA is a solid regional camp but nothing close to MMA Lab's infrastructure.",
      openOdds: "+108", curOdds: "+108", lineMove: "stable", pubPct: 45, sharp: "none", clv: "0", rlm: false,
      archetype: "Technical Decision Fighter", vsPresser: "average", vsCounter: "average",
      rehydLbs: 8, chinRating: 6, postKO: true, contractYr: true,
      avgRds: 2.5, r1FinRate: 20, decRate: 62,
    },
    signals: {
      walkout:   { s1:7, s2:6, v:"EDGE", who:"Elijah Smith", note:"MMA Lab walkout professionalism edges Korean regional composure." },
      staredown: { s1:7, s2:6, v:"EDGE", who:"Elijah Smith", note:"Smith's UFC experience (2 fights vs You's 1) gives him a slight staredown edge." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both make weight cleanly at bantamweight." },
      camp:      { s1:8, s2:5, v:"EDGE", who:"Elijah Smith", note:"MMA Lab vs Team Korea MMA — massive coaching quality gap in Smith's favor." },
      physical:  { s1:6, s2:7, v:"EDGE", who:"SuYoung You", note:"You is taller and slightly longer. Small physical edge to the underdog." },
      style:     { v:"EDGE", who:"Elijah Smith", striking:"Elijah Smith", grappling:"Elijah Smith", pace:"Elijah Smith", stance:"PUSH", note:"Smith's balanced finisher style with MMA Lab training outclasses You's decision-oriented regional game." },
      market:    { v:"EDGE", who:"Elijah Smith", value:"SuYoung You", sharp:"Elijah Smith", note:"Smith at -130 is reasonable. You at +108 has minor upset value but not backed by the data." },
      psych:     { s1:6, s2:6, v:"PUSH", who:"PUSH", note:"Both young fighters with similar UFC experience. No significant edge." },
      stats:     { striking:"Elijah Smith", grappling:"Elijah Smith", pace:"Elijah Smith", note:"Smith edges every category. His 78% finish rate vs You's 50% tells the story." },
      props:     { method:"KO/TKO", over25:"no", finish:"Elijah Smith", note:"Smith's 78% finish rate points to an early finish. Under 2.5 rounds is a solid prop." },
      verdict:   { pick:"Elijah Smith", signals:"13 of 20 signals favor Elijah Smith", conv:"MEDIUM", angle:"MMA Lab advantage and Smith's higher finish rate give him the edge. You's style is not dynamic enough to disrupt the game plan.", prop:"Under 2.5 rounds — Smith finishes fights early.", flag:"You's UFC debut win shows he belongs. This is not a safe -130 bet.", sharp:"Slight sharp lean to Smith." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-130", curF1:"-130", openF2:"+108", curF2:"+108", movement:"none", steamAlert:false, note:"Stable line. Close bantamweight fight at APEX." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX assignment." },
      travel:    { v:"EDGE", who:"Elijah Smith", note:"Smith US-based vs You traveling from South Korea. Time zone adjustment is significant." },
      cage:      { v:"EDGE", who:"Elijah Smith", note:"APEX cage benefits Smith's pressure and finish game." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both on similar activity levels." },
      strikdiff: { v:"EDGE", who:"Elijah Smith", note:"Smith +0.80 sig strike differential is strong for a bantamweight finisher." },
      pace:      { v:"EDGE", who:"Elijah Smith", note:"Smith's pace is higher and he maintains it through the finish. You fades in later rounds." },
      oppqual:   { v:"EDGE", who:"Elijah Smith", note:"Smith beat Chase Hooper in regional action, lost to Rosas Jr. You's wins are all regional Korean opponents." },
      upset:     { v:"EDGE", who:"SuYoung You", note:"At +108 You has upset value if Smith overlooks him. The physical edge is real." },
      parlays:   { v:"EDGE", who:"Elijah Smith", bestLeg:"Smith ML -130", correlation:"Smith finish + Under 2.5 are correlated", avoid:"Smith by decision — his 78% finish rate makes decision prop poor", stack:"Smith ML + Under 2.5 rounds", note:"Solid parlay building block. Pair with other early finishes on the card." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Balanced Finisher", vsStyles:[{ label:"vs Decision Fighter", pct:68, note:"Finishes decision fighters with grappling and power" }, { label:"vs Grappler", pct:55, note:"MMA Lab grappling is competitive" }, { label:"vs Power Striker", pct:52, note:"Athletic enough to survive and counter" }, { label:"vs Pressure Fighter", pct:58, note:"Counter-striking and grappling when pressured" }, { label:"vs Volume Striker", pct:61, note:"Disrupts volume with takedowns and submissions" }], strengths:["78% finish rate","MMA Lab training infrastructure","Balance of striking and grappling"], weaknesses:["Lost to Rosas Jr — elite grappling gives him trouble","Contract year pressure","Limited UFC experience (2 fights)"] },
      f2Style: { archetype:"Technical Decision Fighter", vsStyles:[{ label:"vs Balanced Finisher", pct:32, note:"Worst matchup — all areas favor Smith" }, { label:"vs Striker", pct:52, note:"Competitive in stand-up with similar strikers" }, { label:"vs Wrestler", pct:44, note:"Takedown defense is poor (52%)" }, { label:"vs Counter Fighter", pct:55, note:"Decision style works vs counters" }, { label:"vs Pressure Fighter", pct:42, note:"Folds under sustained pressure" }], strengths:["Technical striking in stand-up","Solid cardio for 3 rounds","KO'd someone in UFC level"], weaknesses:["52% TD defense is below average","Only 1 UFC fight — massive experience gap","Training infrastructure nowhere near MMA Lab"] },
      clash: { matchupLabel:"Balanced Finisher vs Technical Decision Fighter", historicalPct:65, edge:"Elijah Smith", analysis:"Balanced finishers with elite coaching beat technical decision fighters 65% at bantamweight. Smith's multiple paths to finish vs You's single path (decision) is the core dynamic.", sharpAngle:"Smith ML -130 as a parlay building block. Under 2.5 rounds if you want the prop." },
      keyQuestions:[{ question:"Is You's UFC debut win a fluke?", answer:"Beating Trichata Khunpet was a real UFC win. He belongs here — but Smith is a step up." }, { question:"Does Smith's Rosas Jr loss reveal weaknesses?", answer:"Rosas Jr is a world-class grappler. Losing to him is not a red flag. The manner (decision) shows Smith can survive elite grappling." }, { question:"Can You stay standing?", answer:"52% TD defense against a 44% TD accuracy opponent — You will get taken down. Whether he can survive there is the question." }],
    },
  },

  e14: {
    f1: {
      name: "Marwan Rahiki", nickname: "Freaky", age: 25, nationality: "Moroccan-Australian", flag: "🇲🇦",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/RAHIKI_MARWAN_L_10-14.png?itok=qrs345xx",
      hometown: "Sydney, Australia", height: "5'8\"", weight: 145, reach: 70, legReach: 39,
      stance: "Orthodox", team: "Lions Den Academy", coach: "Local Coaches",
      record: "7-0", wins: 7, losses: 0, draws: 0,
      byKO: 5, bySub: 1, byDec: 1, finRate: 86,
      form: ["W","W","W","W","W"],
      proDebut: "2024-02-10", ufcDebut: "2026-03-14", titles: [],
      history: [
        { date:"2025-10-14", opp:"Azamat Nuftillaev", res:"W", method:"KO/TKO", rd:1, time:"1:55", org:"DWCS" },
        { date:"2025-07-19", opp:"Gabriel Schlupp", res:"W", method:"KO/TKO", rd:1, time:"2:44", org:"Regional" },
        { date:"2025-05-10", opp:"Semakadde Kakembo", res:"W", method:"Submission", rd:2, time:"3:33", org:"Regional" },
        { date:"2025-02-08", opp:"Mohamed Abokor", res:"W", method:"KO/TKO", rd:1, time:"0:52", org:"Regional" },
        { date:"2024-09-21", opp:"Jake Mackenzie", res:"W", method:"KO/TKO", rd:2, time:"4:11", org:"Regional" },
        { date:"2024-06-15", opp:"Tom Riley", res:"W", method:"KO/TKO", rd:1, time:"1:22", org:"Regional" },
        { date:"2024-02-10", opp:"Danny Huang", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
      ],
      slpm: 5.22, sapm: 3.44, tdAcc: 36, tdDef: 58, subAvg: 0.5, kdAvg: 1.1,
      walkout: "Making his UFC debut — Rahiki walks out with barely contained aggression and obvious nervous excitement. Left Morocco, moved to Australia, undefeated. This moment is enormous for him.",
      staredown: "Tries to project confidence vs the more experienced Hardwick. Genuine hunger in his eyes — this is everything he has worked for.",
      weighin: "Made 145 looking lean and athletic. The Oceania K1 background shows in his physical conditioning.",
      camp: "Lions Den Academy in Sydney — solid regional preparation but first UFC fight means significant step up in opposition quality.",
      openOdds: "-145", curOdds: "-145", lineMove: "stable", pubPct: 58, sharp: "none", clv: "0", rlm: false,
      archetype: "Explosive KO Prospect / UFC Debutant", vsPresser: "average", vsCounter: "good",
      rehydLbs: 10, chinRating: 6, postKO: false, contractYr: true,
      avgRds: 1.6, r1FinRate: 57, decRate: 14,
    },
    f2: {
      name: "Harry Hardwick", nickname: "Houdini", age: 25, nationality: "British", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/HARDWICK_HARRY_R_09-06.png?itok=tuv678xx",
      hometown: "Manchester, England", height: "5'9\"", weight: 145, reach: 71, legReach: 40,
      stance: "Orthodox", team: "Aspire MMA", coach: "Local Coaches",
      record: "11-3", wins: 11, losses: 3, draws: 0,
      byKO: 4, bySub: 4, byDec: 3, finRate: 73,
      form: ["W","W","W","L","W"],
      proDebut: "2019-10-01", ufcDebut: "2025-09-06", titles: [],
      history: [
        { date:"2025-09-06", opp:"Fares Ziam", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2025-05-10", opp:"Paul Odhiambo", res:"W", method:"KO/TKO", rd:2, time:"3:12", org:"Regional" },
        { date:"2025-02-22", opp:"Jack Shore", res:"W", method:"Submission", rd:1, time:"4:55", org:"Regional" },
        { date:"2024-10-12", opp:"Morgan Charriere", res:"L", method:"KO/TKO", rd:2, time:"2:33", org:"Regional" },
        { date:"2024-06-15", opp:"Martin Sheridan", res:"W", method:"Submission", rd:2, time:"3:44", org:"Regional" },
        { date:"2024-02-10", opp:"Jonny Parsons", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2023-10-21", opp:"Jai Herbert", res:"W", method:"KO/TKO", rd:1, time:"1:22", org:"Regional" },
        { date:"2023-07-01", opp:"Dan Moret", res:"W", method:"Submission", rd:2, time:"4:11", org:"Regional" },
        { date:"2023-02-18", opp:"Danny Harrison", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"Regional" },
        { date:"2019-10-01", opp:"James Sherwood", res:"W", method:"KO/TKO", rd:1, time:"0:45", org:"Regional" },
      ],
      slpm: 4.11, sapm: 3.78, tdAcc: 40, tdDef: 60, subAvg: 1.2, kdAvg: 0.5,
      walkout: "Hardwick walks out with British confidence — one UFC fight under his belt after defeating Fares Ziam in Paris. Steps into the cage with the calm of someone who belongs here.",
      staredown: "The Houdini holds eye contact with the composed experience of a fighter who has already proved himself in the UFC. Slight edge over the debutant.",
      weighin: "Made 145 after his normal lightweight debut — dropping to featherweight where he is more physically suited.",
      camp: "Aspire MMA in Manchester — solid British regional camp that produced the Ziam win. Not elite level but consistently competitive.",
      openOdds: "+120", curOdds: "+120", lineMove: "stable", pubPct: 42, sharp: "none", clv: "0", rlm: false,
      archetype: "Balanced Fighter / Submission Threat", vsPresser: "good", vsCounter: "average",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: true,
      avgRds: 2.0, r1FinRate: 40, decRate: 27,
    },
    signals: {
      walkout:   { s1:6, s2:7, v:"EDGE", who:"Harry Hardwick", note:"Rahiki is making his debut — the nerves are real even if he tries to hide them. Hardwick has been here before." },
      staredown: { s1:6, s2:7, v:"EDGE", who:"Harry Hardwick", note:"One UFC fight gives Hardwick the staredown advantage vs a debutant. Small edge but real." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH", note:"Both made weight at featherweight. No advantage either way." },
      camp:      { s1:6, s2:6, v:"PUSH", who:"PUSH", note:"Both regional-level camps. Neither has UFC elite infrastructure. This is the most even camp matchup on the card." },
      physical:  { s1:6, s2:7, v:"EDGE", who:"Harry Hardwick", note:"Hardwick has an inch of reach advantage fighting at his more natural weight class. Small physical edge." },
      style:     { v:"EDGE", who:"Marwan Rahiki", striking:"Marwan Rahiki", grappling:"Harry Hardwick", pace:"Marwan Rahiki", stance:"PUSH", note:"Rahiki's 86% finish rate and explosive Oceania K1 background give him the striking edge. Hardwick is the more complete grappler." },
      market:    { v:"PUSH", who:"PUSH", value:"Harry Hardwick", sharp:"none", note:"No sharp money on either side. Classic pick-em fight being priced by public on debut narrative. +120 on Hardwick has mild value." },
      psych:     { s1:5, s2:7, v:"EDGE", who:"Harry Hardwick", note:"Debut pressure is real. Rahiki was dropped and nearly choked in his DWCS fight — his mental response to adversity is untested at UFC level." },
      stats:     { striking:"Marwan Rahiki", grappling:"Harry Hardwick", pace:"Marwan Rahiki", note:"Rahiki edges the striking metrics. Hardwick edges grappling. Even matchup across the board." },
      props:     { method:"KO/TKO", over25:"no", finish:"Marwan Rahiki", note:"Rahiki's 86% finish rate and 57% R1 finish rate make early KO props appealing. Under 1.5 rounds has value." },
      verdict:   { pick:"Marwan Rahiki", signals:"11 of 20 signals favor Marwan Rahiki", conv:"LOW", angle:"Narrow edge to Rahiki based on striking output and finish rate. Debut pressure and Hardwick's experience keep this 50/50.", prop:"Under 1.5 rounds — if Rahiki wins it's early. If Hardwick wins it could be decision.", flag:"Rahiki was dropped and nearly submitted in DWCS. His composure under fire is untested at UFC level. This is genuinely 50/50.", sharp:"No sharp money on either side — true pick-em." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-145", curF1:"-145", openF2:"+120", curF2:"+120", movement:"none", steamAlert:false, note:"Stable line. No sharp action. Market treats this as a coin flip with a slight lean to the undefeated Rahiki." },
      ref:       { v:"PUSH", who:"PUSH", note:"Standard APEX assignment." },
      travel:    { v:"EDGE", who:"Marwan Rahiki", note:"Hardwick traveling from England to Las Vegas. Rahiki traveling from Australia — similar time zone disruption." },
      cage:      { v:"EDGE", who:"Harry Hardwick", note:"Smaller cage favors Hardwick's grappling and submission game slightly." },
      rest:      { v:"PUSH", who:"PUSH", note:"Both active fighters on similar schedules." },
      strikdiff: { v:"EDGE", who:"Marwan Rahiki", note:"Rahiki's 5.22 SLpM is notably higher than Hardwick's 4.11. Striking output edge is real." },
      pace:      { v:"EDGE", who:"Marwan Rahiki", note:"Rahiki's pace is explosive — he fires in fast combination bursts. Hardwick is more measured." },
      oppqual:   { v:"EDGE", who:"Harry Hardwick", note:"Hardwick beat Fares Ziam, a UFC veteran. Rahiki's wins are all regional Australian/Contender Series. Slight experience edge to Hardwick." },
      upset:     { v:"EDGE", who:"Harry Hardwick", note:"At +120 Hardwick is the best value upset play on the prelims. His UFC experience and grappling give him a genuine path." },
      parlays:   { v:"EDGE", who:"Marwan Rahiki", bestLeg:"Rahiki ML -145", correlation:"Rahiki KO/TKO + Under 1.5 rounds are correlated", avoid:"Rahiki by decision — his debut nerves make distance prop risky", stack:"Rahiki ML + Under 1.5 rounds", note:"Tight fight for parlays. Use Rahiki as a building block but pair with higher-confidence legs like Nakamura and Mesquita." },
    },
    styleAnalysis: {
      f1Style: { archetype:"Explosive KO Prospect", vsStyles:[{ label:"vs UFC Veteran", pct:45, note:"First UFC fight — major unknown" }, { label:"vs Grappler", pct:44, note:"Grappling was exposed in DWCS — was dropped and nearly choked" }, { label:"vs Technical Boxer", pct:58, note:"K1 background gives him striking edge vs boxers" }, { label:"vs Pressure Fighter", pct:55, note:"Explosive counters work vs pressure" }, { label:"vs Counter Fighter", pct:61, note:"His aggression forces exchanges — usually in his favor" }], strengths:["86% finish rate (7-0 undefeated)","Explosive Oceania K1 striking background","High first-round finish rate (57%)"], weaknesses:["Making UFC debut — unknown under pressure","Was nearly submitted in DWCS","No track record vs UFC-level opposition"] },
      f2Style: { archetype:"Balanced Fighter", vsStyles:[{ label:"vs KO Prospect", pct:55, note:"Has survived KO attempts and won in UFC before" }, { label:"vs Grappler", pct:52, note:"His grappling is strong — submission wins" }, { label:"vs Striker", pct:48, note:"Lost to Charriere by KO — chin can be targeted" }, { label:"vs Pressure Fighter", pct:56, note:"Good enough movement to disrupt pressure" }, { label:"vs Counter Fighter", pct:50, note:"Even matchup vs counters" }], strengths:["UFC experience (1 fight) over debutant","Balanced grappling and striking","Submission threat (4 sub wins, 1.2 avg)"], weaknesses:["Has been KO'd before","Not elite at any one thing","Training camp quality gap behind top fighters"] },
      clash: { matchupLabel:"Undefeated KO Prospect vs UFC Veteran (Debut)", historicalPct:52, edge:"Marwan Rahiki", analysis:"UFC debut fights for undefeated prospects go 52-48 in historical data — basically coin flips. Rahiki's finishing rate gives him a slight edge but Hardwick's experience is a real counter-weight. This is the most genuinely even fight on the Emmett card.", sharpAngle:"No strong sharp angle here. Under 1.5 rounds has the best prop value — whoever wins this fight, it ends early." },
      keyQuestions:[{ question:"How does Rahiki handle UFC pressure as a debutant?", answer:"He was tested in DWCS and survived. But that is still a big step below the UFC main cage environment." }, { question:"Can Hardwick's grappling neutralize Rahiki's striking?", answer:"He has the submission wins to threaten. If he can get the fight to the ground, Rahiki is in trouble." }, { question:"Is the line right at -145/+120?", answer:"This feels like a 50/50 fight being slightly mislabed by the book. +120 on Hardwick is arguably the best value on the prelims." }],
    },
  },

  // ─── EVENT 7: EVLOEV vs MURPHY (Mar 21, London) ─────────────────────────
  ev1: {
    f1: {
      name: "Movsar Evloev", nickname: "", age: 32, nationality: "Russian", flag: "🇷🇺",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/5/EVLOEV_MOVSAR_L_12-07.png?itok=CcAhYLa7",
      hometown: "Khasavyurt, Russia", height: "5'7\"", weight: 146, reach: 72.5, legReach: 40,
      stance: "Orthodox", team: "American Top Team", coach: "ATT Coaches",
      record: "19-0", wins: 19, losses: 0, draws: 0,
      byKO: 3, bySub: 4, byDec: 12, finRate: 37,
      form: ["W","W","W","W","W"],
      proDebut: "2014-01-01", ufcDebut: "2019-04-20", titles: [],
      history: [
        { date:"2024-12-07", opp:"Aljamain Sterling", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-09-16", opp:"Edson Barboza", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-09-10", opp:"Bryce Mitchell", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2021-02-27", opp:"Andre Fili", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2020-09-12", opp:"Mike Grundy", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2019-09-28", opp:"Sheymon Moraes", res:"W", method:"KO/TKO", rd:1, time:"3:14", org:"UFC" },
        { date:"2019-07-27", opp:"Enrique Barzola", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2019-04-20", opp:"Seung Woo Choi", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 3.99, sapm: 2.45, tdAcc: 56, tdDef: 61, subAvg: 0.22, kdAvg: 0.0,
      walkout: "Evloev walks out with the composed, almost emotionless bearing of a Dagestani fighter — methodical, locked in, exuding the quiet menace of a man who has never lost. The undefeated record hangs over him like armor.",
      staredown: "Ice cold staredown. Evloev does not flinch, barely moves. He has the dead-eyed composure of a man who has walked to the octagon 19 times and never looked across at someone who beat him.",
      weighin: "Came in at 146 looking full and dense — classic orthodox build for the featherweight division. Clean cut suggests efficient weight management.",
      camp: "American Top Team provides world-class wrestling and MMA infrastructure. Evloev's grinding style has been honed here — his 63.7% striking accuracy is elite.",
      openOdds: "-160", curOdds: "-160", lineMove: "stable", pubPct: 61, sharp: "with", clv: "+2", rlm: false,
      archetype: "Pressure Wrestler / Decision Grinder", vsPresser: "excellent", vsCounter: "good",
      rehydLbs: 8, chinRating: 8, postKO: false, contractYr: false,
      avgRds: 2.8, r1FinRate: 12, decRate: 63,
    },
    f2: {
      name: "Lerone Murphy", nickname: "The Miracle", age: 34, nationality: "British", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-08/MURPHY_LERONE_L_08-16.png?itok=mQH6p3jt",
      hometown: "Manchester, England", height: "5'9\"", weight: 145, reach: 73.5, legReach: 40,
      stance: "Orthodox", team: "Factory MMA / SBG Manchester", coach: "Marc Diakiese Coach",
      record: "17-0-1", wins: 17, losses: 0, draws: 1,
      byKO: 8, bySub: 0, byDec: 9, finRate: 47,
      form: ["W","W","W","W","W"],
      proDebut: "2013-01-01", ufcDebut: "2018-10-27", titles: [],
      history: [
        { date:"2025-08-16", opp:"Aaron Pico", res:"W", method:"KO/TKO", rd:1, time:"1:30", org:"UFC", ppv:true },
        { date:"2024-09-28", opp:"Josh Emmett", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-06-10", opp:"Gabriel Santos", res:"W", method:"KO/TKO", rd:1, time:"0:52", org:"UFC" },
        { date:"2022-09-03", opp:"Edson Barboza", res:"D", method:"Draw (S)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-03-19", opp:"Ludovit Klein", res:"W", method:"KO/TKO", rd:2, time:"4:15", org:"UFC" },
        { date:"2021-03-20", opp:"Douglas Silva de Andrade", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2019-10-27", opp:"Zubaira Tukhugov", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2018-10-27", opp:"Belal Muhammad", res:"W", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 4.48, sapm: 2.97, tdAcc: 41, tdDef: 51, subAvg: 0.54, kdAvg: 0.33,
      walkout: "Murphy walking out in London will be electric — home crowd energy for a Manchester man fighting for a title shot. He feeds off the atmosphere and walks out with the swagger of a man who knows his moment has arrived.",
      staredown: "Murphy's staredown is charged with emotion — he knows what this fight means. He stares with barely contained intensity, not the cold composure of Evloev but the burning desire of a man chasing destiny.",
      weighin: "Came in at 145.5 looking athletic and full — Murphy has excellent physicality for featherweight. The 1-inch height advantage shows on the scale.",
      camp: "Based in Manchester, England with a well-rounded MMA camp. Murphy's training evolution has been remarkable — from technical kickboxer to complete MMA fighter. His spinning elbow KO of Pico showed elite striking creativity.",
      openOdds: "+130", curOdds: "+130", lineMove: "stable", pubPct: 39, sharp: "split", clv: "-1", rlm: false,
      archetype: "Kickboxer / Power Striker", vsPresser: "average", vsCounter: "excellent",
      rehydLbs: 10, chinRating: 8, postKO: false, contractYr: false,
      avgRds: 2.4, r1FinRate: 35, decRate: 53,
    },
    signals: {
      walkout:   { s1:8, s2:8, v:"PUSH", who:"PUSH",           note:"Both fighters project elite composure. Evloev's cold unbeaten stare vs Murphy's charged home-crowd energy. Murphy gets a slight boost from fighting at O2 London." },
      staredown: { s1:9, s2:7, v:"EDGE", who:"Movsar Evloev",  note:"19-0 speaks for itself in the staredown. Evloev has never looked across at someone who beat him. That carries psychological weight no matter how confident Murphy is." },
      weighin:   { s1:7, s2:8, v:"EDGE", who:"Lerone Murphy",  note:"Murphy's 1-inch height advantage and longer reach are visible on the scale. He looks the part of a featherweight main event fighter at 34." },
      camp:      { s1:8, s2:7, v:"EDGE", who:"Movsar Evloev",  note:"ATT's infrastructure advantage is real. Evloev trains alongside elite wrestlers and MMA fighters daily. Murphy's UK-based camp is solid but lacks that depth." },
      physical:  { s1:7, s2:8, v:"EDGE", who:"Lerone Murphy",  note:"Murphy holds a 1-inch height and 1-inch reach advantage. His 47% KO rate vs Evloev's 16% means Murphy has more power. His creative striking (spinning elbows, head kicks) is the legitimate X-factor." },
      style:     { v:"EDGE", who:"Movsar Evloev", striking:"Lerone Murphy", grappling:"Movsar Evloev", pace:"Movsar Evloev", stance:"PUSH", note:"Evloev's 56% TD accuracy against Murphy's only 51% TD defense is the key stat — if Evloev gets this to the mat, Murphy is in trouble." },
      market:    { v:"EDGE", who:"Movsar Evloev", value:"Lerone Murphy", sharp:"Movsar Evloev", note:"Sharps backing the undefeated favorite. Murphy at +130 has public value given home crowd and reach advantage, but market reflects Evloev's superior wrestling." },
      psych:     { s1:9, s2:8, v:"EDGE", who:"Movsar Evloev",  note:"Undefeated records create unshakeable confidence. 19-0 produces a certain fearlessness that Murphy must overcome fighting in front of a home crowd." },
      stats:     { striking:"Lerone Murphy", grappling:"Movsar Evloev", pace:"Movsar Evloev", note:"Murphy lands more per minute and at higher accuracy. But Evloev's 63.7% striking accuracy and 4.67 TD average are elite. The grappling edge is decisively Evloev's." },
      props:     { method:"Decision", over25:"yes", finish:"Movsar Evloev", note:"Evloev fights go to decision 63% of the time. Murphy's fights also trend long. This is a 3-round battle with 25-minute decision probability high. Over 1.5 rounds is a near lock." },
      verdict:   { pick:"Movsar Evloev", signals:"13 of 20 signals favor Movsar Evloev", conv:"MEDIUM", angle:"Evloev's wrestling and pressure should be enough to grind Murphy out over 3 rounds. Murphy's home crowd and KO power make this genuinely competitive.", prop:"Over 2.5 rounds. Evloev by decision. Murphy KO is live-bet upset value if he keeps it standing.", flag:"This is a genuine title eliminator — both men are 19-0 and 17-0-1 respectively. Murphy at home in London is the real danger for Evloev.", sharp:"Evloev -160 is the sharp play. Murphy +130 has public/value appeal." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-160", curF1:"-160", openF2:"+130", curF2:"+130", movement:"none", steamAlert:false, note:"Line stable since opening. No sharp movement detected. -160 holding firm means public and sharp money both aligned on the favorite." },
      ref:       { v:"EDGE", who:"Lerone Murphy", name:"Marc Goddard", stoppage:"early", groundTolerance:"medium", avgFightTime:"8.1 min", notable:"Goddard is the most respected ref in UK MMA. He stands fights up when no ground progress is made — slightly curtailing Evloev's grinding.", note:"Goddard's willingness to restart scrambles on the feet gives Murphy more opportunities to land power shots." },
      travel:    { v:"EDGE", who:"Lerone Murphy", f1Zone:"MSK (UTC+3)", f2Zone:"GMT", f1Travel:"4hr flight, 3 time zones", f2Travel:"home fight", tzDiff:3, note:"Murphy is the home fighter at O2 London — zero travel, home crowd, familiar environment. Evloev travels from Russia crossing 3 time zones." },
      cage:      { v:"PUSH", who:"PUSH", size:"25ft Octagon", type:"standard UFC", f1Style:"wrestling pressure — benefits from any cage size", f2Style:"striker — open space for combinations", note:"Standard 25ft cage suits both styles adequately. Neutral factor." },
      rest:      { v:"EDGE", who:"Lerone Murphy", f1LastFight:"2024-12-07", f2LastFight:"2025-08-16", f1Days:104, f2Days:217, optimal:"90-180 days", note:"Murphy at 217 days is in optimal range. Evloev at 104 days is slightly short. Murphy's fresher camp gives a marginal edge." },
      strikdiff: { v:"PUSH", who:"PUSH", f1Net:1.54, f2Net:1.51, f1Landed:3.99, f1Absorbed:2.45, f2Landed:4.48, f2Absorbed:2.97, note:"Nearly identical net differentials — Evloev +1.54, Murphy +1.51. Both fighters are extremely defensively sound. Statistical wash in this signal." },
      pace:      { v:"EDGE", who:"Movsar Evloev", f1R1:4.2, f1R2:4.1, f1R3:4.0, f2R1:5.1, f2R2:4.5, f2R3:3.8, note:"Evloev maintains relentless pace — barely drops R1 to R3. Murphy starts hot but fades in R3. If this goes 15 minutes, Evloev's consistency becomes decisive." },
      oppqual:   { v:"EDGE", who:"Movsar Evloev", f1AvgRank:6.8, f2AvgRank:9.2, f1EliteWins:["Sterling","Barboza","Mitchell"], f2EliteWins:["Emmett","Pico","Barboza(draw)"], note:"Evloev's recent win over Sterling (former champion) slightly edges Murphy's win over Emmett. The Sterling-level opposition edges Emmett-level in ranking quality." },
      upset:     { v:"EDGE", who:"Movsar Evloev", dogOdds:"+130", historicalWinRate:"43%", impliedProb:43, modelProb:34, edge:-9, note:"Murphy at +130 implies 43% win probability. Model puts him at 34% — a -9% edge. Market slightly overvaluing Murphy due to home fighter bias." },
      parlays:   { v:"EDGE", who:"Movsar Evloev", bestLeg:"Evloev ML -160", correlation:"Evloev win correlates strongly with decision", avoid:"Evloev KO — he rarely finishes that way (16% KO rate)", stack:"Evloev ML + Over 2.5 rounds (correlated)", note:"Evloev ML + Over 2.5 rounds — highly correlated since Evloev almost always wins by decision. Murphy KO/TKO is an interesting long-shot prop given home crowd energy." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Wrestling Pressure Machine",
        vsStyles: [
          { label: "vs Striker / Kickboxer", pct: 68, note: "Evloev's wrestling nullifies most striking-first fighters" },
          { label: "vs Wrestler", pct: 64, note: "Wins wrestling battles with superior cardio and pressure" },
          { label: "vs BJJ Specialist", pct: 61, note: "Submission defense has held up — never been submitted" },
          { label: "vs Counter Fighter", pct: 72, note: "Pressure neutralizes counter fighters completely" },
          { label: "vs Southpaw", pct: 67, note: "Orthodox wrestle-pressure handles stance variation well" },
        ],
        strengths: ["19-0 record — never been tested in adversity", "TD avg 4.67 (elite for featherweight)", "63.7% striking accuracy — best in division"],
        weaknesses: ["Only 16% KO rate — rarely finishes with power", "TD defense only 61% — can be reversed", "Unknown how he responds to adversity"],
      },
      f2Style: {
        archetype: "Creative Power Kickboxer",
        vsStyles: [
          { label: "vs Wrestling Pressure", pct: 44, note: "Murphy's 51% TD defense is the main vulnerability" },
          { label: "vs Technical Boxer", pct: 68, note: "Creative striking and power outperforms pure boxers" },
          { label: "vs Pressure Fighter", pct: 58, note: "Home crowd energy helps him push back against pressure" },
          { label: "vs Counter Fighter", pct: 71, note: "Creates openings with level changes and feints" },
          { label: "vs Southpaw", pct: 62, note: "Varied attack handles stance variation well" },
        ],
        strengths: ["Home fight in London — massive crowd advantage", "KO power via spinning strikes and heavy hands", "47% finish rate — can end it at any moment"],
        weaknesses: ["TD defense only 51% — grappling is the losing path", "No submission wins — limited mat offense", "Fades in R3 based on pace data"],
      },
      clash: {
        matchupLabel: "Wrestling Pressure vs Power Kickboxer",
        historicalPct: 61,
        edge: "Movsar Evloev",
        analysis: "Historically wrestling pressure fighters beat power kickboxers 61% at featherweight. The critical variable is TD defense — Murphy's 51% is below average, meaning Evloev will get takedowns. Murphy's only path is keeping it standing and landing his KO shot before the wrestling takes over.",
        sharpAngle: "Sharps back wrestling pressure over power striking in short fights. Evloev at -160 is appropriately priced. The value play is Over 2.5 rounds — both fighters trend to decisions. Murphy KO/TKO +130 is a fun upset prop given home crowd and spinning strike capability.",
      },
      keyQuestions: [
        { question: "Can Murphy keep it standing?", answer: "His 51% TD defense is fight-defining. If Evloev gets him down in R1, Murphy's KO power is neutralized and the fight becomes Evloev's to control." },
        { question: "Does the home crowd factor in?", answer: "Research shows home fighters in UK UFC events perform meaningfully better. The O2 London crowd will be deafening for Murphy." },
        { question: "Has either fighter faced real adversity?", answer: "Neither man has been behind on scorecards in their UFC career. The fighter who adapts first when challenged may reveal something new." },
      ],
    },
  },

  // ─── EVENT 8: ADESANYA vs PYFER (Mar 28, Seattle) ─────────────────────────
  em1: {
    f1: {
      name: "Israel Adesanya", nickname: "The Last Stylebender", age: 36, nationality: "Nigerian-NZ", flag: "🇳🇬",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/ADESANYA_ISRAEL_L_02-01.png?itok=WnxcXwhi",
      hometown: "Lagos, Nigeria / Auckland, NZ", height: "6'4\"", weight: 185, reach: 80, legReach: 44,
      stance: "Switch", team: "City Kickboxing", coach: "Eugene Bareman",
      record: "24-5", wins: 24, losses: 5, draws: 0,
      byKO: 16, bySub: 0, byDec: 8, finRate: 67,
      form: ["W","L","W","L","W"],
      proDebut: "2012-01-01", ufcDebut: "2018-02-11", titles: ["5x UFC Middleweight Champion"],
      history: [
        { date:"2025-02-01", opp:"Nassourdine Imavov", res:"W", method:"KO/TKO", rd:2, time:"0:30", org:"UFC" },
        { date:"2024-06-22", opp:"Dricus Du Plessis", res:"L", method:"Decision (S)", rd:5, time:"5:00", org:"UFC" },
        { date:"2023-09-09", opp:"Sean Strickland", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2023-04-08", opp:"Alex Pereira", res:"W", method:"KO/TKO", rd:2, time:"4:21", org:"UFC", ppv:true },
        { date:"2022-11-12", opp:"Alex Pereira", res:"L", method:"KO/TKO", rd:5, time:"2:01", org:"UFC", ppv:true },
        { date:"2022-07-02", opp:"Jared Cannonier", res:"W", method:"Decision (U)", rd:5, time:"5:00", org:"UFC", ppv:true },
        { date:"2021-10-02", opp:"Marvin Vettori", res:"W", method:"Decision (U)", rd:5, time:"5:00", org:"UFC", ppv:true },
        { date:"2021-06-12", opp:"Marvin Vettori", res:"W", method:"Decision (U)", rd:5, time:"5:00", org:"UFC", ppv:true },
      ],
      slpm: 4.02, sapm: 2.40, tdAcc: 17, tdDef: 77, subAvg: 0.14, kdAvg: 0.62,
      walkout: "The Stylebender's walkout is performance art — theatrical, elite-level showmanship. City Kickboxing fighters embody the unity of fighting and artistry and Adesanya's entrance projects absolute dominance.",
      staredown: "Adesanya in the staredown is a psychological weapon. He smiles, stays loose, sometimes dances — denying opponents the tension they want. It's unsettling for less experienced fighters.",
      weighin: "At 36 Adesanya still looks like a finished fighting machine. His physique is all about leverage and coordination — City Kickboxing's conditioning keeps him elite.",
      camp: "Eugene Bareman's City Kickboxing is the pinnacle of striking development. Adesanya's switch-stance movement and 80-inch reach are maximized by a system producing multiple world champions.",
      openOdds: "-320", curOdds: "-320", lineMove: "stable", pubPct: 75, sharp: "with", clv: "+4", rlm: false,
      archetype: "Elite Kickboxer / Movement Artist", vsPresser: "excellent", vsCounter: "excellent",
      rehydLbs: 10, chinRating: 7, postKO: true, contractYr: false,
      avgRds: 3.2, r1FinRate: 28, decRate: 33,
    },
    f2: {
      name: "Joe Pyfer", nickname: "Bodybagz", age: 29, nationality: "American", flag: "🇺🇸",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2024-06/PYFER_JOE_L_06-29.png?itok=pKlOTvM6",
      hometown: "Philadelphia, PA", height: "6'2\"", weight: 185, reach: 75, legReach: 42,
      stance: "Orthodox", team: "Team Marquez MMA", coach: "Paul Casadonte",
      record: "15-3", wins: 15, losses: 3, draws: 0,
      byKO: 9, bySub: 4, byDec: 2, finRate: 87,
      form: ["W","W","L","W","W"],
      proDebut: "2018-01-01", ufcDebut: "2022-08-13", titles: [],
      history: [
        { date:"2025-10-04", opp:"Abus Magomedov", res:"W", method:"Submission", rd:2, time:"4:15", org:"UFC" },
        { date:"2025-04-12", opp:"Caio Borralho", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC", ppv:true },
        { date:"2024-06-29", opp:"Anthony Hernandez", res:"W", method:"KO/TKO", rd:1, time:"1:16", org:"UFC", ppv:true },
        { date:"2023-11-18", opp:"Warlley Alves", res:"W", method:"KO/TKO", rd:1, time:"2:38", org:"UFC" },
        { date:"2023-07-29", opp:"Michal Oleksiejczuk", res:"L", method:"KO/TKO", rd:2, time:"1:23", org:"UFC", ppv:true },
        { date:"2023-01-21", opp:"Abdul Razak Alhassan", res:"W", method:"KO/TKO", rd:1, time:"1:45", org:"UFC" },
        { date:"2022-11-05", opp:"Jamie Pickett", res:"W", method:"KO/TKO", rd:1, time:"1:11", org:"UFC" },
        { date:"2022-08-13", opp:"Cody Brundage", res:"W", method:"KO/TKO", rd:1, time:"1:23", org:"UFC" },
      ],
      slpm: 3.47, sapm: 3.28, tdAcc: 43, tdDef: 50, subAvg: 1.02, kdAvg: 1.23,
      walkout: "Pyfer walks out with Philly swagger — raw, physical, unintimidated. He's a younger man facing a legend and he knows it, but Bodybagz has never backed down from a fight.",
      staredown: "Pyfer holds his ground in the staredown. The Borralho loss proved he can compete at championship level. He won't be wide-eyed facing Adesanya.",
      weighin: "Came in at 185.5 looking physically imposing — 6'2\" with a naturally thick, powerful frame. The strength and size edge over Adesanya is visible.",
      camp: "Team Marquez MMA in Philadelphia has developed Pyfer into a legitimate contender. His submission win over Magomedov showed wrestling improvement. Pyfer is the most dangerous 15-3 fighter in the division.",
      openOdds: "+250", curOdds: "+250", lineMove: "stable", pubPct: 25, sharp: "none", clv: "-3", rlm: false,
      archetype: "Power Finisher / Explosive Brawler", vsPresser: "good", vsCounter: "poor",
      rehydLbs: 14, chinRating: 7, postKO: true, contractYr: false,
      avgRds: 1.6, r1FinRate: 60, decRate: 13,
    },
    signals: {
      walkout:   { s1:9, s2:7, v:"EDGE", who:"Israel Adesanya",  note:"Adesanya's walkout theater is unmatched — he uses every second before R1 to get inside his opponent's head. Pyfer brings Philly energy but it's a different genre entirely." },
      staredown: { s1:9, s2:7, v:"EDGE", who:"Israel Adesanya",  note:"Izzy's loose, smiling staredown is deliberately destabilizing. Pyfer has good composure but a 5x world champion has weaponized the pre-fight experience." },
      weighin:   { s1:7, s2:8, v:"EDGE", who:"Joe Pyfer",        note:"Pyfer is the bigger, thicker middleweight on the scale. 6'2\" naturally dense frame vs Adesanya's long, wiry build. Physical strength edge is visible." },
      camp:      { s1:10, s2:7, v:"EDGE", who:"Israel Adesanya", note:"City Kickboxing is the #1 striking camp in MMA. Bareman has refined Adesanya's genius for 7+ years. Pyfer's Philly camp is good but operating at a different tier." },
      physical:  { s1:7, s2:8, v:"EDGE", who:"Joe Pyfer",        note:"Pyfer holds a 2-inch height advantage but 5-inch reach disadvantage. His explosive power (1.23 KD avg) and physical strength likely exceed Adesanya's. Izzy's 3 KO losses are a real flag." },
      style:     { v:"EDGE", who:"Israel Adesanya", striking:"Israel Adesanya", grappling:"Joe Pyfer", pace:"Joe Pyfer", stance:"Israel Adesanya", note:"Adesanya's switch-stance movement and 80-inch reach create angles no other middleweight can replicate. Pyfer's explosive offense is real but walking into Izzy's counter game is high-risk." },
      market:    { v:"EDGE", who:"Israel Adesanya", value:"Joe Pyfer", sharp:"Israel Adesanya", note:"Sharps support Adesanya heavily. -320 is steep but reflects the technical gap. Pyfer at +250 is a pure KO upset play — viable given his power but low probability." },
      psych:     { s1:10, s2:7, v:"EDGE", who:"Israel Adesanya", note:"Five-time world champion vs #14 contender. Adesanya has seen everything in the sport. Pyfer's energy is high but Izzy's championship composure is the gold standard." },
      stats:     { striking:"Israel Adesanya", grappling:"Joe Pyfer", pace:"Joe Pyfer", note:"Adesanya absorbs only 2.40 strikes per minute — elite defensive numbers. Pyfer's 1.23 KD average makes him dangerous but Izzy's 77% TD defense shuts down grappling." },
      props:     { method:"KO/TKO", over25:"no", finish:"Israel Adesanya", note:"Adesanya finished Imavov in :30 of R2 in his last fight — the power is clearly still there. Pyfer's 60% R1 finish rate means if he lands clean this ends fast." },
      verdict:   { pick:"Israel Adesanya", signals:"15 of 20 signals favor Israel Adesanya", conv:"HIGH", angle:"Adesanya's technical brilliance, reach advantage, and championship experience are overwhelming advantages vs a #14-ranked contender.", prop:"Adesanya by KO/TKO. Method: KO/TKO at around -120 is excellent value given his recent finishing.", flag:"Pyfer's 1.23 KD average is a live wire. One clean Bodybagz shot could end the night.", sharp:"Sharps on Adesanya across all books. No reverse line movement — market is aligned." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-320", curF1:"-320", openF2:"+250", curF2:"+250", movement:"none", steamAlert:false, note:"Line locked at open with zero movement. A -320 line holding firm means public and sharp money are aligned — no value signal available." },
      ref:       { v:"EDGE", who:"Israel Adesanya", name:"Herb Dean", stoppage:"early", groundTolerance:"low", avgFightTime:"7.2 min", notable:"Dean's quick stoppages amplify Adesanya's finishing threat. If Izzy starts landing clean shots, Dean won't let Pyfer survive on instinct.", note:"Early stoppage referees amplify the KO artist's advantage. Adesanya's finishing power is back — with Dean in charge, a hurt Pyfer won't be given survival time." },
      travel:    { v:"PUSH", who:"PUSH", f1Zone:"NZST (UTC+13)", f2Zone:"EST", f1Travel:"20hr flight, 18 time zones", f2Travel:"6hr flight, 3 time zones", tzDiff:15, note:"Adesanya faces a brutal trans-Pacific journey from Auckland but City Kickboxing has managed this for years with zero apparent performance impact. Pyfer from Philadelphia — manageable." },
      cage:      { v:"EDGE", who:"Israel Adesanya", size:"25ft Octagon", type:"standard UFC", f1Style:"movement striker — needs space for angles", f2Style:"pressure brawler — needs to close distance fast", note:"Adesanya's 80-inch reach and footwork thrive in the 25ft cage. Pyfer needs to get inside quickly, putting him in Izzy's counter range on the way in." },
      rest:      { v:"EDGE", who:"Joe Pyfer", f1LastFight:"2025-02-01", f2LastFight:"2025-10-04", f1Days:55, f2Days:145, optimal:"90-180 days", note:"Adesanya is on a very short 55-day turnaround — well below optimal recovery. Pyfer at 145 days is in ideal range. Short camps increase risk for the favorite at age 36." },
      strikdiff: { v:"EDGE", who:"Israel Adesanya", f1Net:1.62, f2Net:0.19, f1Landed:4.02, f1Absorbed:2.40, f2Landed:3.47, f2Absorbed:3.28, note:"Adesanya's net differential of +1.62 is dominant. He lands more and absorbs dramatically less. Pyfer's near-zero +0.19 net reflects brawling style — takes shots to give shots." },
      pace:      { v:"EDGE", who:"Joe Pyfer", f1R1:4.8, f1R2:4.1, f1R3:3.8, f2R1:5.8, f2R2:4.9, f2R3:4.2, note:"Pyfer's R1 pace of 5.8 strikes/min is the highest opening round output. If he can close distance and explode early before Adesanya's defensive system engages, the upset becomes possible." },
      oppqual:   { v:"EDGE", who:"Israel Adesanya", f1AvgRank:3.4, f2AvgRank:14.8, f1EliteWins:["Whittaker x2","Costa","Romero","Gastelum","Cannonier","Vettori x2"], f2EliteWins:["Magomedov","Hernandez"], note:"The opponent quality gap is vast. Adesanya has defeated every elite middleweight. Pyfer's best win is debatable. This is by far the biggest fight of Pyfer's career." },
      upset:     { v:"EDGE", who:"Israel Adesanya", dogOdds:"+250", historicalWinRate:"29%", impliedProb:29, modelProb:15, edge:-14, note:"Underdogs at +250 in UFC main events win approximately 29% historically. Model puts Pyfer at 15% — a significant -14% market overvaluation. Fade the dog." },
      parlays:   { v:"EDGE", who:"Israel Adesanya", bestLeg:"Adesanya ML", correlation:"Adesanya win + KO/TKO are correlated (67% finish rate)", avoid:"Adesanya by decision — increasingly rare", stack:"Adesanya ML + KO/TKO method — both correlated", note:"Adesanya ML + Method KO/TKO is the natural parlay. His last 5 finishes have been by KO. If he wins, it's almost always by stoppage now." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Elite Movement Kickboxer",
        vsStyles: [
          { label: "vs Power Finisher", pct: 74, note: "Adesanya's distance management neutralizes power punchers" },
          { label: "vs Wrestler", pct: 68, note: "77% TD defense makes takedowns almost impossible" },
          { label: "vs Pressure Fighter", pct: 71, note: "Footwork and reach prevent pressure fighters from landing" },
          { label: "vs Technical Boxer", pct: 65, note: "Can be outboxed by pure technicians over 5 rounds" },
          { label: "vs Grappler / Sub Specialist", pct: 72, note: "Rarely taken down — keeps fights precisely where he wants" },
        ],
        strengths: ["80-inch reach — longest in division", "Switch-stance creates unsolvable angles", "2.40 SAPM — elite defensive numbers"],
        weaknesses: ["Post-KO syndrome — 3 KO losses total", "Short 55-day turnaround this camp", "Fades in championship round pace"],
      },
      f2Style: {
        archetype: "Explosive Power Finisher",
        vsStyles: [
          { label: "vs Technical Striker", pct: 32, note: "Walks into counters from technical fighters — proven weakness" },
          { label: "vs Wrestler", pct: 68, note: "Wrestling has improved — submission game is legitimate" },
          { label: "vs Pressure Fighter", pct: 62, note: "Matches energy well with other pressure-based fighters" },
          { label: "vs Counter Fighter", pct: 38, note: "Counter fighters pick him apart — very dangerous matchup" },
          { label: "vs Grappler", pct: 55, note: "Ground-and-pound and submissions are real threats" },
        ],
        strengths: ["87% finish rate — nearly every win is a finish", "1.23 KD average — genuine one-punch KO power", "6'2\" physical frame with natural size advantage"],
        weaknesses: ["Walks into counters (3 losses all by stoppage)", "TD defense only 50%", "Only 13% decision rate — must finish to win"],
      },
      clash: {
        matchupLabel: "Movement Kickboxer vs Power Finisher",
        historicalPct: 76,
        edge: "Israel Adesanya",
        analysis: "Technical movement artists beat power finishers 76% at middleweight. Power finishers need clean shots; elite movement fighters prevent exactly that. Pyfer's 60% R1 finish rate becomes meaningless if he can't solve Adesanya's angles. Izzy's 2.40 SAPM means Pyfer gets essentially nothing clean.",
        sharpAngle: "Sharps overwhelmingly back technical strikers over power brawlers in main events. Adesanya at -320 is steep but historically justified. The real value is Adesanya KO/TKO method — his finishing power has returned (Imavov in :30) and it pays around -120.",
      },
      keyQuestions: [
        { question: "Does Adesanya's 55-day turnaround hurt him?", answer: "Primary concern for favorites. Shorter camp means less specific prep time on Pyfer. At 36, recovery between camps matters more than it did at 28." },
        { question: "Can Pyfer land a clean shot?", answer: "He needs to — 87% finish rate means if he can't finish, he almost never wins. Adesanya's 2.40 SAPM says the answer is rarely." },
        { question: "Does Adesanya's finishing power hold?", answer: "The Imavov :30 finish was emphatic evidence Izzy is still a finisher. Pyfer's chin hasn't been tested by this quality of striker." },
      ],
    },
  },

  // ─── EVENT 9: MOICANO vs DUNCAN (Apr 4, Las Vegas) ────────────────────────
  en1: {
    f1: {
      name: "Renato Moicano", nickname: "Moicano", age: 36, nationality: "Brazilian", flag: "🇧🇷",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-01/12/MOICANO_RENATO_L_09-28.png?itok=vY7FI6ah",
      hometown: "Brasilia, Brazil", height: "5'11\"", weight: 155, reach: 72, legReach: 42.5,
      stance: "Orthodox", team: "American Top Team", coach: "ATT Coaches",
      record: "20-7-1", wins: 20, losses: 7, draws: 1,
      byKO: 2, bySub: 10, byDec: 8, finRate: 60,
      form: ["L","W","W","L","W"],
      proDebut: "2010-01-01", ufcDebut: "2014-12-20", titles: [],
      history: [
        { date:"2025-06-28", opp:"Beneil Dariush", res:"L", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2025-01-18", opp:"Islam Makhachev", res:"L", method:"Submission", rd:1, time:"4:05", org:"UFC" },
        { date:"2024-09-28", opp:"Benoît Saint Denis", res:"W", method:"TKO (Doctor)", rd:2, time:"5:00", org:"UFC" },
        { date:"2024-04-13", opp:"Jalin Turner", res:"W", method:"KO/TKO", rd:2, time:"4:11", org:"UFC", ppv:true },
        { date:"2024-02-03", opp:"Drew Dober", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2022-11-12", opp:"Brad Riddell", res:"W", method:"Submission", rd:1, time:"3:20", org:"UFC", ppv:true },
        { date:"2022-03-05", opp:"Rafael dos Anjos", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC", ppv:true },
        { date:"2022-02-12", opp:"Alexander Hernandez", res:"W", method:"Submission", rd:2, time:"1:23", org:"UFC", ppv:true },
      ],
      slpm: 4.17, sapm: 3.57, tdAcc: 42, tdDef: 63, subAvg: 0.50, kdAvg: 0.17,
      walkout: "Moicano walks out with the swaggering, money-motivated energy he's become famous for — hands in the air, soaking in the crowd. The entertainment value is part of his brand.",
      staredown: "Moicano in the staredown is loose, almost casual — 14 years of UFC fights and nothing rattles him. He smiles through the tension, supremely confident.",
      weighin: "At 36, Moicano's lightweight cut is a known quantity. Came in at 155 looking healthy — ATT's conditioning keeps veteran fighters in excellent physical shape.",
      camp: "American Top Team provides world-class infrastructure for the Brazilian's grinding style. His BJJ black belt background is complemented by ATT's wrestling and boxing resources.",
      openOdds: "-200", curOdds: "-200", lineMove: "stable", pubPct: 66, sharp: "with", clv: "+2", rlm: false,
      archetype: "BJJ Specialist / Veteran Grappler", vsPresser: "good", vsCounter: "excellent",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 2.3, r1FinRate: 30, decRate: 40,
    },
    f2: {
      name: "Chris Duncan", nickname: "The Problem", age: 32, nationality: "Scottish", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2023-07/DUNCAN_CHRIS_L_07-22.png?itok=dDutNmpu",
      hometown: "Glasgow, Scotland", height: "5'10\"", weight: 155, reach: 71.5, legReach: 41,
      stance: "Orthodox", team: "American Top Team", coach: "ATT Coaches",
      record: "15-2", wins: 15, losses: 2, draws: 0,
      byKO: 7, bySub: 4, byDec: 4, finRate: 73,
      form: ["W","W","W","W","W"],
      proDebut: "2018-01-01", ufcDebut: "2023-03-18", titles: [],
      history: [
        { date:"2025-12-06", opp:"Terrance McKinney", res:"W", method:"Submission", rd:1, time:"2:30", org:"UFC" },
        { date:"2025-08-02", opp:"Mateusz Rebecki", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2025-03-22", opp:"Jordan Vucenic", res:"W", method:"Submission", rd:2, time:"3:42", org:"UFC" },
        { date:"2024-09-28", opp:"Bolaji Oki", res:"W", method:"Submission", rd:1, time:"3:34", org:"UFC" },
        { date:"2024-02-24", opp:"Manuel Torres", res:"L", method:"Submission", rd:1, time:"1:46", org:"UFC" },
        { date:"2023-07-22", opp:"Yanal Ashmouz", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-03-18", opp:"Omar Morales", res:"W", method:"Decision (S)", rd:3, time:"5:00", org:"UFC" },
      ],
      slpm: 5.02, sapm: 4.82, tdAcc: 43, tdDef: 50, subAvg: 0.65, kdAvg: 0.65,
      walkout: "Duncan walks out with the understated Scottish grit of a former shepherd who became a professional fighter. Four straight wins speak louder than theatrics. ATT polished the rough edges without erasing the edge.",
      staredown: "Duncan's staredown is intense and direct — focused aggression of a man who's beaten everyone put in front of him. Both fighters share a camp — no intimidation, just two ATT men facing each other.",
      weighin: "Came in at 155 looking athletic and competition-ready. Both fighters share the same camp — ATT — which creates a unique dynamic in fight week.",
      camp: "Duncan trains at American Top Team — the same gym as Moicano. Both men know each other's tendencies intimately. Camp advantage is completely neutralized.",
      openOdds: "+165", curOdds: "+165", lineMove: "stable", pubPct: 34, sharp: "split", clv: "-1", rlm: false,
      archetype: "Pressure Striker / Finisher", vsPresser: "average", vsCounter: "good",
      rehydLbs: 10, chinRating: 7, postKO: false, contractYr: false,
      avgRds: 1.9, r1FinRate: 40, decRate: 27,
    },
    signals: {
      walkout:   { s1:7, s2:7, v:"PUSH", who:"PUSH",             note:"Both fighters are ATT teammates — the walkout dynamic is uniquely neutral. Neither man is trying to intimidate someone they've trained alongside. Mutual respect makes this signal irrelevant." },
      staredown: { s1:8, s2:7, v:"EDGE", who:"Renato Moicano",   note:"Moicano's 14-year professional career and title shot experience provides composure edge. Duncan is solid but this is his biggest fight; Moicano has already been in the biggest UFC fights." },
      weighin:   { s1:7, s2:7, v:"PUSH", who:"PUSH",             note:"Both fighters came in at 155 looking healthy. Same camp, similar weight management protocols. No edge either direction." },
      camp:      { s1:5, s2:5, v:"PUSH", who:"PUSH",             note:"Both fighters train at American Top Team. One of the rarest situations in MMA — teammates fighting each other. Camp advantage completely neutralized." },
      physical:  { s1:7, s2:7, v:"PUSH", who:"PUSH",             note:"Moicano taller at 5'11\" with 72-inch reach. Duncan younger at 32 vs 36 on a 4-fight win streak. Youth/form vs experience/reach essentially cancel out." },
      style:     { v:"EDGE", who:"Renato Moicano", striking:"Chris Duncan", grappling:"Renato Moicano", pace:"Chris Duncan", stance:"PUSH", note:"Moicano's BJJ black belt is a meaningful edge on the ground. Duncan's striking output (5.02/min) is higher but Moicano's submission game is elite-level dangerous." },
      market:    { v:"EDGE", who:"Renato Moicano", value:"Chris Duncan", sharp:"Renato Moicano", note:"Sharps back the experienced Brazilian. Duncan at +165 is public value given the 4-fight win streak but Moicano's title shot résumé demands respect." },
      psych:     { s1:8, s2:7, v:"EDGE", who:"Renato Moicano",   note:"Moicano has been in title fights and elite main events. Duncan is making his biggest step up. The psychological weight of facing a former title challenger is real." },
      stats:     { striking:"Chris Duncan", grappling:"Renato Moicano", pace:"Chris Duncan", note:"Duncan generates more striking volume and a higher KD average. But Moicano's 10 submission wins are the most threatening weapon — his RNC rate is exceptional." },
      props:     { method:"Submission", over25:"no", finish:"Renato Moicano", note:"Moicano's 50% submission win rate makes sub the most likely finish method. Duncan's 50% TD defense means Moicano can get this to the mat repeatedly." },
      verdict:   { pick:"Renato Moicano", signals:"12 of 20 signals favor Renato Moicano", conv:"MEDIUM", angle:"Moicano's BJJ credentials and experience give him the edge over a rising contender. The ATT teammate dynamic neutralizes camp advantage — this comes down to craft vs athleticism.", prop:"Moicano by submission is the play. His RNC game is exceptional and Duncan's TD defense (50%) gives him pathways.", flag:"Duncan's 4-fight win streak is real. He's 32 — in his physical prime. If he keeps this standing and uses high volume to outwork Moicano, he pulls the upset.", sharp:"Moicano -200 has sharp support. Duncan +165 is the value play for believers in the streak." },
      rlm:       { v:"PUSH", who:"PUSH", openF1:"-200", curF1:"-200", openF2:"+165", curF2:"+165", movement:"none", steamAlert:false, note:"Line stable from open. No sharp steam or public movement. Market has efficiently priced this fight." },
      ref:       { v:"EDGE", who:"Chris Duncan", name:"Jason Herzog", stoppage:"medium", groundTolerance:"high", avgFightTime:"9.1 min", notable:"Herzog gives fighters more time to work on the ground — helps Duncan escape Moicano's submission attempts.", note:"A longer ground tolerance referee works against Moicano's quick submission game. Duncan gets more time to work out of bad positions." },
      travel:    { v:"EDGE", who:"Chris Duncan", f1Zone:"BRT (UTC-3)", f2Zone:"GMT+1", f1Travel:"10hr from Brazil, 4 time zones", f2Travel:"9hr from UK, 5 time zones", tzDiff:4, note:"Both fighters face significant travel to Las Vegas. Duncan from Glasgow 9 hours; Moicano from Brazil 10 hours. Marginal edge to Duncan though ATT Florida base may mean both fight from camp there." },
      cage:      { v:"PUSH", who:"PUSH", size:"25ft Octagon", type:"Meta APEX (25ft)", f1Style:"BJJ specialist — cage takedowns to submissions", f2Style:"pressure striker — cage for body lock setups", note:"Same cage knowledge for both ATT fighters. Camp awareness neutralized." },
      rest:      { v:"EDGE", who:"Chris Duncan", f1LastFight:"2025-06-28", f2LastFight:"2025-12-06", f1Days:280, f2Days:116, optimal:"90-180 days", note:"Moicano at 280 days has a long layoff — ring rust risk at 36. Duncan at 116 days is in optimal range with momentum from 4 straight wins." },
      strikdiff: { v:"EDGE", who:"Renato Moicano", f1Net:0.60, f2Net:0.20, f1Landed:4.17, f1Absorbed:3.57, f2Landed:5.02, f2Absorbed:4.82, note:"Duncan generates more volume but also absorbs more. Moicano is the more efficient striker with better net differential. Quality vs quantity." },
      pace:      { v:"EDGE", who:"Chris Duncan", f1R1:4.8, f1R2:4.3, f1R3:3.8, f2R1:5.8, f2R2:5.1, f2R3:4.4, note:"Duncan maintains significantly higher volume across all rounds. His 5.8 opening pace is highest in this matchup. If he establishes rhythm early and prevents clinch work, the pace advantage grows." },
      oppqual:   { v:"EDGE", who:"Renato Moicano", f1AvgRank:8.4, f2AvgRank:28.6, f1EliteWins:["Turner","Saint Denis","Dober","Riddell"], f2EliteWins:["McKinney","Rebecki","Vucenic"], note:"Moicano has faced and beaten significantly higher-ranked opponents. Duncan's wins are against lower-ranked fighters — this is his first fight against a former title challenger." },
      upset:     { v:"EDGE", who:"Renato Moicano", dogOdds:"+165", historicalWinRate:"38%", impliedProb:38, modelProb:27, edge:-11, note:"Duncan at +165 implies 38% win probability. Model puts him at 27% — an -11% edge. Market moderately overvalues the rising contender." },
      parlays:   { v:"EDGE", who:"Renato Moicano", bestLeg:"Moicano ML -200", correlation:"Moicano win + Submission method are correlated (50% sub rate)", avoid:"Moicano by decision — submissions are more likely", stack:"Moicano ML + Submission method (correlated)", note:"Moicano ML + Submission is the correlated parlay play. His 10 sub wins in 20 total makes sub the most likely method. Duncan's 50% TD defense gives Moicano mat access repeatedly." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "BJJ Black Belt / Veteran Grinder",
        vsStyles: [
          { label: "vs Striker / Finisher", pct: 64, note: "Clinch work and TD attempts neutralize pure strikers" },
          { label: "vs Wrestler", pct: 58, note: "Top-level wrestlers can outwork his guard — shown vs Makhachev" },
          { label: "vs BJJ Specialist", pct: 52, note: "Sub game is elite but world-class BJJ is competitive" },
          { label: "vs Pressure Fighter", pct: 61, note: "Body lock takedowns against pressure fighters succeed" },
          { label: "vs Counter Fighter", pct: 67, note: "Counter striker style creates takedown opportunities" },
        ],
        strengths: ["BJJ black belt — 10 submission wins (all RNC)", "4.17 sig strikes/min with 60% str defense", "14+ years of professional experience"],
        weaknesses: ["Age 36 with 280-day layoff — ring rust risk", "2 straight losses before this fight", "TD defense only 63%"],
      },
      f2Style: {
        archetype: "Explosive Pressure Striker",
        vsStyles: [
          { label: "vs BJJ Specialist", pct: 42, note: "TD defense only 50% — elite sub artists are the nightmare matchup" },
          { label: "vs Wrestler", pct: 55, note: "Defends wrestling reasonably with dirty boxing" },
          { label: "vs Pressure Fighter", pct: 63, note: "Volume output overwhelms other pressure fighters" },
          { label: "vs Counter Fighter", pct: 68, note: "High pace forces counter fighters out of comfort zone" },
          { label: "vs Technical Boxer", pct: 57, note: "Volume can overwhelm technical boxers over 3 rounds" },
        ],
        strengths: ["4-fight win streak with 3 submissions in last 4", "5.02 sig strikes/min — elite volume output", "Age 32 — physical prime with contender hunger"],
        weaknesses: ["Never faced this quality level — unknown ceiling", "TD defense only 50% — Moicano will get takedowns", "Same camp as opponent — zero tactical surprise"],
      },
      clash: {
        matchupLabel: "BJJ Veteran vs Pressure Striker (ATT Teammate Bout)",
        historicalPct: 62,
        edge: "Renato Moicano",
        analysis: "BJJ veterans beat pressure strikers 62% at lightweight when the BJJ fighter can achieve takedowns — and with both fighters at the same camp, tactical surprise is eliminated. The fight comes down to fundamentals: Moicano's submission game vs Duncan's volume striking. Moicano's 50% TD rate vs Duncan's 50% TD defense is literally a coin flip on every attempt. The edge goes to the man with more finishing ability once it hits the mat.",
        sharpAngle: "Inter-camp fights are uniquely difficult to price. Both men know each other's tendencies. The sharp angle is Moicano submission method — 10 RNCs in 20 wins is a statistical pattern that should pay around -110 to -130 on method props.",
      },
      keyQuestions: [
        { question: "Does the same-camp dynamic neutralize Moicano's experience?", answer: "To some degree — Duncan knows Moicano's sub setups from training. But knowing a technique and stopping it against a BJJ black belt in competition are very different things." },
        { question: "Can Duncan keep this standing?", answer: "His 50% TD defense is fight-defining. If he can't defend Moicano's clinch work consistently, the fight ends on the mat." },
        { question: "Does Moicano's age/ring rust factor matter?", answer: "280 days at 36 is worth noting. But ATT's infrastructure mitigates rust risk — he's never been cut from the gym environment." },
      ],
    },
  },

  // ─── EVENT 10: UFC 327 PROCHAZKA vs ULBERG (Apr 11, Miami) ────────────────
  ep1: {
    f1: {
      name: "Jiří Procházka", nickname: "The Terminator", age: 33, nationality: "Czech", flag: "🇨🇿",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-10/PROCHAZKA_JIRI_L_10-04.png?itok=euU6-36d",
      hometown: "Hostěradice, Czechia", height: "6'3\"", weight: 205, reach: 80, legReach: 45,
      stance: "Orthodox", team: "JETSAAM GYM", coach: "Martin Karaivanov",
      record: "32-5-1", wins: 32, losses: 5, draws: 1,
      byKO: 28, bySub: 3, byDec: 1, finRate: 97,
      form: ["W","W","L","W","W"],
      proDebut: "2012-01-01", ufcDebut: "2020-07-11", titles: ["Former UFC Light Heavyweight Champion"],
      history: [
        { date:"2025-10-04", opp:"Khalil Rountree Jr.", res:"W", method:"KO/TKO", rd:3, time:"3:04", org:"UFC", ppv:true },
        { date:"2025-01-18", opp:"Jamahal Hill", res:"W", method:"KO/TKO", rd:3, time:"3:01", org:"UFC", ppv:true },
        { date:"2024-06-29", opp:"Alex Pereira", res:"L", method:"KO/TKO", rd:2, time:"0:13", org:"UFC", ppv:true },
        { date:"2024-04-13", opp:"Aleksandar Rakić", res:"W", method:"KO/TKO", rd:3, time:"3:17", org:"UFC", ppv:true },
        { date:"2023-11-11", opp:"Alex Pereira", res:"L", method:"KO/TKO", rd:2, time:"4:08", org:"UFC", ppv:true },
        { date:"2022-06-12", opp:"Glover Teixeira", res:"W", method:"Submission", rd:5, time:"4:32", org:"UFC", ppv:true },
        { date:"2021-05-01", opp:"Dominick Reyes", res:"W", method:"KO/TKO", rd:2, time:"4:29", org:"UFC" },
        { date:"2020-07-11", opp:"Volkan Oezdemir", res:"W", method:"KO/TKO", rd:2, time:"0:49", org:"UFC", ppv:true },
      ],
      slpm: 5.69, sapm: 5.60, tdAcc: 20, tdDef: 68, subAvg: 0.17, kdAvg: 0.85,
      walkout: "Procházka's walkout is otherworldly — he walks to the cage like a man possessed, samurai-warrior energy radiating from every step. The JETSAAM philosophy of fighting as spiritual practice shows in every second of his pre-fight ritual.",
      staredown: "Procházka stares with the wild intensity of a man who has built his identity around combat as philosophy. It's not cold calculation — it's pure, burning desire. Opponents often look unsettled by the sheer otherworldliness of his focus.",
      weighin: "At 33 Procházka's 205 lb frame is all lean muscle and coiled power. Two back-to-back KOs of Hill and Rountree suggest he's at his physical peak. 80-inch reach visible on the scale.",
      camp: "JETSAAM GYM in Prague is unique in MMA — a gym built on the philosophy that fighting is spiritual discipline. Procházka's training includes meditation, samurai philosophy, and extreme conditioning. His unorthodox style has been developed here his entire career.",
      openOdds: "-135", curOdds: "-135", lineMove: "stable", pubPct: 55, sharp: "with", clv: "+1", rlm: false,
      archetype: "Unorthodox KO Artist / Samurai Warrior", vsPresser: "excellent", vsCounter: "variable",
      rehydLbs: 10, chinRating: 7, postKO: true, contractYr: false,
      avgRds: 2.4, r1FinRate: 32, decRate: 3,
    },
    f2: {
      name: "Carlos Ulberg", nickname: "Black Jag", age: 35, nationality: "New Zealander", flag: "🇳🇿",
      photo: "https://ufc.com/images/styles/athlete_bio_full_body/s3/2025-09/ULBERG_CARLOS_L_09-27.png?itok=qhppPnKs",
      hometown: "Auckland, New Zealand", height: "6'4\"", weight: 205, reach: 77, legReach: 43.5,
      stance: "Orthodox", team: "City Kickboxing", coach: "Eugene Bareman",
      record: "14-1", wins: 14, losses: 1, draws: 0,
      byKO: 8, bySub: 1, byDec: 5, finRate: 64,
      form: ["W","W","W","W","W"],
      proDebut: "2011-01-01", ufcDebut: "2021-03-06", titles: [],
      history: [
        { date:"2025-09-27", opp:"Dominick Reyes", res:"W", method:"KO/TKO", rd:1, time:"4:27", org:"UFC" },
        { date:"2025-03-22", opp:"Jan Blachowicz", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-11-23", opp:"Volkan Oezdemir", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2024-05-11", opp:"Alonzo Menifield", res:"W", method:"KO/TKO", rd:1, time:"0:12", org:"UFC", ppv:true },
        { date:"2023-09-09", opp:"Da Woon Jung", res:"W", method:"Submission", rd:3, time:"4:49", org:"UFC", ppv:true },
        { date:"2023-05-13", opp:"Ihor Potieria", res:"W", method:"KO/TKO", rd:1, time:"2:09", org:"UFC" },
        { date:"2022-11-12", opp:"Nicolae Negumereanu", res:"W", method:"KO/TKO", rd:1, time:"3:44", org:"UFC", ppv:true },
        { date:"2021-03-06", opp:"Kennedy Nzechukwu", res:"L", method:"KO/TKO", rd:2, time:"3:19", org:"UFC" },
      ],
      slpm: 6.54, sapm: 4.04, tdAcc: 40, tdDef: 86, subAvg: 0.18, kdAvg: 1.28,
      walkout: "City Kickboxing delivers an elite walkout — Ulberg from New Zealand with the Polynesian warrior tradition behind him and the City Kickboxing family's championship mentality. He's calm, focused, completely ready for the biggest moment of his life.",
      staredown: "Ulberg's staredown is composed, professional — City Kickboxing trains fighters to stay in optimal mental state pre-fight. He channels their 19-2 kickboxing background into focused calm rather than matching Procházka's burning intensity.",
      weighin: "At 6'4\" and 35 years old, Ulberg is at the peak of his athletic prime. His physique is a finished product — no wasted movement. The reach disadvantage (77 vs 80 inches) is only 3 inches.",
      camp: "City Kickboxing — the same gym as Adesanya, the finest striking environment in MMA. Bareman has crafted Ulberg from kickboxer into complete MMA fighter. His 9-fight win streak reflects systematic development culminating in this title fight.",
      openOdds: "+112", curOdds: "+112", lineMove: "stable", pubPct: 45, sharp: "split", clv: "0", rlm: false,
      archetype: "Elite Kickboxer / Technical Striker", vsPresser: "good", vsCounter: "good",
      rehydLbs: 10, chinRating: 8, postKO: true, contractYr: false,
      avgRds: 2.3, r1FinRate: 46, decRate: 36,
    },
    signals: {
      walkout:   { s1:9, s2:8, v:"EDGE", who:"Jiří Procházka",  note:"Procházka's pre-fight ritual and samurai energy is unlike anything else in MMA. Ulberg is calm and collected — but Prochazka's walkout energy is a weapon unto itself." },
      staredown: { s1:9, s2:7, v:"EDGE", who:"Jiří Procházka",  note:"The burning, almost frightening intensity of Procházka's stare is genuinely destabilizing. Ulberg is professionally composed but standing across from a former champion with that energy is different." },
      weighin:   { s1:8, s2:8, v:"PUSH", who:"PUSH",            note:"Both fighters are elite 205 lb athletes in perfect physical condition. Ulberg's 6'4\" vs Procházka's 6'3\" gives Ulberg fractional height edge. Physical match-up is remarkably even." },
      camp:      { s1:9, s2:10, v:"EDGE", who:"Carlos Ulberg",  note:"City Kickboxing is the #1 striking gym in MMA — and Ulberg has been there 5+ years under Bareman. JETSAAM is unique and elite but City Kickboxing's champion track record gives them a slight institutional edge." },
      physical:  { s1:7, s2:8, v:"EDGE", who:"Carlos Ulberg",   note:"Ulberg's 1.28 KD average vs Procházka's 0.85 — Ulberg is actually the more prolific knockdown artist per minute. 86% TD defense vs Procházka's 68%. Post-KO concerns exist for both fighters." },
      style:     { v:"PUSH", who:"PUSH", striking:"Carlos Ulberg", grappling:"PUSH", pace:"Carlos Ulberg", stance:"PUSH", note:"Two elite kickboxers for the vacant title. Ulberg lands more per minute (6.54 vs 5.69) and absorbs significantly less (4.04 vs 5.60). These defensive metrics are the defining stats in an all-striking contest." },
      market:    { v:"EDGE", who:"Carlos Ulberg", value:"Carlos Ulberg", sharp:"split", note:"+112 on a 9-fight win streak City Kickboxing fighter in a vacant title fight represents genuine value. Sharps are split — this fight is legitimately close to even money." },
      psych:     { s1:9, s2:8, v:"EDGE", who:"Jiří Procházka",  note:"Former champion energy. Procházka won the belt, vacated it, lost it twice to Pereira, and has rattled off 2 consecutive KOs to get back here. That championship hunger is powerful." },
      stats:     { striking:"Carlos Ulberg", grappling:"PUSH", pace:"Carlos Ulberg", note:"Ulberg's 6.54 sig strikes/min vs Procházka's 5.69. Ulberg absorbs 4.04 vs Procházka's 5.60. Statistical edge belongs to Ulberg — more efficient and takes less damage." },
      props:     { method:"KO/TKO", over25:"no", finish:"Carlos Ulberg", note:"97% finish rate for Procházka, 64% for Ulberg — both men end fights. This is almost certainly a KO. Under 2.5 rounds at a PPV between two elite strikers is strong value." },
      verdict:   { pick:"Carlos Ulberg", signals:"12 of 20 signals favor Carlos Ulberg", conv:"LOW", angle:"Ulberg's superior defensive metrics, higher volume, and City Kickboxing infrastructure give him a narrow edge over the former champion. But Procházka's power and championship DNA make this genuinely 50/50.", prop:"KO/TKO is the banker prop. Under 2.5 rounds is strong PPV value. Ulberg ML +112 is underpriced per model.", flag:"Procházka's 28 KOs in 32 wins is the most terrifying number in this fight. He's stopped Hill AND Rountree back-to-back. One clean Prochazka shot ends it instantly.", sharp:"Market is essentially even money. Sharps are genuinely split — coin-flip fight for the vacant title." },
      rlm:       { v:"EDGE", who:"Carlos Ulberg", openF1:"-135", curF1:"-135", openF2:"+112", curF2:"+125", movement:"+13 toward Ulberg", steamAlert:true, note:"STEAM ALERT: Ulberg has drifted from +112 to +125 — a 13-cent move toward the challenger with no public explanation. Sharp money signal on Ulberg. When a challenger's line improves significantly in a title fight, it suggests professional betting activity on the underdog." },
      ref:       { v:"EDGE", who:"Jiří Procházka", name:"Marc Goddard", stoppage:"early", groundTolerance:"low", avgFightTime:"8.1 min", notable:"Goddard's quick stoppages amplify Procházka's already terrifying KO threat. Once his shots start landing and opponents are hurt, Goddard pulls the trigger.", note:"Early stoppage refs amplify the KO artist's advantage. Procházka has 28 KOs — one flush strike with Goddard in charge ends the night." },
      travel:    { v:"EDGE", who:"Jiří Procházka", f1Zone:"CET (UTC+1)", f2Zone:"NZST (UTC+13)", f1Travel:"9hr from Prague, 6 time zones", f2Travel:"22hr from Auckland, 18 time zones", tzDiff:12, note:"Procházka from Prague (9hr, 6 time zones) has the edge over Ulberg's brutal Auckland trip (22hr, 18 time zones). However City Kickboxing has perfected trans-Pacific travel management." },
      cage:      { v:"PUSH", who:"PUSH", size:"30ft Octagon", type:"UFC PPV — larger 30ft cage", f1Style:"unorthodox movement — uses full cage space", f2Style:"technical kickboxer — benefits from open space", note:"UFC 327 PPV uses the larger 30ft cage. More space for Procházka's unorthodox movement AND for Ulberg's technical distance game. Neutral factor." },
      rest:      { v:"PUSH", who:"PUSH", f1LastFight:"2025-10-04", f2LastFight:"2025-09-27", f1Days:189, f2Days:196, optimal:"90-180 days", note:"Both fighters have essentially identical rest — Procházka 189 days, Ulberg 196 days. Both just outside optimal range but acceptable territory. No meaningful edge." },
      strikdiff: { v:"EDGE", who:"Carlos Ulberg", f1Net:0.09, f2Net:2.50, f1Landed:5.69, f1Absorbed:5.60, f2Landed:6.54, f2Absorbed:4.04, note:"The most dramatic differential on the card. Procházka's net is essentially zero — absorbs almost as much as he lands (5.60). Ulberg's net is +2.50. If this fight goes by the numbers, Ulberg wins clearly." },
      pace:      { v:"EDGE", who:"Carlos Ulberg", f1R1:6.2, f1R2:5.8, f1R3:5.4, f2R1:7.1, f2R2:6.5, f2R3:5.9, note:"Ulberg's pace is higher in every round — 7.1 R1 strikes/min. Both maintain relatively consistent pace (rare — elite cardio). Ulberg will be the busier fighter bell to bell." },
      oppqual:   { v:"EDGE", who:"Jiří Procházka", f1AvgRank:4.2, f2AvgRank:7.8, f1EliteWins:["Teixeira (title)","Hill","Rountree","Reyes","Rakic"], f2EliteWins:["Blachowicz","Reyes","Oezdemir"], note:"Procházka won the title vs Teixeira, defeated Hill and Rountree consecutively. Ulberg's wins over Blachowicz and Reyes are impressive but below championship level. The experience advantage for the former champion is real." },
      upset:     { v:"EDGE", who:"Carlos Ulberg", dogOdds:"+125", historicalWinRate:"44%", impliedProb:44, modelProb:47, edge:3, note:"Ulberg at +125 implies 44% win probability. Model puts him at 47% — a rare positive edge where the underdog is underpriced. When our model favors the dog over the market, it's a signal. Ulberg may be the true statistical favorite." },
      parlays:   { v:"EDGE", who:"Carlos Ulberg", bestLeg:"Ulberg ML +125", correlation:"Ulberg win + KO/TKO method are correlated", avoid:"Ulberg by decision — his wins are mostly finishes", stack:"Ulberg ML + Under 2.5 rounds (PPV KO special)", note:"Sharp play is Ulberg ML at +125 — model suggests slight statistical favorite. Pair with Under 2.5 rounds for a PPV special. Both fighters end fights — the under is nearly guaranteed. If Ulberg wins, it's likely by KO." },
    },
    styleAnalysis: {
      f1Style: {
        archetype: "Unorthodox Samurai / KO Machine",
        vsStyles: [
          { label: "vs Technical Kickboxer", pct: 58, note: "Unorthodox angles confuse technical strikers — but City KB has seen everything" },
          { label: "vs Wrestler", pct: 64, note: "68% TD defense keeps fights standing for his KO game" },
          { label: "vs Pressure Fighter", pct: 71, note: "Punishes forward-moving opponents with counter KOs" },
          { label: "vs Counter Fighter", pct: 55, note: "Variable — unorthodox style sometimes walks into counters" },
          { label: "vs Elite Striker", pct: 52, note: "Absorbs 5.60/min — elite strikers can match him blow for blow" },
        ],
        strengths: ["28 KOs in 32 wins — most terrifying KO rate in LHW", "80-inch reach — controls distance when he chooses", "Championship DNA — proven at the highest level"],
        weaknesses: ["Absorbs 5.60 strikes/min — elite defensive liability", "Post-KO syndrome (stopped twice by Pereira)", "Net differential near zero — takes as much as he gives"],
      },
      f2Style: {
        archetype: "Systematic City Kickboxing Champion",
        vsStyles: [
          { label: "vs Unorthodox Striker", pct: 62, note: "City KB trains against every style — unorthodox is manageable" },
          { label: "vs Power Finisher", pct: 60, note: "86% TD defense and superior defensive metrics help" },
          { label: "vs Counter Fighter", pct: 64, note: "Volume output and footwork handle counter stylists" },
          { label: "vs Pressure Fighter", pct: 68, note: "Technically superior and works the range effectively" },
          { label: "vs Technical Boxer", pct: 70, note: "Kickboxing background wins against pure boxing" },
        ],
        strengths: ["6.54 sig strikes/min — highest output at LHW", "+2.50 net strike differential (elite)", "86% TD defense — nearly unstoppable by wrestling"],
        weaknesses: ["Only 1 loss but it was a KO — chin has been tested", "Title fight debut — unknown under championship pressure", "19 fewer professional wins than Procházka"],
      },
      clash: {
        matchupLabel: "Unorthodox KO Machine vs Systematic City Kickboxer",
        historicalPct: 53,
        edge: "Carlos Ulberg",
        analysis: "When two elite strikers meet at LHW, the statistical edge goes to the fighter with better defensive metrics — Ulberg's 4.04 absorption vs Procházka's 5.60 is decisive. City Kickboxing's systematic approach produces fighters with exceptional punch selection and avoidance. However, Procházka's 28 KOs represent a sample size that defies statistical modeling — he's finished elite fighters who looked statistically superior going in.",
        sharpAngle: "When the model slightly favors the underdog AND the line is moving toward them (steam alert), the play is the underdog. Ulberg at +125 with model probability of 47% is a rare value signal. The smartest bet is Ulberg ML + Under 2.5 rounds — both legs are independently strong and correlate if Ulberg wins by KO.",
      },
      keyQuestions: [
        { question: "Can Ulberg handle the championship moment?", answer: "His first title fight against a former champion at a major PPV. City Kickboxing has prepared him mentally and physically — but no preparation fully replicates the actual moment." },
        { question: "Does Procházka's defensive liability cost him?", answer: "5.60 strikes absorbed per minute against someone who lands 6.54 is genuinely dangerous. Ulberg is more accurate, more efficient, and hits hard enough. The math could catch up." },
        { question: "Who lands the first meaningful shot?", answer: "This fight may literally come down to the first clean exchange. Procházka's unorthodox angles vs Ulberg's technical distance — the first flush shot winner likely ends the night." },
      ],
    },
  },
};

// ─── COMPLETED EVENT DATA ─────────────────────────────────────────────────────
const COMPLETED_RESULTS = [
  { f1:"Max Holloway", f2:"Charles Oliveira", wc:"Lightweight · Main Event", winner:"Charles Oliveira", method:"Decision (Unanimous)", rounds:5 },
  { f1:"Caio Borralho", f2:"Reinier de Ridder", wc:"Middleweight · Co-Main", winner:"Caio Borralho", method:"Decision (Unanimous)", rounds:5 },
  { f1:"Rob Font", f2:"Raul Rosas Jr", wc:"Bantamweight", winner:"Raul Rosas Jr", method:"Decision (Unanimous)", rounds:3 },
  { f1:"Drew Dober", f2:"Michael Johnson", wc:"Lightweight", winner:"Drew Dober", method:"KO/TKO", rounds:2 },
  { f1:"Gregory Rodrigues", f2:"Brunno Ferreira", wc:"Middleweight", winner:"Gregory Rodrigues", method:"KO/TKO", rounds:1 },
];

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function Pill({ label, color = "#3a3d4a" }) {
  return <span style={{ ...mono, fontSize: 8, color, background: `${color}20`, padding: "2px 7px", borderRadius: 2, letterSpacing: 1, whiteSpace: "nowrap" }}>{label}</span>;
}
function FormDots({ form }) {
  return <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{form.map((r, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: r === "W" ? "#00e5a0" : "#ff3d57", opacity: 0.3 + (i / form.length) * 0.7 }} />)}</div>;
}
function SLabel({ children }) { return <div style={{ ...mono, fontSize: 7, color: "#8a8fa8", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>; }
function SBox({ label, value, color = "#7a7f96" }) {
  return <div style={{ background: "#eef0f5", borderRadius: 3, padding: "8px 10px" }}><div style={{ ...mono, fontSize: 6, color: "#8a8fa8", letterSpacing: 1, marginBottom: 3 }}>{label}</div><div style={{ ...sans, fontSize: 13, fontWeight: 700, color }}>{value || "—"}</div></div>;
}
function HBar({ v1, v2, max, label, fmt = x => x }) {
  const e1 = v1 > v2, e2 = v2 > v1;
  return <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: e1 ? "#007a4d" : "#9da3b8" }}>{fmt(v1)}</span>
      <span style={{ ...mono, fontSize: 7, color: "#8a8fa8", letterSpacing: 1 }}>{label}</span>
      <span style={{ ...sans, fontSize: 13, fontWeight: 700, color: e2 ? "#007a4d" : "#9da3b8" }}>{fmt(v2)}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      <div style={{ height: 2, background: "#e4e6f0" }}><div style={{ height: 2, width: `${Math.min((v1 / max) * 100, 100)}%`, background: e1 ? "#00e5a0" : "#222630", marginLeft: "auto" }} /></div>
      <div style={{ height: 2, background: "#e4e6f0" }}><div style={{ height: 2, width: `${Math.min((v2 / max) * 100, 100)}%`, background: e2 ? "#00e5a0" : "#222630" }} /></div>
    </div>
  </div>;
}
function VBadge({ v, who }) {
  const c = v === "EDGE" ? "#00e5a0" : v === "PUSH" ? "#f5a623" : "#ff3d57";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${c}15`, border: `1px solid ${c}40`, padding: "3px 10px", borderRadius: 2, flexShrink: 0 }}>
    <span style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />
    <span style={{ ...mono, fontSize: 9, color: c, letterSpacing: 1 }}>{v === "EDGE" ? `${who} EDGE` : v === "PUSH" ? "PUSH" : "NO EDGE"}</span>
  </span>;
}
function INote({ text }) { return <p style={{ ...sans, fontSize: 13, lineHeight: 1.8, color: "#444858", fontStyle: "italic", marginTop: 10, fontWeight: 500 }}>{text}</p>; }

// ─── FIGHTER PROFILE CARD ─────────────────────────────────────────────────────
function Profile({ f, accent }) {
  const [hist, setHist] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const coachData = COACH_ROSTERS[f.coach];

  return (
    <div style={{ background: "#f8f9fc", border: "1px solid #dde0ea", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}18 0%, transparent 55%)`, borderBottom: `1px solid ${accent}30`, padding: "14px 15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              {f.flag && <span style={{ fontSize: 16 }}>{f.flag}</span>}
              <div style={{ ...sans, fontSize: 11, fontWeight: 700, color: accent, letterSpacing: 0.5, textTransform: "uppercase" }}>{f.nationality} · {f.team}</div>
            </div>
            <div style={{ ...cond, fontWeight: 900, fontSize: 22, letterSpacing: "-0.3px", lineHeight: 1.1, color: "#0d0f14" }}>{f.name}</div>
            {f.nickname && <div style={{ ...sans, fontStyle: "italic", fontSize: 10, color: "#6b7080", marginTop: 2 }}>"{f.nickname}"</div>}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ ...sans, fontWeight: 900, fontSize: 26, color: accent, lineHeight: 1, letterSpacing: "-0.5px" }}>{f.record}</div>
            <div style={{ ...mono, fontSize: 6, color: "#8a8fa8", letterSpacing: 2, marginTop: 2 }}>W–L–D</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "13px 15px" }}>
        <SLabel>Physical</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5, marginBottom: 14 }}>
          {[["HEIGHT", f.height], ["WEIGHT", `${f.weight} lbs`], ["REACH", `${f.reach}"`],
            ["LEG REACH", `${f.legReach}"`], ["STANCE", f.stance], ["AGE", `${f.age}`]].map(([l, v]) =>
            <SBox key={l} label={l} value={v} color="#9da3b8" />)}
        </div>

        <SLabel>Background</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["HOMETOWN", f.hometown], ["PRO DEBUT", f.proDebut], ["UFC DEBUT", f.ufcDebut]].map(([l, v]) => (
            <div key={l} style={{ borderBottom: "1px solid #e4e6f0", paddingBottom: 6 }}>
              <div style={{ ...mono, fontSize: 6, color: "#8a8fa8", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: "#444858" }}>{v || "—"}</div>
            </div>
          ))}
          {/* COACH — with expandable roster */}
          <div style={{ borderBottom: "1px solid #e4e6f0", paddingBottom: 6 }}>
            <div style={{ ...mono, fontSize: 6, color: "#8a8fa8", letterSpacing: 1, marginBottom: 2 }}>COACH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: "#444858", flex: 1 }}>{f.coach || "—"}</div>
              {coachData && (
                <button onClick={() => setCoachOpen(o => !o)}
                  style={{ background: coachOpen ? "#0057e8" : "none", border: "1px solid #0057e830", borderRadius: 4, padding: "2px 6px", ...sans, fontSize: 9, fontWeight: 800, color: coachOpen ? "#fff" : "#0057e8", cursor: "pointer", flexShrink: 0, lineHeight: 1.6 }}>
                  {coachOpen ? "▲" : "roster"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coach Roster Expand */}
        {coachOpen && coachData && (
          <div style={{ background: "#f0f5ff", border: "1px solid #0057e820", borderRadius: 8, padding: "12px 13px", marginBottom: 14, marginTop: -8 }} className="fu">
            <div style={{ ...sans, fontSize: 10, fontWeight: 800, color: "#0057e8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{coachData.gym}</div>
            <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#9da3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Notable Fighters</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {coachData.notable.map((n, i) => (
                <span key={i} style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#0d0f14", background: "#ffffff", border: "1px solid #dde0ea", borderRadius: 4, padding: "2px 8px" }}>{n}</span>
              ))}
            </div>
            {coachData.titles.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#9da3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>🏆 Champions Trained</div>
                {coachData.titles.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 5, alignItems: "flex-start", marginBottom: 3 }}>
                    <span style={{ color: "#f5a623", fontSize: 10, flexShrink: 0 }}>★</span>
                    <span style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#444858", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ ...sans, fontSize: 11, fontWeight: 500, color: "#6b7280", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>{coachData.note}</p>
          </div>
        )}

        {f.titles?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SLabel>Titles</SLabel>
            {f.titles.map((t, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, background: "rgba(245,166,35,.1)", border: "1px solid rgba(245,166,35,.15)", borderRadius: 3, padding: "5px 8px" }}><span>🏆</span><span style={{ ...mono, fontSize: 8, color: "#f5a623" }}>{t}</span></div>)}
          </div>
        )}

        <SLabel>Record</SLabel>
        <div style={{ background: "#eef0f5", borderRadius: 4, padding: "11px 13px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 11 }}>
            {[["W", f.wins, "#00e5a0"], ["L", f.losses, "#ff3d57"], ["D", f.draws || 0, "#3a3d4a"]].map(([l, v, c]) => (
              <div key={l}><div style={{ ...sans, fontWeight: 900, fontSize: 30, color: c, lineHeight: 1, letterSpacing: "-1px" }}>{v}</div><div style={{ ...mono, fontSize: 6, color: "#8a8fa8", letterSpacing: 2, marginTop: 1 }}>{l}</div></div>
            ))}
          </div>
          {[["KO/TKO", f.byKO, "#ff3d57"], ["SUBMISSION", f.bySub, "#00e5a0"], ["DECISION", f.byDec, "#f5a623"]].map(([l, v, c]) => v > 0 && (
            <div key={l} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
              <span style={{ ...mono, fontSize: 7, color: "#6b7080", width: 72, flexShrink: 0 }}>{l}</span>
              <div style={{ flex: 1, height: 2, background: "#e4e6f0", margin: "0 9px" }}><div style={{ height: 2, width: `${(v / f.wins) * 100}%`, background: c }} /></div>
              <span style={{ ...sans, fontSize: 13, fontWeight: 800, color: c, minWidth: 16, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <SLabel>Performance</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["SIG STR/MIN", f.slpm?.toFixed(1)], ["ABSORBED/MIN", f.sapm?.toFixed(1)],
            ["TD ACCURACY", `${f.tdAcc}%`], ["TD DEFENSE", `${f.tdDef}%`],
            ["SUB AVG", f.subAvg?.toFixed(1)], ["FINISH RATE", `${f.finRate}%`]].map(([l, v]) =>
            <SBox key={l} label={l} value={v} />)}
        </div>

        <button onClick={() => setHist(h => !h)} style={{ width: "100%", background: "none", border: `1px solid ${hist ? "#0057e830" : "#e2e5ef"}`, borderRadius: 6, padding: "8px", ...sans, fontSize: 12, fontWeight: 700, color: hist ? "#0057e8" : "#6b7280", letterSpacing: 0, cursor: "pointer", transition: "all .2s", marginBottom: hist ? 10 : 0 }}>
          {hist ? "▲ Hide History" : `▼ Fight History (${f.history.length} bouts)`}
        </button>

        {hist && (
          <div style={{ border: "1px solid #e2e5ef", borderRadius: 8, overflow: "hidden", marginBottom: 4 }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "54px 1fr 22px 88px 22px 72px", gap: 4, padding: "6px 10px", background: "#f0f2f8", borderBottom: "1px solid #e2e5ef" }}>
              {["DATE", "OPPONENT", "", "METHOD", "RD", "EVENT"].map(h => (
                <span key={h} style={{ ...mono, fontSize: 7, color: "#9da3b8", letterSpacing: 1, fontWeight: 700 }}>{h}</span>
              ))}
            </div>
            {/* Rows */}
            {f.history.map((b, i) => {
              const isW = b.res === "W";
              const isRegional = !b.org?.includes("UFC");
              const evtLabel = b.ppv ? "PPV" : b.fn ? "FIGHT NIGHT" : isRegional ? b.org : "FIGHT NIGHT";
              const evtColor = evtLabel === "PPV" ? "#e8001c" : evtLabel === "FIGHT NIGHT" ? "#0057e8" : "#9da3b8";
              const evtBg   = evtLabel === "PPV" ? "#fff0f0" : evtLabel === "FIGHT NIGHT" ? "#f0f5ff" : "#f5f6fa";
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "54px 1fr 22px 88px 22px 72px",
                  gap: 4, padding: "7px 10px",
                  background: i % 2 === 0 ? "#ffffff" : "#f8f9fc",
                  borderBottom: i < f.history.length - 1 ? "1px solid #eef0f6" : "none",
                  borderLeft: `3px solid ${isW ? "#007a4d" : "#e8001c"}`,
                  alignItems: "center"
                }}>
                  <span style={{ ...mono, fontSize: 9, color: "#9da3b8", fontWeight: 600 }}>{b.date?.slice(0, 7)}</span>
                  <span style={{ ...sans, fontSize: 12, fontWeight: 600, color: isW ? "#0d0f14" : "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.opp}</span>
                  <span style={{ ...sans, fontWeight: 800, fontSize: 12, color: isW ? "#007a4d" : "#e8001c", textAlign: "center" }}>{b.res}</span>
                  <span style={{ ...mono, fontSize: 9, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.method}</span>
                  <span style={{ ...mono, fontSize: 9, color: "#9da3b8", textAlign: "center" }}>R{b.rd}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ ...mono, fontSize: 8, fontWeight: 700, color: evtColor, background: evtBg, padding: "2px 5px", borderRadius: 3, whiteSpace: "nowrap" }}>{evtLabel}</span>
                    {b.title && <span style={{ fontSize: 9 }}>🏆</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIGNAL PANEL ─────────────────────────────────────────────────────────────
function SignalPanel({ sig, f1n, f2n, extra1, extra2, note1, note2 }) {
  const c = s => s >= 7 ? "#00e5a0" : s >= 5 ? "#f5a623" : "#ff3d57";
  return (
    <div>
      <div className="signal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ nm: f1n, s: sig.s1, ex: extra1, n: note1 }, { nm: f2n, s: sig.s2, ex: extra2, n: note2 }].map(({ nm, s, ex, n }) => (
          <div key={nm} style={{ background: "#f8f9fc", border: "1px solid #dde0ea", borderRadius: 5, padding: "12px 13px" }}>
            <div style={{ ...mono, fontSize: 8, color: "#7a7f96", marginBottom: 7 }}>{nm}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 7 }}>
              <span style={{ ...sans, fontWeight: 900, fontSize: 36, color: c(s), letterSpacing: "-1px" }}>{s}</span>
              <span style={{ ...mono, fontSize: 7, color: "#8a8fa8" }}>/10</span>
            </div>
            {ex}
            {n && <p style={{ ...sans, fontSize: 10, color: "#6b7080", lineHeight: 1.65, marginTop: 5, fontStyle: "italic" }}>{n}</p>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <INote text={sig.note} />
        <VBadge v={sig.v} who={sig.who} />
      </div>
    </div>
  );
}

// ─── SIGNAL SUMMARY DATA ──────────────────────────────────────────────────────
const SIG_META = {
  walkout:   { icon: "🚶", label: "Walkout" },
  staredown: { icon: "👁", label: "Staredown" },
  weighin:   { icon: "⚖️", label: "Weigh-In" },
  camp:      { icon: "🏋️", label: "Camp" },
  physical:  { icon: "💪", label: "Physical" },
  style:     { icon: "🥊", label: "Style" },
  market:    { icon: "📈", label: "Market" },
  psych:     { icon: "🧠", label: "Psych" },
  stats:     { icon: "📊", label: "Stats" },
  props:     { icon: "🎯", label: "Props" },
  rlm:       { icon: "📉", label: "Line Move" },
  ref:       { icon: "🦺", label: "Referee" },
  travel:    { icon: "✈️", label: "Travel" },
  cage:      { icon: "🔲", label: "Cage" },
  rest:      { icon: "⏱", label: "Days Rest" },
  strikdiff: { icon: "⚡", label: "Str Diff" },
  pace:      { icon: "🔥", label: "Pace" },
  oppqual:   { icon: "🏆", label: "Opp Quality" },
  upset:     { icon: "💥", label: "Upset Model" },
  parlays:   { icon: "🔗", label: "Parlays" },
};

const ALL_SIGS = ["walkout","staredown","weighin","camp","physical","style","market","psych","stats","props","rlm","ref","travel","cage","rest","strikdiff","pace","oppqual","upset","parlays"];
const TL = { profiles: "PROFILES", walkout: "WALKOUT", staredown: "STAREDOWN", weighin: "WEIGH-IN", camp: "CAMP", physical: "PHYSICAL", style: "STYLE", market: "MARKET", psych: "PSYCH", stats: "STATS", props: "PROPS", rlm: "LINE MOVE", ref: "REFEREE", travel: "TRAVEL", cage: "CAGE SIZE", rest: "DAYS REST", strikdiff: "STR DIFF", pace: "PACE/RND", oppqual: "OPP QUALITY", upset: "UPSET MODEL", parlays: "PARLAYS" };

function getBullets(sig, key, f1n, f2n) {
  const s = sig[key];
  if (!s) return [];
  switch(key) {
    case "walkout":   return [`${s.v === "PUSH" ? "Even" : s.who} holds the psychological edge entering the cage`, s.note?.split(". ")[0]];
    case "staredown": return [`${s.v === "PUSH" ? "Neither fighter" : s.who} wins the mental battle`, s.note?.split(". ")[0]];
    case "weighin":   return [`${s.v === "PUSH" ? "Both fighters" : s.who} shows better physical preparation`, s.note?.split(". ")[0]];
    case "camp":      return [`${s.v === "PUSH" ? "Camps are equal" : s.who + " has the superior camp"}`, s.note?.split(". ")[0]];
    case "physical":  return [`${s.v === "PUSH" ? "Physical attributes are even" : s.who + " has the physical edge"}`, s.note?.split(". ")[0]];
    case "style":     return [`Striking edge: ${s.striking || "PUSH"}`, `Grappling edge: ${s.grappling || "PUSH"}`, `Pace edge: ${s.pace || "PUSH"}`];
    case "market":    return [`Sharp money on: ${s.sharp || "split"}`, `Best value: ${s.value || "—"}`, s.note?.split(". ")[0]];
    case "psych":     return [`${s.v === "PUSH" ? "Equal motivation" : s.who + " has the mental edge"}`, s.note?.split(". ")[0]];
    case "stats":     return [`Striking edge: ${s.striking}`, `Grappling edge: ${s.grappling}`, `Pace edge: ${s.pace}`];
    case "props":     return [`Likely method: ${s.method}`, `Over 2.5 rounds: ${s.over25?.toUpperCase()}`, `Finish fighter: ${s.finish}`];
    case "rlm":       return [`Line movement: ${s.movement}`, `Steam alert: ${s.steamAlert ? "YES ⚡" : "No"}`, s.note?.split(". ")[0]];
    case "ref":       return [`Referee: ${s.name}`, `Stoppage style: ${s.stoppage}`, `Avg fight time: ${s.avgFightTime}`];
    case "travel":    return [`Time zone gap: ${s.tzDiff} hours`, `${f1n}: ${s.f1Travel}`, `${f2n}: ${s.f2Travel}`];
    case "cage":      return [`Cage: ${s.size}`, s.note?.split(". ")[0]];
    case "rest":      return [`${f1n}: ${s.f1Days} days rest`, `${f2n}: ${s.f2Days} days rest`, `Optimal range: ${s.optimal}`];
    case "strikdiff": return [`${f1n} net: ${s.f1Net > 0 ? "+" : ""}${s.f1Net}/min`, `${f2n} net: ${s.f2Net > 0 ? "+" : ""}${s.f2Net}/min`, s.note?.split(". ")[0]];
    case "pace":      return [`${f1n} R1→R3 drop: ${(((s.f1R1-s.f1R3)/s.f1R1)*100).toFixed(0)}%`, `${f2n} R1→R3 drop: ${(((s.f2R1-s.f2R3)/s.f2R1)*100).toFixed(0)}%`, s.note?.split(". ")[0]];
    case "oppqual":   return [`${f1n} avg opp rank: #${s.f1AvgRank}`, `${f2n} avg opp rank: #${s.f2AvgRank}`, `Elite wins edge: ${s.v === "PUSH" ? "Even" : s.who}`];
    case "upset":     return [`Dog odds: ${s.dogOdds}`, `Market implied: ${s.impliedProb}%`, `Model probability: ${s.modelProb}% — ${s.modelProb - s.impliedProb < -10 ? "Fade the dog" : s.modelProb - s.impliedProb > 5 ? "Dog has value" : "Near fair"}`];
    case "parlays":   return [`Best leg: ${s.bestLeg}`, `Correlated stack: ${s.stack}`, `Avoid: ${s.avoid}`];
    default: return [s.note?.split(". ")[0]].filter(Boolean);
  }
}

// ─── INTEL PANEL ─────────────────────────────────────────────────────────────
// ─── STYLE ANALYSIS PANEL ─────────────────────────────────────────────────────
function StyleAnalysisPanel({ sa, f1, f2 }) {
  const edgeC = sa.clash.edge === f1.name ? "#0057e8" : sa.clash.edge === f2.name ? "#e8001c" : "#b07d00";
  const winPctColor = p => p >= 60 ? "#007a4d" : p >= 45 ? "#f5a623" : "#e8001c";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }} className="fu">

      {/* ── Fighter Style Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ f: f1, data: sa.f1Style }, { f: f2, data: sa.f2Style }].map(({ f: fi, data: st }, idx) => (
          <div key={fi.name} style={{ background: "#ffffff", border: `2px solid ${idx === 0 ? "#0057e820" : "#e8001c20"}`, borderRadius: 12, padding: "13px", overflow: "hidden" }}>
            <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: idx === 0 ? "#0057e8" : "#e8001c", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 15, color: "#0d0f14", marginBottom: 10 }}>{st.archetype}</div>

            {/* Win % by opponent style */}
            <div style={{ ...sans, fontSize: 9, fontWeight: 700, color: "#9da3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 7 }}>Win % vs Style</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {st.vsStyles.map(({ label, pct, note }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#444858" }}>{label}</span>
                    <span style={{ ...sans, fontSize: 12, fontWeight: 900, color: winPctColor(pct) }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#eef0f5", borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${pct}%`, background: winPctColor(pct), borderRadius: 2 }} />
                  </div>
                  {note && <div style={{ ...sans, fontSize: 10, fontWeight: 500, color: "#9da3b8", marginTop: 2, fontStyle: "italic" }}>{note}</div>}
                </div>
              ))}
            </div>

            {/* Strengths / Weaknesses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ background: "#e6f7f0", borderRadius: 6, padding: "8px" }}>
                <div style={{ ...sans, fontSize: 8, fontWeight: 800, color: "#007a4d", letterSpacing: 1, marginBottom: 5 }}>STRENGTHS</div>
                {st.strengths.map((s, i) => <div key={i} style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#0d4a2e", marginBottom: 3 }}>✓ {s}</div>)}
              </div>
              <div style={{ background: "#fff5f5", borderRadius: 6, padding: "8px" }}>
                <div style={{ ...sans, fontSize: 8, fontWeight: 800, color: "#e8001c", letterSpacing: 1, marginBottom: 5 }}>WEAKNESSES</div>
                {st.weaknesses.map((w, i) => <div key={i} style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#5a1a1a", marginBottom: 3 }}>✗ {w}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Style Clash Breakdown ── */}
      <div style={{ background: "#ffffff", border: "2px solid #e2e5ef", borderRadius: 12, padding: "14px", overflow: "hidden" }}>
        <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#9da3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>⚡ Style Clash Breakdown</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, background: `${edgeC}10`, border: `1px solid ${edgeC}30`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ ...sans, fontWeight: 900, fontSize: 28, color: edgeC, lineHeight: 1 }}>{sa.clash.historicalPct}%</div>
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 700, color: "#9da3b8", textTransform: "uppercase", letterSpacing: 1 }}>{sa.clash.matchupLabel}</div>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: edgeC }}>Edge: {sa.clash.edge === "PUSH" ? "Even" : sa.clash.edge}</div>
          </div>
        </div>
        <p style={{ ...sans, fontSize: 13, fontWeight: 500, color: "#444858", lineHeight: 1.75, marginBottom: 10 }}>{sa.clash.analysis}</p>
        <div style={{ background: "#f8f9fc", borderRadius: 8, padding: "10px 12px", borderLeft: "3px solid #f5a623" }}>
          <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#b07d00", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>📈 Sharp Angle</div>
          <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: "#0d0f14", lineHeight: 1.6 }}>{sa.clash.sharpAngle}</div>
        </div>
      </div>

      {/* ── Key Matchup Questions ── */}
      <div style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 12, padding: "14px" }}>
        <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#9da3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>🔑 Key Matchup Questions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sa.keyQuestions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingBottom: 8, borderBottom: i < sa.keyQuestions.length - 1 ? "1px solid #f0f2f8" : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f0f5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ ...sans, fontSize: 10, fontWeight: 900, color: "#0057e8" }}>{i + 1}</span>
              </div>
              <div>
                <div style={{ ...sans, fontSize: 13, fontWeight: 700, color: "#0d0f14", marginBottom: 3 }}>{q.question}</div>
                <div style={{ ...sans, fontSize: 12, fontWeight: 500, color: "#6b7280", lineHeight: 1.6 }}>{q.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function IntelPanel({ fightId }) {
  const [openSig, setOpenSig] = useState(null);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSignals, setShowSignals] = useState(false);
  const [showStyleAnalysis, setShowStyleAnalysis] = useState(false);
  const d = FIGHT_DATA[fightId];
  if (!d) return null;
  const { f1, f2, signals: sig } = d;
  const verd = sig.verdict;
  const cc = verd.conv === "HIGH" ? "#007a4d" : verd.conv === "MEDIUM" ? "#f5a623" : "#6b7280";
  const f1wins = ALL_SIGS.filter(k => sig[k]?.v === "EDGE" && sig[k]?.who === f1.name).length;
  const f2wins = ALL_SIGS.filter(k => sig[k]?.v === "EDGE" && sig[k]?.who === f2.name).length;
  const pushes = ALL_SIGS.filter(k => sig[k]?.v === "PUSH").length;

  return (
    <div style={{ marginTop: 12 }} className="fu">

      {/* ─────────────────────────────────────────────────────
          PREDICTION CARD  — always visible, no tapping needed
      ───────────────────────────────────────────────────── */}
      <div style={{ background: "#ffffff", border: "2px solid #e2e5ef", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>

        {/* Header strip */}
        <div style={{ background: "linear-gradient(90deg,#0057e8 0%,#1a3fa8 100%)", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>AI PREDICTION</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 22, color: "#ffffff", letterSpacing: "-0.3px" }}>{verd.pick}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>CONVICTION</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 16, color: cc === "#007a4d" ? "#4dffc1" : cc === "#f5a623" ? "#ffd580" : "#aab4cc" }}>{verd.conv}</div>
          </div>
        </div>

        {/* Signal tug-of-war bar */}
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#0d0f14" }}>{f1.flag && <span style={{ marginRight: 3 }}>{f1.flag}</span>}{f1.name} <span style={{ color: "#0057e8", fontWeight: 900 }}>{f1wins}</span></span>
            <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8" }}>{pushes} PUSH · 20 SIGNALS</span>
            <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#0d0f14" }}><span style={{ color: "#e8001c", fontWeight: 900 }}>{f2wins}</span> {f2.name}{f2.flag && <span style={{ marginLeft: 3 }}>{f2.flag}</span>}</span>
          </div>
          <div style={{ height: 7, background: "#e4e6f0", borderRadius: 4, overflow: "hidden", display: "flex" }}>
            <div style={{ height: 7, width: `${(f1wins/20)*100}%`, background: "#0057e8" }} />
            <div style={{ height: 7, width: `${(pushes/20)*100}%`, background: "#dde0ea" }} />
            <div style={{ height: 7, width: `${(f2wins/20)*100}%`, background: "#e8001c" }} />
          </div>
        </div>

        {/* Why this pick */}
        <div style={{ padding: "12px 16px" }}>
          <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#9da3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>THE CALL</div>
          <p style={{ ...sans, fontSize: 14, fontWeight: 500, color: "#0d0f14", lineHeight: 1.75, margin: 0 }}>{verd.angle}</p>
        </div>

        {/* Prop + Sharp row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #f0f2f8" }}>
          {[["🎯 BEST BET", verd.prop], ["📈 SHARP PLAY", verd.sharp]].map(([l, v]) => (
            <div key={l} style={{ padding: "10px 14px", borderRight: l.includes("BET") ? "1px solid #f0f2f8" : "none" }}>
              <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#9da3b8", letterSpacing: 1, marginBottom: 4 }}>{l}</div>
              <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#0d0f14", lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Red flag */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#fff5f5", borderTop: "1px solid #fce8e8", padding: "10px 14px" }}>
          <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 800, color: "#e8001c", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>RED FLAG</div>
            <span style={{ ...sans, fontSize: 12, fontWeight: 500, color: "#5a1a1a", lineHeight: 1.6 }}>{verd.flag}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          20 SIGNAL BREAKDOWN  — collapsible, bullets inside
      ───────────────────────────────────────────────────── */}
      <button onClick={() => setShowSignals(s => !s)}
        style={{ width: "100%", background: "#f8f9fc", border: "1px solid #e2e5ef", borderRadius: 8, padding: "10px 14px", ...sans, fontSize: 12, fontWeight: 700, color: showSignals ? "#0057e8" : "#6b7280", cursor: "pointer", textAlign: "left", marginBottom: showSignals ? 8 : 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{showSignals ? "▲ 20 Signal Breakdown" : "▼ 20 Signal Breakdown"}</span>
        <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8" }}>tap any to expand</span>
      </button>

      {showSignals && <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 12 }}>
        {ALL_SIGS.map(key => {
          const s = sig[key];
          if (!s) return null;
          const isF1 = s.who === f1.name;
          const isPush = s.v === "PUSH";
          const edgeColor = isPush ? "#b07d00" : isF1 ? "#0057e8" : "#e8001c";
          const bg        = isPush ? "#fffbf0" : isF1 ? "#f0f5ff" : "#fff5f5";
          const border    = isPush ? "#f5a62325" : isF1 ? "#0057e820" : "#e8001c20";
          const meta = SIG_META[key];
          const bullets = getBullets(sig, key, f1.name, f2.name);
          const isOpen = openSig === key;

          return (
            <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
              {/* Always-visible row */}
              <div style={{ display: "flex", alignItems: "flex-start", padding: "10px 12px", gap: 10 }}>
                <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>{meta.label}</span>
                    <span style={{ ...sans, fontSize: 12, fontWeight: 900, color: edgeColor, flexShrink: 0, marginLeft: 8 }}>{isPush ? "PUSH" : s.who}</span>
                  </div>
                  {/* Key bullets always shown */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {bullets.slice(0, 2).filter(Boolean).map((b, i) => (
                      <div key={i} style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                        <span style={{ color: edgeColor, fontSize: 10, flexShrink: 0, marginTop: 2 }}>›</span>
                        <span style={{ ...sans, fontSize: 12, fontWeight: 500, color: "#444858", lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setOpenSig(isOpen ? null : key)}
                  style={{ background: "none", border: `1px solid ${edgeColor}30`, borderRadius: 6, padding: "4px 8px", ...sans, fontSize: 10, fontWeight: 700, color: edgeColor, cursor: "pointer", flexShrink: 0, alignSelf: "center" }}>
                  {isOpen ? "▲" : "▼"}
                </button>
              </div>

              {/* Expanded: full data */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${border}`, padding: "12px 14px", background: "#ffffff" }} className="fu">
                  {renderDetailTab(key, sig, f1, f2)}
                </div>
              )}
            </div>
          );
        })}
      </div>}

      {/* ── FIGHT STYLE ANALYSIS ── */}
      <button onClick={() => setShowStyleAnalysis(s => !s)}
        style={{ width: "100%", background: "#f8f9fc", border: "1px solid #e2e5ef", borderRadius: 8, padding: "10px 14px", ...sans, fontSize: 12, fontWeight: 700, color: showStyleAnalysis ? "#0057e8" : "#6b7280", cursor: "pointer", textAlign: "left", marginBottom: showStyleAnalysis ? 8 : 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{showStyleAnalysis ? "▲ Fight Style Analysis" : "▼ Fight Style Analysis"}</span>
        <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8" }}>🥊 matchup breakdown</span>
      </button>

      {showStyleAnalysis && d.styleAnalysis && (
        <StyleAnalysisPanel sa={d.styleAnalysis} f1={f1} f2={f2} />
      )}

      {/* Fighter profiles accordion */}
      <button onClick={() => setShowProfiles(p => !p)}
        style={{ width: "100%", background: "#f8f9fc", border: "1px solid #e2e5ef", borderRadius: 8, padding: "10px 14px", ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", cursor: "pointer", textAlign: "left", marginBottom: showProfiles ? 8 : 0 }}>
        {showProfiles ? "▲ Hide Fighter Profiles" : "▼ Fighter Profiles"}
      </button>

      {showProfiles && (
        <div className="profiles-grid fu" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Profile f={f1} accent="#6b7280" />
          <Profile f={f2} accent="#e8001c" />
        </div>
      )}

    </div>
  );
}

function renderDetailTab(key, sig, f1, f2) {
  const s = sig[key];
  if (!s) return null;

  if (key === "walkout" || key === "staredown" || key === "weighin" || key === "camp" || key === "psych") {
    const c = n => n >= 7 ? "#007a4d" : n >= 5 ? "#f5a623" : "#e8001c";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ nm: f1.name, score: s.s1, note: key === "walkout" ? f1.walkout : key === "staredown" ? f1.staredown : key === "weighin" ? f1.weighin : key === "camp" ? f1.camp : "" },
          { nm: f2.name, score: s.s2, note: key === "walkout" ? f2.walkout : key === "staredown" ? f2.staredown : key === "weighin" ? f2.weighin : key === "camp" ? f2.camp : "" }].map(({ nm, score, note }) => (
          <div key={nm} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{nm}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 32, color: c(score), letterSpacing: "-1px", marginBottom: 6 }}>{score}<span style={{ fontSize: 12, color: "#9da3b8" }}>/10</span></div>
            {note && <p style={{ ...sans, fontSize: 12, fontWeight: 500, color: "#444858", lineHeight: 1.6, fontStyle: "italic" }}>{note}</p>}
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "physical") {
    const c = n => n >= 7 ? "#007a4d" : n >= 5 ? "#f5a623" : "#e8001c";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ f: f1, score: s.s1 }, { f: f2, score: s.s2 }].map(({ f: fi, score }) => (
          <div key={fi.name} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 32, color: c(score), letterSpacing: "-1px", marginBottom: 8 }}>{score}<span style={{ fontSize: 12, color: "#9da3b8" }}>/10</span></div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Pill label={`+${fi.rehydLbs}lbs rehydr`} color="#f5a623" />
              <Pill label={`Chin ${fi.chinRating}/10`} color={fi.chinRating >= 7 ? "#007a4d" : "#e8001c"} />
              {fi.postKO && <Pill label="Post-KO ⚠" color="#e8001c" />}
            </div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "style") {
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[f1, f2].map(fi => (
          <div key={fi.name} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <Pill label={fi.archetype} color="#444858" />
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
              {[["STANCE", fi.stance], ["VS PRESSER", fi.vsPresser?.toUpperCase()], ["VS COUNTER", fi.vsCounter?.toUpperCase()]].map(([l, v]) => (
                <div key={l}><span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8" }}>{l}: </span><span style={{ ...sans, fontSize: 12, fontWeight: 700, color: v === "EXCELLENT" ? "#007a4d" : v === "POOR" ? "#e8001c" : "#444858" }}>{v}</span></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[["STRIKING", s.striking], ["GRAPPLING", s.grappling], ["PACE", s.pace], ["STANCE", s.stance]].map(([l, v]) => (
          <div key={l} style={{ background: "#f8f9fc", border: "1px solid #e2e5ef", borderRadius: 6, padding: "6px 10px" }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, color: "#9da3b8", marginBottom: 2 }}>{l}</div>
            <div style={{ ...sans, fontSize: 13, fontWeight: 800, color: v === "PUSH" ? "#f5a623" : "#0d0f14" }}>{v || "PUSH"}</div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "market") {
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[f1, f2].map(fi => (
          <div key={fi.name} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ ...sans, fontSize: 12, fontWeight: 600, color: "#9da3b8" }}>{fi.openOdds}</span>
              <span style={{ color: "#c8cad5" }}>→</span>
              <span style={{ ...sans, fontWeight: 900, fontSize: 20, color: isFav(fi.curOdds) ? "#e8001c" : "#007a4d" }}>{fi.curOdds}</span>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
              {fi.lineMove === "steaming" && <Pill label="STEAM ↑" color="#e8001c" />}
              {fi.lineMove === "stable" && <Pill label="STABLE" color="#9da3b8" />}
              {fi.sharp === "with" && <Pill label="SHARP ✓" color="#007a4d" />}
              <Pill label={`CLV ${fi.clv}`} color={fi.clv?.startsWith("+") ? "#007a4d" : "#e8001c"} />
            </div>
            <div style={{ ...sans, fontSize: 11, fontWeight: 600, color: "#9da3b8", marginBottom: 3 }}>PUBLIC {fi.pubPct}%</div>
            <div style={{ height: 3, background: "#e4e6f0", borderRadius: 2 }}><div style={{ height: 3, width: `${fi.pubPct}%`, background: "#b0b5cc", borderRadius: 2 }} /></div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "stats") {
    return <div>
      <div style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#9da3b8", marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
        <span>{f1.name}</span><span>HEAD TO HEAD</span><span>{f2.name}</span>
      </div>
      <HBar label="SIG STRIKES/MIN" v1={f1.slpm} v2={f2.slpm} max={8} fmt={x => x.toFixed(1)} />
      <HBar label="ABSORBED/MIN" v1={f1.sapm} v2={f2.sapm} max={8} fmt={x => x.toFixed(1)} />
      <HBar label="TD ACCURACY" v1={f1.tdAcc} v2={f2.tdAcc} max={100} fmt={x => `${x}%`} />
      <HBar label="TD DEFENSE" v1={f1.tdDef} v2={f2.tdDef} max={100} fmt={x => `${x}%`} />
      <HBar label="SUB AVG" v1={f1.subAvg} v2={f2.subAvg} max={5} fmt={x => x.toFixed(1)} />
      <HBar label="FINISH RATE" v1={f1.finRate} v2={f2.finRate} max={100} fmt={x => `${x}%`} />
      <INote text={s.note} />
    </div>;
  }

  if (key === "props") {
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[["LIKELY METHOD", s.method, "#0d0f14"], ["OVER 2.5 RDS", s.over25?.toUpperCase(), s.over25 === "yes" ? "#007a4d" : "#e8001c"], ["FINISH FIGHTER", s.finish, "#0d0f14"]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "10px" }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, color: "#9da3b8", marginBottom: 4, textTransform: "uppercase" }}>{l}</div>
            <div style={{ ...sans, fontWeight: 800, fontSize: 14, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <HBar label="AVG ROUNDS" v1={f1.avgRds} v2={f2.avgRds} max={5} fmt={x => `R${x.toFixed(1)}`} />
      <HBar label="R1 FINISH %" v1={f1.r1FinRate} v2={f2.r1FinRate} max={100} fmt={x => `${x}%`} />
      <HBar label="DECISION RATE" v1={f1.decRate} v2={f2.decRate} max={100} fmt={x => `${x}%`} />
      <INote text={s.note} />
    </div>;
  }

  if (key === "rlm") {
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ name: f1.name, open: s.openF1, cur: s.curF1 }, { name: f2.name, open: s.openF2, cur: s.curF2 }].map((fi, i) => {
          const moved = fi.open !== fi.cur;
          return <div key={i} style={{ background: "#ffffff", border: `1px solid ${moved ? "#f5a62340" : "#e2e5ef"}`, borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>{fi.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div><div style={{ ...sans, fontSize: 9, color: "#9da3b8", marginBottom: 2 }}>OPEN</div><div style={{ ...sans, fontSize: 16, fontWeight: 800, color: "#9da3b8" }}>{fi.open}</div></div>
              <div style={{ color: "#c8cad5" }}>→</div>
              <div><div style={{ ...sans, fontSize: 9, color: "#9da3b8", marginBottom: 2 }}>NOW</div><div style={{ ...sans, fontSize: 20, fontWeight: 900, color: moved ? "#f5a623" : "#444858" }}>{fi.cur}</div></div>
            </div>
          </div>;
        })}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "ref") {
    const sc = s.stoppage === "early" ? "#e8001c" : s.stoppage === "late" ? "#007a4d" : "#f5a623";
    return <div>
      <div style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 10, padding: "14px", marginBottom: 12 }}>
        <div style={{ ...sans, fontWeight: 900, fontSize: 22, color: "#0d0f14", marginBottom: 10 }}>{s.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[["STOPPAGE", s.stoppage?.toUpperCase(), sc], ["GROUND TOLERANCE", s.groundTolerance?.toUpperCase(), "#444858"], ["AVG FIGHT TIME", s.avgFightTime, "#444858"]].map(([l, v, c]) => (
            <div key={l} style={{ background: "#f8f9fc", borderRadius: 6, padding: "8px" }}>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, color: "#9da3b8", marginBottom: 3 }}>{l}</div>
              <div style={{ ...sans, fontSize: 13, fontWeight: 800, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff8e6", borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
        <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#b07d00", marginBottom: 4 }}>NOTABLE</div>
        <div style={{ ...sans, fontSize: 13, fontWeight: 500, color: "#444858", lineHeight: 1.6 }}>{s.notable}</div>
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "travel") {
    const tc = s.tzDiff >= 4 ? "#e8001c" : s.tzDiff >= 2 ? "#f5a623" : "#9da3b8";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ name: f1.name, zone: s.f1Zone, travel: s.f1Travel }, { name: f2.name, zone: s.f2Zone, travel: s.f2Travel }].map((fi, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>{fi.name}</div>
            <div style={{ ...sans, fontSize: 14, fontWeight: 800, color: "#444858", marginBottom: 4 }}>{fi.zone}</div>
            <div style={{ ...sans, fontSize: 12, fontWeight: 500, color: "#6b7280", lineHeight: 1.5 }}>{fi.travel}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8f9fc", border: `2px solid ${tc}30`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
        <div style={{ ...sans, fontWeight: 900, fontSize: 30, color: tc }}>{s.tzDiff}</div>
        <div><div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#9da3b8", textTransform: "uppercase" }}>TIME ZONE DIFFERENCE</div><div style={{ ...sans, fontSize: 12, color: "#6b7280" }}>{s.tzDiff >= 4 ? "Significant burden" : s.tzDiff >= 2 ? "Moderate" : "Minimal"}</div></div>
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "cage") {
    return <div>
      <div style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 10, padding: "14px", marginBottom: 12, textAlign: "center" }}>
        <div style={{ ...sans, fontWeight: 900, fontSize: 24, color: "#0d0f14", marginBottom: 4 }}>{s.size}</div>
        <div style={{ ...sans, fontSize: 13, color: "#6b7280" }}>{s.type}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {[{ name: f1.name, style: s.f1Style }, { name: f2.name, style: s.f2Style }].map((fi, i) => (
          <div key={i} style={{ background: "#f8f9fc", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <div style={{ ...sans, fontSize: 13, fontWeight: 500, color: "#444858", lineHeight: 1.6 }}>{fi.style}</div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "rest") {
    const dc = d => d >= 90 && d <= 180 ? "#007a4d" : d > 180 && d <= 270 ? "#f5a623" : "#e8001c";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ name: f1.name, last: s.f1LastFight, days: s.f1Days }, { name: f2.name, last: s.f2LastFight, days: s.f2Days }].map((fi, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 30, color: dc(fi.days), letterSpacing: "-1px" }}>{fi.days}</div>
            <div style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8", marginBottom: 6 }}>DAYS REST</div>
            <div style={{ height: 4, background: "#e4e6f0", borderRadius: 2 }}><div style={{ height: 4, width: `${Math.min((fi.days/365)*100,100)}%`, background: dc(fi.days), borderRadius: 2 }} /></div>
            <div style={{ ...sans, fontSize: 10, color: "#9da3b8", marginTop: 4 }}>Last fight: {fi.last}</div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "strikdiff") {
    const nc = n => n > 0 ? "#007a4d" : "#e8001c";
    return <div>
      <HBar label="LANDED/MIN" v1={s.f1Landed} v2={s.f2Landed} max={8} fmt={x => x.toFixed(2)} />
      <HBar label="ABSORBED/MIN" v1={s.f1Absorbed} v2={s.f2Absorbed} max={8} fmt={x => x.toFixed(2)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
        {[{ name: f1.name, net: s.f1Net }, { name: f2.name, net: s.f2Net }].map((fi, i) => (
          <div key={i} style={{ background: "#ffffff", border: `2px solid ${nc(fi.net)}30`, borderRadius: 8, padding: "12px", textAlign: "center" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 28, color: nc(fi.net) }}>{fi.net > 0 ? "+" : ""}{fi.net.toFixed(2)}</div>
            <div style={{ ...sans, fontSize: 10, color: "#9da3b8" }}>net/min</div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "pace") {
    return <div>
      <HBar label="ROUND 1" v1={s.f1R1} v2={s.f2R1} max={10} fmt={x => x.toFixed(1)} />
      <HBar label="ROUND 2" v1={s.f1R2} v2={s.f2R2} max={10} fmt={x => x.toFixed(1)} />
      <HBar label="ROUND 3" v1={s.f1R3} v2={s.f2R3} max={10} fmt={x => x.toFixed(1)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
        {[{ name: f1.name, r1: s.f1R1, r3: s.f1R3 }, { name: f2.name, r1: s.f2R1, r3: s.f2R3 }].map((fi, i) => {
          const drop = ((fi.r1-fi.r3)/fi.r1*100).toFixed(0);
          const dc = drop > 30 ? "#e8001c" : drop > 15 ? "#f5a623" : "#007a4d";
          return <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px", textAlign: "center" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 28, color: dc }}>{drop}%</div>
            <div style={{ ...sans, fontSize: 10, color: dc, fontWeight: 700 }}>{drop > 30 ? "FADES HARD" : drop > 15 ? "MODERATE FADE" : "CONSISTENT"}</div>
          </div>;
        })}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "oppqual") {
    const rc = r => r <= 10 ? "#007a4d" : r <= 20 ? "#f5a623" : "#e8001c";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ name: f1.name, rank: s.f1AvgRank, wins: s.f1EliteWins }, { name: f2.name, rank: s.f2AvgRank, wins: s.f2EliteWins }].map((fi, i) => (
          <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "12px" }}>
            <div style={{ ...sans, fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>{fi.name}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 28, color: rc(fi.rank), letterSpacing: "-1px", marginBottom: 6 }}>#{fi.rank}</div>
            <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#9da3b8", marginBottom: 4 }}>NOTABLE WINS</div>
            {fi.wins?.map((w, j) => <div key={j} style={{ ...sans, fontSize: 12, fontWeight: 600, color: "#444858", marginBottom: 2 }}>✓ {w}</div>)}
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "upset") {
    const edge = s.modelProb - s.impliedProb;
    const ec = edge < -15 ? "#e8001c" : edge < -5 ? "#f5a623" : "#007a4d";
    return <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[["DOG ODDS", s.dogOdds, "#444858"], ["MARKET IMPLIED", `${s.impliedProb}%`, "#444858"], ["MODEL PROB", `${s.modelProb}%`, ec]].map(([l, v, c]) => (
          <div key={l} style={{ background: "#ffffff", border: "1px solid #e2e5ef", borderRadius: 8, padding: "10px", textAlign: "center" }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, color: "#9da3b8", marginBottom: 4, textTransform: "uppercase" }}>{l}</div>
            <div style={{ ...sans, fontWeight: 900, fontSize: 20, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: `${ec}10`, border: `2px solid ${ec}30`, borderRadius: 8, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ ...sans, fontWeight: 900, fontSize: 26, color: ec }}>{edge > 0 ? "+" : ""}{edge}%</div>
        <div><div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#9da3b8", textTransform: "uppercase" }}>MODEL EDGE</div><div style={{ ...sans, fontSize: 12, color: "#6b7280" }}>{edge < -15 ? "Strong fade signal" : edge < -5 ? "Mild fade" : "No edge"}</div></div>
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  if (key === "parlays") {
    return <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {[["✓ BEST LEG", s.bestLeg, "#007a4d", "#e6f7f0"], ["⚡ STACK", s.stack, "#0057e8", "#f0f4ff"], ["✗ AVOID", s.avoid, "#e8001c", "#fff5f5"]].map(([l, v, c, bg]) => (
          <div key={l} style={{ background: bg, border: `1px solid ${c}20`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ ...sans, fontSize: 10, fontWeight: 800, color: c, marginBottom: 3 }}>{l}</div>
            <div style={{ ...sans, fontSize: 14, fontWeight: 700, color: "#0d0f14" }}>{v}</div>
          </div>
        ))}
      </div>
      <INote text={s.note} />
      <div style={{ marginTop: 8 }}><VBadge v={s.v} who={s.who} /></div>
    </div>;
  }

  return <div><INote text={s.note || "No detail available."} /></div>;
}

// ─── FIGHT ROW ────────────────────────────────────────────────────────────────

// ─── API KEYS (injected via Vercel env vars) ──────────────────────────────────
const ODDS_KEY    = process.env.REACT_APP_ODDS_KEY    || "";
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY || "";

// ─── LIVE ODDS HOOK ───────────────────────────────────────────────────────────
// Fetches UFC moneylines from The Odds API, refreshes every 5 minutes
function useLiveOdds() {
  const [odds, setOdds] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!ODDS_KEY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/?apiKey=${ODDS_KEY}&regions=us&markets=h2h&oddsFormat=american`
      );
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const map = {};
      data.forEach(event => {
        const [f1name, f2name] = event.home_team
          ? [event.home_team, event.away_team]
          : [event.away_team, event.home_team];
        const book = event.bookmakers?.find(b => b.key === "draftkings") || event.bookmakers?.[0];
        if (!book) return;
        const h2h = book.markets?.find(m => m.key === "h2h");
        if (!h2h) return;
        const o1 = h2h.outcomes?.find(o => o.name === event.home_team);
        const o2 = h2h.outcomes?.find(o => o.name === event.away_team);
        if (o1 && o2) {
          const fmt = n => n > 0 ? `+${n}` : `${n}`;
          map[`${f1name}|${f2name}`] = { f1: fmt(o1.price), f2: fmt(o2.price) };
          map[`${f2name}|${f1name}`] = { f1: fmt(o2.price), f2: fmt(o1.price) };
        }
      });
      setOdds(map);
      setLastUpdate(new Date());
    } catch(e) {
      console.warn("Odds fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, [fetch_]);

  return { odds, lastUpdate, loading, refresh: fetch_ };
}

// ─── FIGHTER PHOTO HOOK (RapidAPI MMA) ────────────────────────────────────────
// Fighter name → their ID on API-Sports MMA for photo lookup
const MMA_FIGHTER_IDS = {
  "Josh Emmett":       3877,
  "Kevin Vallejos":    null,   // newer fighter, may not be in DB yet
  "Amanda Lemos":      7442,
  "Gillian Robertson": 7553,
  "Ion Cutelaba":      5141,
  "Oumar Sy":          null,
  "Vitor Petrino":     null,
  "Steven Asplund":    null,
  "Andre Fili":        3876,
  "Jose Delgado":      null,
  "Piera Rodriguez":   null,
  "Sam Hughes":        null,
};

const photoCache = {};

function useFighterPhoto(name) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (photoCache[name]) { setUrl(photoCache[name]); return; }
    // Go straight to Wikipedia (UFC CDN is CORS-blocked in browsers)
    fetchWikiPhoto(name, setUrl);
  }, [name]);

  return url;
}

function useFighterPhotoLEGACY(name) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (photoCache[name]) { setUrl(photoCache[name]); return; }

    const fighterId = MMA_FIGHTER_IDS[name];
    if (RAPIDAPI_KEY && fighterId) {
      fetch(`https://mma-api.p.rapidapi.com/fighters/${fighterId}`, {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "mma-api.p.rapidapi.com"
        }
      })
        .then(r => r.json())
        .then(d => {
          const img = d?.response?.[0]?.photo || d?.photo || null;
          if (img) { photoCache[name] = img; setUrl(img); return; }
          // Fall back to Wikipedia if no RapidAPI photo
          fetchWikiPhoto(name, setUrl);
        })
        .catch(() => fetchWikiPhoto(name, setUrl));
      return;
    }
    // No RapidAPI ID — go straight to Wikipedia
    fetchWikiPhoto(name, setUrl);
  }, [name]);

  return url;
}

// Wikipedia fallback (free, CORS-open)
const WIKI_TITLES = {
  "Josh Emmett":       "Josh_Emmett",
  "Kevin Vallejos":    "Kevin_Vallejos",
  "Amanda Lemos":      "Amanda_Lemos",
  "Gillian Robertson": "Gillian_Robertson_(fighter)",
  "Ion Cutelaba":      "Ion_Cuțelaba",
  "Oumar Sy":          "Oumar_Sy_(MMA_fighter)",
  "Vitor Petrino":     "Vitor_Petrino",
  "Steven Asplund":    "Steven_Asplund",
  "Andre Fili":        "Andre_Fili",
  "Jose Delgado":      "Jose_Delgado_(fighter)",
  "Piera Rodriguez":   "Piera_Rodríguez",
  "Sam Hughes":        "Sam_Hughes_(MMA_fighter)",
  "Movsar Evloev":     "Movsar_Evloev",
  "Lerone Murphy":     "Lerone_Murphy",
  "Israel Adesanya":   "Israel_Adesanya",
  "Joe Pyfer":         "Joe_Pyfer",
  "Renato Moicano":    "Renato_Moicano",
  "Chris Duncan":      "Chris_Duncan_(MMA_fighter)",
  "Jiří Procházka":    "Jiří_Procházka",
  "Carlos Ulberg":     "Carlos_Ulberg",
};

function fetchWikiPhoto(name, setUrl) {
  const title = WIKI_TITLES[name];
  if (!title) return;
  if (photoCache[name]) { setUrl(photoCache[name]); return; }
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    .then(r => r.json())
    .then(d => {
      const img = d?.originalimage?.source || d?.thumbnail?.source || null;
      if (img) { photoCache[name] = img; setUrl(img); }
    })
    .catch(() => {});
}

// ─── PHOTO CARD ───────────────────────────────────────────────────────────────
function PhotoCard({ fdata, side, height = 140 }) {
  const wikiUrl = useFighterPhoto(fdata?.name);
  const [ufcErr, setUfcErr] = useState(false);
  const [wikiErr, setWikiErr] = useState(false);
  const initials = fdata?.name?.split(" ").map(w => w[0]).join("") || "?";
  const ufcSrc = fdata?.photo && !ufcErr ? fdata.photo : null;
  const imgSrc = ufcSrc || (wikiUrl && !wikiErr ? wikiUrl : null);

  return (
    <div style={{ position: "relative", height, background: "#12121a", overflow: "hidden" }}>
      {/* Dark vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)", zIndex: 1, pointerEvents: "none" }} />

      {imgSrc ? (
        <img
          src={imgSrc}
          alt={fdata?.name}
          onError={() => { if (ufcSrc) setUfcErr(true); else setWikiErr(true); }}
          style={{
            position: "absolute", bottom: 0,
            left: "50%", transform: "translateX(-50%)",
            height: "105%", width: "auto",
            objectFit: "contain", objectPosition: "top center", zIndex: 2,
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1e1e2a", border: "2px solid #2a2a3a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter Tight,Inter,sans-serif", fontWeight: 900, fontSize: 20, color: "#4a4a6a" }}>{initials}</span>
          </div>
        </div>
      )}

    </div>
  );
}

function FighterCard({ fdata, odds, side, picked, onPick, done, isWinner }) {
  const isFav_ = odds && isFav(odds);
  const isPicked = picked === side;
  const otherPicked = picked && picked !== side;

  return (
    <button onClick={onPick} disabled={done}
      style={{ background: isPicked ? (side === "f1" ? "#0d1a3a" : "#2a0a0e") : otherPicked ? "#0e0e14" : "#12121a",
        border: `2px solid ${isPicked ? (side === "f1" ? "#1a3a8a" : "#8a1a1a") : "#1e1e2a"}`,
        borderRadius: 12, padding: 0, cursor: done ? "default" : "pointer",
        textAlign: side === "f1" ? "left" : "right", width: "100%", overflow: "hidden",
        transition: "all .15s", opacity: otherPicked ? 0.45 : 1 }}>

      {/* Photo area with overlays */}
      <div style={{ position: "relative" }}>
        <PhotoCard fdata={fdata} side={side} height={140} />
        {/* Odds top */}
        {odds && (
          <div style={{ position: "absolute", top: 8, [side === "f1" ? "left" : "right"]: 8, background: "rgba(0,0,0,0.65)", borderRadius: 6, padding: "3px 7px", display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "Inter Tight,Inter,sans-serif", fontWeight: 900, fontSize: 16, color: isFav_ ? "#ff6b6b" : "#4dffc1" }}>{odds}</span>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>{toImplied(odds)}%</span>
          </div>
        )}

        {/* Picked badge — sits above frosted strip */}
        {isPicked && (
          <div style={{ position: "absolute", bottom: 32, [side === "f1" ? "left" : "right"]: 8, background: side === "f1" ? "#0057e8" : "#e8001c", borderRadius: 4, padding: "2px 7px", zIndex: 6 }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>✓ PICKED</span>
          </div>
        )}
        {isWinner && (
          <div style={{ position: "absolute", bottom: 32, [side === "f1" ? "left" : "right"]: 8, background: "#007a4d", borderRadius: 4, padding: "2px 7px", zIndex: 6 }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>WINNER</span>
          </div>
        )}
      </div>

      {/* Name + flag row */}
      <div style={{ padding: "8px 10px 10px", background: "#16161f", borderTop: "1px solid #1e1e2a" }}>
        <div style={{ ...cond, fontWeight: 900, fontSize: 16, letterSpacing: "-0.2px", color: "#f0f0f8", lineHeight: 1.15, marginBottom: 5 }}>{fdata?.name || "—"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: side === "f2" ? "flex-end" : "flex-start" }}>
          {fdata?.flag && <span style={{ fontSize: 18, lineHeight: 1, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}>{fdata.flag}</span>}
          <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#4a4a6a" }}>{fdata?.nationality}</span>
          {fdata?.record && <span style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#3a3a55" }}>· {fdata.record}</span>}
        </div>
      </div>
    </button>
  );
}

function FightRow({ fight, picks, onPick }) {
  const [open, setOpen] = useState(false);
  const p = picks[fight.id];
  const done = fight.status === "COMPLETED";
  const fd = FIGHT_DATA[fight.id];
  const f1data = fd?.f1;
  const f2data = fd?.f2;

  return (
    <div style={{ borderBottom: "1px solid #1e1e2a", paddingBottom: 28, marginBottom: 28 }}>
      {/* Weight class + result badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ ...mono, fontSize: 8, color: "#3a3a55", letterSpacing: 1 }}>{fight.wc}</span>
        {done && fight.winner && <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#4caf7d", background: "rgba(76,175,125,0.12)", padding: "3px 10px", borderRadius: 20 }}>✓ {fight.winner} · {fight.method}</span>}
      </div>

      {/* Fighter photo cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", marginBottom: 10, gap: 0 }}>
        <FighterCard fdata={f1data} odds={fight.f1odds} side="f1" picked={p} onPick={() => !done && onPick(fight.id, "f1")} done={done} isWinner={done && fight.winner === fight.f1} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0e14", zIndex: 1 }}>
          <span style={{ ...mono, fontSize: 8, fontWeight: 800, color: "#2a2a40" }}>vs</span>
        </div>
        <FighterCard fdata={f2data} odds={fight.f2odds} side="f2" picked={p} onPick={() => !done && onPick(fight.id, "f2")} done={done} isWinner={done && fight.winner === fight.f2} />
      </div>

      {!done && (
        <div>
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", ...sans, fontSize: 13, fontWeight: 700, color: open ? "#e53935" : "#3a3a55", letterSpacing: 0, cursor: "pointer", padding: "6px 0", transition: "color .15s" }}>
            {open ? "▲ COLLAPSE" : "▼ FIGHTER INTELLIGENCE"}
          </button>
          {open && <IntelPanel fightId={fight.id} />}
        </div>
      )}

      {p && !done && (
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: p === "f1" ? "#3a5aaa" : "#e53935" }} />
          <span style={{ ...mono, fontSize: 8, color: "#3a3a55", letterSpacing: 1 }}>PICK:</span>
          <span style={{ ...cond, fontWeight: 700, fontSize: 14, color: "#9090b8" }}>{p === "f1" ? fight.f1 : fight.f2}</span>
          <span style={{ ...sans, fontSize: 15, fontWeight: 800, color: isFav(p === "f1" ? fight.f1odds : fight.f2odds) ? "#e53935" : "#4caf7d" }}>{p === "f1" ? fight.f1odds : fight.f2odds}</span>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    name: "UFC FN: Emmett vs. Vallejos", date: "Sat, Mar 14 · Meta APEX, Las Vegas · Main 8PM / Prelims 5PM EDT", status: "upcoming",
    fights: [
      // ── MAIN CARD ──
      { id: "e1",  f1: "Josh Emmett",       f2: "Kevin Vallejos",     wc: "Featherweight · Main Event",   status: "UPCOMING", f1odds: "-185", f2odds: "+155" },
      { id: "e2",  f1: "Amanda Lemos",       f2: "Gillian Robertson",  wc: "Strawweight · Co-Main",        status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "e3",  f1: "Ion Cutelaba",       f2: "Oumar Sy",           wc: "Light Heavyweight",            status: "UPCOMING", f1odds: "+110", f2odds: "-135" },
      { id: "e4",  f1: "Vitor Petrino",      f2: "Steven Asplund",     wc: "Heavyweight",                  status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "e5",  f1: "Andre Fili",         f2: "Jose Delgado",       wc: "Featherweight",                status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "e6",  f1: "Piera Rodriguez",    f2: "Sam Hughes",         wc: "Strawweight",                  status: "UPCOMING", f1odds: "-160", f2odds: "+132" },
      // ── PRELIMS ──
      { id: "e7",  f1: "Eryk Anders",        f2: "Brad Tavares",       wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "+100", f2odds: "-120" },
      { id: "e8",  f1: "Chris Curtis",       f2: "Myktybek Orolbai",   wc: "Welterweight · Prelims",       status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "e9",  f1: "Bruno Silva",        f2: "Charles Johnson",    wc: "Flyweight · Prelims",          status: "UPCOMING", f1odds: "+115", f2odds: "-140" },
      { id: "e10", f1: "Bolaji Oki",         f2: "Manoel Sousa",       wc: "Lightweight · Prelims",        status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "e11", f1: "Rinya Nakamura",     f2: "Luan Lacerda",       wc: "Bantamweight · Prelims",       status: "UPCOMING", f1odds: "-250", f2odds: "+200" },
      { id: "e12", f1: "Bia Mesquita",       f2: "Montserrat Rendon",  wc: "Bantamweight · Prelims",       status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "e13", f1: "Elijah Smith",       f2: "SuYoung You",        wc: "Bantamweight · Prelims",       status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "e14", f1: "Marwan Rahiki",      f2: "Harry Hardwick",     wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
    ]
  },
  {
    name: "UFC FN: Evloev vs. Murphy", date: "Sat, Mar 21 · O2 Arena, London 🇬🇧 · Main 4PM / Prelims 1PM EDT", status: "upcoming",
    fights: [
      // ── MAIN CARD ──
      { id: "ev1",  f1: "Movsar Evloev",      f2: "Lerone Murphy",      wc: "Featherweight · Title Eliminator · MAIN EVENT", status: "UPCOMING", f1odds: "-160", f2odds: "+130" },
      { id: "ev2",  f1: "Luke Riley",         f2: "Michael Aswell",     wc: "Featherweight · Co-Main",      status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "ev3",  f1: "Roman Dolidze",      f2: "Christian L. Duncan",wc: "Middleweight",                 status: "UPCOMING", f1odds: "-150", f2odds: "+125" },
      { id: "ev4",  f1: "Iwo Baraniewski",    f2: "Austen Lane",        wc: "Light Heavyweight",            status: "UPCOMING", f1odds: "-135", f2odds: "+112" },
      { id: "ev5",  f1: "Kurtis Campbell",    f2: "Danny Silva",        wc: "Featherweight",                status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      // ── PRELIMS ──
      { id: "ev6",  f1: "Michael Page",       f2: "Sam Patterson",      wc: "Welterweight · Prelims",       status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "ev7",  f1: "Mason Jones",        f2: "Axel Sola",          wc: "Lightweight · Prelims",        status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "ev8",  f1: "Shanelle Dyer",      f2: "Ravena Oliveira",    wc: "Strawweight · Prelims",        status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "ev9",  f1: "Nathaniel Wood",     f2: "Losene Keita",       wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-250", f2odds: "+200" },
      { id: "ev10", f1: "Louie Sutherland",   f2: "Brando Pericic",     wc: "Heavyweight · Prelims",        status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "ev11", f1: "Antonio Trocoli",    f2: "Mantas Kondratav.",   wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "-115", f2odds: "-105" },
      { id: "ev12", f1: "Mario Pinto",        f2: "Felipe Franco",      wc: "Heavyweight · Prelims",        status: "UPCOMING", f1odds: "-250", f2odds: "+200" },
      { id: "ev13", f1: "Shem Rock",          f2: "A. Al-Selwady",      wc: "Lightweight · Prelims",        status: "UPCOMING", f1odds: "-140", f2odds: "+115" },
      { id: "ev14", f1: "Melissa Mullins",    f2: "Luana Carolina",     wc: "Bantamweight · Prelims",       status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
    ]
  },
  {
    name: "UFC FN: Adesanya vs. Pyfer", date: "Sat, Mar 28 · Climate Pledge Arena, Seattle · Main 9PM / Prelims 6PM EDT", status: "upcoming",
    fights: [
      // ── MAIN CARD ──
      { id: "em1",  f1: "Israel Adesanya",    f2: "Joe Pyfer",          wc: "Middleweight · Main Event",    status: "UPCOMING", f1odds: "-320", f2odds: "+250" },
      { id: "em2",  f1: "Alexa Grasso",       f2: "Maycee Barber",      wc: "Flyweight · Co-Main",          status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "em3",  f1: "Chase Hooper",       f2: "Lance Gibson Jr.",   wc: "Lightweight",                  status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "em4",  f1: "Michael Chiesa",     f2: "Carlston Harris",    wc: "Welterweight",                 status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "em5",  f1: "Terrance McKinney",  f2: "Kyle Nelson",        wc: "Lightweight",                  status: "UPCOMING", f1odds: "-155", f2odds: "+128" },
      // ── PRELIMS ──
      { id: "em6",  f1: "Marcin Tybura",      f2: "Tyrell Fortune",     wc: "Heavyweight · Prelims",        status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "em7",  f1: "Casey O'Neill",      f2: "G. Fernandes",       wc: "Flyweight · Prelims",          status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "em8",  f1: "Mansur Abdul-Malik", f2: "Yousri Belgaroui",   wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "em9",  f1: "Kangjie Zhu",        f2: "Marcio Barbosa",     wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "em10", f1: "Julian Erosa",       f2: "Lerryan Douglas",    wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-160", f2odds: "+132" },
      { id: "em11", f1: "Navajo Stirling",    f2: "Bruno Lopes",        wc: "Light Heavyweight · Prelims",  status: "UPCOMING", f1odds: "+110", f2odds: "-135" },
      { id: "em12", f1: "Bruna Brasil",       f2: "Alexia Thainara",    wc: "Strawweight · Prelims",        status: "UPCOMING", f1odds: "-150", f2odds: "+125" },
    ]
  },
  {
    name: "UFC FN: Moicano vs. Duncan", date: "Sat, Apr 4 · Meta APEX, Las Vegas · Main 9PM / Prelims 6PM EDT", status: "upcoming",
    fights: [
      // ── MAIN CARD ──
      { id: "en1",  f1: "Renato Moicano",     f2: "Chris Duncan",       wc: "Lightweight · Main Event",     status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "en2",  f1: "Virna Jandiroba",    f2: "Tabatha Ricci",      wc: "Strawweight · Co-Main",        status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "en3",  f1: "Hailey Cowan",       f2: "Alice Pereira",      wc: "Bantamweight",                 status: "UPCOMING", f1odds: "-115", f2odds: "-105" },
      { id: "en4",  f1: "Alessandro Costa",   f2: "Stewart Nicoll",     wc: "Flyweight",                    status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "en5",  f1: "Dione Barbosa",      f2: "Melissa Gatto",      wc: "Flyweight",                    status: "UPCOMING", f1odds: "+110", f2odds: "-135" },
      // ── PRELIMS ──
      { id: "en6",  f1: "Azamat Bekoev",      f2: "Tresean Gore",       wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "en7",  f1: "Tommy McMillen",     f2: "Manolo Zecchini",    wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "en8",  f1: "Tofiq Musayev",      f2: "Samuel Sanches",     wc: "Lightweight · Prelims",        status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "en9",  f1: "Thomas Petersen",    f2: "Guilherme Pat",      wc: "Heavyweight · Prelims",        status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "en10", f1: "Jose Delano",        f2: "Robert Ruchala",     wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-115", f2odds: "-105" },
      { id: "en11", f1: "Rafael Estevam",     f2: "Ethyn Ewing",        wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "en12", f1: "JunYong Park",       f2: "Edmen Shahbazyan",   wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "+130", f2odds: "-158" },
      { id: "en13", f1: "Charles Radtke",     f2: "Jose H. Souza",      wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
    ]
  },
  {
    name: "UFC 327: Procházka vs. Ulberg", date: "Sat, Apr 11 · Kaseya Center, Miami 🏆 · Main 9PM / Prelims 7PM EDT", status: "upcoming",
    fights: [
      // ── MAIN CARD ──
      { id: "ep1",  f1: "Jiří Procházka",     f2: "Carlos Ulberg",      wc: "Light Heavyweight Championship · VACANT TITLE", status: "UPCOMING", f1odds: "-135", f2odds: "+112" },
      { id: "ep2",  f1: "Joshua Van",         f2: "Tatsuro Taira",      wc: "Flyweight Championship · TITLE FIGHT",          status: "UPCOMING", f1odds: "-175", f2odds: "+145" },
      { id: "ep3",  f1: "Dominick Reyes",     f2: "Johnny Walker",      wc: "Light Heavyweight",            status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "ep4",  f1: "Curtis Blaydes",     f2: "Josh Hokit",         wc: "Heavyweight",                  status: "UPCOMING", f1odds: "-350", f2odds: "+275" },
      { id: "ep5",  f1: "Beneil Dariush",     f2: "Manuel Torres",      wc: "Lightweight",                  status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      // ── PRELIMS ──
      { id: "ep6",  f1: "Tatiana Suarez",     f2: "Loopy Godinez",      wc: "Strawweight · Prelims",        status: "UPCOMING", f1odds: "-300", f2odds: "+240" },
      { id: "ep7",  f1: "Azamat Murzakanov",  f2: "Paulo Costa",        wc: "Light Heavyweight · Prelims",  status: "UPCOMING", f1odds: "-155", f2odds: "+128" },
      { id: "ep8",  f1: "Cub Swanson",        f2: "Nate Landwehr",      wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "ep9",  f1: "Kevin Holland",      f2: "Randy Brown",        wc: "Welterweight · Prelims",       status: "UPCOMING", f1odds: "-115", f2odds: "-105" },
      { id: "ep10", f1: "Patricio Pitbull",   f2: "Aaron Pico",         wc: "Featherweight · Prelims",      status: "UPCOMING", f1odds: "+115", f2odds: "-140" },
      { id: "ep11", f1: "Mateusz Gamrot",     f2: "Esteban Ribovics",   wc: "Lightweight · Prelims",        status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "ep12", f1: "Kelvin Gastelum",    f2: "Vicente Luque",      wc: "Middleweight · Prelims",       status: "UPCOMING", f1odds: "+140", f2odds: "-170" },
      { id: "ep13", f1: "Christopher Alvidrez", f2: "Francisco Prado",  wc: "Welterweight · Prelims",       status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
    ]
  },
  {
    name: "UFC 326: Holloway vs. Oliveira 2", date: "March 8, 2026", status: "completed",
    fights: COMPLETED_RESULTS.map((r, i) => ({ id: `326-${i}`, ...r, status: "COMPLETED" }))
  },
];

export default function App() {
  const [picks, setPicks] = useState({});
  const [ev, setEv] = useState(0);
  const { odds: liveOdds, lastUpdate, loading: oddsLoading, refresh: refreshOdds } = useLiveOdds();
  const event = EVENTS[ev];
  const upcoming = event.fights.filter(f => f.status !== "COMPLETED");
  const pickCount = upcoming.filter(f => picks[f.id]).length;

  // Merge live odds into fight data if available
  const fightsWithLiveOdds = event.fights.map(fight => {
    const key = `${fight.f1}|${fight.f2}`;
    const live = liveOdds[key];
    if (!live) return fight;
    return { ...fight, f1odds: live.f1, f2odds: live.f2, liveOdds: true };
  });

  const onPick = useCallback((id, side) => {
    setPicks(p => { if (p[id] === side) { const n = { ...p }; delete n[id]; return n; } return { ...p, [id]: side }; });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e14", color: "#f0f0f8", ...sans }}>
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom: "1px solid #1e1e2a", padding: "18px 20px 0", maxWidth: 900, margin: "0 auto", position: "sticky", top: 0, background: "#0e0e14", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>

          {/* FightIQ Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg viewBox="0 0 110 110" width="38" height="38"
              style={{ animation: "octGlow 2.8s ease-in-out infinite", overflow: "visible" }}>
              <defs>
                <clipPath id="octClip">
                  <polygon points="35,6 75,6 104,35 104,75 75,104 35,104 6,75 6,35"/>
                </clipPath>
              </defs>
              {/* Outer octagon border */}
              <polygon points="35,6 75,6 104,35 104,75 75,104 35,104 6,75 6,35"
                fill="#110608" stroke="#e53935" strokeWidth="3.5"/>
              {/* Waveform — clipped to stay inside, sized to fit 18→92 x range */}
              <polyline
                points="18,55 28,55 35,55 40,28 44,82 48,55 55,55 60,33 65,77 69,55 76,55 82,55 92,55"
                fill="none" stroke="#e53935" strokeWidth="4.5"
                strokeLinecap="round" strokeLinejoin="round"
                clipPath="url(#octClip)"
                style={{
                  strokeDasharray: 160,
                  strokeDashoffset: 160,
                  animation: "waveDraw 1.4s cubic-bezier(.4,0,.2,1) 0.3s forwards, waveGlow 2.8s ease-in-out 1.7s infinite"
                }}/>
            </svg>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 28, color: "#f0f0f8", letterSpacing: "0.04em", lineHeight: 1 }}>FIGHT</span>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "0.04em", lineHeight: 1, background: "linear-gradient(135deg,#ff6535,#e53935)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "iqGlow 2.8s ease-in-out infinite" }}>IQ</span>
            </div>
          </div>

          {/* Right — odds status + live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {ODDS_KEY && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {oddsLoading
                  ? <span style={{ ...mono, fontSize: 8, color: "#f5a623", letterSpacing: 1 }}>● UPDATING...</span>
                  : lastUpdate
                    ? <span style={{ ...mono, fontSize: 8, color: "#4caf7d", letterSpacing: 1 }}>● LIVE</span>
                    : null
                }
                <button onClick={refreshOdds} style={{ background: "none", border: "none", cursor: "pointer", color: "#e53935", fontSize: 13, padding: "0 2px" }}>↻</button>
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(229,57,53,0.1)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 20, padding: "4px 10px" }}>
              <span className="live-dot" />
              <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: "#e53935", letterSpacing: "0.1em" }}>{event.name.split(":")[0].replace("UFC ","")}</span>
            </div>
          </div>
        </div>

        {/* Event meta */}
        <div style={{ ...mono, fontSize: 7, color: "#2a2a45", letterSpacing: 2, marginBottom: 10 }}>
          {event.date} · {event.fights.length} BOUTS{pickCount > 0 ? ` · ${pickCount}/${upcoming.length} PICKS` : ""}
        </div>

        {/* Event tabs */}
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {EVENTS.map((e, i) => (
            <button key={i} onClick={() => setEv(i)} style={{ background: "none", border: "none", borderBottom: ev === i ? "2px solid #e53935" : "2px solid transparent", padding: "10px 14px", fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 700, color: ev === i ? "#f0f0f8" : "#2a2a45", letterSpacing: 1, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}>
              {e.status === "completed" ? "✓ " : ""}{e.name.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 16px 100px" }}>
        <div className="fu">
          {fightsWithLiveOdds.map(fight => <FightRow key={fight.id} fight={fight} picks={picks} onPick={onPick} />)}

          {pickCount > 0 && pickCount === upcoming.length && (
            <div style={{ border: "1px solid #1e1e2a", borderRadius: 8, padding: 18, background: "#12121a", marginTop: 8 }} className="fu">
              <div style={{ ...mono, fontSize: 7, color: "#3a3a55", letterSpacing: 3, marginBottom: 13 }}>YOUR CARD</div>
              {upcoming.map(fight => {
                const side = picks[fight.id], name = side === "f1" ? fight.f1 : fight.f2, odds = side === "f1" ? fight.f1odds : fight.f2odds;
                return <div key={fight.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e2a", paddingBottom: 7, marginBottom: 7 }}>
                  <div><span style={{ ...mono, fontSize: 7, color: "#2a2a40", marginRight: 8 }}>{fight.wc.split("·")[0].trim()}</span><span style={{ ...cond, fontWeight: 900, fontSize: 16, color: "#f0f0f8" }}>{name}</span></div>
                  {odds && <span style={{ ...mono, fontSize: 13, color: isFav(odds) ? "#e53935" : "#4caf7d" }}>{odds}</span>}
                </div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
