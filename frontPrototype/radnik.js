function openMolbaForm() {
  document.getElementById('molba-date').value = '';
  document.getElementById('molba-body').value = '';

  openModal('modal-molba-form');
}

function submitMolba() {
  const datum = document.getElementById('molba-date').value;
  const obrazlozenje = document.getElementById('molba-body').value.trim();

  if (!datum) {
    alert('Izaberi datum slobodnog dana.');
    return;
  }

  const danas = new Date();
  danas.setHours(0, 0, 0, 0);

  const izabraniDatum = new Date(datum);
  izabraniDatum.setHours(0, 0, 0, 0);

  if (izabraniDatum < danas) {
    alert('Datum slobodnog dana ne može biti u prošlosti.');
    return;
  }

  alert('Zahtev za slobodan dan je uspešno poslat.');
  cancelMolba();
}

function cancelMolba() {
  closeModal('modal-molba-form');
}

// ─────────────────────────────────────────────
// Radnik: izmena korisničkog imena i lozinke
// ─────────────────────────────────────────────

function openIzmenaProfila() {
  document.getElementById('profil-korisnicko-input').value =
    document.getElementById('profil-korisnicko').textContent.trim();

  document.getElementById('profil-lozinka-input').value = '';
  document.getElementById('profil-lozinka-potvrda-input').value = '';

  openModal('modal-izmena-profila');
}

function sacuvajIzmenuProfila() {
  const korisnicko = document.getElementById('profil-korisnicko-input').value.trim();
  const lozinka = document.getElementById('profil-lozinka-input').value;
  const potvrda = document.getElementById('profil-lozinka-potvrda-input').value;

  if (!korisnicko) {
    alert('Korisničko ime mora biti popunjeno.');
    return;
  }

  if (lozinka || potvrda) {
    if (lozinka.length < 6) {
      alert('Nova lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    if (lozinka !== potvrda) {
      alert('Lozinke se ne podudaraju.');
      return;
    }
  }

  document.getElementById('profil-korisnicko').textContent = korisnicko;

  alert('Podaci su uspešno ažurirani.');
  closeModal('modal-izmena-profila');
}