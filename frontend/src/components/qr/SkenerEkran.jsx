import { useEffect, useRef, useState } from 'react'
import { Alert, Badge, Button, Card } from 'react-bootstrap'
import { Html5Qrcode } from 'html5-qrcode'
import { skenirajQrKod } from '../../api/evidencijaApi'
import { porukaGreske } from '../../api/greske'

const QR_READER_ID = 'scanflow-qr-reader'

function SkenerEkran() {
  const [status, setStatus] = useState(null)
  const [slanje, setSlanje] = useState(false)
  const [kameraPokrenuta, setKameraPokrenuta] = useState(false)
  const poslednjiKodRef = useRef(null)
  const qrRef = useRef(null)

  async function posaljiKod(kod) {
    if (!kod || slanje || poslednjiKodRef.current === kod) return

    poslednjiKodRef.current = kod
    setSlanje(true)
    setStatus(null)

    try {
      const rezultat = await skenirajQrKod(kod)

      setStatus({
        vrsta: 'success',
        poruka: `Uspešno evidentirano: ${rezultat.tip}`,
      })
    } catch (error) {
      setStatus({
        vrsta: 'danger',
        poruka: porukaGreske(error, 'Skeniranje nije uspelo.'),
      })

      poslednjiKodRef.current = null
    } finally {
      setSlanje(false)
    }
  }

  useEffect(() => {
    let aktivno = true

    async function pokreniKameru() {
      try {
        const kamere = await Html5Qrcode.getCameras()

        if (!aktivno) return

        if (!kamere || kamere.length === 0) {
          setStatus({
            vrsta: 'danger',
            poruka: 'Kamera nije pronađena. Proveri da li browser ima dozvolu za kameru.',
          })
          return
        }

        const zadnjaKamera =
          kamere.find((kamera) =>
            kamera.label.toLowerCase().includes('back') ||
            kamera.label.toLowerCase().includes('rear') ||
            kamera.label.toLowerCase().includes('environment')
          ) || kamere[0]

        const qr = new Html5Qrcode(QR_READER_ID)
        qrRef.current = qr

        await qr.start(
          { deviceId: { exact: zadnjaKamera.id } },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
          },
          (decodedText) => {
            posaljiKod(decodedText)
          },
          () => {}
        )

        if (aktivno) {
          setKameraPokrenuta(true)
        }
      } catch (error) {
        console.error('Greška pri pokretanju kamere:', error)

        if (aktivno) {
          setStatus({
            vrsta: 'danger',
            poruka:
              'Kamera nije pokrenuta. Dozvoli kameru u browseru i proveri da je ne koristi neka druga aplikacija.',
          })
        }
      }
    }

    pokreniKameru()

    return () => {
      aktivno = false

      if (qrRef.current) {
        qrRef.current
          .stop()
          .then(() => qrRef.current.clear())
          .catch(() => {})
      }
    }
  }, [])

  function testirajNevazeciKod() {
    posaljiKod('NEVAZECI_TEST_KOD')
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Check-in / Check-out</Card.Title>
        <Card.Text className="text-muted">
          Skenirajte QR kod prikazan na terminalu kamerom telefona.
        </Card.Text>

        {status && <Alert variant={status.vrsta}>{status.poruka}</Alert>}

        {!kameraPokrenuta && !status && (
          <Alert variant="info">
            Pokretanje kamere... Ako browser pita za dozvolu, klikni Allow / Dozvoli.
          </Alert>
        )}

        <div id={QR_READER_ID} className="qr-reader-wrapper"></div>

        <div className="mt-3 d-flex gap-2 align-items-center hidden-test-controls" >
          <Button
            variant="outline-secondary"
            type="button"
            onClick={testirajNevazeciKod}
            disabled={slanje}
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