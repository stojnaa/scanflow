import { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { izvezi_csv } from '../../api/zadaciApi'

function CsvIzvozDugme() {
  const { uloga } = useAuth()
  const [preuzimanje, setPreuzimanje] = useState(false)

  const mozeDaIzveze = uloga === 'MENADZER' || uloga === 'ADMIN'

  if (!mozeDaIzveze) return null

  async function preuzmi() {
    setPreuzimanje(true)

    try {
      const response = await izvezi_csv()
      const url = URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      )

      const link = document.createElement('a')
      link.href = url
      link.download = 'statistika_radni_sati.csv'

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Greška pri izvozu CSV fajla:', error)
      alert('Eksportovanje CSV fajla nije uspelo.')
    } finally {
      setPreuzimanje(false)
    }
  }

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      type="button"
      onClick={preuzmi}
      disabled={preuzimanje}
    >
      {preuzimanje ? (
        <>
          <Spinner size="sm" animation="border" /> Preuzimanje...
        </>
      ) : (
        'Izvezi CSV'
      )}
    </Button>
  )
}

export default CsvIzvozDugme