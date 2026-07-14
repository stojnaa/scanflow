import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
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

function imenaTimova(radnik) {
  const timovi = radnik.timovi ?? radnik.timovi_detail

  if (!timovi || timovi.length === 0) {
    return 'Nije član nijednog tima'
  }

  return timovi.map((tim) => tim.naziv).join(', ')
}

function formatirajDatum(datum) {
  if (!datum) return '—'

  return new Date(`${datum}T00:00:00`).toLocaleDateString(
    'sr-RS',
  )
}

function ListaZaposlenih({
  zaposleni,
  ucitavanje,
  greska,
  onPromenjeno,
}) {
  const { korisnik, uloga } = useAuth()

  const [izabraniRadnik, setIzabraniRadnik] =
    useState(null)

  const [novaUloga, setNovaUloga] = useState('')
  const [menjaSeUloga, setMenjaSeUloga] =
    useState(false)

  const [greskaPromene, setGreskaPromene] =
    useState('')

  const [uspeh, setUspeh] = useState('')

  const otvoriDetalje = (radnik) => {
    setIzabraniRadnik(radnik)
    setNovaUloga(radnik.uloga)
    setGreskaPromene('')
    setUspeh('')
  }

  const zatvoriDetalje = () => {
    if (menjaSeUloga) return

    setIzabraniRadnik(null)
    setNovaUloga('')
    setGreskaPromene('')
    setUspeh('')
  }

  const sacuvajUlogu = async () => {
    if (!izabraniRadnik) return

    if (novaUloga === izabraniRadnik.uloga) {
      setGreskaPromene('Izaberite novu ulogu.')
      return
    }

    setGreskaPromene('')
    setUspeh('')
    setMenjaSeUloga(true)

    try {
      const izmenjeniRadnik =
        await promeniUloguZaposlenog(
          izabraniRadnik.zaposleni_id,
          novaUloga,
        )

      setIzabraniRadnik(izmenjeniRadnik)

      setUspeh(
        `Uloga zaposlenog ${izmenjeniRadnik.ime} ${izmenjeniRadnik.prezime} je uspešno promenjena.`,
      )

      await onPromenjeno?.()
    } catch (err) {
      setGreskaPromene(
        porukaGreske(
          err,
          'Promena uloge nije uspela.',
        ),
      )
    } finally {
      setMenjaSeUloga(false)
    }
  }

  const jeSopstveniNalog =
    izabraniRadnik?.zaposleni_id ===
    korisnik?.zaposleni_id

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Card.Title>Zaposleni</Card.Title>

          <Card.Text className="text-muted">
            Pregled zaposlenih. Kliknite na detalje za
            potpune informacije.
          </Card.Text>

          {ucitavanje && (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />{' '}
              Učitavanje...
            </div>
          )}

          {!ucitavanje && greska && (
            <Alert variant="warning">{greska}</Alert>
          )}

          {!ucitavanje && !greska && (
            <Table
              responsive
              hover
              className="align-middle employee-table"
            >
              <thead>
                <tr>
                  <th>Zaposleni</th>
                  <th>Uloga</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {zaposleni.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="organization-empty"
                    >
                      Nema zaposlenih za prikaz.
                    </td>
                  </tr>
                ) : (
                  zaposleni.map((radnik) => (
                    <tr key={radnik.zaposleni_id}>
                      <td>
                        <div className="employee-name">
                          {radnik.ime} {radnik.prezime}
                        </div>

                        <div className="employee-username">
                          @{radnik.kor_ime}
                        </div>
                      </td>

                      <td>
                        <Badge
                            className="text-white"
                          bg={
                            radnik.uloga === 'ADMIN'
                              ? 'danger'
                              : radnik.uloga ===
                                  'MENADZER'
                                ? 'primary'
                                : 'secondary'
                          }
                        >
                          {nazivUloge(radnik.uloga)}
                        </Badge>
                      </td>

                      <td>
                        <Badge
                        className="text-white"
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

                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            otvoriDetalje(radnik)
                          }
                        >
                          Detalji
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={Boolean(izabraniRadnik)}
        onHide={zatvoriDetalje}
        centered
        size="lg"
        backdrop={menjaSeUloga ? 'static' : true}
        keyboard={!menjaSeUloga}
      >
        {izabraniRadnik && (
          <>
            <Modal.Header closeButton>
              <div>
                <Modal.Title>
                  {izabraniRadnik.ime}{' '}
                  {izabraniRadnik.prezime}
                </Modal.Title>

                <div className="text-muted mt-1">
                  Detalji zaposlenog
                </div>
              </div>
            </Modal.Header>

            <Modal.Body>
              {greskaPromene && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() =>
                    setGreskaPromene('')
                  }
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

              <div className="employee-detail-section">
                <h6 className="employee-detail-title">
                  Osnovni podaci
                </h6>

                <Row className="g-3">
                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Ime i prezime</span>
                      <strong>
                        {izabraniRadnik.ime}{' '}
                        {izabraniRadnik.prezime}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Korisničko ime</span>
                      <strong>
                        {izabraniRadnik.kor_ime}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Mejl</span>
                      <strong>
                        {izabraniRadnik.mejl || '—'}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Telefon</span>
                      <strong>
                        {izabraniRadnik.telefon || '—'}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Adresa</span>
                      <strong>
                        {izabraniRadnik.adresa || '—'}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Status</span>

                      <div>
                        <Badge
                        className="text-white"
                          bg={
                            izabraniRadnik.aktivan
                              ? 'success'
                              : 'secondary'
                          }
                        >
                          {izabraniRadnik.aktivan
                            ? 'Aktivan'
                            : 'Neaktivan'}
                        </Badge>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Datum rođenja</span>
                      <strong>
                        {formatirajDatum(
                          izabraniRadnik.datum_rodjenja,
                        )}
                      </strong>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Datum zaposlenja</span>
                      <strong>
                        {formatirajDatum(
                          izabraniRadnik.datum_zaposlenja,
                        )}
                      </strong>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="employee-detail-section mt-4">
                <h6 className="employee-detail-title">
                  Organizacija
                </h6>

                <Row className="g-3">
                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Trenutna uloga</span>

                      <div>
                        <Badge
                        className="text-white"
                          bg={
                            izabraniRadnik.uloga ===
                            'ADMIN'
                              ? 'danger'
                              : izabraniRadnik.uloga ===
                                  'MENADZER'
                                ? 'primary'
                                : 'secondary'
                          }
                        >
                          {nazivUloge(
                            izabraniRadnik.uloga,
                          )}
                        </Badge>
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="employee-detail-item">
                      <span>Timovi</span>
                      <strong>
                        {imenaTimova(
                          izabraniRadnik,
                        )}
                      </strong>
                    </div>
                  </Col>
                </Row>
              </div>

              {!jeSopstveniNalog && (
                <div className="employee-role-box mt-4">
                  <Form.Label className="fw-semibold">
                    Promena uloge
                  </Form.Label>

                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <Form.Select
                      value={novaUloga}
                      disabled={menjaSeUloga}
                      onChange={(e) => {
                        setNovaUloga(e.target.value)
                        setGreskaPromene('')
                        setUspeh('')
                      }}
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
                      variant="primary"
                      disabled={
                        menjaSeUloga ||
                        novaUloga ===
                          izabraniRadnik.uloga
                      }
                      onClick={sacuvajUlogu}
                    >
                      {menjaSeUloga
                        ? 'Čuvanje...'
                        : 'Sačuvaj ulogu'}
                    </Button>
                  </div>
                </div>
              )}

              {jeSopstveniNalog && (
                <Alert variant="light" className="mt-4 mb-0">
                  Ne možete promeniti sopstvenu ulogu.
                </Alert>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={zatvoriDetalje}
                disabled={menjaSeUloga}
              >
                Zatvori
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}

export default ListaZaposlenih