# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()
# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
client = Client(account_sid, auth_token)

call = client.calls.create(
    url="https://unswervable-overturnable-kathie.ngrok-free.dev/twilio/voice",
    to="+14378716636",
    from_="+14374757091",
)

print(call.sid)