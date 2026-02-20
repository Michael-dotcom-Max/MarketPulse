const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], animFrame;

function initNeural() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  nodes = [];
  const count = Math.min(Math.floor(W * H / 14000), 60);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    });
  }
}

function drawNeural() {
  ctx.clearRect(0, 0, W, H);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });
  // Connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 160;
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  // Nodes
  nodes.forEach(n => {
    const pulse = Math.sin(n.pulse) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.3), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${0.3 + pulse * 0.4})`;
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  requestAnimationFrame(drawNeural);
}

window.addEventListener('resize', initNeural);
initNeural();
drawNeural();

// ═══════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════
const ring = document.getElementById('cursor-ring');
const dot = document.getElementById('cursor-dot');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});

(function cursorLoop() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(cursorLoop);
})();

document.addEventListener('mousedown', () => { ring.style.transform = 'translate(-50%,-50%) scale(0.8)'; });
document.addEventListener('mouseup', () => { ring.style.transform = 'translate(-50%,-50%) scale(1)'; });

document.querySelectorAll('button, a, input, .nav-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '46px'; ring.style.height = '46px';
    ring.style.borderColor = 'rgba(0,212,255,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '28px'; ring.style.height = '28px';
    ring.style.borderColor = 'var(--neon-azure)';
  });
});

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const COINS = [
  { id:'btc', sym:'BTC', name:'Bitcoin', icon:'₿', price:67842, change:+2.84, vol:'$42.8B', mcap:'$1.33T', color:'#f59e0b', trend:[60,65,58,72,68,80,78] },
  { id:'eth', sym:'ETH', name:'Ethereum', icon:'⬡', price:3542, change:+1.92, vol:'$18.4B', mcap:'$426B', color:'#7c3aed', trend:[50,55,48,62,58,70,68] },
  { id:'sol', sym:'SOL', name:'Solana', icon:'◎', price:189.4, change:+5.61, vol:'$4.2B', mcap:'$82B', color:'#00ff9d', trend:[40,38,52,60,55,72,80] },
  { id:'bnb', sym:'BNB', name:'BNB', icon:'◈', price:608.2, change:-1.23, vol:'$2.1B', mcap:'$90B', color:'#f59e0b', trend:[70,68,65,60,58,55,52] },
  { id:'xrp', sym:'XRP', name:'XRP', icon:'✦', price:0.623, change:+3.41, vol:'$1.8B', mcap:'$35B', color:'#00d4ff', trend:[30,35,32,42,38,48,50] },
  { id:'ada', sym:'ADA', name:'Cardano', icon:'◉', price:0.542, change:-2.18, vol:'$0.8B', mcap:'$19B', color:'#c026d3', trend:[55,52,48,44,42,40,38] },
  { id:'dot', sym:'DOT', name:'Polkadot', icon:'⬤', price:8.24, change:+0.87, vol:'$0.6B', mcap:'$11B', color:'#ff2d78', trend:[45,48,46,50,52,55,54] },
  { id:'avax', sym:'AVAX', name:'Avalanche', icon:'△', price:42.8, change:+4.22, vol:'$1.2B', mcap:'$17B', color:'#ef4444', trend:[35,40,38,50,48,60,65] },
];

const HOLDINGS = [
  { coin: COINS[0], qty: 0.842, costBasis: 58000 },
  { coin: COINS[1], qty: 8.4, costBasis: 3100 },
  { coin: COINS[2], qty: 124, costBasis: 145 },
  { coin: COINS[3], qty: 15.5, costBasis: 590 },
  { coin: COINS[4], qty: 8200, costBasis: 0.55 },
];

const HISTORY_DATA = [
  { id:'#NX8821', type:'buy', sym:'BTC', amount:'0.142 BTC', price:'$67,420', total:'$9,573.6', date:'2024-02-15 14:23', status:'completed' },
  { id:'#NX8820', type:'sell', sym:'ETH', amount:'2.4 ETH', price:'$3,540', total:'$8,496', date:'2024-02-15 11:04', status:'completed' },
  { id:'#NX8819', type:'buy', sym:'SOL', amount:'42 SOL', price:'$186.2', total:'$7,820', date:'2024-02-14 22:18', status:'completed' },
  { id:'#NX8818', type:'transfer', sym:'USDT', amount:'5,000 USDT', price:'$1.00', total:'$5,000', date:'2024-02-14 16:55', status:'completed' },
  { id:'#NX8817', type:'buy', sym:'BNB', amount:'8.2 BNB', price:'$601', total:'$4,928', date:'2024-02-14 08:30', status:'completed' },
  { id:'#NX8816', type:'sell', sym:'BTC', amount:'0.05 BTC', price:'$66,800', total:'$3,340', date:'2024-02-13 19:44', status:'completed' },
  { id:'#NX8815', type:'buy', sym:'XRP', amount:'5000 XRP', price:'$0.61', total:'$3,050', date:'2024-02-13 12:00', status:'completed' },
  { id:'#NX8814', type:'buy', sym:'ETH', amount:'1.2 ETH', price:'$3,480', total:'$4,176', date:'2024-02-12 20:20', status:'pending' },
];

let currentHistoryFilter = 'all';

// ═══════════════════════════════════════════════════════════════
// TICKER
// ═══════════════════════════════════════════════════════════════
function buildTicker() {
  const inner = document.getElementById('ticker-inner');
  // Duplicate for seamless loop
  const twoSets = [...COINS, ...COINS];
  inner.innerHTML = twoSets.map(c => `
    <div class="ticker-item">
      <span class="ticker-sym">${c.sym}</span>
      <span class="ticker-price">${c.price > 1000 ? '$' + c.price.toLocaleString() : '$' + c.price}</span>
      <span class="ticker-chg ${c.change >= 0 ? 'up' : 'down'}">${c.change >= 0 ? '+' : ''}${c.change.toFixed(2)}%</span>
    </div>
  `).join('');
}
buildTicker();

// Update dashboard stats based on live prices
function updateDashboardStats() {
  // Portfolio value
  const portfolioTotal = HOLDINGS.reduce((sum, h) => sum + h.coin.price * h.qty, 0);
  const portfolioEl = document.getElementById('stat-portfolio');
  if (portfolioEl) {
    portfolioEl.textContent = '$' + Math.round(portfolioTotal).toLocaleString();
    portfolioEl.classList.remove('price-flash');
    void portfolioEl.offsetWidth;
    portfolioEl.classList.add('price-flash');
  }
  
  // P&L calculation
  const costBasis = HOLDINGS.reduce((sum, h) => sum + h.costBasis * h.qty, 0);
  const pnl = portfolioTotal - costBasis;
  const pnlEl = document.getElementById('stat-pnl');
  if (pnlEl) {
    pnlEl.textContent = (pnl >= 0 ? '+$' : '-$') + Math.abs(Math.round(pnl)).toLocaleString();
    pnlEl.className = pnl >= 0 ? 'stat-value text-up' : 'stat-value text-down';
    pnlEl.classList.remove('price-flash');
    void pnlEl.offsetWidth;
    pnlEl.classList.add('price-flash');
  }
  
  // P&L percentage
  const pnlPct = (pnl / costBasis * 100).toFixed(2);
  const pnlPctEl = document.querySelector('#stat-pnl').parentElement.querySelector('.stat-change');
  if (pnlPctEl) {
    pnlPctEl.textContent = (pnl >= 0 ? '▲ ' : '▼ ') + (pnl >= 0 ? '+' : '') + pnlPct + '%';
    pnlPctEl.className = 'stat-change ' + (pnl >= 0 ? 'up' : 'down');
  }
  
  // Update right sidebar stats
  updateSidebarStats();
}

// Update right sidebar with live data
function updateSidebarStats() {
  // Portfolio total
  const portfolioTotal = HOLDINGS.reduce((sum, h) => sum + h.coin.price * h.qty, 0);
  const costBasis = HOLDINGS.reduce((sum, h) => sum + h.costBasis * h.qty, 0);
  const pnl = portfolioTotal - costBasis;
  const pnlPct = (pnl / costBasis * 100).toFixed(2);
  
  // Update sidebar portfolio values
  const sbTotalVal = document.getElementById('sb-total-value');
  if (sbTotalVal) {
    sbTotalVal.textContent = '$' + Math.round(portfolioTotal).toLocaleString();
    sbTotalVal.classList.remove('price-flash');
    void sbTotalVal.offsetWidth;
    sbTotalVal.classList.add('price-flash');
  }
  
  const sbTotalChange = document.getElementById('sb-total-change');
  if (sbTotalChange) {
    sbTotalChange.textContent = (pnl >= 0 ? '▲ ' : '▼ ') + (pnl >= 0 ? '+' : '') + Math.abs(pnlPct) + '%';
    sbTotalChange.className = 'sidebar-stat-change ' + (pnl >= 0 ? 'up' : 'down');
  }
  
  // P&L section
  const sbPnlVal = document.getElementById('sb-pnl-value');
  if (sbPnlVal) {
    sbPnlVal.textContent = (pnl >= 0 ? '+$' : '-$') + Math.abs(Math.round(pnl)).toLocaleString();
    sbPnlVal.className = pnl >= 0 ? 'sidebar-stat-value text-up' : 'sidebar-stat-value text-down';
  }
  
  const sbPnlChange = document.getElementById('sb-pnl-change');
  if (sbPnlChange) {
    sbPnlChange.textContent = (pnl >= 0 ? '▲ ' : '▼ ') + (pnl >= 0 ? '+' : '') + Math.abs(pnlPct) + '%';
    sbPnlChange.className = 'sidebar-stat-change ' + (pnl >= 0 ? 'up' : 'down');
  }
  
  // BTC price
  const sbBtcPrice = document.getElementById('sb-btc-price');
  if (sbBtcPrice) {
    sbBtcPrice.textContent = '$' + Math.round(COINS[0].price).toLocaleString();
  }
  
  const sbBtcChange = document.getElementById('sb-btc-change');
  if (sbBtcChange) {
    sbBtcChange.textContent = (COINS[0].change >= 0 ? '▲ ' : '▼ ') + (COINS[0].change >= 0 ? '+' : '') + Math.abs(COINS[0].change).toFixed(2) + '%';
    sbBtcChange.className = 'sidebar-stat-change ' + (COINS[0].change >= 0 ? 'up' : 'down');
  }
  
  // ETH price
  const sbEthPrice = document.getElementById('sb-eth-price');
  if (sbEthPrice) {
    sbEthPrice.textContent = '$' + COINS[1].price.toFixed(0);
  }
  
  const sbEthChange = document.getElementById('sb-eth-change');
  if (sbEthChange) {
    sbEthChange.textContent = (COINS[1].change >= 0 ? '▲ ' : '▼ ') + (COINS[1].change >= 0 ? '+' : '') + Math.abs(COINS[1].change).toFixed(2) + '%';
    sbEthChange.className = 'sidebar-stat-change ' + (COINS[1].change >= 0 ? 'up' : 'down');
  }
  
  // Holdings count
  const sbHoldings = document.getElementById('sb-holdings');
  if (sbHoldings) {
    sbHoldings.textContent = HOLDINGS.length + ' assets';
  }
  
  const sbHoldingsVal = document.getElementById('sb-holdings-value');
  if (sbHoldingsVal) {
    sbHoldingsVal.textContent = '$' + Math.round(portfolioTotal).toLocaleString() + ' total';
  }
}

// Animate prices live EVERY 2.5 SECONDS
setInterval(() => {
  COINS.forEach(c => {
    c.price = c.price * (1 + (Math.random() - 0.499) * 0.002);
    c.change += (Math.random() - 0.498) * 0.04;
  });
  
  buildTicker();
  updateDashboardStats();
  
  // Update BTC price on chart
  const btcEl = document.getElementById('btc-price');
  if (btcEl) {
    btcEl.textContent = '$' + Math.round(COINS[0].price).toLocaleString();
    btcEl.classList.remove('price-flash');
    void btcEl.offsetWidth;
    btcEl.classList.add('price-flash');
  }
  
  updateOrderBook();
  
  // Update portfolio if visible
  if (document.getElementById('page-portfolio')?.classList.contains('active')) {
    renderPortfolio();
  }
  
  // Update markets if visible
  if (document.getElementById('page-markets')?.classList.contains('active')) {
    renderMarkets(document.getElementById('market-search')?.value || '');
  }
}, 2500);

// ═══════════════════════════════════════════════════════════════
// CHART
// ═══════════════════════════════════════════════════════════════
let chartData = [];

function generateChartData(points = 60) {
  let price = 67000;
  const data = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    price += (Math.random() - 0.48) * 280;
    price = Math.max(64000, Math.min(70000, price));
    data.push({ price, time: now - i * 3600000 });
  }
  return data;
}

function renderChart(data) {
  if (!data.length) return;
  const path = document.getElementById('chart-path');
  const area = document.getElementById('chart-area');
  const glow = document.getElementById('chart-glow');
  if (!path) return;

  const W = 600, H = 240;
  const prices = data.map(d => d.price);
  const min = Math.min(...prices) * 0.999;
  const max = Math.max(...prices) * 1.001;

  const toX = i => (i / (data.length - 1)) * W;
  const toY = p => H - ((p - min) / (max - min)) * (H * 0.85) - H * 0.05;

  const pts = data.map((d, i) => [toX(i), toY(d.price)]);
  const pathD = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaD = pathD + ` L${pts[pts.length-1][0]},${H} L0,${H} Z`;

  path.setAttribute('d', pathD);
  area.setAttribute('d', areaD);
  glow.setAttribute('d', pathD);

  // Animate path
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.transition = 'stroke-dashoffset 1.5s ease';
  requestAnimationFrame(() => { path.style.strokeDashoffset = 0; });
}

function switchChartRange(range, btn) {
  document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const pts = { '1H': 24, '4H': 48, '1D': 72, '1W': 90, '1M': 120 };
  chartData = generateChartData(pts[range] || 60);
  renderChart(chartData);
}

// Chart interactivity
const chartSvg = document.getElementById('main-chart');
const vline = document.getElementById('cursor-vline');
const ccircle = document.getElementById('cursor-circle');
const tooltip = document.getElementById('chart-tooltip');
const tooltipPrice = document.getElementById('tooltip-price');
const tooltipTime = document.getElementById('tooltip-time');

if (chartSvg) {
  chartSvg.addEventListener('mousemove', e => {
    const rect = chartSvg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 600;
    const idx = Math.min(Math.floor(x / 600 * chartData.length), chartData.length - 1);
    if (idx < 0 || !chartData[idx]) return;
    const d = chartData[idx];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices) * 0.999;
    const max = Math.max(...prices) * 1.001;
    const y = 240 - ((d.price - min) / (max - min)) * (240 * 0.85) - 240 * 0.05;
    vline.setAttribute('x1', x); vline.setAttribute('x2', x);
    vline.style.opacity = '1';
    ccircle.setAttribute('cx', x); ccircle.setAttribute('cy', y);
    ccircle.style.opacity = '1';
    tooltipPrice.textContent = '$' + Math.round(d.price).toLocaleString();
    tooltipTime.textContent = new Date(d.time).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    tooltip.style.opacity = '1';
    tooltip.style.left = Math.min(e.clientX - rect.left + 12, rect.width - 120) + 'px';
    tooltip.style.top = Math.max(e.clientY - rect.top - 40, 0) + 'px';
  });
  chartSvg.addEventListener('mouseleave', () => {
    vline.style.opacity = '0'; ccircle.style.opacity = '0'; tooltip.style.opacity = '0';
  });
}

// ═══════════════════════════════════════════════════════════════
// ORDER BOOK
// ═══════════════════════════════════════════════════════════════
function generateOrderBook(mid) {
  const asks = [], bids = [];
  for (let i = 0; i < 8; i++) {
    const p = mid + (i + 0.5) * 12 + Math.random() * 8;
    const s = (Math.random() * 1.8 + 0.1).toFixed(4);
    asks.push({ price: p.toFixed(0), size: s, total: (p * s).toFixed(0) });
  }
  for (let i = 0; i < 8; i++) {
    const p = mid - (i + 0.5) * 12 - Math.random() * 8;
    const s = (Math.random() * 1.8 + 0.1).toFixed(4);
    bids.push({ price: p.toFixed(0), size: s, total: (p * s).toFixed(0) });
  }
  return { asks: asks.reverse(), bids };
}

function renderOrderBook(mid) {
  const { asks, bids } = generateOrderBook(mid);
  const maxAsk = Math.max(...asks.map(a => parseFloat(a.size)));
  const maxBid = Math.max(...bids.map(b => parseFloat(b.size)));
  document.getElementById('asks-container').innerHTML = asks.map(a => `
    <div class="ob-row">
      <div class="ob-bar ask" style="width:${(parseFloat(a.size)/maxAsk*70)}%"></div>
      <span class="ob-ask">$${parseInt(a.price).toLocaleString()}</span>
      <span class="ob-size">${a.size}</span>
      <span class="ob-total">${parseInt(a.total).toLocaleString()}</span>
    </div>
  `).join('');
  document.getElementById('bids-container').innerHTML = bids.map(b => `
    <div class="ob-row">
      <div class="ob-bar bid" style="width:${(parseFloat(b.size)/maxBid*70)}%"></div>
      <span class="ob-bid">$${parseInt(b.price).toLocaleString()}</span>
      <span class="ob-size">${b.size}</span>
      <span class="ob-total">${parseInt(b.total).toLocaleString()}</span>
    </div>
  `).join('');
  const obMid = document.getElementById('ob-mid-price');
  if (obMid) obMid.textContent = Math.round(mid).toLocaleString();
}

function updateOrderBook() {
  renderOrderBook(COINS[0].price);
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY FEED
// ═══════════════════════════════════════════════════════════════
const ACTIVITIES = [
  { icon:'↑', text:'Sold 0.5 ETH at $3,542', time:'2 min ago', bg:'rgba(255,45,120,0.1)' },
  { icon:'↓', text:'Bought 20 SOL at $189.2', time:'18 min ago', bg:'rgba(0,255,157,0.1)' },
  { icon:'⬡', text:'BTC alert triggered: above $67K', time:'45 min ago', bg:'rgba(0,212,255,0.1)' },
  { icon:'✦', text:'Portfolio up 4.82% today', time:'1 hr ago', bg:'rgba(124,58,237,0.1)' },
  { icon:'↓', text:'Bought 0.142 BTC at $67,420', time:'3 hr ago', bg:'rgba(0,255,157,0.1)' },
];
document.getElementById('activity-list').innerHTML = ACTIVITIES.map(a => `
  <div class="activity-item">
    <div class="activity-icon" style="background:${a.bg}">${a.icon}</div>
    <div class="activity-text">
      <div class="activity-main">${a.text}</div>
      <div class="activity-time">${a.time}</div>
    </div>
  </div>
