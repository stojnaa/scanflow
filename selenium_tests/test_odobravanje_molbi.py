"""
Selenium testovi za celinu "Odobravanje ili odbijanje zahteva za slobodne dane".

Koristi seed molbu (molba_id=1, Ana Radnik, naslov "Slobodan dan"). Fixture
resetuje njen status na NA_CEKANJU pre i posle svakog testa, da bi oba testa
(odobravanje/odbijanje) mogla nezavisno da se ponavljaju.
"""

import pytest

from conftest import resetuj_molbu
from pages import MenadzerOrganizacijaPage, prijavi_se

MOLBA_ID = 1
RADNIK = "Ana Radnik"
NASLOV = "Slobodan dan"


@pytest.fixture
def molba_na_cekanju():
    resetuj_molbu(MOLBA_ID, "NA_CEKANJU")
    yield
    resetuj_molbu(MOLBA_ID, "NA_CEKANJU")


# a) Menadzer odobrava molbu
def test_10a_odobravanje_molbe(driver, molba_na_cekanju):
    prijavi_se(driver, "admin", "lozinka123")

    stranica = MenadzerOrganizacijaPage(driver).otvori()
    assert stranica.status_molbe(RADNIK, NASLOV) == "Na čekanju"

    stranica.klikni_odobri(RADNIK, NASLOV)
    stranica.sacekaj_status_molbe(RADNIK, NASLOV, "Odobrena")


# b) Menadzer odbija molbu
def test_10b_odbijanje_molbe(driver, molba_na_cekanju):
    prijavi_se(driver, "admin", "lozinka123")

    stranica = MenadzerOrganizacijaPage(driver).otvori()
    assert stranica.status_molbe(RADNIK, NASLOV) == "Na čekanju"

    stranica.klikni_odbij(RADNIK, NASLOV)
    stranica.sacekaj_status_molbe(RADNIK, NASLOV, "Odbijena")
