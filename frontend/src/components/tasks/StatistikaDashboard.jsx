import { Card } from 'react-bootstrap'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { satiPoDanu, zadaciPoNedelji } from '../../data/tasksDummyData'
import CsvIzvozDugme from './CsvIzvozDugme'

function StatistikaDashboard() {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title>Statistički dashboard</Card.Title>
            <Card.Text className="text-muted mb-0">
              Radni sati po danu i broj završenih zadataka po nedelji.
            </Card.Text>
          </div>
          <CsvIzvozDugme />
        </div>

        <h6>Radni sati po danu</h6>
        <div className="chart-wrap mb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={satiPoDanu}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dan" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sati" name="Sati" fill="#0d6efd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h6>Završeni zadaci po nedelji</h6>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={zadaciPoNedelji}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nedelja" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="zavrseno"
                name="Završeno"
                stroke="#198754"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}

export default StatistikaDashboard
