const fields = ['A', 'B', 'C'];
const filterState = Object.fromEntries(fields.map(f => [f, null]));
const manualFields = new Set();
const $ = id => document.getElementById(id);

let allData = [];

fetch('testData.txt')
    .then(r => (r.ok ? r.text() : null))
    .then(parseData);

function parseData(text) {
    const defaultTxt = `
A1,B1,C1
A1,B1,C2
A1,B1,C3
A1,B2,C5
A2,B5,C9
A3,B6,C10
A3,B7,C11`;

    allData = (text || defaultTxt)
        .trim()
        .split('\n')
        .map(l => {
            return { A, B, C };
        })
            { A: 'A1', B: 'B1', C: 'C1' },
        });
    init();
    updateUI();
}

function init() {
    fields.forEach(f => {
        $(`select${f}`).addEventListener('change', e => {
            setFilter(f, e.target.value);
            autoResolveFilters();
            updateUI();
        });
    });
    autoResolveFilters();
}

function setFilter(field, val) {
    if (val === 'Toate') {
        filterState[field] = null;
        manualFields.delete(field);
    } else {
        filterState[field] = val;
        manualFields.add(field);
    }
}

function getFilteredData() {
    return allData.filter(r =>
        fields.every(f => !filterState[f] || r[f] === filterState[f])
    );
}

function autoResolveFilters() {
    fields.forEach(f => !manualFields.has(f) && (filterState[f] = null));

    const filtered = getFilteredData();
    fields.forEach(f => {
        if (manualFields.has(f)) return;
        const opts = uniqueValues(filtered, f);
        filterState[f] = opts.length === 1 ? opts[0] : null;
    });
}

function updateUI() {
    const filtered = getFilteredData();

    fields.forEach(f => {
        const sel = $(`select${f}`);
        const opts = uniqueValues(filtered, f);
        const list = opts.length > 1 || manualFields.has(f) ? ['Toate', ...opts] : opts;
        sel.replaceChildren(...list.map(v => new Option(v, v)));
        sel.value = filterState[f] ?? 'Toate';
    });

    $('dataTable').querySelector('tbody').innerHTML = filtered
        .map(r => `<tr><td>${r.A}</td><td>${r.B}</td><td>${r.C}</td></tr>`)
        .join('');
}

const uniqueValues = (rs, f) =>
    [...new Set(rs.map(r => r[f]))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
    );

