"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map, MapLayerMouseEvent, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import zones from "../../data/delivery-zones.json";

const CENTER: [number, number] = [14.578649, 50.143151];

export function DeliveryMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let popup: Popup | null = null;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: CENTER,
      zoom: 11.2,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.on("load", () => {
      if (cancelled) return;

      const ordered = [...zones.features].sort(
        (a, b) => Number(b.properties.id) - Number(a.properties.id),
      );

      map.addSource("delivery-zones", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: ordered,
        } as GeoJSON.FeatureCollection,
      });

      map.addLayer({
        id: "zones-fill",
        type: "fill",
        source: "delivery-zones",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.28,
        },
      });

      map.addLayer({
        id: "zones-line",
        type: "line",
        source: "delivery-zones",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
          "line-opacity": 0.9,
        },
      });

      const el = document.createElement("div");
      el.className = "delivery-map-pin";
      el.title = "Dal Birbante";
      new maplibregl.Marker({ element: el }).setLngLat(CENTER).addTo(map);

      popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      });

      map.on("mousemove", "zones-fill", (e: MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f?.properties || !e.lngLat || !popup) return;
        const p = f.properties;
        popup
          .setLngLat(e.lngLat)
          .setHTML(
            `<strong>${p.name}</strong><br/>${p.areas}<br/><span>Rozvoz: ${p.fee}</span>`,
          )
          .addTo(map);
      });

      map.on("mouseleave", "zones-fill", () => {
        map.getCanvas().style.cursor = "";
        popup?.remove();
      });

      setReady(true);
    });

    map.on("error", () => {
      if (!cancelled) setError("Mapové podklady se nepodařilo načíst.");
    });

    return () => {
      cancelled = true;
      popup?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className={`delivery-map ${className}`}>
      <div ref={containerRef} className="delivery-map__canvas" />
      {!ready && !error && (
        <div className="delivery-map__status">Načítám mapu…</div>
      )}
      {error && <div className="delivery-map__status">{error}</div>}
      <ul className="delivery-map__legend" aria-label="Legenda zón">
        {zones.features.map((f) => (
          <li key={f.properties.id}>
            <span
              className="delivery-map__swatch"
              style={{ background: f.properties.color }}
            />
            <span>
              {f.properties.name} · {f.properties.fee}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
