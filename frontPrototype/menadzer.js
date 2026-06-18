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
  document.getElementById('zadatak-naziv').value = '';
  document.getElementById('zadatak-opis').value = '';
  document.getElementById('zadatak-radnik').value = RADNICI[0];

  // resetuj prioritet i rok
  document.getElementById('zadatak-prioritet').value = 'srednji';
  document.getElementById('zadatak-rok').value = '';

  openModal('modal-novi-zadatak');
}

function saveZadatak() {
  const naziv = document.getElementById('zadatak-naziv').value.trim();
  const opis = document.getElementById('zadatak-opis').value.trim();
  const radnik = document.getElementById('zadatak-radnik').value;
  const prioritet = document.getElementById('zadatak-prioritet').value;
  const rok = document.getElementById('zadatak-rok').value;

  if (!naziv || !opis || !radnik || !prioritet) {
    alert('Popuni obavezna polja za zadatak.');
    return;
  }

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

// ─────────────────────────────────────────────
// Menadžer: dodavanje radnika u određeni tim
// ─────────────────────────────────────────────

const clanoviTimova = {
  front: ["Jovan Đorđević", "Ana Milić"],
  back: ["Stefan Nikolić"]
};

const radniciZaTim = {
  jovan: "Jovan Đorđević",
  ana: "Ana Milić",
  stefan: "Stefan Nikolić",
  milica: "Milica Savić",
  nemanja: "Nemanja Jović"
};

let izabraniTimZaDodavanje = null;

function openDodajRadnikaUTim(tim) {
  izabraniTimZaDodavanje = tim;

  const opis = document.getElementById("dodaj-u-tim-opis");

  if (opis) {
    if (tim === "front") {
      opis.textContent = "Izaberi radnika kog želiš da dodaš u tim Front.";
    } else if (tim === "back") {
      opis.textContent = "Izaberi radnika kog želiš da dodaš u tim Back.";
    }
  }

  openModal("modal-dodaj-u-tim");
}

function dodajRadnikaUTim() {
  const radnikId = document.getElementById("radnik-select")?.value;

  if (!izabraniTimZaDodavanje || !radnikId) return;

  const tim = izabraniTimZaDodavanje;
  const imeRadnika = radniciZaTim[radnikId];

  if (clanoviTimova[tim].includes(imeRadnika)) {
    prikaziTimPoruku("Radnik već pripada izabranom timu.");
    closeModal("modal-dodaj-u-tim");
    return;
  }

  clanoviTimova[tim].push(imeRadnika);
  osveziPrikazTima(tim);

  prikaziTimPoruku("Radnik je uspešno dodat u izabrani tim.");
  closeModal("modal-dodaj-u-tim");

  izabraniTimZaDodavanje = null;
}

function osveziPrikazTima(tim) {
  const containerId = tim === "front" ? "tim-front-clanovi" : "tim-back-clanovi";
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";

  clanoviTimova[tim].forEach(ime => {
    const clan = document.createElement("div");
    clan.className = "tim-member";

    clan.innerHTML = `
      <span class="tim-member-name">${ime}</span>
    `;

    container.appendChild(clan);
  });
}

function prikaziTimPoruku(tekst) {
  const poruka = document.getElementById("tim-poruka");
  const porukaTekst = document.getElementById("tim-poruka-tekst");

  if (!poruka || !porukaTekst) return;

  porukaTekst.textContent = tekst;
  poruka.style.display = "block";
}