import { useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap'
import { kreirajTim } from '../../api/authApi'
import { porukaGreske } from '../../api/greske'

function imeMenadzera(tim) {
  if (!tim.menadzer_detail) return '—'
  return `${tim.menadzer_detail.ime} ${tim.menadzer_detail.prezime}`
}

function ListaTimova({ timovi, ucitavanje, greska, onTimKreiran }) {
  const [nazivTima, setNazivTima] = useState('')
  const [kreiranje, setKreiranje] = useState(false)
  const [greskaKreiranja, setGreskaKreiranja] = useState('')
  const [uspeh, setUspeh] = useState('')

  const posaljiFormu = async (event) => {
    event.preventDefault()

    const naziv = nazivTima.trim()

    if (!naziv) {
      setGreskaKreiranja('Unesite naziv tima.')
      return
    }

    setKreiranje(true)
    setGreskaKreiranja('')
    setUspeh('')

    try {
      await kreirajTim(naziv)
      setNazivTima('')
      setUspeh('Tim je uspešno kreiran.')

      if (onTimKreiran) {
        onTimKreiran()
      }
    } catch (err) {
      setGreskaKreiranja(porukaGreske(err, 'Kreiranje tima nije uspelo.'))
    } finally {
      setKreiranje(false)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Timovi</Card.Title>
        <Card.Text className="text-muted">
          Lista timova sa zaduženim menadžerom i brojem članova.
        </Card.Text>

        <Form onSubmit={posaljiFormu} className="mb-3">
          <Form.Label>Kreiraj novi tim</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Naziv tima"
              value={nazivTima}
              onChange={(e) => setNazivTima(e.target.value)}
            />
            <Button type="submit" disabled={kreiranje}>
              {kreiranje ? 'Kreiranje...' : 'Kreiraj tim'}
            </Button>
          </InputGroup>
        </Form>

        {greskaKreiranja && <Alert variant="danger">{greskaKreiranja}</Alert>}
        {uspeh && <Alert variant="success">{uspeh}</Alert>}

        {ucitavanje && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" /> Učitavanje...
          </div>
        )}

        {!ucitavanje && greska && <Alert variant="warning">{greska}</Alert>}

        {!ucitavanje && !greska && (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Naziv tima</th>
                <th>Menadžer</th>
                <th>Broj članova</th>
              </tr>
            </thead>
            <tbody>
              {timovi.length === 0 ? (
                <tr>
                  <td colSpan={3} className="organization-empty">
                    Nema timova za prikaz.
                  </td>
                </tr>
              ) : (
                timovi.map((tim) => (
                  <tr key={tim.tim_id}>
                    <td>{tim.naziv}</td>
                    <td>{imeMenadzera(tim)}</td>
                    <td>{tim.clanovi_detail ? tim.clanovi_detail.length : 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default ListaTimova