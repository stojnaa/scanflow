import { Outlet } from 'react-router-dom'

// Skelet omotača za zaštićene rute.
// Za sada samo propušta sadržaj — prava provera tokena (JWT), čitanje sesije
// i preusmeravanje neprijavljenih korisnika na /login dolaze u Week 4.
//
// Primer buduće logike (Week 4):
//   const prijavljen = Boolean(localStorage.getItem('token'))
//   if (!prijavljen) return <Navigate to="/login" replace />
function ProtectedRoute() {
  return <Outlet />
}

export default ProtectedRoute
