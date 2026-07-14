"""
Selenium test za celinu "Azuriranje licnih podataka na profilu".

Napomena: test b) "Neuspesno menjanje - neispravan format telefona" je
namerno preskocen - forma za profil trenutno ne validira format telefona
(ni na frontendu ni na backendu), pa bi takav unos danas bio PRIHVACEN.
Dogovoreno je da se to pitanje resi posebno pre nego sto se test b) napise.
"""

import pytest
from selenium.webdriver.common.by import By

from conftest import vrati_ime_prezime
from pages import ProfilPage, prijavi_se


@pytest.fixture
def ocisti_ime_prezime_ane():
    vrati_ime_prezime("ana.radnik", "Ana", "Radnik")
    yield
    vrati_ime_prezime("ana.radnik", "Ana", "Radnik")


# a) Uspesno menjanje imena i prezimena na profilu
def test_5a_uspesna_izmena_profila(driver, ocisti_ime_prezime_ane):
    prijavi_se(driver, "ana.radnik", "lozinka123")

    profil = ProfilPage(driver).otvori()
    profil.klikni_izmeni()
    profil.postavi_ime_prezime("Ana Izmenjena", "Radnik Izmenjena")
    profil.klikni_sacuvaj()

    poruka = profil.procitaj_uspeh()
    assert poruka == "Podaci su uspešno sačuvani."

    # Forma se vraca u rezim za pregled - dugme "Izmeni" se ponovo pojavljuje.
    assert driver.find_element(
        By.XPATH, "//button[normalize-space(text())='Izmeni']"
    ).is_displayed()
