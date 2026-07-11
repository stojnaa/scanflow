import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
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
  const [validirano, setValidirano] = useState(false)
  const [greska, setGreska] = useState('')
  const [salje, setSalje] = useState(false)

  const promena = (polje) => (e) =>
    setPodaci((prethodno) => ({ ...prethodno, [polje]: e.target.value }))

  const posaljiFormu = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const forma = event.currentTarget
    setValidirano(true)
    if (!forma.checkValidity()) return

    setGreska('')
    setSalje(true)
    try {
      await registracija(podaci)
      // Backend vraća token pa je korisnik odmah prijavljen -> vodi ga na profil.
      navigate('/profil', { replace: true })
    } catch (err) {
      setGreska(porukaGreske(err, 'Registracija nije uspela. Proverite unete podatke.'))
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

        {greska && <Alert variant="danger">{greska}</Alert>}

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  required
                  placeholder="Ime"
                  value={podaci.ime}
                  onChange={promena('ime')}
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
                  placeholder="Prezime"
                  value={podaci.prezime}
                  onChange={promena('prezime')}
                />
                <Form.Control.Feedback type="invalid">
                  Prezime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum rođenja</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={podaci.datum_rodjenja}
                  onChange={promena('datum_rodjenja')}
                />
                <Form.Control.Feedback type="invalid">
                  Datum rođenja je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum zaposlenja</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={podaci.datum_zaposlenja}
                  onChange={promena('datum_zaposlenja')}
                />
                <Form.Control.Feedback type="invalid">
                  Datum zaposlenja je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control
              required
              placeholder="npr. ana.anic"
              value={podaci.kor_ime}
              onChange={promena('kor_ime')}
            />
            <Form.Control.Feedback type="invalid">
              Korisničko ime je obavezno.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mejl</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="ime@primer.rs"
              value={podaci.mejl}
              onChange={promena('mejl')}
            />
            <Form.Control.Feedback type="invalid">
              Unesite ispravnu mejl adresu.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresa</Form.Label>
            <Form.Control
              required
              placeholder="Ulica i broj, grad"
              value={podaci.adresa}
              onChange={promena('adresa')}
            />
            <Form.Control.Feedback type="invalid">
              Adresa je obavezna.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lozinka</Form.Label>
                <Form.Control
                  required
                  type="password"
                  minLength={8}
                  placeholder="Najmanje 8 karaktera"
                  value={podaci.sifra}
                  onChange={promena('sifra')}
                />
                <Form.Control.Feedback type="invalid">
                  Lozinka mora imati najmanje 8 karaktera.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  required
                  placeholder="+381 60 000 0000"
                  value={podaci.telefon}
                  onChange={promena('telefon')}
                />
                <Form.Control.Feedback type="invalid">
                  Telefon je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" disabled={salje}>
            {salje ? 'Registracija...' : 'Registruj se'}
          </Button>

          <div className="mt-3">
            <span className="text-muted">Već imate nalog? </span>
            <Link to="/login">Prijavite se</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default RegistracijaForma
