import React, { Component } from 'react';
import './App.css';
import SquareAPI from './API/';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import UpperMenu from './components/UpperMenu';


class App extends Component {
  constructor() {
    super();
    this.state = {
      venues: [],
      markers: [],
      center: [],
      zoom: 12.9,
      styles: [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"-3"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#748ca3"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":"23"},{"lightness":"20"},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#ffdbda"},{"saturation":"0"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":"100"},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#f39247"},{"saturation":"0"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#008eff"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#ffe5e5"},{"saturation":"0"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}],
      updateSuperState: obj => {
        this.setState(obj);
      }
    }
    this.toggleSideBar = this.toggleSideBar.bind(this);
  }
  
  closeAllMarkers = () => {
    const markers = this.state.markers.map(marker => {
      marker.isOpen = false;
      return marker;
    });
    this.setState({ markers: Object.assign(this.state.markers, markers) });
  }

  
  handleMarkerClick = marker => {
    //first close any prev open markers
    this.closeAllMarkers();
    marker.isOpen = true;
    
    this.setState({ markers: Object.assign(this.state.markers, marker) });
    const venue = this.state.venues.find(venue => venue.id === marker.id);
    //link current marker with the venue info
    SquareAPI.getVenueDetails(marker.id).then( res => {
      const newLocation = Object.assign(venue, res.response.venue);
      this.setState({venues: Object.assign(this.state.venues, newLocation)});
    });

    //hide sidebar when marker or venue is clicked and the window is less than 499px
    const sidebar = document.getElementById("sidebar");
    if (window.matchMedia("(max-width: 499px)").matches) {
      ((sidebar.style.maxWidth = '0%') && (sidebar.style.minWidth = '0%'));
    } else if (window.matchMedia("(mix-width: 500px)").matches){
      ((sidebar.style.maxWidth = '25%') && (sidebar.style.minWidth = '250px'));
    }
    //if esc is pressed, close open marker
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 27) {
        this.closeAllMarkers();
      }
    });
  }

  handleOneLocationClick = venue => {
    const marker = this.state.markers.find(marker => marker.id === venue.id);
    this.handleMarkerClick(marker);
  }

  componentDidMount() {
    SquareAPI.search({
      near: "Moscow, Russia",
      query: "музеи",
      limit: 30
    }).then(results => {
      const { venues } = results.response;
      const { center } = results.response.geocode.feature.geometry;
      const markers = venues.map(venue => {
        return {
          lat: venue.location.lat,
          lng: venue.location.lng,
          isOpen: false,
          isVisible: true,
          id: venue.id
        };
      });
      this.setState({venues, center, markers});
    }).catch(error => {
      alert('The following error occurred while loading: ' + error);
    });
  }
  //hide or show SideBar on the burger icon click 
  toggleSideBar () {
    const sidebar = document.getElementById("sidebar");

    if((sidebar.style.maxWidth === '25%') || (sidebar.style.minWidth === '250px')) {
      (sidebar.style.maxWidth = '0%') && (sidebar.style.minWidth = '0%');
    } else {
      (sidebar.style.maxWidth = '25%') && (sidebar.style.minWidth = '250px');
    }
  }


  render() {
    return(
      <div className="App"> 
        <Sidebar {...this.state} 
        handleOneLocationClick = {this.handleOneLocationClick}
        />
        <div className="rightSide" role="application">
          <UpperMenu 
          toggleSideBar={this.toggleSideBar}
          />
          <Map {...this.state} handleMarkerClick = {this.handleMarkerClick}/>
        </div>
      </div>
    );
  }
}

export default App;
