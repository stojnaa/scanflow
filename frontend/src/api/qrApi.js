import client from './client'

// Imenovane funkcije za pozive ka QR/evidencija domenu (Task 2).

// GET /terminali/:terminalId/qr-kod/  ->  { token, terminal, vreme_isteka }
export async function dohvatiQrKod(terminalId) {
  const { data } = await client.get(`/terminali/${terminalId}/qr-kod/`)
  return data
}

// POST /evidencija/skeniraj/  ->  { id, zaposleni, zaposleni_detail, tip, vreme, qr_token }
export async function posaljiSkeniranje(token) {
  const { data } = await client.post('/evidencija/skeniraj/', { token })
  return data
}

// GET /menadzer/prisutni/  ->  [{ zaposleni, vreme_dolaska }]
export async function dohvatiPrisutne() {
  const { data } = await client.get('/menadzer/prisutni/')
  return data
}
