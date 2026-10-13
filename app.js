// SPECTRADE - Multi-Asset Quantitative Trading Terminal & Risk Lab

const marketSetups = [
  {
    ticker: "BTC/USDT",
    tvSymbol: "BINANCE:BTCUSDT",
    assetClass: "Crypto",
    setup: "High-Timeframe Liquidity Sweep & Range Expansion",
    entry: "$65,000",
    target: "$72,500",
    stop: "$62,500",
    rr: "3.0 : 1",
    bias: "Long",
    biasColor: "emerald"
  },
  {
    ticker: "ETH/USDT",
    tvSymbol: "BINANCE:ETHUSDT",
    assetClass: "Crypto",
    setup: "Weekly Fair Value Gap (FVG) Retest & Mean Reversion",
    entry: "$2,580",
    target: "$3,150",
    stop: "$2,380",
    rr: "2.85 : 1",
    bias: "Long",
    biasColor: "emerald"
  },
  {
    ticker: "NVDA",
    tvSymbol: "NASDAQ:NVDA",
    assetClass: "Equities",
    setup: "Consolidation Base Breakout with Relative Volume",
    entry: "$138.50",
    target: "$165.00",
    stop: "$129.00",
    rr: "2.79 : 1",
    bias: "Long",
    biasColor: "emerald"
  },
  {
    ticker: "PLTR",
    tvSymbol: "NASDAQ:PLTR",
    assetClass: "Equities",
    setup: "High Momentum Trend Expansion & 20-EMA Bounce",
    entry: "$42.00",
    target: "$54.00",
    stop: "$38.50",
    rr: "3.43 : 1",
    bias: "Long",
    biasColor: "emerald"
  },
  {
    ticker: "EUR/USD",
    tvSymbol: "FX_IDC:EURUSD",
    assetClass: "Forex",
    setup: "Order Block Rejection at Key Daily Resistance Level",
    entry: "1.0920",
    target: "1.0740",
    stop: "1.0980",
    rr: "3.00 : 1",
    bias: "Short",
    biasColor: "rose"
  },
  {
    ticker: "XAU/USD",
    tvSymbol: "OANDA:XAUUSD",
    assetClass: "Commodities",
    setup: "Macro Bull Flag Continuation & Safe Haven Flow",
    entry: "$2,650",
    target: "$2,780",
    stop: "$2,610",
    rr: "3.25 : 1",
    bias: "Long",
    biasColor: "emerald"
  }
];

let activeAssetFilter = 'all';
let currentTvSymbol = 'BINANCE:BTCUSDT';

// Render Market Setups Table
function renderMatrix() {
  const tbody = document.getElementById('matrixTableBody');
  if (!tbody) return;

  const filtered = activeAssetFilter === 'all'
    ? marketSetups
    : marketSetups.filter(m => m.assetClass.toLowerCase() === activeAssetFilter.toLowerCase());

  tbody.innerHTML = '';

  filtered.forEach(item => {
    const isSelected = item.tvSymbol === currentTvSymbol;
    const tr = document.createElement('tr');
    tr.className = `hover:bg-carbon-800/80 transition cursor-pointer border-b border-carbon-800/60 ${
      isSelected ? 'bg-cyan-950/25 border-l-2 border-l-cyan-400' : ''
    }`;
    tr.onclick = () => selectAsset(item.tvSymbol);

    const biasBadge = item.bias === 'Long'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

    tr.innerHTML = `
      <td class="py-3 px-3 mono font-bold text-white flex items-center space-x-2">
        <span>${item.ticker}</span>
        ${isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>' : ''}
      </td>
      <td class="py-3 px-3 text-slate-400 mono">${item.assetClass}</td>
      <td class="py-3 px-3 text-slate-200">${item.setup}</td>
      <td class="py-3 px-3 mono text-slate-300">${item.entry}</td>
      <td class="py-3 px-3 mono text-emerald-400 font-semibold">${item.target}</td>
      <td class="py-3 px-3 mono text-rose-400">${item.stop}</td>
      <td class="py-3 px-3 mono text-cyan-300 font-bold">${item.rr}</td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold border mono ${biasBadge}">
          ${item.bias}
        </span>
      </td>
      <td class="py-3 px-3 text-right">
        <button class="px-2.5 py-1 rounded bg-carbon-800 hover:bg-cyan-500 hover:text-carbon-950 text-slate-300 mono text-xs transition border border-carbon-700">
          Chart <i class="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Select Asset and update Chart
function selectAsset(tvSymbol) {
  currentTvSymbol = tvSymbol;
  const badge = document.getElementById('activeTickerBadge');
  if (badge) badge.innerText = tvSymbol;

  renderMatrix();

  const iframe = document.getElementById('tv_chart_iframe');
  const encoded = encodeURIComponent(tvSymbol);
  const chartUrl = `https://www.tradingview.com/widgetembed/?symbol=${encoded}&interval=D&symboledit=1&saveimage=1&toolbarbg=0a0f1d&studies=%5B%22MASimple%40tv-basicstudies%22%2C%22RSI%40tv-basicstudies%22%2C%22Volume%40tv-basicstudies%22%5D&theme=dark&style=1&timezone=Etc%2FUTC&locale=en`;

  if (iframe) {
    iframe.src = chartUrl;
  }

  const chartSection = document.getElementById('chart-section');
  if (chartSection && window.innerWidth < 1024) {
    chartSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Filter asset class
function filterAssetClass(cat) {
  activeAssetFilter = cat;
  document.querySelectorAll('.asset-btn').forEach(btn => {
    if (btn.dataset.asset.toLowerCase() === cat.toLowerCase()) {
      btn.className = "asset-btn px-3 py-1.5 rounded-lg bg-cyan-500 text-carbon-950 font-bold transition";
    } else {
      btn.className = "asset-btn px-3 py-1.5 rounded-lg bg-carbon-850 hover:bg-carbon-800 text-slate-300 border border-carbon-700 transition";
    }
  });
  renderMatrix();
}

// -------------------------------------------------------------
// POSITION SIZING CALCULATOR
// -------------------------------------------------------------
function calculatePositionSize() {
  const equity = parseFloat(document.getElementById('calcEquity').value) || 50000;
  const riskPct = parseFloat(document.getElementById('calcRiskPct').value) || 1.0;
  const entry = parseFloat(document.getElementById('calcEntry').value) || 100;
  const stop = parseFloat(document.getElementById('calcStop').value) || 95;
  const target = parseFloat(document.getElementById('calcTarget').value) || 115;

  document.getElementById('riskPercentVal').innerText = `${riskPct.toFixed(2)}%`;

  const maxRiskDollars = equity * (riskPct / 100);
  const priceRiskPerUnit = Math.abs(entry - stop);

  let shares = 0;
  let capitalTotal = 0;
  let maxLoss = maxRiskDollars;
  let profitTotal = 0;
  let rrRatio = 0;

  if (priceRiskPerUnit > 0) {
    shares = maxRiskDollars / priceRiskPerUnit;
    capitalTotal = shares * entry;
    const profitPerUnit = Math.abs(target - entry);
    profitTotal = shares * profitPerUnit;
    rrRatio = profitPerUnit / priceRiskPerUnit;
  }

  document.getElementById('resSharesDisplay').innerText = shares >= 10 ? Math.round(shares).toLocaleString() : shares.toFixed(2);
  document.getElementById('resCapitalDisplay').innerText = `$${Math.round(capitalTotal).toLocaleString()}`;
  document.getElementById('resMaxLossDisplay').innerText = `-$${Math.round(maxLoss).toLocaleString()}`;
  document.getElementById('resProfitDisplay').innerText = `+$${Math.round(profitTotal).toLocaleString()}`;
  document.getElementById('resRiskReward').innerText = `R:R ${rrRatio.toFixed(2)} : 1`;
}

function setQuickSetup(ticker, entry, stop, target) {
  document.getElementById('calcEntry').value = entry;
  document.getElementById('calcStop').value = stop;
  document.getElementById('calcTarget').value = target;
  calculatePositionSize();
}

// -------------------------------------------------------------
// MONTE CARLO EXPECTANCY SIMULATOR
// -------------------------------------------------------------
let simWinRate = 50;
let simRR = 2.5;

function updateSimParams() {
  simWinRate = parseInt(document.getElementById('simWinRate').value);
  simRR = parseFloat(document.getElementById('simRR').value);

  document.getElementById('simWinRateVal').innerText = `${simWinRate}%`;
  document.getElementById('simRRVal').innerText = `${simRR.toFixed(2)} : 1`;

  const ev = (simWinRate / 100) * simRR - ((100 - simWinRate) / 100) * 1.0;
  const proj = ev * 50;

  document.getElementById('simEVDisplay').innerText = `${ev >= 0 ? '+' : ''}${ev.toFixed(2)} R`;
  document.getElementById('simProjReturn').innerText = `${proj >= 0 ? '+' : ''}${proj.toFixed(1)} R`;

  runSimulation();
}

function runSimulation() {
  const container = document.getElementById('simBarsContainer');
  if (!container) return;

  container.innerHTML = '';
  let cumulativeR = 0;
  const points = [];

  for (let i = 0; i < 50; i++) {
    const isWin = Math.random() * 100 < simWinRate;
    const outcome = isWin ? simRR : -1.0;
    cumulativeR += outcome;
    points.push(cumulativeR);
  }

  const maxVal = Math.max(...points, 10);
  const minVal = Math.min(...points, -10);
  const range = Math.max(Math.abs(maxVal), Math.abs(minVal)) || 1;

  points.forEach((val) => {
    const bar = document.createElement('div');
    const isPos = val >= 0;
    const heightPct = Math.max(5, Math.min(100, (Math.abs(val) / range) * 90));

    bar.style.height = `${heightPct}%`;
    bar.style.width = '2%';
    bar.className = `rounded-t transition ${isPos ? 'bg-cyan-400' : 'bg-rose-500'}`;
    bar.title = `Cumulative: ${val.toFixed(1)} R`;
    container.appendChild(bar);
  });

  const finalEl = document.getElementById('simFinalOutcome');
  if (finalEl) {
    finalEl.innerText = `${cumulativeR >= 0 ? '+' : ''}${cumulativeR.toFixed(1)} R Units`;
    finalEl.className = cumulativeR >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold";
  }
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  renderMatrix();
  calculatePositionSize();
  updateSimParams();
});
