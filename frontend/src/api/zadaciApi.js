import client from './client'

// GET /zadaci/moji/<zaposleni_id>/  ->  [zadatak]
export async function dohvatiMojeZadatke(zaposleniId) {
  const { data } = await client.get(`/zadaci/moji/${zaposleniId}/`)
  return data
}

// PATCH /zadaci/<zadatak_id>/status/  ->  zadatak
export async function promeniStatusZadatka(zadatakId, status) {
  const { data } = await client.patch(`/zadaci/${zadatakId}/status/`, { status })
  return data
}

// GET /menadzer/zadaci/  ->  [zadatak]
export async function dohvatiSveZadatke() {
  const { data } = await client.get('/menadzer/zadaci/')
  return data
}

// POST /menadzer/zadaci/  ->  zadatak
export async function kreirajZadatak(podaci) {
  const { data } = await client.post('/menadzer/zadaci/', podaci)
  return data
}

// GET /menadzer/statistika/radni-sati/  ->  [{ zaposleni, radni_sati }]
export async function dohvatiStatistikuRadnihSati() {
  const { data } = await client.get('/menadzer/statistika/radni-sati/')
  return data
}

// GET /admin/statistika/export/  ->  CSV blob
// GET /menadzer/statistika/export/  ->  CSV blob
export async function izvezi_csv() {
  const response = await client.get('/menadzer/statistika/export/', {
    responseType: 'blob',
  })
  return response
}