`).join('');

// ALERTS
const ALERTS = [
  { name:'BTC > $68K', cond:'Bitcoin above $68,000', status:'triggered' },
  { name:'ETH < $3,400', cond:'Ethereum below $3,400', status:'watching' },
  { name:'SOL > $200', cond:'Solana above $200', status:'watching' },
  { name:'BNB < $580', cond:'BNB below $580', status:'watching' },
];
document.getElementById('alerts-list').innerHTML = ALERTS.map(a => `
  <div class="alert-item ${a.status}" onclick="showToast('◈ Alert', '${a.cond}')">
    <div class="alert-dot" style="background:${a.status === 'triggered' ? 'var(--neon-lime)' : 'var(--neon-azure)'}"></div>
    <div class="alert-info">
      <div class="alert-name">${a.name}</div>
      <div class="alert-cond">${a.cond}</div>
    </div>
    <span class="alert-status ${a.status}">${a.status.toUpperCase()}</span>
  </div>
`).join('');

// TOP MOVERS
const MOVERS = [
  { name: 'Solana', price: '$189.4', pct: '+5.61%', bar: 90, color: 'var(--neon-lime)' },
  { name: 'Avalanche', price: '$42.8', pct: '+4.22%', bar: 70, color: 'var(--neon-lime)' },
  { name: 'Bitcoin', price: '$67,842', pct: '+2.84%', bar: 50, color: 'var(--neon-lime)' },
  { name: 'Cardano', price: '$0.542', pct: '-2.18%', bar: 35, color: 'var(--neon-rose)' },
  { name: 'BNB', price: '$608.2', pct: '-1.23%', bar: 20, color: 'var(--neon-rose)' },
];
document.getElementById('movers-list').innerHTML = MOVERS.map((m, i) => `
  <div class="mover-item">
    <div class="mover-rank">${i + 1}</div>
    <div class="mover-coin">
      <div class="mover-name">${m.name}</div>
      <div class="mover-price">${m.price}</div>
    </div>
    <div class="mover-bar-wrap">
      <div class="mover-bar-track">
        <div class="mover-bar-fill" style="width:${m.bar}%;background:${m.color};box-shadow:0 0 8px ${m.color}88"></div>
      </div>
      <div class="mover-pct" style="color:${m.color}">${m.pct}</div>
    </div>
  </div>
