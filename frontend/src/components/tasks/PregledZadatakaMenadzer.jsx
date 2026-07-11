import { Badge, Card, Table } from 'react-bootstrap'
import { zadaci } from '../../data/tasksDummyData'

function getStatusVariant(status) {
  if (status === 'ZAVRŠENO') return 'success'
  if (status === 'U RADU') return 'primary'
  return 'warning'
}

function PregledZadatakaMenadzer() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Svi zadaci</Card.Title>
        <Card.Text className="text-muted">
          Pregled zadataka dodeljenih svim radnicima.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Radnik</th>
              <th>Rok</th>
              <th>Prioritet</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {zadaci.map((zadatak) => (
              <tr key={zadatak.id}>
                <td>{zadatak.naziv}</td>
                <td>{zadatak.radnik}</td>
                <td>{zadatak.rok}</td>
                <td>{zadatak.prioritet}</td>
                <td>
                  <Badge bg={getStatusVariant(zadatak.status)}>{zadatak.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default PregledZadatakaMenadzer
