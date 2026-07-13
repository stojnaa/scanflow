

from django.db import models


class Zaposleni(models.Model):
    zaposleni_id = models.AutoField(primary_key=True, db_column='zaposleni_id')
    class Uloga(models.TextChoices):
        RADNIK = 'RADNIK', 'Radnik'
        MENADZER = 'MENADZER', 'Menadzer'
        ADMIN = 'ADMIN', 'Admin'

    ime = models.CharField(max_length=50)
    prezime = models.CharField(max_length=50)
    datum_rodjenja = models.DateField()
    datum_zaposlenja = models.DateField()
    telefon = models.CharField(max_length=30)
    adresa = models.CharField(max_length=100)
    kor_ime = models.CharField(max_length=50, unique=True)
    mejl = models.CharField(max_length=100, unique=True)
    sifra_hash = models.CharField(max_length=255)
    uloga = models.CharField(max_length=10, choices=Uloga.choices, default=Uloga.RADNIK)
    aktivan = models.BooleanField(default=True)

    # M:N veza Zaposleni <-> Tim, realizovana preko Tim.clanovi (vezna tabela TIM_ZAPOSLENI)
    # M:N veza Zaposleni <-> Zadatak, realizovana preko Zadatak.dodeljeni (ZADATAK_ZAPOSLENI)
    # M:N veza Zaposleni <-> Smena ima dodatni atribut, vidi SmenaZaposleni (through)

    class Meta:
        db_table = 'zaposleni'

    def __str__(self):
        return f'{self.ime} {self.prezime}'

    @property
    def is_authenticated(self):
        # Zaposleni ne nasledjuje AbstractUser; ovo omogucava DRF-u (IsAuthenticated i sl.)
        # da tretira svaku instancu dobijenu kroz ZaposleniJWTAuthentication kao prijavljenog korisnika.
        return True


class Tim(models.Model):
    tim_id = models.AutoField(primary_key=True, db_column='tim_id')

    naziv = models.CharField(max_length=100)

    # menadzer_id -> Zaposleni
    menadzer = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='timovi_menadzer',
        db_column='menadzer_id',
    )

    # M:N preko vezne tabele tim_zaposleni
    clanovi = models.ManyToManyField(
        Zaposleni,
        related_name='timovi',
        db_table='tim_zaposleni',
        blank=True,
    )

    class Meta:
        db_table = 'tim'

    def __str__(self):
        return self.naziv


class Zadatak(models.Model):
    zadatak_id = models.AutoField(primary_key=True, db_column='zadatak_id')

    class Status(models.TextChoices):
        TO_DO = 'TO_DO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        DONE = 'DONE', 'Done'

    naslov = models.CharField(max_length=100)
    opis = models.TextField()
    datum_kreiranja = models.DateTimeField(auto_now_add=True)
    rok = models.DateTimeField()
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.TO_DO)

    # kreirao_id -> Zaposleni; D:R -> PROTECT
    kreirao = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='kreirani_zadaci',
        db_column='kreirao_id',
    )

    # M:N preko vezne tabele zadatak_zaposleni
    dodeljeni = models.ManyToManyField(
        Zaposleni,
        related_name='zadaci',
        db_table='zadatak_zaposleni',
        blank=True,
    )

    class Meta:
        db_table = 'zadatak'

    def __str__(self):
        return self.naslov


class Smena(models.Model):
    smena_id = models.AutoField(primary_key=True, db_column='smena_id')
    broj_nedelje = models.IntegerField()
    datum_od = models.DateField()
    datum_do = models.DateField()
    # M:N sa Zaposleni ima dodatni atribut tip_smene -> ide preko through modela SmenaZaposleni
    zaposleni = models.ManyToManyField(
        Zaposleni,
        through='SmenaZaposleni',
        related_name='smene',
        blank=True,
    )

    class Meta:
        db_table = 'smena'

    def __str__(self):
        return f'Nedelja {self.broj_nedelje} ({self.datum_od} - {self.datum_do})'


