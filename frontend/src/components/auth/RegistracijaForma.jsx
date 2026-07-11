import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function RegistracijaForma() {
  const [validirano, setValidirano] = useState(false)

  const posaljiFormu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // Pravo kreiranje naloga preko API-ja dolazi u Week 4.
    setValidirano(true)
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Registracija</Card.Title>
        <Card.Text className="text-muted">
          Kreirajte nalog unosom osnovnih podataka.
        </Card.Text>

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ime</Form.Label>
                <Form.Control required placeholder="Ime" />
                <Form.Control.Feedback type="invalid">
                  Ime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prezime</Form.Label>
                <Form.Control required placeholder="Prezime" />
                <Form.Control.Feedback type="invalid">
                  Prezime je obavezno.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control required placeholder="npr. ana.anic" />
            <Form.Control.Feedback type="invalid">
              Korisničko ime je obavezno.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mejl</Form.Label>
            <Form.Control required type="email" placeholder="ime@primer.rs" />
            <Form.Control.Feedback type="invalid">
              Unesite ispravnu mejl adresu.
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lozinka</Form.Label>
                <Form.Control
                  required
                  type="password"
                  minLength={6}
                  placeholder="Najmanje 6 karaktera"
                />
                <Form.Control.Feedback type="invalid">
                  Lozinka mora imati najmanje 6 karaktera.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control required placeholder="+381 60 000 0000" />
                <Form.Control.Feedback type="invalid">
                  Telefon je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Registruj se
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
