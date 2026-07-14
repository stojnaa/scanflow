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
