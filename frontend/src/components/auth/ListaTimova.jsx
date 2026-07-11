import { Card, Table } from 'react-bootstrap'
import { timovi } from '../../data/authDummyData'

function ListaTimova() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Timovi</Card.Title>
        <Card.Text className="text-muted">
          Lista timova sa zaduženim menadžerom i brojem članova.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Naziv tima</th>
              <th>Menadžer</th>
              <th>Broj članova</th>
            </tr>
          </thead>
          <tbody>
            {timovi.map((tim) => (
              <tr key={tim.id}>
                <td>{tim.naziv}</td>
                <td>{tim.menadzer}</td>
                <td>{tim.brojClanova}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default ListaTimova
