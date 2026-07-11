import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { radnici, smene } from '../../data/organizationDummyData'

function FormaDodajRadnikaUSmenu() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj radnika u smenu</Card.Title>
        <Card.Text className="text-muted">
          Popunjavanje smene izborom radnika i tipa smene.
        </Card.Text>

        <Form>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Smena</Form.Label>
                <Form.Select>
                  {smene.map((smena) => (
                    <option key={smena.id}>
                      Nedelja {smena.nedelja}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Radnik</Form.Label>
                <Form.Select>
                  {radnici.map((radnik) => (
                    <option key={radnik}>{radnik}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tip smene</Form.Label>
                <Form.Select>
                  <option>PRVA</option>
                  <option>DRUGA</option>
                  <option>TRECA</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="button">
            Dodaj u smenu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaDodajRadnikaUSmenu