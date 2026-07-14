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
  const [greskePolja, setGreskePolja] = useState({})
  const [greska, setGreska] = useState('')
  const [salje, setSalje] = useState(false)

  const proveriFormu = () => {
    const noveGreske = {}

    if (!korImeIliMejl.trim()) {
      noveGreske.korImeIliMejl =
        'Korisničko ime ili mejl je obavezno.'
    }

    if (!sifra) {
      noveGreske.sifra = 'Lozinka je obavezna.'
    }

    setGreskePolja(noveGreske)

    return Object.keys(noveGreske).length === 0
  }

  const posaljiFormu = async (event) => {
    event.preventDefault()

    if (!proveriFormu()) return

    setGreska('')
    setSalje(true)

    try {
      await prijava(korImeIliMejl.trim(), sifra)

      const odrediste =
        location.state?.odKuda || '/radnik/organizacija'

      navigate(odrediste, { replace: true })
    } catch (err) {
      setGreska(
        porukaGreske(
          err,
          'Pogrešno korisničko ime/email ili lozinka.',
        ),
      )
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

        {greska && (
          <Alert variant="danger">
            {greska}
          </Alert>
        )}

        <Form noValidate onSubmit={posaljiFormu}>
          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime ili mejl</Form.Label>

            <Form.Control
              placeholder="Vaše korisničko ime"
              value={korImeIliMejl}
              isInvalid={Boolean(
                greskePolja.korImeIliMejl,
              )}
              onChange={(e) => {
                setKorImeIliMejl(e.target.value)

                setGreskePolja((prethodno) => ({
                  ...prethodno,
                  korImeIliMejl: '',
                }))
              }}
            />

            <Form.Control.Feedback type="invalid">
              {greskePolja.korImeIliMejl}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lozinka</Form.Label>

            <Form.Control
              type="password"
              placeholder="Lozinka"
              value={sifra}
              isInvalid={Boolean(greskePolja.sifra)}
              onChange={(e) => {
                setSifra(e.target.value)

                setGreskePolja((prethodno) => ({
                  ...prethodno,
                  sifra: '',
                }))
              }}
            />

            <Form.Control.Feedback type="invalid">
              {greskePolja.sifra}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={salje}
          >
            {salje ? 'Prijavljivanje...' : 'Prijavi se'}
          </Button>

          <div className="mt-3">
            <span className="text-muted">
              Nemate nalog?{' '}
            </span>

            <Link to="/registracija">
              Registrujte se
            </Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default LoginForma