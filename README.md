# Pit-Market-Game
UWA CITS3200 Project

See the project in action on heroku: https://pit-market-game.herokuapp.com/

The purpose of this project is to bring the Pit Market Game to the web. Pit Market Game is currently played in economics classrooms with playing cards and face-to-face interaction. As universities move more towards online teaching, an online format is derisable.

The rules of the game are simple and can be found here: http://www.people.virginia.edu/~cah2k/pitmkttr.pdf

| Name  | Purpose | Location
| ------------- | ------------- | ------------- |
| Scope of Work  | The formal scope of work document.  |   |
| Requirements Gathering Q/A  | Requirement questions to be asked and briefly answered.  |   |
| Team Availability  | Record of when each team member is free.  |  |
| Team Time Sheet  | The 'Group Time Sheet' deliverable.  |   |
| Team Booked Hours Sheet  | The 'Book Hours Sheet' deliverable.  |   |

# Setup for Developers
Install git

	https://git-scm.com/downloads

Clone the repository

	> cd folder_address
	> git clone https://github.com/DevanSEdwards/Pit-Market-Game.git

Install python 3.6

	https://www.python.org/downloads/release/python-366/

Install pip (a package manager for python):

	> curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
	> python get-pip.py

Install pipenv (equivalent of npm for python, manages Pipfile and Pipfile.lock):

	> pip install pipenv

Make sure you are in the project/repo folder, eg:

	> cd Pit-Market-Game

Create a virtual environment

	> pipenv --python 3.6

Install dependancies specified in the Pipfile (tornado)

	> pipenv install

Check tornado is installed

	> pipenv graph

I recommend using GitHub desktop to manage the repo, as the console can be tedious.

# Running and Debugging

To run the app locally run

    > python main.py
  
and go to localhost:5000 in your browser.

Live changes to code and logging of GET/POST requests are enabled by default. All your code changes will apply instantly - just reload the page. To run Pit-Market-Game without these features call:

	> python -O main.py

# Testing

I've added pytest to the pipfile so make sure you have all dependancies:

	> pipenv shell
	> pipenv install

and whenever you want to run a test (only works inside the pipenv shell):

	> python -m pytest

You can add python tests to the testing folder, look at the one  already there as an example.

# Links

Tornado:
	http://www.tornadoweb.org/en/stable/

See the project in action on heroku:
	https://pit-market-game.herokuapp.com/
	
Game description pdf:
	http://www.people.virginia.edu/~cah2k/pitmkttr.pdf

Example tornado multi-room chat server:
	https://www.jpablo128.com/multi-room-websockets-server-with-tornado-i-basic-chat-server/
	
Google Drive:
	https://drive.google.com/drive/folders/1QuscT1pQLv0z7QZeiM_7syboxs7yO7DS?usp=sharing
