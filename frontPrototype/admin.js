// ─────────────────────────────────────────────
// Admin: pretraga zaposlenih + detaljan pregled
// ─────────────────────────────────────────────

const zaposleni = [
  {
    id: "jovan",
    ime: "Jovan Đorđević",
    korisnickoIme: "jdjordjevic",
    uloga: "Radnik",
    tim: "Front",
    sati: "84h",
    status: "Na poslu",
    checkin: "08:57",
    zadaci: "3 aktivna zadatka",
    aktivnost: "Danas"
  },
  {
    id: "ana",
    ime: "Ana Milić",
    korisnickoIme: "amilic",
    uloga: "Radnik",
    tim: "Front",
    sati: "76h",
    status: "Nije na poslu",
    checkin: "-",
    zadaci: "2 aktivna zadatka",
    aktivnost: "Juče"
  },
  {
    id: "stefan",
    ime: "Stefan Nikolić",
    korisnickoIme: "snikolic",
    uloga: "Radnik",
    tim: "Back",
    sati: "91h",
    status: "Na poslu",
    checkin: "07:45",
    zadaci: "4 aktivna zadatka",
    aktivnost: "Danas"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  iscrtajListuZaposlenih(zaposleni);

  const pretraga = document.getElementById("pretraga-zaposlenih");
  if (pretraga) {
    pretraga.addEventListener("input", pretraziZaposlene);
  }
});

function iscrtajListuZaposlenih(lista) {
  const listaZaposlenih = document.getElementById("lista-zaposlenih");
  const nemaRezultata = document.getElementById("nema-rezultata");

  if (!listaZaposlenih) return;

  listaZaposlenih.innerHTML = "";

  if (lista.length === 0) {
    if (nemaRezultata) nemaRezultata.style.display = "block";
    sakrijDetaljeZaposlenog();
    return;
  }

  if (nemaRezultata) nemaRezultata.style.display = "none";

  lista.forEach(z => {
    const kartica = document.createElement("div");
    kartica.className = "admin-radnik-card";
    kartica.style.cursor = "pointer";

    kartica.addEventListener("click", () => {
      prikaziDetaljeZaposlenog(z.id);
    });

    const statusClass = z.status === "Na poslu"
      ? "status-na-poslu"
      : "status-nije";

    kartica.innerHTML = `
      <div class="admin-radnik-header">
        <div class="admin-radnik-ime">${z.ime}</div>
        <span class="status-badge ${statusClass}">${z.status}</span>
      </div>

      <div class="admin-radnik-fields">
        <div class="admin-radnik-field">
          <span class="lbl">Tim</span>
          <span class="val">${z.tim}</span>
        </div>
      </div>
    `;

    listaZaposlenih.appendChild(kartica);
  });
}

function pretraziZaposlene() {
  const inputPretraga = document.getElementById("pretraga-zaposlenih");
  if (!inputPretraga) return;

  const unos = inputPretraga.value.toLowerCase().trim();

  const filtriraniZaposleni = zaposleni.filter(z => {
    const tekstZaPretragu = `
      ${z.ime}
      ${z.korisnickoIme}
      ${z.uloga}
      ${z.tim}
      ${z.status}
    `.toLowerCase();

    return tekstZaPretragu.includes(unos);
  });

  iscrtajListuZaposlenih(filtriraniZaposleni);
  sakrijDetaljeZaposlenog();
}

function prikaziDetaljeZaposlenog(id) {
  const z = zaposleni.find(zaposleni => zaposleni.id === id);
  if (!z) return;

  postaviTekst("detalji-ime", z.ime);
  postaviTekst("detalji-korisnicko-ime", z.korisnickoIme);
  postaviTekst("detalji-uloga", z.uloga);
  postaviTekst("detalji-tim", z.tim);
  postaviTekst("detalji-sati", z.sati);
  postaviTekst("detalji-checkin", z.checkin);
  postaviTekst("detalji-zadaci", z.zadaci);
  postaviTekst("detalji-aktivnost", z.aktivnost);

  const status = document.getElementById("detalji-status");

  if (status) {
    status.textContent = z.status;
    status.className = "status-badge";

    if (z.status === "Na poslu") {
      status.classList.add("status-na-poslu");
    } else {
      status.classList.add("status-nije");
    }
  }

  const detalji = document.getElementById("detalji-zaposlenog");
  if (detalji) {
    detalji.style.display = "block";
  }
}

function sakrijDetaljeZaposlenog() {
  const detalji = document.getElementById("detalji-zaposlenog");

  if (detalji) {
    detalji.style.display = "none";
  }
}

function postaviTekst(idElementa, tekst) {
  const element = document.getElementById(idElementa);

  if (element) {
    element.textContent = tekst;
  }
}

// ─────────────────────────────────────────────
// Admin: globalna statistika i analitika
// ─────────────────────────────────────────────

function generisiAnalitiku() {
  const period = document.getElementById("analitika-period")?.value;
  const tim = document.getElementById("analitika-tim")?.value;
  const status = document.getElementById("analitika-status")?.value;

  const rezultati = document.getElementById("analitika-rezultati");
  const nemaPodataka = document.getElementById("analitika-nema-podataka");

  if (!rezultati || !nemaPodataka) return;

  // Demo slučaj za alternativni scenario:
  // ako admin izabere Back + Nisu na poslu, prikazujemo da nema podataka.
  if (tim === "back" && status === "nije-na-poslu") {
    rezultati.style.display = "none";
    nemaPodataka.style.display = "block";
    return;
  }

  nemaPodataka.style.display = "none";
  rezultati.style.display = "block";

  let nazivPerioda = "";

  if (period === "danas") nazivPerioda = "Danas";
  else if (period === "nedelja") nazivPerioda = "Ova nedelja";
  else if (period === "mesec") nazivPerioda = "Ovaj mesec";
  else if (period === "godina") nazivPerioda = "Ova godina";

  let ukupnoSati = "251h";
  let prijave = "48";
  let odjave = "45";
  let zavrseni = "18";
  let uToku = "7";

  if (period === "danas") {
    ukupnoSati = "24h";
    prijave = "5";
    odjave = "2";
    zavrseni = "3";
    uToku = "4";
  } else if (period === "nedelja") {
    ukupnoSati = "96h";
    prijave = "21";
    odjave = "19";
    zavrseni = "9";
    uToku = "6";
  } else if (period === "godina") {
    ukupnoSati = "2840h";
    prijave = "612";
    odjave = "598";
    zavrseni = "213";
    uToku = "15";
  }

  if (tim === "front") {
    ukupnoSati = "160h";
    prijave = "31";
    odjave = "29";
    zavrseni = "12";
    uToku = "5";
  } else if (tim === "back") {
    ukupnoSati = "91h";
    prijave = "17";
    odjave = "16";
    zavrseni = "6";
    uToku = "2";
  }

  postaviTekst("stat-period", nazivPerioda);
  postaviTekst("stat-sati", ukupnoSati);
  postaviTekst("stat-prijave", prijave);
  postaviTekst("stat-odjave", odjave);
  postaviTekst("stat-zavrseni", zavrseni);
  postaviTekst("stat-u-toku", uToku);
}
