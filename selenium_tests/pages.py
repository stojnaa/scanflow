from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from config import BASE_URL


def upisi_datum_iso(element, iso_datum):
    """iso_datum: 'YYYY-MM-DD'. Kuca se kao DDMMYYYY jer je lokalni format
    Chrome date input-a na ovom sistemu DD.MM.YYYY (dan/mesec/godina)."""
    godina, mesec, dan = iso_datum.split("-")
    element.click()
    element.send_keys(f"{dan}{mesec}{godina}")


class LoginPage:
    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/login")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )
        return self

    def popuni(self, kor_ime_ili_mejl, lozinka):
        self.driver.find_element(
            By.CSS_SELECTOR, "input[placeholder='Vaše korisničko ime']"
        ).send_keys(kor_ime_ili_mejl)

        self.driver.find_element(
            By.CSS_SELECTOR, "input[type='password'][placeholder='Lozinka']"
        ).send_keys(lozinka)

        return self

    def posalji(self):
        dugme = self.driver.find_element(
            By.CSS_SELECTOR,
            "button[type='submit']"
        )

        self.driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'});",
            dugme,
        )

        WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, "button[type='submit']")
            )
        )

        dugme.click()
        return self

    def procitaj_gresku(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-danger"))
        )
        return alert.text


class RegistracijaPage:
    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/registracija")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[type='submit']"))
        )
        return self

    def popuni(
        self,
        ime,
        prezime,
        datum_rodjenja_ddmmyyyy,
        datum_zaposlenja_ddmmyyyy,
        kor_ime,
        mejl,
        adresa,
        sifra,
        telefon,
    ):
        d = self.driver

        d.find_element(By.CSS_SELECTOR, "input[placeholder='Ime']").send_keys(ime)
        d.find_element(By.CSS_SELECTOR, "input[placeholder='Prezime']").send_keys(prezime)

        # Redosled u DOM-u: prvo datum rodjenja, pa datum zaposlenja.
        datumi = d.find_elements(By.CSS_SELECTOR, "input[type='date']")
        datumi[0].click()
        datumi[0].send_keys(self._u_ddmmyyyy(datum_rodjenja_ddmmyyyy))
        datumi[1].click()
        datumi[1].send_keys(self._u_ddmmyyyy(datum_zaposlenja_ddmmyyyy))

        d.find_element(
            By.CSS_SELECTOR,
            "input[placeholder='Vaše korisničko ime']",
        ).send_keys(kor_ime)
        d.find_element(
            By.CSS_SELECTOR,
            "input[placeholder='Vaša email adresa']",
        ).send_keys(mejl)
        d.find_element(
            By.CSS_SELECTOR,
            "input[placeholder='Vaša adresa']",
        ).send_keys(adresa)
        d.find_element(By.CSS_SELECTOR, "input[placeholder='Najmanje 8 karaktera']").send_keys(sifra)
        d.find_element(
            By.CSS_SELECTOR,
            "input[placeholder='Vaš telefon']",
        ).send_keys(telefon)

        return self

    @staticmethod
    def _u_ddmmyyyy(datum_ddmmyyyy):
        # Ulaz u obliku "01.01.2004." (dan.mesec.godina) -> "01012004" za
        # Chrome-ov date input, cija polja na ovom sistemu idu redosledom
        # dan/mesec/godina (lokalni format DD.MM.YYYY).
        dan, mesec, godina = datum_ddmmyyyy.strip(".").split(".")
        return f"{dan.zfill(2)}{mesec.zfill(2)}{godina}"

    def posalji(self):
        dugme = self.driver.find_element(
            By.CSS_SELECTOR,
            "button[type='submit']"
        )

        self.driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'});",
            dugme,
        )

        self.driver.execute_script(
            "arguments[0].click();",
            dugme,
        )

        return self

    def procitaj_gresku(self, timeout=5):
        """Cita gresku iz zajednickog Alert-a iznad forme (npr. duplikat mejla/korisnickog imena)."""
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-danger"))
        )
        return alert.text

    def greska_polja_vidljiva(self, tekst, timeout=5):
        """Proverava da li je tekst vidljiv kao inline validaciona greska ispod nekog polja."""
        try:
            WebDriverWait(self.driver, timeout).until(
                lambda drv: any(
                    tekst in el.text and el.is_displayed()
                    for el in drv.find_elements(By.CSS_SELECTOR, ".invalid-feedback")
                )
            )
            return True
        except TimeoutException:
            return False


def prijavi_se(driver, kor_ime_ili_mejl, lozinka):
    """Pomocna funkcija: prijavljuje korisnika i ceka da napusti /login."""
    LoginPage(driver).otvori().popuni(kor_ime_ili_mejl, lozinka).posalji()
    WebDriverWait(driver, 10).until(lambda d: "/login" not in d.current_url)


class ZadaciPage:
    """/radnik/zadaci - lista dodeljenih zadataka i promena statusa."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/radnik/zadaci")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        return self

    def _red(self, naslov, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(
                (By.XPATH, f"//tr[td/div[normalize-space(text())='{naslov}']]")
            )
        )

    def status_teksta(self, naslov):
        return self._red(naslov).find_element(By.CSS_SELECTOR, ".badge").text

    def klikni_u_radu(self, naslov):
        red = self._red(naslov)
        red.find_element(
            By.XPATH, ".//button[normalize-space(text())='U radu']"
        ).click()
        return self

    def klikni_zavrseno(self, naslov):
        red = self._red(naslov)
        red.find_element(
            By.XPATH, ".//button[normalize-space(text())='Završeno']"
        ).click()
        return self

    def sacekaj_status(self, naslov, ocekivani_status, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            lambda d: self.status_teksta(naslov) == ocekivani_status
        )
        return self


class OrganizacijaPage:
    """/radnik/organizacija - pocetna strana radnika (oglasna tabla, smene, molbe)."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/radnik/organizacija")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Oglasna tabla')]")
            )
        )
        return self

    def naslovi_obavestenja(self, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            lambda d: d.find_elements(By.CSS_SELECTOR, "h5.mb-1")
            or d.find_elements(By.XPATH, "//*[contains(text(), 'Nema aktivnih obaveštenja.')]")
        )
        return [el.text for el in self.driver.find_elements(By.CSS_SELECTOR, "h5.mb-1")]

    def posalji_molbu(self, datum_iso, naslov, opis):
        d = self.driver
        upisi_datum_iso(d.find_element(By.CSS_SELECTOR, "input[name='datum']"), datum_iso)
        d.find_element(By.CSS_SELECTOR, "input[name='naslov']").send_keys(naslov)
        d.find_element(By.CSS_SELECTOR, "textarea[name='opis']").send_keys(opis)
        d.find_element(
            By.XPATH, "//button[normalize-space(text())='Pošalji molbu']"
        ).click()
        return self

    def procitaj_uspeh_molbe(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-success"))
        )
        return alert.text

    def status_molbe(self, naslov, timeout=10):
        red = WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(
                (By.XPATH, f"//tr[td[normalize-space(text())='{naslov}']]")
            )
        )
        return red.find_element(By.CSS_SELECTOR, ".badge").text


class PrisutniPage:
    """/menadzer/evidencija - pregled zaposlenih trenutno na poslu (menadzer/admin)."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/menadzer/evidencija")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Trenutno na poslu')]")
            )
        )
        return self

    def _sacekaj_zavrsetak_ucitavanja(self, timeout=10):
        WebDriverWait(self.driver, timeout).until_not(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Učitavanje...')]")
            )
        )

    def prazno_stanje_vidljivo(self, timeout=10):
        self._sacekaj_zavrsetak_ucitavanja(timeout)
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located(
                    (
                        By.XPATH,
                        "//*[contains(@class, 'alert-info') and "
                        "contains(text(), 'Trenutno nema zaposlenih na poslu.')]",
                    )
                )
            )
            return True
        except TimeoutException:
            return False

    def imena_prisutnih(self, timeout=10):
        self._sacekaj_zavrsetak_ucitavanja(timeout)
        WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr"))
        )
        redovi = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        return [red.find_elements(By.TAG_NAME, "td")[0].text for red in redovi]


class ProfilPage:
    """/profil - pregled i izmena licnih podataka."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/profil")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//button[normalize-space(text())='Izmeni']")
            )
        )
        return self

    def klikni_izmeni(self):
        self.driver.find_element(
            By.XPATH, "//button[normalize-space(text())='Izmeni']"
        ).click()
        return self

    def _polje(self, labela):
        return self.driver.find_element(
            By.XPATH, f"//label[normalize-space(text())='{labela}']/following-sibling::input"
        )

    def postavi_ime_prezime(self, ime, prezime):
        polje_ime = self._polje("Ime")
        polje_ime.clear()
        polje_ime.send_keys(ime)

        polje_prezime = self._polje("Prezime")
        polje_prezime.clear()
        polje_prezime.send_keys(prezime)
        return self

    def klikni_sacuvaj(self):
        self.driver.find_element(
            By.XPATH, "//button[normalize-space(text())='Sačuvaj']"
        ).click()
        return self

    def procitaj_uspeh(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-success"))
        )
        return alert.text


