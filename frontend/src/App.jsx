import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { Button, Card, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegistracijaPage from './pages/auth/RegistracijaPage'
import MojProfilPage from './pages/auth/MojProfilPage'
import AdminPregledPage from './pages/auth/AdminPregledPage'
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

        <Navbar.Toggle aria-controls="glavni-meni" />
        <Navbar.Collapse id="glavni-meni">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/profil">
              Moj profil
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/pregled">
              Zaposleni i timovi
            </Nav.Link>

            <NavDropdown title="Organizacija" id="meni-organizacija">
              <NavDropdown.Item as={Link} to="/radnik/organizacija">
                Radnik organizacija
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/menadzer/organizacija">
                Menadžer organizacija
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/login">
              Prijava
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
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
            Frontend prikazi sistema za evidenciju rada: identitet i timovi,
            organizacija rada, evidencija i zadaci.
          </p>

          <div className="d-flex gap-3 flex-wrap">
            <Button as={Link} to="/login" variant="primary">
              Prijava
            </Button>
            <Button as={Link} to="/admin/pregled" variant="outline-primary">
              Zaposleni i timovi
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

        {/* Javne rute */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registracija" element={<RegistracijaPage />} />

        {/* Zaštićene (private) rute — provera tokena dolazi u Week 4 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profil" element={<MojProfilPage />} />
          <Route path="/admin/pregled" element={<AdminPregledPage />} />
          <Route path="/radnik/organizacija" element={<RadnikOrganizacijaPage />} />
          <Route path="/menadzer/organizacija" element={<MenadzerOrganizacijaPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
