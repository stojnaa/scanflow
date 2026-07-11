import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import TerminalEkran from '../../components/qr/TerminalEkran'
import { terminal } from '../../data/qrDummyData'

// Javna kiosk stranica — prikazuje se na terminalu na ulazu, bez potrebe za prijavom.
function TerminalPage() {
  const { id } = useParams()

  return (
    <Container fluid className="terminal-page">
      <TerminalEkran
        nazivTerminala={`${terminal.naziv} (terminal #${id})`}
        lokacijaTerminala={terminal.lokacija}
      />
    </Container>
  )
}

export default TerminalPage
