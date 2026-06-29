from rest_framework import serializers
from .models import Zaposleni, Molba, Obavestenje, Smena, SmenaZaposleni


class ZaposleniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zaposleni
        fields = ['zaposleni_id', 'ime', 'prezime', 'mejl', 'uloga']


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