class SmenaZaposleni(models.Model):
    pk = models.CompositePrimaryKey("smena", "zaposleni", "tip_smene")
    class TipSmene(models.TextChoices):
        PRVA = 'PRVA', 'Prva'
        DRUGA = 'DRUGA', 'Druga'
        TRECA = 'TRECA', 'Treca'

    smena = models.ForeignKey(Smena, on_delete=models.CASCADE, db_column='smena_id')
    zaposleni = models.ForeignKey(Zaposleni, on_delete=models.CASCADE, db_column='zaposleni_id')
    tip_smene = models.CharField(max_length=5, choices=TipSmene.choices)

    class Meta:
        db_table = 'smena_zaposleni'
        # Slozeni PK iz specifikacije (smena_id, zaposleni_id, tip_smene)
        unique_together = ('smena', 'zaposleni', 'tip_smene')

    def __str__(self):
        return f'{self.zaposleni} - {self.smena} ({self.tip_smene})'


class Molba(models.Model):
    molba_id = models.AutoField(primary_key=True, db_column='molba_id')
    class Status(models.TextChoices):
        NA_CEKANJU = 'NA_CEKANJU', 'Na cekanju'
        ODOBRENA = 'ODOBRENA', 'Odobrena'
        ODBIJENA = 'ODBIJENA', 'Odbijena'

    # zaposleni_id -> ko je poslao molbu; D:R -> PROTECT
    zaposleni = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='molbe',
        db_column='zaposleni_id',
    )
    naslov = models.CharField(max_length=100)
    opis = models.TextField()
    datum_za_koji_se_trazi = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.NA_CEKANJU)
    datum_kreiranja = models.DateTimeField(auto_now_add=True)
    datum_resenja = models.DateTimeField(null=True, blank=True)
    # resio_id -> ko je odobrio/odbio (moze biti prazno dok je NA_CEKANJU)
    resio = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='resene_molbe',
        db_column='resio_id',
        null=True,
        blank=True,
    )

    class Meta:
        db_table = 'molba'

    def __str__(self):
        return f'{self.naslov} ({self.status})'


class QrTerminal(models.Model):
    terminal_id = models.AutoField(primary_key=True, db_column='terminal_id')

    naziv = models.CharField(max_length=100)
    lokacija = models.CharField(max_length=100)
    aktivan = models.BooleanField(default=True)

    class Meta:
        db_table = 'qr_terminal'

    def __str__(self):
        return self.naziv


class QrToken(models.Model):
    qr_token_id = models.AutoField(primary_key=True, db_column='qr_token_id')

    token_hash = models.CharField(max_length=255)
    vreme_generisanja = models.DateTimeField(auto_now_add=True)
    vreme_isteka = models.DateTimeField()
    aktivan = models.BooleanField(default=True)

    # terminal_id -> QrTerminal; D:C
    terminal = models.ForeignKey(
        QrTerminal,
        on_delete=models.CASCADE,
        related_name='tokeni',
        db_column='terminal_id',
    )

    class Meta:
        db_table = 'qr_token'

    def __str__(self):
        return f'Token {self.qr_token_id} ({"aktivan" if self.aktivan else "neaktivan"})'
class Evidencija(models.Model):
    evidencija_id = models.AutoField(primary_key=True, db_column='evidencija_id')

    class Tip(models.TextChoices):
        CHECK_IN = 'CHECK_IN', 'Check in'
        CHECK_OUT = 'CHECK_OUT', 'Check out'

    # zaposleni_id -> Zaposleni; D:R -> PROTECT
    zaposleni = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='evidencije',
        db_column='zaposleni_id',
    )

    tip = models.CharField(max_length=10, choices=Tip.choices)
    vreme = models.DateTimeField(auto_now_add=True)

    # qr_token_id -> QrToken; D:R -> PROTECT
    qr_token = models.ForeignKey(
        QrToken,
        on_delete=models.PROTECT,
        related_name='evidencije',
        db_column='qr_token_id',
    )

    class Meta:
        db_table = 'evidencija'

    def __str__(self):
        return f'{self.zaposleni} - {self.tip} @ {self.vreme}'
class Obavestenje(models.Model):
    obavestenje_id = models.AutoField(primary_key=True, db_column='obavestenje_id')
    naslov = models.CharField(max_length=100)
    tekst = models.TextField()
    datum_kreiranja = models.DateTimeField(auto_now_add=True)
    # autor_id -> Zaposleni; D:R -> PROTECT
    autor = models.ForeignKey(
        Zaposleni,
        on_delete=models.PROTECT,
        related_name='obavestenja',
        db_column='autor_id',
    )
    aktivno = models.BooleanField(default=True)

    class Meta:
        db_table = 'obavestenje'

    def __str__(self):
        return self.naslov