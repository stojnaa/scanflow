"""
Selenium testovi za celinu "Registracija i prijava".

Preduslovi pre pokretanja:
- Backend (python manage.py runserver) mora raditi na http://localhost:8000
- Frontend (npm run dev) mora raditi na http://localhost:5173
- Baza "scanflow" mora sadrzati seed podatke (ana.radnik / lozinka123, itd.)
"""

import pytest
from selenium.webdriver.support.ui import WebDriverWait

from conftest import obrisi_zaposlenog
from pages import LoginPage, RegistracijaPage


def procitaj_token(driver):
    return driver.execute_script("return window.localStorage.getItem('scanflow_token')")


# a) Neuspesna prijava sa pogresnom lozinkom
def test_1a_neuspesna_prijava_pogresna_lozinka(driver):
    login = LoginPage(driver).otvori()
    login.popuni("ana.radnik", "lozinka12345")
    login.posalji()

    poruka = login.procitaj_gresku()

    assert "Pogrešno korisničko ime/email ili lozinka." in poruka
    assert "/login" in driver.current_url
    assert procitaj_token(driver) is None


# b) Uspesna prijava
def test_1b_uspesna_prijava(driver):
    login = LoginPage(driver).otvori()
    login.popuni("ana.radnik", "lozinka123")
    login.posalji()

    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)

    assert "/radnik/organizacija" in driver.current_url
    assert procitaj_token(driver) is not None


# v) Uspesna registracija
@pytest.fixture
def ocisti_test_korisnika_luka():
    obrisi_zaposlenog(kor_ime="luka474", mejl="luka@gmail.com")
    yield
    obrisi_zaposlenog(kor_ime="luka474", mejl="luka@gmail.com")


def test_1v_uspesna_registracija(driver, ocisti_test_korisnika_luka):
    registracija = RegistracijaPage(driver).otvori()
    registracija.popuni(
        ime="Luka",
        prezime="Bogavac",
        datum_rodjenja_ddmmyyyy="01.01.2004.",
        datum_zaposlenja_ddmmyyyy="01.01.2021.",
        kor_ime="luka474",
        mejl="luka@gmail.com",
        adresa="Vojislava Ilica 57",
        sifra="luka2004",
        telefon="+381 63 378 2000",
    )
    registracija.posalji()

    WebDriverWait(driver, 10).until(lambda d: "/registracija" not in d.current_url)

    assert "/radnik/organizacija" in driver.current_url
    assert procitaj_token(driver) is not None


# g) Neuspesna registracija, mejl adresa nije jedinstvena
def test_1g_neuspesna_registracija_duplikat_mejla(driver):
    registracija = RegistracijaPage(driver).otvori()
    registracija.popuni(
        ime="Test",
        prezime="Testic",
        datum_rodjenja_ddmmyyyy="01.01.2000.",
        datum_zaposlenja_ddmmyyyy="01.01.2022.",
        kor_ime="test_duplikat_mejla",
        mejl="ana.radnik@scanflow.com",
        adresa="Test adresa 1",
        sifra="testsifra1",
        telefon="+381 60 111 2222",
    )
    registracija.posalji()

    poruka = registracija.procitaj_gresku()

    assert "Nalog sa ovom email adresom već postoji." in poruka
    assert "/registracija" in driver.current_url
    assert procitaj_token(driver) is None


# d) Neuspesna registracija, neispravan format broja telefona
def test_1d_neuspesna_registracija_neispravan_telefon(driver):
    registracija = RegistracijaPage(driver).otvori()
    registracija.popuni(
        ime="Test",
        prezime="Testic",
        datum_rodjenja_ddmmyyyy="01.01.2000.",
        datum_zaposlenja_ddmmyyyy="01.01.2022.",
        kor_ime="test_neispravan_telefon",
        mejl="test.neispravan.telefon@example.com",
        adresa="Test adresa 2",
        sifra="testsifra1",
        telefon="+381Srbija",
    )
    registracija.posalji()

    # Ovo je greska koju hvata frontend (regex) pre slanja ka backendu,
    # pa se prikazuje kao inline poruka ispod polja telefon, a ne u Alert-u.
    assert registracija.greska_polja_vidljiva("Unesite ispravan srpski broj telefona.")
    assert "/registracija" in driver.current_url
    assert procitaj_token(driver) is None


# dj) Neuspesna registracija, korisnicko ime nije jedinstveno
def test_1dj_neuspesna_registracija_duplikat_korisnickog_imena(driver):
    registracija = RegistracijaPage(driver).otvori()
    registracija.popuni(
        ime="Test",
        prezime="Testic",
        datum_rodjenja_ddmmyyyy="01.01.2000.",
        datum_zaposlenja_ddmmyyyy="01.01.2022.",
        kor_ime="ana.radnik",
        mejl="test.duplikat.korisnickog.imena@example.com",
        adresa="Test adresa 3",
        sifra="testsifra1",
        telefon="+381 60 333 4444",
    )
    registracija.posalji()

    poruka = registracija.procitaj_gresku()

    assert "Korisničko ime je već zauzeto." in poruka
    assert "/registracija" in driver.current_url
    assert procitaj_token(driver) is None
