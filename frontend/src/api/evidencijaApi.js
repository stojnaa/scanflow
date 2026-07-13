import client from './client'

export async function skenirajQrKod(token) {
  const { data } = await client.post('/evidencija/skeniraj/', {
    token,
  })

  return data
}

export async function dohvatiMojuEvidenciju(zaposleniId) {
  const { data } = await client.get(`/evidencija/moja/${zaposleniId}/`)
  return data
}

export async function dohvatiPrisutneRadnike() {
  const { data } = await client.get('/menadzer/prisutni/')
  return data
}