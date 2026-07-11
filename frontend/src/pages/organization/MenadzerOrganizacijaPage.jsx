import { Col, Container, Row } from 'react-bootstrap'
import FormaDodajRadnikaUSmenu from '../../components/organization/FormaDodajRadnikaUSmenu'
import FormaObavestenje from '../../components/organization/FormaObavestenje'
import MenadzerMolbe from '../../components/organization/MenadzerMolbe'
import OglasnaTabla from '../../components/organization/OglasnaTabla'
import PrikazSmena from '../../components/organization/PrikazSmena'

function MenadzerOrganizacijaPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Menadžer — Organizacija</h1>
        <p>Upravljanje obaveštenjima, molbama i smenama.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaObavestenje />
          <FormaDodajRadnikaUSmenu />
        </Col>

        <Col lg={7}>
          <MenadzerMolbe />
          <PrikazSmena />
          <OglasnaTabla prikaziAkcije/>
        </Col>
      </Row>
    </Container>
  )
}

export default MenadzerOrganizacijaPage