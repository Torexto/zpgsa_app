import {useEffect, useState} from "react";
import {Bus} from "../../types";
import axios from "axios";
import {Marker, Popup} from "react-leaflet";
import {divIcon, point} from "leaflet";

const baseApi: string = import.meta.env.VITE_BASE_API;

const createBusIcon = (bus: Bus) => {
    return divIcon({
        html: `<div class="line-number">${bus.line}</div>`,
        className: `bus ${bus.icon}`,
        iconSize: point(30, 30, true),
    });
}

function BusesContainer() {
    const [buses, setBuses] = useState<Bus[]>();

    useEffect(() => {
        const interval = setInterval(() => {
            axios
                .get(`${baseApi}/buses`)
                .then((data) => setBuses(data.data))
                .catch(() => {});
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return buses?.map((bus) => (
        <Marker
            key={bus.id}
            position={[bus.lat, bus.lon]}
            icon={createBusIcon(bus)}
            zIndexOffset={10}
        >
            <Popup>
                <div>
                    Linia {bus.line} | {bus.label}
                </div>
                <div>{bus.destination}</div>
                <div>Odchyłka: {bus.deviation}</div>
            </Popup>
        </Marker>
    ));
}

export default BusesContainer;
