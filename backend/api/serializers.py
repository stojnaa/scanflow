from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import (
    Zaposleni, Tim, Molba, Obavestenje, Smena, SmenaZaposleni,
    QrTerminal, Evidencija, Zadatak,
)


class ZaposleniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zaposleni
        fields = ['zaposleni_id', 'ime', 'prezime', 'mejl', 'uloga']


class TimSerializer(serializers.ModelSerializer):
    menadzer_detail = ZaposleniSerializer(source='menadzer', read_only=True)
    clanovi_detail = ZaposleniSerializer(source='clanovi', many=True, read_only=True)

    class Meta:
        model = Tim
        fields = ['tim_id', 'naziv', 'menadzer', 'menadzer_detail', 'clanovi_detail']


class ZaposleniDetailSerializer(serializers.ModelSerializer):
    """Pun prikaz zaposlenog (bez sifra_hash) - koristi se za admin uvid, profil i odgovore na auth rute."""
    timovi = TimSerializer(many=True, read_only=True)

    class Meta:
        model = Zaposleni
        fields = [
            'zaposleni_id', 'ime', 'prezime', 'datum_rodjenja', 'datum_zaposlenja',
            'telefon', 'adresa', 'kor_ime', 'mejl', 'uloga', 'aktivan', 'timovi',
        ]


class RegistracijaSerializer(serializers.ModelSerializer):
    sifra = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Zaposleni
        fields = [
            'ime', 'prezime', 'datum_rodjenja', 'datum_zaposlenja',
            'telefon', 'adresa', 'kor_ime', 'mejl', 'sifra',
        ]
        # Iskljucujemo auto-generisani UniqueValidator (engleska poruka) - uniqueness
        # proveravamo rucno u validate_kor_ime/validate_mejl radi konzistentnih poruka.
        extra_kwargs = {
            'kor_ime': {'validators': []},
            'mejl': {'validators': []},
        }

    def validate_kor_ime(self, value):
        if Zaposleni.objects.filter(kor_ime=value).exists():
            raise serializers.ValidationError('Korisničko ime je već zauzeto.')
        return value

    def validate_mejl(self, value):
        if Zaposleni.objects.filter(mejl=value).exists():
            raise serializers.ValidationError('Nalog sa ovom email adresom već postoji.')
        return value

    def create(self, validated_data):
        sifra = validated_data.pop('sifra')
        zaposleni = Zaposleni(**validated_data, uloga=Zaposleni.Uloga.RADNIK)
        zaposleni.sifra_hash = make_password(sifra)
        zaposleni.save()
        return zaposleni


class LoginSerializer(serializers.Serializer):
    kor_ime_ili_mejl = serializers.CharField()
    sifra = serializers.CharField(write_only=True)


class AzuriranjeProfilaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zaposleni
        fields = ['ime', 'prezime', 'telefon', 'adresa', 'mejl']
        extra_kwargs = {
            'mejl': {'validators': []},
        }

    def validate_mejl(self, value):
        if Zaposleni.objects.filter(mejl=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError('Nalog sa ovom email adresom već postoji.')
        return value


class DodajClanaTimaSerializer(serializers.Serializer):
    zaposleni_id = serializers.IntegerField()


class PromenaStatusaSerializer(serializers.Serializer):
    uloga = serializers.ChoiceField(choices=Zaposleni.Uloga.choices, required=False)
    aktivan = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError('Potrebno je proslediti "uloga" i/ili "aktivan".')
        return attrs


class MolbaSerializer(serializers.ModelSerializer):
    zaposleni_detail = ZaposleniSerializer(source='zaposleni', read_only=True)
    resio_detail = ZaposleniSerializer(source='resio', read_only=True)

    class Meta:
        model = Molba
        fields = [
            'molba_id',
            'zaposleni',
            'zaposleni_detail',
            'naslov',
            'opis',
            'datum_za_koji_se_trazi',
            'status',
            'datum_kreiranja',
            'datum_resenja',
            'resio',
            'resio_detail',
        ]
        read_only_fields = ['status', 'datum_kreiranja', 'datum_resenja', 'resio']


class ObavestenjeSerializer(serializers.ModelSerializer):
    autor_detail = ZaposleniSerializer(source='autor', read_only=True)

    class Meta:
        model = Obavestenje
        fields = [
            'obavestenje_id',
            'naslov',
            'tekst',
            'datum_kreiranja',
            'autor',
            'autor_detail',
            'aktivno',
        ]
        read_only_fields = ['datum_kreiranja']


class SmenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Smena
        fields = ['smena_id', 'broj_nedelje', 'datum_od', 'datum_do']


class SmenaZaposleniSerializer(serializers.ModelSerializer):
    zaposleni_detail = ZaposleniSerializer(source='zaposleni', read_only=True)
    smena_detail = SmenaSerializer(source='smena', read_only=True)

    class Meta:
        model = SmenaZaposleni
        fields = [
            'smena',
            'zaposleni',
            'tip_smene',
            'smena_detail',
            'zaposleni_detail',
        ]


class QrTerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = QrTerminal
        fields = ['terminal_id', 'naziv', 'lokacija', 'aktivan']


class SkeniranjeSerializer(serializers.Serializer):
    token = serializers.CharField()


class EvidencijaSerializer(serializers.ModelSerializer):
    zaposleni_detail = ZaposleniSerializer(source='zaposleni', read_only=True)

    class Meta:
        model = Evidencija
        fields = ['evidencija_id', 'zaposleni', 'zaposleni_detail', 'tip', 'vreme', 'qr_token']
        read_only_fields = ['zaposleni', 'tip', 'vreme', 'qr_token']


class ZadatakSerializer(serializers.ModelSerializer):
    kreirao_detail = ZaposleniSerializer(source='kreirao', read_only=True)
    dodeljeni_detail = ZaposleniSerializer(source='dodeljeni', many=True, read_only=True)

    class Meta:
        model = Zadatak
        fields = [
            'zadatak_id', 'naslov', 'opis', 'datum_kreiranja', 'rok', 'status',
            'kreirao', 'kreirao_detail', 'dodeljeni', 'dodeljeni_detail',
        ]
        read_only_fields = ['datum_kreiranja', 'status', 'kreirao']


class PromenaStatusaZadatkaSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Zadatak.Status.choices)