import { useEffect, useState } from 'react'
import { Alert, Button, Card, Spinner } from 'react-bootstrap'
import { dohvatiAktivnaObavestenja, obrisiObavestenje } from '../../api/organizacijaApi'
import { porukaGreske } from '../../api/greske'

function OglasnaTabla({ prikaziAkcije = false }) {
  const [obavestenja, setObavestenja] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const podaci = await dohvatiAktivnaObavestenja()
        setObavestenja(podaci)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [])

  async function obrisi(obavestenjeId) {
    try {
      await obrisiObavestenje(obavestenjeId)
      setObavestenja((prethodni) => prethodni.filter((o) => o.obavestenje_id !== obavestenjeId))
    } catch (e) {
      setGreska(porukaGreske(e))
    }
  }

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Oglasna tabla</Card.Title>
        <Card.Text className="text-muted">
          Pregled aktivnih obaveštenja za zaposlene.
        </Card.Text>

        {obavestenja.length === 0 ? (
          <p className="text-muted">Nema aktivnih obaveštenja.</p>
        ) : (
          obavestenja.map((obavestenje) => (
            <Card key={obavestenje.obavestenje_id} className="mb-3 border-light">
              <Card.Body>
                <div className="d-flex justify-content-between gap-3">
                  <h5 className="mb-1">{obavestenje.naslov}</h5>
                  <small className="text-muted">
                    {new Date(obavestenje.datum_kreiranja).toLocaleDateString('sr-RS')}
                  </small>
                </div>

                <p className="mb-1">{obavestenje.tekst}</p>
                {obavestenje.autor_detail && (
                  <small className="text-muted">
                    Autor: {obavestenje.autor_detail.ime} {obavestenje.autor_detail.prezime}
                  </small>
                )}

                {prikaziAkcije && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      type="button"
                      onClick={() => obrisi(obavestenje.obavestenje_id)}
                    >
                      Obriši
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Card.Body>
    </Card>
  )
}

export default OglasnaTabla
