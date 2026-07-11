import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Card } from 'react-bootstrap'
import { QRCodeSVG } from 'qrcode.react'
import { dohvatiQrKod } from '../../api/qrApi'
import { porukaGreske } from '../../api/greske'

const RETRY_MS = 5000

// Prikaz QR koda koji rotira na interval određen serverom (GET /terminali/:id/qr-kod/).
// Dokle god je poslednji dobijeni token još važeći, server vraća isti token na ponovljen
// poziv — zato sledeći poziv zakazujemo tačno na trenutak isteka (vreme_isteka), a ne na
// pretpostavljeni fiksni interval, pa se osvežavanje ne desinhronizuje sa serverom.
function TerminalEkran({ terminalId, nazivTerminala, lokacijaTerminala }) {
  const [token, setToken] = useState(null)
  const [vremeIsteka, setVremeIsteka] = useState(null)
  const [vremePocetka, setVremePocetka] = useState(null)
  const [greska, setGreska] = useState(null)
  const [preostaloSekundi, setPreostaloSekundi] = useState(0)

  const zakazanoRef = useRef(null)
  const otkazanoRef = useRef(false)

  useEffect(() => {
    otkazanoRef.current = false

    async function ucitajKod() {
      try {
        const podaci = await dohvatiQrKod(terminalId)
        if (otkazanoRef.current) return

        setGreska(null)
        setToken(podaci.token)
        setVremePocetka(Date.now())
        setVremeIsteka(new Date(podaci.vreme_isteka).getTime())

        const preostalo = new Date(podaci.vreme_isteka).getTime() - Date.now()
        zakazanoRef.current = setTimeout(ucitajKod, Math.max(preostalo, 0) + 250)
      } catch (error) {
        if (otkazanoRef.current) return

        setToken(null)
        setGreska(porukaGreske(error, 'Terminal trenutno nije dostupan.'))
        zakazanoRef.current = setTimeout(ucitajKod, RETRY_MS)
      }
    }

    ucitajKod()

    return () => {
      otkazanoRef.current = true
      clearTimeout(zakazanoRef.current)
    }
  }, [terminalId])

  // Kozmetičko odbrojavanje — bez mrežnih poziva, samo re-renderuje prikaz preostalog vremena.
  // Date.now() se poziva isključivo unutar tajmer-callback-ova (ne sinhrono u telu efekta
  // niti tokom render-a), da bi izračunavanje ostalo van "čistog" render puta.
  useEffect(() => {
    if (!vremeIsteka) return undefined

    const azuriraj = () => setPreostaloSekundi(Math.max(0, Math.round((vremeIsteka - Date.now()) / 1000)))

    const inicijalno = setTimeout(azuriraj, 0)
    const interval = setInterval(azuriraj, 1000)

    return () => {
      clearTimeout(inicijalno)
      clearInterval(interval)
    }
  }, [vremeIsteka])

  const punoTrajanjeSekundi =
    vremeIsteka && vremePocetka ? Math.max(1, Math.round((vremeIsteka - vremePocetka) / 1000)) : 1

  return (
    <Card className="terminal-card shadow">
      <Card.Body className="text-center">
        <div className="terminal-naziv">{nazivTerminala}</div>
        {lokacijaTerminala && <div className="terminal-lokacija mb-4">{lokacijaTerminala}</div>}

        {greska && (
          <Alert variant="danger" className="mb-3">
            {greska}
          </Alert>
        )}

        {token && (
          <>
            <div className="terminal-qr-wrap">
              <QRCodeSVG value={token} size={220} />
            </div>

            <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
              <Badge bg="success">Aktivan kod</Badge>
              <span className="terminal-osvezavanje">osvežava se za {preostaloSekundi}s</span>
            </div>

            <div className="terminal-progress mt-2">
              <div
                className="terminal-progress-bar"
                style={{ width: `${(preostaloSekundi / punoTrajanjeSekundi) * 100}%` }}
              />
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default TerminalEkran
