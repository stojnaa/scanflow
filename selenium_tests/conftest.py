import pymysql
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from config import DB_CONFIG


@pytest.fixture
def driver():
    opcije = Options()
    drv = webdriver.Chrome(options=opcije)
    drv.maximize_window()

    yield drv

    drv.quit()

# Brise test korisnika
def obrisi_zaposlenog(kor_ime=None, mejl=None):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            if kor_ime:
                kursor.execute("DELETE FROM zaposleni WHERE kor_ime = %s", (kor_ime,))
            if mejl:
                kursor.execute("DELETE FROM zaposleni WHERE mejl = %s", (mejl,))
        konekcija.commit()
    finally:
        konekcija.close()


def postavi_status_zadatka(zadatak_id, status):
    """Vraca status zadatka na zeljenu vrednost pre testa, da bi test bio ponovljiv."""
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "UPDATE zadatak SET status = %s WHERE zadatak_id = %s",
                (status, zadatak_id),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def dodaj_evidenciju(zaposleni_id, tip, qr_token_id=1):
    """Dodaje evidenciju (check-in/check-out) i vraca id novog reda."""
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "INSERT INTO evidencija (zaposleni_id, tip, vreme, qr_token_id) "
                "VALUES (%s, %s, NOW(), %s)",
                (zaposleni_id, tip, qr_token_id),
            )
            konekcija.commit()
            return kursor.lastrowid
    finally:
        konekcija.close()


def obrisi_evidenciju(evidencija_id):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "DELETE FROM evidencija WHERE evidencija_id = %s", (evidencija_id,)
            )
        konekcija.commit()
    finally:
        konekcija.close()


def vrati_ime_prezime(kor_ime, ime, prezime):
    """Vraca ime/prezime zaposlenog na pocetnu vrednost posle testa izmene profila."""
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "UPDATE zaposleni SET ime = %s, prezime = %s WHERE kor_ime = %s",
                (ime, prezime, kor_ime),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def obrisi_molbu(zaposleni_id, naslov):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "DELETE FROM molba WHERE zaposleni_id = %s AND naslov = %s",
                (zaposleni_id, naslov),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def ukloni_iz_tima(tim_id, zaposleni_id):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "DELETE FROM tim_zaposleni WHERE tim_id = %s AND zaposleni_id = %s",
                (tim_id, zaposleni_id),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def dodaj_u_tim(tim_id, zaposleni_id):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "INSERT IGNORE INTO tim_zaposleni (tim_id, zaposleni_id) VALUES (%s, %s)",
                (tim_id, zaposleni_id),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def resetuj_molbu(molba_id, status="NA_CEKANJU"):
    """Vraca molbu na zadati status i cisti datum_resenja/resio_id, radi ponovljivosti testova."""
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "UPDATE molba SET status = %s, datum_resenja = NULL, resio_id = NULL "
                "WHERE molba_id = %s",
                (status, molba_id),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def dodaj_smena_zaposleni(smena_id, zaposleni_id, tip_smene):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "INSERT IGNORE INTO smena_zaposleni (smena_id, zaposleni_id, tip_smene) "
                "VALUES (%s, %s, %s)",
                (smena_id, zaposleni_id, tip_smene),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def obrisi_smena_zaposleni(smena_id, zaposleni_id, tip_smene):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute(
                "DELETE FROM smena_zaposleni WHERE smena_id = %s AND zaposleni_id = %s "
                "AND tip_smene = %s",
                (smena_id, zaposleni_id, tip_smene),
            )
        konekcija.commit()
    finally:
        konekcija.close()


def obrisi_zadatak_po_naslovu(naslov):
    konekcija = pymysql.connect(**DB_CONFIG)

    try:
        with konekcija.cursor() as kursor:
            kursor.execute("SELECT zadatak_id FROM zadatak WHERE naslov = %s", (naslov,))
            zadaci = kursor.fetchall()
            for (zadatak_id,) in zadaci:
                kursor.execute(
                    "DELETE FROM zadatak_zaposleni WHERE zadatak_id = %s", (zadatak_id,)
                )
                kursor.execute("DELETE FROM zadatak WHERE zadatak_id = %s", (zadatak_id,))
        konekcija.commit()
    finally:
        konekcija.close()
