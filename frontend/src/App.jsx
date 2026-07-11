import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { Button, Card, Container, Nav, Navbar } from 'react-bootstrap'
import RadnikOrganizacijaPage from './pages/organization/RadnikOrganizacijaPage'
import MenadzerOrganizacijaPage from './pages/organization/MenadzerOrganizacijaPage'
import './App.css'

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ScanFlow
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/radnik/organizacija">
            Radnik organizacija
          </Nav.Link>
          <Nav.Link as={Link} to="/menadzer/organizacija">
            Menadžer organizacija
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

function HomePage() {
  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Body>
          <h1>ScanFlow</h1>
          <p className="text-muted mb-4">
            Frontend prikazi za organizaciju rada: smene, molbe i oglasna tabla.
          </p>

          <div className="d-flex gap-3 flex-wrap">
            <Button as={Link} to="/radnik/organizacija" variant="primary">
              Radnički prikaz
            </Button>
            <Button as={Link} to="/menadzer/organizacija" variant="outline-primary">
              Menadžerski prikaz
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/radnik/organizacija" element={<RadnikOrganizacijaPage />} />
        <Route path="/menadzer/organizacija" element={<MenadzerOrganizacijaPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App