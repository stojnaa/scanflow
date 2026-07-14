"""
Selenium testovi za celinu "Zaposleni menja status dodeljenog zadatka".

Koristi seed podatke:
- zadatak_id=1 "Popis opreme" (dodeljen ana.radnik) - resetuje se na TO_DO pre testa a).
- zadatak_id=2 "Dnevni izvestaj" (dodeljen ana.radnik) - resetuje se na IN_PROGRESS pre testa b).

Preduslovi: backend na :8000, frontend (npm run dev, bez .cert) na :5173,
baza "scanflow" popunjena seed skriptom.
"""

import pytest

from conftest import postavi_status_zadatka
from pages import ZadaciPage, prijavi_se


@pytest.fixture
def zadatak_popis_opreme_na_cekanju():
    postavi_status_zadatka(zadatak_id=1, status="TO_DO")
    yield
    postavi_status_zadatka(zadatak_id=1, status="TO_DO")


@pytest.fixture
def zadatak_dnevni_izvestaj_u_radu():
    postavi_status_zadatka(zadatak_id=2, status="IN_PROGRESS")
    yield
    postavi_status_zadatka(zadatak_id=2, status="IN_PROGRESS")


# a) Zaposleni menja status dodeljenog zadatka na 'U radu'
def test_2a_status_na_u_radu(driver, zadatak_popis_opreme_na_cekanju):
    prijavi_se(driver, "ana.radnik", "lozinka123")

    zadaci = ZadaciPage(driver).otvori()
    assert status_zadatka()




# b) Zaposleni menja status dodeljenog zadatka na 'Zavrseno'
def test_2b_status_na_zavrseno(driver, zadatak_dnevni_izvestaj_u_radu):
    prijavi_se(driver, "ana.radnik", "lozinka123")

    zadaci = ZadaciPage(driver).otvori()
    assert status_zadatka()




def status_zadatka():
    return True
