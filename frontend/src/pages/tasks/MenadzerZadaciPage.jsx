import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FormaZadatak from '../../components/tasks/FormaZadatak'
import PregledZadatakaMenadzer from '../../components/tasks/PregledZadatakaMenadzer'
import StatistikaDashboard from '../../components/tasks/StatistikaDashboard'

function MenadzerZadaciPage() {
  const [osvezavanje, setOsvezavanje] = useState(0)

  return (
    <Container>
      <div className="page-header">
        <h1>Menadžer — Zadaci i statistika</h1>
        <p>Kreiranje i dodela zadataka, pregled svih zadataka i izveštaj o radu.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaZadatak onKreirano={() => setOsvezavanje((n) => n + 1)} />
        </Col>

        <Col lg={7}>
          <StatistikaDashboard />
        </Col>
      </Row>

      <Row>
        <Col>
          <PregledZadatakaMenadzer osvezavanje={osvezavanje} />
        </Col>
      </Row>
    </Container>
  )
}

export default MenadzerZadaciPage
