import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Spinner, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiSveMolbe, odobriMolbu, odbijMolbu } from '../../api/organizacijaApi'
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

function MenadzerMolbe() {
  const { korisnik } = useAuth()
  const [molbe, setMolbe] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)
  const [resavanje, setResavanje] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = await dohvatiSveMolbe()
        setMolbe(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [])

  async function resi(molbaId, akcija) {
    setResavanje(molbaId)
    try {
      const fn = akcija === 'odobri' ? odobriMolbu : odbijMolbu
      const azurirana = await fn(molbaId, korisnik.zaposleni_id)
      setMolbe((prethodni) =>
        prethodni.map((m) => (m.molba_id === azurirana.molba_id ? azurirana : m)),
      )
    } catch (e) {
      setGreska(porukaGreske(e))
    } finally {
      setResavanje(null)
    }
  }

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Molbe za slobodne dane</Card.Title>
        <Card.Text className="text-muted">
          Pregled pristiglih molbi sa akcijama za odobravanje i odbijanje.
        </Card.Text>

        {molbe.length === 0 ? (
          <p className="text-muted">Nema poslatih molbi.</p>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Radnik</th>
                <th>Naslov</th>
                <th>Datum</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {molbe.map((molba) => (
                <tr key={molba.molba_id}>
                  <td>
                    {molba.zaposleni_detail
                      ? `${molba.zaposleni_detail.ime} ${molba.zaposleni_detail.prezime}`
                      : molba.zaposleni}
                  </td>
                  <td>
                    <div>{molba.naslov}</div>
                    <small className="text-muted">{molba.opis}</small>
                  </td>
                  <td>{new Date(molba.datum_za_koji_se_trazi).toLocaleDateString('sr-RS')}</td>
                  <td>
                    <Badge
                      bg={STATUS_VARIJANTA[molba.status]}
                      text={molba.status === 'NA_CEKANJU' ? 'dark' : undefined}
                    >
                      {STATUS_LABELA[molba.status]}
                    </Badge>
                  </td>
                  <td>
                    <div className="organization-actions">
                      <Button
                        size="sm"
                        variant="success"
                        type="button"
                        disabled={molba.status !== 'NA_CEKANJU' || resavanje === molba.molba_id}
                        onClick={() => resi(molba.molba_id, 'odobri')}
                      >
                        Odobri
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        type="button"
                        disabled={molba.status !== 'NA_CEKANJU' || resavanje === molba.molba_id}
                        onClick={() => resi(molba.molba_id, 'odbij')}
                      >
                        Odbij
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

export default MenadzerMolbe
