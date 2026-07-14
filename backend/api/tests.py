from datetime import date

from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Zaposleni

class ZaposleniModelTest(APITestCase):
    """Osnovni testovi modela Zaposleni."""

    def test_kreiranje_zaposlenog(self):
        zaposleni = Zaposleni.objects.create(
            ime='Marko',
            prezime='Markovic',
            datum_rodjenja=date(1995, 5, 20),
            datum_zaposlenja=date(2020, 1, 10),
            telefon='0601234567',
            adresa='Neka adresa 1',
            kor_ime='mmarkovic',
            mejl='marko@example.com',
            sifra_hash=make_password('sifra1234'),
        )

        self.assertEqual(Zaposleni.objects.count(), 1)
        self.assertEqual(str(zaposleni), 'Marko Markovic')
        self.assertEqual(
            zaposleni.uloga,
            Zaposleni.Uloga.RADNIK,
        )
        self.assertTrue(zaposleni.aktivan)

    def test_podrazumevana_uloga_je_radnik(self):
        zaposleni = Zaposleni.objects.create(
            ime='Jovan',
            prezime='Jovanovic',
            datum_rodjenja=date(1997, 4, 10),
            datum_zaposlenja=date(2021, 2, 15),
            telefon='0631234567',
            adresa='Test adresa',
            kor_ime='jjovanovic',
            mejl='jovan@example.com',
            sifra_hash=make_password('sifra1234'),
        )

        self.assertEqual(
            zaposleni.uloga,
            Zaposleni.Uloga.RADNIK,
        )

    def test_zaposleni_je_podrazumevano_aktivan(self):
        zaposleni = Zaposleni.objects.create(
            ime='Milica',
            prezime='Milic',
            datum_rodjenja=date(1999, 7, 12),
            datum_zaposlenja=date(2023, 3, 1),
            telefon='0641234567',
            adresa='Test adresa',
            kor_ime='mmilic',
            mejl='milica@example.com',
            sifra_hash=make_password('sifra1234'),
        )

        self.assertTrue(zaposleni.aktivan)


    """Testovi pristupa profilu bez tokena."""

    def test_profil_bez_tokena(self):
        response = self.client.get('/api/profil/')

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_izmena_profila_bez_tokena(self):
        response = self.client.patch(
            '/api/profil/',
            {
                'ime': 'Novo ime',
            },
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

class RegistracijaTest(APITestCase):
    """Jednostavni testovi registracije."""

    def validni_podaci(self):
        return {
            'ime': 'Ana',
            'prezime': 'Anic',
            'datum_rodjenja': '1998-03-15',
            'datum_zaposlenja': '2022-06-01',
            'telefon': '0611234567',
            'adresa': 'Neka adresa 2',
            'kor_ime': 'aanic',
            'mejl': 'ana@example.com',
            'sifra': 'sifra1234',
        }

    def test_uspesna_registracija(self):
        response = self.client.post(
            '/api/auth/registracija/',
            self.validni_podaci(),
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertIn('token', response.data)
        self.assertEqual(Zaposleni.objects.count(), 1)

    def test_registracija_bez_imena(self):
        podaci = self.validni_podaci()
        podaci['ime'] = ''

        response = self.client.post(
            '/api/auth/registracija/',
            podaci,
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(Zaposleni.objects.count(), 0)

    def test_registracija_bez_lozinke(self):
        podaci = self.validni_podaci()
        podaci['sifra'] = ''

        response = self.client.post(
            '/api/auth/registracija/',
            podaci,
            format='json',
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_duplikat_korisnickog_imena(self):
        prvi_response = self.client.post(
            '/api/auth/registracija/',
            self.validni_podaci(),
            format='json',
        )

        drugi_podaci = self.validni_podaci()
        drugi_podaci['mejl'] = 'drugi@example.com'

        drugi_response = self.client.post(
            '/api/auth/registracija/',
            drugi_podaci,
            format='json',
        )

        self.assertEqual(
            prvi_response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            drugi_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(Zaposleni.objects.count(), 1)

    def test_duplikat_mejla(self):
        prvi_response = self.client.post(
            '/api/auth/registracija/',
            self.validni_podaci(),
            format='json',
        )

        drugi_podaci = self.validni_podaci()
        drugi_podaci['kor_ime'] = 'drugi.korisnik'

        drugi_response = self.client.post(
            '/api/auth/registracija/',
            drugi_podaci,
            format='json',
        )

        self.assertEqual(
            prvi_response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            drugi_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(Zaposleni.objects.count(), 1)