import { Badge, Card, Table } from 'react-bootstrap'
import { uloge, zaposleni } from '../../data/authDummyData'

function nazivUloge(vrednost) {
  const uloga = uloge.find((u) => u.vrednost === vrednost)
  return uloga ? uloga.naziv : vrednost
}

function ListaZaposlenih() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Zaposleni</Card.Title>
        <Card.Text className="text-muted">
          Pregled svih zaposlenih sa ulogom i pripadajućim timom.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Ime i prezime</th>
              <th>Korisničko ime</th>
              <th>Mejl</th>
              <th>Uloga</th>
              <th>Tim</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {zaposleni.map((radnik) => (
              <tr key={radnik.id}>
                <td>
                  {radnik.ime} {radnik.prezime}
                </td>
                <td>{radnik.korIme}</td>
                <td>{radnik.mejl}</td>
                <td>{nazivUloge(radnik.uloga)}</td>
                <td>{radnik.tim}</td>
                <td>
                  <Badge bg={radnik.aktivan ? 'success' : 'secondary'}>
                    {radnik.aktivan ? 'Aktivan' : 'Neaktivan'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default ListaZaposlenih
