import { Alert, Card, Spinner, Table } from 'react-bootstrap'

function imeMenadzera(tim) {
  if (!tim.menadzer_detail) return '—'
  return `${tim.menadzer_detail.ime} ${tim.menadzer_detail.prezime}`
}

function ListaTimova({ timovi, ucitavanje, greska }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Timovi</Card.Title>
        <Card.Text className="text-muted">
          Lista timova sa zaduženim menadžerom i brojem članova.
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
