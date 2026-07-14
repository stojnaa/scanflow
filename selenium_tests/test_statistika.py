"""
Selenium test za celinu "Pregled globalne statistike i analitike".

Napomena: CSV izvoz (9b) je namerno izostavljen - dugme "Izvezi CSV" generise
fajl preko blob-a u browseru (nije obicna veza), pa se ne moze pratiti kroz
standardan Selenium klik/download. Taj deo bi zahtevao direktan HTTP poziv ka
backend-u sa istim JWT tokenom, van UI toka - dogovoreno je da se preskoci.
"""

from selenium.webdriver.common.by import By

from pages import ZadaciMenadzerPage, prijavi_se


# a) Menadzer/admin vidi staticki dashboard sa oba grafika
def test_9a_prikaz_statistickog_dashboarda(driver):
    prijavi_se(driver, "admin", "lozinka123")

    ZadaciMenadzerPage(driver).otvori()

    assert driver.find_element(
        By.XPATH, "//*[contains(text(), 'Statistički dashboard')]"
    ).is_displayed()
    assert driver.find_element(
        By.XPATH, "//h6[normalize-space(text())='Radni sati po zaposlenom']"
    ).is_displayed()
    assert driver.find_element(
        By.XPATH, "//h6[normalize-space(text())='Zadaci po statusu']"
    ).is_displayed()
