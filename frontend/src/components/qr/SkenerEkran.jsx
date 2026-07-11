import { useRef, useState } from 'react'
import { Alert, Badge, Button, Card, Spinner } from 'react-bootstrap'
import { QrReader } from 'react-qr-reader'
import { posaljiSkeniranje } from '../../api/qrApi'
import { porukaGreske } from '../../api/greske'

// Skener za check-in/check-out. Tip zapisa (check-in ili check-out) odlučuje isključivo
// server (naizmenično po zaposlenom) — frontend ga ne predviđa, samo prikazuje rezultat.
function SkenerEkran() {
  const [status, setStatus] = useState(null)
  const [uToku, setUToku] = useState(false)
  const [kameraDostupna, setKameraDostupna] = useState(true)

  // Ref-ovi (ne state) da bi provere unutar onResult bile sinhrone i da ne izazivaju re-render.
  const uTokuRef = useRef(false)
  const poslednjiKodRef = useRef(null)

  const posaljiKod = async (kod) => {
    uTokuRef.current = true
    poslednjiKodRef.current = kod
    setUToku(true)

    try {
      const rezultat = await posaljiSkeniranje(kod)
      const poruka =
        rezultat.tip === 'CHECK_IN' ? 'Uspešno prijavljen(a) na posao.' : 'Uspešno odjavljen(a) sa posla.'
      setStatus({ vrsta: 'uspeh', poruka })
    } catch (error) {
      const mrezniProblem = !error?.response

      if (mrezniProblem) {
        setStatus({
          vrsta: 'mreza',
          poruka: porukaGreske(error, 'Greška u mreži. Proverite konekciju i pokušajte ponovo.'),
          kod,
        })
        // Ništa nije zabeleženo na serveru — dozvoli da se isti kod ponovo pošalje.
        poslednjiKodRef.current = null
      } else if (porukaGreske(error).toLowerCase().includes('istek')) {
        setStatus({ vrsta: 'istekao', poruka: porukaGreske(error, 'QR kod je istekao, skenirajte ponovo.') })
      } else {
        setStatus({ vrsta: 'nevazeci', poruka: porukaGreske(error, 'Nevažeći QR kod.') })
      }
    } finally {
      uTokuRef.current = false
      setUToku(false)
    }
  }

  const handleResult = (result, error) => {
    if (result) {
      const kod = result.getText()
      if (uTokuRef.current || kod === poslednjiKodRef.current) return
      posaljiKod(kod)
    }
    if (error && error?.name && error.name !== 'NotFoundException') {
      setKameraDostupna(false)
      setStatus({ vrsta: 'greska', poruka: 'Kamera nije dostupna. Proverite dozvole pristupa.' })
    }
  }

  const varijantaZaVrstu = {
    uspeh: 'success',
    istekao: 'warning',
    nevazeci: 'danger',
    mreza: 'danger',
    greska: 'danger',
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Check-in / Check-out</Card.Title>
        <Card.Text className="text-muted">
          Skenirajte QR kod prikazan na terminalu kamerom telefona.
        </Card.Text>

        {kameraDostupna ? (
          <div className="skener-video-wrap mb-3">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={handleResult}
              scanDelay={500}
              containerStyle={{ width: '100%' }}
            />
          </div>
        ) : (
          <Alert variant="warning">Kamera je isključena ili nedostupna u ovom pregledaču.</Alert>
        )}

        {uToku && (
          <div className="mb-3 d-flex align-items-center gap-2">
            <Spinner size="sm" animation="border" />
            <span>Šalje se...</span>
          </div>
        )}

        {status && (
          <Alert variant={varijantaZaVrstu[status.vrsta] ?? 'danger'} className="mb-3">
            {status.poruka}
            {status.vrsta === 'mreza' && (
              <div className="mt-2">
                <Button variant="outline-danger" size="sm" onClick={() => posaljiKod(status.kod)}>
                  Pokušaj ponovo
                </Button>
              </div>
            )}
          </Alert>
        )}

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button
            variant="outline-secondary"
            size="sm"
            type="button"
            disabled={uToku}
            onClick={() => posaljiKod(`DUMMY-${Date.now()}`)}
          >
            Testiraj nevažeći kod
          </Button>
          <Badge bg="secondary">Tip zapisa određuje server</Badge>
        </div>
      </Card.Body>
    </Card>
  )
}

export default SkenerEkran
