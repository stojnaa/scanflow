import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FormaDodajRadnikaUSmenu from '../../components/organization/FormaDodajRadnikaUSmenu'
import FormaObavestenje from '../../components/organization/FormaObavestenje'
import MenadzerMolbe from '../../components/organization/MenadzerMolbe'
import OglasnaTabla from '../../components/organization/OglasnaTabla'
import PrikazSmena from '../../components/organization/PrikazSmena'

function MenadzerOrganizacijaPage() {
  const [osvezavanjeObavestenja, setOsvezavanjeObavestenja] = useState(0)
  const [osvezavanjeSmena, setOsvezavanjeSmena] = useState(0)

  return (
    <Container>
      <div className="page-header">
        <h1>Menadžer — Organizacija</h1>
        <p>Upravljanje obaveštenjima, molbama i smenama.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaObavestenje onKreirao={() => setOsvezavanjeObavestenja((n) => n + 1)} />
          <FormaDodajRadnikaUSmenu onDodato={() => setOsvezavanjeSmena((n) => n + 1)} />
        </Col>

        <Col lg={7}>
          <MenadzerMolbe />
          <PrikazSmena key={osvezavanjeSmena} />
          <OglasnaTabla key={osvezavanjeObavestenja} prikaziAkcije />
        </Col>
      </Row>
    </Container>
  )
}

export default MenadzerOrganizacijaPage
