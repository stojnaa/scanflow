import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { radnici } from '../../data/organizationDummyData'

// Kreiranje i dodela zadatka. Slanje na server (POST /zadaci/) dolazi u Week 4.
function FormaZadatak() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Novi zadatak</Card.Title>
        <Card.Text className="text-muted">
          Kreiranje zadatka i dodela radniku.
        </Card.Text>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Naziv zadatka</Form.Label>
            <Form.Control placeholder="Npr. Popis inventara" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opis</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Kratak opis zadatka..." />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dodeli radniku</Form.Label>
                <Form.Select>
                  {radnici.map((radnik) => (
                    <option key={radnik}>{radnik}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Rok</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Prioritet</Form.Label>
                <Form.Select>
                  <option>NIZAK</option>
                  <option>SREDNJI</option>
                  <option>VISOK</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="button">
            Kreiraj zadatak
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaZadatak
