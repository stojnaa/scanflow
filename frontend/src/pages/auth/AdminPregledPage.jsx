import { Col, Container, Row } from 'react-bootstrap'
import FormaDodajRadnikaUTim from '../../components/auth/FormaDodajRadnikaUTim'
import ListaTimova from '../../components/auth/ListaTimova'
import ListaZaposlenih from '../../components/auth/ListaZaposlenih'

function AdminPregledPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Admin / Menadžer — Pregled</h1>
        <p>Pregled zaposlenih i timova i dodavanje radnika u tim.</p>
      </div>

      <Row>
        <Col lg={5}>
          <FormaDodajRadnikaUTim />
          <ListaTimova />
        </Col>

        <Col lg={7}>
          <ListaZaposlenih />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminPregledPage
