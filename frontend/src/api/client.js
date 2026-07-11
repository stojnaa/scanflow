import axios from 'axios'

// Centralna Axios instanca koju koriste svi domeni (Task 1 "kablovi").
// Bazni URL se može promeniti preko VITE_API_URL, u suprotnom gađa lokalni Django.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const TOKEN_KLJUC = 'scanflow_token'

// Događaj koji AuthContext sluša kako bi izbacio korisnika kada token istekne/nije važeći.
export const ODJAVA_EVENT = 'scanflow:odjava'

export function procitajToken() {
  return localStorage.getItem(TOKEN_KLJUC)
}

export function sacuvajToken(token) {
  localStorage.setItem(TOKEN_KLJUC, token)
}

export function obrisiToken() {
  localStorage.removeItem(TOKEN_KLJUC)
}

const client = axios.create({
  baseURL: API_URL,
})

// Uz svaki zahtev automatski dodaj Authorization header ako token postoji.
client.interceptors.request.use((config) => {
  const token = procitajToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Kada backend vrati 401 (istekao ili nevažeći token), počisti token i javi aplikaciji
// da izbaci korisnika (ProtectedRoute će ga preusmeriti na /login).
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      obrisiToken()
      window.dispatchEvent(new Event(ODJAVA_EVENT))
    }
    return Promise.reject(error)
  },
)

export default client
