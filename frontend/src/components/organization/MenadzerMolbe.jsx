import { Badge, Button, Card, Table } from 'react-bootstrap'
import { molbe } from '../../data/organizationDummyData'

function getStatusVariant(status) {
  if (status === 'ODOBRENA') return 'success'
  if (status === 'ODBIJENA') return 'danger'
  return 'warning'
}

function MenadzerMolbe() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Molbe za slobodne dane</Card.Title>
        <Card.Text className="text-muted">
          Pregled pristiglih molbi sa akcijama za odobravanje i odbijanje.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Radnik</th>
              <th>Datum</th>
              <th>Razlog</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {molbe.map((molba) => (
              <tr key={molba.id}>
                <td>{molba.radnik}</td>
                <td>{molba.datum}</td>
                <td>{molba.razlog}</td>
                <td>
                  <Badge
                    bg={getStatusVariant(molba.status)}
                    text={molba.status === 'NA ČEKANJU' ? 'dark' : undefined}
                  >
                    {molba.status}
                  </Badge>
                </td>
                <td>
                  <div className="organization-actions">
                    <Button size="sm" variant="success" type="button">
                      Odobri
                    </Button>
                    <Button size="sm" variant="danger" type="button">
                      Odbij
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default MenadzerMolbe