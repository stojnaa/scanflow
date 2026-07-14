"""
Selenium testovi za celinu "Popunjavanje smena".

Koristi smenu bez ijedne dodele u seed podacima (smena_id=3, "Nedelja 31") i
Petra Petrovica (zaposleni_id=4), da bi test a) i b) bili nezavisni i
ponovljivi bez obzira na redosled izvrsavanja.
"""

import pytest

from conftest import dodaj_smena_zaposleni, obrisi_smena_zaposleni
from pages import MenadzerOrganizacijaPage, prijavi_se

SMENA_ID = 3
ZAPOSLENI_ID = 4
TIP_SMENE = "PRVA"

NAZIV_SMENE_PRIKAZ = "Nedelja 31 (2026-07-27)"
IME_PREZIME = "Petar Petrovic"
TIP_SMENE_PRIKAZ = "Prva"


@pytest.fixture
def bez_dodele_smene():
    obrisi_smena_zaposleni(SMENA_ID, ZAPOSLENI_ID, TIP_SMENE)
    yield
    obrisi_smena_zaposleni(SMENA_ID, ZAPOSLENI_ID, TIP_SMENE)


@pytest.fixture
def postojeca_dodela_smene():
    dodaj_smena_zaposleni(SMENA_ID, ZAPOSLENI_ID, TIP_SMENE)
    yield
    obrisi_smena_zaposleni(SMENA_ID, ZAPOSLENI_ID, TIP_SMENE)


# a) Uspesno dodavanje radnika u smenu
def test_11a_uspesno_dodavanje_u_smenu(driver, bez_dodele_smene):
    prijavi_se(driver, "admin", "lozinka123")

    stranica = MenadzerOrganizacijaPage(driver).otvori()
    stranica.dodaj_u_smenu(NAZIV_SMENE_PRIKAZ, IME_PREZIME, TIP_SMENE_PRIKAZ)

    poruka = stranica.procitaj_uspeh_smene()
    assert poruka == "Radnik dodat u smenu."


# b) Neuspesno - radnik je vec dodat u tu smenu (isti tip smene)
def test_11b_duplikat_dodavanja_u_smenu(driver, postojeca_dodela_smene):
    prijavi_se(driver, "admin", "lozinka123")

    stranica = MenadzerOrganizacijaPage(driver).otvori()
    stranica.dodaj_u_smenu(NAZIV_SMENE_PRIKAZ, IME_PREZIME, TIP_SMENE_PRIKAZ)

    poruka = stranica.procitaj_gresku_smene()
    assert poruka == "Radnik je već dodat u tu smenu."
