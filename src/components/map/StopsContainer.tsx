import React, {useEffect, useRef} from "react";
import {Stop, StopInfo, StopInfoBus} from "../../types";
import {Marker} from "react-leaflet";
import L, {divIcon, point} from "leaflet";
import {renderToStaticMarkup} from "react-dom/server";
import {useStorage} from "../useStorage";
import {getStopDetails} from "../../filterStopDetails";

const stopIcon = divIcon({
    html: `<span>1</span>`,
    className: "stop-icon",
    iconSize: point(15, 15, true),
});

const StopPopup = ({stop, stopInfo}: { stop: Stop, stopInfo: StopInfo | null }) => {
    return (
        <div>
            <div style={{textAlign: "center", fontWeight: 600}}>
                {stop.city} {stop.name} ({stop.id})
            </div>
            {stopInfo && stopInfo?.id === stop.id && (
                <div>
                    {stopInfo?.buses.map((bus: StopInfoBus, i: number) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 5,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    columnGap: "5px",
                                }}
                            >
                                <div style={{width: "32px", textAlign: "center"}}>
                                    {bus.line}
                                </div>
                                <div>{bus.destination}</div>
                            </div>
                            <div>{bus.time}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};


const StopMarker = React.memo(({stop}: { stop: Stop }) => {
    const markerRef = useRef<L.Marker | null>(null);

    const {data} = useStorage();
    const {stopsDetails} = data!;

    const getStopInfoHandler = async () => {
        const stopInfo = getStopDetails(stop.id, stopsDetails)
        const content = renderToStaticMarkup(<StopPopup stop={stop} stopInfo={stopInfo}/>);
        markerRef.current?.unbindPopup();
        const popup = new L.Popup({}).setContent(content);
        markerRef.current?.bindPopup(popup).openPopup();
    }

    return (
        <Marker
            key={stop.id}
            position={[stop.lat, stop.lon]}
            icon={stopIcon}
            ref={markerRef}
            eventHandlers={{click: getStopInfoHandler}}
        />
    );
});

function StopsContainer() {
    const {data} = useStorage();
    const {stops} = data!;

    return stops.map((stop) => (
        <StopMarker
            key={stop.id}
            stop={stop}
        />
    ));
}

export default StopsContainer;
