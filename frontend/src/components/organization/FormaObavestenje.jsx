import { useRef, useState } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { kreirajObavestenje } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

function FormaObavestenje({ onKreirao }) {
  const { korisnik } = useAuth()
  const [greska, setGreska] = useState(null)
  const [slanje, setSlanje] = useState(false)
  const [uspeh, setUspeh] = useState(false)
  const formRef = useRef(null)

  async function onSubmit(e) {
    e.preventDefault()
    setGreska(null)
    setUspeh(false)
    const forma = e.currentTarget
    const naslov = forma.naslov.value.trim()
    const tekst = forma.tekst.value.trim()
    const aktivno = forma.aktivno.checked

    if (!naslov || !tekst) {
      setGreska('Popunite naslov i tekst obaveštenja.')
      return
    }

    setSlanje(true)
    try {
      await kreirajObavestenje({
        naslov,
        tekst,
        aktivno,
        autor: korisnik.zaposleni_id,
      })
      setUspeh(true)
      formRef.current?.reset()
      onKreirao?.()
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setSlanje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj obaveštenje</Card.Title>
        <Card.Text className="text-muted">
          Menadžer dodaje novo obaveštenje na oglasnu tablu.
        </Card.Text>

        {greska && <Alert variant="danger" onClose={() => setGreska(null)} dismissible>{greska}</Alert>}
        {uspeh && <Alert variant="success" onClose={() => setUspeh(false)} dismissible>Obaveštenje je objavljeno.</Alert>}

        <Form onSubmit={onSubmit} ref={formRef}>
          <Form.Group className="mb-3">
            <Form.Label>Naslov</Form.Label>
            <Form.Control name="naslov" placeholder="Unesite naslov obaveštenja" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tekst obaveštenja</Form.Label>
            <Form.Control
              name="tekst"
              as="textarea"
              rows={3}
              placeholder="Unesite tekst obaveštenja..."
              required
            />
          </Form.Group>
           <div className="hidden-test-controls">
          <Form.Check
            name="aktivno"
            className="mb-3"
            type="switch"
            label="Aktivno obaveštenje"
            defaultChecked
          />
          </div>

          <Button variant="primary" type="submit" disabled={slanje}>
            {slanje ? <Spinner size="sm" animation="border" /> : 'Dodaj obaveštenje'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaObavestenje
