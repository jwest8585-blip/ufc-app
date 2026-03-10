import { useState, useCallback } from "react";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const toImplied = o => { const n = parseInt(o); if (isNaN(n)) return 50; return n > 0 ? Math.round(100 / (n + 100) * 100) : Math.round(-n / (-n + 100) * 100); };
const isFav = o => parseInt(o) < 0;
const mono = { fontFamily: "'Share Tech Mono', monospace" };
const cond = { fontFamily: "'Barlow Condensed', sans-serif" };
const sans = { fontFamily: "'Barlow', sans-serif" };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:ital,wght@0,400;0,500;1,400&family=Share+Tech+Mono&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:2px;height:2px}
::-webkit-scrollbar-track{background:#0b0c0f}
::-webkit-scrollbar-thumb{background:#1e2028;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
.fu{animation:fadeUp .3s ease both}
.si{animation:slideIn .2s ease both}
`;

// ─── HARDCODED FIGHT DATA ─────────────────────────────────────────────────────
const FIGHT_DATA = {
  e1: {
    f1: {
      name: "Josh Emmett", nickname: "The Grim Reaper", age: 38, nationality: "American",
      hometown: "Sacramento, CA", height: "5'6\"", weight: 146, reach: 68, legReach: 37,
      stance: "Orthodox", team: "Team Alpha Male", coach: "Urijah Faber",
      record: "18-4", wins: 18, losses: 4, draws: 0,
      byKO: 10, bySub: 1, byDec: 7, finRate: 61,
      form: ["W","W","L","W","W"],
      proDebut: "2009-03-21", ufcDebut: "2016-09-17", titles: [],
      history: [
        { date:"2024-03-09", opp:"Leandro Silva", res:"W", method:"KO/TKO", rd:1, time:"2:17", org:"UFC" },
        { date:"2023-07-29", opp:"Edson Barboza", res:"W", method:"KO/TKO", rd:1, time:"0:33", org:"UFC" },
        { date:"2022-10-22", opp:"Calvin Kattar", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2022-04-09", opp:"Josh Emmett", res:"W", method:"KO/TKO", rd:1, time:"0:23", org:"UFC" },
        { date:"2021-10-23", opp:"Shane Burgos", res:"W", method:"KO/TKO", rd:5, time:"3:24", org:"UFC" },
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
      name: "Kevin Vallejos", nickname: "El Toro", age: 27, nationality: "Argentine",
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
      verdict:   { pick:"Josh Emmett", signals:"7 of 10 signals favor Josh Emmett", conv:"HIGH", angle:"Emmett's KO power and veteran composure outweigh the reach and age concerns. He's too accurate and too dangerous to bet against here.", prop:"Emmett by KO/TKO — yes. Method: KO/TKO is the play.", flag:"Emmett's post-KO syndrome is real — his chin has been tested. One Vallejos counter could change everything.", sharp:"Sharps are on Emmett at -185. No line movement suggests market agrees." },
    },
  },

  e2: {
    f1: {
      name: "Amanda Lemos", nickname: "Tequileira", age: 35, nationality: "Brazilian",
      hometown: "Pará, Brazil", height: "5'5\"", weight: 115, reach: 65, legReach: 37,
      stance: "Orthodox", team: "SAS Team", coach: "André Amado",
      record: "13-3-1", wins: 13, losses: 3, draws: 1,
      byKO: 3, bySub: 7, byDec: 3, finRate: 69,
      form: ["L","W","W","W","W"],
      proDebut: "2015-06-13", ufcDebut: "2019-10-12", titles: [],
      history: [
        { date:"2024-11-02", opp:"Marina Rodriguez", res:"L", method:"Decision (U)", rd:5, time:"5:00", org:"UFC" },
        { date:"2024-04-13", opp:"Mackenzie Dern", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-07-15", opp:"Yan Xiaonan", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
        { date:"2023-02-04", opp:"Michelle Waterson-Gomez", res:"W", method:"Submission", rd:1, time:"4:04", org:"UFC" },
        { date:"2022-07-30", opp:"Jessica Andrade", res:"W", method:"Decision (U)", rd:3, time:"5:00", org:"UFC" },
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
      name: "Gillian Robertson", nickname: "The Savage", age: 28, nationality: "Canadian",
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
      verdict:   { pick:"Amanda Lemos", signals:"7 of 10 signals favor Amanda Lemos", conv:"MEDIUM", angle:"Lemos wins if she keeps it standing, which her TD defense suggests she can. Robertson needs 3+ takedown attempts converted to change the fight.", prop:"Fight goes to decision — Over 2.5 rounds is the smart prop at this matchup.", flag:"Robertson's submission volume (4.4 avg) is elite — one mistake from Lemos on the mat could end the night.", sharp:"Sharps are with Lemos at -145. No steam indicates market is settled." },
    },
  },

  e3: {
    f1: {
      name: "Ion Cutelaba", nickname: "The Hulk", age: 31, nationality: "Moldovan",
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
        { date:"2021-09-18", opp:"Magomed Ankalaev", res:"L", method:"KO/TKO", rd:1, time:"2:07", org:"UFC" },
        { date:"2021-02-13", opp:"Magomed Ankalaev", res:"L", method:"KO/TKO", rd:2, time:"1:35", org:"UFC" },
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
      name: "Oumar Sy", nickname: "", age: 29, nationality: "French",
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
      verdict:   { pick:"Oumar Sy", signals:"8 of 10 signals favor Oumar Sy", conv:"HIGH", angle:"Sy is better in every category except Cutelaba's raw punch power. If Sy avoids the one-punch KO in the first minute, he wins comfortably.", prop:"Sy by KO/TKO — Method: KO/TKO, Fighter: Oumar Sy. Under 1.5 rounds is worth considering.", flag:"Cutelaba's KO power is real — he can end any fight with one punch. Sy must not get reckless early.", sharp:"Sharps are with Sy at -135. Clean value with a high conviction signal consensus." },
    },
  },

  e4: {
    f1: {
      name: "Vitor Petrino", nickname: "Franskentein", age: 27, nationality: "Brazilian",
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
      name: "Steven Asplund", nickname: "", age: 32, nationality: "American",
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
      verdict:   { pick:"Vitor Petrino", signals:"8 of 10 signals favor Vitor Petrino", conv:"HIGH", angle:"Petrino is longer, more accurate, hits harder, and absorbs less. Barring a lucky Asplund KO early, this fight belongs to the Brazilian.", prop:"Petrino by KO/TKO round 1-2. Under 1.5 rounds given both men's finishing tendency.", flag:"Asplund has one-punch KO power and is on a contract year — desperate fighters do desperate things. Don't sleep on the upset.", sharp:"Market settled at -200 with no movement. Public and sharps aligned on Petrino." },
    },
  },

  e5: {
    f1: {
      name: "Andre Fili", nickname: "Touchy", age: 33, nationality: "American",
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
      name: "Jose Delgado", nickname: "", age: 26, nationality: "Venezuelan",
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
      verdict:   { pick:"Andre Fili", signals:"6 of 10 signals favor Andre Fili", conv:"LOW", angle:"Fili's experience edge is real but the line near even money tells you this is genuinely competitive. Slight lean to the veteran.", prop:"Over 2.5 rounds is the cleanest prop — Fili's fight pace suggests a full 3-round decision.", flag:"Delgado's submission game is legitimately dangerous. If Fili gets caught against the fence, one mistake ends the night.", sharp:"Markets are split. No clear sharp signal — bet with your read here." },
    },
  },

  e6: {
    f1: {
      name: "Piera Rodriguez", nickname: "La Bala", age: 28, nationality: "Venezuelan",
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
      name: "Sam Hughes", nickname: "", age: 31, nationality: "American",
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
      verdict:   { pick:"Piera Rodriguez", signals:"9 of 10 signals favor Piera Rodriguez", conv:"HIGH", angle:"This is a rematch Rodriguez already won clearly. She has a specific game plan, better camp, and a significant psychological edge coming in on a 5-fight win streak.", prop:"Rodriguez by decision — cleaner prop is Over 2.5 rounds at a likely favorable line.", flag:"Hughes' southpaw stance adds stylistic complexity. If she can find her timing early, she has KO power that can't be ignored.", sharp:"Sharps on Rodriguez at -160. No steam, no movement — market agrees this is a win for La Bala." },
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
function Dots({ form = [] }) {
  return <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{form.map((r, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: r === "W" ? "#00e5a0" : "#ff3d57", opacity: 0.3 + (i / form.length) * 0.7 }} />)}</div>;
}
function SLabel({ children }) { return <div style={{ ...mono, fontSize: 7, color: "#222630", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>; }
function SBox({ label, value, color = "#7a7f96" }) {
  return <div style={{ background: "#12141a", borderRadius: 3, padding: "8px 10px" }}><div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 3 }}>{label}</div><div style={{ ...mono, fontSize: 12, color }}>{value || "—"}</div></div>;
}
function HBar({ v1, v2, max, label, fmt = x => x }) {
  const e1 = v1 > v2, e2 = v2 > v1;
  return <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ ...mono, fontSize: 11, color: e1 ? "#00e5a0" : "#3a3d4a" }}>{fmt(v1)}</span>
      <span style={{ ...mono, fontSize: 7, color: "#222630", letterSpacing: 1 }}>{label}</span>
      <span style={{ ...mono, fontSize: 11, color: e2 ? "#00e5a0" : "#3a3d4a" }}>{fmt(v2)}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      <div style={{ height: 2, background: "#1a1c24" }}><div style={{ height: 2, width: `${Math.min((v1 / max) * 100, 100)}%`, background: e1 ? "#00e5a0" : "#222630", marginLeft: "auto" }} /></div>
      <div style={{ height: 2, background: "#1a1c24" }}><div style={{ height: 2, width: `${Math.min((v2 / max) * 100, 100)}%`, background: e2 ? "#00e5a0" : "#222630" }} /></div>
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
function INote({ text }) { return <p style={{ ...sans, fontSize: 12, lineHeight: 1.8, color: "#555a6b", fontStyle: "italic", marginTop: 10 }}>{text}</p>; }

// ─── FIGHTER PROFILE CARD ─────────────────────────────────────────────────────
function Profile({ f, accent }) {
  const [hist, setHist] = useState(false);
  const orgC = o => ({ UFC: "#ff3d57", Bellator: "#f5a623", ONE: "#00e5a0", PFL: "#818cf8", RIZIN: "#fb923c", DWCS: "#f5a623", Regional: "#3a3d4a" }[o] || "#3a3d4a");

  return (
    <div style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}12 0%, transparent 55%)`, borderBottom: `1px solid ${accent}30`, padding: "14px 15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
            <div style={{ ...mono, fontSize: 7, color: accent, letterSpacing: 2, marginBottom: 3 }}>{f.nationality} · {f.team}</div>
            <div style={{ ...cond, fontWeight: 800, fontSize: 18, letterSpacing: 0.5, lineHeight: 1.1, color: "#eceef5" }}>{f.name}</div>
            {f.nickname && <div style={{ ...sans, fontStyle: "italic", fontSize: 10, color: "#3a3d4a", marginTop: 2 }}>"{f.nickname}"</div>}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ ...cond, fontWeight: 900, fontSize: 22, color: accent, lineHeight: 1 }}>{f.record}</div>
            <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 2, marginTop: 2 }}>W–L–D</div>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 14 }}>
          {[["HOMETOWN", f.hometown], ["COACH", f.coach], ["PRO DEBUT", f.proDebut], ["UFC DEBUT", f.ufcDebut]].map(([l, v]) => (
            <div key={l} style={{ borderBottom: "1px solid #12141a", paddingBottom: 6 }}>
              <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
              <div style={{ ...mono, fontSize: 9, color: "#555a6b" }}>{v || "—"}</div>
            </div>
          ))}
        </div>

        {f.titles?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <SLabel>Titles</SLabel>
            {f.titles.map((t, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, background: "rgba(245,166,35,.06)", border: "1px solid rgba(245,166,35,.15)", borderRadius: 3, padding: "5px 8px" }}><span>🏆</span><span style={{ ...mono, fontSize: 8, color: "#f5a623" }}>{t}</span></div>)}
          </div>
        )}

        <SLabel>Record</SLabel>
        <div style={{ background: "#12141a", borderRadius: 4, padding: "11px 13px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 11 }}>
            {[["W", f.wins, "#00e5a0"], ["L", f.losses, "#ff3d57"], ["D", f.draws || 0, "#3a3d4a"]].map(([l, v, c]) => (
              <div key={l}><div style={{ ...cond, fontWeight: 900, fontSize: 24, color: c, lineHeight: 1 }}>{v}</div><div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 2, marginTop: 1 }}>{l}</div></div>
            ))}
          </div>
          {[["KO/TKO", f.byKO, "#ff3d57"], ["SUBMISSION", f.bySub, "#00e5a0"], ["DECISION", f.byDec, "#f5a623"]].map(([l, v, c]) => v > 0 && (
            <div key={l} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
              <span style={{ ...mono, fontSize: 7, color: "#3a3d4a", width: 72, flexShrink: 0 }}>{l}</span>
              <div style={{ flex: 1, height: 2, background: "#1a1c24", margin: "0 9px" }}><div style={{ height: 2, width: `${(v / f.wins) * 100}%`, background: c }} /></div>
              <span style={{ ...mono, fontSize: 10, color: c, minWidth: 14, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <SLabel>Performance</SLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 14 }}>
          {[["SIG STR/MIN", f.slpm?.toFixed(1)], ["ABSORBED/MIN", f.sapm?.toFixed(1)],
            ["TD ACCURACY", `${f.tdAcc}%`], ["TD DEFENSE", `${f.tdDef}%`],
            ["SUB AVG", f.subAvg?.toFixed(1)], ["FINISH RATE", `${f.finRate}%`]].map(([l, v]) =>
            <SBox key={l} label={l} value={v} />)}
        </div>

        <button onClick={() => setHist(h => !h)} style={{ width: "100%", background: "none", border: `1px solid ${hist ? accent + "40" : "#1a1c24"}`, borderRadius: 3, padding: "7px", ...mono, fontSize: 8, color: hist ? accent : "#2a2d38", letterSpacing: 2, cursor: "pointer", transition: "all .2s", marginBottom: hist ? 9 : 0 }}>
          {hist ? "▲ HIDE HISTORY" : `▼ FIGHT HISTORY (${f.history.length} BOUTS)`}
        </button>

        {hist && (
          <div className="si">
            <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 18px 90px 20px 50px", gap: 3, padding: "4px 4px 6px" }}>
              {["DATE", "OPPONENT", "", "METHOD", "RD", "ORG"].map(h => <span key={h} style={{ ...mono, fontSize: 6, color: "#1e2028", letterSpacing: 1 }}>{h}</span>)}
            </div>
            {f.history.map((b, i) => {
              const isW = b.res === "W", oc = orgC(b.org);
              return <div key={i} style={{ display: "grid", gridTemplateColumns: "56px 1fr 18px 90px 20px 50px", gap: 3, padding: "5px 4px", background: i % 2 === 0 ? "#12141a" : "transparent", borderLeft: `2px solid ${isW ? "#00e5a028" : "#ff3d5728"}`, borderRadius: 2, marginBottom: 2, alignItems: "center" }}>
                <span style={{ ...mono, fontSize: 7, color: "#2a2d38" }}>{b.date?.slice(0, 7)}</span>
                <span style={{ ...mono, fontSize: 8, color: "#555a6b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.opp}</span>
                <span style={{ ...cond, fontWeight: 800, fontSize: 11, color: isW ? "#00e5a0" : "#ff3d57" }}>{b.res}</span>
                <span style={{ ...mono, fontSize: 7, color: "#3a3d4a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.method}</span>
                <span style={{ ...mono, fontSize: 7, color: "#2a2d38" }}>R{b.rd}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <span style={{ ...mono, fontSize: 6, color: oc, background: `${oc}18`, padding: "1px 3px", borderRadius: 2 }}>{b.org}</span>
                  {b.title && <span style={{ fontSize: 7 }}>🏆</span>}
                </div>
              </div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SIGNAL PANEL ─────────────────────────────────────────────────────────────
function SignalScored({ sig, f1n, f2n, extra1, extra2, note1, note2 }) {
  const c = s => s >= 7 ? "#00e5a0" : s >= 5 ? "#f5a623" : "#ff3d57";
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[{ nm: f1n, s: sig.s1, ex: extra1, n: note1 }, { nm: f2n, s: sig.s2, ex: extra2, n: note2 }].map(({ nm, s, ex, n }) => (
          <div key={nm} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 5, padding: "12px 13px" }}>
            <div style={{ ...mono, fontSize: 8, color: "#2a2d38", marginBottom: 7 }}>{nm}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 7 }}>
              <span style={{ ...cond, fontWeight: 900, fontSize: 30, color: c(s) }}>{s}</span>
              <span style={{ ...mono, fontSize: 7, color: "#222630" }}>/10</span>
            </div>
            {ex}
            {n && <p style={{ ...sans, fontSize: 10, color: "#3a3d4a", lineHeight: 1.65, marginTop: 5, fontStyle: "italic" }}>{n}</p>}
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

// ─── INTEL PANEL ─────────────────────────────────────────────────────────────
const TABS = ["profiles", "walkout", "staredown", "weighin", "camp", "physical", "style", "market", "psych", "stats", "props"];
const TL = { profiles: "PROFILES", walkout: "WALKOUT", staredown: "STAREDOWN", weighin: "WEIGH-IN", camp: "CAMP", physical: "PHYSICAL", style: "STYLE", market: "MARKET", psych: "PSYCH", stats: "STATS", props: "PROPS" };

function IntelPanel({ fightId }) {
  const [tab, setTab] = useState("profiles");
  const d = FIGHT_DATA[fightId];
  if (!d) return null;
  const { f1, f2, signals: sig } = d;
  const vc = v => v === "EDGE" ? "#00e5a0" : v === "PUSH" ? "#f5a623" : "#ff3d57";
  const verd = sig.verdict;
  const cc = verd.conv === "HIGH" ? "#00e5a0" : verd.conv === "MEDIUM" ? "#f5a623" : "#5a5f70";

  return (
    <div style={{ marginTop: 14 }} className="fu">

      {/* Fighter quick strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[{ f: f1, ac: "#7a7f96" }, { f: f2, ac: "#ff3d57" }].map(({ f: fi, ac }, i) => (
          <div key={i} style={{ background: "#0e1016", border: `1px solid ${ac}25`, borderRadius: 5, padding: "11px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ ...mono, fontSize: 8, color: "#3a3d4a" }}>{fi.name}</span>
              <span style={{ ...cond, fontWeight: 800, fontSize: 12, color: ac }}>{fi.record}</span>
            </div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>
              {[fi.height, fi.stance, `${fi.reach}"`, `${fi.age}y`].map(v => <Pill key={v} label={v} color="#3a3d4a" />)}
              {fi.contractYr && <Pill label="Contract Yr" color="#f5a623" />}
              {fi.postKO && <Pill label="Post-KO ⚠" color="#ff3d57" />}
            </div>
            {fi.song && <div style={{ ...mono, fontSize: 7, color: "#1e2028", marginBottom: 3 }}>🎵 {fi.song}</div>}
            <Dots form={fi.form} />
            <div style={{ marginTop: 6, display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ ...mono, fontSize: 8, color: "#2a2d38" }}>{fi.openOdds} →</span>
              <span style={{ ...mono, fontSize: 11, color: isFav(fi.curOdds) ? "#ff3d57" : "#00e5a0", fontWeight: 700 }}>{fi.curOdds}</span>
              {fi.lineMove === "steaming" && <Pill label="STEAM" color="#ff3d57" />}
              {fi.lineMove === "drifting" && <Pill label="DRIFT" color="#00e5a0" />}
            </div>
          </div>
        ))}
      </div>

      {/* Master verdict */}
      <div style={{ background: "linear-gradient(135deg,#ff3d5709 0%,#0e1016 60%)", border: "1px solid #ff3d5720", borderRadius: 5, padding: "15px 16px", marginBottom: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
          <div>
            <div style={{ ...mono, fontSize: 7, color: "#2a2d38", letterSpacing: 2, marginBottom: 3 }}>{verd.signals}</div>
            <div style={{ ...cond, fontWeight: 900, fontSize: 22, letterSpacing: 1, lineHeight: 1, color: "#eceef5" }}>{verd.pick.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 2, marginBottom: 3 }}>CONVICTION</div>
            <div style={{ ...cond, fontWeight: 700, fontSize: 15, color: cc, letterSpacing: 2 }}>{verd.conv}</div>
          </div>
        </div>
        <p style={{ ...sans, fontSize: 12, lineHeight: 1.75, color: "#7a8090", fontStyle: "italic", marginBottom: 11 }}>{verd.angle}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, borderTop: "1px solid #1a1c24", paddingTop: 11, marginBottom: 10 }}>
          <div><div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 2, marginBottom: 3 }}>BEST PROP</div><div style={{ ...sans, fontSize: 11, color: "#555a6b", lineHeight: 1.5 }}>{verd.prop}</div></div>
          <div><div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 2, marginBottom: 3 }}>SHARP PLAY</div><div style={{ ...sans, fontSize: 11, color: "#555a6b", lineHeight: 1.5 }}>{verd.sharp}</div></div>
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "flex-start", background: "#ff3d5710", borderRadius: 3, padding: "6px 9px" }}>
          <span style={{ ...mono, fontSize: 7, color: "#ff3d57", letterSpacing: 1, flexShrink: 0 }}>⚠</span>
          <span style={{ ...sans, fontSize: 11, color: "#555a6b", lineHeight: 1.5 }}>{verd.flag}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 10 }}>
        {TABS.map(t => {
          const ld = { profiles: null, walkout: sig.walkout, staredown: sig.staredown, weighin: sig.weighin, camp: sig.camp, physical: sig.physical, style: sig.style, market: sig.market, psych: sig.psych, stats: sig.stats, props: sig.props }[t];
          const v = ld?.v; const c = v ? vc(v) : t === "profiles" ? "#6b7080" : "#1e2028"; const active = tab === t;
          return <button key={t} onClick={() => setTab(t)} style={{ background: active ? `${c}15` : "none", border: `1px solid ${active ? c + "55" : "#1a1c24"}`, borderRadius: 2, padding: "4px 8px", ...mono, fontSize: 8, color: active ? c : "#2a2d38", letterSpacing: 1, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 4 }}>
            {TL[t]}{v && <span style={{ width: 4, height: 4, borderRadius: "50%", background: c }} />}
          </button>;
        })}
      </div>

      {/* Tab content */}
      <div style={{ background: "#0a0b0f", border: "1px solid #13151d", borderRadius: 5, padding: 14 }} className="fu">

        {tab === "profiles" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Profile f={f1} accent="#7a7f96" />
            <Profile f={f2} accent="#ff3d57" />
          </div>
        )}

        {tab === "walkout" && <SignalScored sig={sig.walkout} f1n={f1.name} f2n={f2.name} note1={f1.walkout} note2={f2.walkout} />}
        {tab === "staredown" && <SignalScored sig={sig.staredown} f1n={f1.name} f2n={f2.name} note1={f1.staredown} note2={f2.staredown} />}
        {tab === "weighin" && <SignalScored sig={sig.weighin} f1n={f1.name} f2n={f2.name} note1={f1.weighin} note2={f2.weighin} />}
        {tab === "camp" && <SignalScored sig={sig.camp} f1n={f1.name} f2n={f2.name} note1={f1.camp} note2={f2.camp} />}

        {tab === "physical" && <SignalScored sig={sig.physical} f1n={f1.name} f2n={f2.name}
          extra1={<div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}><Pill label={`+${f1.rehydLbs}lbs rehydr`} color="#f5a623" /><Pill label={`Chin ${f1.chinRating}/10`} color={f1.chinRating >= 7 ? "#00e5a0" : "#ff3d57"} />{f1.postKO && <Pill label="Post-KO" color="#ff3d57" />}</div>}
          extra2={<div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}><Pill label={`+${f2.rehydLbs}lbs rehydr`} color="#f5a623" /><Pill label={`Chin ${f2.chinRating}/10`} color={f2.chinRating >= 7 ? "#00e5a0" : "#ff3d57"} />{f2.postKO && <Pill label="Post-KO" color="#ff3d57" />}</div>}
        />}

        {tab === "psych" && <SignalScored sig={sig.psych} f1n={f1.name} f2n={f2.name}
          extra1={<div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>{f1.contractYr && <Pill label="Contract Yr" color="#f5a623" />}<Pill label={`Social: ${f1.socialMood || "normal"}`} color="#3a3d4a" /></div>}
          extra2={<div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 5 }}>{f2.contractYr && <Pill label="Contract Yr" color="#f5a623" />}<Pill label={`Social: ${f2.socialMood || "normal"}`} color="#3a3d4a" /></div>}
        />}

        {tab === "style" && (() => {
          const ds = sig.style;
          return <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 13 }}>
              {[f1, f2].map((fi, i) => (
                <div key={i} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 5, padding: "12px 13px" }}>
                  <div style={{ ...mono, fontSize: 8, color: "#2a2d38", marginBottom: 7 }}>{fi.name}</div>
                  <Pill label={fi.archetype} color="#9da3b8" />
                  <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 5 }}>
                    {[["STANCE", fi.stance], ["VS PRESSER", fi.vsPresser?.toUpperCase()], ["VS COUNTER", fi.vsCounter?.toUpperCase()]].map(([l, v]) => (
                      <div key={l}><div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 2 }}>{l}</div><div style={{ ...mono, fontSize: 10, color: v === "EXCELLENT" ? "#00e5a0" : v === "POOR" ? "#ff3d57" : "#7a7f96" }}>{v}</div></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 11 }}>
              {[["STRIKING", ds.striking], ["GRAPPLING", ds.grappling], ["PACE", ds.pace], ["STANCE", ds.stance]].map(([l, v]) => (
                <div key={l} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 3, padding: "6px 10px" }}>
                  <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
                  <div style={{ ...mono, fontSize: 10, color: v === "PUSH" ? "#f5a623" : "#eceef5" }}>{v || "PUSH"}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <INote text={ds.note} /><VBadge v={ds.v} who={ds.who} />
            </div>
          </div>;
        })()}

        {tab === "market" && (() => {
          const dm = sig.market;
          return <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 13 }}>
              {[f1, f2].map((fi, i) => (
                <div key={i} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 5, padding: "12px 13px" }}>
                  <div style={{ ...mono, fontSize: 8, color: "#2a2d38", marginBottom: 6 }}>{fi.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 7 }}>
                    <span style={{ ...mono, fontSize: 9, color: "#2a2d38" }}>{fi.openOdds}</span>
                    <span style={{ ...mono, fontSize: 7, color: "#1e2028" }}>→</span>
                    <span style={{ ...cond, fontWeight: 700, fontSize: 18, color: isFav(fi.curOdds) ? "#ff3d57" : "#00e5a0" }}>{fi.curOdds}</span>
                  </div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 7 }}>
                    {fi.lineMove === "steaming" && <Pill label="STEAM ↑" color="#ff3d57" />}
                    {fi.lineMove === "drifting" && <Pill label="DRIFT" color="#00e5a0" />}
                    {fi.lineMove === "stable" && <Pill label="STABLE" color="#3a3d4a" />}
                    {fi.sharp === "with" && <Pill label="SHARP ✓" color="#00e5a0" />}
                    <Pill label={`CLV ${fi.clv}`} color={fi.clv?.startsWith("+") ? "#00e5a0" : "#ff3d57"} />
                    {fi.rlm && <Pill label="RLM ⚡" color="#f5a623" />}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ ...mono, fontSize: 7, color: "#222630" }}>PUBLIC %</span><span style={{ ...mono, fontSize: 7, color: "#3a3d4a" }}>{fi.pubPct}%</span></div>
                    <div style={{ height: 2, background: "#1a1c24" }}><div style={{ height: 2, width: `${fi.pubPct}%`, background: "#2a2d38" }} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 11 }}>
              {[["SHARP CONSENSUS", dm.sharp, "#eceef5"], ["VALUE PLAY", dm.value, "#00e5a0"], ["CLV EDGE", dm.clvEdge || "PUSH", "#eceef5"]].map(([l, v, c]) => (
                <div key={l} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 3, padding: "6px 10px" }}>
                  <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
                  <div style={{ ...mono, fontSize: 10, color: c }}>{v || "—"}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <INote text={dm.note} /><VBadge v={dm.v} who={dm.who} />
            </div>
          </div>;
        })()}

        {tab === "stats" && (() => {
          const ds = sig.stats;
          return <div>
            <div style={{ ...mono, fontSize: 7, color: "#1e2028", letterSpacing: 2, marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
              <span>{f1.name}</span><span>HEAD TO HEAD</span><span>{f2.name}</span>
            </div>
            <HBar label="SIG STRIKES/MIN" v1={f1.slpm} v2={f2.slpm} max={8} fmt={x => x.toFixed(1)} />
            <HBar label="ABSORBED/MIN" v1={f1.sapm} v2={f2.sapm} max={8} fmt={x => x.toFixed(1)} />
            <HBar label="TD ACCURACY" v1={f1.tdAcc} v2={f2.tdAcc} max={100} fmt={x => `${x}%`} />
            <HBar label="TD DEFENSE" v1={f1.tdDef} v2={f2.tdDef} max={100} fmt={x => `${x}%`} />
            <HBar label="SUB AVG" v1={f1.subAvg} v2={f2.subAvg} max={5} fmt={x => x.toFixed(1)} />
            <HBar label="KD AVG" v1={f1.kdAvg} v2={f2.kdAvg} max={2} fmt={x => x.toFixed(2)} />
            <HBar label="FINISH RATE" v1={f1.finRate} v2={f2.finRate} max={100} fmt={x => `${x}%`} />
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 12, marginBottom: 10 }}>
              {[["STRIKING", ds.striking], ["GRAPPLING", ds.grappling], ["PACE", ds.pace]].map(([l, v]) => (
                <div key={l} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 3, padding: "5px 9px" }}>
                  <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 2 }}>{l}</div>
                  <div style={{ ...mono, fontSize: 10, color: v === "PUSH" ? "#f5a623" : "#eceef5" }}>{v}</div>
                </div>
              ))}
            </div>
            <INote text={ds.note} />
          </div>;
        })()}

        {tab === "props" && (() => {
          const dp = sig.props;
          return <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 16 }}>
              {[["LIKELY METHOD", dp.method, "#eceef5"], ["OVER 2.5 RDS", dp.over25.toUpperCase(), dp.over25 === "yes" ? "#00e5a0" : "#ff3d57"], ["FINISH FIGHTER", dp.finish, "#eceef5"]].map(([l, v, c]) => (
                <div key={l} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 4, padding: "9px 10px" }}>
                  <div style={{ ...mono, fontSize: 6, color: "#222630", letterSpacing: 1, marginBottom: 4 }}>{l}</div>
                  <div style={{ ...cond, fontWeight: 700, fontSize: 13, color: c, lineHeight: 1.2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[f1, f2].map((fi, i) => (
                <div key={i} style={{ background: "#0e1016", border: "1px solid #1a1c24", borderRadius: 4, padding: "9px 11px" }}>
                  <div style={{ ...mono, fontSize: 8, color: "#2a2d38", marginBottom: 7 }}>{fi.name}</div>
                  <HBar label="AVG RDS" v1={fi.avgRds} v2={i === 0 ? f2.avgRds : f1.avgRds} max={5} fmt={x => `R${x.toFixed(1)}`} />
                  <HBar label="R1 FINISH %" v1={fi.r1FinRate} v2={i === 0 ? f2.r1FinRate : f1.r1FinRate} max={100} fmt={x => `${x}%`} />
                  <HBar label="DEC RATE" v1={fi.decRate} v2={i === 0 ? f2.decRate : f1.decRate} max={100} fmt={x => `${x}%`} />
                </div>
              ))}
            </div>
            <INote text={dp.note} />
          </div>;
        })()}

      </div>
    </div>
  );
}