class AdminPregledPage:
    """/admin/pregled - "Zaposleni i timovi": dodavanje radnika u tim."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/admin/pregled")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Dodaj radnika u tim')]")
            )
        )
        return self

    def dodaj_radnika_u_tim(self, ime_prezime, naziv_tima):
        d = self.driver

        Select(
            d.find_element(
                By.XPATH,
                "//label[normalize-space(text())='Zaposleni']/following-sibling::select",
            )
        ).select_by_visible_text(ime_prezime)

        Select(
            d.find_element(
                By.XPATH,
                "//label[normalize-space(text())='Tim']/following-sibling::select",
            )
        ).select_by_visible_text(naziv_tima)

        d.find_element(
            By.XPATH, "//button[normalize-space(text())='Dodaj u tim']"
        ).click()
        return self

    def procitaj_uspeh(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-success"))
        )
        return alert.text

    def procitaj_gresku(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-danger"))
        )
        return alert.text


class ZadaciMenadzerPage:
    """/menadzer/zadaci - kreiranje zadataka i pregled svih zadataka."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/menadzer/zadaci")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Novi zadatak')]")
            )
        )
        return self

    def kreiraj_zadatak(self, naslov, opis, ime_prezime, prioritet, rok_iso):
        d = self.driver

        d.find_element(By.CSS_SELECTOR, "input[name='naslov']").send_keys(naslov)
        d.find_element(By.CSS_SELECTOR, "textarea[name='opis']").send_keys(opis)

        Select(
            d.find_element(By.CSS_SELECTOR, "select[name='dodeljeni']")
        ).select_by_visible_text(ime_prezime)
        Select(
            d.find_element(By.CSS_SELECTOR, "select[name='prioritet']")
        ).select_by_visible_text(prioritet)

        upisi_datum_iso(d.find_element(By.CSS_SELECTOR, "input[name='rok']"), rok_iso)

        d.find_element(
            By.XPATH, "//button[normalize-space(text())='Kreiraj zadatak']"
        ).click()
        return self

    def procitaj_uspeh(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-success"))
        )
        return alert.text

    def zadatak_vidljiv_u_tabeli(self, naslov, timeout=10):
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located(
                    (By.XPATH, f"//tr[td/div[normalize-space(text())='{naslov}']]")
                )
            )
            return True
        except TimeoutException:
            return False


class MenadzerOrganizacijaPage:
    """/menadzer/organizacija - molbe za slobodne dane i popunjavanje smena."""

    def __init__(self, driver):
        self.driver = driver

    def otvori(self):
        self.driver.get(f"{BASE_URL}/menadzer/organizacija")
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//*[contains(text(), 'Molbe za slobodne dane')]")
            )
        )
        return self

    def _red_molbe(self, radnik, naslov, timeout=10):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    f"//tr[td[normalize-space(text())='{radnik}'] and "
                    f"td/div[normalize-space(text())='{naslov}']]",
                )
            )
        )

    def status_molbe(self, radnik, naslov):
        return self._red_molbe(radnik, naslov).find_element(By.CSS_SELECTOR, ".badge").text

    def klikni_odobri(self, radnik, naslov):
        red = self._red_molbe(radnik, naslov)
        red.find_element(By.XPATH, ".//button[normalize-space(text())='Odobri']").click()
        return self

    def klikni_odbij(self, radnik, naslov):
        red = self._red_molbe(radnik, naslov)
        red.find_element(By.XPATH, ".//button[normalize-space(text())='Odbij']").click()
        return self

    def sacekaj_status_molbe(self, radnik, naslov, ocekivani_status, timeout=10):
        WebDriverWait(self.driver, timeout).until(
            lambda d: self.status_molbe(radnik, naslov) == ocekivani_status
        )
        return self

    def dodaj_u_smenu(self, naziv_smene_prikaz, ime_prezime, tip_smene_prikaz):
        d = self.driver

        Select(d.find_element(By.CSS_SELECTOR, "select[name='smena']")).select_by_visible_text(
            naziv_smene_prikaz
        )
        Select(d.find_element(By.CSS_SELECTOR, "select[name='zaposleni']")).select_by_visible_text(
            ime_prezime
        )
        Select(d.find_element(By.CSS_SELECTOR, "select[name='tipSmene']")).select_by_visible_text(
            tip_smene_prikaz
        )

        dugme = d.find_element(
            By.XPATH,
            "//button[normalize-space(text())='Dodaj u smenu']"
        )

        self.driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'});",
            dugme,
        )

        WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    "//button[normalize-space(text())='Dodaj u smenu']",
                )
            )
        )

        self.driver.execute_script(
            "arguments[0].click();",
            dugme,
        )

        return self

    def procitaj_uspeh_smene(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-success"))
        )
        return alert.text

    def procitaj_gresku_smene(self, timeout=5):
        alert = WebDriverWait(self.driver, timeout).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".alert-danger"))
        )
        return alert.text
