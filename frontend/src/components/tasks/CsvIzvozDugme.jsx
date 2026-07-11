import { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { izvezi_csv } from '../../api/zadaciApi'

function CsvIzvozDugme() {
  const { uloga } = useAuth()
  const [preuzimanje, setPreuzimanje] = useState(false)

  if (uloga !== 'ADMIN') return null

  async function preuzmi() {
    setPreuzimanje(true)
    try {
      const response = await izvezi_csv()
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'statistika_radni_sati.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      // tiho - greška pri preuzimanju ne treba da sruši dashboard
    } finally {
      setPreuzimanje(false)
    }
  }

  return (
    <Button variant="outline-secondary" size="sm" type="button" onClick={preuzmi} disabled={preuzimanje}>
      {preuzimanje ? <Spinner size="sm" animation="border" /> : 'Izvezi CSV'}
    </Button>
  )
}

export default CsvIzvozDugme
