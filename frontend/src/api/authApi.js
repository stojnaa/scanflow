import client from './client'

// Imenovane funkcije za pozive ka auth/identitet domenu — "ugovor" koji ostali domeni
// (Task 2–4) mogu da koriste kao obrazac. Svaka vraća podatke iz odgovora servera.

// POST /auth/prijava/  ->  { token, zaposleni }
export async function prijavaZahtev({ korImeIliMejl, sifra }) {
  const { data } = await client.post('/auth/prijava/', {
    kor_ime_ili_mejl: korImeIliMejl,
    sifra,
  })
  return data
}

// POST /auth/registracija/  ->  { token, zaposleni }
export async function registracijaZahtev(podaci) {
  const { data } = await client.post('/auth/registracija/', podaci)
  return data
}

// GET /profil/  ->  zaposleni (koristi se i za proveru važećeg tokena na startu)
export async function dohvatiProfil() {
  const { data } = await client.get('/profil/')
  return data
}

// PATCH /profil/  ->  zaposleni
export async function azurirajProfil(podaci) {
  const { data } = await client.patch('/profil/', podaci)
  return data
}

// GET /timovi/  ->  [tim]
export async function dohvatiTimove() {
  const { data } = await client.get('/timovi/')
  return data
}

// GET /admin/zaposleni/  ->  [zaposleni]  (samo Admin)
export async function dohvatiZaposlene() {
  const { data } = await client.get('/admin/zaposleni/')
  return data
}
// GET /menadzer/zaposleni/ -> [radnik]  (Menadzer/Admin)
export async function dohvatiRadnikeZaMenadzera() {
  const { data } = await client.get('/menadzer/zaposleni/')
  return data
}

// POST /menadzer/timovi/:timId/dodaj-radnika/  ->  tim
export async function dodajRadnikaUTim(timId, zaposleniId) {
  const { data } = await client.post(`/menadzer/timovi/${timId}/dodaj-radnika/`, {
    zaposleni_id: zaposleniId,
  })
  return data
}
export async function kreirajTim(naziv) {
  const { data } = await client.post('/menadzer/timovi/', { naziv })
  return data
}