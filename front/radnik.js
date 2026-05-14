// ── Molba modal ──
function openMolbaChoice() {
  openModal('modal-molba-choice');
}

function openMolbaForm(type) {
  closeModal('modal-molba-choice');
  const titleField = document.getElementById('molba-title');
  const titleWrap  = document.getElementById('molba-title-wrap');

  if (type === 'slobodan') {
    titleField.value = 'Zahtev za slobodan dan';
    titleWrap.style.display = 'none'; // naslov je fiksiran, ne prikazujemo polje
  } else {
    titleField.value = '';
    titleWrap.style.display = 'block';
  }

  document.getElementById('molba-body').value = '';
  openModal('modal-molba-form');
}

function submitMolba() {
  // Prototip: samo zatvori modal
  closeModal('modal-molba-form');
}

function cancelMolba() {
  closeModal('modal-molba-form');
  closeModal('modal-molba-choice');
}
