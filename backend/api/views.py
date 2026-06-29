from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Zaposleni, Molba, Obavestenje, Smena, SmenaZaposleni
from .serializers import (
    MolbaSerializer,
    ObavestenjeSerializer,
    SmenaSerializer,
    SmenaZaposleniSerializer,
)


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