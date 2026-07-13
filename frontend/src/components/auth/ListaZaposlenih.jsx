import { Alert, Badge, Card, Spinner, Table } from 'react-bootstrap'
import { nazivUloge } from '../../constants/uloge'

function imenaTimova(timovi) {
  if (!timovi || timovi.length === 0) return '—'
  return timovi.map((t) => t.naziv).join(', ')
}

function ListaZaposlenih({ zaposleni, ucitavanje, greska }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Zaposleni</Card.Title>
        <Card.Text className="text-muted">
          Pregled svih zaposlenih sa ulogom i pripadajućim timovima.
        </Card.Text>

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
                <th>Ime i prezime</th>
                <th>Korisničko ime</th>
                <th>Mejl</th>
                <th>Uloga</th>
                <th>Timovi</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {zaposleni.length === 0 ? (
                <tr>
                  <td colSpan={6} className="organization-empty">
                    Nema zaposlenih za prikaz.
                  </td>
                </tr>
              ) : (
                zaposleni.map((radnik) => (
                  <tr key={radnik.zaposleni_id}>
                    <td>
                      {radnik.ime} {radnik.prezime}
                    </td>
                    <td>{radnik.kor_ime}</td>
                    <td>{radnik.mejl}</td>
                    <td>{nazivUloge(radnik.uloga)}</td>
                    <td>{imenaTimova(radnik.timovi_detail)}</td>
                    <td>
                      <Badge bg={radnik.aktivan ? 'success' : 'secondary'}>
                        {radnik.aktivan ? 'Aktivan' : 'Neaktivan'}
                      </Badge>
                    </td>
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

export default ListaZaposlenih
