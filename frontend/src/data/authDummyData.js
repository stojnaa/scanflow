// Statični (dummy) podaci za domen Identitet / Timovi / Autentifikacija.
// Polja prate backend model Zaposleni/Tim. Pravi API pozivi dolaze u Week 4.

export const uloge = [
  { vrednost: 'RADNIK', naziv: 'Radnik' },
  { vrednost: 'MENADZER', naziv: 'Menadžer' },
  { vrednost: 'ADMIN', naziv: 'Admin' },
]

export const zaposleni = [
  {
    id: 1,
    ime: 'Ana',
    prezime: 'Anić',
    korIme: 'ana.anic',
    mejl: 'ana.anic@scanflow.rs',
    telefon: '+381 60 111 2233',
    uloga: 'RADNIK',
    tim: 'Smena A',
    aktivan: true,
  },
  {
    id: 2,
    ime: 'Petar',
    prezime: 'Petrović',
    korIme: 'petar.petrovic',
    mejl: 'petar.petrovic@scanflow.rs',
    telefon: '+381 61 222 3344',
    uloga: 'RADNIK',
    tim: 'Smena A',
    aktivan: true,
  },
  {
    id: 3,
    ime: 'Jovana',
    prezime: 'Jović',
    korIme: 'jovana.jovic',
    mejl: 'jovana.jovic@scanflow.rs',
    telefon: '+381 62 333 4455',
    uloga: 'MENADZER',
    tim: 'Smena B',
    aktivan: true,
  },
  {
    id: 4,
    ime: 'Milan',
    prezime: 'Milić',
    korIme: 'milan.milic',
    mejl: 'milan.milic@scanflow.rs',
    telefon: '+381 63 444 5566',
    uloga: 'RADNIK',
    tim: 'Bez tima',
    aktivan: false,
  },
]

export const timovi = [
  {
    id: 1,
    naziv: 'Smena A',
    menadzer: 'Jovana Jović',
    brojClanova: 2,
  },
  {
    id: 2,
    naziv: 'Smena B',
    menadzer: 'Jovana Jović',
    brojClanova: 1,
  },
  {
    id: 3,
    naziv: 'Rezerva',
    menadzer: 'Marko Marković',
    brojClanova: 0,
  },
]