// ─── FIGHT ROW ────────────────────────────────────────────────────────────────
function FightRow({ fight, picks, onPick }) {
  const [open, setOpen] = useState(false);
  const p = picks[fight.id];
  const done = fight.status === "COMPLETED";

  return (
    <div style={{ borderBottom: "1px solid #11131a", paddingBottom: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
        <span style={{ ...mono, fontSize: 8, color: "#2a2d38", letterSpacing: 1 }}>{fight.wc}</span>
        {done && fight.winner && <span style={{ ...mono, fontSize: 7, color: "#00e5a0", background: "#00e5a010", padding: "2px 8px", borderRadius: 2, letterSpacing: 1 }}>✓ {fight.winner} · {fight.method}</span>}
      </div>

      {!done ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", marginBottom: 10 }}>
          <button onClick={() => onPick(fight.id, "f1")} style={{ background: p === "f1" ? "#13151d" : p ? "#0b0d12" : "#0f1016", border: `1px solid ${p === "f1" ? "#282c3a" : "#13151d"}`, borderRight: "none", borderRadius: "5px 0 0 5px", padding: "13px 14px", textAlign: "left", color: p && p !== "f1" ? "#1a1c24" : "#eceef5", cursor: "pointer", width: "100%", transition: "all .15s" }}>
            {fight.f1odds && <div style={{ ...mono, fontSize: 15, fontWeight: 600, marginBottom: 3, color: p && p !== "f1" ? "#1a1c24" : isFav(fight.f1odds) ? "#ff3d57" : "#00e5a0" }}>{fight.f1odds} <span style={{ fontSize: 9, color: p && p !== "f1" ? "#161820" : "#2a2d38" }}>{toImplied(fight.f1odds)}%</span></div>}
            <div style={{ ...cond, fontWeight: 700, fontSize: 16 }}>{fight.f1}</div>
            {p === "f1" && <div style={{ ...mono, fontSize: 7, color: "#00e5a0", marginTop: 4, letterSpacing: 1 }}>✓ PICKED</div>}
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0c0f", border: "1px solid #13151d", borderLeft: "none", borderRight: "none" }}>
            <span style={{ ...mono, fontSize: 7, color: "#1a1c24" }}>vs</span>
          </div>
          <button onClick={() => onPick(fight.id, "f2")} style={{ background: p === "f2" ? "#160e10" : p ? "#0b0d12" : "#0f1016", border: `1px solid ${p === "f2" ? "#3a1820" : "#13151d"}`, borderLeft: "none", borderRadius: "0 5px 5px 0", padding: "13px 14px", textAlign: "right", color: p && p !== "f2" ? "#1a1c24" : "#eceef5", cursor: "pointer", width: "100%", transition: "all .15s" }}>
            {fight.f2odds && <div style={{ ...mono, fontSize: 15, fontWeight: 600, marginBottom: 3, color: p && p !== "f2" ? "#1a1c24" : isFav(fight.f2odds) ? "#ff3d57" : "#00e5a0" }}><span style={{ fontSize: 9, color: p && p !== "f2" ? "#161820" : "#2a2d38" }}>{toImplied(fight.f2odds)}%</span> {fight.f2odds}</div>}
            <div style={{ ...cond, fontWeight: 700, fontSize: 16 }}>{fight.f2}</div>
            {p === "f2" && <div style={{ ...mono, fontSize: 7, color: "#ff3d57", marginTop: 4, letterSpacing: 1 }}>✓ PICKED</div>}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 28px 1fr", marginBottom: 10 }}>
          <div style={{ padding: "9px 11px", background: "#0e1016", borderRight: "none", borderRadius: "5px 0 0 5px", border: `1px solid ${fight.winner === fight.f1 ? "#00e5a020" : "#13151d"}` }}>
            <div style={{ ...cond, fontWeight: 700, fontSize: 14, color: fight.winner === fight.f1 ? "#00e5a0" : "#2a2d38" }}>{fight.f1}</div>
            {fight.winner === fight.f1 && <div style={{ ...mono, fontSize: 7, color: "#00e5a0", marginTop: 3, letterSpacing: 1 }}>WINNER</div>}
          </div>
          <div style={{ background: "#0b0c0f", border: "1px solid #13151d", borderLeft: "none", borderRight: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...mono, fontSize: 7, color: "#1a1c24" }}>vs</span>
          </div>
          <div style={{ padding: "9px 11px", background: "#0e1016", textAlign: "right", borderLeft: "none", borderRadius: "0 5px 5px 0", border: `1px solid ${fight.winner === fight.f2 ? "#00e5a020" : "#13151d"}` }}>
            <div style={{ ...cond, fontWeight: 700, fontSize: 14, color: fight.winner === fight.f2 ? "#00e5a0" : "#2a2d38" }}>{fight.f2}</div>
            {fight.winner === fight.f2 && <div style={{ ...mono, fontSize: 7, color: "#00e5a0", marginTop: 3, letterSpacing: 1 }}>WINNER</div>}
          </div>
        </div>
      )}

      {!done && (
        <div>
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", ...mono, fontSize: 9, color: open ? "#00e5a0" : "#2a2d38", letterSpacing: 2, cursor: "pointer", padding: "3px 0", transition: "color .15s" }}>
            {open ? "▲ COLLAPSE" : "▼ FIGHTER INTELLIGENCE"}
          </button>
          {open && <IntelPanel fightId={fight.id} />}
        </div>
      )}

      {p && !done && (
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: p === "f1" ? "#7a7f96" : "#ff3d57" }} />
          <span style={{ ...mono, fontSize: 8, color: "#2a2d38", letterSpacing: 1 }}>PICK:</span>
          <span style={{ ...cond, fontWeight: 700, fontSize: 14, color: "#9da3b8" }}>{p === "f1" ? fight.f1 : fight.f2}</span>
          <span style={{ ...mono, fontSize: 11, color: isFav(p === "f1" ? fight.f1odds : fight.f2odds) ? "#ff3d57" : "#00e5a0" }}>{p === "f1" ? fight.f1odds : fight.f2odds}</span>
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
  const event = EVENTS[ev];
  const upcoming = event.fights.filter(f => f.status !== "COMPLETED");
  const pickCount = upcoming.filter(f => picks[f.id]).length;

  const onPick = useCallback((id, side) => {
    setPicks(p => { if (p[id] === side) { const n = { ...p }; delete n[id]; return n; } return { ...p, [id]: side }; });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0c0f", color: "#eceef5", ...sans }}>
      <style>{CSS}</style>

      <div style={{ borderBottom: "1px solid #11131a", padding: "18px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...mono, fontSize: 7, color: "#ff3d57", letterSpacing: 3, marginBottom: 5 }}>UFC · SPORTSBOOK INTELLIGENCE</div>
          <div style={{ ...cond, fontWeight: 900, fontSize: "clamp(17px,4vw,34px)", letterSpacing: 1, lineHeight: 1, color: "#eceef5" }}>{event.name.toUpperCase()}</div>
          <div style={{ ...mono, fontSize: 7, color: "#222630", marginTop: 4, letterSpacing: 1 }}>
            {event.date} · {event.fights.length} BOUTS{pickCount > 0 ? ` · ${pickCount}/${upcoming.length} PICKS` : ""}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {EVENTS.map((e, i) => (
            <button key={i} onClick={() => setEv(i)} style={{ background: "none", border: "none", borderBottom: ev === i ? "2px solid #ff3d57" : "2px solid transparent", padding: "7px 14px", ...mono, fontSize: 8, color: ev === i ? "#eceef5" : "#2a2d38", letterSpacing: 1, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
              {e.status === "completed" ? "✓ " : ""}{e.name.split(":")[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 80px" }}>
        <div className="fu">
          {event.fights.map(fight => <FightRow key={fight.id} fight={fight} picks={picks} onPick={onPick} />)}

          {pickCount > 0 && pickCount === upcoming.length && (
            <div style={{ border: "1px solid #1a1c24", borderRadius: 5, padding: 18, background: "#0e1016", marginTop: 8 }} className="fu">
              <div style={{ ...mono, fontSize: 7, color: "#222630", letterSpacing: 3, marginBottom: 13 }}>YOUR CARD</div>
              {upcoming.map(fight => {
                const side = picks[fight.id], name = side === "f1" ? fight.f1 : fight.f2, odds = side === "f1" ? fight.f1odds : fight.f2odds;
                return <div key={fight.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #11131a", paddingBottom: 7, marginBottom: 7 }}>
                  <div><span style={{ ...mono, fontSize: 7, color: "#1a1c24", marginRight: 8 }}>{fight.wc.split("·")[0].trim()}</span><span style={{ ...cond, fontWeight: 700, fontSize: 15 }}>{name}</span></div>
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