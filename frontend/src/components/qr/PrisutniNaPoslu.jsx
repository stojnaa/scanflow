import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Card, Spinner, Table } from 'react-bootstrap'
import { dohvatiPrisutne } from '../../api/qrApi'
import { porukaGreske } from '../../api/greske'

const OSVEZAVANJE_MS = 60000

function formatirajTrajanje(vremeDolaskaISO) {
  const minuti = Math.max(0, Math.floor((Date.now() - new Date(vremeDolaskaISO).getTime()) / 60000))
  const sati = Math.floor(minuti / 60)
  return sati > 0 ? `${sati}h ${minuti % 60}min` : `${minuti}min`
}

function formatirajVremeDolaska(vremeDolaskaISO) {
  return new Date(vremeDolaskaISO).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })
}

function PrisutniNaPoslu() {
  const [lista, setLista] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  const otkazanoRef = useRef(false)

  useEffect(() => {
    otkazanoRef.current = false

    async function ucitaj() {
      try {
        const podaci = await dohvatiPrisutne()
        if (otkazanoRef.current) return
        setLista(podaci)
        setGreska(null)
      } catch (error) {
        if (otkazanoRef.current) return
        setGreska(porukaGreske(error, 'Nije moguće učitati listu zaposlenih na poslu.'))
      } finally {
        if (!otkazanoRef.current) setUcitavanje(false)
      }
    }

    ucitaj()
    const interval = setInterval(ucitaj, OSVEZAVANJE_MS)

    return () => {
      otkazanoRef.current = true
      clearInterval(interval)
    }
  }, [])

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Trenutno na poslu</Card.Title>
        <Card.Text className="text-muted">
          Zaposleni čiji je poslednji zapis u evidenciji check-in.
        </Card.Text>

        {ucitavanje && (
          <div className="d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" />
            <span>Učitavanje...</span>
          </div>
        )}

        {!ucitavanje && greska && <Alert variant="danger">{greska}</Alert>}

        {!ucitavanje && !greska && lista.length === 0 && (
          <Alert variant="info">Trenutno nema zaposlenih na poslu.</Alert>
        )}

        {!ucitavanje && !greska && lista.length > 0 && (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Zaposleni</th>
                <th>Vreme dolaska</th>
                <th>Vreme na poslu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((zapis) => (
                <tr key={zapis.zaposleni.zaposleni_id}>
                  <td>
                    {zapis.zaposleni.ime} {zapis.zaposleni.prezime}
                  </td>
                  <td>{formatirajVremeDolaska(zapis.vreme_dolaska)}</td>
                  <td>{formatirajTrajanje(zapis.vreme_dolaska)}</td>
                  <td>
                    <Badge bg="success">Na poslu</Badge>
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

export default PrisutniNaPoslu
