import { useParams } from 'react-router-dom'
import { Alert, Container } from 'react-bootstrap'
import TerminalEkran from '../../components/qr/TerminalEkran'

// Javna kiosk stranica — prikazuje se na terminalu na ulazu, bez potrebe za prijavom.
function TerminalPage() {
  const { id } = useParams()

  // Backend ruta koristi <int:terminal_id> — nevalidan id nikad ne pogađa Django rutu
  // i vraća sirov HTML 404, zato ga proveravamo pre bilo kakvog mrežnog poziva.
  if (!/^\d+$/.test(id ?? '')) {
    return (
      <Container fluid className="terminal-page">
        <Alert variant="danger">Terminal ne postoji.</Alert>
      </Container>
    )
  }

  return (
    <Container fluid className="terminal-page">
      <TerminalEkran terminalId={id} nazivTerminala={`Terminal #${id}`} />
    </Container>
  )
}

export default TerminalPage
