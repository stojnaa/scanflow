import { Col, Container, Row } from 'react-bootstrap'
import RegistracijaForma from '../../components/auth/RegistracijaForma'

function RegistracijaPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Registracija</h1>
        <p>Kreirajte nalog za pristup ScanFlow sistemu.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <RegistracijaForma />
        </Col>
      </Row>
    </Container>
  )
}

export default RegistracijaPage