`).join('');

// ═══════════════════════════════════════════════════════════════
// MARKETS TABLE
// ═══════════════════════════════════════════════════════════════
function renderSparkline(trend, up) {
  const W = 80, H = 28;
  const min = Math.min(...trend), max = Math.max(...trend);
  const pts = trend.map((v, i) => {
    const x = (i / (trend.length - 1)) * (W - 4) + 2;
    const y = H - ((v - min) / (max - min + 0.001)) * (H - 6) - 3;
    return `${x},${y}`;
  }).join(' ');
  const color = up ? '#00ff9d' : '#ff2d78';
  return `<svg width="${W}" height="${H}" class="mini-sparkline" style="overflow:visible">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"
      style="filter:drop-shadow(0 0 4px ${color}88)"/>
  </svg>`;
}

function renderMarkets(filter = '') {
  const tbody = document.getElementById('markets-tbody');
  const filtered = COINS.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.sym.toLowerCase().includes(filter.toLowerCase())
  );
  tbody.innerHTML = filtered.map((c, i) => `
    <tr>
      <td style="color:rgba(255,255,255,0.3); font-family:var(--font-mono); font-size:11px;">${i+1}</td>
      <td>
        <div class="coin-cell">
          <div class="coin-icon" style="background:${c.color}22; border-color:${c.color}44; color:${c.color}">${c.icon}</div>
          <div>
            <div class="coin-name">${c.name}</div>
            <div class="coin-sym">${c.sym}</div>
          </div>
        </div>
      </td>
      <td class="price-cell">$${c.price > 1000 ? c.price.toLocaleString(undefined, {maximumFractionDigits:0}) : c.price.toFixed(3)}</td>
      <td class="change-cell ${c.change >= 0 ? 'up' : 'down'}">${c.change >= 0 ? '+' : ''}${c.change.toFixed(2)}%</td>
      <td style="color:rgba(255,255,255,0.6);">${c.vol}</td>
      <td>
        <div class="cap-bar-wrap">
          <div class="cap-bar" style="width:${Math.random()*80+20}px"></div>
          <span style="color:rgba(255,255,255,0.7)">${c.mcap}</span>
        </div>
      </td>
      <td>${renderSparkline(c.trend, c.change >= 0)}</td>
      <td>
        <button class="watch-btn" onclick="toggleWatch(this, '${c.sym}')">★ WATCH</button>
      </td>
    </tr>
  `).join('');
}
renderMarkets();

function filterMarkets(val) { renderMarkets(val); }
function sortMarkets(key) {
  COINS.sort((a, b) => {
    if (key === 'name') return a.name.localeCompare(b.name);
    if (key === 'price') return b.price - a.price;
    if (key === 'change') return b.change - a.change;
    if (key === 'volume') return a.vol.localeCompare(b.vol);
    return 0;
  });
  renderMarkets(document.getElementById('market-search')?.value || '');
}
function toggleWatch(btn, sym) {
  btn.classList.toggle('active');
  showToast(btn.classList.contains('active') ? '★ Watchlist' : '☆ Watchlist',
    `${sym} ${btn.classList.contains('active') ? 'added to' : 'removed from'} watchlist`);
}

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO
// ═══════════════════════════════════════════════════════════════
function renderPortfolio() {
  const total = HOLDINGS.reduce((sum, h) => sum + h.coin.price * h.qty, 0);
  const colors = ['#00d4ff', '#7c3aed', '#00ff9d', '#f59e0b', '#ff2d78'];

  // Donut
  const donut = document.getElementById('donut-svg');
  const legend = document.getElementById('donut-legend');
  const cx = 110, cy = 110, r = 85, stroke = 26;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  donut.innerHTML = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="${stroke}"/>`;

  HOLDINGS.forEach((h, i) => {
    const val = h.coin.price * h.qty;
    const pct = val / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const dashOffset = -offset * circumference + circumference / 4;
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', r);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', colors[i]);
    el.setAttribute('stroke-width', stroke);
    el.setAttribute('stroke-dasharray', `${dash} ${gap}`);
    el.setAttribute('stroke-dashoffset', dashOffset);
    el.style.filter = `drop-shadow(0 0 8px ${colors[i]}88)`;
    el.style.transition = 'stroke-dashoffset 1s ease, stroke-dasharray 1s ease';
    donut.appendChild(el);
    offset += pct;
  });

  legend.innerHTML = HOLDINGS.map((h, i) => {
    const val = h.coin.price * h.qty;
    const pct = (val / total * 100).toFixed(1);
    return `
      <div class="legend-item">
        <div class="legend-dot" style="background:${colors[i]}; box-shadow:0 0 6px ${colors[i]}"></div>
        <div class="legend-name">${h.coin.name}</div>
        <div class="legend-val">$${Math.round(val).toLocaleString()}</div>
        <div class="legend-pct">${pct}%</div>
      </div>
    `;
  }).join('');

  // Holdings
  document.getElementById('holdings-list').innerHTML = HOLDINGS.map((h, i) => {
    const val = h.coin.price * h.qty;
    const pnl = (h.coin.price - h.costBasis) / h.costBasis * 100;
    return `
      <div class="holding-row">
        <div class="holding-icon" style="background:${colors[i]}15; border:1px solid ${colors[i]}33; color:${colors[i]}">${h.coin.icon}</div>
        <div class="holding-info">
          <div class="holding-name">${h.coin.name}</div>
          <div class="holding-sym">${h.coin.sym}</div>
        </div>
        ${renderSparkline(h.coin.trend, h.coin.change >= 0)}
        <div class="holding-amount">
          <div class="holding-val">$${Math.round(val).toLocaleString()}</div>
          <div class="holding-qty">${h.qty} ${h.coin.sym}</div>
        </div>
        <div class="holding-change" style="text-align:right;">
          <div class="holding-pct ${pnl >= 0 ? 'text-up' : 'text-down'}">${pnl >= 0 ? '+' : ''}${pnl.toFixed(1)}%</div>
          <div style="font-family:var(--font-mono);font-size:10px;color:rgba(255,255,255,0.3);">ALL TIME</div>
        </div>
      </div>
    `;
  }).join('');
}
renderPortfolio();

// ═══════════════════════════════════════════════════════════════
// TRADE PAGE
// ═══════════════════════════════════════════════════════════════
let currentTradeType = 'buy';

// Pair buttons
document.getElementById('trade-pairs').innerHTML = COINS.slice(0, 6).map((c, i) => `
  <button class="pair-btn ${i === 0 ? 'active' : ''}"
    onclick="selectPair(this, '${c.sym}', ${c.price})">${c.sym}/USDT</button>
`).join('');

function selectPair(btn, sym, price) {
  document.querySelectorAll('.pair-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const titleEl = document.getElementById('trade-chart-title');
  if (titleEl) titleEl.textContent = `⬢ ${sym} / USDT`;
  document.getElementById('trade-price').value = price.toFixed(2);
  document.getElementById('trade-price').placeholder = `Market: $${price.toFixed(2)}`;
  updateSummary();
}

function setTradeType(type) {
  currentTradeType = type;
  document.getElementById('trade-buy-btn').classList.toggle('active', type === 'buy');
  document.getElementById('trade-sell-btn').classList.toggle('active', type === 'sell');
  const execBtn = document.getElementById('execute-btn');
  execBtn.className = `execute-btn ${type}`;
  execBtn.textContent = `⬡ EXECUTE ${type.toUpperCase()} ORDER`;
  updateSummary();
}

function selectOrderType(btn) {
  document.querySelectorAll('.order-type-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setPct(pct) {
  const maxBal = 2.4821;
  document.getElementById('trade-amount').value = (maxBal * pct / 100).toFixed(4);
  updateSummary();
}

function updateSummary() {
  const amt = parseFloat(document.getElementById('trade-amount').value) || 0;
  const price = parseFloat(document.getElementById('trade-price').value) || COINS[0].price;
  const total = amt * price;
  const fee = total * 0.0005;
  document.getElementById('sum-total').textContent = '$' + total.toFixed(2);
  document.getElementById('sum-fee').textContent = '$' + fee.toFixed(2);
  document.getElementById('sum-receive').textContent = currentTradeType === 'buy'
    ? amt.toFixed(6) + ' BTC'
    : '$' + (total - fee).toFixed(2);
}

function executeTrade() {
  const amt = parseFloat(document.getElementById('trade-amount').value) || 0;
  if (amt <= 0) { showToast('⚠ Error', 'Please enter a valid amount', true); return; }
  showToast(
    currentTradeType === 'buy' ? '✦ Order Executed!' : '✦ Sold!',
    `${currentTradeType.toUpperCase()} ${amt} BTC @ $${document.getElementById('trade-price').value || 'Market'}`
  );
  document.getElementById('trade-amount').value = '';
  updateSummary();
}

// Recent trades
document.getElementById('recent-trades').innerHTML = [
  { type:'buy', sym:'BTC', qty:'0.142', price:'$67,420', time:'2 min ago' },
  { type:'sell', sym:'ETH', qty:'2.4', price:'$3,540', time:'18 min ago' },
  { type:'buy', sym:'SOL', qty:'42', price:'$186.2', time:'1 hr ago' },
].map(t => `
  <div style="display:flex; gap:12px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(0,212,255,0.04);">
    <span class="tx-type ${t.type === 'buy' ? 'tx-buy' : 'tx-sell'}">${t.type.toUpperCase()}</span>
    <span style="font-family:var(--font-mono); font-size:12px; color:#fff; flex:1">${t.qty} ${t.sym}</span>
    <span style="font-family:var(--font-mono); font-size:12px; color:rgba(255,255,255,0.6)">${t.price}</span>
    <span style="font-family:var(--font-mono); font-size:10px; color:rgba(255,255,255,0.3)">${t.time}</span>
  </div>
`).join('');

// ═══════════════════════════════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════════════════════════════
function renderHistory(filter = 'all', search = '') {
  let data = HISTORY_DATA;
  if (filter !== 'all') data = data.filter(t => t.type === filter);
  if (search) data = data.filter(t =>
    t.sym.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );
  document.getElementById('history-tbody').innerHTML = data.map(t => `
    <tr>
      <td style="color:rgba(0,212,255,0.6)">${t.id}</td>
      <td><span class="tx-type tx-${t.type}">${t.type.toUpperCase()}</span></td>
      <td style="font-weight:600; color:#fff">${t.sym}</td>
      <td>${t.amount}</td>
      <td class="price-cell">${t.price}</td>
      <td style="font-weight:600; color:#fff">${t.total}</td>
      <td style="color:rgba(255,255,255,0.4)">${t.date}</td>
      <td><span class="tx-status ${t.status}">${t.status.toUpperCase()}</span></td>
    </tr>
  `).join('');
}
renderHistory();

function filterHistory(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentHistoryFilter = type;
  renderHistory(type);
}

function filterHistorySearch(val) {
  renderHistory(currentHistoryFilter, val);
}

// ═══════════════════════════════════════════════════════════════
// PAGE NAVIGATION
// ═══════════════════════════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const navBtn = document.getElementById('nav-' + id);
  if (navBtn) navBtn.classList.add('active');
  if (id === 'dashboard') { initDashboard(); }
  if (id === 'markets') { renderMarkets(); }
}

function initDashboard() {
  chartData = generateChartData(60);
  renderChart(chartData);
  renderOrderBook(COINS[0].price);
  updateDashboardStats(); // Initialize live stats
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════
function switchSettings(section, btn) {
  document.querySelectorAll('.settings-nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('⊛ Settings', `Navigated to ${section} settings`);
}

function setAccent(color, dot) {
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  dot.classList.add('active');
  document.documentElement.style.setProperty('--neon-azure', color);
  showToast('◈ Accent updated', `Interface color set to ${color}`);
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════
function showToast(title, msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">⬡</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
    <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
  if (!toast) return;
  toast.classList.add('removing');
  setTimeout(() => toast.remove(), 300);
}

// ═══════════════════════════════════════════════════════════════
// REFRESH
// ═══════════════════════════════════════════════════════════════
function refreshData() {
  showToast('↻ Refreshed', 'All market data synchronized');
  chartData = generateChartData(60);
  renderChart(chartData);
  renderOrderBook(COINS[0].price);
  renderMarkets();
  renderPortfolio();
}

// ═══════════════════════════════════════════════════════════════
// INIT — App starts with auth overlay, initDashboard called on login
// ═══════════════════════════════════════════════════════════════
// initDashboard is called via enterApp() after auth completes

// ═══════════════════════════════════════════════════════════════
// AUTH NEURAL CANVAS (small version for auth bg)
// ═══════════════════════════════════════════════════════════════
(function() {
  const ac = document.getElementById('auth-neural');
  if (!ac) return;
  const ax = ac.getContext('2d');
  let aw, ah, anodes = [];
  function initA() {
    aw = ac.width = ac.offsetWidth; ah = ac.height = ac.offsetHeight;
    anodes = [];
    for (let i = 0; i < 30; i++) anodes.push({
      x: Math.random()*aw, y: Math.random()*ah,
      vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
      pulse: Math.random()*Math.PI*2
    });
  }
  function drawA() {
    ax.clearRect(0,0,aw,ah);
    anodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy; n.pulse+=0.025;
      if(n.x<0||n.x>aw) n.vx*=-1;
      if(n.y<0||n.y>ah) n.vy*=-1;
    });
    for (let i=0;i<anodes.length;i++) for(let j=i+1;j<anodes.length;j++) {
      const dx=anodes[i].x-anodes[j].x, dy=anodes[i].y-anodes[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){ ax.beginPath(); ax.moveTo(anodes[i].x,anodes[i].y); ax.lineTo(anodes[j].x,anodes[j].y);
        ax.strokeStyle=`rgba(0,212,255,${(1-d/130)*.25})`; ax.lineWidth=0.7; ax.stroke(); }
    }
    anodes.forEach(n => {
      const p=Math.sin(n.pulse)*.5+.5;
      ax.beginPath(); ax.arc(n.x,n.y,1.5*(1+p*.4),0,Math.PI*2);
      ax.fillStyle=`rgba(0,212,255,${.25+p*.4})`; ax.fill();
    });
    requestAnimationFrame(drawA);
  }
  setTimeout(() => { initA(); drawA(); }, 100);
  window.addEventListener('resize', initA);
})();

// ═══════════════════════════════════════════════════════════════
// AUTH STATE
// ═══════════════════════════════════════════════════════════════
let generatedOTP = '';
let resetEmail = '';
let resendInterval = null;
const DEMO_USER = { email: 'demo@nexus.io', password: 'Demo@1234', name: 'Nexus Trader' };
const users = [DEMO_USER]; // In-memory user store

function showScreen(id) {
  document.querySelectorAll('.auth-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Animate card
  const card = document.getElementById('auth-card');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'authCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both';
}

// ── Toggle password visibility ──
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isShown = input.type === 'text';
  input.type = isShown ? 'password' : 'text';
  input.classList.toggle('shown', !isShown);
  btn.classList.toggle('visible', !isShown);
  // Swap eye icon
  btn.innerHTML = isShown
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
       </svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
       </svg>`;
}

// ── Toggle checkbox ──
function toggleCheck(id) {
  const el = document.getElementById(id);
  el.classList.toggle('checked');
}

// ── Clear error ──
function clearAuthError(errorId) {
  document.getElementById(errorId).classList.remove('show');
}

function showAuthError(errorId, msgId, msg) {
  document.getElementById(msgId).textContent = msg;
  document.getElementById(errorId).classList.add('show');
  // Shake relevant inputs
  document.querySelectorAll(`#${errorId}`).forEach(e => e.parentElement.querySelectorAll('.auth-input').forEach(i => {
    i.classList.add('error');
    setTimeout(() => i.classList.remove('error'), 500);
  }));
}

// ── Password strength meter ──
function checkPasswordStrength(pw, prefix = 'pw') {
  const wrap = document.getElementById('pw-strength-wrap');
  if (wrap) wrap.style.display = pw.length > 0 ? 'block' : 'none';

  const fillId = prefix === 'pw' ? 'pw-strength-fill' : 'new-strength-fill';
  const textId = prefix === 'pw' ? 'pw-strength-text' : 'new-strength-text';

  const hasLength = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);

  // Update requirement dots (signup only)
  if (prefix === 'pw') {
    const toggle = (id, met) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('met', met);
    };
    toggle('req-length', hasLength);
    toggle('req-upper', hasUpper);
    toggle('req-num', hasNum);
    toggle('req-special', hasSpecial);
  }

  const score = [hasLength, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
  const fills = ['0%', '25%', '50%', '75%', '100%'];
  const colors = ['#333', '#ff2d78', '#f59e0b', '#00d4ff', '#00ff9d'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const fillEl = document.getElementById(fillId);
  const textEl = document.getElementById(textId);
  if (fillEl) { fillEl.style.width = fills[score]; fillEl.style.background = colors[score]; }
  if (textEl) { textEl.textContent = labels[score]; textEl.style.color = colors[score]; }
}

function checkConfirmMatch() {
  const pw = document.getElementById('signup-password').value;
  const cf = document.getElementById('signup-confirm').value;
  const el = document.getElementById('signup-confirm');
  if (cf.length > 0) el.style.borderColor = pw === cf ? 'rgba(0,255,157,0.5)' : 'rgba(255,45,120,0.5)';
}

// ── Login ──
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  if (!email || !pw) {
    showAuthError('login-error', 'login-error-msg', 'Please enter your email and password.');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showAuthError('login-error', 'login-error-msg', 'Please enter a valid email address.');
    return;
  }

  // Simulate loading
  btn.classList.add('loading');
  btn.textContent = '';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.textContent = 'SIGN IN';

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pw);
    if (user) {
      showScreen('screen-success');
      document.getElementById('success-title').textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
      document.getElementById('success-msg').textContent = 'NEURAL SYSTEMS SYNCHRONIZED. READY TO TRADE.';
      setTimeout(enterApp, 2200);
    } else {
      showAuthError('login-error', 'login-error-msg', 'Incorrect email or password. Try demo@nexus.io / Demo@1234');
      document.getElementById('login-password').value = '';
    }
  }, 1200);
}

// ── Sign Up ──
function doSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pw    = document.getElementById('signup-password').value;
  const cf    = document.getElementById('signup-confirm').value;
  const terms = document.getElementById('terms-check').classList.contains('checked');

  if (!name || !email || !pw || !cf) {
    showAuthError('signup-error', 'signup-error-msg', 'Please fill in all fields.');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showAuthError('signup-error', 'signup-error-msg', 'Please enter a valid email address.');
    return;
  }
  if (pw.length < 8) {
    showAuthError('signup-error', 'signup-error-msg', 'Password must be at least 8 characters.');
    return;
  }
  if (pw !== cf) {
    showAuthError('signup-error', 'signup-error-msg', 'Passwords do not match.');
    document.getElementById('signup-confirm').classList.add('error');
    setTimeout(() => document.getElementById('signup-confirm').classList.remove('error'), 500);
    return;
  }
  if (!terms) {
    showAuthError('signup-error', 'signup-error-msg', 'Please accept the Terms of Service.');
    return;
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showAuthError('signup-error', 'signup-error-msg', 'An account with this email already exists.');
    return;
  }

  // Register
  users.push({ email, password: pw, name });
  showScreen('screen-success');
  document.getElementById('success-title').textContent = `Welcome, ${name.split(' ')[0]}!`;
  document.getElementById('success-msg').textContent = 'YOUR NEXUS ACCOUNT IS ACTIVATED. NEURAL LINK READY.';
  setTimeout(enterApp, 2200);
}

// ── Social Login ──
function doSocialLogin(provider) {
  const btn = document.createElement('div');
  showScreen('screen-success');
  document.getElementById('success-title').textContent = `${provider} Connected!`;
  document.getElementById('success-msg').textContent = 'IDENTITY VERIFIED. ENTERING NEXUS DASHBOARD.';
  setTimeout(enterApp, 2000);
}

// ── Forgot Password: Send Code ──
function generateOTPCode() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function sendResetCode() {
  const email = document.getElementById('forgot-email').value.trim();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    const el = document.getElementById('forgot-email');
    el.classList.add('error');
    setTimeout(() => el.classList.remove('error'), 500);
    return;
  }

  resetEmail = email;
  generatedOTP = generateOTPCode();

  // Show OTP in alert (as requested) AND in the UI
  showScreen('screen-otp');
  document.getElementById('otp-subtitle').textContent = `CODE SENT TO ${email.toUpperCase()}`;

  // Build visual OTP display
  const display = document.getElementById('otp-display');
  display.innerHTML = generatedOTP.split('').map((d, i) =>
    `<div class="otp-box" style="animation-delay:${i*0.07}s">${d}</div>`
  ).join('');

  // Build 6 input boxes
  const inputRow = document.getElementById('otp-input-row');
  inputRow.innerHTML = Array.from({length:6}, (_, i) =>
    `<input class="otp-single" id="otp-${i}" maxlength="1" type="text" inputmode="numeric"
      onkeyup="otpAutoTab(this, ${i})" oninput="this.value=this.value.replace(/[^0-9]/,''); otpAutoTab(this, ${i})">`
  ).join('');
  document.getElementById('otp-0').focus();

  // Start resend timer
  startResendTimer();

  // Show browser alert with the code (as requested)
  setTimeout(() => {
    alert(`🔐 NEXUS Recovery Code\n\nYour 6-digit verification code is:\n\n  ${generatedOTP}\n\nThis code expires in 10 minutes.\nDo not share this code with anyone.`);
  }, 400);
}

function otpAutoTab(el, idx) {
  if (el.value.length === 1 && idx < 5) {
    document.getElementById(`otp-${idx+1}`)?.focus();
  }
  if (el.value.length === 0 && idx > 0) {
    document.getElementById(`otp-${idx-1}`)?.focus();
  }
}

function verifyOTP() {
  const entered = Array.from({length:6}, (_,i) => document.getElementById(`otp-${i}`)?.value || '').join('');
  if (entered.length < 6) {
    document.getElementById('otp-error-msg').textContent = 'Please enter all 6 digits.';
    document.getElementById('otp-error').classList.add('show');
    return;
  }
  if (entered === generatedOTP) {
    document.getElementById('otp-error').classList.remove('show');
    showScreen('screen-newpass');
  } else {
    document.getElementById('otp-error-msg').textContent = 'Incorrect code. Check the code shown above and try again.';
    document.getElementById('otp-error').classList.add('show');
    document.querySelectorAll('.otp-single').forEach(i => {
      i.classList.add('error'); setTimeout(() => i.classList.remove('error'), 500);
      i.style.borderColor = 'rgba(255,45,120,0.5)';
      setTimeout(() => i.style.borderColor = '', 1000);
    });
  }
}

function startResendTimer() {
  clearInterval(resendInterval);
  let secs = 60;
  document.getElementById('resend-btn').style.display = 'none';
  document.getElementById('resend-countdown').style.display = 'inline';
  document.getElementById('resend-seconds').textContent = secs;
  resendInterval = setInterval(() => {
    secs--;
    document.getElementById('resend-seconds').textContent = secs;
    if (secs <= 0) {
      clearInterval(resendInterval);
      document.getElementById('resend-btn').style.display = 'inline';
      document.getElementById('resend-countdown').style.display = 'none';
    }
  }, 1000);
}

function resendCode() {
  generatedOTP = generateOTPCode();
  document.getElementById('otp-display').innerHTML = generatedOTP.split('').map((d,i) =>
    `<div class="otp-box" style="animation-delay:${i*0.07}s">${d}</div>`
  ).join('');
  document.querySelectorAll('.otp-single').forEach(i => i.value = '');
  document.getElementById('otp-0').focus();
  document.getElementById('otp-error').classList.remove('show');
  startResendTimer();
  setTimeout(() => {
    alert(`🔐 NEXUS New Recovery Code\n\nYour new verification code is:\n\n  ${generatedOTP}\n\nThis code expires in 10 minutes.`);
  }, 200);
}

// ── New password reset ──
function doPasswordReset() {
  const pw = document.getElementById('new-password').value;
  const cf = document.getElementById('new-confirm').value;
  if (pw.length < 8) {
    document.getElementById('new-password').classList.add('error');
    setTimeout(() => document.getElementById('new-password').classList.remove('error'), 500);
    return;
  }
  if (pw !== cf) {
    document.getElementById('new-confirm').classList.add('error');
    setTimeout(() => document.getElementById('new-confirm').classList.remove('error'), 500);
    return;
  }
  // Update stored password
  const user = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase());
  if (user) user.password = pw;

  showScreen('screen-success');
  document.getElementById('success-title').textContent = 'Password Reset!';
  document.getElementById('success-msg').textContent = 'YOUR NEW PASSWORD HAS BEEN SET. YOU CAN NOW SIGN IN.';
  setTimeout(() => showScreen('screen-login'), 2500);
}

// ── Enter the app ──
function enterApp() {
  const overlay = document.getElementById('auth-overlay');
  overlay.classList.add('hidden');
  setTimeout(() => { overlay.style.display = 'none'; }, 700);
  initDashboard();
  // Welcome toast
  const userName = users[users.length-1]?.name?.split(' ')[0] || 'Trader';
  setTimeout(() => showToast('⬢ NEXUS ONLINE', `Welcome, ${userName} — Neural intelligence active`), 300);
}

// Welcome toast

// Periodic price updates in portfolio
setInterval(() => {
  HOLDINGS.forEach(h => {
    h.coin.price = h.coin.price * (1 + (Math.random() - 0.499) * 0.003);
  });
  if (document.getElementById('page-portfolio').classList.contains('active')) {
    renderPortfolio();
  }
  updateOrderBook();
}, 5000);

// Random activity feed updates
const activityMsgs = [
  'Neural pattern detected: BTC breakout imminent',
  'Whale alert: 400 BTC moved on-chain',
  'SOL network activity +18% in last hour',
  'ETH gas fees at 7-day low: 12 gwei',
];
setInterval(() => {
  const el = document.getElementById('activity-list');
  if (!el) return;
  const msg = activityMsgs[Math.floor(Math.random() * activityMsgs.length)];
  const icons = ['◈', '⬡', '◎', '✦'];
  const icon = icons[Math.floor(Math.random() * icons.length)];
  const newItem = document.createElement('div');
  newItem.className = 'activity-item';
  newItem.style.animation = 'pageIn 0.3s ease';
  newItem.innerHTML = `
    <div class="activity-icon" style="background:rgba(0,212,255,0.1)">${icon}</div>
    <div class="activity-text">
      <div class="activity-main">${msg}</div>
      <div class="activity-time">Just now</div>
    </div>
  `;
  el.insertBefore(newItem, el.firstChild);
  if (el.children.length > 6) el.lastElementChild?.remove();
}, 12000);
// ═══════════════════════════════════════════════════════════════
// NOTIFICATION PANEL
// ═══════════════════════════════════════════════════════════════
const NOTIFICATIONS = [
  { icon:'▲', color:'var(--neon-lime)', title:'BTC Alert Triggered', body:'Bitcoin crossed $67,000', time:'2 min ago' },
  { icon:'⬡', color:'var(--neon-azure)', title:'Trade Executed', body:'Bought 0.142 BTC @ $67,420', time:'18 min ago' },
  { icon:'◈', color:'var(--neon-violet)', title:'Portfolio Milestone', body:'Total value exceeded $80K', time:'1 hr ago' },
  { icon:'★', color:'var(--neon-amber)', title:'New Feature', body:'Neural market analysis is now live', time:'3 hr ago' },
  { icon:'⚠', color:'var(--neon-rose)', title:'Price Drop Alert', body:'ADA dropped below $0.55', time:'5 hr ago' },
];

function renderNotifPanel() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  list.innerHTML = NOTIFICATIONS.map((n, i) => `
    <div style="
      display:flex; gap:12px; padding:14px 20px;
      border-bottom:1px solid rgba(0,212,255,0.04);
      cursor:pointer; transition:background 0.15s;
    " onmouseenter="this.style.background='rgba(0,212,255,0.04)'"
      onmouseleave="this.style.background=''"
      onclick="dismissNotif(this, ${i})">
      <div style="
        width:34px; height:34px; border-radius:10px; flex-shrink:0;
        background:${n.color}15; display:flex; align-items:center;
        justify-content:center; color:${n.color}; font-size:14px;
        border:1px solid ${n.color}22;
      ">${n.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px; font-weight:600; color:#fff; margin-bottom:3px;">${n.title}</div>
        <div style="font-family:var(--font-mono); font-size:11px; color:rgba(255,255,255,0.4);">${n.body}</div>
      </div>
      <div style="font-family:var(--font-mono); font-size:9px; color:rgba(255,255,255,0.25); flex-shrink:0; padding-top:3px;">${n.time}</div>
    </div>
  `).join('');
}
renderNotifPanel();

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  const badge = document.getElementById('notif-badge');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  badge.style.display = 'none'; // Clear badge on open
}

function dismissNotif(el, idx) {
  el.style.transition = 'opacity 0.3s, max-height 0.3s';
  el.style.opacity = '0'; el.style.maxHeight = '0'; el.style.overflow = 'hidden';
  NOTIFICATIONS.splice(idx, 1);
  setTimeout(() => renderNotifPanel(), 350);
}

function clearNotifications() {
  NOTIFICATIONS.length = 0;
  renderNotifPanel();
  document.getElementById('notif-panel').style.display = 'none';
  showToast('🔔 Cleared', 'All notifications dismissed');
}

// Push new notification
function pushNotification(title, body, icon='⬡', color='var(--neon-azure)') {
  NOTIFICATIONS.unshift({ icon, color, title, body, time: 'Just now' });
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'block';
  renderNotifPanel();
}

// Close notif panel on outside click
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.style.display = 'none';
  }
});

// ═══════════════════════════════════════════════════════════════
// QUICK TRADE MODAL
// ═══════════════════════════════════════════════════════════════
let qtType = 'buy';
function openQuickTrade() {
  const sel = document.getElementById('qt-asset');
  if (sel && sel.options.length === 0) {
    sel.innerHTML = COINS.map(c => `<option value="${c.sym}">${c.sym} — ${c.name}</option>`).join('');
  }
  document.getElementById('quick-modal').style.display = 'flex';
}
function closeQuickTrade() {
  document.getElementById('quick-modal').style.display = 'none';
  document.getElementById('qt-amount').value = '';
}
function setQTType(type) {
  qtType = type;
  const buyBtn = document.getElementById('qt-buy-btn');
  const sellBtn = document.getElementById('qt-sell-btn');
  const execBtn = document.getElementById('qt-execute');
  if (type === 'buy') {
    buyBtn.style.cssText = ''; sellBtn.style.background='rgba(255,255,255,0.05)'; sellBtn.style.color='rgba(255,255,255,0.4)'; sellBtn.style.boxShadow='none';
    execBtn.className = 'execute-btn buy'; execBtn.textContent = '⚡ EXECUTE BUY';
  } else {
    sellBtn.style.cssText = ''; buyBtn.style.background='rgba(255,255,255,0.05)'; buyBtn.style.color='rgba(255,255,255,0.4)'; buyBtn.style.boxShadow='none';
    execBtn.className = 'execute-btn sell'; execBtn.textContent = '⚡ EXECUTE SELL';
  }
}
function executeQuickTrade() {
  const amt = parseFloat(document.getElementById('qt-amount').value);
  const asset = document.getElementById('qt-asset').value;
  if (!amt || amt <= 0) {
    document.getElementById('qt-amount').classList.add('error');
    setTimeout(() => document.getElementById('qt-amount').classList.remove('error'), 500);
    return;
  }
  closeQuickTrade();
  showToast(
    qtType === 'buy' ? '✦ Buy Order Filled!' : '✦ Sell Order Filled!',
    `${qtType.toUpperCase()} $${amt.toLocaleString()} of ${asset}`
  );
  pushNotification(`Trade Executed`, `${qtType.toUpperCase()} $${amt.toLocaleString()} ${asset}`, '⬡', qtType==='buy'?'var(--neon-lime)':'var(--neon-rose)');
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  // Ignore if in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
    if (e.key === 'Escape') {
      e.target.blur();
      closeQuickTrade();
      document.getElementById('auth-overlay')?.classList.contains('hidden') || null;
    }
    return;
  }
  switch (e.key.toLowerCase()) {
    case 'q': openQuickTrade(); break;
    case 'd': showPage('dashboard'); break;
    case 'm': showPage('markets'); break;
    case 'p': showPage('portfolio'); break;
    case 't': showPage('trade'); break;
    case 'h': showPage('history'); break;
    case 's': showPage('settings'); break;
    case 'r': refreshData(); break;
    case 'escape': closeQuickTrade(); document.getElementById('notif-panel').style.display='none'; break;
    case '/': {
      const si = document.getElementById('market-search');
      if (si) { showPage('markets'); setTimeout(()=>si.focus(), 100); }
      break;
    }
  }
});

// Modal ESC/Enter
document.getElementById('quick-modal').addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuickTrade();
  if (e.key === 'Enter') executeQuickTrade();
});

// Periodic random notifications
setTimeout(() => {
  const notifs = [
    ['Whale Alert 🐋', '1,200 ETH moved on-chain', '◈', 'var(--neon-azure)'],
    ['Price Breakout', 'BTC breaks $68K resistance', '▲', 'var(--neon-lime)'],
    ['DeFi Alert', 'SOL TVL reaches new ATH', '◎', 'var(--neon-violet)'],
  ];
  const rand = notifs[Math.floor(Math.random() * notifs.length)];
  pushNotification(...rand);
}, 30000);

// ═══════════════════════════════════════════════════════════════
// AUTH ENHANCEMENTS — New functions
// ═══════════════════════════════════════════════════════════════
let selectedAvatar = '🦅';
function selectAvatar(el, emoji) {
  document.querySelectorAll('.avatar-opt').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
  selectedAvatar = emoji;
  document.getElementById('summary-avatar').textContent = emoji;
}

let signupStep = 1;
function signupNextStep(from) {
  if (from === 1) {
    const name = document.getElementById('signup-name')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    if (!name || !email) {
      showAuthError('signup-error', 'signup-error-msg', 'Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showAuthError('signup-error', 'signup-error-msg', 'Please enter a valid email address.');
      return;
    }
    document.getElementById('signup-step-1').style.display = 'none';
    document.getElementById('signup-step-2').style.display = 'block';
    document.getElementById('spd-1').classList.add('done');
    document.getElementById('spd-2').classList.add('active');
    document.getElementById('spl-1').classList.add('done');
    signupStep = 2;
  } else if (from === 2) {
    const pw = document.getElementById('signup-password')?.value;
    const cf = document.getElementById('signup-confirm')?.value;
    if (!pw || pw.length < 8) {
      showAuthError('signup-error', 'signup-error-msg', 'Password must be at least 8 characters.');
      document.getElementById('signup-password').classList.add('error');
      setTimeout(() => document.getElementById('signup-password').classList.remove('error'), 500);
      return;
    }
    if (pw !== cf) {
      showAuthError('signup-error', 'signup-error-msg', 'Passwords do not match.');
      document.getElementById('signup-confirm').classList.add('error');
      setTimeout(() => document.getElementById('signup-confirm').classList.remove('error'), 500);
      return;
    }
    document.getElementById('signup-step-2').style.display = 'none';
    document.getElementById('signup-step-3').style.display = 'block';
    document.getElementById('spd-2').classList.add('done');
    document.getElementById('spd-3').classList.add('active');
    document.getElementById('spl-2').classList.add('done');
    // Fill summary
    document.getElementById('summary-name').textContent = document.getElementById('signup-name').value.trim();
    document.getElementById('summary-email').textContent = document.getElementById('signup-email').value.trim();
    document.getElementById('summary-avatar').textContent = selectedAvatar;
    signupStep = 3;
  }
}

function signupGoBack(toStep) {
  if (toStep === 1) {
    document.getElementById('signup-step-2').style.display = 'none';
    document.getElementById('signup-step-1').style.display = 'block';
    document.getElementById('spd-2').classList.remove('active', 'done');
    document.getElementById('spl-1').classList.remove('done');
    signupStep = 1;
  } else if (toStep === 2) {
    document.getElementById('signup-step-3').style.display = 'none';
    document.getElementById('signup-step-2').style.display = 'block';
    document.getElementById('spd-3').classList.remove('active', 'done');
    document.getElementById('spl-2').classList.remove('done');
    signupStep = 2;
  }
}

// Reset signup steps when showing signup screen
const _origShowScreen = window.showScreen;
window.showScreen = function(id) {
  if (id === 'screen-signup') {
    // Reset steps
    const s1 = document.getElementById('signup-step-1');
    const s2 = document.getElementById('signup-step-2');
    const s3 = document.getElementById('signup-step-3');
    if (s1) s1.style.display = 'block';
    if (s2) s2.style.display = 'none';
    if (s3) s3.style.display = 'none';
    ['spd-1','spd-2','spd-3'].forEach((id,i) => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('done','active'); if(i===0) el.classList.add('active'); }
    });
    ['spl-1','spl-2'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('done');
    });
    signupStep = 1;
    selectedAvatar = '🦅';
  }
  _origShowScreen(id);
};

function doBiometricLogin() {
  // Simulate biometric with animation
  showToast('☝ Biometric', 'Scanning fingerprint...');
  const btn = document.querySelector('.biometric-row');
  if (btn) {
    btn.style.color = 'var(--neon-lime)';
    setTimeout(() => {
      showScreen('screen-success');
      document.getElementById('success-title').textContent = 'Identity Verified!';
      document.getElementById('success-msg').textContent = 'BIOMETRIC AUTHENTICATION SUCCESSFUL. NEURAL LINK READY.';
      startSuccessCountdown();
      setTimeout(enterApp, 2500);
    }, 1800);
  }
}

function startSuccessCountdown() {
  let count = 3;
  const el = document.getElementById('success-auto-msg');
  if (!el) return;
  el.textContent = `ENTERING IN ${count} SECONDS...`;
  const t = setInterval(() => {
    count--;
    if (el) el.textContent = count > 0 ? `ENTERING IN ${count} SECONDS...` : 'ENTERING NOW...';
    if (count <= 0) clearInterval(t);
  }, 1000);
}

// Override enterApp to update avatar
const _origEnterApp = window.enterApp;
window.enterApp = function() {
  // Update sidebar avatar and account dropdown
  const currentUser = users[users.length - 1];
  if (currentUser) {
    const avatarEl = document.getElementById('sidebar-avatar-btn');
    if (avatarEl) avatarEl.textContent = currentUser.avatar || '🦅';
    const accAvatar = document.getElementById('acc-avatar-display');
    if (accAvatar) accAvatar.textContent = currentUser.avatar || '🦅';
    const accName = document.getElementById('acc-name-display');
    if (accName) accName.textContent = currentUser.name || 'Trader';
    const accEmail = document.getElementById('acc-email-display');
    if (accEmail) accEmail.textContent = currentUser.email || '';
  }
  _origEnterApp();
};

// Enhanced signup to store avatar
const _origDoSignup = window.doSignup;
window.doSignup = function() {
  const name  = document.getElementById('signup-name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const pw    = document.getElementById('signup-password')?.value;
  const cf    = document.getElementById('signup-confirm')?.value;
  const terms = document.getElementById('terms-check')?.classList.contains('checked');
  if (!name || !email || !pw || !cf) {
    showAuthError('signup-error', 'signup-error-msg', 'Please fill in all fields.'); return;
  }
  if (pw !== cf) {
    showAuthError('signup-error', 'signup-error-msg', 'Passwords do not match.'); return;
  }
  if (!terms) {
    showAuthError('signup-error', 'signup-error-msg', 'Please accept the Terms of Service.'); return;
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showAuthError('signup-error', 'signup-error-msg', 'An account with this email already exists.'); return;
  }
  users.push({ email, password: pw, name, avatar: selectedAvatar });
  showScreen('screen-success');
  document.getElementById('success-title').textContent = `Welcome, ${name.split(' ')[0]}!`;
  document.getElementById('success-msg').textContent = 'YOUR NEXUS ACCOUNT IS ACTIVATED. NEURAL LINK READY.';
  document.getElementById('success-icon').textContent = selectedAvatar;
  startSuccessCountdown();
  setTimeout(enterApp, 2800);
};

// ═══════════════════════════════════════════════════════════════
// ACCOUNT DROPDOWN
// ═══════════════════════════════════════════════════════════════
function toggleAccountDropdown() {
  const d = document.getElementById('account-dropdown');
  d.style.display = d.style.display === 'block' ? 'none' : 'block';
}
function closeAccountDropdown() {
  const d = document.getElementById('account-dropdown');
  if (d) d.style.display = 'none';
}
document.addEventListener('click', e => {
  const d = document.getElementById('account-dropdown');
  const btn = document.getElementById('sidebar-avatar-btn');
  if (d && btn && !d.contains(e.target) && !btn.contains(e.target)) {
    d.style.display = 'none';
  }
});

let twofaEnabled = false;
function toggle2FA() {
  twofaEnabled = !twofaEnabled;
  const badge = document.getElementById('twofa-status-badge');
  if (badge) {
    badge.textContent = twofaEnabled ? 'ON' : 'OFF';
    badge.className = `twofa-badge ${twofaEnabled ? 'on' : 'off'}`;
  }
  showToast('🔐 2FA ' + (twofaEnabled ? 'Enabled' : 'Disabled'),
    twofaEnabled ? 'Two-factor authentication is now active' : '2FA has been turned off');
}

function doLogout() {
  closeAccountDropdown();
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    overlay.classList.remove('hidden');
  }
  showScreen('screen-login');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  showToast('⬡ Signed Out', 'See you next time, Trader!');
}

let darkMode = true;
function toggleTheme() {
  darkMode = !darkMode;
  if (!darkMode) {
    document.documentElement.style.setProperty('--plasma-0', '#f0f2f5');
    document.documentElement.style.setProperty('--glass', 'rgba(255,255,255,0.8)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(0,100,200,0.15)');
    document.body.style.color = '#1a1a2e';
    showToast('◑ Light Mode', 'Switched to light theme');
  } else {
    document.documentElement.style.setProperty('--plasma-0', '#050508');
    document.documentElement.style.setProperty('--glass', 'rgba(20,20,42,0.7)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(0,212,255,0.12)');
    document.body.style.color = '#e0e0f0';
    showToast('◑ Dark Mode', 'Switched to dark theme');
  }
}

// ═══════════════════════════════════════════════════════════════
// WATCHLIST PAGE
// ═══════════════════════════════════════════════════════════════
let watchlistCoins = [COINS[0], COINS[1], COINS[2]]; // Default watchlist

function renderWatchlist() {
  const el = document.getElementById('watchlist-content');
  if (!el) return;
  if (watchlistCoins.length === 0) {
    el.innerHTML = `<div class="watchlist-empty">
      <div class="watchlist-empty-icon">★</div>
      <div>No assets in your watchlist yet.</div>
      <div style="margin-top:8px; font-size:11px; color:rgba(255,255,255,0.15);">Click "+ ADD ASSET" to start tracking your favorite coins.</div>
    </div>`;
    return;
  }
  el.innerHTML = `<div class="watchlist-grid">${watchlistCoins.map((c, i) => `
    <div class="card watchlist-item" onclick="showPage('markets')">
      <div class="wl-header">
        <div class="wl-coin">
          <div class="wl-icon" style="background:${c.color}18;border-color:${c.color}33;color:${c.color}">${c.icon}</div>
          <div>
            <div class="wl-name">${c.name}</div>
            <div class="wl-sym">${c.sym}</div>
          </div>
        </div>
        <button class="wl-remove" onclick="event.stopPropagation(); removeFromWatchlist(${i})">×</button>
      </div>
      <div class="wl-price">$${c.price > 1000 ? Math.round(c.price).toLocaleString() : c.price.toFixed(3)}</div>
      <div class="wl-change ${c.change >= 0 ? 'text-up' : 'text-down'}">${c.change >= 0 ? '▲' : '▼'} ${Math.abs(c.change).toFixed(2)}%</div>
      <div class="wl-mini-chart">${renderSparkline(c.trend, c.change >= 0)}</div>
    </div>
  `).join('')}</div>`;
}

function removeFromWatchlist(idx) {
  const coin = watchlistCoins[idx];
  watchlistCoins.splice(idx, 1);
  renderWatchlist();
  showToast('★ Watchlist', `${coin.sym} removed from watchlist`);
}

function addToWatchlistPrompt() {
  const sym = prompt('Enter coin symbol to add (e.g. BNB, XRP, ADA, DOT, AVAX):');
  if (!sym) return;
  const coin = COINS.find(c => c.sym.toLowerCase() === sym.toLowerCase().trim());
  if (!coin) { showToast('⚠ Not found', `${sym.toUpperCase()} not found in market data`); return; }
  if (watchlistCoins.find(c => c.sym === coin.sym)) {
    showToast('⚠ Already added', `${coin.sym} is already in your watchlist`); return;
  }
  watchlistCoins.push(coin);
  renderWatchlist();
  showToast('★ Added!', `${coin.sym} added to watchlist`);
}

// ═══════════════════════════════════════════════════════════════
// CONVERTER PAGE
// ═══════════════════════════════════════════════════════════════
let convFrom = { sym: 'BTC', price: 67842, icon: '₿', color: '#f59e0b' };
let convTo   = { sym: 'USDT', price: 1, icon: '$', color: '#00d4ff' };

const CONV_COINS = {
  BTC:  { price: 67842, icon: '₿', color: '#f59e0b', change: +2.84, high: 68921, low: 65412 },
  ETH:  { price: 3542,  icon: '⬡', color: '#7c3aed', change: +1.92, high: 3621,  low: 3410 },
  SOL:  { price: 189.4, icon: '◎', color: '#00ff9d', change: +5.61, high: 195,   low: 180 },
  BNB:  { price: 608.2, icon: '◈', color: '#f59e0b', change: -1.23, high: 625,   low: 595 },
  USDT: { price: 1,     icon: '$', color: '#00d4ff', change: 0,      high: 1,     low: 1 },
};

