# Site Chess Backup

This is a Node.js project that utilizes the Chess.com API to backup all the games you've played. It allows you to save the PGN files of each game to a local directory, so you can have a backup copy of your games.

## Motivation

There are several reasons why you may want to backup your games on Chess.com:

1. **Data preservation**: Having a local copy of your games is a way to preserve your data in case of issues with Chess.com or if you decide to cancel your account in the future.
2. **Analysis and study**: By having access to the PGN files of your games, you can import them into chess analysis programs and study your games, identify weaknesses, and improve your play.
3. **Memories and history**: If you enjoy revisiting your past games, having a local backup allows you to have access to your entire game history, even if Chess.com makes changes to how your data is stored.

## Installation

To host the project on your machine, follow the steps below:

1. Make sure you have Node.js installed on your system. You can download Node.js at [https://nodejs.org](https://nodejs.org) and follow the appropriate installation instructions for your operating system.

2. Download the project from the GitHub repository.

3. Navigate to the project's root directory in a terminal.

4. Run the following command to install the project dependencies:

`npm install`


5. After the dependencies installation is complete, you will be ready to run the project.

## Running the Project

To run the project, execute the following commands in the terminal:

`npm start`


After the project successfully runs, you can access it in your browser by entering the following address:

`localhost:3000`

or u can acess the website

`https://chess-backup.onrender.com/`


## How to Use Site Chess Backup

1. Open your browser and go to `http://localhost:3000` or `https://chess-backup.onrender.com/`

2. On the home page, you will see a field to enter your Chess.com username. Enter your username and click the "Backup" button.

3. The project will connect to the Chess.com API to retrieve the PGN files of your games. It will create a directory called "Chess_Backup" and save the PGN files of each game in separate folders by month and year.

4. After the backup is complete, you can find your PGN files in the "Chess_Backup" directory at the root of the project.

