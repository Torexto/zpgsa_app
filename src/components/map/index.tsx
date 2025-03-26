import {LayerGroup, LayersControl, MapContainer, useMap} from "react-leaflet";
import BusesContainer from "./BusesContainer";
import MarkerClusterGroup from "react-leaflet-markercluster";
import StopsContainer from "./StopsContainer";
import {createClusterCustomIcon} from "../../icons";

import 'leaflet/dist/leaflet.css';
import {useEffect} from "react";
import localforage from "localforage";
import L from "leaflet";

const MyMap = () => {
    localforage.config({
        name: "tileCache",
    });

    class CachedTileLayer extends L.TileLayer {
        constructor(url: string, options: L.TileLayerOptions) {
            super(url, options);
        }

        createTile(coords: L.Coords, done: (error?: Error, tile?: HTMLElement) => void): HTMLElement {
            const tile = document.createElement("img");
            tile.setAttribute("role", "presentation");

            const url = this.getTileUrl(coords);

            // Try to load from cache
            localforage.getItem<string>(url).then((cachedData) => {
                if (cachedData) {
                    tile.src = cachedData; // Load from cache
                } else {
                    fetch(url)
                        .then((response) => response.blob())
                        .then((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const base64data = reader.result as string;
                                localforage.setItem(url, base64data);
                                tile.src = base64data;
                            };
                            reader.readAsDataURL(blob);
                        })
                        .catch((err) => console.error("Failed to fetch tile:", err));
                }
            });

            tile.onload = () => done(undefined, tile);
            tile.onerror = () => done(new Error("Tile load error"));

            return tile;
        }
    }

    const CachedTileLayerComponent = () => {
        const map = useMap();

        useEffect(() => {
            const cachedTileLayer = new CachedTileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            });

            cachedTileLayer.addTo(map);
            map.invalidateSize();

            return () => {
                map.removeLayer(cachedTileLayer);
            };
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
            <CachedTileLayerComponent />

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