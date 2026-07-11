import { useState } from 'react'
import { Alert, Badge, Button, Card } from 'react-bootstrap'
import { QrReader } from 'react-qr-reader'

// Skener za check-in/check-out. Tip zapisa (check-in ili check-out) je za
// sada određen lokalno naizmeničnim prebacivanjem — pravo slanje skeniranog
// koda na POST /evidencija/skeniraj/ i odgovor servera dolaze u Week 4.
function SkenerEkran() {
  const [sledeciTip, setSledeciTip] = useState('CHECK_IN')
  const [status, setStatus] = useState(null)
  const [kameraDostupna, setKameraDostupna] = useState(true)

  const obradiSkeniranje = (kod) => {
    const tip = sledeciTip
    setSledeciTip(tip === 'CHECK_IN' ? 'CHECK_OUT' : 'CHECK_IN')
    setStatus({
      vrsta: 'uspeh',
      poruka: `${tip === 'CHECK_IN' ? 'Check-in' : 'Check-out'} uspešan (kod: ${kod}).`,
    })
  }

  const handleResult = (result, error) => {
    if (result) {
      obradiSkeniranje(result.getText())
    }
    if (error && error?.name && error.name !== 'NotFoundException') {
      setKameraDostupna(false)
      setStatus({ vrsta: 'greska', poruka: 'Kamera nije dostupna. Proverite dozvole pristupa.' })
    }
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
              containerStyle={{ width: '100%' }}
            />
          </div>
        ) : (
          <Alert variant="warning">Kamera je isključena ili nedostupna u ovom pregledaču.</Alert>
        )}

        {status && (
          <Alert variant={status.vrsta === 'uspeh' ? 'success' : 'danger'} className="mb-3">
            {status.poruka}
          </Alert>
        )}

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button
            variant="outline-secondary"
            size="sm"
            type="button"
            onClick={() => obradiSkeniranje(`DUMMY-${Date.now()}`)}
          >
            Simuliraj skeniranje
          </Button>
          <Badge bg={sledeciTip === 'CHECK_IN' ? 'secondary' : 'primary'}>
            Sledeće skeniranje: {sledeciTip === 'CHECK_IN' ? 'Check-in' : 'Check-out'}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  )
}

export default SkenerEkran
