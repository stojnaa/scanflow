import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { porukaGreske } from '../../api/greske'

function ProfilForma() {
  const { korisnik, azurirajKorisnika } = useAuth()

  const [podaci, setPodaci] = useState({
    ime: '',
    prezime: '',
    mejl: '',
    telefon: '',
    adresa: '',
  })
  const [validirano, setValidirano] = useState(false)
  const [greska, setGreska] = useState('')
  const [uspeh, setUspeh] = useState('')
  const [salje, setSalje] = useState(false)
  const [uredjuje, setUredjuje] = useState(false)

  // Popuni formu podacima prijavljenog korisnika (učitani u AuthContext preko /profil/).
  useEffect(() => {
    if (korisnik) {
      setPodaci({
        ime: korisnik.ime ?? '',
        prezime: korisnik.prezime ?? '',
        mejl: korisnik.mejl ?? '',
        telefon: korisnik.telefon ?? '',
        adresa: korisnik.adresa ?? '',
      })
    }
  }, [korisnik])

  const promena = (polje) => (e) =>
    setPodaci((prethodno) => ({ ...prethodno, [polje]: e.target.value }))

  const posaljiFormu = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const forma = event.currentTarget
    setValidirano(true)
    if (!forma.checkValidity()) return

    setGreska('')
    setUspeh('')
    setSalje(true)
    try {
      await azurirajKorisnika(podaci)
    setUspeh('Podaci su uspešno sačuvani.')
    setUredjuje(false)
    } catch (err) {
      setGreska(porukaGreske(err, 'Čuvanje izmena nije uspelo.'))
    } finally {
      setSalje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moj profil</Card.Title>
        <Card.Text className="text-muted">
          Izmenite svoje lične podatke.
        </Card.Text>

        {greska && <Alert variant="danger">{greska}</Alert>}
        {uspeh && <Alert variant="success">{uspeh}</Alert>}

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  required
                  value={podaci.ime}
                  onChange={promena('ime')}
                  readOnly={!uredjuje}
                />
                <Form.Control.Feedback type="invalid">
                  Ime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  required
                  value={podaci.prezime}
                  onChange={promena('prezime')}
                  readOnly={!uredjuje}
                />
                <Form.Control.Feedback type="invalid">
                  Prezime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control value={korisnik?.kor_ime ?? ''} disabled readOnly />
            <Form.Text className="text-muted">
              Korisničko ime se ne može menjati.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mejl</Form.Label>
            <Form.Control
              required
              type="email"
              value={podaci.mejl}
              onChange={promena('mejl')}
              readOnly={!uredjuje}
            />
            <Form.Control.Feedback type="invalid">
              Unesite ispravnu mejl adresu.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  required
                  value={podaci.telefon}
                  onChange={promena('telefon')}
                  readOnly={!uredjuje}
                />
                <Form.Control.Feedback type="invalid">
                  Telefon je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresa</Form.Label>
                <Form.Control
                  value={podaci.adresa}
                  onChange={promena('adresa')}
                  readOnly={!uredjuje}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
  {!uredjuje && (
    <Button
      variant="primary"
      type="button"
      onClick={() => {
        setUredjuje(true)
        setGreska('')
        setUspeh('')
      }}
    >
      Izmeni
    </Button>
  )}

  {uredjuje && (
    <Button
      variant="success"
      type="submit"
      disabled={salje}
    >
      {salje ? 'Čuvanje...' : 'Sačuvaj'}
    </Button>
  )}
</div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ProfilForma
