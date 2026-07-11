import { Navigate, Outlet } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

// Omotač za zaštićene rute. Za razliku od Week 3 skeleta, sada stvarno proverava
// da li je korisnik prijavljen (važeći token učitan u AuthContext) i, opciono, da li
// ima odgovarajuću ulogu. Neprijavljene preusmerava na /login.
//
// Upotreba:
//   <Route element={<ProtectedRoute />}> ... </Route>
//   <Route element={<ProtectedRoute uloge={['ADMIN', 'MENADZER']} />}> ... </Route>
function ProtectedRoute({ uloge }) {
  const { prijavljen, uloga, ucitavanje } = useAuth()

  // Dok proveravamo postojeći token, ne donosi odluku o preusmeravanju.
  if (ucitavanje) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" />
      </Container>
    )
  }

  if (!prijavljen) {
    return <Navigate to="/login" replace />
  }

  // Prijavljen je, ali nema potrebnu ulogu za ovu rutu.
  if (uloge && !uloge.includes(uloga)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
