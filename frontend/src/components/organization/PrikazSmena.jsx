import { useEffect, useState } from 'react'
import { Alert, Card, Spinner, Table } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dohvatiMojeSmene, dohvatiSveSmene } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

const TIP_LABELA = { PRVA: 'Prva', DRUGA: 'Druga', TRECA: 'Treća' }

function PrikazSmena() {
  const { korisnik, uloga } = useAuth()
  const jeMenadzer = uloga === 'MENADZER' || uloga === 'ADMIN'

  const [smene, setSmene] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = jeMenadzer
          ? await dohvatiSveSmene()
          : await dohvatiMojeSmene(korisnik.zaposleni_id)
        setSmene(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [jeMenadzer, korisnik.zaposleni_id])

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Prikaz smena</Card.Title>
        <Card.Text className="text-muted">
          {jeMenadzer ? 'Sve definisane smene.' : 'Smene u kojima ste raspoređeni.'}
        </Card.Text>

        {smene.length === 0 ? (
          <p className="text-muted">Nema smena za prikaz.</p>
        ) : jeMenadzer ? (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Nedelja</th>
                <th>Od</th>
                <th>Do</th>
              </tr>
            </thead>
            <tbody>
              {smene.map((smena) => (
                <tr key={smena.smena_id}>
                  <td>{smena.broj_nedelje}</td>
                  <td>{new Date(smena.datum_od).toLocaleDateString('sr-RS')}</td>
                  <td>{new Date(smena.datum_do).toLocaleDateString('sr-RS')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Nedelja</th>
                <th>Od</th>
                <th>Do</th>
                <th>Tip smene</th>
              </tr>
            </thead>
            <tbody>
              {smene.map((veza, idx) => (
                <tr key={idx}>
                  <td>{veza.smena_detail?.broj_nedelje}</td>
                  <td>{new Date(veza.smena_detail?.datum_od).toLocaleDateString('sr-RS')}</td>
                  <td>{new Date(veza.smena_detail?.datum_do).toLocaleDateString('sr-RS')}</td>
                  <td>{TIP_LABELA[veza.tip_smene] ?? veza.tip_smene}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default PrikazSmena
