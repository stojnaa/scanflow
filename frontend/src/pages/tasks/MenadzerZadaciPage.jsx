import { Col, Container, Row } from 'react-bootstrap'
import FormaZadatak from '../../components/tasks/FormaZadatak'
import PregledZadatakaMenadzer from '../../components/tasks/PregledZadatakaMenadzer'
import StatistikaDashboard from '../../components/tasks/StatistikaDashboard'

function MenadzerZadaciPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Menadžer — Zadaci i statistika</h1>
        <p>Kreiranje i dodela zadataka, pregled svih zadataka i izveštaj o radu.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaZadatak />
        </Col>

        <Col lg={7}>
          <StatistikaDashboard />
        </Col>
      </Row>

      <Row>
        <Col>
          <PregledZadatakaMenadzer />
        </Col>
      </Row>
    </Container>
  )
}

export default MenadzerZadaciPage
