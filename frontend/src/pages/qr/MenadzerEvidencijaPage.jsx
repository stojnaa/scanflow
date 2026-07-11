import { Container } from 'react-bootstrap'
import PrisutniNaPoslu from '../../components/qr/PrisutniNaPoslu'

function MenadzerEvidencijaPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Menadžer — Evidencija</h1>
        <p>Pregled zaposlenih koji su trenutno na poslu.</p>
      </div>

      <PrisutniNaPoslu />
    </Container>
  )
}

export default MenadzerEvidencijaPage
