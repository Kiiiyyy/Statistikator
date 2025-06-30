let chart1, chart2;

function toggleMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
}

function parseInput(data) {
  return data
    .split(/[\s,]+/)
    .map(Number)
    .filter(n => !isNaN(n));
}

function mean(data) {
  return data.reduce((a,b) => a + b, 0) / data.length;
}

function median(data) {
  const sorted = [...data].sort((a,b) => a-b);
  const mid = Math.floor(sorted.length/2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
}

function mode(data) {
  const freq = {};
  data.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  return Object.entries(freq).filter(([_, v]) => v === maxFreq).map(([k]) => k);
}

function variance(data) {
  const avg = mean(data);
  return data.reduce((a,b) => a + Math.pow(b - avg, 2), 0) / data.length;
}

function stdDev(data) {
  return Math.sqrt(variance(data));
}

function proses() {
  const input = document.getElementById('dataInput').value;
  const data = parseInput(input);

  if (data.length === 0) {
    alert("Data kosong atau tidak valid!");
    return;
  }

  const m = mean(data).toFixed(2);
  const med = median(data).toFixed(2);
  const mo = mode(data).join(', ');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const std = stdDev(data).toFixed(2);
  const range = (max - min).toFixed(2);

  const html = `
    <h2>📈 Hasil Statistik</h2>
    <ul>
      <li>Mean (Rata-rata): <b>${m}</b></li>
      <li>Median: <b>${med}</b></li>
      <li>Modus: <b>${mo}</b></li>
      <li>Range: <b>${range}</b></li>
      <li>Standar Deviasi: <b>${std}</b></li>
    </ul>
  `;
  document.getElementById('output').innerHTML = html;

  buatChart(data);
  buatTabelFrekuensi(data);
}

function buatChart(data) {
  const ctx1 = document.getElementById('chart1').getContext('2d');
  const ctx2 = document.getElementById('chart2').getContext('2d');

  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();

  // Histogram
  chart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: [...new Set(data)].sort((a,b)=>a-b),
      datasets: [{
        label: 'Frekuensi',
        data: [...new Set(data)].map(n => data.filter(x => x === n).length),
        backgroundColor: '#007bff'
      }]
    }
  });

  // Box plot (visualisasi dummy)
  const sorted = [...data].sort((a,b)=>a-b);
  const q1 = median(sorted.slice(0, Math.floor(sorted.length/2)));
  const q3 = median(sorted.slice(Math.ceil(sorted.length/2)));
  const med = median(sorted);

  chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Min', 'Q1', 'Median', 'Q3', 'Max'],
      datasets: [{
        label: 'Box Plot',
        data: [
          Math.min(...sorted),
          q1,
          med,
          q3,
          Math.max(...sorted)
        ],
        backgroundColor: ['#aaa','#888','#444','#888','#aaa']
      }]
    }
  });
}

function resetAll() {
  document.getElementById('dataInput').value = '';
  document.getElementById('output').innerHTML = '';
  if (chart1) chart1.destroy();
  if (chart2) chart2.destroy();
}

function handleCSV(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const lines = event.target.result.split(/\r?\n/);
    const data = lines.join(','); // flatten CSV
    document.getElementById('dataInput').value = data;
  };
  reader.readAsText(file);
}

function exportPDF() {
  const el = document.getElementById('app');
  html2pdf().from(el).save("hasil-statistikator.pdf");
}

function buatTabelFrekuensi(data) {
    const container = document.getElementById("output");
  
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    const k = Math.ceil(Math.sqrt(n));
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const panjangKelas = Math.ceil(range / k);
  
    let intervals = [];
    let batasBawah = min;
  
    for (let i = 0; i < k; i++) {
      let batasAtas = batasBawah + panjangKelas - 1;
      intervals.push({
        lower: batasBawah,
        upper: batasAtas,
        mid: (batasBawah + batasAtas) / 2,
        freq: 0
      });
      batasBawah = batasAtas + 1;
    }
  
    // Hitung frekuensi
    for (let num of data) {
      for (let row of intervals) {
        if (num >= row.lower && num <= row.upper) {
          row.freq++;
          break;
        }
      }
    }
  
    // Buat tabel HTML
    let table = `<h2>📋 Tabel Distribusi Frekuensi</h2>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Interval Kelas</th>
          <th>Nilai Tengah</th>
          <th>Frekuensi</th>
        </tr>`;
  
    let totalFreq = 0;
  
    for (let row of intervals) {
      table += `
        <tr>
          <td>${row.lower} - ${row.upper}</td>
          <td>${row.mid}</td>
          <td>${row.freq}</td>
        </tr>`;
      totalFreq += row.freq;
    }
  
    table += `
      <tr>
        <td colspan="2"><b>Total Frekuensi</b></td>
        <td><b>${totalFreq}</b></td>
      </tr>
      </table>`;
  
    container.innerHTML += table;
  }
  