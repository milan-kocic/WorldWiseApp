import React, { useEffect, useState } from 'react';
import styles from './Map.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { useCities } from '../context/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [searchParams] = useSearchParams();
  //ovde koristimo isLoading: isLoadingPostion, zato što već koristimo isLoading iz drugih state-a,
  //pa smo ga na ovaj način druga;ije definisali (imenovali), inače u suprotnom bi smo samo pisali isLoading,
  //i ne bi bilo potrebe da pišemo isLoading: isLoading, tako isto i za position
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition
  } = useGeolocation();
  const mapLat = searchParams.get('lat');
  const mapLng = searchParams.get('lng');

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  //! U onClick eventu uobicajno se f-ja poziva arrow f-jom, ali ovde ne:
  //! Kada se funkcija ne koristi kao metoda objekta ili nije vezana za this, kao što je slučaj sa
  //! getPosition funkcijom u vašem kodu, nije neophodno koristiti arrow funkciju kao dodatni sloj za pravilan poziv.
  //! U takvim slučajevima, možete proslijediti getPosition funkciju direktno kao referencu u onClick događaj.
  //! U getPosition funkciji se koristi objekat navigator.geolocation koji pruža metodu getCurrentPosition.
  //! Ta metoda nije vezana za this kontekst unutar vašeg koda,
  //! već je globalna metoda koja je dostupna putem navigator.geolocation objekta u pregledaču.
  //! Dakle, u ovom slučaju, nije potrebno brinuti o this kontekstu u vezi sa getPosition funkcijom.
  //! Možete je jednostavno pozvati kao običnu funkciju
  //! Ova linija će izvršiti funkciju getPosition koja je definisana unutar useGeolocation hook-a
  //! i pokrenuti proces dobavljanja geolokacije.

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => navigate(`?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  });
}

export default Map;
