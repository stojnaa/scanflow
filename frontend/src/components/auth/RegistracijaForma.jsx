import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { porukaGreske } from '../../api/greske'

const PRAZNA_FORMA = {
  ime: '',
  prezime: '',
  datum_rodjenja: '',
  datum_zaposlenja: '',
  kor_ime: '',
  mejl: '',
  telefon: '',
  adresa: '',
  sifra: '',
}

function RegistracijaForma() {
  const { registracija } = useAuth()
  const navigate = useNavigate()

  const [podaci, setPodaci] = useState(PRAZNA_FORMA)
  const [greskePolja, setGreskePolja] = useState({})
  const [greska, setGreska] = useState('')
  const [salje, setSalje] = useState(false)

  const danas = new Date().toISOString().split('T')[0]

  const promena = (polje) => (e) => {
    setPodaci((prethodno) => ({
      ...prethodno,
      [polje]: e.target.value,
    }))

    setGreskePolja((prethodno) => ({
      ...prethodno,
      [polje]: '',
    }))
  }

  const proveriFormu = () => {
    const noveGreske = {}

    if (!podaci.ime.trim()) {
      noveGreske.ime = 'Ime je obavezno.'
    }

    if (!podaci.prezime.trim()) {
      noveGreske.prezime = 'Prezime je obavezno.'
    }

    if (!podaci.datum_rodjenja) {
      noveGreske.datum_rodjenja =
        'Datum rođenja je obavezan.'
    } else if (podaci.datum_rodjenja > danas) {
      noveGreske.datum_rodjenja =
        'Datum rođenja ne može biti u budućnosti.'
    }

    if (!podaci.datum_zaposlenja) {
      noveGreske.datum_zaposlenja =
        'Datum zaposlenja je obavezan.'
    } else if (podaci.datum_zaposlenja > danas) {
      noveGreske.datum_zaposlenja =
        'Datum zaposlenja ne može biti u budućnosti.'
    }

    if (!podaci.kor_ime.trim()) {
      noveGreske.kor_ime =
        'Korisničko ime je obavezno.'
    }

    if (!podaci.mejl.trim()) {
      noveGreske.mejl = 'Mejl je obavezan.'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        podaci.mejl.trim(),
      )
    ) {
      noveGreske.mejl =
        'Unesite ispravnu mejl adresu.'
    }

    if (!podaci.adresa.trim()) {
      noveGreske.adresa = 'Adresa je obavezna.'
    }

    if (!podaci.sifra) {
      noveGreske.sifra = 'Lozinka je obavezna.'
    } else if (podaci.sifra.length < 8) {
      noveGreske.sifra =
        'Lozinka mora imati najmanje 8 karaktera.'
    }

    if (!podaci.telefon.trim()) {
      noveGreske.telefon =
        'Telefon je obavezan.'
    } else if (
      !/^(\+381|0)[ ]?[1-9]([ \-]?[0-9]){7,8}$/.test(
        podaci.telefon.trim(),
      )
    ) {
      noveGreske.telefon =
        'Unesite ispravan srpski broj telefona.'
    }

    setGreskePolja(noveGreske)

    return Object.keys(noveGreske).length === 0
  }

  const posaljiFormu = async (event) => {
    event.preventDefault()

    if (!proveriFormu()) return

    setGreska('')
    setSalje(true)

    try {
      await registracija({
        ...podaci,
        ime: podaci.ime.trim(),
        prezime: podaci.prezime.trim(),
        kor_ime: podaci.kor_ime.trim(),
        mejl: podaci.mejl.trim(),
        telefon: podaci.telefon.trim(),
        adresa: podaci.adresa.trim(),
      })

      navigate('/radnik/organizacija', {
        replace: true,
      })
    } catch (err) {
      setGreska(
        porukaGreske(
          err,
          'Registracija nije uspela. Proverite unete podatke.',
        ),
      )
    } finally {
      setSalje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Registracija</Card.Title>

        <Card.Text className="text-muted">
          Kreirajte nalog unosom osnovnih podataka.
        </Card.Text>

        {greska && (
          <Alert variant="danger">
            {greska}
          </Alert>
        )}

        <Form noValidate onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>

                <Form.Control
                  placeholder="Ime"
                  value={podaci.ime}
                  isInvalid={Boolean(greskePolja.ime)}
                  onChange={promena('ime')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.ime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prezime</Form.Label>

                <Form.Control
                  placeholder="Prezime"
                  value={podaci.prezime}
                  isInvalid={Boolean(
                    greskePolja.prezime,
                  )}
                  onChange={promena('prezime')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.prezime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum rođenja</Form.Label>

                <Form.Control
                  type="date"
                  max={danas}
                  value={podaci.datum_rodjenja}
                  isInvalid={Boolean(
                    greskePolja.datum_rodjenja,
                  )}
                  onChange={promena('datum_rodjenja')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.datum_rodjenja}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum zaposlenja</Form.Label>

                <Form.Control
                  type="date"
                  max={danas}
                  value={podaci.datum_zaposlenja}
                  isInvalid={Boolean(
                    greskePolja.datum_zaposlenja,
                  )}
                  onChange={promena('datum_zaposlenja')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.datum_zaposlenja}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>

            <Form.Control
              placeholder="Vaše korisničko ime"
              value={podaci.kor_ime}
              isInvalid={Boolean(
                greskePolja.kor_ime,
              )}
              onChange={promena('kor_ime')}
            />

            <Form.Control.Feedback type="invalid">
              {greskePolja.kor_ime}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mejl</Form.Label>

            <Form.Control
              type="email"
              placeholder="Vaša email adresa"
              value={podaci.mejl}
              isInvalid={Boolean(greskePolja.mejl)}
              onChange={promena('mejl')}
            />

            <Form.Control.Feedback type="invalid">
              {greskePolja.mejl}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresa</Form.Label>

            <Form.Control
              placeholder="Vaša adresa"
              value={podaci.adresa}
              isInvalid={Boolean(
                greskePolja.adresa,
              )}
              onChange={promena('adresa')}
            />

            <Form.Control.Feedback type="invalid">
              {greskePolja.adresa}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lozinka</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Najmanje 8 karaktera"
                  value={podaci.sifra}
                  isInvalid={Boolean(
                    greskePolja.sifra,
                  )}
                  onChange={promena('sifra')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.sifra}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>

                <Form.Control
                  placeholder="Vaš telefon"
                  value={podaci.telefon}
                  isInvalid={Boolean(
                    greskePolja.telefon,
                  )}
                  onChange={promena('telefon')}
                />

                <Form.Control.Feedback type="invalid">
                  {greskePolja.telefon}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            disabled={salje}
          >
            {salje ? 'Registracija...' : 'Registruj se'}
          </Button>

          <div className="mt-3">
            <span className="text-muted">
              Već imate nalog?{' '}
            </span>

            <Link to="/login">
              Prijavite se
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default RegistracijaForma