import { useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { posaljiMolbu } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

function FormaMolba({ onPoslato }) {
  const { korisnik } = useAuth()
  const [greska, setGreska] = useState(null)
  const [slanje, setSlanje] = useState(false)
  const [uspeh, setUspeh] = useState(false)
  const formRef = useRef(null)
  const danas = new Date().toISOString().split('T')[0]

  async function onSubmit(e) {
    e.preventDefault()
    setGreska(null)
    setUspeh(false)
    const forma = e.currentTarget
    const naslov = forma.naslov.value.trim()
    const opis = forma.opis.value.trim()
    const datum = forma.datum.value

    if (!naslov || !datum) {
      setGreska('Popunite naslov i datum.')
      return
    }
    if (datum < danas) {
  setGreska('Ne možete poslati molbu za slobodan dan u prošlosti.')
  return
}

    setSlanje(true)
    try {
      await posaljiMolbu({
        zaposleni: korisnik.zaposleni_id,
        naslov,
        opis,
        datum_za_koji_se_trazi: datum,
      })
      setUspeh(true)
      formRef.current?.reset()
      onPoslato?.()
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setSlanje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Zahtev za slobodan dan</Card.Title>
        <Card.Text className="text-muted">
          Radnik popunjava molbu za slobodan dan.
        </Card.Text>

        {greska && <Alert variant="danger" onClose={() => setGreska(null)} dismissible>{greska}</Alert>}
        {uspeh && <Alert variant="success" onClose={() => setUspeh(false)} dismissible>Molba je poslata.</Alert>}

        <Form onSubmit={onSubmit} ref={formRef}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum slobodnog dana</Form.Label>
                <Form.Control
  name="datum"
  type="date"
  min={danas}
  required
/>
<Form.Control.Feedback type="invalid">
    Izaberite današnji ili budući datum.
  </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Naslov molbe</Form.Label>
                <Form.Control name="naslov" placeholder="Npr. Slobodan dan" required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Razlog</Form.Label>
            <Form.Control
              name="opis"
              as="textarea"
              rows={3}
              placeholder="Unesite kratak opis razloga..."
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={slanje}>
            {slanje ? <Spinner size="sm" animation="border" /> : 'Pošalji molbu'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaMolba
