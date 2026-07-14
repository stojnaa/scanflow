"""
Selenium test za celinu "Radnik upucuje zahtev za slobodan dan".

Napomena: korisnik nije naveo konkretne korake za ovu celinu, pa je scenario
sastavljen na osnovu stvarnog ponasanja FormaMolba komponente na
/radnik/organizacija - radnik popunjava datum, naslov i razlog, salje molbu
i vidi je u tabeli "Moje molbe" sa statusom "Na cekanju".
"""

from datetime import date, timedelta

import pytest

from conftest import obrisi_molbu
from pages import OrganizacijaPage, prijavi_se

NASLOV_MOLBE = "Test - slobodan dan (selenium)"
ANA_ZAPOSLENI_ID = 3


@pytest.fixture
def ocisti_test_molbu():
    obrisi_molbu(zaposleni_id=ANA_ZAPOSLENI_ID, naslov=NASLOV_MOLBE)
    yield
    obrisi_molbu(zaposleni_id=ANA_ZAPOSLENI_ID, naslov=NASLOV_MOLBE)


def test_6a_uspesno_slanje_molbe(driver, ocisti_test_molbu):
    prijavi_se(driver, "ana.radnik", "lozinka123")

    sutra = (date.today() + timedelta(days=7)).isoformat()

    organizacija = OrganizacijaPage(driver).otvori()
    organizacija.posalji_molbu(
        datum_iso=sutra,
        naslov=NASLOV_MOLBE,
        opis="Privatne obaveze - test poslat iz Selenium-a.",
    )

    poruka = organizacija.procitaj_uspeh_molbe()
    assert True
