import React from 'react';
import logo from './logo.svg';
import './App.css';
/** Mapbox React bindings */
import ReactMapboxGl, {
  Popup,
  ScaleControl,
  ZoomControl,
  RotationControl,
  GeoJSONLayer,
} from 'react-mapbox-gl';

import PointGroups from './points/points';

const Map = ReactMapboxGl({
  minZoom: 10,
  maxZoom: 19,
  attributionControl: false,
});

const circleLayout = { visibility: 'visible' };
const circlePaint = {
    'circle-color': [
        'match',
        ['get', 'colorProp'],
        'c1', '#FFFFFF', //White
        'c2', '#FFFF66', //Yellow
        'c3', '#FF0000', //Red
        'c4', '#00FF00', //Green
        /* other */ '#ffa500' //Orange
    ],
    'circle-stroke-color': 'black',
    'circle-stroke-width': 2,
};

const mapStyle = {
  "version": 8,
  "sources": {
  "raster-tiles": {
  "type": "raster",
  "tiles": [ "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
  "tileSize": 256
  }
  },
  "layers": [{
  "id": "simple-tiles",
  "type": "raster",
  "source": "raster-tiles",
  "minzoom": 0,
  "maxzoom": 22
  }]
}

var bounds = [
  [78.461681, 17.370974], // Southwest coordinates
  [78.478309, 17.381066] // Northeast coordinates
  ];

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        showPopup: false
      };
      this.mapRef = React.createRef();
      this.onToggleHover = this.onToggleHover.bind(this);
  }
  /**
   * This method is triggered when the user hovers the mouse over an image stream marker. The mouse cursor becomes a pointer. 
   * @param {*} cursor  Value of the cursor style. (e.g. pointer or default)
   * @public
   */
  onToggleHover(event,cursor) {
    this.mapRef.getCanvas().style.cursor = cursor;
  }

  circleClicked(e) {
    console.log(e)
    this.setState({showPopup:!this.state.showPopup})
  }
  mapLoaded(el) {
    this.mapRef = el;
  }
  render() {

    const renderedPointGroups = PointGroups.map((group,key) =>
        <GeoJSONLayer
        id={'geojson-'+key}
        data={group}
        circleLayout={circleLayout}
        circlePaint={circlePaint}
        circleOnMouseEnter={e => this.onToggleHover(e,'pointer')}
        circleOnMouseLeave={e => this.onToggleHover(e,'')}
        circleOnClick={e => this.circleClicked(e)}
    />
    )
    return (
      <div className="App">
        <Map
          ref={this.mapRef}
          style={mapStyle}
          containerStyle={{
              height: '100vh',
              width: '100vw',
              flex: 1,
          }}
          center={[78.4727594999999, 17.386106]}
          zoom={[18]}
          onStyleLoad={el => this.mapLoaded(el)}

          // maxBounds={bounds}
        >

          {renderedPointGroups}
          <ScaleControl />
          <ZoomControl/>
          <RotationControl style={{ marginTop: 10 }} />

          {this.state.showPopup ? <Popup
            coordinates={this.state.popupCoord}
            offset={{
              'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
            }}>
            <h1>BHAVANI WINE SHOP</h1>
          </Popup> : null}
        </Map>
      </div>
    );  
  }
}

export default App;
