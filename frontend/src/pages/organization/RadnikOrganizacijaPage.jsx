import { Col, Container, Row } from 'react-bootstrap'
import FormaMolba from '../../components/organization/FormaMolba'
import MojeMolbe from '../../components/organization/MojeMolbe'
import OglasnaTabla from '../../components/organization/OglasnaTabla'
import PrikazSmena from '../../components/organization/PrikazSmena'

function RadnikOrganizacijaPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Radnik — Organizacija</h1>
        <p>Pregled obaveštenja, smena i slanje molbe za slobodan dan.</p>
      </div>

      <Row>
        <Col lg={7}>
          <OglasnaTabla />
          <PrikazSmena />
        </Col>

        <Col lg={5}>
          <FormaMolba />
          <MojeMolbe />
        </Col>
      </Row>
    </Container>
  )
}

export default RadnikOrganizacijaPage