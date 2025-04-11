let allData = [];
const fields = ['A', 'B', 'C'];
const filterState = Object.fromEntries(fields.map(f => [f, null]));
const $ = id => document.getElementById(id);

fetch('testData.txt')
    .then(res => res.text())
    .then(text => parseData(text))
    .catch(() => parseData());

function parseData(text) {
    allData = text
        ? text.trim().split('\n').map(line => {
            const [A, B, C] = line.split(',').map(v => v.trim());
            return { A, B, C };
        })
        : [
            { A: 'A1', B: 'B1', C: 'C1' },
            { A: 'A1', B: 'B1', C: 'C2' },
            { A: 'A1', B: 'B1', C: 'C3' },
            { A: 'A1', B: 'B2', C: 'C4' },
            { A: 'A1', B: 'B2', C: 'C5' },
            { A: 'A1', B: 'B3', C: 'C6' },
            { A: 'A2', B: 'B4', C: 'C7' },
            { A: 'A2', B: 'B5', C: 'C8' },
            { A: 'A2', B: 'B5', C: 'C9' },
            { A: 'A3', B: 'B6', C: 'C10' }
        ];
    init();
}

function init() {
    fields.forEach(f => {
        $(`select${f}`).addEventListener('change', () => {
            const val = $(`select${f}`).value;
            filterState[f] = val === 'Toate' ? null : val;
            autoResolveFilters(f);
            updateUI();
        });
    });
    updateUI();
}

function getFilteredData() {
    return allData.filter(row =>
        fields.every(f => !filterState[f] || row[f] === filterState[f])
    );
}

function updateUI() {
    const filtered = getFilteredData();

    fields.forEach(f => {
        const sel = $(`select${f}`);
        const values = [...new Set(filtered.map(r => r[f]))].sort();
        const isSingle = values.length === 1;
        const showAll = values.length > 1;

        sel.innerHTML = (showAll ? ['Toate'] : []).concat(values)
            .map(v => `<option value="${v}">${v}</option>`)
            .join('');

        if (filterState[f] && values.includes(filterState[f])) {
            sel.value = filterState[f];
        } else if (isSingle) {
            filterState[f] = values[0];
            sel.value = values[0];
        } else {
            filterState[f] = null;
            sel.value = 'Toate';
        }
    });

    $('dataTable').querySelector('tbody').innerHTML = filtered
        .map(r => `<tr><td>${r.A}</td><td>${r.B}</td><td>${r.C}</td></tr>`)
        .join('');
}

function autoResolveFilters(changedField) {
    const remainingFields = fields.filter(f => f !== changedField);
    let filtered = getFilteredData();

    for (const f of remainingFields) {
        const options = [...new Set(filtered.map(r => r[f]))];
        if (options.length === 1) {
            filterState[f] = options[0];
            filtered = getFilteredData();
        }
    }
}
