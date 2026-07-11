import { useEffect, useState } from 'react'
import { Alert, Card, Spinner } from 'react-bootstrap'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dohvatiStatistikuRadnihSati, dohvatiSveZadatke } from '../../api/zadaciApi'
import { porukaGreske } from '../../api/greske'
import CsvIzvozDugme from './CsvIzvozDugme'

const BOJE_STATUSA = {
  TO_DO: '#ffc107',
  IN_PROGRESS: '#0d6efd',
  DONE: '#198754',
}

const LABELE_STATUSA = {
  TO_DO: 'Na čekanju',
  IN_PROGRESS: 'U radu',
  DONE: 'Završeno',
}

function StatistikaDashboard() {
  const [satiPodaci, setSatiPodaci] = useState([])
  const [zadaciPodaci, setZadaciPodaci] = useState([])
  const [ucitavanje, setUcitavanje] = useState(true)
  const [greska, setGreska] = useState(null)

  useEffect(() => {
    async function ucitaj() {
      try {
        const [statistika, sviZadaci] = await Promise.all([
          dohvatiStatistikuRadnihSati(),
          dohvatiSveZadatke(),
        ])

        const sati = statistika.map((stavka) => ({
          ime: `${stavka.zaposleni.ime} ${stavka.zaposleni.prezime[0]}.`,
          sati: stavka.radni_sati,
        }))
        setSatiPodaci(sati)

        const broji = { TO_DO: 0, IN_PROGRESS: 0, DONE: 0 }
        sviZadaci.forEach((z) => {
          if (broji[z.status] !== undefined) broji[z.status]++
        })
        const zadaciChart = Object.entries(broji).map(([status, broj]) => ({
          status: LABELE_STATUSA[status],
          broj,
          boja: BOJE_STATUSA[status],
        }))
        setZadaciPodaci(zadaciChart)
      } catch (e) {
        setGreska(porukaGreske(e))
      } finally {
        setUcitavanje(false)
      }
    }
    ucitaj()
  }, [])

  if (ucitavanje) return <Spinner animation="border" className="d-block mx-auto mt-4" />
  if (greska) return <Alert variant="danger">{greska}</Alert>

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title>Statistički dashboard</Card.Title>
            <Card.Text className="text-muted mb-0">
              Radni sati po zaposlenom i raspodela zadataka po statusu.
            </Card.Text>
          </div>
          <CsvIzvozDugme />
        </div>

        <h6>Radni sati po zaposlenom</h6>
        <div className="chart-wrap mb-4">
          {satiPodaci.length === 0 ? (
            <p className="text-muted">Nema podataka o radnim satima.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={satiPodaci}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ime" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v} h`, 'Radni sati']} />
                <Bar dataKey="sati" name="Sati" fill="#0d6efd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <h6>Zadaci po statusu</h6>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={zadaciPodaci} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="status" width={90} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v, 'Zadaci']} />
              <Bar dataKey="broj" name="Zadaci" radius={[0, 4, 4, 0]}>
                {zadaciPodaci.map((stavka, idx) => (
                  <Cell key={idx} fill={stavka.boja} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}

export default StatistikaDashboard
