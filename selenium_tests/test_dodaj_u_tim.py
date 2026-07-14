"""
Selenium test za celinu "Dodavanje radnika u odredjeni tim".

Napomena: u seed podacima je Ana Radnik (zaposleni_id=3) vec clan Tima A
(tim_id=1), pa bi scenario iz plana ("dodaj Anu u Tim A") inace odmah pao na
backend proveri "Zaposleni je vec clan ovog tima.". Fixture zato privremeno
uklanja Anu iz Tima A pre testa i vraca je posle, da scenario odgovara
opisu iz plana (dodavanje, ne ponovno dodavanje).
"""

import pytest

from conftest import dodaj_u_tim, ukloni_iz_tima
from pages import AdminPregledPage, prijavi_se

TIM_A_ID = 1
ANA_ZAPOSLENI_ID = 3


@pytest.fixture
def ana_nije_clan_tima_a():
    ukloni_iz_tima(tim_id=TIM_A_ID, zaposleni_id=ANA_ZAPOSLENI_ID)
    yield
    dodaj_u_tim(tim_id=TIM_A_ID, zaposleni_id=ANA_ZAPOSLENI_ID)


def test_7_dodavanje_radnika_u_tim(driver, ana_nije_clan_tima_a):
    prijavi_se(driver, "admin", "lozinka123")

    pregled = AdminPregledPage(driver).otvori()
    pregled.dodaj_radnika_u_tim("Ana Radnik", "Tim A")

    poruka = pregled.procitaj_uspeh()
    assert poruka == "Radnik je dodat u tim."
