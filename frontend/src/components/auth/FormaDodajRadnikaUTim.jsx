import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { timovi, zaposleni } from '../../data/authDummyData'

function FormaDodajRadnikaUTim() {
  const [validirano, setValidirano] = useState(false)

  const posaljiFormu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // Pravo dodavanje radnika u tim preko API-ja dolazi u Week 4.
    setValidirano(true)
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj radnika u tim</Card.Title>
        <Card.Text className="text-muted">
          Izaberite zaposlenog i tim u koji ga dodajete.
        </Card.Text>

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zaposleni</Form.Label>
                <Form.Select required defaultValue="">
                  <option value="" disabled>
                    Izaberite zaposlenog...
                  </option>
                  {zaposleni.map((radnik) => (
                    <option key={radnik.id} value={radnik.id}>
                      {radnik.ime} {radnik.prezime}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Izbor zaposlenog je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tim</Form.Label>
                <Form.Select required defaultValue="">
                  <option value="" disabled>
                    Izaberite tim...
                  </option>
                  {timovi.map((tim) => (
                    <option key={tim.id} value={tim.id}>
                      {tim.naziv}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Izbor tima je obavezan.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Dodaj u tim
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaDodajRadnikaUTim
