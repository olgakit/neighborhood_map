/* global google */
import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";

const MyMapComponent = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap defaultZoom={10} zoom={props.zoom} 
      style={props.styles}
      defaultCenter={{ lat: 55.819851, lng: 37.611695 }} center={props.center}
      //"mesfer" custom map styling is borrowed from Snazzy Maps: https://snazzymaps.com/style/230357/mesfer
      defaultOptions={{styles: [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"-3"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#748ca3"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"hue":"#ff0200"},{"saturation":"23"},{"lightness":"20"},{"visibility":"off"}]},{"featureType":"poi.school","elementType":"geometry.fill","stylers":[{"color":"#ffdbda"},{"saturation":"0"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":"100"},{"lightness":31},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#f39247"},{"saturation":"0"}]},{"featureType":"road","elementType":"labels","stylers":[{"hue":"#008eff"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#ffe5e5"},{"saturation":"0"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#ff0200"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":10},{"lightness":69},{"visibility":"on"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}]}}>
      {props.markers && props.markers.filter(marker => marker.isVisible).map((marker,idx)=> {
        const venueDetails = props.venues.find(venue => venue.id === marker.id);
        return <Marker tabIndex="1" id="marker" key={idx} position={{ lat: marker.lat, lng: marker.lng }} 
          onClick={() => props.handleMarkerClick(marker)} 
          onKeyDown={() => props.handleMarkerClick(marker)} 
          //set animation to bounce when marker is clicked
          animation = {marker.isOpen===true
            ? google.maps.Animation.BOUNCE
            : null
          }
          >
          {marker.isOpen && venueDetails.bestPhoto && (
            <InfoWindow >
              <React.Fragment>
                <img src={`${venueDetails.bestPhoto.prefix}175x175${venueDetails.bestPhoto.suffix}`} alt={venueDetails.categories[0].name} />
                <p>{venueDetails.name}</p>
              </React.Fragment>
            </InfoWindow>
          )}
        </Marker>
      })}
    </GoogleMap>
  ))
);



export default class Map extends Component {

  constructor() {
    super();
    this.state = {
      error: false
    };
  }

  componentDidMount() {
    window.gm_authFailure = () => {
      this.setState({ error: true });
    };
  }

  render() {
  
    return(
      <div className="rightSide">
        {!this.state.error && (
          <MyMapComponent
          {...this.props}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=RKAGNFDO10DLQAG34Y0VJSRN3TQSTAYZWFDVKYWDS3TXSJ1Q"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `95%`, width: `100%`}} />}
          mapElement={<div style={{ height: `100%`}} />} 
          /> 
        )}
        {this.state.error && (
          <h3 style={{textAlign: "center", paddingTop: "10em", color: "crimson"}}>Google Map failed to load :'( </h3>
        )}
        
      </div>
      
    );
  }
}


