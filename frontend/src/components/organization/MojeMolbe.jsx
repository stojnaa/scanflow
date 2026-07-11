import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Spinner, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiMojeMolbe } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

const STATUS_LABELA = {
  NA_CEKANJU: 'Na čekanju',
  ODOBRENA: 'Odobrena',
  ODBIJENA: 'Odbijena',
}

const STATUS_VARIJANTA = {
  NA_CEKANJU: 'warning',
  ODOBRENA: 'success',
  ODBIJENA: 'danger',
}

function MojeMolbe() {
  const { korisnik } = useAuth()
  const [molbe, setMolbe] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = await dohvatiMojeMolbe(korisnik.zaposleni_id)
        setMolbe(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [korisnik.zaposleni_id])

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Moje molbe</Card.Title>
        <Card.Text className="text-muted">Pregled statusa poslatih zahteva.</Card.Text>

        {molbe.length === 0 ? (
          <p className="text-muted">Niste poslali nijednu molbu.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Naslov</th>
                <th>Datum</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {molbe.map((molba) => (
                <tr key={molba.molba_id}>
                  <td>{molba.naslov}</td>
                  <td>{new Date(molba.datum_za_koji_se_trazi).toLocaleDateString('sr-RS')}</td>
                  <td>
                    <Badge
                      bg={STATUS_VARIJANTA[molba.status]}
                      text={molba.status === 'NA_CEKANJU' ? 'dark' : undefined}
                    >
                      {STATUS_LABELA[molba.status]}
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

export default MojeMolbe
