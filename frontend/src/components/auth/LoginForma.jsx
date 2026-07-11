import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { porukaGreske } from '../../api/greske'

function LoginForma() {
  const { prijava } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [korImeIliMejl, setKorImeIliMejl] = useState('')
  const [sifra, setSifra] = useState('')
  const [validirano, setValidirano] = useState(false)
  const [greska, setGreska] = useState('')
  const [salje, setSalje] = useState(false)

  const posaljiFormu = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const forma = event.currentTarget
    setValidirano(true)
    if (!forma.checkValidity()) return

    setGreska('')
    setSalje(true)
    try {
      await prijava(korImeIliMejl, sifra)
      // Vrati korisnika tamo gde je pošao pre preusmeravanja na login, ili na profil.
      const odrediste = location.state?.odKuda || '/profil'
      navigate(odrediste, { replace: true })
    } catch (err) {
      setGreska(porukaGreske(err, 'Pogrešno korisničko ime/email ili lozinka.'))
    } finally {
      setSalje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Prijava</Card.Title>
        <Card.Text className="text-muted">
          Unesite korisničko ime ili mejl i lozinku za pristup sistemu.
        </Card.Text>

        {greska && <Alert variant="danger">{greska}</Alert>}

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime ili mejl</Form.Label>
            <Form.Control
              required
              placeholder="npr. ana.anic"
              value={korImeIliMejl}
              onChange={(e) => setKorImeIliMejl(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Korisničko ime ili mejl je obavezno.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Lozinka"
              value={sifra}
              onChange={(e) => setSifra(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Lozinka je obavezna.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={salje}>
            {salje ? 'Prijavljivanje...' : 'Prijavi se'}
          </Button>

          <div className="mt-3">
            <span className="text-muted">Nemate nalog? </span>
            <Link to="/registracija">Registrujte se</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default LoginForma
