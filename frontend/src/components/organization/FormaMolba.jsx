import { Button, Card, Col, Form, Row } from 'react-bootstrap'

function FormaMolba() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Zahtev za slobodan dan</Card.Title>
        <Card.Text className="text-muted">
          Radnik popunjava molbu za slobodan dan.
        </Card.Text>

        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Datum slobodnog dana</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Naslov molbe</Form.Label>
                <Form.Control placeholder="Npr. Slobodan dan" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Razlog</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Unesite kratak opis razloga..."
            />
          </Form.Group>

          <Button variant="primary" type="button">
            Pošalji molbu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaMolba