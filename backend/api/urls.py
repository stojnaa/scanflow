from django.urls import path
from . import views

urlpatterns = [
    path('auth/registracija/', views.registracija, name='registracija'),
    path('auth/prijava/', views.prijava, name='prijava'),

    path('profil/', views.moj_profil, name='moj_profil'),

    path('timovi/', views.lista_timova, name='lista_timova'),

    path('obavestenja/', views.aktivna_obavestenja, name='aktivna_obavestenja'),

    path('molbe/', views.kreiraj_molbu, name='kreiraj_molbu'),
    path('molbe/moje/<int:zaposleni_id>/', views.moje_molbe, name='moje_molbe'),

    path('smene/moje/<int:zaposleni_id>/', views.moje_smene, name='moje_smene'),

    path('menadzer/timovi/<int:tim_id>/dodaj-radnika/', views.dodaj_radnika_u_tim, name='dodaj_radnika_u_tim'),
    path('menadzer/zaposleni/<int:zaposleni_id>/status/', views.promeni_status_zaposlenog, name='promeni_status_zaposlenog'),

    path('admin/zaposleni/', views.admin_lista_zaposlenih, name='admin_lista_zaposlenih'),
    path('admin/zaposleni/<int:zaposleni_id>/', views.admin_detalji_zaposlenog, name='admin_detalji_zaposlenog'),

    path('menadzer/obavestenja/', views.menadzer_obavestenja, name='menadzer_obavestenja'),
    path('menadzer/obavestenja/<int:obavestenje_id>/', views.menadzer_obavestenje_detail, name='menadzer_obavestenje_detail'),

    path('menadzer/molbe/', views.menadzer_molbe, name='menadzer_molbe'),
    path('menadzer/molbe/<int:molba_id>/odobri/', views.odobri_molbu, name='odobri_molbu'),
    path('menadzer/molbe/<int:molba_id>/odbij/', views.odbij_molbu, name='odbij_molbu'),

    path('menadzer/smene/', views.menadzer_smene, name='menadzer_smene'),
    path('menadzer/smene/<int:smena_id>/dodaj-radnika/', views.dodaj_radnika_u_smenu, name='dodaj_radnika_u_smenu'),
    path(
        'menadzer/smene/<int:smena_id>/ukloni-radnika/<int:zaposleni_id>/<str:tip_smene>/',
        views.ukloni_radnika_iz_smene,
        name='ukloni_radnika_iz_smene'
    ),
]