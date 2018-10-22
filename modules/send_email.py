import os
import smtplib
import csv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def send(gameID,email):
    """Send GameData CSV in an email to the recipient"""

    # Filename will always be the same.
    filename = 'gameData_'+gameID+'.csv'
    # Gmail account created for the project
    email_user = 'pitmarketgame@gmail.com'
    #TODO Password field to be kept in a local config file (not to be uploaded to Git)
    email_password = os.environ.get('gmail_password')
    print(email_password)
    if email_password is None:
        return
    email_send = email

    subject = 'Pit Market Game Data for Game: ' + str(gameID)

    attachment = open(filename,'rb')

    # Code for setting up the email fields and connecting to the SMTP Server (gmail)
    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = email_send
    msg['Subject'] = subject

    body = 'Attached is the game data for Game: ' + str(gameID)
    msg.attach(MIMEText(body,'plain'))

    part = MIMEBase('application','octet-stream')
    part.set_payload((attachment).read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition',"attachment; filename= "+filename)

    msg.attach(part)
    text = msg.as_string()
    try:
        server = smtplib.SMTP('smtp.gmail.com',587)
        server.starttls()
        server.login(email_user,email_password)

        server.sendmail(email_user,email_send,text)
        print("Sent email to:",email_send)
        server.quit()     
    except Exception as e:
        print(e)
    attachment.close()
    remove_csv(gameID)

def remove_csv(gameID):
        """To be called when the game is started to remove previous game data CSV"""
        filename = 'gameData_'+gameID+'.csv'
        if os.path.isfile(filename):
            os.remove(filename)
