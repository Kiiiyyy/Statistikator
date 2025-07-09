function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function parseInput(id) {
  const raw = document.getElementById(id).value;
  return raw.split(',').map(x => parseFloat(x)).filter(x => !isNaN(x));
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function modus(arr) {
  const freq = {};
  arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const max = Math.max(...Object.values(freq));
  return Object.keys(freq).filter(k => freq[k] === max).map(Number);
}
function stdDev(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / arr.length);
}
function kuartil(arr, k) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (k / 4) * (sorted.length + 1);
  const i = Math.floor(pos) - 1;
  const f = pos % 1;
  return sorted[i] + f * (sorted[i + 1] - sorted[i]);
}
function desil(arr, d) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (d / 10) * (sorted.length + 1);
  const i = Math.floor(pos) - 1;
  const f = pos % 1;
  return sorted[i] + f * (sorted[i + 1] - sorted[i]);
}
function persentil(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (p / 100) * (sorted.length + 1);
  const i = Math.floor(pos) - 1;
  const f = pos % 1;
  return sorted[i] + f * (sorted[i + 1] - sorted[i]);
}
function varians(arr) {
  const m = mean(arr);
  return arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / arr.length;
}

function buatTabelFrekuensi(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const k = Math.ceil(Math.sqrt(n));
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const panjangKelas = Math.ceil(range / k);

  let tabel = `
    <h4>📊 Tabel Frekuensi</h4>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Interval Kelas</th>
        <th>Nilai Tengah</th>
        <th>Frekuensi</th>
      </tr>
  `;
  let totalFreq = 0;
  let batasBawah = min;
  for (let i = 0; i < k; i++) {
    let batasAtas = batasBawah + panjangKelas - 1;
    let nilaiTengah = (batasBawah + batasAtas) / 2;
    let frekuensi = arr.filter(x => x >= batasBawah && x <= batasAtas).length;
    totalFreq += frekuensi;
    tabel += `
      <tr>
        <td>${batasBawah} - ${batasAtas}</td>
        <td>${nilaiTengah.toFixed(1)}</td>
        <td>${frekuensi}</td>
      </tr>
    `;
    batasBawah = batasAtas + 1;
  }
  tabel += `
    <tr>
      <td colspan="2"><strong>Total Frekuensi</strong></td>
      <td><strong>${totalFreq}</strong></td>
    </tr>
  </table><br/>`;
  return tabel;
}

function hitungStatistik(data, label) {
  const output = [];
  output.push(`<h3>📌 Dataset ${label}</h3>`);
  output.push(`<p>Mean: ${mean(data).toFixed(2)}</p>`);
  output.push(`<p>Median: ${median(data)}</p>`);
  output.push(`<p>Modus: ${modus(data).join(', ')}</p>`);
  output.push(`<p>Range: ${Math.max(...data) - Math.min(...data)}</p>`);
  output.push(`<p>Standar Deviasi: ${stdDev(data).toFixed(2)}</p>`);
  output.push(`<p>Kuartil 1: ${kuartil(data, 1)}</p>`);
  output.push(`<p>Kuartil 3: ${kuartil(data, 3)}</p>`);
  output.push(`<p>Desil 4: ${desil(data, 4).toFixed(2)}</p>`);
  output.push(`<p>Persentil 75: ${persentil(data, 75).toFixed(2)}</p>`);
  output.push(`<p>Varians: ${varians(data).toFixed(2)}</p>`);
  output.push(buatTabelFrekuensi(data));
  return output.join('');
}

function buatBoxPlotChart(data1, data2) {
  const ctx = document.getElementById("chartBoxplot").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Dataset A", "Dataset B"],
      datasets: [{
        label: "Min",
        data: [Math.min(...data1), Math.min(...data2)],
        backgroundColor: "#aaa"
      }, {
        label: "Q1",
        data: [kuartil(data1, 1), kuartil(data2, 1)],
        backgroundColor: "#888"
      }, {
        label: "Median",
        data: [median(data1), median(data2)],
        backgroundColor: "#555"
      }, {
        label: "Q3",
        data: [kuartil(data1, 3), kuartil(data2, 3)],
        backgroundColor: "#888"
      }, {
        label: "Max",
        data: [Math.max(...data1), Math.max(...data2)],
        backgroundColor: "#aaa"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function buatPoligonGabungan(data1, data2) {
  function frekuensiPoligon(arr, min, max, panjangKelas, k) {
    let result = Array(k).fill(0);
    for (let val of arr) {
      let batasBawah = min;
      for (let i = 0; i < k; i++) {
        let batasAtas = batasBawah + panjangKelas - 1;
        if (val >= batasBawah && val <= batasAtas) {
          result[i]++;
          break;
        }
        batasBawah = batasAtas + 1;
      }
    }
    return result;
  }

  const allData = [...data1, ...data2].sort((a, b) => a - b);
  const k = Math.ceil(Math.sqrt(allData.length));
  const min = allData[0];
  const max = allData[allData.length - 1];
  const range = max - min;
  const panjangKelas = Math.ceil(range / k);

  let labels = [];
  let batasBawah = min;
  for (let i = 0; i < k; i++) {
    let batasAtas = batasBawah + panjangKelas - 1;
    labels.push(`${(batasBawah + batasAtas) / 2}`);
    batasBawah = batasAtas + 1;
  }

  const frek1 = frekuensiPoligon(data1, min, max, panjangKelas, k);
  const frek2 = frekuensiPoligon(data2, min, max, panjangKelas, k);

  const ctx = document.getElementById("chartPoligon").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Dataset A",
          data: frek1,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          tension: 0.4
        },
        {
          label: "Dataset B",
          data: frek2,
          borderColor: "red",
          backgroundColor: "rgba(255,0,0,0.1)",
          tension: 0.4
        }
      ]
    }
  });
}

function buatDiagramBatangGabungan(data1, data2) {
  const allData = [...data1, ...data2].sort((a, b) => a - b);
  const k = Math.ceil(Math.sqrt(allData.length));
  const min = allData[0];
  const max = allData[allData.length - 1];
  const range = max - min;
  const panjangKelas = Math.ceil(range / k);

  let labels = [];
  let freq1 = [], freq2 = [];

  let batasBawah = min;
  for (let i = 0; i < k; i++) {
    let batasAtas = batasBawah + panjangKelas - 1;
    labels.push(`${batasBawah} - ${batasAtas}`);
    freq1.push(data1.filter(x => x >= batasBawah && x <= batasAtas).length);
    freq2.push(data2.filter(x => x >= batasBawah && x <= batasAtas).length);
    batasBawah = batasAtas + 1;
  }

  const ctx = document.getElementById("chartBatang").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Dataset A",
          data: freq1,
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        },
        {
          label: "Dataset B",
          data: freq2,
          backgroundColor: "rgba(255, 99, 132, 0.7)"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function hitungSemua() {
  const data1 = parseInput("dataInput");
  const data2 = parseInput("dataInput2");
  let result = "";

  if (data1.length) result += hitungStatistik(data1, "A");
  if (data2.length) result += hitungStatistik(data2, "B");

  document.getElementById("output").innerHTML = result;

  if (data1.length && data2.length) {
    buatBoxPlotChart(data1, data2);
    buatPoligonGabungan(data1, data2);
    buatDiagramBatangGabungan(data1, data2);
  }

  if (data1.length && data2.length) {
  const norm1 = ujiNormalitas(data1);
  const norm2 = ujiNormalitas(data2);
  const homo = ujiHomogenitas(data1, data2);
  const ttest = ujiT(data1, data2);
  const anova = ujiANOVA([data1, data2]);
  const korelasi = ujiKorelasi(data1, data2);
  const regresi = ujiRegresi(data1, data2);


  result += `
    <h3>📊 Uji Statistik</h3>
    <p><strong>Uji Normalitas</strong> (Skewness):<br/>
    Dataset A: ${norm1.skewness} → ${norm1.hasil ? 'Normal' : 'Tidak Normal'}<br/>
    Dataset B: ${norm2.skewness} → ${norm2.hasil ? 'Normal' : 'Tidak Normal'}</p>

    <p><strong>Uji Homogenitas</strong> (Rasio Varian): ${homo.rasio} → ${homo.hasil ? 'Homogen' : 'Tidak Homogen'}</p>

    <p><strong>Uji t</strong> (Independent Sample t-test): t hitung = ${ttest.tHitung} → ${ttest.hasil ? 'Tidak Signifikan' : 'Signifikan'}</p>
    <p><strong>Uji ANOVA</strong> (2 Kelompok): F hitung = ${anova.FH} → ${anova.hasil ? 'Tidak Signifikan' : 'Signifikan'}</p>

    <p><strong>Uji Korelasi Pearson</strong>: r = ${korelasi.r} → Kekuatan: ${korelasi.ket}</p>

    <p><strong>Uji Regresi Linear</strong>:<br/>
    ${regresi.persamaan}</p>
  `;

  document.getElementById("output").innerHTML = result;
}

}

function ujiNormalitas(data) {
  const n = data.length;
  const m = mean(data);
  const sd = stdDev(data);
  const zscores = data.map(x => (x - m) / sd);
  const skewness = (n / ((n - 1) * (n - 2))) * zscores.reduce((acc, z) => acc + Math.pow(z, 3), 0);

  return {
    hasil: Math.abs(skewness) < 1,
    skewness: skewness.toFixed(3)
  };
}

function ujiHomogenitas(data1, data2) {
  const n1 = data1.length, n2 = data2.length;
  const var1 = varians(data1), var2 = varians(data2);
  const F = var1 > var2 ? var1 / var2 : var2 / var1;
  const krit = 3; // Nilai kritis kasar

  return {
    hasil: F < krit,
    rasio: F.toFixed(3)
  };
}

function ujiT(data1, data2) {
  const n1 = data1.length, n2 = data2.length;
  const m1 = mean(data1), m2 = mean(data2);
  const v1 = varians(data1), v2 = varians(data2);

  const sp = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  const t = (m1 - m2) / (sp * Math.sqrt(1 / n1 + 1 / n2));
  const krit = 2.0; // pendekatan nilai kritis t tabel untuk df > 20

  return {
    hasil: Math.abs(t) < krit,
    tHitung: t.toFixed(3)
  };
}

function ujiANOVA(groups) {
  const k = groups.length;
  const n = groups.reduce((sum, g) => sum + g.length, 0);
  const grandMean = mean(groups.flat());

  const ssBetween = groups.reduce((sum, group) => sum + group.length * Math.pow(mean(group) - grandMean, 2), 0);
  const ssWithin = groups.reduce((sum, group) => sum + group.reduce((s, val) => s + Math.pow(val - mean(group), 2), 0), 0);

  const dfBetween = k - 1;
  const dfWithin = n - k;

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;

  const F = msBetween / msWithin;
  const krit = 4; // nilai kritis kasar F tabel

  return {
    hasil: F < krit,
    FH: F.toFixed(3)
  };
}

function ujiKorelasi(data1, data2) {
  const n = data1.length;
  const mean1 = mean(data1), mean2 = mean(data2);

  const numerator = data1.reduce((sum, val, i) => sum + (val - mean1) * (data2[i] - mean2), 0);
  const denominator = Math.sqrt(
    data1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
    data2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
  );

  const r = numerator / denominator;

  return {
    r: r.toFixed(3),
    ket: Math.abs(r) < 0.3 ? "Lemah" : (Math.abs(r) < 0.7 ? "Sedang" : "Kuat")
  };
}

function ujiRegresi(data1, data2) {
  const n = data1.length;
  const meanX = mean(data1), meanY = mean(data2);

  const SSxy = data1.reduce((sum, x, i) => sum + (x - meanX) * (data2[i] - meanY), 0);
  const SSxx = data1.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);

  const b1 = SSxy / SSxx;
  const b0 = meanY - b1 * meanX;

  return {
    persamaan: `Y = ${b0.toFixed(2)} + ${b1.toFixed(2)}X`,
    b0: b0,
    b1: b1
  };
}



function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const text = document.getElementById("output").innerText;
  const lines = pdf.splitTextToSize(text, 180);
  pdf.text(lines, 15, 20);
  pdf.save("statistikator.pdf");
}
