let currentPage = null;
let checkedIn   = false;

// Inicijalizacija
document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.page.active');
  if (first) currentPage = first.id;
});

// Navigacija
function goTo(pageId, btn) {
  if (currentPage) document.getElementById(currentPage)?.classList.remove('active');
  currentPage = pageId;
  document.getElementById(pageId)?.classList.add('active');

  if (btn && btn._isNavBtn !== false) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn.classList) btn.classList.add('active');
  }
}

function dummyBtn() {
  return { _isNavBtn: false };
}

// Check-in / Check-out
function toggleCheckin() {
  checkedIn = !checkedIn;
  const btn    = document.getElementById('checkin-btn');
  const status = document.getElementById('checkin-status');
  if (!btn) return;
  if (checkedIn) {
    btn.textContent = '🔴 CHECK OUT';
    btn.className   = 'checkin-btn out';
    const now = new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
    if (status) status.textContent = `Prijavljen/a od ${now}`;
  } else {
    btn.textContent = '✅ CHECK IN';
    btn.className   = 'checkin-btn in';
    if (status) status.textContent = 'Nisi prijavljen/a na posao';
  }
}

// Odjava
function logout() {
  window.location.href = 'index.html';
}

// Modal helper
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
