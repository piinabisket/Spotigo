![SpotigoFrontend](https://github.com/piinabisket/Spotigo/actions/workflows/frontend.yml/badge.svg) ![SpotigoBackend](https://github.com/piinabisket/Spotigo/actions/workflows/backend.yml/badge.svg)

# Spotify BPM Playlist Generator

Spotigo Is an all-in-one solution for discovering and creating playlists based off of BPM.
The core functionality of the site is the playlist generator. It takes in a BPM and automatically
generates a playlist consisting of songs near the given BPM. 
- This would be a useful tool for quickly creating and sharing workout playlists, tailored to your likes and interests.
- Users can share generated playlists, and the site will curate these playlists and allow users to search through the playlist database.
- Users can log in to have their feed and recommendations personalized.


Demo: 


Prototype:
https://www.figma.com/file/xZggrNkc4vgaNoWWnbD3Dv/SpotifyBPM?node-id=0%3A1


Environment Setup:


Code Linter/Style Checker:
https://eslint.org/


Class Diagram:

<img src = 'https://user-images.githubusercontent.com/34257994/205183069-d4ea711c-3335-4003-b7ee-2d92a0d38337.png' width=50% height=50%>


Sequence Diagram for Login Flow:

<img src = 'https://user-images.githubusercontent.com/55904876/205182550-a403e329-0965-49bc-be87-7e653247f641.png' width=50% height=50%>


Code Coverage Report:
|-------------|---------|----------|---------|---------|
| File        | % Stmts | % Branch | % Funcs | % Lines | 
|-------------|---------|----------|---------|---------|
| All files   |   85.33 |     62.5 |     100 |   86.48 |                   
| playlist.js |     100 |      100 |     100 |     100 |                   
| ...utils.js |   84.84 |       50 |     100 |   84.84 |
| user.js     |     100 |      100 |     100 |     100 |                   
| ...utils.js |   83.33 |    66.66 |     100 |   85.71 |  
|-------------|---------|----------|---------|---------|
