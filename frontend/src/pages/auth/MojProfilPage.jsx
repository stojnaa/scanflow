import { Col, Container, Row } from 'react-bootstrap'
import ProfilForma from '../../components/auth/ProfilForma'

function MojProfilPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Moj profil</h1>
        <p>Pregled i izmena ličnih podataka.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <ProfilForma />
        </Col>
      </Row>
    </Container>
  )
}

export default MojProfilPage
