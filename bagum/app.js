const DATA = [
  { no: 1, nama: "Perencanaan & Penganggaran", items: [
    { sub: "a. Perencanaan", akt: "Review kesesuaian rencana kerja triwulanan dengan Renstra.", evid: "Dokumen Renstra/PK" },
    { sub: "b. Penganggaran", akt: "Update Petunjuk Operasional Kegiatan (POK) dan revisi anggaran jika ada.", evid: "DIPA/POK/Aplikasi SAKTI" },
  ]},
  { no: 2, nama: "Keuangan & BMN", items: [
    { sub: "a. Keuangan", akt: "Kelancaran pembayaran gaji/tukin dan penyusunan laporan keuangan triwulanan.", evid: "Laporan Realisasi Anggaran" },
    { sub: "b. BMN", akt: "Pelaksanaan stock opname persediaan dan update labelisasi aset (QR Code).", evid: "Berita Acara Stock Opname" },
  ]},
  { no: 3, nama: "Administrasi SDM", items: [
    { sub: "a. Admin. Kepegawaian", akt: "Pemrosesan Kenaikan Gaji Berkala (KGB) dan administrasi mutasi tepat waktu.", evid: "SK KGB/Mutasi" },
    { sub: "b. Pemutakhiran Data", akt: "Tingkat kemutakhiran data pegawai pada sistem HRIS/SIMPEG.", evid: "Dashboard HRIS" },
  ]},
  { no: 4, nama: "Humas, Hukum, Kearsipan, & Persandian", items: [
    { sub: "a. Humas & Kerja Sama", akt: "Monitoring publikasi media dan pembaruan naskah kerja sama (MoU/PKS).", evid: "Kliping Media / Dokumen PKS" },
    { sub: "b. Hukum & Organisasi", akt: "Evaluasi relevansi produk hukum internal (SK Kepala BPS Provinsi).", evid: "Daftar SK Terbit" },
    { sub: "c. Kearsipan & Persandian", akt: "Digitalisasi arsip dinamis dan penggunaan Tanda Tangan Elektronik (TTE).", evid: "Log Kearsipan Digital" },
  ]},
  { no: 5, nama: "Org. Tata Laksana & RB", items: [
    { sub: "a. Tata Laksana", akt: "Review dan pemutakhiran Standard Operating Procedure (SOP) tim kerja.", evid: "Dokumen SOP Terbaru" },
    { sub: "b. Reformasi Birokrasi", akt: "Pemenuhan bukti dukung (evidence) Zona Integritas (ZI) untuk triwulan berjalan.", evid: "Laporan PMPRB" },
  ]},
  { no: 6, nama: "Manajemen Risiko & Pelaporan", items: [
    { sub: "a. Manajemen Risiko", akt: "Update register risiko dan evaluasi efektivitas mitigasi risiko.", evid: "Matriks Risiko" },
    { sub: "b. Monev & Pelaporan", akt: "Penyusunan laporan kinerja triwulanan sesuai indikator kinerja utama.", evid: "Laporan Kinerja (Lakin)" },
  ]},
  { no: 7, nama: "Ketatausahaan & Rumah Tangga", items: [
    { sub: "a. Ketatausahaan", akt: "Ketertiban tata naskah dinas dan kecepatan distribusi disposisi pimpinan.", evid: "Log Surat Masuk/Keluar" },
    { sub: "b. Perlengkapan", akt: "Distribusi Alat Tulis Kantor (ATK) sesuai permintaan unit kerja.", evid: "Form Permintaan Barang" },
    { sub: "c. Rumah Tangga", akt: "Pelaksanaan pemeliharaan rutin gedung, kendaraan, dan keamanan area kantor.", evid: "Logbook Maintenance" },
  ]},
];

const tbody = document.getElementById("tbody");

function statusOf(v) {
  if (v === null || v === "") return null;
  if (v >= 100) return { label: "Selesai", cls: "good" };
  if (v >= 75) return { label: "Baik", cls: "good" };
  if (v >= 50) return { label: "Berjalan", cls: "ok" };
  return { label: "Perlu Perhatian", cls: "warn" };
}

function valueOf(input) {
  const v = input.value.trim();
  if (v === "") return null;
  return Math.max(0, Math.min(100, Number(v)));
}

function render() {
  tbody.innerHTML = "";
  let itemCount = 0;
  DATA.forEach((f) => {
    const funcTr = document.createElement("tr");
    funcTr.className = "func";
    funcTr.innerHTML = `<td class="no"></td><td colspan="6" class="func-name">${f.no}. ${f.nama}</td>`;
    tbody.appendChild(funcTr);

    f.items.forEach((it) => {
      itemCount++;
      const tr = document.createElement("tr");
      tr.className = "item";
      tr.innerHTML = `
        <td class="no"></td>
        <td class="sub">${it.sub}</td>
        <td class="act">${it.akt}</td>
        <td class="tri">Triwulan</td>
        <td class="real-cell">
          <input class="real" type="number" min="0" max="100" placeholder="%" />
          <span class="badge-state"></span>
        </td>
        <td class="evid">${it.evid}</td>
        <td><input class="cat" type="text" placeholder="Catatan / kendala" /></td>
      `;
      const badge = tr.querySelector(".badge-state");
      const realInp = tr.querySelector(".real");
      const catInp = tr.querySelector(".cat");
      realInp.addEventListener("input", () => {
        const st = statusOf(valueOf(realInp));
        badge.classList.remove("good", "ok", "warn");
        if (st) {
          badge.textContent = st.label;
          badge.classList.add(st.cls);
        } else {
          badge.textContent = "";
        }
      });
      tr.querySelector(".no").textContent = itemCount;
      tbody.appendChild(tr);
    });
  });
}

function collectData() {
  const rows = [];
  DATA.forEach((f) => {
    f.items.forEach((it, i) => {
      const tr = tbody.querySelectorAll("tr.item")[rows.length];
      const realInp = tr.querySelector(".real");
      const catInp = tr.querySelector(".cat");
      const v = valueOf(realInp);
      rows.push({
        SubFungsi: `${f.no}. ${f.nama}`,
        Item: it.sub,
        Target: it.akt,
        Triwulanan: "Triwulan",
        Realisasi: v === null ? "" : v,
        BuktiDukung: it.evid,
        Catatan: catInp.value.trim(),
      });
    });
  });
  return rows;
}

document.getElementById("printBtn").addEventListener("click", () => window.print());

const themeBtn = document.getElementById("themeBtn");

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "Tema Terang" : "Tema Gelap";
  try { localStorage.setItem("kke-theme", t); } catch (e) {}
}

themeBtn.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(cur);
});

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("kke-theme"); } catch (e) {}
  const prefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved === "light" || (saved !== "dark" && prefersLight) ? "light" : "dark");
})();

render();