function selectConvCoin(side, sym, price, btn) {
  const rowId = side === 'from' ? 'conv-from-row' : 'conv-to-row';
  document.querySelectorAll(`#${rowId} .coin-pill`).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const data = CONV_COINS[sym];
  if (side === 'from') {
    convFrom = { sym, price: data.price, icon: data.icon, color: data.color };
    document.getElementById('conv-from-sym').textContent = sym;
    document.getElementById('conv-from-icon').textContent = data.icon;
    document.getElementById('conv-from-icon').style.background = data.color + '22';
    document.getElementById('conv-from-icon').style.color = data.color;
  } else {
    convTo = { sym, price: data.price, icon: data.icon, color: data.color };
    document.getElementById('conv-to-sym').textContent = sym;
    document.getElementById('conv-to-icon').textContent = data.icon;
    document.getElementById('conv-to-icon').style.background = data.color + '22';
    document.getElementById('conv-to-icon').style.color = data.color;
  }
  updateConverterRate();
  doConvert('from');
}

function updateConverterRate() {
  const rate = convFrom.sym === 'USDT' ? (1 / convTo.price) : (convFrom.price / (convTo.sym === 'USDT' ? 1 : convTo.price));
  document.getElementById('conv-rate-from-sym').textContent = convFrom.sym;
  document.getElementById('conv-rate-to-sym').textContent = convTo.sym;
  const rateStr = rate > 1000 ? '$' + Math.round(rate).toLocaleString() : rate.toFixed(6);
  document.getElementById('conv-rate-val').textContent = rateStr;
  // Update stats based on from coin
  const d = CONV_COINS[convFrom.sym];
  const chEl = document.getElementById('conv-24h');
  if (chEl) {
    chEl.textContent = (d.change >= 0 ? '+' : '') + d.change.toFixed(2) + '%';
    chEl.className = 'conv-stat-val ' + (d.change >= 0 ? 'text-up' : 'text-down');
  }
  const hiEl = document.getElementById('conv-high');
  if (hiEl) hiEl.textContent = d.high > 1 ? '$' + d.high.toLocaleString() : d.high;
  const loEl = document.getElementById('conv-low');
  if (loEl) loEl.textContent = d.low > 1 ? '$' + d.low.toLocaleString() : d.low;
}

function doConvert(changedSide) {
  const fromInUSD = convFrom.price;
  const toInUSD   = convTo.price;
  if (changedSide === 'from') {
    const fromAmt = parseFloat(document.getElementById('conv-from-input').value) || 0;
    const toAmt   = (fromAmt * fromInUSD) / toInUSD;
    document.getElementById('conv-to-input').value = toAmt > 0 ? (toAmt < 1 ? toAmt.toFixed(8) : toAmt.toFixed(4)) : '';
  } else {
    const toAmt   = parseFloat(document.getElementById('conv-to-input').value) || 0;
    const fromAmt = (toAmt * toInUSD) / fromInUSD;
    document.getElementById('conv-from-input').value = fromAmt > 0 ? (fromAmt < 1 ? fromAmt.toFixed(8) : fromAmt.toFixed(4)) : '';
  }
}

function swapConverter() {
  const tmpSym = convFrom.sym, tmpPrice = convFrom.price, tmpIcon = convFrom.icon, tmpColor = convFrom.color;
  convFrom = { ...convTo };
  convTo = { sym: tmpSym, price: tmpPrice, icon: tmpIcon, color: tmpColor };
  document.getElementById('conv-from-sym').textContent = convFrom.sym;
  document.getElementById('conv-from-icon').textContent = convFrom.icon;
  document.getElementById('conv-from-icon').style.color = convFrom.color;
  document.getElementById('conv-to-sym').textContent = convTo.sym;
  document.getElementById('conv-to-icon').textContent = convTo.icon;
  document.getElementById('conv-to-icon').style.color = convTo.color;
  // Swap row active states
  ['conv-from-row', 'conv-to-row'].forEach(id => {
    document.querySelectorAll(`#${id} .coin-pill`).forEach(p => p.classList.remove('active'));
  });
  updateConverterRate();
  doConvert('from');
  showToast('⇌ Swapped', `Now converting ${convFrom.sym} → ${convTo.sym}`);
}

function setConvAmount(n) {
  document.getElementById('conv-from-input').value = n;
  doConvert('from');
}

// ═══════════════════════════════════════════════════════════════
// NEWS FEED PAGE
// ═══════════════════════════════════════════════════════════════
const NEWS_DATA = [
  { thumb:'₿', category:'Bitcoin', catColor:'var(--neon-amber)', sentiment:'bullish',
    title:'Bitcoin Surges Past $68K as Institutional Demand Reaches Record Highs',
    source:'Neural Wire', time:'4 min ago',
    body:'Major hedge funds and ETF inflows drive BTC to multi-month highs...' },
  { thumb:'⬡', category:'Ethereum', catColor:'var(--neon-violet)', sentiment:'bullish',
    title:'Ethereum Layer-2 Ecosystem Hits $50B TVL Milestone',
    source:'DeFi Pulse', time:'22 min ago',
    body:'Combined L2 activity surpasses previous records as gas fees drop...' },
  { thumb:'◎', category:'Solana', catColor:'var(--neon-lime)', sentiment:'bullish',
    title:'Solana Sees 18% Surge Following Major DEX Volume Record',
    source:'Chain Report', time:'1 hr ago',
    body:'On-chain metrics signal strong retail and institutional participation...' },
  { thumb:'⚡', category:'DeFi', catColor:'var(--neon-azure)', sentiment:'neutral',
    title:'Fed Rate Decision Creates Volatility Across Crypto Markets',
    source:'Macro Pulse', time:'2 hr ago',
    body:'Analysts debate the impact of monetary policy on digital assets...' },
  { thumb:'◈', category:'Regulation', catColor:'var(--neon-rose)', sentiment:'bearish',
    title:'SEC Delays Decision on Spot Ethereum ETF to Q3 2024',
    source:'Regulatory Watch', time:'3 hr ago',
    body:'Market participants adjust expectations following the announcement...' },
  { thumb:'★', category:'NFT', catColor:'var(--neon-gold)', sentiment:'neutral',
    title:'Blue-Chip NFT Collections Show Signs of Revival as Trading Volume Climbs',
    source:'NFT Tracker', time:'5 hr ago',
    body:'CryptoPunks and BAYC see renewed interest from institutional wallets...' },
];

const TRENDING = ['#Bitcoin', '#ETH2', '#DeFi', '#Solana', '#Altcoins', '#BullRun', '#Crypto', '#Web3', '#NFT', '#Halving'];

function renderNews() {
  const list = document.getElementById('news-list');
  if (!list) return;
  list.innerHTML = NEWS_DATA.map(n => `
    <div class="card news-card" onclick="showToast('◎ News', '${n.title.substring(0,40)}...')">
      <div class="news-thumb" style="background:rgba(0,0,0,0.3);">${n.thumb}</div>
      <div class="news-body">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <div class="news-category" style="color:${n.catColor}">${n.category}</div>
          <div class="news-sentiment ${n.sentiment}">${n.sentiment.toUpperCase()}</div>
        </div>
        <div class="news-title">${n.title}</div>
        <div class="news-meta">
          <span>${n.source}</span>
          <span>·</span>
          <span>${n.time}</span>
        </div>
      </div>
    </div>
  `).join('');

  const tags = document.getElementById('trending-tags');
  if (tags) tags.innerHTML = TRENDING.map(t => `
    <div class="trending-tag" onclick="showToast('◎ News', 'Filtering by ${t}')">${t}</div>
  `).join('');
}

function refreshNews() {
  showToast('◎ News', 'Fetching latest market intelligence...');
  // Animate sentiment
  const bull = Math.floor(Math.random() * 30 + 55);
  const bear = 100 - bull;
  document.getElementById('sent-bull').style.width = bull + '%';
  document.getElementById('sent-bear').style.width = bear + '%';
  document.getElementById('sent-bull-pct').textContent = bull + '%';
  document.getElementById('sent-bear-pct').textContent = bear + '%';
}

// ═══════════════════════════════════════════════════════════════
// UPDATE showPage to handle new pages
// ═══════════════════════════════════════════════════════════════
const _origShowPage = window.showPage;
window.showPage = function(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  const navBtn = document.getElementById('nav-' + id);
  if (navBtn) navBtn.classList.add('active');
  if (id === 'dashboard') initDashboard();
  if (id === 'markets') renderMarkets();
  if (id === 'portfolio') renderPortfolio();
  if (id === 'watchlist') renderWatchlist();
  if (id === 'converter') { updateConverterRate(); doConvert('from'); }
  if (id === 'news') renderNews();
};

// Keyboard shortcuts for new pages
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key.toLowerCase() === 'w') showPage('watchlist');
  if (e.key.toLowerCase() === 'c') showPage('converter');
  if (e.key.toLowerCase() === 'n') showPage('news');
});

// Init new pages data on load
updateConverterRate();
renderWatchlist();
renderNews();

// Periodic watchlist price updates
setInterval(() => {
  watchlistCoins.forEach(c => {
    c.price = c.price * (1 + (Math.random() - 0.499) * 0.002);
  });
  if (document.getElementById('page-watchlist').classList.contains('active')) {
    renderWatchlist();
  } else if (document.getElementById('page-converter').classList.contains('active')) {
    updateConverterRate();
  }
}, 15000);