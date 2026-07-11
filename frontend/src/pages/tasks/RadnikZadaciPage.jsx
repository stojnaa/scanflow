import { Container } from 'react-bootstrap'
import ListaZadataka from '../../components/tasks/ListaZadataka'

function RadnikZadaciPage() {
  return (
    <Container>
      <div className="page-header">
        <h1>Radnik — Zadaci</h1>
        <p>Pregled dodeljenih zadataka i promena statusa.</p>
      </div>

      <ListaZadataka />
    </Container>
  )
}

export default RadnikZadaciPage
