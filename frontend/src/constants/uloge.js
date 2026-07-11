// Mapiranje uloga (vrednosti sa backenda) u čitljive nazive za prikaz.
export const ULOGE = [
  { vrednost: 'RADNIK', naziv: 'Radnik' },
  { vrednost: 'MENADZER', naziv: 'Menadžer' },
  { vrednost: 'ADMIN', naziv: 'Admin' },
]

export function nazivUloge(vrednost) {
  const uloga = ULOGE.find((u) => u.vrednost === vrednost)
  return uloga ? uloga.naziv : vrednost
}
