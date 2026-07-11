import { Badge, Card, Table } from 'react-bootstrap'
import { molbe } from '../../data/organizationDummyData'

function getStatusVariant(status) {
  if (status === 'ODOBRENA') return 'success'
  if (status === 'ODBIJENA') return 'danger'
  return 'warning'
}

function MojeMolbe() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moje molbe</Card.Title>
        <Card.Text className="text-muted">
          Pregled statusa poslatih zahteva.
        </Card.Text>

        <Table responsive hover>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Razlog</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {molbe.slice(0, 2).map((molba) => (
              <tr key={molba.id}>
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default MojeMolbe