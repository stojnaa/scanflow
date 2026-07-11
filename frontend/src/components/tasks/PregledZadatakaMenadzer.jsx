import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Spinner, Table } from 'react-bootstrap'
import { dohvatiSveZadatke } from '../../api/zadaciApi'
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

function PregledZadatakaMenadzer({ osvezavanje }) {
  const [zadaci, setZadaci] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = await dohvatiSveZadatke()
        setZadaci(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [osvezavanje])

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Svi zadaci</Card.Title>
        <Card.Text className="text-muted">
          Pregled zadataka dodeljenih svim radnicima.
        </Card.Text>

        {zadaci.length === 0 ? (
          <p className="text-muted">Nema kreiranih zadataka.</p>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Dodeljeno</th>
                <th>Rok</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {zadaci.map((zadatak) => (
                <tr key={zadatak.id}>
                  <td>
                    <div>{zadatak.naslov}</div>
                    <small className="text-muted">{zadatak.opis}</small>
                  </td>
                  <td>
                    {zadatak.dodeljeni_detail?.map((z) => (
                      <span key={z.zaposleni_id}>
                        {z.ime} {z.prezime}
                      </span>
                    ))}
                  </td>
                  <td>{new Date(zadatak.rok).toLocaleDateString('sr-RS')}</td>
                  <td>
                    <Badge bg={STATUS_VARIJANTA[zadatak.status]}>
                      {STATUS_LABELA[zadatak.status]}
                    </Badge>
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

export default PregledZadatakaMenadzer
