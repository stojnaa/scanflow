import client from './client'

// GET /obavestenja/  ->  [obavestenje]
export async function dohvatiAktivnaObavestenja() {
  const { data } = await client.get('/obavestenja/')
  return data
}

// POST /menadzer/obavestenja/  ->  obavestenje
export async function kreirajObavestenje(podaci) {
  const { data } = await client.post('/menadzer/obavestenja/', podaci)
  return data
}

// DELETE /menadzer/obavestenja/<id>/
export async function obrisiObavestenje(obavestenjeId) {
  await client.delete(`/menadzer/obavestenja/${obavestenjeId}/`)
}

// GET /molbe/moje/<zaposleni_id>/  ->  [molba]
export async function dohvatiMojeMolbe(zaposleniId) {
  const { data } = await client.get(`/molbe/moje/${zaposleniId}/`)
  return data
}

// POST /molbe/  ->  molba
export async function posaljiMolbu(podaci) {
  const { data } = await client.post('/molbe/', podaci)
  return data
}

// GET /menadzer/molbe/  ->  [molba]
export async function dohvatiSveMolbe() {
  const { data } = await client.get('/menadzer/molbe/')
  return data
}

// PATCH /menadzer/molbe/<molba_id>/odobri/  ->  molba
export async function odobriMolbu(molbaId, menadzerImeId) {
  const { data } = await client.patch(`/menadzer/molbe/${molbaId}/odobri/`, {
    menadzer_id: menadzerImeId,
  })
  return data
}

// PATCH /menadzer/molbe/<molba_id>/odbij/  ->  molba
export async function odbijMolbu(molbaId, menadzerImeId) {
  const { data } = await client.patch(`/menadzer/molbe/${molbaId}/odbij/`, {
    menadzer_id: menadzerImeId,
  })
  return data
}

// GET /smene/moje/<zaposleni_id>/  ->  [smena_zaposleni]
export async function dohvatiMojeSmene(zaposleniId) {
  const { data } = await client.get(`/smene/moje/${zaposleniId}/`)
  return data
}

// GET /menadzer/smene/  ->  [smena]
export async function dohvatiSveSmene() {
  const { data } = await client.get('/menadzer/smene/')
  return data
}

// POST /menadzer/smene/<smena_id>/dodaj-radnika/  ->  smena_zaposleni
export async function dodajRadnikaUSmenu(smenaId, zaposleniId, tipSmene) {
  const { data } = await client.post(`/menadzer/smene/${smenaId}/dodaj-radnika/`, {
    zaposleni_id: zaposleniId,
    tip_smene: tipSmene,
  })
  return data
}
