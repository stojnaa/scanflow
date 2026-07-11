import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiZaposlene, dohvatiTimove } from '../../api/authApi'
import { kreirajZadatak } from '../../api/zadaciApi'
import { porukaGreske } from '../../api/greske'

function FormaZadatak({ onKreirano }) {
  const { uloga } = useAuth()
  const [zaposleni, setZaposleni] = useState([])
  const [greska, setGreska] = useState(null)
  const [slanje, setSlanje] = useState(false)
  const [uspeh, setUspeh] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    async function ucitajZaposlene() {
      try {
        if (uloga === 'ADMIN') {
          const lista = await dohvatiZaposlene()
          setZaposleni(lista)
        } else {
          const timovi = await dohvatiTimove()
          const svi = timovi.flatMap((t) => t.clanovi_detail ?? [])
          const jedinstveni = svi.filter(
            (z, idx, arr) => arr.findIndex((x) => x.zaposleni_id === z.zaposleni_id) === idx,
          )
          setZaposleni(jedinstveni)
        }
      } catch (e) {
        setGreska(porukaGreske(e))
      }
    }
    ucitajZaposlene()
  }, [uloga])

  async function onSubmit(e) {
    e.preventDefault()
    setGreska(null)
    setUspeh(false)
    const forma = e.currentTarget
    const naslov = forma.naslov.value.trim()
    const opis = forma.opis.value.trim()
    const rok = forma.rok.value
    const dodeljeniId = parseInt(forma.dodeljeni.value, 10)

    if (!naslov || !rok || !dodeljeniId) {
      setGreska('Popunite sva obavezna polja.')
      return
    }

    setSlanje(true)
    try {
      const novi = await kreirajZadatak({
        naslov,
        opis,
        rok: new Date(rok).toISOString(),
        dodeljeni: [dodeljeniId],
      })
      setUspeh(true)
      formRef.current?.reset()
      onKreirano?.(novi)
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setSlanje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Novi zadatak</Card.Title>
        <Card.Text className="text-muted">Kreiranje zadatka i dodela radniku.</Card.Text>

        {greska && <Alert variant="danger" onClose={() => setGreska(null)} dismissible>{greska}</Alert>}
        {uspeh && <Alert variant="success" onClose={() => setUspeh(false)} dismissible>Zadatak je kreiran.</Alert>}

        <Form onSubmit={onSubmit} ref={formRef}>
          <Form.Group className="mb-3">
            <Form.Label>Naziv zadatka</Form.Label>
            <Form.Control name="naslov" placeholder="Npr. Popis inventara" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opis</Form.Label>
            <Form.Control name="opis" as="textarea" rows={3} placeholder="Kratak opis zadatka..." />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dodeli radniku</Form.Label>
                <Form.Select name="dodeljeni" required>
                  <option value="">— odaberi —</option>
                  {zaposleni.map((z) => (
                    <option key={z.zaposleni_id} value={z.zaposleni_id}>
                      {z.ime} {z.prezime}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rok</Form.Label>
                <Form.Control name="rok" type="date" required />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" disabled={slanje}>
            {slanje ? <Spinner size="sm" animation="border" /> : 'Kreiraj zadatak'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaZadatak
