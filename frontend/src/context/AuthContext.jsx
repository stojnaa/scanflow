import { createContext, useContext, useEffect, useState } from 'react'
import {
  ODJAVA_EVENT,
  obrisiToken,
  procitajToken,
  sacuvajToken,
} from '../api/client'
import {
  azurirajProfil,
  dohvatiProfil,
  prijavaZahtev,
  registracijaZahtev,
} from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [korisnik, setKorisnik] = useState(null)
  // ucitavanje = da li još proveravamo postojeći token pri pokretanju aplikacije.
  const [ucitavanje, setUcitavanje] = useState(true)

  // Pri pokretanju: ako u localStorage postoji token, proveri ga pozivom /profil/.
  // Ako je važeći -> učitaj korisnika; ako nije -> interceptor će ga očistiti.
  useEffect(() => {
    async function inicijalizuj() {
      if (!procitajToken()) {
        setUcitavanje(false)
        return
      }
      try {
        const profil = await dohvatiProfil()
        setKorisnik(profil)
      } catch {
        obrisiToken()
        setKorisnik(null)
      } finally {
        setUcitavanje(false)
      }
    }
    inicijalizuj()
  }, [])

  // Ako neki poziv vrati 401, client emituje ODJAVA_EVENT — izbaci korisnika iz state-a.
  useEffect(() => {
    function naOdjavu() {
      setKorisnik(null)
    }
    window.addEventListener(ODJAVA_EVENT, naOdjavu)
    return () => window.removeEventListener(ODJAVA_EVENT, naOdjavu)
  }, [])

  async function prijava(korImeIliMejl, sifra) {
    const { token, zaposleni } = await prijavaZahtev({ korImeIliMejl, sifra })
    sacuvajToken(token)
    setKorisnik(zaposleni)
    return zaposleni
  }

  async function registracija(podaci) {
    const { token, zaposleni } = await registracijaZahtev(podaci)
    sacuvajToken(token)
    setKorisnik(zaposleni)
    return zaposleni
  }

  async function azurirajKorisnika(podaci) {
    const azuriran = await azurirajProfil(podaci)
    setKorisnik(azuriran)
    return azuriran
  }

  function odjava() {
    obrisiToken()
    setKorisnik(null)
  }

  const vrednost = {
    korisnik,
    uloga: korisnik?.uloga ?? null,
    prijavljen: Boolean(korisnik),
    ucitavanje,
    prijava,
    registracija,
    azurirajKorisnika,
    odjava,
  }

  return <AuthContext.Provider value={vrednost}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const kontekst = useContext(AuthContext)
  if (!kontekst) {
    throw new Error('useAuth mora biti korišćen unutar AuthProvider-a.')
  }
  return kontekst
}
