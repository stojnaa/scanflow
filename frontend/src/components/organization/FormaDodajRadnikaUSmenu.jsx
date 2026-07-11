import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiZaposlene, dohvatiTimove } from '../../api/authApi'
import { dohvatiSveSmene, dodajRadnikaUSmenu } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

function FormaDodajRadnikaUSmenu({ onDodato }) {
  const { uloga } = useAuth()
  const [smene, setSmene] = useState([])
  const [zaposleni, setZaposleni] = useState([])
  const [greska, setGreska] = useState(null)
  const [slanje, setSlanje] = useState(false)
  const [uspeh, setUspeh] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const [smeneData, zaposleniData] = await Promise.all([
          dohvatiSveSmene(),
          uloga === 'ADMIN'
            ? dohvatiZaposlene()
            : dohvatiTimove().then((timovi) => {
                const svi = timovi.flatMap((t) => t.clanovi_detail ?? [])
                return svi.filter(
                  (z, i, arr) => arr.findIndex((x) => x.zaposleni_id === z.zaposleni_id) === i,
                )
              }),
        ])
        setSmene(smeneData)
        setZaposleni(zaposleniData)
      } catch (e) {
        setGreska(porukaGreske(e))
      }
    }
    ucitaj()
  }, [uloga])

  async function onSubmit(e) {
    e.preventDefault()
    setGreska(null)
    setUspeh(false)
    const forma = e.currentTarget
    const smenaId = parseInt(forma.smena.value, 10)
    const zaposleniId = parseInt(forma.zaposleni.value, 10)
    const tipSmene = forma.tipSmene.value

    if (!smenaId || !zaposleniId) {
      setGreska('Odaberite smenu i radnika.')
      return
    }

    setSlanje(true)
    try {
      await dodajRadnikaUSmenu(smenaId, zaposleniId, tipSmene)
      setUspeh(true)
      formRef.current?.reset()
      onDodato?.()
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setSlanje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Dodaj radnika u smenu</Card.Title>
        <Card.Text className="text-muted">
          Popunjavanje smene izborom radnika i tipa smene.
        </Card.Text>

        {greska && <Alert variant="danger" onClose={() => setGreska(null)} dismissible>{greska}</Alert>}
        {uspeh && <Alert variant="success" onClose={() => setUspeh(false)} dismissible>Radnik dodat u smenu.</Alert>}

        <Form onSubmit={onSubmit} ref={formRef}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Smena</Form.Label>
                <Form.Select name="smena" required>
                  <option value="">— odaberi —</option>
                  {smene.map((smena) => (
                    <option key={smena.smena_id} value={smena.smena_id}>
                      Nedelja {smena.broj_nedelje} ({smena.datum_od})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Radnik</Form.Label>
                <Form.Select name="zaposleni" required>
                  <option value="">— odaberi —</option>
                  {zaposleni.map((z) => (
                    <option key={z.zaposleni_id} value={z.zaposleni_id}>
                      {z.ime} {z.prezime}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tip smene</Form.Label>
                <Form.Select name="tipSmene">
                  <option value="PRVA">Prva</option>
                  <option value="DRUGA">Druga</option>
                  <option value="TRECA">Treća</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" disabled={slanje}>
            {slanje ? <Spinner size="sm" animation="border" /> : 'Dodaj u smenu'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default FormaDodajRadnikaUSmenu
