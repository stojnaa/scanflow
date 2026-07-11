import { Button, Card } from 'react-bootstrap'
import { obavestenja } from '../../data/organizationDummyData'

function OglasnaTabla({ prikaziAkcije = false }) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <Card.Title>Oglasna tabla</Card.Title>
        <Card.Text className="text-muted">
          Pregled aktivnih obaveštenja za zaposlene.
        </Card.Text>

        {obavestenja.map((obavestenje) => (
          <Card key={obavestenje.id} className="mb-3 border-light">
            <Card.Body>
              <div className="d-flex justify-content-between gap-3">
                <h5 className="mb-1">{obavestenje.naslov}</h5>
                <small className="text-muted">{obavestenje.datum}</small>
              </div>

              <p className="mb-1">{obavestenje.tekst}</p>
              <small className="text-muted">Autor: {obavestenje.autor}</small>

              {prikaziAkcije && (
                <div className="mt-2">
                  <Button size="sm" variant="outline-danger" type="button">
                    Obriši
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  )
}

export default OglasnaTabla