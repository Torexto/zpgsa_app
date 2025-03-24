import {LayerGroup, LayersControl, MapContainer, TileLayer, useMap} from "react-leaflet";
import BusesContainer from "./BusesContainer";
import MarkerClusterGroup from "react-leaflet-markercluster";
import StopsContainer from "./StopsContainer";
import {createClusterCustomIcon} from "../../icons";

import 'leaflet/dist/leaflet.css';
import {useEffect} from "react";

const MyMap = () => {

    const FixMapSize = () => {
        const map = useMap();

        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }, [map]);

        return null;
    };

    return (
        <MapContainer
            center={[50.71, 16.63]}
            zoom={13}
            scrollWheelZoom={true}
            preferCanvas={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FixMapSize />

            <LayersControl position="topright">
                <LayersControl.Overlay name="Autobusy" checked>
                    <LayerGroup>
                        <BusesContainer />
                    </LayerGroup>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Przystanki" checked>
                    <LayerGroup>
                        <MarkerClusterGroup
                            iconCreateFunction={createClusterCustomIcon}
                            chunkedLoading
                            showCoverageOnHover={false}
                            maxClusterRadius={50}
                            spiderfyOnMaxZoom={false}
                            zoomToBoundsOnClick={true}
                            disableClusteringAtZoom={18}
                        >
                            <StopsContainer />
                        </MarkerClusterGroup>
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    )
}

export default MyMap;