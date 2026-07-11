import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiMojeZadatke, promeniStatusZadatka } from '../../api/zadaciApi'
import { porukaGreske } from '../../api/greske'

const STATUS_LABELA = {
  TO_DO: 'Na čekanju',
  IN_PROGRESS: 'U radu',
  DONE: 'Završeno',
}

const STATUS_VARIJANTA = {
  TO_DO: 'warning',
  IN_PROGRESS: 'primary',
  DONE: 'success',
}

function ListaZadataka() {
  const { korisnik } = useAuth()
  const [zadaci, setZadaci] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)
  const [menjanje, setMenjanje] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = await dohvatiMojeZadatke(korisnik.zaposleni_id)
        setZadaci(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [korisnik.zaposleni_id])

  async function promeniStatus(zadatakId, noviStatus) {
    setMenjanje(zadatakId)
    try {
      const azuriran = await promeniStatusZadatka(zadatakId, noviStatus)
      setZadaci((prethodni) =>
        prethodni.map((z) => (z.id === azuriran.id ? azuriran : z)),
      )
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setMenjanje(null)
    }
  }

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moji zadaci</Card.Title>
        <Card.Text className="text-muted">
          Zadaci dodeljeni vama, sa mogućnošću promene statusa.
        </Card.Text>

        {zadaci.length === 0 ? (
          <p className="text-muted">Nemate dodeljenih zadataka.</p>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Rok</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {zadaci.map((zadatak) => (
                <tr key={zadatak.id}>
                  <td>
                    <div>{zadatak.naslov}</div>
                    <small className="text-muted">{zadatak.opis}</small>
                  </td>
                  <td>{new Date(zadatak.rok).toLocaleDateString('sr-RS')}</td>
                  <td>
                    <Badge bg={STATUS_VARIJANTA[zadatak.status]}>
                      {STATUS_LABELA[zadatak.status]}
                    </Badge>
                  </td>
                  <td>
                    <div className="organization-actions">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        type="button"
                        disabled={zadatak.status !== 'TO_DO' || menjanje === zadatak.id}
                        onClick={() => promeniStatus(zadatak.id, 'IN_PROGRESS')}
                      >
                        U radu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-success"
                        type="button"
                        disabled={zadatak.status === 'DONE' || menjanje === zadatak.id}
                        onClick={() => promeniStatus(zadatak.id, 'DONE')}
                      >
                        Završeno
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default ListaZadataka
