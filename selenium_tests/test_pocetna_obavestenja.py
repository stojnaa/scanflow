"""
Selenium test za celinu "Pregled obavestenja na pocetnoj strani".

Koristi seed podatke: aktivna obavestenja "Sastanak tima" i "Promena rasporeda"
(aktivno=1), i "Staro obaveštenje" koje je aktivno=0 i ne sme se prikazati.
"""

from pages import OrganizacijaPage, prijavi_se


# a) Zaposleni vidi obavestenja na pocetnoj strani kada se uloguje
def test_3a_prikaz_aktivnih_obavestenja(driver):
    prijavi_se(driver, "ana.radnik", "lozinka123")

    organizacija = OrganizacijaPage(driver).otvori()
    naslovi = organizacija.naslovi_obavestenja()

    assert "Sastanak tima" in naslovi
    assert "Promena rasporeda" in naslovi
    assert "Staro obaveštenje" not in naslovi
