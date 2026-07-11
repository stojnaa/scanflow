import { useEffect, useState } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { QRCodeSVG } from 'qrcode.react'
import { terminal, trajanjeKodaSekunde } from '../../data/qrDummyData'

function generisiDummyToken() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

// Prikaz QR koda koji rotira na fiksni interval. Za sada je vrednost koda
// generisana lokalno (dummy) — pravo povlačenje aktivnog tokena sa
// GET /terminali/:id/qr-kod/ dolazi u Week 4.
function TerminalEkran({ nazivTerminala, lokacijaTerminala }) {
  const [token, setToken] = useState(generisiDummyToken)
  const [preostaloSekundi, setPreostaloSekundi] = useState(trajanjeKodaSekunde)

  useEffect(() => {
    const interval = setInterval(() => {
      setPreostaloSekundi((preostalo) => {
        if (preostalo <= 1) {
          setToken(generisiDummyToken())
          return trajanjeKodaSekunde
        }
        return preostalo - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="terminal-card shadow">
      <Card.Body className="text-center">
        <div className="terminal-naziv">{nazivTerminala ?? terminal.naziv}</div>
        <div className="terminal-lokacija mb-4">{lokacijaTerminala ?? terminal.lokacija}</div>

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
            style={{ width: `${(preostaloSekundi / trajanjeKodaSekunde) * 100}%` }}
          />
        </div>
      </Card.Body>
    </Card>
  )
}

export default TerminalEkran
