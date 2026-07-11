// Izvlači čitljivu poruku iz odgovora Django REST Framework-a.
// DRF vraća greške u više oblika: { error }, { detail }, ili { polje: ["poruka"] }.
export function porukaGreske(error, podrazumevano = 'Došlo je do greške. Pokušajte ponovo.') {
  const data = error?.response?.data

  if (!data) {
    // Nema odgovora servera (npr. server nije pokrenut) -> mrežna greška.
    return error?.message || podrazumevano
  }

  if (typeof data === 'string') return data
  if (data.error) return data.error
  if (data.detail) return data.detail

  // Greške po poljima (validacija) — spoji sve poruke u jednu.
  const poruke = Object.values(data)
    .flat()
    .filter((p) => typeof p === 'string')
  if (poruke.length > 0) return poruke.join(' ')

  return podrazumevano
}
