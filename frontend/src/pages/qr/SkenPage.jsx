import { Container } from 'react-bootstrap'
import SkenerEkran from '../../components/qr/SkenerEkran'

function SkenPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Skeniranje evidencije</h1>
        <p>Check-in i check-out skeniranjem QR koda sa terminala.</p>
      </div>

      <SkenerEkran />
    </Container>
  )
}

export default SkenPage
