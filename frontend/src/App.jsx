import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Button, Card, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useAuth } from './context/AuthContext'
import { nazivUloge } from './constants/uloge'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import RegistracijaPage from './pages/auth/RegistracijaPage'
import MojProfilPage from './pages/auth/MojProfilPage'
import AdminPregledPage from './pages/auth/AdminPregledPage'
import RadnikOrganizacijaPage from './pages/organization/RadnikOrganizacijaPage'
import MenadzerOrganizacijaPage from './pages/organization/MenadzerOrganizacijaPage'
import TerminalPage from './pages/qr/TerminalPage'
import SkenPage from './pages/qr/SkenPage'
import MenadzerEvidencijaPage from './pages/qr/MenadzerEvidencijaPage'
import RadnikZadaciPage from './pages/tasks/RadnikZadaciPage'
import MenadzerZadaciPage from './pages/tasks/MenadzerZadaciPage'
import './App.css'

// Uloge sa menadžerskim/admin ovlašćenjima.
const MENADZERSKE_ULOGE = ['MENADZER', 'ADMIN']

function AppNavbar() {
  const { prijavljen, korisnik, uloga, odjava } = useAuth()
  const navigate = useNavigate()
  const jeMenadzer = MENADZERSKE_ULOGE.includes(uloga)

  const odjaviSe = () => {
    odjava()
    navigate('/login', { replace: true })
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ScanFlow
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="glavni-meni" />
        <Navbar.Collapse id="glavni-meni">
          {prijavljen ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/profil">
                  Moj profil
                </Nav.Link>
                {jeMenadzer && (
                  <Nav.Link as={Link} to="/admin/pregled">
                    Zaposleni i timovi
                  </Nav.Link>
                )}

                <NavDropdown title="Organizacija" id="meni-organizacija">
                  <NavDropdown.Item as={Link} to="/radnik/organizacija">
                    Moja organizacija
                  </NavDropdown.Item>
                  {jeMenadzer && (
                    <NavDropdown.Item as={Link} to="/menadzer/organizacija">
                      Menadžer organizacija
                    </NavDropdown.Item>
                  )}
                </NavDropdown>

                <NavDropdown title="Evidencija" id="meni-evidencija">
                  <NavDropdown.Item as={Link} to="/scan">
                    Skeniraj kod
                  </NavDropdown.Item>
                  {jeMenadzer && (
                    <NavDropdown.Item as={Link} to="/menadzer/evidencija">
                      Ko je na poslu
                    </NavDropdown.Item>
                  )}
                </NavDropdown>

                <NavDropdown title="Zadaci" id="meni-zadaci">
                  <NavDropdown.Item as={Link} to="/radnik/zadaci">
                    Moji zadaci
                  </NavDropdown.Item>
                  {jeMenadzer && (
                    <NavDropdown.Item as={Link} to="/menadzer/zadaci">
                      Zadaci i statistika
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
              </Nav>

              <Nav className="align-items-lg-center">
                <Navbar.Text className="me-3">
                  {korisnik.ime} {korisnik.prezime}{' '}
                  <span className="text-info">({nazivUloge(uloga)})</span>
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={odjaviSe}>
                  Odjava
                </Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                Prijava
              </Nav.Link>
              <Nav.Link as={Link} to="/registracija">
                Registracija
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function HomePage() {
  const { prijavljen } = useAuth()

  return (
    <Container className="home-page">
      <Card className="home-card shadow-sm">
        <Card.Body className="text-center">
          <img
            src="/logo.png"
            alt="ScanFlow logo"
            className="home-logo"
          />

          <h1 className="home-title">ScanFlow</h1>

          <p className="home-description">
            Jednostavno evidentiranje radnog vremena, organizacija timova
            i praćenje zadataka na jednom mestu.
          </p>

          <div className="home-actions">
            {prijavljen ? (
              <Button
                as={Link}
                to="/profil"
                variant="primary"
                size="lg"
              >
                Moj profil
              </Button>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="primary"
                  size="lg"
                >
                  Prijava
                </Button>

                <Button
                  as={Link}
                  to="/registracija"
                  variant="outline-primary"
                  size="lg"
                >
                  Registracija
                </Button>
              </>
            )}
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
        {/* Terminal je kiosk ekran na fizičkoj lokaciji — bez prijave */}
        <Route path="/terminal/:id" element={<TerminalPage />} />

        {/* Zaštićene rute — dostupne svim prijavljenim korisnicima */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profil" element={<MojProfilPage />} />
          <Route path="/radnik/organizacija" element={<RadnikOrganizacijaPage />} />
          <Route path="/scan" element={<SkenPage />} />
          <Route path="/radnik/zadaci" element={<RadnikZadaciPage />} />
        </Route>

        {/* Zaštićene rute — samo menadžer/admin */}
        <Route element={<ProtectedRoute uloge={MENADZERSKE_ULOGE} />}>
          <Route path="/admin/pregled" element={<AdminPregledPage />} />
          <Route path="/menadzer/organizacija" element={<MenadzerOrganizacijaPage />} />
          <Route path="/menadzer/evidencija" element={<MenadzerEvidencijaPage />} />
          <Route path="/menadzer/zadaci" element={<MenadzerZadaciPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
