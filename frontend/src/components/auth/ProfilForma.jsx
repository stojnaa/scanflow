import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

// Dummy vrednosti trenutno prijavljenog korisnika (Week 4 -> pravi podaci iz sesije).
const trenutniKorisnik = {
  ime: 'Ana',
  prezime: 'Anić',
  korIme: 'ana.anic',
  mejl: 'ana.anic@scanflow.rs',
  telefon: '+381 60 111 2233',
  adresa: 'Bulevar oslobođenja 12, Novi Sad',
}

function ProfilForma() {
  const [validirano, setValidirano] = useState(false)

  const posaljiFormu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // Prava izmena podataka preko API-ja dolazi u Week 4.
    setValidirano(true)
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moj profil</Card.Title>
        <Card.Text className="text-muted">
          Izmenite svoje lične podatke.
        </Card.Text>

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control required defaultValue={trenutniKorisnik.ime} />
                <Form.Control.Feedback type="invalid">
                  Ime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prezime</Form.Label>
                <Form.Control required defaultValue={trenutniKorisnik.prezime} />
                <Form.Control.Feedback type="invalid">
                  Prezime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control defaultValue={trenutniKorisnik.korIme} disabled readOnly />
            <Form.Text className="text-muted">
              Korisničko ime se ne može menjati.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mejl</Form.Label>
            <Form.Control
              required
              type="email"
              defaultValue={trenutniKorisnik.mejl}
            />
            <Form.Control.Feedback type="invalid">
              Unesite ispravnu mejl adresu.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control required defaultValue={trenutniKorisnik.telefon} />
                <Form.Control.Feedback type="invalid">
                  Telefon je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Adresa</Form.Label>
                <Form.Control defaultValue={trenutniKorisnik.adresa} />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Sačuvaj izmene
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ProfilForma
