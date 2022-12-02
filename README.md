![SpotigoFrontend](https://github.com/piinabisket/Spotigo/actions/workflows/frontend.yml/badge.svg) ![SpotigoBackend](https://github.com/piinabisket/Spotigo/actions/workflows/backend.yml/badge.svg)

# Spotify BPM Playlist Generator - Spotigo!

<a href="https://www.spotigo.site">Spotigo</a> is an all-in-one solution for discovering and creating playlists based off of BPM.
The core functionality of the site is the playlist generator. It takes in a BPM and automatically
generates a playlist consisting of songs near the given BPM. 
- This would be a useful tool for quickly creating and sharing workout playlists, tailored to your likes and interests.
- Users can share generated playlists, and the site will curate these playlists and allow users to search through the playlist database.
- Users can log in to have their feed and recommendations personalized.


<h1>Demo:</h1> 


<h1>Prototype:</h1>
https://www.figma.com/proto/xZggrNkc4vgaNoWWnbD3Dv/SpotifyBPM?page-id=0%3A1&node-id=0%3A3&viewport=177%2C352%2C0.19&scaling=scale-down&starting-point-node-id=0%3A3

<h1>Environment Setup:</h1>

This React project was created with npm, node.js, and express.json.
To set up:
First, check if you have npm installed by running 
```npm -v```. If you do not have npm installed, go to  https://nodejs.org/en/download/ and install it according to your operating system.
All of the project's packages and dependencies can be installed with 
```npm ci```. To allow for testing, run
```npm install --save-dev jest```. Both
the frontend and the backend can be run with the command
```npm start```
in their respective folders.

<h1>Code Linter/Style Checker:</h1>

This project uses <a href='https://eslint.org/'>eslint</a> as it's linter and style checker.
It can be installed with 
```npm install eslint --global ```
and run with
```npx eslint .```
or
```npm test```.

<h1> Class Diagram: </h1>

<img src = 'https://github.com/piinabisket/Spotigo/blob/main/materials/Class%20Diagram.png?raw=true' width=50% height=50%>

<h1> Sequence Diagram for Login Flow: </h1>

<img src = 'https://github.com/piinabisket/Spotigo/blob/main/materials/Sequence%20Diagram.png?raw=true' width=50% height=50%>

<h1> Code Coverage Report: </h1>

| File        | % Stmts | % Branch | % Funcs | % Lines |
|-------------|---------|----------|---------|---------|
| All files   |   85.33 |     62.5 |     100 |   86.48 |
| playlist.js |     100 |      100 |     100 |     100 |
| ...utils.js |   84.84 |       50 |     100 |   84.84 |
| user.js     |     100 |      100 |     100 |     100 |
| ...utils.js |   83.33 |    66.66 |     100 |   85.71 |

