import { Badge, Card, Table } from 'react-bootstrap'
import { prisutniNaPoslu } from '../../data/qrDummyData'

function PrisutniNaPoslu() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Trenutno na poslu</Card.Title>
        <Card.Text className="text-muted">
          Zaposleni čiji je poslednji zapis u evidenciji check-in.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Zaposleni</th>
              <th>Vreme dolaska</th>
              <th>Vreme na poslu</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {prisutniNaPoslu.map((zapis) => (
              <tr key={zapis.id}>
                <td>{zapis.ime}</td>
                <td>{zapis.vremeDolaska}</td>
                <td>{zapis.trajanje}</td>
                <td>
                  <Badge bg="success">Na poslu</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default PrisutniNaPoslu
