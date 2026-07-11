import { Button, Card, Form } from 'react-bootstrap'

function FormaObavestenje() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj obaveštenje</Card.Title>
        <Card.Text className="text-muted">
          Menadžer dodaje novo obaveštenje na oglasnu tablu.
        </Card.Text>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Naslov</Form.Label>
            <Form.Control placeholder="Unesite naslov obaveštenja" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tekst obaveštenja</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Unesite tekst obaveštenja..."
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="switch"
            label="Aktivno obaveštenje"
            defaultChecked
          />

          <Button variant="primary" type="button">
            Dodaj obaveštenje
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaObavestenje