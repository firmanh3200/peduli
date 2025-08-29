document.addEventListener('DOMContentLoaded', async () => {
        // --- Bagian DAFTAR DATA JABAR ---
    const daftarDataJabarUrl = 'https://raw.githubusercontent.com/firmanh3200/Pembinaan-Statistik-Sektoral/refs/heads/main/data/daftar-data-jabar.csv';
    let daftarDataJabar = [];

    await new Promise((resolve, reject) => {
        Papa.parse(daftarDataJabarUrl, {
            download: true, // Beri tahu Papa Parse untuk mengunduh file
            header: true,   // Asumsikan baris pertama adalah header
            complete: function(results) {
                if (results.errors.length) {
                    console.error("Error parsing CSV:", results.errors);
                    reject(results.errors);
                } else {
                    daftarDataJabar = results.data;
                    resolve();
                }
            },
            error: function(err, file, inputElem, reason) {
                console.error("Network or parsing error:", err, reason);
                reject(err);
            }
        });
    });
    // Sekarang 'daftarDataJabar' sudah terisi dan siap digunakan

    // Menghitung jumlah kemunculan setiap PENGHASIL DATA
    const penghasilDataCounts = {};
    daftarDataJabar.forEach(item => {
        const opd = item['PENGHASIL DATA'];
        penghasilDataCounts[opd] = (penghasilDataCounts[opd] || 0) + 1;
    });

    const df2Counts = Object.entries(penghasilDataCounts).map(([opd, count]) => ({
        'PENGHASIL DATA': opd,
        count: count
    }));
    df2Counts.sort((a, b) => b.count - a.count); // Urutkan berdasarkan count

    // Render tabel penghasil data counts
    const penghasilDataTableBody = document.querySelector('#penghasil-data-counts tbody');
    penghasilDataTableBody.innerHTML = '';
    df2Counts.forEach(item => {
        const row = penghasilDataTableBody.insertRow();
        row.insertCell().textContent = item['PENGHASIL DATA'];
        row.insertCell().textContent = item.count;
    });

    // Render Sunburst Chart menggunakan Plotly.js
    const sunburstData = [{
        type: "sunburst",
        labels: df2Counts.map(item => item['PENGHASIL DATA']),
        parents: df2Counts.map(() => ""), // Semua dari root
        values: df2Counts.map(item => item.count),
        insidetextorientation: 'radial',
        hoverinfo: 'label+value',
        leaf: {opacity: 0.4},
        marker: {line: {width: 2}}
    }];

    const sunburstLayout = {
        margin: {l: 0, r: 0, b: 0, t: 0},
        sunburstcolorway: ["#636efa","#EF553B","#00cc96","#ab63fa","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"]
    };

    Plotly.newPlot('sunburst-chart-container', sunburstData, sunburstLayout);


    // Isi selectbox Filter Produsen Data
    const opdSelect = document.getElementById('opd-select');
    const uniqueOpd = [...new Set(daftarDataJabar.map(item => item['PENGHASIL DATA']))].sort();
    uniqueOpd.forEach(opd => {
        const option = document.createElement('option');
        option.value = opd;
        option.textContent = opd;
        opdSelect.appendChild(option);
    });

    const filteredDataJabarTable = document.getElementById('filtered-data-jabar');
    const filteredDataJabarTableHeader = filteredDataJabarTable.querySelector('thead tr');
    const filteredDataJabarTableBody = filteredDataJabarTable.querySelector('tbody');

    // Fungsi untuk merender tabel data jabar yang difilter
    function renderFilteredDataJabar(selectedOpd) {
        filteredDataJabarTableBody.innerHTML = '';
        const df3 = daftarDataJabar.filter(item => item['PENGHASIL DATA'] === selectedOpd);

        // Clear existing headers first
        filteredDataJabarTableHeader.innerHTML = '';
        if (df3.length > 0) {
            // Create headers dynamically from the first item's keys
            Object.keys(df3[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                filteredDataJabarTableHeader.appendChild(th);
            });

            df3.forEach(item => {
                const row = filteredDataJabarTableBody.insertRow();
                Object.values(item).forEach(value => {
                    row.insertCell().textContent = value;
                });
            });
        } else {
             const th = document.createElement('th');
             th.textContent = 'Tidak ada data untuk produsen ini.';
             th.setAttribute('colspan', '1'); // Span across one column
             filteredDataJabarTableHeader.appendChild(th);
        }
    }

    // Event listener untuk selectbox Produsen Data
    opdSelect.addEventListener('change', (event) => {
        renderFilteredDataJabar(event.target.value);
    });

    // Initial render for the first selected OPD
    if (opdSelect.value) {
        renderFilteredDataJabar(opdSelect.value);
    }


    // --- Bagian Data Statistik Sektoral Daerah di SIPD ---
    const sipdDataResponse = await fetch('data/sipd-data.json');
    const sipdData = await sipdDataResponse.json();

    const sipdTable = document.getElementById('sipd-data');
    const sipdTableHeader = sipdTable.querySelector('thead tr');
    const sipdTableBody = sipdTable.querySelector('tbody');

    if (sipdData.length > 0) {
        // Create headers
        Object.keys(sipdData[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            sipdTableHeader.appendChild(th);
        });

        // Populate table body
        sipdData.forEach(item => {
            const row = sipdTableBody.insertRow();
            Object.values(item).forEach(value => {
                row.insertCell().textContent = value;
            });
        });
    }

    // --- Bagian Indikator Kinerja Daerah Provinsi Jawa Barat ---
    const ikdDataResponse = await fetch('data/ikd-jabar.json');
    const ikdData = await ikdDataResponse.json();

    const perangkatDaerahSelect = document.getElementById('perangkat-daerah-select');
    const uniquePerangkatDaerah = [...new Set(ikdData.map(item => item['PERANGKAT DAERAH']))].sort();
    uniquePerangkatDaerah.forEach(pd => {
        const option = document.createElement('option');
        option.value = pd;
        option.textContent = pd;
        perangkatDaerahSelect.appendChild(option);
    });

    const ikdTable = document.getElementById('ikd-data');
    const ikdTableHeader = ikdTable.querySelector('thead tr');
    const ikdTableBody = ikdTable.querySelector('tbody');

    function renderFilteredIkdData(selectedPd) {
        ikdTableBody.innerHTML = '';
        const df3 = ikdData.filter(item => item['PERANGKAT DAERAH'] === selectedPd);
        const df4 = df3.sort((a, b) => a['INDIKATOR KINERJA DAERAH'].localeCompare(b['INDIKATOR KINERJA DAERAH']));

        // Clear existing headers first, then recreate
        ikdTableHeader.innerHTML = '';
        if (df4.length > 0) {
            Object.keys(df4[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                ikdTableHeader.appendChild(th);
            });

            df4.forEach(item => {
                const row = ikdTableBody.insertRow();
                Object.values(item).forEach(value => {
                    row.insertCell().textContent = value;
                });
            });
        } else {
             const th = document.createElement('th');
             th.textContent = 'Tidak ada data untuk perangkat daerah ini.';
             th.setAttribute('colspan', '1'); // Span across one column
             ikdTableHeader.appendChild(th);
        }
    }

    perangkatDaerahSelect.addEventListener('change', (event) => {
        renderFilteredIkdData(event.target.value);
    });

    if (perangkatDaerahSelect.value) {
        renderFilteredIkdData(perangkatDaerahSelect.value);
    }
});