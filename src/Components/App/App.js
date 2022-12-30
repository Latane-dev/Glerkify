import React from 'react';
import './App.css';
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [] 
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const tracks = this.state.playlistTracks;
    const combinedTracks = [];
    const checkPlaylist = (e) => e.id === track.id;

    if (tracks.some(checkPlaylist) === false) {
      combinedTracks.push(track);
    };

    const newPlaylist = tracks.concat(combinedTracks);
    this.setState({playlistTracks : newPlaylist})
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({playlistTracks : tracks});
  }

  updatePlaylistName(name){
    this.setState({ playlistName: name })

  }

  savePlaylist(){
    const tracks = this.state.playlistTracks;
    const trackURIs = tracks.map (currentTrack => currentTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({ playlistName: 'New Playlist',
                      playlistTracks: [] })
    })
  }

  search(term){
    Spotify.search(term).then(searchTerms => {
      this.setState({searchResults: searchTerms})
    });
  }

  render() {
    return (
      <div>
        <h1><span className="highlight">Glerk</span>ify</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
  )}

  componentDidMount() {
    window.addEventListener('load', Spotify.search(''));
  }
  
}



export default App;
