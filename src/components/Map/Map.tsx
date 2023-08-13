import styles from './map.module.css'
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, GeoJSON, WMSTileLayer, GeoJSONProps, Popup } from 'react-leaflet'
import L, { LatLngExpression, LatLngTuple, Layer, layerGroup, Map, popup } from 'leaflet';

interface IProps {
    fireGeoJSON: GeoJSON.FeatureCollection | null;
    onFeatureClick: (id: number) => void;
    activeFireId?: number;
}

interface ILayerProperties {
    GEOGRAPHIC_DESCRIPTION: string;
    FIRE_CAUSE: string;
    FIRE_STATUS: string;
    FIRE_ID: number;
    [key: string]: string | number;
}

const formatProperties = (properties: ILayerProperties) => {
    return `
        <h4>${properties.GEOGRAPHIC_DESCRIPTION}</h4>
        <p><strong>Status: </strong> ${properties.FIRE_STATUS}</p>
        <p><strong>Cause: </strong> ${properties.FIRE_CAUSE}</p>
    `
}

export default function Home({ fireGeoJSON, onFeatureClick, activeFireId }: IProps) {
    const mapRef = useRef<Map>(null);

    function onEachFeature(feature: any, layer: Layer) {
        if(feature.properties){
            layer.bindPopup((e: any) => {
              return formatProperties(feature.properties)
            })
          }
        layer.on({
            click: e => {
                onFeatureClick(e.target.feature.properties.FIRE_ID)
            }
        });
    }

    useEffect(() => {
        const feature = (mapRef.current as Map)?.eachLayer((layer) => {
            // @ts-ignore
            // @ts-ignore
            if (layer.feature?.properties.FIRE_ID === activeFireId) {
                layer.openPopup()
                // @ts-ignore
                mapRef.current?.flyTo([layer.feature?.geometry.coordinates[1], layer.feature?.geometry.coordinates[0]], 8)
            }
        })
    }, [activeFireId])

    return (
        <MapContainer className={styles.map} center={[50, -123]} zoom={6} scrollWheelZoom={true} ref={mapRef}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fireGeoJSON && (
                <GeoJSON key={JSON.stringify(fireGeoJSON)} data={fireGeoJSON} onEachFeature={onEachFeature} />
            )}
        </MapContainer>
    )
}
