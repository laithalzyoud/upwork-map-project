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
  accessToken:'pk.eyJ1IjoiYXRsYXNtYXBnZW4iLCJhIjoiY2swbmxlN2M4MDB5ejNibWxjMXVvdGNvYSJ9.UsZbpfrkOq-cccfmnIzwPg'
});

const circleLayout = { visibility: 'visible' };
const circlePaint = {
    'circle-color': [
        'match',
        ['get', 'category'],
        'bars', '#f7e1bf', //White
        'beauty', '#7b2809', //Yellow
        'godStores', '#242919', //Red
        'gods', '#042986', //Green
        'grocery', '#b9b464', //Green
        'utensils', '#1c5d7d', //Green
        'PlasticGoods', '#4c8fc2', //Green
        'Restaurants', '#d9d508', //Green
        'Toys', '#95a5b2', //Green

        /* other */ '#ffa500' //Orange
    ],
    // 'circle-stroke-color': 'black',
    // 'circle-stroke-width': 2,
};

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
        center: [78.471951, 17.375770],
        zoom: [18],
        circle: undefined,
        circleText: "",
        bounds:[
          [78.4640121459961, 17.370545115450106], // Southwest coordinates
          [78.47946166992188, 17.38414271445477] // Northeast coordinates
          ]
      };
      this.mapRef = React.createRef();
      this.onToggleHover = this.onToggleHover.bind(this);
  }

  onToggleHover(cursor,circle) {
    this.mapRef.getCanvas().style.cursor = cursor;
    if(circle)
      this.fetchGeocoding(circle.geometry.coordinates[0],circle.geometry.coordinates[1])
    else
      this.setState({circleText:""})
    this.setState({circle})
  }

  fetchGeocoding(lng,lat) {
    fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&location_type=ROOFTOP&key=AIzaSyB65tXEZQaBs23p1LToMJPX6z0C0xjJHiI")
    .then(response => response.json()).then(data => 
      {
        if(data.results) 
          this.setState({circleText: data.results[0].formatted_address})
      })
  }

    mapLoaded(el) {
        this.mapRef = el;
        this.addImageSources();
        this.addVideoSources();
    }

    addImageSources() {

      let imageCoordinates = 
          [
            [
              78.46813201904297,
              17.376248448229056
            ],
            [
              78.46877574920654,
              17.376248448229056
            ],
            [
              78.46877574920654,
              17.37688839818374
            ],
            [
              78.46813201904297,
              17.37688839818374
            ]
          ]
      this.mapRef.addSource('imstreamImage', {
          type: 'image',
          url: "https://upload.wikimedia.org/wikipedia/en/9/95/Test_image.jpg",
          coordinates: imageCoordinates
      });
  }

  addVideoSources() {

    let videoCoordinates = 
      [
        [
          78.4695053100586,
          17.37770241129391
        ],
        [
          78.47014367580414,
          17.37770241129391
        ],
        [
          78.47014367580414,
          17.3782297260311
        ],
        [
          78.4695053100586,
          17.3782297260311
        ]
      ]
    this.mapRef.addSource('imstreamVideo', {
      'type': 'video',
      'urls': [
          'https://static-assets.mapbox.com/mapbox-gl-js/drone.mp4',
          'https://static-assets.mapbox.com/mapbox-gl-js/drone.webm'
        ],
        coordinates: videoCoordinates
    });
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
        properties={feature.properties}
      />
      )}    
      </Layer>
      )

    return (
      <div className="App">
        <Map
          style="mapbox://styles/atlasmapgen/ckduj8k7u182l19nwt71r2cya"
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
                {this.state.circleText}
              </div>
            </StyledPopup>
          </Popup>
        )}

        <Layer
          type={'raster'}
          sourceId={'imstreamImage'}
        />

        <Layer
          type={'raster'}
          sourceId={'imstreamVideo'}
        />
        </Map>
      </div>
    );  
  }
}

export default App;
