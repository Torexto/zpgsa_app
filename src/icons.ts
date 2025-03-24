// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {divIcon, MarkerCluster, point} from "leaflet";

const createClusterCustomIcon = (cluster: MarkerCluster) => {
    return divIcon({
        html: `<span>${cluster.getChildCount()}</span>`,
        className: "stop-icon",
        iconSize: point(15, 15, true),
    });
};

export {createClusterCustomIcon};