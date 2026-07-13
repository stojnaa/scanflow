import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Spinner,
  Table,
} from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { promeniUloguZaposlenog } from '../../api/authApi'
import { porukaGreske } from '../../api/greske'

function nazivUloge(uloga) {
  if (uloga === 'ADMIN') return 'Administrator'
  if (uloga === 'MENADZER') return 'Menadžer'
  return 'Radnik'
}

function imenaTimova(timovi) {
  if (!timovi || timovi.length === 0) return '—'
  return timovi.map((t) => t.naziv).join(', ')
}

function ListaZaposlenih({
  zaposleni,
  ucitavanje,
  greska,
  onPromenjeno,
}) {
  const { korisnik, uloga } = useAuth()

  const [noveUloge, setNoveUloge] = useState({})
  const [menjaSeId, setMenjaSeId] = useState(null)
  const [greskaPromene, setGreskaPromene] = useState('')
  const [uspeh, setUspeh] = useState('')

  const promeniUlogu = async (radnik) => {
    const novaUloga =
      noveUloge[radnik.zaposleni_id] ?? radnik.uloga

    if (novaUloga === radnik.uloga) {
      setGreskaPromene('Izaberite novu ulogu.')
      return
    }

    setGreskaPromene('')
    setUspeh('')
    setMenjaSeId(radnik.zaposleni_id)

    try {
      await promeniUloguZaposlenog(
        radnik.zaposleni_id,
        novaUloga,
      )

      setUspeh(
        `Uloga zaposlenog ${radnik.ime} ${radnik.prezime} je uspešno promenjena.`,
      )

      setNoveUloge((prethodno) => {
        const kopija = { ...prethodno }
        delete kopija[radnik.zaposleni_id]
        return kopija
      })

      await onPromenjeno?.()
    } catch (err) {
      setGreskaPromene(
        porukaGreske(
          err,
          'Promena uloge nije uspela.',
        ),
      )
    } finally {
      setMenjaSeId(null)
    }
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Zaposleni</Card.Title>

        <Card.Text className="text-muted">
          Pregled svih zaposlenih sa ulogom i pripadajućim timovima.
        </Card.Text>

        {greskaPromene && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setGreskaPromene('')}
          >
            {greskaPromene}
          </Alert>
        )}

        {uspeh && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setUspeh('')}
          >
            {uspeh}
          </Alert>
        )}

        {ucitavanje && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" /> Učitavanje...
          </div>
        )}

        {!ucitavanje && greska && (
          <Alert variant="warning">{greska}</Alert>
        )}

        {!ucitavanje && !greska && (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Ime i prezime</th>
                <th>Korisničko ime</th>
                <th>Mejl</th>
                <th>Uloga</th>
                <th>Timovi</th>
                <th>Status</th>
                <th>Promena uloge</th>
              </tr>
            </thead>

            <tbody>
              {zaposleni.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="organization-empty"
                  >
                    Nema zaposlenih za prikaz.
                  </td>
                </tr>
              ) : (
                zaposleni.map((radnik) => {
                  const izabranaUloga =
                    noveUloge[radnik.zaposleni_id] ??
                    radnik.uloga

                  const jeSopstveniNalog =
                    radnik.zaposleni_id ===
                    korisnik?.zaposleni_id

                  return (
                    <tr key={radnik.zaposleni_id}>
                      <td>
                        {radnik.ime} {radnik.prezime}
                      </td>

                      <td>{radnik.kor_ime}</td>
                      <td>{radnik.mejl}</td>
                      <td>{nazivUloge(radnik.uloga)}</td>
                      <td>
                        {imenaTimova(
                          radnik.timovi_detail,
                        )}
                      </td>

                      <td>
                        <Badge
                          bg={
                            radnik.aktivan
                              ? 'success'
                              : 'secondary'
                          }
                        >
                          {radnik.aktivan
                            ? 'Aktivan'
                            : 'Neaktivan'}
                        </Badge>
                      </td>

                      <td>
                        {jeSopstveniNalog ? (
                          <span className="text-muted">
                            Sopstvena uloga
                          </span>
                        ) : (
                          <div className="d-flex gap-2">
                            <Form.Select
                              size="sm"
                              value={izabranaUloga}
                              onChange={(e) =>
                                setNoveUloge(
                                  (prethodno) => ({
                                    ...prethodno,
                                    [radnik.zaposleni_id]:
                                      e.target.value,
                                  }),
                                )
                              }
                            >
                              <option value="RADNIK">
                                Radnik
                              </option>

                              <option value="MENADZER">
                                Menadžer
                              </option>

                              {uloga === 'ADMIN' && (
                                <option value="ADMIN">
                                  Administrator
                                </option>
                              )}
                            </Form.Select>

                            <Button
                              size="sm"
                              variant="primary"
                              disabled={
                                menjaSeId ===
                                  radnik.zaposleni_id ||
                                izabranaUloga ===
                                  radnik.uloga
                              }
                              onClick={() =>
                                promeniUlogu(radnik)
                              }
                            >
                              {menjaSeId ===
                              radnik.zaposleni_id
                                ? 'Čuvanje...'
                                : 'Sačuvaj'}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default ListaZaposlenih