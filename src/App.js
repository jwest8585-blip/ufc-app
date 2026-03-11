/* eslint-disable no-unused-vars, no-dupe-keys */
import { useState, useCallback, useEffect } from "react";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const toImplied = o => { const n = parseInt(o); if (isNaN(n)) return 50; return n > 0 ? Math.round(100 / (n + 100) * 100) : Math.round(-n / (-n + 100) * 100); };
const isFav = o => parseInt(o) < 0;
const mono = { fontFamily: "'Inter', sans-serif", fontWeight: 600 };
const cond = { fontFamily: "'Inter Tight', sans-serif" };
const sans = { fontFamily: "'Inter', sans-serif" };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#f0f2f7}
::-webkit-scrollbar-thumb{background:#c8cad5;border-radius:4px}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
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
};

// ─── HARDCODED FIGHT DATA ─────────────────────────────────────────────────────
const FIGHT_DATA = {
  e1: {
    f1: {
      name: "Josh Emmett", nickname: "The Grim Reaper", age: 38, nationality: "American", flag: "🇺🇸",
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-03/EMMETT_JOSH_L_BELT.png",
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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-09/VALLEJOS_KEVIN_L.png",
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
      name: "Amanda Lemos", nickname: "Tequileira", age: 35, nationality: "Brazilian", flag: "🇧🇷", photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2023-11/LEMOS_AMANDA_L.png",
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
      name: "Gillian Robertson", nickname: "The Savage", age: 28, nationality: "Canadian", flag: "🇨🇦", photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-05/ROBERTSON_GILLIAN_L.png",
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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-06/CUTELABA_ION_L.png",
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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-09/SY_OUMAR_L.png",
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
      name: "Vitor Petrino", nickname: "Franskentein", age: 27, nationality: "Brazilian", flag: "🇧🇷", photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-10/PETRINO_VITOR_L.png",
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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-09/ASPLUND_STEVEN_L.png",
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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-07/FILI_ANDRE_L.png",
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
      name: "Jose Delgado", nickname: "", age: 26, nationality: "Venezuelan", flag: "🇻🇪", photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-06/DELGADO_JOSE_L.png",

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
      photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-05/RODRIGUEZ_PIERA_L.png",
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
      name: "Sam Hughes", nickname: "", age: 31, nationality: "American", flag: "🇺🇸", photo: "https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2024-06/HUGHES_SAM_L.png",

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
        {[{ f, data: sa.f1Style }, { f: f2, data: sa.f2Style }].map(({ f: fi, data: st }, idx) => (
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
  const bg = side === "f1"
    ? "linear-gradient(160deg,#0d1540 0%,#1a2a70 100%)"
    : "linear-gradient(160deg,#1a0008 0%,#3d0015 100%)";
  const initials = fdata?.name?.split(" ").map(w => w[0]).join("") || "?";
  // Try UFC CDN first (img tags can load cross-origin), then Wikipedia, then initials
  const ufcSrc = fdata?.photo && !ufcErr ? fdata.photo : null;
  const imgSrc = ufcSrc || (wikiUrl && !wikiErr ? wikiUrl : null);

  return (
    <div style={{ position: "relative", height, background: bg, overflow: "hidden" }}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={fdata?.name}
          onError={() => { if (ufcSrc) setUfcErr(true); else setWikiErr(true); }}
          style={{
            position: "absolute", bottom: 0,
            left: "50%", transform: "translateX(-50%)",
            height: "100%", width: "auto",
            objectFit: "cover", objectPosition: "top center",
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "Inter Tight,Inter,sans-serif", fontWeight: 900, fontSize: 22, color: "rgba(255,255,255,0.5)" }}>{initials}</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 55, background: side === "f1" ? "linear-gradient(transparent,#0d1540)" : "linear-gradient(transparent,#1a0008)", pointerEvents: "none" }} />
    </div>
  );
}

function FighterCard({ fdata, odds, side, picked, onPick, done, isWinner }) {
  const isFav_ = odds && isFav(odds);
  const isPicked = picked === side;
  const otherPicked = picked && picked !== side;

  return (
    <button onClick={onPick} disabled={done}
      style={{ background: isPicked ? (side === "f1" ? "#eef2ff" : "#fff0f0") : otherPicked ? "#f5f6fa" : "#ffffff",
        border: `2px solid ${isPicked ? (side === "f1" ? "#0057e8" : "#e8001c") : "#e2e5ef"}`,
        borderRadius: 12, padding: 0, cursor: done ? "default" : "pointer",
        textAlign: side === "f1" ? "left" : "right", width: "100%", overflow: "hidden",
        transition: "all .15s", opacity: otherPicked ? 0.55 : 1 }}>

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

        {/* Picked badge */}
        {isPicked && (
          <div style={{ position: "absolute", bottom: 8, [side === "f1" ? "left" : "right"]: 8, background: side === "f1" ? "#0057e8" : "#e8001c", borderRadius: 4, padding: "2px 7px" }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>✓ PICKED</span>
          </div>
        )}
        {isWinner && (
          <div style={{ position: "absolute", bottom: 8, [side === "f1" ? "left" : "right"]: 8, background: "#007a4d", borderRadius: 4, padding: "2px 7px" }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>WINNER</span>
          </div>
        )}
      </div>

      {/* Name + nationality row */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{ ...cond, fontWeight: 900, fontSize: 16, letterSpacing: "-0.2px", color: "#0d0f14", lineHeight: 1.15, marginBottom: 3 }}>{fdata?.name || "—"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: side === "f2" ? "flex-end" : "flex-start" }}>
          {fdata?.flag && <span style={{ fontSize: 11 }}>{fdata.flag}</span>}
          <span style={{ ...sans, fontSize: 10, fontWeight: 600, color: "#9da3b8" }}>{fdata?.nationality}</span>
          {fdata?.record && <span style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#6b7280" }}>· {fdata.record}</span>}
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
    <div style={{ borderBottom: "1px solid #e2e5ef", paddingBottom: 28, marginBottom: 28 }}>
      {/* Weight class + result badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ ...mono, fontSize: 8, color: "#7a7f96", letterSpacing: 1 }}>{fight.wc}</span>
        {done && fight.winner && <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#007a4d", background: "#e6f7f0", padding: "3px 10px", borderRadius: 20 }}>✓ {fight.winner} · {fight.method}</span>}
      </div>

      {/* Fighter photo cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", marginBottom: 10, gap: 0 }}>
        <FighterCard fdata={f1data} odds={fight.f1odds} side="f1" picked={p} onPick={() => !done && onPick(fight.id, "f1")} done={done} isWinner={done && fight.winner === fight.f1} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f8", zIndex: 1 }}>
          <span style={{ ...mono, fontSize: 8, fontWeight: 800, color: "#9da3b8" }}>vs</span>
        </div>
        <FighterCard fdata={f2data} odds={fight.f2odds} side="f2" picked={p} onPick={() => !done && onPick(fight.id, "f2")} done={done} isWinner={done && fight.winner === fight.f2} />
      </div>

      {!done && (
        <div>
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", ...sans, fontSize: 13, fontWeight: 700, color: open ? "#0057e8" : "#6b7280", letterSpacing: 0, cursor: "pointer", padding: "6px 0", transition: "color .15s" }}>
            {open ? "▲ COLLAPSE" : "▼ FIGHTER INTELLIGENCE"}
          </button>
          {open && <IntelPanel fightId={fight.id} />}
        </div>
      )}

      {p && !done && (
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: p === "f1" ? "#7a7f96" : "#ff3d57" }} />
          <span style={{ ...mono, fontSize: 8, color: "#7a7f96", letterSpacing: 1 }}>PICK:</span>
          <span style={{ ...cond, fontWeight: 700, fontSize: 14, color: "#444858" }}>{p === "f1" ? fight.f1 : fight.f2}</span>
          <span style={{ ...sans, fontSize: 15, fontWeight: 800, color: isFav(p === "f1" ? fight.f1odds : fight.f2odds) ? "#e8001c" : "#007a4d" }}>{p === "f1" ? fight.f1odds : fight.f2odds}</span>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    name: "UFC FN: Emmett vs. Vallejos", date: "March 15, 2026", status: "upcoming",
    fights: [
      { id: "e1", f1: "Josh Emmett", f2: "Kevin Vallejos", wc: "Featherweight · Main Event", status: "UPCOMING", f1odds: "-185", f2odds: "+155" },
      { id: "e2", f1: "Amanda Lemos", f2: "Gillian Robertson", wc: "Strawweight · Co-Main", status: "UPCOMING", f1odds: "-145", f2odds: "+120" },
      { id: "e3", f1: "Ion Cutelaba", f2: "Oumar Sy", wc: "Light Heavyweight", status: "UPCOMING", f1odds: "+110", f2odds: "-135" },
      { id: "e4", f1: "Vitor Petrino", f2: "Steven Asplund", wc: "Heavyweight", status: "UPCOMING", f1odds: "-200", f2odds: "+165" },
      { id: "e5", f1: "Andre Fili", f2: "Jose Delgado", wc: "Featherweight", status: "UPCOMING", f1odds: "-130", f2odds: "+108" },
      { id: "e6", f1: "Piera Rodriguez", f2: "Sam Hughes", wc: "Strawweight", status: "UPCOMING", f1odds: "-160", f2odds: "+132" },
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
    <div style={{ minHeight: "100vh", background: "#f7f8fc", color: "#0d0f14", ...sans }}>
      <style>{CSS}</style>

      <div style={{ borderBottom: "1px solid #e4e6f0", padding: "18px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...mono, fontSize: 10, color: "#e8001c", letterSpacing: 3, marginBottom: 6, fontWeight: 800, textTransform: "uppercase" }}>UFC · SPORTSBOOK INTELLIGENCE</div>
          <div style={{ ...cond, fontWeight: 900, fontSize: "clamp(22px,4vw,40px)", letterSpacing: 1, lineHeight: 1, color: "#111318" }}>{event.name.toUpperCase()}</div>
          <div style={{ ...mono, fontSize: 7, color: "#8a8fa8", marginTop: 4, letterSpacing: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>{event.date} · {event.fights.length} BOUTS{pickCount > 0 ? ` · ${pickCount}/${upcoming.length} PICKS` : ""}</span>
            {ODDS_KEY && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {oddsLoading
                  ? <span style={{ color: "#f5a623" }}>● UPDATING ODDS...</span>
                  : lastUpdate
                    ? <><span style={{ color: "#007a4d" }}>● LIVE ODDS</span><span style={{ color: "#9da3b8" }}>· {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></>
                    : null
                }
                <button onClick={refreshOdds} style={{ background: "none", border: "none", cursor: "pointer", color: "#0057e8", fontSize: 9, fontFamily: "Inter,sans-serif", fontWeight: 700, padding: "0 2px" }}>↻</button>
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {EVENTS.map((e, i) => (
            <button key={i} onClick={() => setEv(i)} style={{ background: "none", border: "none", borderBottom: ev === i ? "3px solid #e8001c" : "3px solid transparent", padding: "10px 16px", ...sans, fontSize: 13, fontWeight: 700, color: ev === i ? "#0d0f14" : "#8a90a8", letterSpacing: 1, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
              {e.status === "completed" ? "✓ " : ""}{e.name.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px 16px 100px" }}>
        <div className="fu">
          {fightsWithLiveOdds.map(fight => <FightRow key={fight.id} fight={fight} picks={picks} onPick={onPick} />)}

          {pickCount > 0 && pickCount === upcoming.length && (
            <div style={{ border: "1px solid #dde0ea", borderRadius: 5, padding: 18, background: "#f8f9fc", marginTop: 8 }} className="fu">
              <div style={{ ...mono, fontSize: 7, color: "#8a8fa8", letterSpacing: 3, marginBottom: 13 }}>YOUR CARD</div>
              {upcoming.map(fight => {
                const side = picks[fight.id], name = side === "f1" ? fight.f1 : fight.f2, odds = side === "f1" ? fight.f1odds : fight.f2odds;
                return <div key={fight.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e4e6f0", paddingBottom: 7, marginBottom: 7 }}>
                  <div><span style={{ ...mono, fontSize: 7, color: "#aab0c8", marginRight: 8 }}>{fight.wc.split("·")[0].trim()}</span><span style={{ ...cond, fontWeight: 900, fontSize: 16 }}>{name}</span></div>
                  {odds && <span style={{ ...mono, fontSize: 13, color: isFav(odds) ? "#ff3d57" : "#00e5a0" }}>{odds}</span>}
                </div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
