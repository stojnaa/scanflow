import { useState } from 'react'
import { Badge, Button, Card, Table } from 'react-bootstrap'
import { zadaci } from '../../data/tasksDummyData'

const trenutniRadnik = 'Ana Anić'

function getStatusVariant(status) {
  if (status === 'ZAVRŠENO') return 'success'
  if (status === 'U RADU') return 'primary'
  return 'warning'
}

function ListaZadataka() {
  const [mojiZadaci, setMojiZadaci] = useState(
    zadaci.filter((zadatak) => zadatak.radnik === trenutniRadnik),
  )

  const promeniStatus = (id, noviStatus) => {
    setMojiZadaci((trenutni) =>
      trenutni.map((zadatak) =>
        zadatak.id === id ? { ...zadatak, status: noviStatus } : zadatak,
      ),
    )
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moji zadaci</Card.Title>
        <Card.Text className="text-muted">
          Zadaci dodeljeni radniku {trenutniRadnik}, sa mogućnošću promene statusa.
        </Card.Text>

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Rok</th>
              <th>Prioritet</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {mojiZadaci.map((zadatak) => (
              <tr key={zadatak.id}>
                <td>
                  <div>{zadatak.naziv}</div>
                  <small className="text-muted">{zadatak.opis}</small>
                </td>
                <td>{zadatak.rok}</td>
                <td>{zadatak.prioritet}</td>
                <td>
                  <Badge bg={getStatusVariant(zadatak.status)}>{zadatak.status}</Badge>
                </td>
                <td>
                  <div className="organization-actions">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      type="button"
                      disabled={zadatak.status !== 'NA ČEKANJU'}
                      onClick={() => promeniStatus(zadatak.id, 'U RADU')}
                    >
                      U radu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      type="button"
                      disabled={zadatak.status === 'ZAVRŠENO'}
                      onClick={() => promeniStatus(zadatak.id, 'ZAVRŠENO')}
                    >
                      Završeno
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

export default ListaZadataka
