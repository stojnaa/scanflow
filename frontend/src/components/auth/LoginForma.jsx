import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function LoginForma() {
  const [validirano, setValidirano] = useState(false)

  const posaljiFormu = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // Prava provera kredencijala i čuvanje tokena dolaze u Week 4.
    setValidirano(true)
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Prijava</Card.Title>
        <Card.Text className="text-muted">
          Unesite korisničko ime i lozinku za pristup sistemu.
        </Card.Text>

        <Form noValidate validated={validirano} onSubmit={posaljiFormu}>
          <Form.Group className="mb-3">
            <Form.Label>Korisničko ime</Form.Label>
            <Form.Control required placeholder="npr. ana.anic" />
            <Form.Control.Feedback type="invalid">
              Korisničko ime je obavezno.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lozinka</Form.Label>
            <Form.Control required type="password" placeholder="Lozinka" />
            <Form.Control.Feedback type="invalid">
              Lozinka je obavezna.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Prijavi se
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
