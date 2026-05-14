const RADNICI = ['Jovan Đorđević', 'Ana Milić', 'Stefan Nikolić', 'Milica Savić', 'Nemanja Jović'];

//  Generisanje smena 
function buildSmene() {
  const container = document.getElementById('smene-container');
  if (!container) return;

  const smeneData = [
    { prva: 'Jovan Đorđević', druga: 'Ana Milić'     },
    { prva: 'Stefan Nikolić', druga: null             },
    { prva: 'Milica Savić',   druga: 'Nemanja Jović'  },
    { prva: null,             druga: 'Jovan Đorđević' },
  ];

  const today = new Date();
  const day   = today.getDay();
  const diff  = (day === 0) ? 1 : (8 - day) % 7 || 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() + (day === 1 ? 0 : diff));

  const fmt = d => d.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });

  let html = '';
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const s = smeneData[i];

    html += `
      <div class="smena-card">
        <div class="smena-header">
          <span>${i + 1}. nedelja &nbsp;·&nbsp; ${fmt(weekStart)} – ${fmt(weekEnd)}</span>
          <button class="btn-izmeni" onclick="openKreirajSmenuModal(${i + 1})">✏️ Izmeni</button>
        </div>
        <div class="smena-row">
          <span class="smena-label">I smena</span>
          <span class="smena-value ${s.prva ? '' : 'smena-prazna'}">${s.prva || 'Nema zaduženih radnika'}</span>
        </div>
        <div class="smena-row">
          <span class="smena-label">II smena</span>
          <span class="smena-value ${s.druga ? '' : 'smena-prazna'}">${s.druga || 'Nema zaduženih radnika'}</span>
        </div>
      </div>`;
  }
  container.innerHTML = html;
}

//  Kreiraj smenu modal 
function openKreirajSmenuModal(nedeljaBr) {
  // Popuni select sa nedeljama
  const sel = document.getElementById('smena-nedelja');
  if (sel && nedeljaBr) sel.value = nedeljaBr;

  // Resetuj checkboxe
  document.querySelectorAll('.smena-radnik-check').forEach(cb => cb.checked = false);
  document.getElementById('smena-tip').value = 'prva';

  openModal('modal-kreiraj-smenu');
}

function openNovaSmenaDirektno() {
  const sel = document.getElementById('smena-nedelja');
  if (sel) sel.value = 1;
  document.querySelectorAll('.smena-radnik-check').forEach(cb => cb.checked = false);
  document.getElementById('smena-tip').value = 'prva';
  openModal('modal-kreiraj-smenu');
}

function saveSmena() {
  // To do, prototip
  closeModal('modal-kreiraj-smenu');
}

//  Kreiraj zadatak modal 
function openNoviZadatak() {
  document.getElementById('zadatak-naziv').value    = '';
  document.getElementById('zadatak-opis').value     = '';
  document.getElementById('zadatak-radnik').value   = RADNICI[0];
  openModal('modal-novi-zadatak');
}

function saveZadatak() {
  // To do, prototip
  closeModal('modal-novi-zadatak');
}

//  Filter radnika 
let activeFilter = 'svi';

function filterRadnici(filter, btn) {
  activeFilter = filter;

  // Ažuriraj dugmice
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Prikaži/sakrij radnike
  document.querySelectorAll('.radnik-item').forEach(item => {
    const status = item.dataset.status; // 'na-poslu' ili 'nije'
    if (filter === 'svi')      item.style.display = '';
    else if (filter === 'na')  item.style.display = (status === 'na-poslu') ? '' : 'none';
    else if (filter === 'nije') item.style.display = (status === 'nije')    ? '' : 'none';
  });
}

//  Init 
document.addEventListener('DOMContentLoaded', () => {
  buildSmene();

  // Popuni select za nedelje u modalu
  const sel = document.getElementById('smena-nedelja');
  if (sel) {
    for (let i = 1; i <= 52; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${i}. nedelja`;
      sel.appendChild(opt);
    }
  }

  // Popuni select za radnike u zadatak modalu
  const radnikSel = document.getElementById('zadatak-radnik');
  if (radnikSel) {
    RADNICI.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      radnikSel.appendChild(opt);
    });
  }
});
