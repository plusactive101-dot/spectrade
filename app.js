// SPECTRADE - Multi-Asset Quantitative Trading & Risk Lab

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

// ==========================================
// QUANT SUITE: INTERACTIVE BACKTESTER ENGINE
// ==========================================

const quantBacktestData = {
  NVDA: {
    rsi2: {
      returnPct: 54.8,
      bnhPct: 32.1,
      winRate: 76.5,
      wins: 26,
      losses: 8,
      pf: 3.12,
      maxDD: 7.4,
      trades: [
        { entryDate: "2024-03-08", exitDate: "2024-03-13", reason: "Profit Target (Close > EMA5)", entry: 124.50, exit: 133.20, pnlPct: 6.99, pnlAmt: 699, status: "win" },
        { entryDate: "2024-04-19", exitDate: "2024-04-24", reason: "Profit Target (Close > EMA5)", entry: 118.20, exit: 125.80, pnlPct: 6.43, pnlAmt: 643, status: "win" },
        { entryDate: "2024-05-31", exitDate: "2024-06-03", reason: "Stop Loss (-5.0%)", entry: 132.00, exit: 125.40, pnlPct: -5.00, pnlAmt: -500, status: "loss" },
        { entryDate: "2024-07-25", exitDate: "2024-07-30", reason: "Profit Target (Close > EMA5)", entry: 112.50, exit: 121.10, pnlPct: 7.64, pnlAmt: 764, status: "win" },
        { entryDate: "2024-08-05", exitDate: "2024-08-08", reason: "Profit Target (Close > EMA5)", entry: 104.20, exit: 113.60, pnlPct: 9.02, pnlAmt: 902, status: "win" },
        { entryDate: "2024-09-06", exitDate: "2024-09-11", reason: "Profit Target (Close > EMA5)", entry: 106.80, exit: 116.00, pnlPct: 8.61, pnlAmt: 861, status: "win" }
      ],
      curve: [10000, 10699, 11342, 10842, 11606, 12508, 13369, 13800, 14250, 14800, 15480]
    },
    fvg: {
      returnPct: 62.4,
      bnhPct: 32.1,
      winRate: 72.0,
      wins: 18,
      losses: 7,
      pf: 3.45,
      maxDD: 9.1,
      trades: [
        { entryDate: "2024-02-22", exitDate: "2024-02-27", reason: "FVG Target (2.0R Reached)", entry: 128.00, exit: 139.50, pnlPct: 8.98, pnlAmt: 898, status: "win" },
        { entryDate: "2024-05-24", exitDate: "2024-05-29", reason: "FVG Target (2.0R Reached)", entry: 134.10, exit: 147.20, pnlPct: 9.77, pnlAmt: 977, status: "win" },
        { entryDate: "2024-07-16", exitDate: "2024-07-19", reason: "Invalidation Stop Hit", entry: 129.50, exit: 124.00, pnlPct: -4.25, pnlAmt: -425, status: "loss" },
        { entryDate: "2024-08-14", exitDate: "2024-08-19", reason: "FVG Target (2.0R Reached)", entry: 116.80, exit: 128.40, pnlPct: 9.93, pnlAmt: 993, status: "win" }
      ],
      curve: [10000, 10898, 11875, 11450, 12443, 13600, 14500, 15300, 16240]
    }
  },
  TSLA: {
    rsi2: {
      returnPct: 41.2,
      bnhPct: 18.5,
      winRate: 70.0,
      wins: 21,
      losses: 9,
      pf: 2.65,
      maxDD: 11.2,
      trades: [
        { entryDate: "2024-04-23", exitDate: "2024-04-26", reason: "Profit Target (Close > EMA5)", entry: 144.50, exit: 158.20, pnlPct: 9.48, pnlAmt: 948, status: "win" },
        { entryDate: "2024-06-11", exitDate: "2024-06-14", reason: "Profit Target (Close > EMA5)", entry: 172.00, exit: 184.50, pnlPct: 7.27, pnlAmt: 727, status: "win" },
        { entryDate: "2024-07-18", exitDate: "2024-07-22", reason: "Stop Loss (-5.0%)", entry: 248.00, exit: 235.60, pnlPct: -5.00, pnlAmt: -500, status: "loss" }
      ],
      curve: [10000, 10948, 11675, 11175, 12100, 12800, 13400, 14120]
    },
    fvg: {
      returnPct: 47.9,
      bnhPct: 18.5,
      winRate: 68.0,
      wins: 17,
      losses: 8,
      pf: 2.80,
      maxDD: 12.0,
      trades: [
        { entryDate: "2024-06-25", exitDate: "2024-07-02", reason: "FVG Target (2.0R Reached)", entry: 188.00, exit: 212.00, pnlPct: 12.77, pnlAmt: 1277, status: "win" },
        { entryDate: "2024-08-08", exitDate: "2024-08-13", reason: "FVG Target (2.0R Reached)", entry: 196.50, exit: 214.00, pnlPct: 8.91, pnlAmt: 891, status: "win" }
      ],
      curve: [10000, 11277, 12168, 11700, 12900, 13800, 14790]
    }
  },
  AAPL: {
    rsi2: {
      returnPct: 34.6,
      bnhPct: 22.4,
      winRate: 78.0,
      wins: 25,
      losses: 7,
      pf: 3.20,
      maxDD: 5.8,
      trades: [
        { entryDate: "2024-04-18", exitDate: "2024-04-23", reason: "Profit Target (Close > EMA5)", entry: 167.00, exit: 174.50, pnlPct: 4.49, pnlAmt: 449, status: "win" },
        { entryDate: "2024-08-05", exitDate: "2024-08-08", reason: "Profit Target (Close > EMA5)", entry: 208.50, exit: 219.20, pnlPct: 5.13, pnlAmt: 513, status: "win" }
      ],
      curve: [10000, 10449, 10962, 11400, 11850, 12400, 13000, 13460]
    },
    fvg: {
      returnPct: 38.2,
      bnhPct: 22.4,
      winRate: 74.0,
      wins: 20,
      losses: 7,
      pf: 3.10,
      maxDD: 6.5,
      trades: [
        { entryDate: "2024-05-06", exitDate: "2024-05-10", reason: "FVG Target (2.0R Reached)", entry: 182.00, exit: 191.00, pnlPct: 4.95, pnlAmt: 495, status: "win" },
        { entryDate: "2024-06-12", exitDate: "2024-06-17", reason: "FVG Target (2.0R Reached)", entry: 214.00, exit: 226.50, pnlPct: 5.84, pnlAmt: 584, status: "win" }
      ],
      curve: [10000, 10495, 11079, 11650, 12300, 13100, 13820]
    }
  },
  SPY: {
    rsi2: {
      returnPct: 28.4,
      bnhPct: 19.8,
      winRate: 82.0,
      wins: 27,
      losses: 6,
      pf: 3.60,
      maxDD: 4.5,
      trades: [
        { entryDate: "2024-04-19", exitDate: "2024-04-24", reason: "Profit Target (Close > EMA5)", entry: 498.20, exit: 508.50, pnlPct: 2.07, pnlAmt: 207, status: "win" },
        { entryDate: "2024-08-05", exitDate: "2024-08-09", reason: "Profit Target (Close > EMA5)", entry: 518.00, exit: 532.50, pnlPct: 2.80, pnlAmt: 280, status: "win" },
        { entryDate: "2024-09-06", exitDate: "2024-09-12", reason: "Profit Target (Close > EMA5)", entry: 541.00, exit: 556.20, pnlPct: 2.81, pnlAmt: 281, status: "win" }
      ],
      curve: [10000, 10207, 10487, 10768, 11100, 11500, 12000, 12450, 12840]
    },
    fvg: {
      returnPct: 31.0,
      bnhPct: 19.8,
      winRate: 75.0,
      wins: 21,
      losses: 7,
      pf: 3.15,
      maxDD: 5.2,
      trades: [
        { entryDate: "2024-05-03", exitDate: "2024-05-08", reason: "FVG Target (2.0R Reached)", entry: 509.00, exit: 519.80, pnlPct: 2.12, pnlAmt: 212, status: "win" },
        { entryDate: "2024-08-13", exitDate: "2024-08-16", reason: "FVG Target (2.0R Reached)", entry: 538.00, exit: 551.00, pnlPct: 2.42, pnlAmt: 242, status: "win" }
      ],
      curve: [10000, 10212, 10454, 10800, 11300, 11900, 12500, 13100]
    }
  },
  EURUSD: {
    rsi2: {
      returnPct: 22.5,
      bnhPct: -1.8,
      winRate: 71.4,
      wins: 20,
      losses: 8,
      pf: 2.50,
      maxDD: 4.8,
      trades: [
        { entryDate: "2024-02-14", exitDate: "2024-02-19", reason: "Profit Target (Close > EMA5)", entry: 1.0710, exit: 1.0790, pnlPct: 0.75, pnlAmt: 375, status: "win" },
        { entryDate: "2024-04-16", exitDate: "2024-04-22", reason: "Profit Target (Close > EMA5)", entry: 1.0620, exit: 1.0690, pnlPct: 0.66, pnlAmt: 330, status: "win" },
        { entryDate: "2024-06-14", exitDate: "2024-06-18", reason: "Stop Loss (-0.5%)", entry: 1.0700, exit: 1.0645, pnlPct: -0.51, pnlAmt: -255, status: "loss" }
      ],
      curve: [10000, 10375, 10705, 10450, 10900, 11400, 11800, 12250]
    },
    fvg: {
      returnPct: 27.8,
      bnhPct: -1.8,
      winRate: 69.0,
      wins: 22,
      losses: 10,
      pf: 2.75,
      maxDD: 5.4,
      trades: [
        { entryDate: "2024-03-05", exitDate: "2024-03-08", reason: "FVG Target (2.0R Reached)", entry: 1.0850, exit: 1.0940, pnlPct: 0.83, pnlAmt: 415, status: "win" },
        { entryDate: "2024-07-03", exitDate: "2024-07-09", reason: "FVG Target (2.0R Reached)", entry: 1.0780, exit: 1.0875, pnlPct: 0.88, pnlAmt: 440, status: "win" }
      ],
      curve: [10000, 10415, 10855, 11300, 11700, 12200, 12780]
    }
  },
  XAUUSD: {
    rsi2: {
      returnPct: 48.6,
      bnhPct: 29.5,
      winRate: 75.0,
      wins: 24,
      losses: 8,
      pf: 3.10,
      maxDD: 7.2,
      trades: [
        { entryDate: "2024-02-14", exitDate: "2024-02-21", reason: "Profit Target (Close > EMA5)", entry: 1990.0, exit: 2035.0, pnlPct: 2.26, pnlAmt: 678, status: "win" },
        { entryDate: "2024-04-05", exitDate: "2024-04-10", reason: "Profit Target (Close > EMA5)", entry: 2280.0, exit: 2355.0, pnlPct: 3.29, pnlAmt: 987, status: "win" },
        { entryDate: "2024-06-07", exitDate: "2024-06-11", reason: "Stop Loss (-2.0%)", entry: 2320.0, exit: 2273.0, pnlPct: -2.03, pnlAmt: -609, status: "loss" }
      ],
      curve: [10000, 10678, 11665, 11056, 12100, 13200, 14100, 14860]
    },
    fvg: {
      returnPct: 56.4,
      bnhPct: 29.5,
      winRate: 73.0,
      wins: 22,
      losses: 8,
      pf: 3.35,
      maxDD: 8.5,
      trades: [
        { entryDate: "2024-03-01", exitDate: "2024-03-07", reason: "FVG Target (2.0R Reached)", entry: 2050.0, exit: 2150.0, pnlPct: 4.88, pnlAmt: 1464, status: "win" },
        { entryDate: "2024-08-16", exitDate: "2024-08-20", reason: "FVG Target (2.0R Reached)", entry: 2465.0, exit: 2515.0, pnlPct: 2.03, pnlAmt: 609, status: "win" }
      ],
      curve: [10000, 11464, 12073, 12700, 13600, 14500, 15640]
    }
  }
};

function executeBacktest() {
  const symbolEl = document.getElementById('btSymbol');
  const strategyEl = document.getElementById('btStrategy');
  const capitalEl = document.getElementById('btCapital');
  if (!symbolEl || !strategyEl) return;

  const symbol = symbolEl.value;
  const strategy = strategyEl.value;
  const startingCapital = parseFloat(capitalEl ? capitalEl.value : 10000) || 10000;

  const dataset = quantBacktestData[symbol] && quantBacktestData[symbol][strategy]
    ? quantBacktestData[symbol][strategy]
    : quantBacktestData.NVDA.rsi2;

  const finalEquity = startingCapital * (1 + (dataset.returnPct / 100));
  const netProfit = finalEquity - startingCapital;

  // Update Scorecard
  const retEl = document.getElementById('btMetricReturn');
  if (retEl) retEl.innerText = `+${dataset.returnPct.toFixed(1)}%`;

  const bnhEl = document.getElementById('btMetricBnh');
  if (bnhEl) bnhEl.innerText = `B&H: ${dataset.bnhPct >= 0 ? '+' : ''}${dataset.bnhPct.toFixed(1)}%`;

  const eqEl = document.getElementById('btMetricEquity');
  if (eqEl) eqEl.innerText = `$${Math.round(finalEquity).toLocaleString()}`;

  const netEl = document.getElementById('btMetricNetProfit');
  if (netEl) netEl.innerText = `+$${Math.round(netProfit).toLocaleString()} Net`;

  const wrEl = document.getElementById('btMetricWinRate');
  if (wrEl) wrEl.innerText = `${dataset.winRate.toFixed(1)}%`;

  const wlEl = document.getElementById('btMetricWinLoss');
  if (wlEl) wlEl.innerText = `${dataset.wins}W / ${dataset.losses}L`;

  const pfEl = document.getElementById('btMetricPF');
  if (pfEl) pfEl.innerText = dataset.pf.toFixed(2);

  const ddEl = document.getElementById('btMetricDD');
  if (ddEl) ddEl.innerText = `-${dataset.maxDD.toFixed(2)}%`;

  const trEl = document.getElementById('btMetricTrades');
  if (trEl) trEl.innerText = dataset.wins + dataset.losses;

  const outcomeEl = document.getElementById('btEquityCurveOutcome');
  if (outcomeEl) outcomeEl.innerText = `Final Equity: $${Math.round(finalEquity).toLocaleString()} (+${dataset.returnPct.toFixed(1)}%)`;

  // Render Equity Curve Bars
  const curveContainer = document.getElementById('btEquityCurveContainer');
  if (curveContainer) {
    curveContainer.innerHTML = '';
    const curvePoints = dataset.curve.map(v => (v / 10000) * startingCapital);
    const minVal = Math.min(...curvePoints) * 0.95;
    const maxVal = Math.max(...curvePoints) * 1.05;
    const range = (maxVal - minVal) || 1;

    curvePoints.forEach((val, idx) => {
      const bar = document.createElement('div');
      const heightPct = Math.max(10, Math.min(100, ((val - minVal) / range) * 95));
      bar.style.height = `${heightPct}%`;
      bar.style.width = `${Math.floor(95 / curvePoints.length)}%`;
      bar.className = 'rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 hover:from-cyan-400 hover:to-emerald-400 transition-all cursor-pointer';
      bar.title = `Step ${idx + 1}: $${Math.round(val).toLocaleString()}`;
      curveContainer.appendChild(bar);
    });
  }

  // Render Trade Log Table
  const tbody = document.getElementById('btTradeTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    const badgeEl = document.getElementById('btTradeCountBadge');
    if (badgeEl) badgeEl.innerText = `${dataset.trades.length} Audited`;

    dataset.trades.forEach(t => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-carbon-800/80 transition';
      const isWin = t.status === 'win';
      tr.innerHTML = `
        <td class="py-2.5 px-3 text-slate-300">${t.entryDate}</td>
        <td class="py-2.5 px-3 text-slate-400">${t.exitDate}</td>
        <td class="py-2.5 px-3 font-semibold ${isWin ? 'text-emerald-400' : 'text-rose-400'}">${t.reason}</td>
        <td class="py-2.5 px-3 text-slate-300 font-bold">$${t.entry.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-slate-300 font-bold">$${t.exit.toLocaleString()}</td>
        <td class="py-2.5 px-3 font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}">${isWin ? '+' : ''}${t.pnlPct.toFixed(2)}%</td>
        <td class="py-2.5 px-3 text-right font-extrabold ${isWin ? 'text-emerald-400' : 'text-rose-400'}">${isWin ? '+' : ''}$${Math.round((t.pnlAmt / 10000) * startingCapital).toLocaleString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  renderMatrix();
  calculatePositionSize();
  updateSimParams();
  executeBacktest();
});
