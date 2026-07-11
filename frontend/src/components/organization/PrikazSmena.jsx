import { Card, Table } from 'react-bootstrap'
import { smene } from '../../data/organizationDummyData'

function PrikazSmena() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Prikaz smena</Card.Title>
        <Card.Text className="text-muted">
          Tabela radnika raspoređenih po smenama.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Nedelja</th>
              <th>Period</th>
              <th>Prva smena</th>
              <th>Druga smena</th>
              <th>Treća smena</th>
            </tr>
          </thead>
          <tbody>
            {smene.map((smena) => (
              <tr key={smena.id}>
                <td>{smena.nedelja}</td>
                <td>{smena.period}</td>
                <td>{smena.prva}</td>
                <td>{smena.druga}</td>
                <td>{smena.treca}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default PrikazSmena