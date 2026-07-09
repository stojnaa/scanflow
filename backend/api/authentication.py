from datetime import datetime, timedelta, timezone as dt_timezone

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from .models import Zaposleni

JWT_ALGORITHM = 'HS256'


def generate_token(zaposleni):
    now = datetime.now(dt_timezone.utc)
    payload = {
        'zaposleni_id': zaposleni.zaposleni_id,
        'uloga': zaposleni.uloga,
        'iat': now,
        'exp': now + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)


class ZaposleniJWTAuthentication(authentication.BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode('utf-8')
        if not auth_header or not auth_header.startswith(f'{self.keyword} '):
            return None

        token = auth_header[len(self.keyword) + 1:].strip()
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token je istekao.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Nevažeći token.')

        try:
            zaposleni = Zaposleni.objects.get(zaposleni_id=payload['zaposleni_id'], aktivan=True)
        except Zaposleni.DoesNotExist:
            raise exceptions.AuthenticationFailed('Korisnik ne postoji ili je deaktiviran.')

        return (zaposleni, token)

    def authenticate_header(self, request):
        return self.keyword
