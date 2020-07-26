import React from 'react';
import styled from 'styled-components';
import './App.css';
/** Mapbox React bindings */
import ReactMapboxGl, {
  Popup,
  ScaleControl,
  ZoomControl,
  RotationControl,
  Layer,
  Feature
} from 'react-mapbox-gl';

import PointGroups from './points/points';

const Map = ReactMapboxGl({
  minZoom: 17,
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
  "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
  "tileSize": 256
  }
  },
  "layers": [{
  "id": "simple-tiles",
  "type": "raster",
  "source": "raster-tiles",
  "minzoom": 17,
  "maxzoom": 19
  }]
}

const StyledPopup = styled.div`
background: white;
color: #3f618c;
font-weight: 400;
padding: 5px;
border-radius: 2px;
`;
class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        center: [78.4727594999999, 17.386106],
        zoom: [18],
        circle: undefined,
        bounds:[
          [78.461681, 17.370974], // Southwest coordinates
          [78.478309, 17.381066] // Northeast coordinates
          ]
      };
      this.mapRef = React.createRef();
      this.onToggleHover = this.onToggleHover.bind(this);
  }

  onToggleHover(cursor,circle) {
    this.mapRef.getCanvas().style.cursor = cursor;
    this.setState({circle})
  }

  mapLoaded(el) {
    this.mapRef = el;
  }


  render() {

    const {center, zoom, circle,bounds} = this.state;

    const renderedFeatures = PointGroups.map((group,key) => 
      <Layer key = {key} type="circle" id={"circles-"+key} layout={circleLayout} paint={circlePaint}>
      {group.features.map((feature,featureKey) =>
        <Feature
        key={featureKey}
        onMouseEnter={this.onToggleHover.bind(this, 'pointer',feature)}
        onMouseLeave={this.onToggleHover.bind(this, '',undefined)}
        coordinates={feature.geometry.coordinates}
        properties={{"colorProp":"c"+key}}
      />
      )}    
      </Layer>
      )

    return (
      <div className="App">
        <Map
          style={mapStyle}
          containerStyle={{
              height: '100vh',
              width: '100vw',
              flex: 1,
          }}
          center={center}
          zoom={zoom}
          onStyleLoad={el => this.mapLoaded(el)}
          maxBounds={bounds}
        >

          <ScaleControl />
          <ZoomControl/>
          <RotationControl style={{ marginTop: 10 }} />
          {renderedFeatures}
          {circle && (
          <Popup coordinates={circle.geometry.coordinates}>
            <StyledPopup>
              <div>{circle.properties.name}</div>
              <div>
                {circle.properties.description}
              </div>
            </StyledPopup>
          </Popup>
        )}
        </Map>
      </div>
    );  
  }
}

export default App;
