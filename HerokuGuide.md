# Set up your accounts
## GitHub
Navigate to <https://github.com/join> and follow the on screen prompts to create your account

**Don't forget to write down your details so you can log back in later**

## Heroku
Navigate to <https://signup.heroku.com/> and follow the on screen prompts to create your account

**Don't forget to write down your details so you can log back in later**

# Set up a GitHub Environment
## Option 1: Command Line
Using your terminal, use the `git clone` command to copy the source code

	$ git clone https://github.com/DevanSEdwards/Pit-Market-Game.git
	cloning into 'Pit-Market-Game'...
	remote: Enumerating objects: 429, done.
	remote: Counting objects: 100% (429/429), done.
	remote: Compressing objects: 100% (279/279), done.
	remote: Total 2345 (delta 233), reused 324 (delta 150), pack-reused 1916
	Receiving objects: 100% (2345/2345), 1.59 MiB | 874.00 KiB/s, done.
	Resolving deltas: 100% (1386/1386), done.

Push your local code onto your GitHub account

	$ cd Pit-Market-Game
	Pit-Market-Game$ git push

## Option 1: User Interface
Naviate to the source code url <https://github.com/DevanSEdwards/Pit-Market-Game`> on GitHub

`Clone` The code into your own GitHub environment

# Enable GitHub integration
The Heroku dashboard has a deploy tab which can automatically connect your github to your Heroku server.

Authenticate your GitHub account with Heroku

![GitHub account authentication](https://s3.amazonaws.com/heroku-devcenter-files/article-images/2349-imported-1443570588-2349-imported-1443555058-421-original.jpg)

**You can only have one GitHub account with your Heroku account**

# Set up automatic deployment

When enabled, Heroku will automatically build and deploy any changes to the code

Navigate to deployment settings and tick `Automatic deployment from GitHub are enabled`
Any push to the `master` branch on GitHub will be deployed to the server

![Automatic Deploy](https://s3.amazonaws.com/heroku-devcenter-files/article-images/2349-imported-1443570589-2349-imported-1443555058-423-original.jpg)

# Disconnecting

To disconnect your GitHub from Heroku, navigate to the dashboard and press the `disconnect` button associated with your GitHub account. Automatic syncing will no longer occur.

![Disconnecting](https://s3.amazonaws.com/heroku-devcenter-files/article-images/2349-imported-1443570591-2349-imported-1443555059-434-original.jpg)