export function renderReviewPage(payload) {
  const dataJson = safeJson(payload.data || []);
  const failedJson = safeJson(payload.failedQueue || []);
  const metricoolEngineJson = safeJson(payload.metricoolEngine || {});
  const metricoolShadowRerouteJson = safeJson(payload.metricoolShadowReroute || { summary: {}, groups: [], rows: [], files: {} });
  const repurposeSeedPlanJson = safeJson(payload.repurposeSeedPlan || { summary: {}, cards: [], files: {} });
  const scheduleJobJson = safeJson(payload.scheduleJob || { status: "idle", steps: [] });
  const brollJson = safeJson(payload.broll || []);
  const quoteReelsJson = safeJson(payload.quoteReels || []);
  const audioBedsJson = safeJson(payload.audioBeds || []);
  const reuseJson = safeJson(payload.reuseQueue || []);
  const blogCompanionJson = safeJson(payload.blogCompanionPrompts || []);
  const inventoryJson = safeJson(payload.inventory || []);
  const socialSurfacesJson = safeJson(payload.socialSurfaces || { rows: [], summary: [] });
  const distributionPropertiesJson = safeJson(payload.distributionProperties || { properties: [] });
  const liveMode = !!payload.liveMode;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="/favicon.png">
	<title>Marketing Engine</title>
<style>
:root{--navy:#243445;--bg:#18242f;--panel:#213142;--panel2:#1c2a38;--gold:#bf8c4d;--light:#e9e8e6;--mut:#96a7b5;--line:rgba(255,255,255,.1);--ok:#78b986;--warn:#d7a65f;--bad:#c97878}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--light);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Arial,sans-serif;font-size:14px;line-height:1.45}
	header{position:sticky;top:0;z-index:10;background:rgba(36,52,69,.96);backdrop-filter:blur(10px);border-bottom:1px solid rgba(191,140,77,.36);padding:10px 22px;display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:8px 18px;align-items:center}
	h1,h2,h3{letter-spacing:0}header h1{font-size:18px;margin:0;color:#fff;font-weight:650}.head-main,.head-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.head-actions{justify-content:flex-end}.mut{color:var(--mut)}.sp{flex:1}.wrap{max-width:1680px;margin:0 auto;padding:20px 18px 90px}
.btn{background:transparent;border:1px solid var(--gold);color:var(--gold);border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;min-height:34px}.btn:hover{background:rgba(191,140,77,.12)}.btn.subtle{border-color:rgba(255,255,255,.18);color:var(--light)}.btn.danger{border-color:var(--bad);color:#f1b7b7}.btn.small{font-size:12px;padding:5px 9px;min-height:28px}.icon-btn{width:32px;height:32px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.035);color:var(--light);display:inline-grid;place-items:center;cursor:pointer;font-size:22px;line-height:1}.icon-btn:hover{border-color:var(--gold);color:#fff;background:rgba(191,140,77,.12)}
.tag,.chip{font-size:12px;color:#c8d3dd;border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:3px 9px;display:inline-flex;align-items:center;gap:5px}.tag.live{color:#ffd59d;border-color:rgba(191,140,77,.48)}.tag.dry{color:#c8d3dd;border-color:rgba(255,255,255,.24)}
.nav{display:flex;gap:7px;flex-wrap:wrap;grid-column:1/-1}.nav a{color:var(--light);text-decoration:none;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:6px 10px;font-size:12px}.nav a:hover,.nav a.active{border-color:var(--gold);color:#fff;background:rgba(191,140,77,.1)}
	.section{margin:24px 0}.section-head{display:flex;align-items:flex-end;gap:12px;margin:0 0 12px}.section-head h2{font-size:19px;margin:0;color:#fff}.section-head p{margin:0;color:var(--mut);font-size:13px}.calendar-title{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.week-nav{display:inline-flex;align-items:center;gap:8px}.week-range{color:var(--mut);font-size:13px;font-weight:600;min-width:190px;text-align:center}
	.view{display:none}.view.active{display:block}
	.engine-hero{display:grid;grid-template-columns:minmax(280px,1fr) auto;gap:16px;align-items:end;background:linear-gradient(135deg,rgba(36,52,69,.86),rgba(28,42,56,.96));border:1px solid rgba(191,140,77,.25);border-radius:10px;padding:16px;margin:0 0 18px}.engine-hero h2{font-size:22px;margin:0 0 4px;color:#fff}.engine-hero p{margin:0;color:#b9c6cf;max-width:760px}.engine-kpis{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.kpi{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:9px 11px;min-width:92px}.kpi b{display:block;color:#fff;font-size:18px;line-height:1}.kpi span{display:block;color:var(--mut);font-size:11px;text-transform:uppercase;margin-top:4px}
	.job-strip{grid-column:1/-1;background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:10px 11px}.job-top{display:flex;justify-content:space-between;gap:10px;align-items:center;color:#fff;font-weight:650}.job-top span{color:var(--mut);font-weight:500;font-size:12px}.job-steps{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.job-step{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:4px 8px;color:var(--mut);font-size:11px}.job-step.running{border-color:var(--gold);color:#ffd59d;background:rgba(191,140,77,.08)}.job-step.complete{border-color:rgba(120,185,134,.62);color:#b8e0c1}.job-step.failed{border-color:var(--bad);color:#f2b6b6}
	.attention-strip{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.attention-pill{background:var(--panel);border:1px solid rgba(191,140,77,.42);border-radius:999px;padding:8px 11px;text-decoration:none;color:var(--light);display:inline-flex;gap:8px;align-items:center;font-size:13px}.attention-pill strong{color:#fff;font-size:15px}.attention-pill:hover{background:rgba(191,140,77,.1);border-color:var(--gold)}.empty-state{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:11px 12px;color:var(--mut);font-size:13px}
.card,.lane,.table-wrap{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px;margin-bottom:16px}.card.ap{border-color:var(--gold);box-shadow:0 0 0 1px rgba(191,140,77,.65) inset}.card h3,.lane h3{margin:0;color:#fff;font-size:16px}
.card-head{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.ap-box{margin-left:auto;display:flex;gap:8px;align-items:center;font-weight:600;color:#fff}.ap-box input{width:20px;height:20px;accent-color:var(--gold)}
.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;margin:10px 0 14px}.summary div{background:var(--panel2);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:9px}.summary b{display:block;color:#fff;font-size:12px;text-transform:uppercase;margin-bottom:4px}.summary span{color:#d7e0e7;font-size:13px}
.row{display:grid;grid-template-columns:minmax(230px,500px) minmax(320px,1fr);gap:16px;align-items:start}.media-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}video{border-radius:8px;background:#000;max-width:100%;max-height:500px}.media-pair video{width:100%;aspect-ratio:9/16;object-fit:cover}.cover-panel img{width:100%;aspect-ratio:9/16;object-fit:cover;border-radius:8px;border:1px solid rgba(255,255,255,.13);display:block}.control-line{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}.control-line select,.filters select,.chat textarea{background:var(--panel2);color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:7px;padding:7px}
.asset-grid,.routing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.asset-toggle{display:flex;gap:7px;align-items:center;background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 9px;color:#fff;font-size:13px}.asset-toggle input{accent-color:var(--gold)}.asset-toggle.off{opacity:.5}
.st{color:var(--gold);font-size:12px;text-transform:uppercase;margin:16px 0 7px;font-weight:700}.slides{display:flex;gap:7px;overflow-x:auto;padding-bottom:7px}.slides img{height:260px;border-radius:8px;border:1px solid rgba(255,255,255,.1)}
details{background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;margin:7px 0;padding:0 12px}summary{cursor:pointer;padding:10px 0;color:#fff;font-size:14px;list-style:none}summary::before{content:"> ";color:var(--gold)}details[open] summary::before{content:"v "}pre{white-space:pre-wrap;font-family:inherit;font-size:13px;line-height:1.5;margin:0 0 12px}
.route{background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px}.route.yes{border-color:rgba(191,140,77,.72)}.route.no{opacity:.52}.route strong{display:block;color:#fff}.route p{margin:5px 0;color:#d3dce3;font-size:13px}.route .actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
.route-callout{display:grid;grid-template-columns:minmax(170px,240px) minmax(0,1fr);gap:10px;background:rgba(191,140,77,.08);border:1px solid rgba(191,140,77,.45);border-radius:9px;padding:11px;margin:0 0 12px}.route-callout b{display:block;color:var(--gold);font-size:11px;text-transform:uppercase;margin-bottom:3px}.route-callout strong{display:block;color:#fff;font-size:16px}.route-callout p{margin:3px 0 7px;color:#d9e1e7}.route-callout .route-lines{display:grid;gap:5px}.route-callout .line{color:#d7e0e7;font-size:13px}.route-callout .line span{color:var(--mut)}.route-callout.waiting{border-color:rgba(215,166,95,.42);background:rgba(215,166,95,.06)}
.destination-plan{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin:12px 0}.destination-card{background:var(--panel2);border:1px solid rgba(255,255,255,.09);border-radius:9px;padding:11px}.destination-card.included{border-color:rgba(120,185,134,.65);background:rgba(120,185,134,.07)}.destination-card.optional{border-color:rgba(215,166,95,.45)}.destination-card.excluded{opacity:.58}.destination-card h4{margin:0 0 6px;color:#fff;font-size:14px}.destination-card p{margin:5px 0;color:#d6e0e8;font-size:12px}.destination-meta{display:flex;gap:6px;flex-wrap:wrap;margin:7px 0}.platform-list{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.platform-pill{font-size:11px;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:2px 7px;color:#d8e1e8}.route-status{font-size:11px;text-transform:uppercase;color:var(--gold);font-weight:700}
.reroute-card .card-head{align-items:flex-start}.reroute-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin:10px 0 12px}.reroute-summary div{background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:9px}.reroute-summary b{display:block;color:var(--mut);font-size:11px;text-transform:uppercase;margin-bottom:4px}.reroute-summary span{display:block;color:#fff;font-size:14px}.reroute-post-list{display:grid;gap:6px}.reroute-post-row{display:grid;grid-template-columns:94px 92px minmax(0,1fr);gap:8px;align-items:start;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:7px;color:#d8e1e8;font-size:12px}.reroute-post-row.move{border-left:3px solid var(--ok)}.reroute-post-row.gap{border-left:3px solid var(--warn)}.reroute-post-row.keep{border-left:3px solid var(--mut)}
.draft-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;margin-top:8px}.draft-card{background:var(--panel2);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:10px}.draft-card h4{margin:0 0 6px;color:#fff;font-size:13px}.draft-card pre{max-height:300px;overflow:auto;background:rgba(0,0,0,.14);border-radius:7px;padding:9px}.seed-card .destination-card.included{background:rgba(191,140,77,.075);border-color:rgba(191,140,77,.5)}
.workflow{display:flex;gap:6px;flex-wrap:wrap;margin:9px 0}.step{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:4px 8px;font-size:11px;color:var(--mut)}.step.done{border-color:rgba(120,185,134,.6);color:#b8e0c1}.step.now{border-color:var(--gold);color:#ffd59d}.next-action{margin-top:8px;display:flex;gap:7px;flex-wrap:wrap}.pathline{font-size:12px;color:var(--mut);margin-top:6px;word-break:break-word}
.chat{margin-top:14px;background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px}.chat-log{max-height:360px;overflow:auto;margin-bottom:8px}.msg{padding:7px 9px;border-radius:8px;margin:6px 0;background:rgba(255,255,255,.05)}.msg.user{border-left:3px solid var(--gold)}.msg.assistant{border-left:3px solid var(--ok)}.msg .who{font-size:11px;text-transform:uppercase;color:var(--mut);font-weight:700}.chat textarea{width:100%;min-height:72px;resize:vertical}.chat-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px;flex-wrap:wrap}.suggestion{border:1px solid rgba(191,140,77,.32);border-radius:8px;padding:9px;margin-top:8px;background:rgba(191,140,77,.06)}.suggestion h4{margin:0 0 4px;color:#fff;font-size:13px}.suggestion p{margin:4px 0;color:#d8e1e8;font-size:12px}.suggestion pre{max-height:150px;overflow:auto;background:rgba(0,0,0,.16);padding:8px;border-radius:6px}.suggestion.applied{opacity:.6;border-color:rgba(120,185,134,.5)}
	.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.reuse-lanes{display:grid;grid-template-columns:1fr;gap:14px}.reuse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.reuse-card{background:var(--panel2);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:11px}.reuse-card h4{font-size:14px;color:#fff;margin:0 0 6px}.reuse-meta{font-size:12px;color:var(--mut)}.reuse-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.resource-video-preview{margin:10px 0;padding:9px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(0,0,0,.12)}.resource-video-preview video{width:100%;max-height:230px;aspect-ratio:16/9;object-fit:contain}.resource-video-preview b{display:block;margin-bottom:6px;color:#fff;font-size:12px}.stale-preview{border-color:rgba(191,140,77,.62);background:rgba(191,140,77,.08)}.companion-strip{display:grid;gap:10px;margin:12px 0 18px}.companion-card{border-left:3px solid rgba(191,140,77,.72)}.companion-card.received{border-left-color:var(--ok)}.companion-priority{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px}.companion-card pre{max-height:420px;overflow:auto;background:rgba(0,0,0,.16);border-radius:7px;padding:10px}
#failures .reuse-grid{grid-template-columns:1fr}.failure-card{display:grid;grid-template-columns:220px minmax(0,1fr);gap:12px;align-items:start}.failure-thumb{width:220px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:#0f1821}.failure-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;margin:8px 0}.failure-fact{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:7px;padding:6px}.failure-fact b{display:block;color:var(--mut);font-size:10px;text-transform:uppercase}.failure-fact span{color:#fff;font-size:12px}.artifact-list{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.artifact-list a,.artifact-list span{font-size:11px;color:#d8e1e8;text-decoration:none;border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:3px 7px;background:rgba(255,255,255,.035)}.artifact-list a:hover{border-color:var(--gold);color:#fff}.failure-snippet{font-size:12px;color:#d8e1e8;background:rgba(0,0,0,.12);border-radius:7px;padding:8px;margin:8px 0}
	.planner-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}.planner-tabs{display:inline-flex;border:1px solid rgba(255,255,255,.16);border-radius:8px;overflow:hidden}.planner-tabs button{border:0;border-right:1px solid rgba(255,255,255,.12);background:transparent;color:var(--light);padding:7px 10px;cursor:pointer}.planner-tabs button:last-child{border-right:0}.planner-tabs button.active{background:rgba(191,140,77,.18);color:#fff}.planner-summary{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 12px}.planner-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;align-items:start}.calendar-shell{overflow-x:auto;padding-bottom:10px}.week-calendar{display:grid;grid-template-columns:64px repeat(7,minmax(150px,1fr));width:100%;min-width:1120px;border:1px solid var(--line);border-radius:10px;background:var(--panel);overflow:hidden}.week-head,.time-label,.week-cell{border-right:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.07)}.week-head{padding:10px;background:rgba(255,255,255,.04);font-size:12px;color:#fff;min-height:46px}.week-head.today{background:rgba(191,140,77,.18);box-shadow:inset 0 -2px 0 var(--gold)}.week-head .today-label{display:block;color:#ffd59d;font-size:10px;text-transform:uppercase;margin-top:2px}.time-label{padding:10px 8px;color:var(--mut);font-size:12px;background:rgba(0,0,0,.08)}.week-cell{padding:7px;min-height:66px}.week-cell.today{background:rgba(191,140,77,.055)}.week-cell.empty{background:rgba(255,255,255,.01)}.week-cell.empty.today{background:rgba(191,140,77,.045)}.calendar-chip{width:100%;text-align:left;border:1px solid rgba(255,255,255,.09);border-left:3px solid rgba(191,140,77,.72);background:var(--panel2);border-radius:6px;padding:7px 8px;margin:0 0 5px;cursor:pointer;color:var(--light)}.calendar-chip:hover,.calendar-chip.active{border-color:rgba(191,140,77,.7);background:rgba(191,140,77,.1)}.calendar-chip.local{border-left-color:var(--mut)}.calendar-chip.failed{border-left-color:var(--bad)}.calendar-chip.published{border-left-color:var(--ok)}.chip-line{display:flex;gap:6px;align-items:center;min-width:0}.platform-dot{width:8px;height:8px;border-radius:999px;background:#aab6c0;flex:0 0 auto}.platform-dot.x{background:#f1f1f1}.platform-dot.instagram{background:#e56aa5}.platform-dot.linkedin{background:#67a7dc}.platform-dot.facebook{background:#4f87d9}.platform-dot.gbp{background:#7dc37b}.chip-title{font-size:12px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chip-format{display:block;color:#c8d3dd;font-size:11px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.status-mark{margin-left:auto;font-size:10px;color:var(--mut)}.planner-inspector{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}.planner-inspector h3{font-size:15px;margin:0 0 8px;color:#fff}.planner-inspector p{margin:7px 0;color:#d6e0e8;font-size:13px}.planner-inspector pre{max-height:170px;overflow:auto;background:var(--panel2);border-radius:8px;padding:9px}.agenda-list,.platform-board{display:grid;gap:8px}.agenda-row,.platform-column{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:10px}.agenda-row{display:grid;grid-template-columns:90px 100px minmax(0,1fr) 120px;gap:10px;align-items:center}.platform-board{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.platform-column h3{font-size:14px;margin:0 0 8px;color:#fff}
	.calendar-board{display:grid;grid-template-columns:68px repeat(7,minmax(150px,1fr));grid-template-rows:48px auto;min-width:1120px;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden}.calendar-corner{background:rgba(255,255,255,.035);border-right:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08)}.time-axis,.calendar-day{position:relative;border-right:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.012)}.time-axis{background:rgba(0,0,0,.08)}.calendar-day.today{background:rgba(191,140,77,.035)}.hour-line{position:absolute;left:0;right:0;border-top:1px solid rgba(255,255,255,.075);pointer-events:none}.axis-label{position:absolute;left:8px;transform:translateY(-50%);font-size:11px;color:var(--mut)}.timed-chip{position:absolute;left:7px;right:7px;min-height:38px;margin:0;z-index:1;box-shadow:0 8px 18px rgba(0,0,0,.16)}.timed-chip .chip-title{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.calendar-legend{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:8px 0 12px;color:var(--mut);font-size:12px}.calendar-legend span{display:inline-flex;gap:5px;align-items:center}.legend-status{width:20px;height:0;border-top:3px solid rgba(191,140,77,.72);display:inline-block}.legend-status.published{border-color:var(--ok)}.legend-status.local{border-color:var(--mut)}.legend-status.failed{border-color:var(--bad)}
	.performance-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.perf-card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}.perf-card h3{font-size:14px;margin:0 0 8px;color:#fff}.health-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:8px}.bar-row{display:grid;grid-template-columns:minmax(80px,120px) 1fr auto;gap:8px;align-items:center;margin:7px 0;color:#d7e0e7;font-size:12px}.bar{height:7px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:var(--gold);border-radius:999px}
	.setup-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}.setup-card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}.setup-card h3{font-size:14px;margin:0 0 7px;color:#fff}.source-lines{display:grid;gap:6px;margin-top:9px}.source-line{background:rgba(255,255,255,.04);border-left:3px solid rgba(191,140,77,.65);border-radius:6px;padding:7px 8px;color:#d9e1e7;font-size:12px}.preview-note{margin-top:8px;color:var(--mut);font-size:12px}
		.analytics-hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:10px 0 12px}.analytics-tile{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}.analytics-tile span,.chart-note{display:block;color:var(--mut);font-size:12px}.analytics-tile b{display:block;color:#fff;font-size:25px;line-height:1.05;margin:4px 0}.chart-grid{display:grid;grid-template-columns:repeat(2,minmax(280px,1fr));gap:12px;margin:12px 0}.chart-card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:13px;min-width:0}.chart-card h3{font-size:14px;margin:0 0 3px;color:#fff}.chart-card p{margin:0 0 10px;color:var(--mut);font-size:12px}.line-chart{width:100%;height:180px;display:block}.line-chart text{fill:var(--mut);font-size:10px}.line-chart .grid{stroke:rgba(255,255,255,.08);stroke-width:1}.line-chart .line{fill:none;stroke:var(--gold);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.line-chart .area{fill:rgba(191,140,77,.1)}.bar-chart{display:grid;gap:8px;margin-top:10px}.bar-chart .bar-row{grid-template-columns:minmax(92px,140px) 1fr auto}.metric-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}.metric-card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}.metric-card h3{font-size:13px;margin:0 0 8px;color:#fff}.metric-value{font-size:28px;line-height:1;color:#fff;font-weight:700}.metric-sub{color:var(--mut);font-size:12px;margin-top:5px}.spark{display:flex;gap:2px;height:36px;align-items:end;margin-top:12px}.spark span{flex:1;min-width:3px;background:rgba(191,140,77,.72);border-radius:2px 2px 0 0}
	.broll-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}.bcard{background:var(--panel2);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px}.bcard video{width:100%;max-height:270px}.bcard.approved{border-color:rgba(191,140,77,.55)}.audio-bed-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}.audio-bed-card{background:var(--panel2);border:1px solid rgba(255,255,255,.1);border-radius:9px;padding:10px}.audio-bed-card audio{width:100%;margin-top:8px}
table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:9px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top;text-align:left}th{color:#fff;background:rgba(255,255,255,.04);position:sticky;top:55px}td{color:#d8e1e8}
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--navy);padding:10px 18px;border-radius:8px;font-weight:700;opacity:0;transition:.2s;z-index:30}.hide{display:none!important}
	@media(max-width:900px){.planner-layout{grid-template-columns:1fr}.planner-inspector{position:static}.agenda-row{grid-template-columns:1fr}.metric-grid{grid-template-columns:1fr 1fr}.chart-grid{grid-template-columns:1fr}}
@media(max-width:850px){.row{grid-template-columns:1fr}.media-pair{grid-template-columns:1fr 1fr}.slides img{height:220px}header{grid-template-columns:1fr;padding:10px}.head-actions{justify-content:flex-start}.wrap{padding-left:10px;padding-right:10px}th{top:92px}}
@media(max-width:560px){.media-pair{grid-template-columns:1fr}.metric-grid{grid-template-columns:1fr}.engine-hero{grid-template-columns:1fr}.engine-kpis{justify-content:flex-start}.route-callout{grid-template-columns:1fr}.bar-row{grid-template-columns:1fr auto}.bar-row span:first-child{grid-column:1/-1}}
</style>
</head>
<body>
<header>
  <div class="head-main">
    <h1>Marketing Engine</h1>
    <span class="mut" id="meta"></span>
    <span class="tag ${liveMode ? "live" : "dry"}">${liveMode ? "Metricool write enabled" : "Review-gated mode"}</span>
    <span class="mut" id="cnt"></span>
  </div>
  <div class="head-actions">
    <button class="btn subtle" onclick="syncMetricool()">Refresh Metricool</button>
    <button class="btn subtle" onclick="buildSchedule()">Generate posting plan</button>
    ${liveMode ? '<button class="btn" onclick="scheduleLive()">Schedule in Metricool</button>' : ''}
  </div>
  <nav class="nav">
    <a href="#review" data-view="review">Today</a>
    <a href="#planner" data-view="planner">Planner</a>
    <a href="#reuse" data-view="reuse">Resource Queue</a>
    <a href="#analytics" data-view="analytics">Analytics</a>
    <a href="#setup" data-view="setup">Reports & Setup</a>
  </nav>
</header>
<main class="wrap">
  <section class="view active" id="review" data-view-panel="review">
    <section class="engine-hero" id="engine-hero"></section>
    <section class="section" id="failures"></section>
    <section class="section" id="social"></section>
  </section>
  <section class="view" id="planner-view" data-view-panel="planner">
    <section class="section" id="planner"></section>
  </section>
  <section class="view" id="reuse-view" data-view-panel="reuse">
    <section class="section" id="reuse"></section>
  </section>
  <section class="view" id="analytics-view" data-view-panel="analytics">
    <section class="section" id="analytics"></section>
  </section>
  <section class="view" id="setup-view" data-view-panel="setup">
    <section class="section" id="setup-overview"></section>
    <section class="section" id="distribution"></section>
    <section class="section" id="shadow-reroute"></section>
    <section class="section" id="repurpose-seeds"></section>
    <section class="section" id="broll"></section>
    <section class="section" id="inventory"></section>
  </section>
</main>
<div class="toast" id="toast"></div>
<script>
const DATA = ${dataJson};
const FAILED_QUEUE = ${failedJson};
const ENGINE = ${metricoolEngineJson};
const SHADOW_REROUTE = ${metricoolShadowRerouteJson};
const REPURPOSE_SEEDS = ${repurposeSeedPlanJson};
let CURRENT_JOB = ${scheduleJobJson};
const BROLL = ${brollJson};
const QUOTE_REELS = ${quoteReelsJson};
const AUDIO_BEDS = ${audioBedsJson};
const REUSE_QUEUE = ${reuseJson};
const BLOG_COMPANIONS = ${blogCompanionJson};
const INVENTORY = ${inventoryJson};
const SOCIAL_SURFACES = ${socialSurfacesJson};
const DISTRIBUTION_PROPERTIES = ${distributionPropertiesJson};
const LIVE_MODE = ${liveMode ? "true" : "false"};
const VISIBLE_REUSE_TYPES = new Set(["video_explainer_page","blog","landing_page_brief","learning_center_faq","one_pager","website_reuse_snippet","email_planning_note"]);
const ROUTE_LABELS = {video_explainer_page:"Website resource page",blog:"Blog",landingPage:"Landing page brief",learningCenterOrFaq:"Learning Center / FAQ",onePager:"One-pager",websiteReuse:"Website reuse",email:"Email"};
const ROUTE_TO_REUSE = {video_explainer_page:"video_explainer_page",blog:"blog",landingPage:"landing_page_brief",learningCenterOrFaq:"learning_center_faq",onePager:"one_pager",websiteReuse:"website_reuse_snippet",email:"email_planning_note"};
const REUSE_GROUPS = [
  ["blog","Blog candidates"],
  ["video_explainer_page","Resource pages"],
  ["landing_page_brief","Landing page briefs"],
  ["learning_center_faq","Learning Center / FAQ"],
  ["one_pager","One-pagers"],
  ["website_reuse_snippet","Website reuse snippets"],
  ["email_planning_note","Email planning notes"]
];
let SHOW_COMPLETED = false;
let PLANNER_MODE = "week";
let PLANNER_WEEK_OFFSET = 0;
let PLANNER_PROPERTY = "all";
let PLANNER_SELECTED_ID = "";
function esc(s){return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function enc(s){return encodeURIComponent(String(s ?? ""))}
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.style.opacity=1;setTimeout(()=>t.style.opacity=0,2200)}
async function post(u,b){const r=await fetch(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b||{})});return r.json()}
function setView(view, updateHash=true){
  const target=view||"review";
  document.querySelectorAll("[data-view-panel]").forEach(panel=>panel.classList.toggle("active",panel.dataset.viewPanel===target));
  document.querySelectorAll("[data-view]").forEach(link=>link.classList.toggle("active",link.dataset.view===target));
  if(updateHash) history.replaceState(null,"","#"+target);
}
function jumpTo(target){
  const viewByTarget={planner:"planner",reuse:"reuse",distribution:"setup",analytics:"analytics",broll:"setup",inventory:"setup",setup:"setup",shadow:"setup",repurpose:"setup",failures:"review",social:"review",actions:"review"};
  const clean=String(target||"").replace("#","");
  setView(viewByTarget[clean]||clean||"review");
  setTimeout(()=>document.getElementById(clean)?.scrollIntoView({behavior:"smooth",block:"start"}),0);
}
function initViews(){
  document.querySelectorAll("[data-view]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();setView(link.dataset.view)}));
  const hash=(location.hash||"#review").replace("#","");
  const allowed=new Set([...document.querySelectorAll("[data-view]")].map(link=>link.dataset.view));
  const legacy={distribution:"setup",libraries:"setup",inventory:"setup",broll:"setup"};
  const view=legacy[hash]||(allowed.has(hash)?hash:"review");
  setView(view,false);
}
function routeEntries(v, includeNo=false){const r=v.routingRecommendations||{};return Object.entries(ROUTE_LABELS).map(([key,label])=>({key,label,item:r[key]||{},rec:String(r[key]?.recommend||"no").toLowerCase()})).filter(x=>includeNo||x.rec==="yes"||x.rec==="maybe")}
function routeText(v){const entries=routeEntries(v);if(!entries.length)return "No long-form expansion";return entries.map(x=>x.label+": "+x.rec).join(", ")}
function socialStatus(v){if(v.scheduleStatusLabel&&v.scheduleStatusLabel!=="Not scheduled")return v.scheduleStatusLabel;if(v.approved)return "Approved, not scheduled";return v.availableAssets?.video?"Ready for review":"No social asset"}
function recommendedAction(v){if(v.scheduled)return v.scheduleStatusLabel||"Already scheduled";const entries=routeEntries(v);const highReuse=entries.some(x=>(x.key==="video_explainer_page"||x.key==="blog"||x.key==="websiteReuse")&&x.rec==="yes"&&String(x.item.confidence||"").toLowerCase()==="high");if(highReuse)return "Review reuse opportunity";if(v.blog&&!v.blogPage)return "Stage blog page";if(v.blogPage&&!v.blogPage.pdfPath)return "Create compliance PDF";if(v.approved&&!v.scheduled)return "Schedule approved assets";const strong=entries.some(x=>x.rec==="yes"&&String(x.item.confidence||"").toLowerCase()==="high");if(!strong&&v.availableAssets?.video)return "Review social assets";return v.availableAssets?.video?"Review social assets":"No urgent action"}
function needsDecision(v){return !v.scheduled}
function properties(){return Array.isArray(DISTRIBUTION_PROPERTIES.properties)?DISTRIBUTION_PROPERTIES.properties:[]}
function propertyByName(name){return properties().find(p=>p.name===name)||{name:name||"Talley Wealth",metricoolBrand:name||"Talley Wealth",primaryPlatforms:["instagram","facebook","linkedin","gbp","x"]}}
function normalizePlatform(value){const v=String(value||"").toLowerCase();if(v==="linkedin_showcase"||v==="linkedin_personal")return "linkedin";if(v==="google_business_profile")return "gbp";return v}
function propertyPlatforms(name){return [...new Set((propertyByName(name).primaryPlatforms||[]).map(normalizePlatform).filter(Boolean))]}
function platformLabel(key){return {instagram:"Instagram",facebook:"Facebook",linkedin:"LinkedIn",gbp:"GBP",x:"X"}[key]||key}
function routePlan(v){
  const d=v.distributionRecommendations||{};
  const primary=d.primaryProperty||"Talley Wealth";
  const secondary=Array.isArray(d.secondary)?d.secondary:[];
  const cards=[];
  if(d.schedulingReady!==false){
    cards.push({property:primary,level:"included",status:"Included by approval",reason:d.primaryReason||"Primary route.",confidence:d.confidence||"",setup:d.setup||{}});
  }
  secondary
    .filter(item=>item.level==="recommended_secondary"&&item.rewriteRequired!==true&&item.setup?.schedulingReady!==false)
    .forEach(item=>cards.push({property:item.property,level:"included",status:"Included by approval",reason:item.reason||"",confidence:item.confidence||"",setup:item.setup||{}}));
  return cards;
}
function includedRouteCards(v){return routePlan(v).filter(card=>card.level==="included"&&card.setup?.schedulingReady!==false)}
function scheduledPlatformsForRoute(v,property){const allowed=new Set(propertyPlatforms(property));const out=[];if(v.availableAssets?.video){["instagram","facebook","linkedin"].forEach(p=>{if(allowed.has(p))out.push({asset:"Video",platform:p})})}if(v.availableAssets?.carousel){["instagram","facebook","linkedin"].forEach(p=>{if(allowed.has(p))out.push({asset:"Carousel",platform:p})})}if(v.availableAssets?.gbp&&allowed.has("gbp"))out.push({asset:"GBP post",platform:"gbp"});if((v.availableAssets?.xThread||v.availableAssets?.xExtras)&&allowed.has("x"))out.push({asset:v.availableAssets?.xThread?"X thread":"X post",platform:"x"});return out}
function isOn(v,asset){return !(v.assetDecisions&&v.assetDecisions[asset]===false)}
function count(){const n=document.querySelectorAll(".card.ap").length;document.getElementById("cnt").textContent=n+" approved"}
async function approve(name,el){await post("/approve",{name,approved:el.checked});el.closest(".card").classList.toggle("ap",el.checked);const v=DATA.find(x=>x.name===name);if(v)v.approved=el.checked;renderActions();count()}
async function assetToggle(name,asset,el){await post("/asset-toggle",{name,asset,enabled:el.checked});el.closest(".asset-toggle").classList.toggle("off",!el.checked)}
async function setCover(name,sel){toast("Rendering cover...");const v=DATA.find(x=>x.name===name);const headline=v?.hook||v?.title||name;const r=await post("/cover",{name,mode:sel.value,headline});if(!r.ok){toast(r.summary||"Cover failed");return}const img=document.getElementById("cov-"+name);if(img)img.src="/media/output/"+name+"/cover.jpg?t="+Date.now();toast("Cover saved")}
async function syncMetricool(){toast("Refreshing Metricool...");const r=await post("/metricool-sync",{});toast(r.summary||"Metricool refreshed");setTimeout(()=>location.reload(),900)}
async function buildShadowReroute(){toast("Running shadow reroute...");const r=await post("/shadow-reroute",{});toast(r.summary||"Shadow reroute refreshed");setTimeout(()=>location.reload(),900)}
async function buildRepurposeSeed(){toast("Building repurpose seed plan...");const r=await post("/repurpose-seed",{});toast(r.summary||"Repurpose seed plan refreshed");setTimeout(()=>location.reload(),900)}
async function syncAnalytics(){toast("Refreshing analytics...");const r=await post("/analytics-sync",{});toast(r.summary||"Analytics refreshed");setTimeout(()=>location.reload(),900)}
async function buildSchedule(){
  toast("Generating posting plan...");
  const r=await post("/schedule",{});
  if(r.job)CURRENT_JOB=r.job;
  renderHero();
  pollScheduleJob();
  toast(r.summary||"Posting plan started");
}
async function scheduleLive(){
  toast("Scheduling approved backlog...");
  const r=await post("/schedule-live",{});
  if(r.job)CURRENT_JOB=r.job;
  renderHero();
  pollScheduleJob();
  toast(r.summary||"Scheduling started");
}
async function clearFailure(name){const r=await post("/failure-clear",{name});toast(r.summary||"Cleared");setTimeout(()=>location.reload(),500)}
async function retryFailure(name){const r=await post("/failure-retry",{name});toast(r.summary||"Retry queued");setTimeout(()=>location.reload(),700)}
async function generateBlog(name){toast("Creating blog draft...");const r=await post("/blog-generate",{name});toast(r.summary||"Blog draft created");setTimeout(()=>location.reload(),900)}
async function stageBlog(name){toast("Staging blog...");const r=await post("/stage-blog",{name});toast(r.summary||"Blog staged");setTimeout(()=>location.reload(),700)}
async function printBlogPdf(name){toast("Printing PDF...");const r=await post("/print-blog-pdf",{name});toast(r.summary||"PDF done");setTimeout(()=>location.reload(),700)}
async function generateReuse(id){toast("Generating draft...");const r=await post("/reuse-generate",{id});toast(r.summary||"Draft generated");setTimeout(()=>location.reload(),900)}
async function longformStage(id){toast("Staging preview...");const r=await post("/longform-stage",{id});toast(r.summary||"Preview staged");setTimeout(()=>location.reload(),900)}
async function blogPreview(id){
  toast("Generating resource blog preview...");
  const previewTab=window.open("about:blank","_blank");
  if(previewTab){
    previewTab.document.title="Generating resource blog preview...";
    previewTab.document.body.innerHTML='<p style="font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;padding:24px;color:#182635;">Generating resource blog preview...</p>';
  }
  const r=await post("/blog-preview",{id});
  toast(r.summary||"Resource blog preview staged");
  if(r.ok&&r.localUrl){
    if(previewTab) previewTab.location.href=r.localUrl;
    else window.open(r.localUrl,"_blank");
  }else if(previewTab){
    previewTab.document.title="Blog preview failed";
    previewTab.document.body.innerHTML='<p style="font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;padding:24px;color:#182635;">'+esc(r.summary||"Blog preview failed")+'</p>';
  }
  setTimeout(()=>location.reload(),900);
}
async function longformPdf(id){toast("Printing PDF...");const r=await post("/longform-pdf",{id});toast(r.summary||"PDF created");setTimeout(()=>location.reload(),900)}
async function longformEmailDraft(id){toast("Drafting compliance email...");const r=await post("/longform-email-draft",{id});toast(r.summary||"Email draft created");setTimeout(()=>location.reload(),900)}
async function longformMarkSent(id){toast("Saving compliance status...");const r=await post("/longform-mark-sent",{id});toast(r.summary||"Marked sent");setTimeout(()=>location.reload(),700)}
async function longformMarkReady(id){toast("Saving publish readiness...");const r=await post("/longform-mark-ready",{id});toast(r.summary||"Ready to publish");setTimeout(()=>location.reload(),700)}
async function longformPreparePublish(id){
  toast("Preparing package and queueing YouTube...");
  const r=await post("/longform-prepare-publish",{id});
  toast(r.summary||"Package prepared");
  if(r.packageUrl){
    const a=document.createElement("a");
    a.href=r.packageUrl;
    a.download="";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  setTimeout(()=>location.reload(),1100);
}
async function clearGeneratedBlogPreviews(){if(!confirm("Clear generated blog previews and reset blog cards to candidate? Source recommendations stay in the queue."))return;toast("Clearing generated blog previews...");const r=await post("/reuse-clear-blog-previews",{});toast(r.summary||"Blog previews cleared");setTimeout(()=>location.reload(),700)}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast("Copied");}catch(e){toast("Copy failed");}}
async function setReuseStatus(id,status){toast("Saving status...");const r=await post("/reuse-status",{id,status});toast(r.summary||"Saved");setTimeout(()=>location.reload(),500)}
async function setReuseCompliance(id,status){toast("Saving compliance...");const r=await post("/reuse-compliance",{id,status});toast(r.summary||"Saved");setTimeout(()=>location.reload(),500)}
async function approveBroll(name,el){const r=await post("/broll-approve",{name,approved:el.checked});if(!r.ok){el.checked=!el.checked;toast("Save failed");return}el.closest(".bcard").classList.toggle("approved",el.checked);toast(el.checked?"Saved to b-roll bank":"Removed from b-roll bank")}
async function addChat(name){const box=document.getElementById("chat-input-"+name);const message=box.value.trim();if(!message)return;toast("Saving note...");const r=await post("/chat-add",{name,message});if(!r.ok){toast(r.summary||"Chat failed");return}box.value="";const v=DATA.find(x=>x.name===name);if(v)v.chat=r.chat;renderSocial();toast("Saved")}
function chatKey(event,name){if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();addChat(name)}}
async function applySuggestion(name,messageIndex,suggestionId){toast("Applying local edit...");const r=await post("/chat-apply",{name,messageIndex,suggestionId});if(!r.ok){toast(r.summary||"Apply failed");return}toast(r.summary||"Applied");setTimeout(()=>location.reload(),900)}
async function undoSuggestion(name,messageIndex,suggestionId){toast("Restoring previous version...");const r=await post("/chat-undo",{name,messageIndex,suggestionId});if(!r.ok){toast(r.summary||"Undo failed");return}toast(r.summary||"Restored");setTimeout(()=>location.reload(),900)}
async function promotePreference(name,index){const r=await post("/chat-promote",{name,index});toast(r.summary||"Preference saved")}
function renderHero(){
  const s=ENGINE.summary||{};
  const next=s.nextPost;
  const active=DATA.filter(needsDecision).length;
  const blogs=REUSE_QUEUE.filter(i=>i.type==="blog");
  const resourceReady=blogs.filter(i=>Number(i.candidateScore||0)>=8&&!i.localPath&&!i.localUrl).length;
  const followUps=blogs.filter(i=>{const score=Number(i.candidateScore||0);const thread=i.resourceThreadStatus||i.resourceThread?.threadStatus||"";return score>=6&&score<8&&!["follow_up_recorded","ready_for_resource_preview"].includes(thread)}).length;
  const packagesReady=blogs.filter(i=>(i.localPath||i.localUrl)&&!(i.compliancePackage&&i.compliancePackage.zipPath)).length;
  const propertyCount=Object.keys(s.byProperty||{}).length;
  const queueText=next?('Next Metricool item: '+next.platformLabel+' '+formatDate(next.date)+' at '+next.time):'No Metricool post currently queued';
  const scopeText=propertyCount?(' across '+propertyCount+' properties'):'';
  document.getElementById("engine-hero").innerHTML='<div><h2>Today\\'s Content Desk</h2><p>Start with new recordings, then decide which ideas deserve Resource Publishing, a Part 2 follow-up, or a publish package. <span class="mut">'+esc(queueText+scopeText)+'.</span></p></div><div class="engine-kpis">'+
    heroKpi(active,"new recordings")+heroKpi(resourceReady,"resource-ready")+heroKpi(followUps,"follow-ups to record")+heroKpi(packagesReady,"previews to package")+heroKpi(s.scheduledThrough?formatDate(s.scheduledThrough):"-","Metricool queue through")+
  '</div>'+jobHtml();
}
function heroKpi(value,label){return '<div class="kpi"><b>'+esc(value)+'</b><span>'+esc(label)+'</span></div>'}
function jobHtml(){
  const job=CURRENT_JOB||{};
  if(!job.status||job.status==="idle")return "";
  if(job.status==="complete"&&job.completedAt&&Date.now()-new Date(job.completedAt).getTime()>10*60*1000)return "";
  const label=job.status==="complete"?"Done":job.status==="failed"?"Needs attention":"Working";
  const steps=(job.steps||[]).map(s=>'<span class="job-step '+esc(s.status||"pending")+'">'+esc(s.label||s.id||"step")+'</span>').join("");
  return '<div class="job-strip"><div class="job-top"><div>'+esc(label)+': '+esc(job.current||job.summary||"Scheduling job")+'</div><span>'+esc(job.mode==="live"?"Metricool scheduling":"Posting plan")+'</span></div>'+(steps?'<div class="job-steps">'+steps+'</div>':'')+(job.status==="failed"&&job.summary?'<p class="mut">'+esc(job.summary)+'</p>':'')+'</div>';
}
let JOB_POLL=null;
async function pollScheduleJob(){
  if(JOB_POLL)clearTimeout(JOB_POLL);
  try{
    const r=await fetch("/schedule-job");
    CURRENT_JOB=await r.json();
    renderHero();
    if(CURRENT_JOB.status==="running"){
      JOB_POLL=setTimeout(pollScheduleJob,2200);
    }else if(CURRENT_JOB.status==="complete"){
      toast(CURRENT_JOB.summary||"Scheduling complete");
      setTimeout(()=>location.reload(),900);
    }else if(CURRENT_JOB.status==="failed"){
      toast(CURRENT_JOB.summary||"Scheduling failed");
    }
  }catch(_){
    JOB_POLL=setTimeout(pollScheduleJob,3500);
  }
}
function renderActions(){
  const el=document.getElementById("actions");
  if(el)el.innerHTML="";
	}
	function actionPill(item){return '<a class="attention-pill" href="'+item.href+'" onclick="event.preventDefault();jumpTo(\\''+esc(item.href)+'\\')"><strong>'+item.count+'</strong><span>'+esc(item.label)+'</span></a>'}
function renderFailures(){
  const el=document.getElementById("failures");
  if(!FAILED_QUEUE.length){el.innerHTML="";return}
  const cards=FAILED_QUEUE.map(f=>{
    const facts=[
      ["Source",f.sourceName||f.source||""],
      ["Length",f.duration||""],
      ["Size",f.sourceSize||""],
      ["Frame",f.dimensions||""],
      ["Modified",f.sourceModified||""]
    ].filter(x=>x[1]).map(x=>'<div class="failure-fact"><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join("");
    const artifacts=(f.partials||[]).map(p=>/^(output|work\\/\\.failed-output)\\//.test(String(p.path||""))?'<a href="/media/'+esc(p.path)+'" target="_blank">'+esc(p.label)+'</a>':'<span>'+esc(p.label)+'</span>').join("");
    return '<div class="reuse-card failure-card">'+
      (f.thumbnail?'<img class="failure-thumb" src="/media/'+esc(f.thumbnail)+'" alt="">':'<div class="failure-thumb"></div>')+
      '<div><h4>'+esc(f.name)+'</h4><div class="reuse-meta"><span class="chip">'+esc(f.status)+'</span> '+esc(f.time||"")+'</div>'+
      '<p>'+esc(f.message||"Needs attention")+'</p>'+
      (facts?'<div class="failure-facts">'+facts+'</div>':'')+
      (artifacts?'<div class="artifact-list">'+artifacts+'</div>':'<div class="mut">No partial artifacts found yet.</div>')+
      (f.transcriptSnippet?'<div class="failure-snippet"><strong>Transcript clue:</strong> '+esc(f.transcriptSnippet)+'...</div>':'')+
      (f.source?'<div class="pathline">Source kept: '+esc(f.source)+(f.sourceExists?'':' (not found)')+'</div>':'')+
      (f.rawLog?'<details><summary>Technical log</summary><pre>'+esc(f.rawLog)+'</pre></details>':'')+
      '<div class="reuse-actions"><button class="btn small" onclick="retryFailure(\\''+esc(f.name)+'\\')">Retry</button><button class="btn small subtle" onclick="clearFailure(\\''+esc(f.name)+'\\')">Clear alert</button></div></div></div>';
  }).join("");
  el.innerHTML='<div class="section-head"><h2>Failed Uploads</h2><p>Identify the source clip, see what partial work survived, then retry or clear the alert.</p></div><div class="reuse-grid">'+cards+'</div>';
}
function renderSocial(){
  document.getElementById("meta").textContent=DATA.length+" videos";
  const active=DATA.filter(v=>SHOW_COMPLETED||needsDecision(v));
  const cards=active.map(renderVideoCard).join("");
  const completed=DATA.length-active.length;
  document.getElementById("social").innerHTML='<div class="section-head"><h2>New Recordings Ready</h2><p>Review the recommended home, included destinations, and checked asset types before approving the short-form schedule.</p><span class="sp"></span>'+(completed?'<button class="btn small subtle" onclick="SHOW_COMPLETED=!SHOW_COMPLETED;renderSocial()">'+(SHOW_COMPLETED?'Hide scheduled/handled':'Show scheduled/handled')+' ('+completed+')</button>':'')+'</div>'+
    (cards||'<div class="empty-state">No new recordings need a decision. You can stop here.</div>');
  count();
}
function renderScheduledRerouteReview(){
  const s=SHADOW_REROUTE.summary||{};
  const groups=(Array.isArray(SHADOW_REROUTE.groups)?SHADOW_REROUTE.groups:[]).filter(g=>Number(g.movePosts||0)>0);
  const generated=SHADOW_REROUTE.generatedAt?formatDateTime(SHADOW_REROUTE.generatedAt):"not run yet";
  const links='<a class="btn small subtle" href="/media/work/metricool-shadow-reroute.md" target="_blank">Open report</a><a class="btn small subtle" href="/media/work/metricool-shadow-reroute.csv" target="_blank">Open CSV</a>';
  const cards=groups.map(renderRerouteCard).join("");
  return '<section class="section"><div class="section-head"><h2>Already Scheduled, Worth Moving</h2><p>These are future Metricool posts shown the way they would route if they entered the engine today. Read-only for now.</p><span class="sp"></span>'+links+'</div>'+
    '<div class="planner-summary"><span class="chip">'+esc(s.moveCandidates||0)+' move candidates</span><span class="chip">'+esc(s.keepAsIs||0)+' keep as-is</span><span class="chip">'+esc(s.platformGaps||0)+' platform gaps</span><span class="chip">'+esc(s.manualReview||0)+' manual review</span><span class="chip">Generated '+esc(generated)+'</span></div>'+
    (cards||'<div class="empty-state">No already-scheduled posts need a routing decision right now.</div>')+'</section>';
}
function renderRerouteCard(group){
  const rows=(SHADOW_REROUTE.rows||[]).filter(row=>row.sourceVideo===group.sourceVideo);
  const moveRows=rows.filter(row=>row.canMoveThisPost);
  const gapRows=rows.filter(row=>row.decision==="leave_alone_platform_gap");
  const v=DATA.find(item=>item.name===group.sourceVideo);
  const affected=[...new Set(moveRows.map(row=>row.platformLabel+" "+formatAsset(row.asset)).filter(Boolean))];
  const platformChips=affected.length?affected.map(item=>'<span class="platform-pill">'+esc(item)+'</span>').join(""):'<span class="platform-pill">No supported posts to move</span>';
  const current=Array.isArray(group.currentProperties)?group.currentProperties.join(", "):"Talley Wealth";
  const details=rows.length?'<details><summary>Scheduled post details</summary><div class="reroute-post-list">'+rows.slice(0,16).map(reroutePostRow).join("")+(rows.length>16?'<p class="mut">Showing 16 of '+esc(rows.length)+' scheduled posts. Open the CSV for the full list.</p>':'')+'</div></details>':'';
  return '<article class="card reroute-card" id="reroute-'+esc(group.sourceVideo||group.key)+'">'+
    '<div class="card-head"><h3>'+esc(group.title||group.sourceVideo||"Scheduled content")+'</h3><span class="tag">'+esc(group.sourceVideo||"matched source")+'</span><span class="tag">Already scheduled</span><span class="tag">Read-only review</span></div>'+
    '<div class="route-callout"><div><b>Recommended routing now</b><strong>'+esc(group.recommendedPrimary||"")+'</strong><span class="chip">'+esc(group.movePosts||0)+' supported posts to move</span></div><div class="route-lines"><div class="line"><span>Current schedule:</span> '+esc(current)+' · '+esc(group.scheduledPosts||0)+' future posts.</div><div class="line"><span>Meaning:</span> if this entered the engine today, supported assets would route to '+esc(group.recommendedPrimary||"the recommended destination")+'. Unsupported platforms stay where they are for now.</div></div></div>'+
    '<div class="destination-plan"><div class="destination-card optional"><div class="route-status">Current schedule</div><h4>'+esc(current)+'</h4><p>'+esc(group.scheduledPosts||0)+' future posts are already sitting here.</p><div class="destination-meta"><span class="chip">'+esc(group.keepPosts||0)+' keep</span><span class="chip">'+esc(group.unsupportedPosts||0)+' platform gap</span></div></div>'+
    '<div class="destination-card included"><div class="route-status">Recommended move</div><h4>'+esc(group.recommendedPrimary||"")+'</h4><p>'+esc(group.routeReason||group.reason||"")+'</p><div class="destination-meta"><span class="chip">'+esc(group.routeConfidence||"")+' confidence</span><span class="chip">'+esc(group.movePosts||0)+' move</span></div><div class="platform-list">'+platformChips+'</div></div></div>'+
    '<div class="reroute-summary"><div><b>Suggested action</b><span>'+esc(group.actionLabel||"Review")+'</span></div><div><b>Dates</b><span>'+esc(formatRerouteDates(group))+'</span></div><div><b>Platforms</b><span>'+esc((group.platforms||[]).join(", "))+'</span></div></div>'+
    (v?'<details><summary>Source review details</summary>'+rerouteSourceDetails(v)+'</details>':'')+
    details+
    '</article>';
}
function rerouteSourceDetails(v){
  const social=Object.entries(v.social||{}).filter(([k])=>!/^YouTube/i.test(k)).slice(0,5).map(([k,t])=>'<details><summary>'+esc(k)+'</summary><pre>'+esc(t)+'</pre></details>').join("");
  return '<div class="row"><div>'+mediaHtml(v)+'</div><div>'+(social||'<p class="mut">No social copy found for this source.</p>')+routingCompactHtml(v)+'</div></div>';
}
function reroutePostRow(row){
  const cls=row.canMoveThisPost?"move":row.decision==="leave_alone_platform_gap"?"gap":"keep";
  return '<div class="reroute-post-row '+cls+'"><div>'+esc(formatDate(row.date))+'<br><span class="mut">'+esc(formatClock(row.time))+'</span></div><div><span class="platform-dot '+esc(row.platform||"")+'"></span> '+esc(row.platformLabel||"")+'<br><span class="mut">'+esc(formatAsset(row.asset))+'</span></div><div><strong>'+esc(row.actionLabel||"")+'</strong><br>'+esc(row.reason||"")+'</div></div>';
}
function formatAsset(asset){return {video:"Video",carousel:"Carousel",gbp:"GBP",x_thread:"X thread"}[asset]||String(asset||"Post").replace(/_/g," ")}
function formatRerouteDates(group){return group.firstDate&&group.lastDate?formatDate(group.firstDate)+" to "+formatDate(group.lastDate):"dates unknown"}
function renderRepurposeSeeds(){
  const s=REPURPOSE_SEEDS.summary||{};
  const cards=Array.isArray(REPURPOSE_SEEDS.cards)?REPURPOSE_SEEDS.cards:[];
  const generated=REPURPOSE_SEEDS.generatedAt?formatDateTime(REPURPOSE_SEEDS.generatedAt):"not run yet";
  const links='<a class="btn small subtle" href="/media/work/repurpose-seed-plan.md" target="_blank">Open seed plan</a><a class="btn small subtle" href="/media/work/repurpose-seed-plan.csv" target="_blank">Open CSV</a>';
  return '<section class="section"><div class="section-head"><h2>Repurpose Seeds for New Accounts</h2><p>Destination-specific rewrites from existing source videos. These are new variants, not re-records and not live scheduled posts.</p><span class="sp"></span>'+links+'</div>'+
    '<div class="planner-summary"><span class="chip">'+esc(s.totalCards||0)+' source cards</span><span class="chip">'+esc(s.totalDrafts||0)+' rewritten drafts</span><span class="chip">'+esc((s.byTarget&&s.byTarget["Retire With Talley"])||0)+' Retire</span><span class="chip">'+esc((s.byTarget&&s.byTarget["Talley Tax"])||0)+' Tax</span><span class="chip">'+esc((s.byTarget&&s.byTarget["David Talley Personal"])||0)+' David</span><span class="chip">Generated '+esc(generated)+'</span></div>'+
    (cards.length?cards.map(renderSeedCard).join(""):'<div class="empty-state">No repurpose seed plan yet. Refresh repurpose seeds to generate destination-specific drafts.</div>')+'</section>';
}
function renderSeedCard(card){
  const v=DATA.find(item=>item.name===card.sourceVideo);
  const draftChips=(card.drafts||[]).map(d=>'<span class="platform-pill">'+esc(d.platformLabel)+' · '+esc(d.assetSuggestion)+'</span>').join("");
  return '<article class="card seed-card" id="seed-'+esc(card.id)+'">'+
    '<div class="card-head"><h3>'+esc(card.title||card.sourceVideo)+'</h3><span class="tag">'+esc(card.sourceVideo||"source")+'</span><span class="tag">'+esc(card.targetProperty||"target")+'</span><span class="tag">'+esc(card.priority||"review")+' priority</span></div>'+
    '<div class="route-callout"><div><b>Repurpose for</b><strong>'+esc(card.targetProperty||"")+'</strong><span class="chip">'+esc((card.drafts||[]).length)+' rewritten drafts</span></div><div class="route-lines"><div class="line"><span>Use:</span> '+esc(card.suggestedUse||"")+'</div><div class="line"><span>Not a re-video:</span> use the existing source asset with destination-specific copy and framing.</div></div></div>'+
    '<div class="destination-plan"><div class="destination-card included"><div class="route-status">New variants</div><h4>'+esc(card.targetProperty||"")+'</h4><p>'+esc(card.routeReason||card.angle||"")+'</p><div class="destination-meta"><span class="chip">'+esc(card.routeConfidence||"")+' confidence</span><span class="chip">'+esc(card.relationshipToMoveReview||"new variants")+'</span></div><div class="platform-list">'+draftChips+'</div></div></div>'+
    '<div class="draft-list">'+(card.drafts||[]).map(seedDraftCard).join("")+'</div>'+
    (v?'<details><summary>Source review details</summary>'+rerouteSourceDetails(v)+'</details>':'')+
    '</article>';
}
function seedDraftCard(draft){return '<div class="draft-card"><h4>'+esc(draft.platformLabel)+' · '+esc(draft.assetSuggestion)+'</h4><pre>'+esc(draft.text||"")+'</pre><p class="mut">'+esc(draft.complianceNote||"")+'</p></div>'}
function renderPlanner(){
  const planner=plannerItems().filter(p=>PLANNER_PROPERTY==="all"||(p.property||"Talley Wealth")===PLANNER_PROPERTY);
  const summary=ENGINE.summary||{};
  const tools='<div class="planner-tools"><div class="planner-tabs"><button class="'+(PLANNER_MODE==="week"?"active":"")+'" onclick="setPlannerMode(\\'week\\')">Week</button><button class="'+(PLANNER_MODE==="agenda"?"active":"")+'" onclick="setPlannerMode(\\'agenda\\')">Agenda</button><button class="'+(PLANNER_MODE==="platform"?"active":"")+'" onclick="setPlannerMode(\\'platform\\')">Platform</button></div>'+plannerPropertyTabs()+'<button class="btn small subtle" onclick="syncMetricool()">Refresh Metricool</button><span class="chip">'+esc(summary.metricool||0)+' in Metricool</span><span class="chip">'+esc(summary.localOnly||0)+' local only</span><span class="chip">'+esc(summary.failed||0)+' failed</span></div>';
  if(!planner.length){document.getElementById("planner").innerHTML='<div class="section-head"><h2>Planner</h2><p>Week calendar for scheduled social posts.</p></div>'+tools+'<div class="empty-state">No planner items found yet. Generate a posting plan, then refresh Metricool.</div>';return}
  const week=plannerWeek(planner);
  const weekPosts=planner.filter(p=>week.dates.includes(p.date)).sort(plannerSort);
  if(!PLANNER_SELECTED_ID&&weekPosts[0])PLANNER_SELECTED_ID=weekPosts[0].plannerId;
  const sourceNote=ENGINE.sourceFiles?.metricoolList?'Metricool planner list synced locally.':'Metricool list has not been synced yet.';
  const body=PLANNER_MODE==="agenda"?renderPlannerAgenda(weekPosts):PLANNER_MODE==="platform"?renderPlannerPlatform(weekPosts):renderPlannerWeek(week,weekPosts);
  const weekNav='<span class="week-nav"><button class="icon-btn" aria-label="Previous week" title="Previous week" onclick="changePlannerWeek(-1)">‹</button><span class="week-range">'+esc(formatDate(week.dates[0]))+' to '+esc(formatDate(week.dates[6]))+'</span><button class="icon-btn" aria-label="Next week" title="Next week" onclick="changePlannerWeek(1)">›</button></span>';
  document.getElementById("planner").innerHTML='<div class="section-head"><div class="calendar-title"><h2>Planner</h2>'+weekNav+'</div><p>Scheduled social posts.</p></div>'+tools+'<div class="planner-summary">'+plannerSummary(week,weekPosts)+'</div><div class="calendar-legend">'+plannerLegend()+'</div><div class="empty-state">'+esc(sourceNote)+' Last synced: '+esc(formatDateTime(ENGINE.generatedAt))+'</div><div class="planner-layout"><div>'+body+'</div><aside class="planner-inspector" id="planner-inspector">'+plannerInspector(weekPosts)+'</aside></div>';
}
function plannerPostCard(p){
  const cls=statusClass(p);
  const title=p.sourceTitle||p.sourceVideo||p.asset||p.platformLabel||"Post";
  const active=PLANNER_SELECTED_ID===p.plannerId?"active":"";
  const mark=statusMark(p);
  return '<button class="calendar-chip '+cls+' '+active+'" onclick="selectPlannerPost(\\''+esc(p.plannerId)+'\\')" title="'+esc(statusText(p))+'"><span class="chip-line"><span class="platform-dot '+esc(p.platform||"")+'"></span><span class="chip-title">'+esc(title)+'</span><span class="status-mark">'+esc(mark)+'</span></span><span class="chip-format">'+esc(formatLabel(p))+' · '+esc(p.property||"Talley Wealth")+'</span></button>';
}
function plannerItems(){
  const raw=Array.isArray(ENGINE.planner)?ENGINE.planner:[];
  const groups=new Map();
  for(const item of raw){
    const key=item.asset==="x_thread"&&item.ledgerKey?item.ledgerKey:(item.id||item.ledgerKey||[item.date,item.time,item.platform,item.sourceVideo,item.asset].join("|"));
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(item);
  }
  return [...groups.entries()].map(([key,items])=>{
    const primary=items.find(i=>Number(i.descendantCount)>0)||items.sort(plannerSort)[0]||{};
    const replies=Math.max(Number(primary.descendantCount)||0,items.length-1);
    return {...primary,plannerId:encodePlannerId(key),threadItems:items.sort(plannerSort),replyCount:replies};
  }).sort(plannerSort);
}
function encodePlannerId(value){return btoa(unescape(encodeURIComponent(String(value)))).replace(/=+$/,"").replace(/\\+/g,"-").replace(/\\//g,"_")}
function plannerSort(a,b){return String(a.date||"").localeCompare(String(b.date||""))||String(a.time||"").localeCompare(String(b.time||""))||String(a.platformLabel||"").localeCompare(String(b.platformLabel||""))}
function plannerWeek(planner){
  const base=new Date();
  base.setHours(12,0,0,0);
  const day=(base.getDay()+6)%7;
  base.setDate(base.getDate()-day+(PLANNER_WEEK_OFFSET*7));
  const dates=[];
  for(let i=0;i<7;i++){const d=new Date(base);d.setDate(base.getDate()+i);dates.push(d.toISOString().slice(0,10))}
  return {dates};
}
function renderPlannerWeek(week,posts){
  const today=todayIso();
  const bounds=plannerTimeBounds(posts);
  const height=(bounds.end-bounds.start)*bounds.hourHeight;
  const head='<div class="calendar-corner"></div>'+week.dates.map(d=>'<div class="week-head '+(d===today?'today':'')+'">'+esc(formatDate(d))+(d===today?'<span class="today-label">Today</span>':'')+'</div>').join("");
  const axis='<div class="time-axis" style="height:'+height+'px">'+hourMarks(bounds,true)+'</div>';
  const days=week.dates.map(date=>{
    const items=posts.filter(p=>p.date===date).sort(plannerSort);
    return '<div class="calendar-day '+(date===today?'today':'')+'" style="height:'+height+'px">'+hourMarks(bounds,false)+items.map((p,index)=>timedPlannerPostCard(p,index,items,bounds)).join("")+'</div>';
  }).join("");
  return '<div class="calendar-shell"><div class="calendar-board">'+head+axis+days+'</div></div>';
}
function plannerTimeBounds(posts){
  const hours=posts.map(p=>Number(String(p.time||"").slice(0,2))).filter(n=>Number.isFinite(n));
  const min=hours.length?Math.min(...hours):8;
  const max=hours.length?Math.max(...hours):18;
  return {start:Math.max(6,Math.min(8,min-1)),end:Math.min(23,Math.max(18,max+2)),hourHeight:72};
}
function hourMarks(bounds,labels){
  let out="";
  for(let h=bounds.start;h<=bounds.end;h++){
    const top=(h-bounds.start)*bounds.hourHeight;
    out+='<div class="hour-line" style="top:'+top+'px"></div>';
    if(labels&&h<bounds.end)out+='<div class="axis-label" style="top:'+top+'px">'+esc(formatClock(String(h).padStart(2,"0")+":00"))+'</div>';
  }
  return out;
}
function timedPlannerPostCard(p,index,items,bounds){
  const top=plannerMinuteTop(p.time,bounds)+sameTimeOffset(p,index,items);
  return plannerPostCard(p).replace('class="calendar-chip ','style="top:'+top+'px" class="calendar-chip timed-chip ');
}
function plannerMinuteTop(time,bounds){
  const m=String(time||"08:00").match(/^(\\d{1,2}):(\\d{2})/);
  if(!m)return 0;
  const mins=(Number(m[1])-bounds.start)*60+Number(m[2]);
  return Math.max(0,Math.round((mins/60)*bounds.hourHeight));
}
function sameTimeOffset(p,index,items){
  const sameBefore=items.slice(0,index).filter(item=>(item.time||"")==(p.time||"")).length;
  return sameBefore*44;
}
function plannerLegend(){
  return '<span><span class="platform-dot instagram"></span>Instagram</span><span><span class="platform-dot facebook"></span>Facebook</span><span><span class="platform-dot linkedin"></span>LinkedIn</span><span><span class="platform-dot gbp"></span>GBP</span><span><span class="platform-dot x"></span>X</span><span><i class="legend-status"></i>Scheduled</span><span><i class="legend-status published"></i>Published</span><span><i class="legend-status local"></i>Local only</span><span><i class="legend-status failed"></i>Failed</span>';
}
function renderPlannerAgenda(posts){
  const rows=posts.map(p=>'<div class="agenda-row"><div>'+esc(formatDate(p.date))+'<br><span class="mut">'+esc(formatClock(p.time))+'</span></div><div><span class="platform-dot '+esc(p.platform||"")+'"></span> '+esc(shortPlatform(p.platformLabel))+'</div><button class="calendar-chip '+statusClass(p)+' '+(PLANNER_SELECTED_ID===p.plannerId?'active':'')+'" onclick="selectPlannerPost(\\''+esc(p.plannerId)+'\\')"><span class="chip-title">'+esc(p.sourceTitle||p.sourceVideo||"Post")+'</span></button><div>'+esc(formatLabel(p))+'</div></div>').join("");
  return '<div class="agenda-list">'+(rows||'<div class="empty-state">No posts this week.</div>')+'</div>';
}
function renderPlannerPlatform(posts){
  const groups=groupByArray(posts,p=>p.platformLabel||"Unknown");
  return '<div class="platform-board">'+groups.map(([platform,items])=>'<div class="platform-column"><h3>'+esc(platform)+' ('+items.length+')</h3>'+items.sort(plannerSort).map(plannerPostCard).join("")+'</div>').join("")+'</div>';
}
function plannerSummary(week,posts){
  const postUnits=posts.reduce((sum,p)=>sum+(p.asset==="x_thread"?(p.replyCount||0)+1:1),0);
  const videos=posts.filter(p=>p.asset==="video").length;
  const carousels=posts.filter(p=>p.asset==="carousel").length;
  const xPosts=posts.filter(p=>p.platform==="x").reduce((sum,p)=>sum+(p.replyCount||0)+1,0);
  const sourceVideos=new Set(posts.map(p=>p.sourceVideo).filter(Boolean)).size;
  const emptyDays=week.dates.filter(d=>!posts.some(p=>p.date===d)).length;
  return [postUnits+" posts",sourceVideos+" source videos",videos+" videos",carousels+" carousels",xPosts+" X posts",emptyDays+" empty days"].map(x=>'<span class="chip">'+esc(x)+'</span>').join("");
}
function plannerInspector(posts){
  const item=posts.find(p=>p.plannerId===PLANNER_SELECTED_ID)||posts[0];
  if(!item)return '<h3>No post selected</h3><p>Select a calendar item to inspect it.</p>';
  const thread=(item.threadItems||[]).map((p,i)=>(i+1)+'. '+(p.text||"")).join("\\n\\n");
  return '<h3>'+esc(item.sourceTitle||item.sourceVideo||"Post")+'</h3><p><span class="platform-dot '+esc(item.platform||"")+'"></span> '+esc(item.platformLabel||"")+' · '+esc(formatLabel(item))+'</p><p>Property: '+esc(item.property||"Talley Wealth")+'</p><p><b>'+esc(formatDate(item.date))+' '+esc(formatClock(item.time))+'</b></p><p>Status: '+esc(statusText(item))+'</p><p>Source: '+esc(item.sourceVideo||"-")+'</p><pre>'+esc(thread||item.text||"No caption text in local snapshot.")+'</pre>';
}
function selectPlannerPost(id){PLANNER_SELECTED_ID=id;renderPlanner()}
function changePlannerWeek(delta){PLANNER_WEEK_OFFSET+=delta;PLANNER_SELECTED_ID="";renderPlanner()}
function setPlannerMode(mode){PLANNER_MODE=mode;renderPlanner()}
function setPlannerProperty(property){PLANNER_PROPERTY=property;PLANNER_SELECTED_ID="";renderPlanner()}
function plannerPropertyTabs(){
  const names=["all",...properties().map(p=>p.name)];
  return '<div class="planner-tabs">'+names.map(name=>'<button class="'+(PLANNER_PROPERTY===name?'active':'')+'" onclick="setPlannerProperty(\\''+esc(name)+'\\')">'+esc(name==="all"?"All":shortProperty(name))+'</button>').join("")+'</div>';
}
function shortProperty(name){return {"Talley Wealth":"Wealth","Talley Tax":"Tax","Retire With Talley":"Retire","David Talley Personal":"David"}[name]||name}
function todayIso(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
function groupByArray(items,fn){const map=new Map();for(const item of items){const key=fn(item);if(!map.has(key))map.set(key,[]);map.get(key).push(item)}return [...map.entries()]}
function shortPlatform(label){return {"Google Business Profile":"GBP","Instagram":"IG","LinkedIn":"LI","Facebook":"FB"}[label]||label||"?"}
function formatLabel(p){const base={video:"Video",carousel:"Carousel",gbp:"GBP post",x_thread:"X thread",x_extra:"X post",xExtras:"X posts",xThread:"X thread",blog:"Blog"}[p.asset]||p.asset||"Post";return p.asset==="x_thread"&&p.replyCount?base+" · "+((p.replyCount||0)+1)+" posts":base}
function statusMark(p){if(statusClass(p)==="failed")return "!";if(statusClass(p)==="published")return "✓";if(p.source==="local")return "local";return ""}
function statusClass(p){if(/fail|error|reject/i.test(String(p.providerStatus)+" "+String(p.detailedStatus)))return "failed";if(/published|publicado|sent|done/i.test(String(p.providerStatus)+" "+String(p.detailedStatus)))return "published";if(p.source==="local"||/LOCAL_ONLY|CREATED_NOT_IN_LIST/i.test(String(p.providerStatus)))return "local";return ""}
function statusText(p){if(p.source==="local")return p.providerStatus==="CREATED_NOT_IN_LIST"?"created, not listed":"local only";if(p.draft)return "Metricool draft";if(p.detailedStatus)return p.detailedStatus;if(p.providerStatus)return p.providerStatus;return p.autoPublish?"scheduled":"listed"}
function formatClock(value){
  const m=String(value||"").match(/^(\\d{1,2}):(\\d{2})/);
  if(!m)return value||"";
  let h=Number(m[1]);const min=m[2];const suffix=h>=12?"PM":"AM";h=h%12||12;
  return min==="00"?h+" "+suffix:h+":"+min+" "+suffix;
}
function renderSetup(){
  const shadow=SHADOW_REROUTE.summary||{};
  const seeds=REPURPOSE_SEEDS.summary||{};
  document.getElementById("setup-overview").innerHTML='<div class="section-head"><h2>Reports & Setup</h2><p>Advanced tools, migration reports, setup ledgers, libraries, and inventory. These are intentionally out of the daily Today flow.</p></div>'+
    '<div class="setup-grid">'+
    '<div class="setup-card"><h3>Scheduled migration report</h3><p class="mut">Read-only shadow reroute for already-scheduled Metricool posts.</p><div class="planner-summary"><span class="chip">'+esc(shadow.moveCandidates||0)+' move candidates</span><span class="chip">'+esc(shadow.keepAsIs||0)+' keep as-is</span></div><button class="btn small" onclick="buildShadowReroute()">Refresh scheduled review</button></div>'+
    '<div class="setup-card"><h3>Repurpose seeds</h3><p class="mut">Destination-specific rewrites for filling newer accounts from existing source videos.</p><div class="planner-summary"><span class="chip">'+esc(seeds.totalCards||0)+' source cards</span><span class="chip">'+esc(seeds.totalDrafts||0)+' drafts</span></div><button class="btn small" onclick="buildRepurposeSeed()">Refresh repurpose seeds</button></div>'+
    '<div class="setup-card"><h3>Distribution setup</h3><p class="mut">Social surfaces, Smarsh status, Metricool connections, and setup packets.</p><a class="btn small subtle" href="#distribution" onclick="event.preventDefault();jumpTo(\\'distribution\\')">Jump to setup ledger</a></div>'+
    '<div class="setup-card"><h3>Libraries and inventory</h3><p class="mut">B-roll, quote reels, audio beds, and source/content audit trail.</p><a class="btn small subtle" href="#broll" onclick="event.preventDefault();jumpTo(\\'broll\\')">Open libraries</a><a class="btn small subtle" href="#inventory" onclick="event.preventDefault();jumpTo(\\'inventory\\')">Open inventory</a></div>'+
    '</div>';
  document.getElementById("shadow-reroute").innerHTML=renderScheduledRerouteReview();
  document.getElementById("repurpose-seeds").innerHTML=renderRepurposeSeeds();
}
function renderDistribution(){
  const summary=(SOCIAL_SURFACES.summary||[]).map(item=>'<div class="perf-card"><h3>'+esc(item.property)+'</h3><div class="health-kpis">'+heroKpi(item.readyish||0,"ready-ish")+heroKpi(item.blockers||0,"to finish")+heroKpi(item.total||0,"surfaces")+'</div>'+(item.nextActions?.length?'<p class="mut">'+esc(item.nextActions.join(" | "))+'</p>':'')+'</div>').join("");
  const rows=(SOCIAL_SURFACES.rows||[]).map(row=>'<tr><td>'+esc(row.property)+'</td><td>'+esc(row.platform)+'</td><td>'+esc(row.surface_type)+'</td><td>'+esc(row.target_name_or_handle)+'</td><td>'+esc(row.status)+'</td><td>'+esc(row.smarsh_status)+'</td><td>'+esc(row.metricool_status)+'</td><td>'+(row.setupPacket?'<a class="btn small subtle" href="/media/'+esc(row.setupPacket)+'" target="_blank">Open</a>':'')+'</td><td>'+esc(row.next_action)+'</td></tr>').join("");
  document.getElementById("distribution").innerHTML='<div class="section-head"><h2>Distribution Setup</h2><p>Destination surfaces first, Metricool second, routing third. Starter posts stay held until Smarsh and Metricool are ready.</p></div>'+
    '<div class="planner-summary"><a class="btn small" href="/media/SOCIAL-SURFACE-ACTION-PACKET.md" target="_blank">Open launch packet</a><a class="btn small subtle" href="/media/social-setup-payloads/metricool-brand-setup.md" target="_blank">Metricool setup packet</a></div>'+
    '<div class="performance-grid">'+(summary||'<div class="empty-state">No social-surface ledger found yet.</div>')+'</div>'+
    '<div class="table-wrap"><table><thead><tr><th>Property</th><th>Platform</th><th>Surface</th><th>Name / Handle</th><th>Status</th><th>Smarsh</th><th>Metricool</th><th>Packet</th><th>Next action</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function renderAnalytics(){
  const analytics=ENGINE.analytics||{};
  const perf=ENGINE.performance||{};
  const summary=ENGINE.summary||{};
  const platformRows=barRows(summary.byPlatform||{});
  const responses=Array.isArray(analytics.responses)?analytics.responses:[];
  const metrics=Array.isArray(analytics.metrics)?analytics.metrics:[];
  const checks=Array.isArray(analytics.connectionChecks)?analytics.connectionChecks:[];
  const responseRows=responses.map(r=>'<tr><td>'+esc(r.status)+'</td><td>'+esc(r.endpoint||r.url||"")+'</td><td>'+esc(r.shape?.kind||"")+'</td><td>'+esc((r.shape?.keys||[]).join(", ")||r.shape?.rows||r.shape?.dataRows||"")+'</td></tr>').join("");
  const checkRows=checks.map(c=>'<tr><td>'+esc(c.label)+'</td><td>'+esc(c.ok?"available":"limited / unavailable")+'</td><td>'+esc((c.scopes||[]).join(", "))+'</td><td>'+esc(c.message||"")+'</td></tr>').join("");
  const gbpCheck=checks.find(c=>/google business|gmb|gbp/i.test((c.label||"")+" "+(c.scopes||[]).join(" ")));
  const sourceStatus='<div class="planner-summary"><span class="chip">Website page views: needs GA4/Search Console feed</span><span class="chip">GBP views: '+esc(gbpCheck?.ok?"endpoint available, not charted yet":"not connected yet")+'</span></div>';
  const configured=analytics.status&&analytics.status!=="not_configured"&&metrics.length;
  const cards=metrics.map(metricCard).join("");
  const dashboard=configured?analyticsDashboard(metrics,analytics.summary||{},perf,summary):"";
  document.getElementById("analytics").innerHTML='<div class="section-head"><h2>Analytics</h2><p>Verified Metricool social analytics are syncing here. Website page views and GBP views should be added as separate source feeds before blog volume scales.</p><span class="sp"></span><button class="btn small subtle" onclick="syncAnalytics()">Refresh analytics</button></div>'+
    sourceStatus+
    (configured?'<div class="planner-summary"><span class="chip">'+esc(analytics.status)+'</span><span class="chip">'+esc(formatDateRangeText(analytics.range))+'</span><span class="chip">'+esc(formatDateTime(analytics.generatedAt))+'</span></div>'+dashboard+'<details><summary>All synced metrics</summary><div class="metric-grid">'+cards+'</div></details>':'<div class="empty-state">'+esc(analytics.reason||"Analytics are not configured yet.")+'</div>')+
    '<div class="performance-grid"><div class="perf-card"><h3>Publishing consistency</h3><div class="health-kpis">'+heroKpi(perf.publishedCount||0,"published")+heroKpi(perf.pendingCount||0,"pending")+heroKpi(perf.failedCount||0,"failed")+'</div></div><div class="perf-card"><h3>Scheduled by platform</h3>'+platformRows+'</div></div>'+
    (checkRows?'<details open><summary>Platform analytics availability</summary><div class="table-wrap"><table><thead><tr><th>Platform</th><th>Status</th><th>Scopes</th><th>What it means</th></tr></thead><tbody>'+checkRows+'</tbody></table></div></details>':'')+
    '<details><summary>Analytics endpoint evidence</summary><div class="table-wrap"><table><thead><tr><th>Status</th><th>Endpoint</th><th>Shape</th><th>Rows</th></tr></thead><tbody>'+responseRows+'</tbody></table></div></details>';
}
function analyticsDashboard(metrics,analyticsSummary,perf,plannerSummary){
  const byKey=Object.fromEntries(metrics.map(m=>[m.key,m]));
  const igFollowers=byKey.instagram_followers;
  const fbFollowers=byKey.facebook_followers;
  const totalAudience=(Number(igFollowers?.value)||0)+(Number(fbFollowers?.value)||0);
  const igEng=(Number(byKey.instagram_interactions?.value)||0)+(Number(byKey.instagram_reel_interactions?.value)||0);
  const fbEng=Number(analyticsSummary?.facebookEngagementActions)||0;
  const views=(Number(byKey.instagram_post_views?.value)||0)+(Number(byKey.instagram_reel_views?.value)||0)+(Number(byKey.facebook_views?.value)||0);
  const reach=(Number(byKey.instagram_post_reach?.value)||0)+(Number(byKey.facebook_page_visits?.value)||0);
  const publishingTotal=Number(plannerSummary?.total)||0;
  return '<div class="analytics-hero">'+
    analyticsTile("Total audience",totalAudience,"Instagram + Facebook followers")+
    analyticsTile("Attention",views||reach,(views?"views across verified endpoints":"reach / page visits"))+
    analyticsTile("Engagement",igEng+fbEng,"likes, saves, comments, shares, clicks")+
    analyticsTile("Scheduled",publishingTotal,"posts currently in Metricool")+
  '</div><div class="chart-grid">'+
    chartCard("Audience trend","Follower direction is the slow, durable signal.",lineChart(igFollowers?.recent||[],{label:"Instagram",value:igFollowers?.value})+lineChart(fbFollowers?.recent||[],{label:"Facebook",value:fbFollowers?.value,compact:true}))+
    chartCard("Engagement by platform","This is the early read on whether the content is landing.",barChart([{label:"Instagram",value:igEng},{label:"Facebook",value:fbEng}]))+
    chartCard("Content output","Volume matters only if quality stays high, but this shows the engine is moving.",barChart([{label:"IG posts",value:byKey.instagram_posts?.value},{label:"IG reels",value:byKey.instagram_reels?.value},{label:"FB posts",value:byKey.facebook_posts?.value},{label:"Scheduled",value:publishingTotal}]))+
    chartCard("Attention quality","Useful for seeing whether views/reach are starting to follow consistency.",barChart([{label:"IG post reach",value:byKey.instagram_post_reach?.value},{label:"IG reel views",value:byKey.instagram_reel_views?.value},{label:"FB page visits",value:byKey.facebook_page_visits?.value},{label:"FB views",value:byKey.facebook_views?.value}]))+
  '</div>';
}
function analyticsTile(label,value,note){return '<div class="analytics-tile"><span>'+esc(label)+'</span><b>'+esc(formatNumber(value))+'</b><span>'+esc(note)+'</span></div>'}
function chartCard(title,note,body){return '<div class="chart-card"><h3>'+esc(title)+'</h3><p>'+esc(note)+'</p>'+body+'</div>'}
function lineChart(points,opts={}){
  const series=(points||[]).map(p=>({date:p.date||"",value:Number(p.value)||0})).filter(p=>Number.isFinite(p.value));
  if(!series.length)return '<div class="empty-state">'+esc(opts.label||"Metric")+' has no trend data yet.</div>';
  const w=460,h=132,pad=20;
  const vals=series.map(p=>p.value);const min=Math.min(...vals),max=Math.max(...vals);const span=max-min||1;
  const xy=series.map((p,i)=>{const x=pad+(series.length===1?w/2-pad:(i/(series.length-1))*(w-pad*2));const y=h-pad-((p.value-min)/span)*(h-pad*2);return [x,y,p]});
  const path=xy.map(([x,y],i)=>(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)).join(' ');
  const area=path+' L '+xy[xy.length-1][0].toFixed(1)+' '+(h-pad)+' L '+xy[0][0].toFixed(1)+' '+(h-pad)+' Z';
  return '<div class="chart-note">'+esc(opts.label||"Trend")+' · current '+esc(formatNumber(opts.value??series[series.length-1].value))+'</div><svg class="line-chart" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(opts.label||"Trend")+' trend">'+
    '<line class="grid" x1="'+pad+'" y1="'+pad+'" x2="'+(w-pad)+'" y2="'+pad+'"></line><line class="grid" x1="'+pad+'" y1="'+(h-pad)+'" x2="'+(w-pad)+'" y2="'+(h-pad)+'"></line>'+
    '<path class="area" d="'+area+'"></path><path class="line" d="'+path+'"></path>'+
    '<text x="'+pad+'" y="'+(h-4)+'">'+esc(formatNumber(min))+'</text><text x="'+(w-pad-48)+'" y="'+(pad-6)+'">'+esc(formatNumber(max))+'</text></svg>';
}
function barChart(items){
  const clean=(items||[]).map(i=>({label:i.label,value:Number(i.value)||0})).filter(i=>i.value||i.value===0);
  if(!clean.length)return '<div class="empty-state">No chart data yet.</div>';
  const max=Math.max(...clean.map(i=>i.value),1);
  return '<div class="bar-chart">'+clean.map(i=>'<div class="bar-row"><span>'+esc(i.label)+'</span><div class="bar"><span style="width:'+Math.round((i.value/max)*100)+'%"></span></div><b>'+esc(formatNumber(i.value))+'</b></div>').join("")+'</div>';
}
function metricCard(metric){return '<div class="metric-card"><h3>'+esc(metric.label)+'</h3><div class="metric-value">'+esc(formatNumber(metric.value))+'</div><div class="metric-sub">'+esc(metric.aggregate)+' · '+esc(metric.points||0)+' points · '+esc(metric.source||"")+'</div>'+spark(metric.recent||[])+'</div>'}
function spark(points){const vals=points.map(p=>Number(p.value)||0);if(!vals.length)return "";const max=Math.max(...vals,1);return '<div class="spark">'+vals.map(v=>'<span style="height:'+Math.max(3,Math.round((v/max)*36))+'px"></span>').join("")+'</div>'}
function formatNumber(value){if(value===null||value===undefined)return "-";return Number(value).toLocaleString()}
function formatDateRangeText(range){if(!range?.start||!range?.end)return "range unknown";return range.start+" to "+range.end}
function barRows(obj){const entries=Object.entries(obj||{});if(!entries.length)return '<p class="mut">No data yet.</p>';const max=Math.max(...entries.map(([,v])=>Number(v)||0),1);return entries.sort((a,b)=>b[1]-a[1]).map(([label,value])=>'<div class="bar-row"><span>'+esc(label)+'</span><div class="bar"><span style="width:'+Math.round((Number(value)||0)/max*100)+'%"></span></div><b>'+esc(value)+'</b></div>').join("")}
function formatDate(value){if(!value)return "-";const d=new Date(value+"T12:00:00");if(Number.isNaN(d.getTime()))return value;return d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}
function formatDateTime(value){if(!value)return "not built";const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return d.toLocaleString()}
function renderVideoCard(v){
  const assetLabels={video:"Video",carousel:"Carousel",gbp:"GBP",xThread:"X thread",xExtras:"X extras",blog:"Blog"};
  const assetsHtml=Object.keys(assetLabels).filter(a=>v.availableAssets&&v.availableAssets[a]).map(a=>{
    const on=isOn(v,a);return '<label class="asset-toggle '+(on?'':'off')+'"><input type="checkbox" '+(on?'checked':'')+' onchange="assetToggle(\\''+esc(v.name)+'\\',\\''+a+'\\',this)"> '+assetLabels[a]+'</label>';
  }).join("");
  let videoSocial="",gbpSocial="",xSocial="";
  for(const [k,t] of Object.entries(v.social||{})){if(/^YouTube/i.test(k))continue;const detail='<details><summary>'+esc(k)+'</summary><pre>'+esc(t)+'</pre></details>';if(/^Google Business/i.test(k))gbpSocial+=detail;else if(/^X\\s*\\/|Twitter/i.test(k))xSocial+=detail;else videoSocial+=detail}
  const slides=(v.slides||[]).map(s=>'<img loading="lazy" src="/media/'+esc(s)+'">').join("");
  return '<article class="card '+(v.approved?'ap':'')+'" id="video-'+esc(v.name)+'">'+
    '<div class="card-head"><h3>'+esc(v.title||v.hook||v.name)+'</h3><span class="tag">'+esc(v.name)+'</span><span class="tag">'+esc(v.triage||"Pending")+'</span>'+(v.personaFit?.primaryLane?'<span class="tag">'+esc(v.personaFit.primaryLane)+' / '+esc(v.personaFit.fitStrength||"fit")+'</span>':'')+'<span class="ap-box"><input type="checkbox" '+(v.approved?'checked':'')+' onchange="approve(\\''+esc(v.name)+'\\',this)"> Approve short-form schedule</span></div>'+
    approvalRouteHtml(v,assetsHtml)+
    resourceOpportunityHtml(v)+
    '<div class="row"><div>'+mediaHtml(v)+chatHtml(v)+'</div><div>'+
    '<div class="st">Review details</div>'+
    '<details><summary>Social copy</summary>'+(videoSocial||'<p class="mut">No social captions yet.</p>')+'</details>'+
    (slides?'<details><summary>Carousel</summary><div class="slides">'+slides+'</div></details>':'')+
    (gbpSocial?'<details><summary>Google Business Profile</summary>'+gbpSocial+'</details>':'')+
    (v.xPack||xSocial?'<details><summary>X drafts</summary>'+xPackHtml(v.xPack,xSocial)+'</details>':'')+
    routingCompactHtml(v)+
    '</div></div></article>';
}
function summary(label,value){return '<div><b>'+esc(label)+'</b><span>'+esc(value||"-")+'</span></div>'}
function mediaHtml(v){const smart=v.coverMode!=="title"?"selected":"";const title=v.coverMode==="title"?"selected":"";const cleanNote=v.cleanSocialVideo?'<p class="preview-note"><b>Showing clean public export</b>'+(v.cleanSocialCueRemovedThroughSecond?' · cue removed through '+esc(v.cleanSocialCueRemovedThroughSecond)+'s':'')+'</p>':'';return '<div class="media-pair"><div>'+(v.video?'<video controls preload="metadata" '+(v.videoPoster?'poster="/media/'+esc(v.videoPoster)+'"':'')+' src="/media/'+esc(v.video)+'"></video>':'')+cleanNote+'</div>'+(v.cover?'<div class="cover-panel"><img id="cov-'+esc(v.name)+'" src="/media/'+esc(v.cover)+'"><div class="control-line"><span class="mut">Cover</span><select onchange="setCover(\\''+esc(v.name)+'\\',this)"><option value="smart" '+smart+'>Smart frame</option><option value="title" '+title+'>Title card</option></select></div></div>':'')+'</div>'}
function approvalRouteHtml(v,assetsHtml){
  const included=includedRouteCards(v);
  const destination=included.map(card=>card.property).join(", ")||"No schedulable destination";
  const platforms=[...new Set(included.flatMap(card=>scheduledPlatformsForRoute(v,card.property).map(item=>platformLabel(item.platform))))];
  return '<div class="route-callout '+(included.length?'':'waiting')+'"><div><b>Included destinations</b><strong>'+esc(destination)+'</strong><span class="chip">'+esc(platforms.length?platforms.join(", "):"No platforms")+'</span></div><div class="route-lines"><div class="line"><span>Approval does:</span> makes the checked short-form assets eligible for these destinations.</div><div class="line"><span>Approval does not:</span> publish a blog, resource page, PDF, or website update.</div><div class="line"><span>Routing:</span> other destinations are only included when they are strong enough and ready to schedule.</div></div></div>'+
    '<div class="destination-plan">'+routePlan(v).map(card=>destinationCardHtml(v,card,assetsHtml)).join("")+'</div>';
}
function destinationCardHtml(v,card,assetsHtml){
  const included=card.level==="included"&&card.setup?.schedulingReady!==false;
  if(!included)return "";
  const platforms=scheduledPlatformsForRoute(v,card.property);
  const platformChips=platforms.length?platforms.map(item=>'<span class="platform-pill">'+esc(item.asset)+' -> '+esc(platformLabel(item.platform))+'</span>').join(""):'<span class="platform-pill">No matching asset/platform pair</span>';
  return '<div class="destination-card included"><div class="route-status">Included by approval</div><h4>'+esc(card.property)+'</h4><p>'+esc(card.reason||"")+'</p><div class="destination-meta">'+(card.confidence?'<span class="chip">'+esc(card.confidence)+' confidence</span>':'')+'</div><div class="platform-list">'+platformChips+'</div>'+(assetsHtml?'<div class="st">Selected assets for this route</div><div class="asset-grid">'+assetsHtml+'</div>':'')+'</div>';
}
function distributionText(v){const d=v.distributionRecommendations||{};if(!d.primaryProperty)return "Not routed yet";const secondary=(d.secondary||[]).filter(i=>i.level==="recommended_secondary").map(i=>i.property);return "Primary: "+d.primaryProperty+(secondary.length?" + "+secondary.join(", "):"")}
function distributionCalloutHtml(v){
  const d=v.distributionRecommendations||{};
  if(!d.primaryProperty)return '<div class="route-callout waiting"><div><b>Recommended home</b><strong>Not routed yet</strong></div><div class="route-lines"><div class="line">Run the distribution routing step before scheduling this asset.</div></div></div>';
  const recommended=(d.secondary||[]).filter(i=>i.level==="recommended_secondary");
  const optional=(d.secondary||[]).filter(i=>i.level==="optional_secondary");
  const secondary=recommended.length
    ? 'Recommended secondary: '+recommended.map(i=>i.property).join(", ")
    : optional.length
      ? 'Optional secondary: '+optional.map(i=>i.property).join(", ")
      : 'No secondary route recommended';
  const why=d.primaryReason||"Best available fit based on the current source asset.";
  const readiness=d.schedulingReady?"Ready to schedule":"Recommendation only";
  const blockers=(d.setup?.blockers||[]).filter(Boolean);
  return '<div class="route-callout '+(d.schedulingReady?'':'waiting')+'"><div><b>Recommended home</b><strong>'+esc(d.primaryProperty)+'</strong><span class="chip">'+esc(d.confidence||"")+' confidence</span></div><div class="route-lines"><div class="line"><span>Why:</span> '+esc(why)+'</div><div class="line"><span>Secondary:</span> '+esc(secondary)+'</div><div class="line"><span>Status:</span> '+esc(readiness)+(d.schedulingInstruction?' · '+esc(d.schedulingInstruction):'')+'</div>'+(blockers.length?'<div class="line"><span>Blockers:</span> '+esc(blockers.join(" "))+'</div>':'')+'</div></div>';
}
function distributionHtml(v){
  const d=v.distributionRecommendations||{};
  if(!d.primaryProperty)return "";
  const second=(d.secondary||[]).map(item=>'<div class="route '+esc(item.level==="recommended_secondary"?"yes":"maybe")+'"><strong>'+esc(item.level||"secondary")+': '+esc(item.property||"")+'</strong><p>'+esc(item.reason||"")+'</p>'+(item.setup?.schedulingReady?'<span class="chip">ready</span>':'<span class="chip">setup needed</span>')+'</div>').join("");
  const blockers=(d.setup?.blockers||[]).map(b=>'<li>'+esc(b)+'</li>').join("");
  return '<details><summary>Distribution recommendation</summary><div class="routing-grid"><div class="route yes"><strong>Primary: '+esc(d.primaryProperty)+'</strong><p>'+esc(d.primaryReason||"")+'</p><span class="chip">'+esc(d.confidence||"")+' confidence</span> '+(d.schedulingReady?'<span class="chip">scheduling ready</span>':'<span class="chip">recommendation only</span>')+'</div>'+second+'</div>'+(d.schedulingInstruction?'<p class="mut">'+esc(d.schedulingInstruction)+'</p>':'')+(blockers?'<ul class="mut">'+blockers+'</ul>':'')+'</details>';
}
function resourceOpportunityHtml(v){const blog=findReuse(v.name,"blog");const page=findReuse(v.name,"video_explainer_page");const item=blog||page;if(!item)return "";const label=item.type==="blog"?"Blog candidate":"Resource page candidate";return '<div class="route-callout"><div><b>Resource opportunity</b><strong>'+esc(label)+'</strong><span class="chip">'+esc(item.confidence||"")+' confidence</span></div><div class="route-lines"><div class="line"><span>Why:</span> '+esc(item.recommendationReason||item.whyThisCouldBeDurable||"This may be worth turning into a durable website asset.")+'</div><div class="line"><span>Next:</span> review or generate it in Resource Queue. This does not happen when you approve the social schedule.</div><div><a class="btn small" href="#reuse" onclick="event.preventDefault();setReuseFilter(\\''+esc(item.type)+'\\')">Open in Resource Queue</a></div></div></div>'}
function routingCompactHtml(v){const entries=routeEntries(v);if(!entries.length)return "";return '<details><summary>Why this may become a resource</summary><div class="routing-grid">'+entries.map(e=>routeCard(v,e)).join("")+'</div><p class="mut">These are source-level recommendations. Drafting and preview generation live in Resource Queue.</p></details>'}
function routeCard(v,e){const item=e.item||{};const why=[item.reason,item.suggestedTitle,item.coreQuestion,item.candidateAngle,item.candidateQuestion,item.candidateUse,item.candidateAudience,item.candidateLocation].filter(Boolean).join(" ");const reuse=findReuse(v.name,ROUTE_TO_REUSE[e.key]);return '<div class="route '+e.rec+'"><strong>'+esc(e.label)+': '+esc(e.rec)+'</strong><p>'+esc(why)+'</p><div class="chip">'+esc(item.confidence||"")+' confidence</div>'+(reuse?'<div class="actions"><a class="btn small subtle" href="#reuse" onclick="event.preventDefault();setReuseFilter(\\''+esc(reuse.type)+'\\')">Open resource task</a></div>':'')+'</div>'}
function xPackHtml(pack,socialFallback){if(!pack)return socialFallback;const thread=xSection(pack,"Thread");const extras=xSection(pack,"Standalone X extras");let html="";if(thread)html+='<details><summary>Thread scheduled as one X thread</summary><pre>'+esc(thread)+'</pre></details>';if(extras)html+='<details><summary>Standalone X posts scheduled separately</summary><pre>'+esc(extras)+'</pre></details>';return html||'<details><summary>X draft details</summary><pre>'+esc(pack)+'</pre></details>'}
function xSection(pack,heading){const re=new RegExp("## "+heading+"\\\\n([\\\\s\\\\S]*?)(?=\\\\n## |$)");return (String(pack||"").match(re)||[])[1]?.trim()||""}
function reuseButtons(item,briefOnly){
  if(item.type==="video_explainer_page"||item.type==="blog") return longformButtons(item);
  let s="";
  if(!item.draftPath)s+='<button class="btn small" onclick="generateReuse(\\''+esc(item.id)+'\\')">Create draft</button>';else s+='<a class="btn small" href="/media/'+esc(item.draftPath)+'" target="_blank">Open draft</a>';
  s+='<button class="btn small danger" onclick="setReuseStatus(\\''+esc(item.id)+'\\',\\'declined\\')">Decline</button>';
  return s;
}
function longformButtons(item){
  const primary=longformPrimary(item);
  let s='<div class="next-action">';
  if(primary)s+=primary;
  if(item.draftPath)s+='<a class="btn small subtle" href="/media/'+esc(item.draftPath)+'" target="_blank">Open draft</a>';
  if(item.localUrl||item.localPath)s+=longformPackageButtons(item);
  s+='<button class="btn small danger" onclick="setReuseStatus(\\''+esc(item.id)+'\\',\\'declined\\')">Decline</button>';
  return s+'</div>';
}
function longformPrimary(item){
	  if(item.status==="declined")return "";
	  if(item.type==="blog"){
	    const score=Number(item.candidateScore||0);const readiness=item.candidateReadiness||"";const threadStatus=item.resourceThreadStatus||item.resourceThread?.threadStatus||"";
	    if(item.previewNeedsRegeneration)return '<button class="btn small" onclick="blogPreview(\\''+esc(item.id)+'\\')">Regenerate complete preview with follow-up</button>'+(item.localUrl||item.localPath?'<a class="btn small subtle" href="'+esc(item.localUrl||item.localPath)+'" target="_blank">Open stale preview</a>':'');
	    if(item.localUrl||item.localPath)return '<a class="btn small" href="'+esc(item.localUrl||item.localPath)+'" target="_blank">Open preview</a><button class="btn small subtle" onclick="blogPreview(\\''+esc(item.id)+'\\')">Regenerate resource blog preview</button>';
    if(threadStatus==="follow_up_recorded"||threadStatus==="ready_for_resource_preview"||readiness==="follow_up_received")return '<button class="btn small" onclick="blogPreview(\\''+esc(item.id)+'\\')">Follow-up received: generate complete preview</button>';
    if(score>0&&score<7)return '<button class="btn small subtle" disabled title="Keep this as source material unless you manually revive it.">Source material only</button>';
    if(score>=7&&score<8)return '<button class="btn small subtle" disabled title="Record the follow-up prompt first, then regenerate this card after the new video processes.">Strengthen with follow-up first</button>';
    return '<button class="btn small" onclick="blogPreview(\\''+esc(item.id)+'\\')">Generate resource blog preview</button>';
  }
  if(!item.draftPath)return '<button class="btn small" onclick="generateReuse(\\''+esc(item.id)+'\\')">Generate full resource draft</button>';
  if(!item.localPath)return '<button class="btn small" onclick="longformStage(\\''+esc(item.id)+'\\')">Stage preview</button>';
  return '<a class="btn small" href="'+esc(item.localUrl||item.localPath)+'" target="_blank">Open preview</a>';
}
function longformAdvancedButtons(item){
  let s="";
  if(item.localUrl||item.localPath)s+='<a class="btn small subtle" href="'+esc(item.localUrl||item.localPath)+'" target="_blank">Open preview</a>';
  if(!item.pdfCreatedAt&&!item.pdfPath)s+='<button class="btn small" onclick="longformPdf(\\''+esc(item.id)+'\\')">Print compliance PDF</button>';
  if(item.pdfPath)s+='<a class="btn small subtle" href="/media/'+esc(item.pdfPath)+'" target="_blank">Open PDF</a>';
  if(!item.complianceEmailDraftPath)s+='<button class="btn small" onclick="longformEmailDraft(\\''+esc(item.id)+'\\')">Draft compliance email</button>';
  else s+='<a class="btn small subtle" href="/media/'+esc(item.complianceEmailDraftPath)+'" target="_blank">Open email draft</a>';
  if(item.complianceStatus!=="sent_to_compliance"&&item.complianceStatus!=="approved")s+='<button class="btn small" onclick="longformMarkSent(\\''+esc(item.id)+'\\')">Mark sent to compliance</button>';
  if(item.complianceStatus!=="approved"&&!item.readyToPublishAt)s+='<button class="btn small" onclick="longformMarkReady(\\''+esc(item.id)+'\\')">Mark ready to publish</button>';
  if(item.publishChecklistPath)s+='<a class="btn small subtle" href="/media/'+esc(item.publishChecklistPath)+'" target="_blank">Open publish checklist</a>';
  else s+='<button class="btn small" onclick="longformPreparePublish(\\''+esc(item.id)+'\\')">Prepare publish checklist</button>';
  return s;
}
function longformPackageButtons(item){
  const pkg=item.compliancePackage||{};
  const yt=item.youtubeReuse||{};
  const youtubeScheduled=yt.scheduleStatus==="scheduled"||yt.metricoolId;
  let s="";
  if(pkg.zipPath&&youtubeScheduled)s+='<a class="btn small" href="/media/'+esc(pkg.zipPath)+'" download>Download PDF + video ZIP</a>';
  else s+='<button class="btn small subtle" onclick="longformPreparePublish(\\''+esc(item.id)+'\\')">Prepare package + queue YouTube</button>';
  return s;
}
function findReuse(video,type){return REUSE_QUEUE.find(i=>i.sourceVideo===video&&i.type===type)}
function chatHtml(v){const msgs=(v.chat?.messages||[]).map((m,i)=>'<div class="msg '+esc(m.role)+'"><div class="who">'+esc(m.role)+' '+new Date(m.createdAt||Date.now()).toLocaleString()+'</div><div>'+esc(m.content)+'</div>'+suggestionsHtml(v.name,m,i)+(m.preferenceCandidate?'<button class="btn small" onclick="promotePreference(\\''+esc(v.name)+'\\','+i+')">Promote as preference</button>':'')+'</div>').join("");return '<div class="chat"><div class="st">Asset chat</div><div class="chat-log">'+(msgs||'<p class="mut">No notes yet. Add a tweak request or preference.</p>')+'</div><textarea id="chat-input-'+esc(v.name)+'" onkeydown="chatKey(event,\\''+esc(v.name)+'\\')" placeholder="Type a tweak. Return sends, Shift+Return starts a new line."></textarea><div class="chat-actions"><button class="btn subtle" onclick="addChat(\\''+esc(v.name)+'\\')">Send</button></div></div>'}
function suggestionsHtml(name,msg,messageIndex){const items=Array.isArray(msg.suggestions)?msg.suggestions:[];if(!items.length)return "";return items.map(s=>'<div class="suggestion '+(s.appliedAt?'applied':'')+'"><h4>'+esc(s.title||"Suggested edit")+'</h4><p><b>Target:</b> '+esc(s.target||s.type||"")+'</p>'+(s.rationale?'<p>'+esc(s.rationale)+'</p>':'')+(s.replacement?'<details><summary>Preview replacement</summary><pre>'+esc(s.replacement)+'</pre></details>':'')+(s.appliedAt?'<span class="chip">Applied</span> '+(s.undo?'<button class="btn small subtle" onclick="undoSuggestion(\\''+esc(name)+'\\','+messageIndex+',\\''+esc(s.id)+'\\')">Undo</button>':''):'<button class="btn small" onclick="applySuggestion(\\''+esc(name)+'\\','+messageIndex+',\\''+esc(s.id)+'\\')">Apply this edit</button>')+'</div>').join("")}
function setReuseFilter(type){setView("reuse");setTimeout(()=>{const t=document.getElementById("reuse-type");if(t){t.value=type;renderReuse();document.getElementById("reuse")?.scrollIntoView({behavior:"smooth"})}},0)}
function renderReuse(){
  const typeEl=document.getElementById("reuse-type");
  const filterHtml='<div class="filters"><select id="reuse-type" onchange="renderReuse()"><option value="">All resource types</option>'+REUSE_GROUPS.map(g=>'<option value="'+g[0]+'">'+g[1]+'</option>').join("")+'</select><select id="reuse-status" onchange="renderReuse()"><option value="">All statuses</option><option>candidate</option><option>draft_generated</option><option>staged_preview</option><option>pdf_created</option><option>compliance_email_drafted</option><option>sent_to_compliance</option><option>ready_to_publish</option><option>needs_review</option><option>approved</option><option>declined</option><option>published</option></select><select id="reuse-confidence" onchange="renderReuse()"><option value="">All confidence</option><option>high</option><option>medium</option><option>low</option></select></div>';
  const type=typeEl?typeEl.value:"blog";const status=document.getElementById("reuse-status")?.value||"";const confidence=document.getElementById("reuse-confidence")?.value||"";
  const rows=REUSE_QUEUE.filter(i=>(!type||i.type===type)&&(!status||i.status===status)&&(!confidence||i.confidence===confidence)).sort(reuseSort);
  const companionHtml=renderBlogCompanions();
  const blogCount=REUSE_QUEUE.filter(i=>i.type==="blog").length;
  const resourceCount=REUSE_QUEUE.filter(i=>i.type==="video_explainer_page").length;
  const otherCount=Math.max(0,REUSE_QUEUE.length-blogCount-resourceCount);
  const top='<div class="planner-summary"><button class="btn small '+(type==="blog"?"":"subtle")+'" onclick="setReuseFilter(\\'blog\\')">Blog candidates ('+esc(blogCount)+')</button><button class="btn small '+(type==="video_explainer_page"?"":"subtle")+'" onclick="setReuseFilter(\\'video_explainer_page\\')">Resource pages ('+esc(resourceCount)+')</button><button class="btn small '+(type===""?"":"subtle")+'" onclick="setReuseFilter(\\'\\')">All reuse ideas ('+esc(REUSE_QUEUE.length)+')</button><button class="btn small danger" onclick="clearGeneratedBlogPreviews()">Clear generated blog previews</button><span class="chip">'+esc(otherCount)+' other reuse ideas</span></div>';
  let lanes=REUSE_GROUPS.map(([key,label])=>{const items=rows.filter(i=>i.type===key);if(!items.length)return "";return '<div class="lane"><h3>'+label+' ('+items.length+')</h3><div class="reuse-grid">'+items.map(reuseCard).join("")+'</div></div>'}).join("");
  if(!lanes)lanes='<p class="mut">No reuse candidates match the filters.</p>';
  document.getElementById("reuse").innerHTML='<div class="section-head"><h2>Resource Publishing</h2><p>Fast triage for turning the best videos into durable articles, source-video resources, publish packages, and optional YouTube reuse.</p></div>'+companionHtml+top+filterHtml+'<div class="reuse-lanes">'+lanes+'</div>';
  const t=document.getElementById("reuse-type");if(t)t.value=type;const s=document.getElementById("reuse-status");if(s)s.value=status;const c=document.getElementById("reuse-confidence");if(c)c.value=confidence;
}
function renderBlogCompanions(){
  if(!BLOG_COMPANIONS.length)return "";
  const received=BLOG_COMPANIONS.filter(i=>i.status==="companion_received").length;
  const cards=BLOG_COMPANIONS.map(blogCompanionCard).join("");
  return '<section class="lane"><div class="section-head"><h2>Refresh Current Blogs</h2><p>Record these companion videos, drop them into the pipeline, and the engine will match them back to the existing blog for a visual/resource refresh.</p></div><div class="planner-summary"><span class="chip">'+esc(BLOG_COMPANIONS.length)+' prompts</span><span class="chip">'+esc(received)+' companion videos received</span><span class="chip">Use cue: Blog companion for...</span></div><div class="companion-strip reuse-grid">'+cards+'</div></section>';
}
function blogCompanionCard(item){
  const received=item.status==="companion_received";
  const latest=item.latestRecording||{};
	  const uses=Array.isArray(item.likelyUse)?item.likelyUse.slice(0,3).join(", "):"";
	  const attached=(item.attachedVideoIds||[]).length?'<p class="preview-note"><b>Matched video:</b> '+esc((item.attachedVideoIds||[]).join(", "))+(latest.cleanSocialVideoPath?' · <b>Clean social:</b> '+esc(latest.cleanSocialVideoPath):'')+'</p>':'';
	  const next=received?'Companion received. Clean video is ready for the blog refresh path.':'Record this, starting with the routing cue, then drop the video into the normal pipeline.';
	  const video=latest.cleanSocialVideoPath?'<div class="resource-video-preview"><b>Clean companion video</b><video controls preload="metadata" src="/media/'+esc(latest.cleanSocialVideoPath)+'"></video></div>':'';
	  return '<div class="reuse-card companion-card '+(received?'received':'')+'"><div class="companion-priority"><span class="chip">'+esc(item.priority||"")+'</span><span class="chip">Priority '+esc(item.refreshPriority||"")+'</span><span class="chip">'+esc(received?'companion received':'needs recording')+'</span></div><h4>'+esc(item.title)+'</h4><div class="reuse-meta">'+esc(item.primaryCategory||"")+' · '+esc(item.promptId||"")+'</div><p>'+esc(item.whyThisMatters||"")+'</p>'+video+'<p class="preview-note"><b>Routing cue:</b> '+esc(item.routingCue||"")+'</p><p class="preview-note"><b>First public line:</b> '+esc(item.firstSpokenLine||"")+'</p><p class="preview-note"><b>Next:</b> '+esc(next)+'</p>'+attached+'<div class="reuse-actions"><button class="btn small" onclick="copyText(decodeURIComponent(\\''+enc(item.fullPrompt||"")+'\\'))">Copy full prompt</button><button class="btn small subtle" onclick="copyText(decodeURIComponent(\\''+enc(item.routingCue||"")+'\\'))">Copy cue</button></div><details><summary>Full recording start</summary><pre>'+esc(item.fullPrompt||"")+'</pre></details><details><summary>Refresh notes</summary><p>'+esc(item.visualRefreshNotes||"")+'</p><p><b>Likely use:</b> '+esc(uses)+'</p></details></div>';
	}
function reuseSort(a,b){if(a.type==="blog"&&b.type==="blog"){const diff=displayBlogScore(b)-displayBlogScore(a);if(diff)return diff}const score=x=>({yes:0,maybe:2,no:8}[x.recommendation]??4)+(x.confidence==="high"?0:x.confidence==="medium"?1:2)+({candidate:0,draft_generated:2,staged_preview:3,pdf_created:4,compliance_email_drafted:5,sent_to_compliance:6,ready_to_publish:7,drafted:2,needs_review:3,approved:7,declined:20,published:30}[x.status]??0);return score(a)-score(b)}
function reuseCard(item){if(item.type==="blog")return blogReuseCard(item);const longform=item.type==="video_explainer_page";const details='<div class="reuse-meta">'+(item.suggestedTitle?'<br><b>Suggested:</b> '+esc(item.suggestedTitle):'')+(item.coreQuestion?'<br><b>Question:</b> '+esc(item.coreQuestion):'')+(item.whyThisCouldBeDurable?'<br><b>Durable because:</b> '+esc(item.whyThisCouldBeDurable):'')+(item.localUrl?'<br><b>Preview:</b> '+esc(item.localUrl):'')+(item.pdfPath?'<br><b>PDF:</b> '+esc(item.pdfPath):'')+'</div>';return '<div class="reuse-card"><h4>'+esc(item.title)+'</h4><div class="reuse-meta"><span class="chip">'+esc(item.typeLabel)+'</span> <span class="chip">'+esc(item.workflowStatus||item.status)+'</span> <span class="chip">'+esc(item.recommendation||"")+' / '+esc(item.confidence||"")+'</span><br>Source: <a href="#video-'+esc(item.sourceVideo)+'">'+esc(item.sourceVideo)+'</a></div>'+(longform?'<div class="workflow">'+workflowSteps(item).join("")+'</div>':'')+'<p>'+esc(item.recommendationReason||"")+'</p>'+details+'<div class="reuse-actions">'+reuseButtons(item,item.type==="landing_page_brief")+'</div></div>'}
function blogReuseCard(item){
  const title=displayBlogTitle(item.h1Title||item.suggestedTitle||item.title||"Blog candidate");
  const lines=(item.sourceLines||[]).slice(0,4).map(line=>'<div class="source-line">'+esc(typeof line==="string"?line:(line.text||line.line||JSON.stringify(line)))+'</div>').join("");
  const moments=Number(item.sourceMomentCount||0);
  const score=displayBlogScore(item);
  const category=blogCategory(item);
  const sourceBasis=item.sourceBasis?'<div class="reuse-meta"><b>Source basis:</b> '+esc([...(item.sourceBasis.inputs||[]),...(item.sourceBasis.generatedFrom||[])].join(", "))+'</div>':'';
  const threadStatus=item.resourceThreadStatus||item.resourceThread?.threadStatus||"";
	  const followReady=threadStatus==="follow_up_recorded"||threadStatus==="ready_for_resource_preview"||item.candidateReadiness==="follow_up_received";
	  const shouldShowFollow=!!item.followUpPrompt&&score>=6&&score<8&&!followReady;
	  const follow=shouldShowFollow?'<details><summary>Follow-up recording start</summary><p class="preview-note">Use this when the idea is close but needs one more source clip before becoming a strong blog. The routing cue will be trimmed from public exports.</p><pre>'+esc(item.followUpPrompt)+'</pre><button class="btn small subtle" onclick="copyText(decodeURIComponent(\\''+enc(item.followUpPrompt)+'\\'))">Copy prompt</button></details>':'';
	  const stale=item.previewNeedsRegeneration?'<p class="preview-note stale-preview"><b>Follow-up received:</b> regenerate this preview before judging the current article.</p>':'';
	  const youtubeVideo=item.youtubeVideoPath?'<div class="resource-video-preview"><b>Video for package + YouTube</b><video controls preload="metadata" src="/media/'+esc(item.youtubeVideoPath)+'"></video><div class="reuse-meta">'+esc(item.youtubeVideoPath)+'</div></div>':'';
	  const thread=item.resourceVideoPath?'<div class="reuse-meta"><b>Resource video:</b> '+esc(item.resourceVideoPath)+(item.transcriptBundlePath?' · <b>Transcript bundle:</b> '+esc(item.transcriptBundlePath):'')+'</div>':'';
	  const evidence='<details><summary>Why this is a candidate</summary>'+(item.coreQuestion?'<p><b>Question:</b> '+esc(item.coreQuestion)+'</p>':'')+(item.recommendationReason?'<p><b>Why:</b> '+esc(item.recommendationReason)+'</p>':'')+(item.titleRationale?'<p><b>Title rationale:</b> '+esc(item.titleRationale)+'</p>':'')+(item.decisionTheme?'<p><b>Theme:</b> '+esc(item.decisionTheme)+'</p>':'')+(moments?'<p><b>Source moments:</b> '+esc(moments)+'</p>':'')+sourceBasis+(lines?'<div class="source-lines">'+lines+'</div>':'<p class="preview-note">No transcript pull lines were saved for this candidate.</p>')+thread+'</details>';
	  return '<div class="reuse-card '+(item.previewNeedsRegeneration?'stale-preview':'')+'"><h4>'+esc(title)+'</h4><div class="reuse-meta"><span class="chip">Score '+esc(score||"")+'/10</span> <span class="chip">'+esc(category)+'</span><br>Source: <a href="#video-'+esc(item.sourceVideo)+'">'+esc(item.sourceVideo)+'</a></div><p>'+esc(item.candidateSummary||item.recommendationReason||"Potential durable resource candidate.")+'</p>'+stale+youtubeVideo+'<div class="reuse-actions">'+reuseButtons(item,false)+'</div>'+evidence+follow+'</div>';
	}
function displayBlogTitle(value){return String(value||"").replace(/\s+\((emotionally and practically|practically and emotionally)\)/ig,"").replace(/\s+\((?:and )?what to do(?: next)?\)/ig,"").replace(/\s+/g," ").trim()}
function displayBlogScore(item){return Math.max(Number(item.candidateScore||0),Number(item.resourceThread?.candidateScore||0),scoreBlogFromRecommendation(item))}
function scoreBlogFromRecommendation(item){let score=5;const rec=String(item.recommendation||"").toLowerCase();const confidence=String(item.confidence||"").toLowerCase();if(rec==="yes")score+=2;if(rec==="maybe")score+=0.5;if(confidence==="high")score+=1.5;if(confidence==="medium")score+=0.5;if(item.coreQuestion)score+=0.5;if(Array.isArray(item.sourceLines)&&item.sourceLines.length>=3)score+=0.5;if(item.status==="declined")score=Math.min(score,2);return Math.max(1,Math.min(10,Math.round(score*10)/10))}
function blogCategory(item){const direct=item.primaryCategory||((item.tags||[])[0]);if(direct)return direct;const hay=(displayBlogTitle(item.h1Title||item.suggestedTitle||item.title||"")+" "+(item.recommendationReason||"")).toLowerCase();if(/tax|roth|irs|conversion|rmd/.test(hay))return "Tax Planning";if(/business|owner|payroll|s-corp|profit/.test(hay))return "Business Owner Planning";if(/invest|portfolio|return/.test(hay))return "Investment Management";if(/estate|inherit|beneficiar/.test(hay))return "Estate Planning";if(/retirement|medicare|social security|income/.test(hay))return "Retirement Planning";return "Financial Planning"}
function workflowSteps(item){const steps=["Candidate","Draft","Preview","PDF","Compliance","Ready","Published"];return steps.map(s=>'<span class="step '+(stepDone(item,s)?"done":stepCurrent(item,s)?"now":"")+'">'+esc(s)+'</span>')}
function stepDone(item,s){if(s==="Candidate")return true;if(s==="Draft")return !!item.draftPath;if(s==="Preview")return !!item.localPath;if(s==="PDF")return !!item.pdfCreatedAt||!!item.pdfPath;if(s==="Compliance")return !!item.complianceSentAt||item.complianceStatus==="sent_to_compliance"||item.complianceStatus==="approved";if(s==="Ready")return !!item.readyToPublishAt||item.complianceStatus==="approved";if(s==="Published")return !!item.publishedAt||item.status==="published";return false}
function stepCurrent(item,s){const next=!stepDone(item,s)&&["Candidate","Draft","Preview","PDF","Compliance","Ready","Published"].some(x=>x===s);return next&&longformPrimary(item).toLowerCase().includes(s.toLowerCase().split(" ")[0])}
function renderBroll(){
  const pending=BROLL.filter(b=>!b.approved), approved=BROLL.filter(b=>b.approved);
  const cards=[...approved,...pending].map(b=>'<div class="bcard '+(b.approved?'approved':'')+'">'+(b.file?'<video controls preload="metadata" '+(b.frame?'poster="/media/'+esc(b.frame)+'"':'')+' src="/media/'+esc(b.file)+'"></video>':'')+'<p>'+esc(b.description||b.name)+'</p><div class="mut">'+esc(b.mood||"")+'</div><label class="control-line"><input type="checkbox" '+(b.approved?'checked':'')+' onchange="approveBroll(\\''+esc(b.name)+'\\',this)"> Approved for bank</label></div>').join("");
  const quoteCards=QUOTE_REELS.map(q=>'<div class="bcard"><video controls preload="metadata" src="/media/'+esc(q.file)+'"></video><p>'+esc(q.line||q.name)+'</p><div class="chip">'+esc(q.status||"review later")+'</div><div class="control-line"><a class="btn small" href="/media/'+esc(q.file)+'" target="_blank">Open</a><a class="btn small subtle" href="/media/'+esc(q.file)+'" download>Download</a></div>'+(q.caption?'<details><summary>Caption draft</summary><pre>'+esc(q.caption)+'</pre></details>':'')+'</div>').join("");
  document.getElementById("broll").innerHTML='<div class="section-head"><h2>B-roll Bank</h2><p>'+approved.length+' approved, '+pending.length+' new.</p></div><div class="broll-grid">'+(cards||'<p class="mut">No b-roll cataloged yet.</p>')+'</div><div class="section-head"><h2>Quote Reel Bank</h2><p>Optional derived clips for native/manual posting. They are not in the normal schedule.</p></div><div class="broll-grid">'+(quoteCards||'<p class="mut">No quote reels generated yet.</p>')+'</div>';
}
function renderInventory(){
  const rows=INVENTORY.map(r=>'<tr><td>'+esc(r.id)+'</td><td>'+esc(r.title||"")+'</td><td>'+esc(r.triage||"")+'</td><td>'+esc(r.approvalStatus||"")+'</td><td>'+esc(r.blogDraftExists?"yes":"no")+'</td><td>'+esc(r.reuseStatusSummary||"")+'</td><td>'+esc(r.publishedUrl||"")+'</td></tr>').join("");
  document.getElementById("inventory").innerHTML='<div class="section-head"><h2>Inventory / Status</h2><p>Audit trail for what exists and what has been used.</p></div><div class="table-wrap"><table><thead><tr><th>Source</th><th>Title</th><th>Triage</th><th>Social</th><th>Blog</th><th>Reuse</th><th>Published URL</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
Object.assign(window,{approve,assetToggle,setCover,syncMetricool,buildShadowReroute,buildRepurposeSeed,syncAnalytics,buildSchedule,scheduleLive,clearFailure,retryFailure,generateBlog,stageBlog,printBlogPdf,generateReuse,longformStage,blogPreview,longformPdf,longformEmailDraft,longformMarkSent,longformMarkReady,longformPreparePublish,clearGeneratedBlogPreviews,copyText,setReuseStatus,setReuseCompliance,approveBroll,addChat,chatKey,applySuggestion,undoSuggestion,promotePreference,setReuseFilter,renderReuse,jumpTo,setView,selectPlannerPost,changePlannerWeek,setPlannerMode,setPlannerProperty});
renderHero();renderActions();renderFailures();renderPlanner();renderSocial();renderReuse();renderSetup();renderDistribution();renderAnalytics();renderBroll();renderInventory();initViews();
if(CURRENT_JOB?.status==="running")pollScheduleJob();
</script>
</body>
</html>`;
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
