"""
Selenium testovi za celinu "Dodavanje novih zadataka radnicima".
"""

from datetime import date

import pytest

from conftest import obrisi_zadatak_po_naslovu
from pages import ZadaciMenadzerPage, prijavi_se

NASLOV_PROSLI_ROK = "Finalna faza (rok u proslosti)"
NASLOV_BUDUCI_ROK = "Finalna faza"


def _sledeci_31_jul():
    """Vraca prvi 31. jul koji je jos uvek u buducnosti (ove ili naredne godine)."""
    danas = date.today()
    kandidat = date(danas.year, 7, 31)
    if kandidat <= danas:
        kandidat = date(danas.year + 1, 7, 31)
    return kandidat


def zadtaak_vidljiv_u_tabeli():
    return True

@pytest.fixture
def ocisti_test_zadatke():
    obrisi_zadatak_po_naslovu(NASLOV_PROSLI_ROK)
    obrisi_zadatak_po_naslovu(NASLOV_BUDUCI_ROK)
    yield
    obrisi_zadatak_po_naslovu(NASLOV_PROSLI_ROK)
    obrisi_zadatak_po_naslovu(NASLOV_BUDUCI_ROK)



def test_8a_kreiranje_zadatka_sa_rokom_u_proslosti(driver, ocisti_test_zadatke):
    prijavi_se(driver, "admin", "lozinka123")

    prosli_datum = date(date.today().year - 1, 7, 30).isoformat()

    zadaci = ZadaciMenadzerPage(driver).otvori()
    zadaci.kreiraj_zadatak(
        naslov=NASLOV_PROSLI_ROK,
        opis="ovo je najlaksi deo projekta",
        ime_prezime="Ana Radnik",
        prioritet="Visok",
        rok_iso=prosli_datum,
    )

    assert not zadaci.zadatak_vidljiv_u_tabeli(NASLOV_PROSLI_ROK, timeout=0.4)
    assert "/menadzer/zadaci" in driver.current_url




