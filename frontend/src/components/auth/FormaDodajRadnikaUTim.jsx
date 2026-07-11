import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { dodajRadnikaUTim } from '../../api/authApi'
import { porukaGreske } from '../../api/greske'

function FormaDodajRadnikaUTim({ zaposleni, timovi, onDodato }) {
  const [zaposleniId, setZaposleniId] = useState('')
  const [timId, setTimId] = useState('')
  const [validirano, setValidirano] = useState(false)
  const [greska, setGreska] = useState('')
  const [uspeh, setUspeh] = useState('')
  const [salje, setSalje] = useState(false)

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
      await dodajRadnikaUTim(Number(timId), Number(zaposleniId))
      setUspeh('Radnik je dodat u tim.')
      setZaposleniId('')
      setTimId('')
      setValidirano(false)
      if (onDodato) onDodato()
    } catch (err) {
      setGreska(porukaGreske(err, 'Dodavanje radnika u tim nije uspelo.'))
    } finally {
      setSalje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj radnika u tim</Card.Title>
        <Card.Text className="text-muted">
          Izaberite zaposlenog i tim u koji ga dodajete.
        </Card.Text>

        {greska && <Alert variant="danger">{greska}</Alert>}
        {uspeh && <Alert variant="success">{uspeh}</Alert>}

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zaposleni</Form.Label>
                <Form.Select
                  required
                  value={zaposleniId}
                  onChange={(e) => setZaposleniId(e.target.value)}
                >
                  <option value="" disabled>
                    Izaberite zaposlenog...
                  </option>
                  {zaposleni.map((radnik) => (
                    <option key={radnik.zaposleni_id} value={radnik.zaposleni_id}>
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
                <Form.Select
                  required
                  value={timId}
                  onChange={(e) => setTimId(e.target.value)}
                >
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

          <Button variant="primary" type="submit" disabled={salje}>
            {salje ? 'Dodavanje...' : 'Dodaj u tim'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaDodajRadnikaUTim
