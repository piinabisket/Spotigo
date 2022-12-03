import { useEffect, useState } from "react";
import axios from 'axios'
import "./css/home_auth.css"
import { Link } from 'react-router-dom';

export default function HomeAuth() {
    const [popular_playlists, setPopularPlaylists] = useState([]);
    const [liked_and_generated_playlists, setLikedAndGeneratedPlaylists] = useState([]);

    // Backend call to retreive all the playlists
    async function get_popular_playlists() {
        try {
            const response = await axios.get('https://spotigo.azurewebsites.net/home');
            return response.data.playlist_list;
        }
        catch (error) {
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }
    }

    // On window load, use the above method to load in the popular playlists
    useEffect(() => {
        get_popular_playlists().then(result => {
            if (result)
                setPopularPlaylists(result);
        });
    }, []);

    // Parse the user's access token from the URL
    const getTokenFromUrl = (hash) => {
        const accessToken = hash.substring(1);
        const paramsInUrl = accessToken.split('&');
        const paramsSplit = paramsInUrl.reduce((accumulater, currentValue) => {
            const [key, value] = currentValue.split('=');
            accumulater[key] = value;
            return accumulater;
        }, {});
        return paramsSplit;
    }

    // Spotify API call to get the user's email; used in useEffect below
    async function get_user_email() {
        const url = "https://api.spotify.com/v1/me";
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            }
        });
        localStorage.setItem("email", data.email);

        const response = await axios({
            method: 'get',
            url: 'https://spotigo.azurewebsites.net/users?email=' + data.email,
        });

        console.log(response.data.users_list.length);

        if (response.data.users_list.length === 0) {
            try {
                await axios.post('https://spotigo.azurewebsites.net/users', { email: data.email});

            } catch (error) {
                console.log(error);
            }
        }

        return data.email;
    }

    // On window load, load the user's accesstoken, token type, expiration, and email into local storage
    useEffect(() => {
        if (window.location.hash.includes("access_token")) {
            localStorage.clear();
            const {
                access_token,
                expires_in,
                token_type,
            } = getTokenFromUrl(window.location.hash);
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("tokenType", token_type);
            localStorage.setItem("expiresIn", expires_in);
            get_user_email();
        }
    }, []);

    async function get_liked_and_generated_playlists() {

        // Used in loop at the bottom to get playlist from the database
        async function fetch_playlist(id) {
            try {
                const response = await axios.get(('https://spotigo.azurewebsites.net/generated/' + id));
                return response.data.playlist_list[0];
            }
            catch (error) {
                //We're not handling errors. Just logging into the console.
                console.log(error);
                return false;
            }
        }

        // Get the user's email
        const url = "https://api.spotify.com/v1/me";
        const { data } = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.accessToken}`,
            }
        });

        // Use the user's email to generate a set of the user's liked and generated playlists (no duplicates!)
        let playlists;
        try {
            const response = await axios.get(('https://spotigo.azurewebsites.net/users?email=' + data.email));
            playlists = [...new Set([...response.data.users_list[0].liked_songs, ...response.data.users_list[0].generated_songs])]
        }
        catch (error) {
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }

        // For loop to convert the array of ids into an array of playlist json objects
        let playlist_jsons = [];
        let promises = [];
        for (let i = 0; i < playlists.length; i++) {
            promises.push(fetch_playlist(playlists[i]).then(response => {
                playlist_jsons.push(response);
            }))
        };

        // wait for the promises form axios to be resolved then return it
        await Promise.all(promises).then(() => console.log(playlist_jsons));
        return playlist_jsons;
    }

    // Use the above method to load in the user's liked and generated playlists
    useEffect(() => {
        get_liked_and_generated_playlists().then(result => {
            if (result)
                setLikedAndGeneratedPlaylists(result);
        });
    }, []);

    // HTML (what the user sees)
    return (
        <div>
            <h1 className="home-header">
                <Link to="/home">
                    <svg text-anchor="center" vertical-align="center" width="50" height="43" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clip-rule="evenodd" d="M23 42C34.4819 42 43.7898 32.598 43.7898 21C43.7898 20.1962 43.7451 19.4029 43.658 18.6225L38.9425 19.903L35.8553 25.3C35.836 25.3369 35.8159 25.3736 35.7951 25.41C34.9078 26.9611 32.9467 27.4949 31.4149 26.6024C29.883 25.7099 29.3605 23.729 30.2477 22.1779L30.2618 22.1536L30.261 22.1532L34.6984 14.3959L34.6968 14.3898L41.9778 12.4127C38.728 5.09608 31.4532 0 23 0C11.5182 0 2.21027 9.40202 2.21027 21C2.21027 22.9999 2.48703 24.9346 3.00399 26.767C2.97617 26.6674 2.94903 26.5675 2.92256 26.4672C2.6208 25.3239 2.41905 24.1772 2.31188 23.0363L7.36872 21.6632L10.4561 16.266C10.4753 16.2292 10.4954 16.1925 10.5162 16.1561C11.4035 14.6051 13.3646 14.0712 14.8964 14.9638C16.4283 15.8563 16.9508 17.8372 16.0635 19.3883L16.0495 19.4126L16.0503 19.413L11.6128 27.1703L11.6144 27.1764L3.88651 29.2749C7.06602 36.7584 14.427 42 23 42ZM15.835 33.5973C14.3095 32.7087 13.7888 30.7371 14.6722 29.1935L26.1223 9.1842C27.0057 7.64057 28.9584 7.10951 30.484 7.99804C32.0095 8.88658 32.5301 10.8582 31.6468 12.4019L20.1967 32.4111C19.3133 33.9548 17.3605 34.4858 15.835 33.5973Z" fill="black" />
                    </svg>
                </Link>
                Spotigo
            </h1>
            <div className="home-w-login">
                <Link to='/generator'>
                    <button type='button' className="playlist-button" position="sticky">New Playlist</button>
                </Link>
                <h1 className="title" >Welcome</h1>
                <div className="line-under-welcome"></div>
                <h1 className="popular-playlists-title">Popular Playlists</h1>

                <div className="playlist-list">
                    {
                        // This is a for loop to load in the user's liked and generated playlists into html format
                        popular_playlists.map((row, index) => {
                            if (index === 0) {
                                return (
                                    <div key={index} className="playlist-tile">
                                        <div className="overlap-group">
                                            <Link to={'/playlist/' + row.sid}>
                                                <img className="album-cover-home" src={row.album_cover} alt={index}></img>
                                            </Link>
                                            <h1 className="playlist-title-home">{row.name}</h1>
                                            <h1 className="playlist-BPM-home">{row.bpm} BPM</h1>
                                            <h1 className="playlist-description-home">{row.description}</h1>
                                        </div>
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={index} className="playlist-tile-1">
                                        <div className="overlap-group">
                                            <Link to={'/playlist/' + row.sid}>
                                                <img className="album-cover-home" src={row.album_cover} alt={index}></img>
                                            </Link>
                                            <h1 className="playlist-title-home">{row.name}</h1>
                                            <h1 className="playlist-BPM-home">{row.bpm} BPM</h1>
                                            <h1 className="playlist-description-home">{row.description}</h1>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                </div>
                <h1 className="liked-and-generated">Liked and Generated Playlists</h1>
                <div class="playlist-list">
                    {
                        // This is a for loop to load in the user's liked and generated playlists into html format
                        liked_and_generated_playlists.map((row, index) => {
                            console.log(row);
                            if (index === 0) {
                                return (
                                    <div key={index} className="playlist-tile">
                                        <div className="overlap-group">
                                            <Link to={'/playlist/' + row.sid}>
                                                <img className="album-cover-home" src={row.album_cover} alt={index}></img>
                                            </Link>
                                            <h1 className="playlist-title-home">{row.name}</h1>
                                            <h1 className="playlist-BPM-home">{row.bpm} BPM</h1>
                                            <h1 className="playlist-description-home">{row.description}</h1>
                                        </div>
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={index} className="playlist-tile">
                                        <div className="overlap-group">
                                            <Link to={'/playlist/' + row.sid}>
                                                <img className="album-cover-home" src={row.album_cover} alt={index}></img>
                                            </Link>
                                            <h1 className="playlist-title-home">{row.name}</h1>
                                            <h1 className="playlist-BPM-home">{row.bpm} BPM</h1>
                                            <h1 className="playlist-description-home">{row.description}</h1>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
}
