import { useCallback, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FormaDodajRadnikaUTim from '../../components/auth/FormaDodajRadnikaUTim'
import ListaTimova from '../../components/auth/ListaTimova'
import ListaZaposlenih from '../../components/auth/ListaZaposlenih'
import { dohvatiTimove, dohvatiZaposlene, dohvatiRadnikeZaMenadzera } from '../../api/authApi'
import { porukaGreske } from '../../api/greske'
import { useAuth } from '../../context/AuthContext'
function AdminPregledPage() {
    const { uloga } = useAuth()
    const jeAdmin = uloga === 'ADMIN'
  const [zaposleni, setZaposleni] = useState([])
  const [timovi, setTimovi] = useState([])
  const [ucitavanjeZaposlenih, setUcitavanjeZaposlenih] = useState(true)
  const [ucitavanjeTimova, setUcitavanjeTimova] = useState(true)
  const [greskaZaposleni, setGreskaZaposleni] = useState('')
  const [greskaTimovi, setGreskaTimovi] = useState('')

  // Lista zaposlenih je dostupna samo administratorima (backend: JeAdmin).
  const ucitajZaposlene = useCallback(async () => {
  setUcitavanjeZaposlenih(true)
  setGreskaZaposleni('')

  try {
    const podaci = jeAdmin
      ? await dohvatiZaposlene()
      : await dohvatiRadnikeZaMenadzera()

    setZaposleni(podaci)
  } catch (err) {
    setGreskaZaposleni(porukaGreske(err, 'Učitavanje zaposlenih nije uspelo.'))
    setZaposleni([])
  } finally {
    setUcitavanjeZaposlenih(false)
  }
}, [jeAdmin])

  const ucitajTimove = useCallback(async () => {
    setUcitavanjeTimova(true)
    setGreskaTimovi('')
    try {
      setTimovi(await dohvatiTimove())
    } catch (err) {
      setGreskaTimovi(porukaGreske(err, 'Učitavanje timova nije uspelo.'))
      setTimovi([])
    } finally {
      setUcitavanjeTimova(false)
    }
  }, [])

  useEffect(() => {
    ucitajZaposlene()
    ucitajTimove()
  }, [ucitajZaposlene, ucitajTimove])

  // Nakon dodavanja radnika u tim, osveži oba prikaza (broj članova i timovi zaposlenog).
  const osveziSve = useCallback(() => {
    ucitajZaposlene()
    ucitajTimove()
  }, [ucitajZaposlene, ucitajTimove])

  return (
    <Container>
      <div className="page-header">
        <h1>Admin / Menadžer — Pregled</h1>
        <p>Pregled zaposlenih i timova i dodavanje radnika u tim.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaDodajRadnikaUTim
            zaposleni={zaposleni}
            timovi={timovi}
            onDodato={osveziSve}
          />
          <ListaTimova
            timovi={timovi}
            ucitavanje={ucitavanjeTimova}
            greska={greskaTimovi}
          />
        </Col>

        <Col lg={7}>
          <ListaZaposlenih
            zaposleni={zaposleni}
            ucitavanje={ucitavanjeZaposlenih}
            greska={greskaZaposleni}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminPregledPage
