import React from 'react'
import "./css/table.css"

function Table(props) {
  return (
    <table className='fixed'>
      <TableBody playlistData={props.playlistData} />
    </table>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th></th>
        <th>Title</th>
        <th>Album</th>
        <th>Length</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.playlistData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{<img className="track-image" src={row.picture} alt=""></img>}</td>
        <td>{<h1 className="song-name">{row.name}<br></br><h1 className="artist">{row.artist}</h1></h1>}</td>
        <td>{<h1 className='album-and-length'>{row.album}</h1>}</td>
        <td>{<h1 className='album-and-length'>{row.length}</h1>}</td>
      </tr>
    );
  });
  return (
    <tbody>
      {rows}
    </tbody>
  );
}

export default Table;