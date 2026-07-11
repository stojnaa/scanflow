import { Col, Container, Row } from 'react-bootstrap'
import LoginForma from '../../components/auth/LoginForma'

function LoginPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Prijava</h1>
        <p>Pristupite svom nalogu u ScanFlow sistemu.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <LoginForma />
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
