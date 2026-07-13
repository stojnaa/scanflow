import csv
import hashlib
import secrets
from collections import defaultdict
from datetime import timedelta

from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from django.db.models import Count, OuterRef, Subquery, Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .authentication import generate_token
from .models import (
    Zaposleni, Tim, Molba, Obavestenje, Smena, SmenaZaposleni,
    QrTerminal, QrToken, Evidencija, Zadatak,
)
from .permissions import JeAdmin, JeMenadzerIliAdmin
from .serializers import (
    AzuriranjeProfilaSerializer,
    DodajClanaTimaSerializer,
    EvidencijaSerializer,
    LoginSerializer,
    MolbaSerializer,
    ObavestenjeSerializer,
    PromenaStatusaSerializer,
    PromenaStatusaZadatkaSerializer,
    QrTerminalSerializer,
    RegistracijaSerializer,
    SkeniranjeSerializer,
    SmenaSerializer,
    SmenaZaposleniSerializer,
    TimSerializer,
    ZadatakSerializer,
    ZaposleniDetailSerializer,
    ZaposleniSerializer,
    KreiranjeTimaSerializer,
)

QR_TOKEN_TRAJANJE_SEKUNDI = 30


@api_view(['POST'])
@permission_classes([AllowAny])
def registracija(request):
    serializer = RegistracijaSerializer(data=request.data)
    if serializer.is_valid():
        zaposleni = serializer.save()
        token = generate_token(zaposleni)
        return Response(
            {'token': token, 'zaposleni': ZaposleniDetailSerializer(zaposleni).data},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def prijava(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    identifikator = serializer.validated_data['kor_ime_ili_mejl']
    sifra = serializer.validated_data['sifra']

    try:
        zaposleni = Zaposleni.objects.get(Q(kor_ime=identifikator) | Q(mejl=identifikator))
    except Zaposleni.DoesNotExist:
        return Response({'error': 'Pogrešno korisničko ime/email ili lozinka.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not zaposleni.aktivan or not check_password(sifra, zaposleni.sifra_hash):
        return Response({'error': 'Pogrešno korisničko ime/email ili lozinka.'}, status=status.HTTP_401_UNAUTHORIZED)

    token = generate_token(zaposleni)
    return Response({'token': token, 'zaposleni': ZaposleniDetailSerializer(zaposleni).data})


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def moj_profil(request):
    zaposleni = request.user

    if request.method == 'GET':
        return Response(ZaposleniDetailSerializer(zaposleni).data)

    serializer = AzuriranjeProfilaSerializer(zaposleni, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(ZaposleniDetailSerializer(zaposleni).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lista_timova(request):
    timovi = Tim.objects.all().order_by('naziv')
    return Response(TimSerializer(timovi, many=True).data)
@api_view(['POST'])
@permission_classes([JeMenadzerIliAdmin])
def kreiraj_tim(request):
    serializer = KreiranjeTimaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    tim = Tim.objects.create(
        naziv=serializer.validated_data['naziv'],
        menadzer=request.user,
    )

    return Response(TimSerializer(tim).data, status=status.HTTP_201_CREATED)
@api_view(['GET'])
@permission_classes([JeMenadzerIliAdmin])
def menadzer_lista_radnika(request):
    radnici = Zaposleni.objects.filter(
        uloga=Zaposleni.Uloga.RADNIK,
        aktivan=True
    ).order_by('prezime', 'ime')

    serializer = ZaposleniSerializer(radnici, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([JeMenadzerIliAdmin])
def dodaj_radnika_u_tim(request, tim_id):
    try:
        tim = Tim.objects.get(pk=tim_id)
    except Tim.DoesNotExist:
        return Response({'error': 'Tim ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = DodajClanaTimaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        zaposleni = Zaposleni.objects.get(zaposleni_id=serializer.validated_data['zaposleni_id'])
    except Zaposleni.DoesNotExist:
        return Response({'error': 'Zaposleni ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    if tim.clanovi.filter(pk=zaposleni.pk).exists():
        return Response({'error': 'Zaposleni je već član ovog tima.'}, status=status.HTTP_400_BAD_REQUEST)

    tim.clanovi.add(zaposleni)
    return Response(TimSerializer(tim).data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([JeMenadzerIliAdmin])
def promeni_status_zaposlenog(request, zaposleni_id):
    try:
        zaposleni = Zaposleni.objects.get(zaposleni_id=zaposleni_id)
    except Zaposleni.DoesNotExist:
        return Response({'error': 'Zaposleni ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    # Menadzer ne sme da menja status administratora, niti da nekog unapredi u administratora.
    nova_uloga = request.data.get('uloga')
    if request.user.uloga != Zaposleni.Uloga.ADMIN and (
        zaposleni.uloga == Zaposleni.Uloga.ADMIN or nova_uloga == Zaposleni.Uloga.ADMIN
    ):
        return Response(
            {'error': 'Samo administrator može menjati status administratora ili dodeliti tu ulogu.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    serializer = PromenaStatusaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    for polje, vrednost in serializer.validated_data.items():
        setattr(zaposleni, polje, vrednost)
    zaposleni.save()

    return Response(ZaposleniDetailSerializer(zaposleni).data)


@api_view(['GET'])
@permission_classes([JeAdmin])
def admin_lista_zaposlenih(request):
    zaposleni = Zaposleni.objects.all().order_by('prezime', 'ime')
    return Response(ZaposleniDetailSerializer(zaposleni, many=True).data)


@api_view(['GET'])
@permission_classes([JeAdmin])
def admin_detalji_zaposlenog(request, zaposleni_id):
    try:
        zaposleni = Zaposleni.objects.get(zaposleni_id=zaposleni_id)
    except Zaposleni.DoesNotExist:
        return Response({'error': 'Zaposleni ne postoji.'}, status=status.HTTP_404_NOT_FOUND)
    return Response(ZaposleniDetailSerializer(zaposleni).data)


@api_view(['GET'])
def aktivna_obavestenja(request):
    obavestenja = Obavestenje.objects.filter(aktivno=True).order_by('-datum_kreiranja')
    serializer = ObavestenjeSerializer(obavestenja, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def menadzer_obavestenja(request):
    if request.method == 'GET':
        obavestenja = Obavestenje.objects.all().order_by('-datum_kreiranja')
        serializer = ObavestenjeSerializer(obavestenja, many=True)
        return Response(serializer.data)

    serializer = ObavestenjeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH', 'DELETE'])
def menadzer_obavestenje_detail(request, obavestenje_id):
    try:
        obavestenje = Obavestenje.objects.get(obavestenje_id=obavestenje_id)
    except Obavestenje.DoesNotExist:
        return Response({'error': 'Obaveštenje ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PATCH':
        serializer = ObavestenjeSerializer(obavestenje, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    obavestenje.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def kreiraj_molbu(request):
    serializer = MolbaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(status='NA_CEKANJU')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def moje_molbe(request, zaposleni_id):
    molbe = Molba.objects.filter(zaposleni_id=zaposleni_id).order_by('-datum_kreiranja')
    serializer = MolbaSerializer(molbe, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def menadzer_molbe(request):
    molbe = Molba.objects.all().order_by('-datum_kreiranja')
    serializer = MolbaSerializer(molbe, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
def odobri_molbu(request, molba_id):
    try:
        molba = Molba.objects.get(molba_id=molba_id)
    except Molba.DoesNotExist:
        return Response({'error': 'Molba ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    if molba.status != 'NA_CEKANJU':
        return Response({'error': 'Molba je već rešena.'}, status=status.HTTP_400_BAD_REQUEST)

    menadzer_id = request.data.get('menadzer_id')

    molba.status = 'ODOBRENA'
    molba.datum_resenja = timezone.now()

    if menadzer_id:
        molba.resio_id = menadzer_id

    molba.save()
    serializer = MolbaSerializer(molba)
    return Response(serializer.data)


@api_view(['PATCH'])
def odbij_molbu(request, molba_id):
    try:
        molba = Molba.objects.get(molba_id=molba_id)
    except Molba.DoesNotExist:
        return Response({'error': 'Molba ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    if molba.status != 'NA_CEKANJU':
        return Response({'error': 'Molba je već rešena.'}, status=status.HTTP_400_BAD_REQUEST)

    menadzer_id = request.data.get('menadzer_id')

    molba.status = 'ODBIJENA'
    molba.datum_resenja = timezone.now()

    if menadzer_id:
        molba.resio_id = menadzer_id

    molba.save()
    serializer = MolbaSerializer(molba)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def menadzer_smene(request):
    if request.method == 'GET':
        smene = Smena.objects.all().order_by('-datum_od')
        serializer = SmenaSerializer(smene, many=True)
        return Response(serializer.data)

    serializer = SmenaSerializer(data=request.data)
    if serializer.is_valid():
        datum_od = serializer.validated_data.get('datum_od')
        datum_do = serializer.validated_data.get('datum_do')

        if datum_do < datum_od:
            return Response(
                {'error': 'Datum do ne može biti pre datuma od.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def dodaj_radnika_u_smenu(request, smena_id):
    zaposleni_id = request.data.get('zaposleni_id')
    tip_smene = request.data.get('tip_smene')

    if not zaposleni_id or not tip_smene:
        return Response(
            {'error': 'Potrebni su zaposleni_id i tip_smene.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if tip_smene not in ['PRVA', 'DRUGA', 'TRECA']:
        return Response(
            {'error': 'Tip smene mora biti PRVA, DRUGA ili TRECA.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        smena = Smena.objects.get(smena_id=smena_id)
    except Smena.DoesNotExist:
        return Response({'error': 'Smena ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        zaposleni = Zaposleni.objects.get(zaposleni_id=zaposleni_id)
    except Zaposleni.DoesNotExist:
        return Response({'error': 'Zaposleni ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    if SmenaZaposleni.objects.filter(
        smena=smena,
        zaposleni=zaposleni,
        tip_smene=tip_smene
    ).exists():
        return Response({'error': 'Radnik je već dodat u tu smenu.'}, status=status.HTTP_400_BAD_REQUEST)

    veza = SmenaZaposleni.objects.create(
        smena=smena,
        zaposleni=zaposleni,
        tip_smene=tip_smene
    )

    serializer = SmenaZaposleniSerializer(veza)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def ukloni_radnika_iz_smene(request, smena_id, zaposleni_id, tip_smene):
    deleted_count, _ = SmenaZaposleni.objects.filter(
        smena_id=smena_id,
        zaposleni_id=zaposleni_id,
        tip_smene=tip_smene
    ).delete()

    if deleted_count == 0:
        return Response({'error': 'Veza smene i zaposlenog ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def moje_smene(request, zaposleni_id):
    veze = SmenaZaposleni.objects.filter(zaposleni_id=zaposleni_id).order_by('-smena__datum_od')
    serializer = SmenaZaposleniSerializer(veze, many=True)
    return Response(serializer.data)


# ---------------------------------------------------------------------------
# QR terminali i evidencija (check-in / check-out)
# ---------------------------------------------------------------------------

def _hash_token(sirovi_token):
    return hashlib.sha256(sirovi_token.encode()).hexdigest()


def _cache_key(terminal_id):
    return f'qr_terminal_{terminal_id}_token'


@api_view(['GET', 'POST'])
@permission_classes([JeMenadzerIliAdmin])
def menadzer_terminali(request):
    if request.method == 'GET':
        terminali = QrTerminal.objects.all().order_by('naziv')
        return Response(QrTerminalSerializer(terminali, many=True).data)

    serializer = QrTerminalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def qr_kod_za_terminal(request, terminal_id):
    """
    Terminal (ekran na ulazu) periodično poziva ovu rutu da dobije kod za prikaz.
    Dokle god postoji token koji još nije istekao, vraća se isti (QR na ekranu ostaje
    stabilan u okviru intervala); čim istekne, prethodni se deaktivira i generiše se nov -
    ovo je algoritam rotacije QR koda na fiksni vremenski interval.

    U bazi (QrToken.token_hash) čuva se samo heš tokena, nikad sirova vrednost - QR kod
    tako ostaje neupotrebljiv za bilo koga ko bi eventualno pročitao bazu.
    """
    try:
        terminal = QrTerminal.objects.get(pk=terminal_id, aktivan=True)
    except QrTerminal.DoesNotExist:
        return Response({'error': 'Terminal ne postoji ili nije aktivan.'}, status=status.HTTP_404_NOT_FOUND)

    sada = timezone.now()
    aktivan_token = terminal.tokeni.filter(aktivan=True, vreme_isteka__gt=sada).order_by('-vreme_generisanja').first()
    sirovi_token = aktivan_token and cache.get(_cache_key(terminal.qr_terminal_id))

    if aktivan_token is None or sirovi_token is None:
        QrToken.objects.filter(terminal=terminal, aktivan=True).update(aktivan=False)

        sirovi_token = secrets.token_urlsafe(32)
        aktivan_token = QrToken.objects.create(
            terminal=terminal,
            token_hash=_hash_token(sirovi_token),
            vreme_isteka=sada + timedelta(seconds=QR_TOKEN_TRAJANJE_SEKUNDI),
        )
        cache.set(_cache_key(terminal.qr_terminal_id), sirovi_token, timeout=QR_TOKEN_TRAJANJE_SEKUNDI)

    return Response({
        'token': sirovi_token,
        'terminal': terminal.qr_terminal_id,
        'vreme_isteka': aktivan_token.vreme_isteka,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def skeniraj_qr(request):
    """
    Check-in / check-out skeniranjem: tip zapisa se automatski određuje na osnovu
    poslednjeg zapisa zaposlenog (naizmenično CHECK_IN -> CHECK_OUT -> CHECK_IN ...).
    """
    serializer = SkeniranjeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    sirovi_token = serializer.validated_data['token']

    try:
        qr_token = QrToken.objects.get(token_hash=_hash_token(sirovi_token), aktivan=True)
    except QrToken.DoesNotExist:
        return Response({'error': 'Nevažeći QR kod.'}, status=status.HTTP_400_BAD_REQUEST)

    if qr_token.vreme_isteka <= timezone.now():
        return Response({'error': 'QR kod je istekao, skenirajte ponovo.'}, status=status.HTTP_400_BAD_REQUEST)

    zaposleni = request.user
    poslednja = Evidencija.objects.filter(zaposleni=zaposleni).order_by('-vreme').first()
    novi_tip = (
        Evidencija.Tip.CHECK_IN
        if poslednja is None or poslednja.tip == Evidencija.Tip.CHECK_OUT
        else Evidencija.Tip.CHECK_OUT
    )

    evidencija = Evidencija.objects.create(zaposleni=zaposleni, tip=novi_tip, qr_token=qr_token)
    return Response(EvidencijaSerializer(evidencija).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def moja_evidencija(request, zaposleni_id):
    evidencije = Evidencija.objects.filter(zaposleni_id=zaposleni_id).order_by('-vreme')
    return Response(EvidencijaSerializer(evidencije, many=True).data)


@api_view(['GET'])
@permission_classes([JeMenadzerIliAdmin])
def prisutni_na_poslu(request):
    """Zaposleni čiji je hronološki poslednji zapis u Evidenciji tipa CHECK_IN."""
    poslednja_evidencija = Evidencija.objects.filter(zaposleni=OuterRef('pk')).order_by('-vreme')

    zaposleni_na_poslu = Zaposleni.objects.filter(aktivan=True).annotate(
        poslednji_tip=Subquery(poslednja_evidencija.values('tip')[:1]),
        poslednje_vreme=Subquery(poslednja_evidencija.values('vreme')[:1]),
    ).filter(poslednji_tip=Evidencija.Tip.CHECK_IN)

    rezultat = [
        {
            'zaposleni': ZaposleniSerializer(z).data,
            'vreme_dolaska': z.poslednje_vreme,
        }
        for z in zaposleni_na_poslu
    ]
    return Response(rezultat)


# ---------------------------------------------------------------------------
# Zadaci
# ---------------------------------------------------------------------------

@api_view(['GET', 'POST'])
@permission_classes([JeMenadzerIliAdmin])
def menadzer_zadaci(request):
    if request.method == 'GET':
        zadaci = Zadatak.objects.all().order_by('-datum_kreiranja')
        return Response(ZadatakSerializer(zadaci, many=True).data)

    serializer = ZadatakSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(kreirao=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def moji_zadaci(request, zaposleni_id):
    zadaci = Zadatak.objects.filter(dodeljeni__zaposleni_id=zaposleni_id).order_by('rok')
    return Response(ZadatakSerializer(zadaci, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def promeni_status_zadatka(request, zadatak_id):
    try:
        zadatak = Zadatak.objects.get(pk=zadatak_id)
    except Zadatak.DoesNotExist:
        return Response({'error': 'Zadatak ne postoji.'}, status=status.HTTP_404_NOT_FOUND)

    je_dodeljen = zadatak.dodeljeni.filter(pk=request.user.pk).exists()
    je_privilegovan = request.user.uloga in (Zaposleni.Uloga.MENADZER, Zaposleni.Uloga.ADMIN)
    if not je_dodeljen and not je_privilegovan:
        return Response({'error': 'Zadatak vam nije dodeljen.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = PromenaStatusaZadatkaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    zadatak.status = serializer.validated_data['status']
    zadatak.save()
    return Response(ZadatakSerializer(zadatak).data)


# ---------------------------------------------------------------------------
# Statistika i CSV izveštaj
# ---------------------------------------------------------------------------

def _zavrsene_smene(datum_od=None, datum_do=None):
    """
    Uparuje svaki CHECK_IN sa hronološki sledećim CHECK_OUT-om istog zaposlenog i vraća
    listu (zaposleni_id, vreme_dolaska, vreme_odlaska). Nezavršeni dolasci (npr. zaposleni
    je trenutno na poslu) se ne računaju u sate.
    """
    upit = Evidencija.objects.all().order_by('zaposleni_id', 'vreme')
    if datum_od:
        upit = upit.filter(vreme__gte=datum_od)
    if datum_do:
        upit = upit.filter(vreme__lte=datum_do)

    otvoreni_dolasci = {}
    zavrsene = []
    for zapis in upit:
        if zapis.tip == Evidencija.Tip.CHECK_IN:
            otvoreni_dolasci[zapis.zaposleni_id] = zapis.vreme
        elif zapis.tip == Evidencija.Tip.CHECK_OUT and zapis.zaposleni_id in otvoreni_dolasci:
            dolazak = otvoreni_dolasci.pop(zapis.zaposleni_id)
            zavrsene.append((zapis.zaposleni_id, dolazak, zapis.vreme))
    return zavrsene


def _sati_izmedju(pocetak, kraj):
    return (kraj - pocetak).total_seconds() / 3600


@api_view(['GET'])
@permission_classes([JeMenadzerIliAdmin])
def menadzer_statistika_radni_sati(request):
    datum_od = request.query_params.get('od')
    datum_do = request.query_params.get('do')

    sati_po_zaposlenom = defaultdict(float)
    for zaposleni_id, dolazak, odlazak in _zavrsene_smene(datum_od, datum_do):
        sati_po_zaposlenom[zaposleni_id] += _sati_izmedju(dolazak, odlazak)

    if request.user.uloga == Zaposleni.Uloga.MENADZER:
        zaposleni_qs = Zaposleni.objects.filter(timovi__menadzer=request.user).distinct()
    else:
        zaposleni_qs = Zaposleni.objects.filter(aktivan=True)

    rezultat = [
        {
            'zaposleni': ZaposleniSerializer(z).data,
            'radni_sati': round(sati_po_zaposlenom.get(z.zaposleni_id, 0.0), 2),
        }
        for z in zaposleni_qs
    ]
    return Response(rezultat)


@api_view(['GET'])
@permission_classes([JeAdmin])
def admin_statistika(request):
    ukupno_sati = sum(_sati_izmedju(d, o) for _, d, o in _zavrsene_smene())

    zadaci_po_statusu = dict(
        Zadatak.objects.values_list('status').annotate(broj=Count('zadatak_id')).order_by()
    )
    zadaci_po_statusu = {status_key: broj for status_key, broj in zadaci_po_statusu.items()}

    return Response({
        'broj_zaposlenih': Zaposleni.objects.filter(aktivan=True).count(),
        'broj_timova': Tim.objects.count(),
        'broj_zaposlenih_na_poslu': _broj_prisutnih(),
        'ukupno_radnih_sati': round(ukupno_sati, 2),
        'zadaci_po_statusu': zadaci_po_statusu,
    })


def _broj_prisutnih():
    poslednja_evidencija = Evidencija.objects.filter(zaposleni=OuterRef('pk')).order_by('-vreme')
    return Zaposleni.objects.filter(aktivan=True).annotate(
        poslednji_tip=Subquery(poslednja_evidencija.values('tip')[:1]),
    ).filter(poslednji_tip=Evidencija.Tip.CHECK_IN).count()


@api_view(['GET'])
@permission_classes([JeMenadzerIliAdmin])
def admin_statistika_export_csv(request):
    zavrsene = _zavrsene_smene()
    sati_po_mesecu = defaultdict(float)
    for zaposleni_id, dolazak, odlazak in zavrsene:
        kljuc = (zaposleni_id, dolazak.strftime('%Y-%m'))
        sati_po_mesecu[kljuc] += _sati_izmedju(dolazak, odlazak)

    zaposleni_mapa = {z.zaposleni_id: z for z in Zaposleni.objects.all()}

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="statistika_radni_sati.csv"'

    pisac = csv.writer(response)
    pisac.writerow(['zaposleni_id', 'ime', 'prezime', 'mesec', 'radni_sati'])

    for (zaposleni_id, mesec), sati in sorted(sati_po_mesecu.items(), key=lambda stavka: stavka[0]):
        zaposleni = zaposleni_mapa.get(zaposleni_id)
        pisac.writerow([
            zaposleni_id,
            zaposleni.ime if zaposleni else '',
            zaposleni.prezime if zaposleni else '',
            mesec,
            round(sati, 2),
        ])

    return response