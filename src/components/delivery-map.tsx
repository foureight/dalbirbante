"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { setWorkerUrl } from "maplibre-gl";
import type { Map, MapLayerMouseEvent, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  buildDeliveryZoneFeatures,
  type DeliveryZoneInput,
} from "@/lib/delivery-towns";

const CENTER: [number, number] = [14.578649, 50.143151];
const MAPLIBRE_WORKER_URL = "/vendor/maplibre/maplibre-gl-worker.mjs";
let workerConfigured = false;

function ensureMaplibreWorker() {
  if (workerConfigured || typeof window === "undefined") return;
  setWorkerUrl(MAPLIBRE_WORKER_URL);
  workerConfigured = true;
}

function zoneBounds(
  features: ReturnType<typeof buildDeliveryZoneFeatures>["features"],
): [[number, number], [number, number]] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const f of features) {
    for (const ring of f.geometry.coordinates) {
      for (const [lng, lat] of ring) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }
  if (!Number.isFinite(minLng)) {
    return [
      [14.48, 50.09],
      [14.72, 50.21],
    ];
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

type Props = {
  className?: string;
  zones: DeliveryZoneInput[];
};

export function DeliveryMap({ className = "", zones }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  const collection = useMemo(
    () => buildDeliveryZoneFeatures(zones || []),
    [zones],
  );

  // Create map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      if (!canvas.getContext("webgl2")) {
        setError("Mapu nelze zobrazit v tomto prohlížeči.");
        return;
      }
    } catch {
      setError("Mapu nelze zobrazit v tomto prohlížeči.");
      return;
    }

    ensureMaplibreWorker();
    let styleLoaded = false;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: CENTER,
      zoom: 10.6,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.on("load", () => {
      styleLoaded = true;
      setError("");

      const el = document.createElement("div");
      el.className = "delivery-map-pin";
      el.title = "Dal Birbante";
      new maplibregl.Marker({ element: el }).setLngLat(CENTER).addTo(map);

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      });
      popupRef.current = popup;

      map.addSource("delivery-zones", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: "zones-fill",
        type: "fill",
        source: "delivery-zones",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.42,
        },
      });
      map.addLayer({
        id: "zones-line",
        type: "line",
        source: "delivery-zones",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2.5,
          "line-opacity": 0.95,
        },
      });

      map.on("mousemove", "zones-fill", (e: MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f?.properties || !e.lngLat) return;
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
        popup.remove();
      });

      setReady(true);
    });

    map.on("error", () => {
      if (styleLoaded) return;
      setError("Mapové podklady se nepodařilo načíst.");
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update polygons whenever CMS zones change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const ordered = [...collection.features].sort(
      (a, b) => Number(b.properties.id) - Number(a.properties.id),
    );
    const source = map.getSource("delivery-zones") as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: ordered,
    } as GeoJSON.FeatureCollection);

    try {
      map.fitBounds(zoneBounds(collection.features), {
        padding: { top: 36, bottom: 36, left: 36, right: 36 },
        maxZoom: 11.2,
        duration: 500,
      });
    } catch {
      // keep view
    }
  }, [collection, ready]);

  const legend = [...collection.features].sort(
    (a, b) => Number(a.properties.id) - Number(b.properties.id),
  );

  return (
    <div className={`delivery-map ${className}`}>
      <div ref={containerRef} className="delivery-map__canvas" />
      {!ready && !error && (
        <div className="delivery-map__status">Načítám mapu…</div>
      )}
      {!ready && error && (
        <div className="delivery-map__status">{error}</div>
      )}
      <ul className="delivery-map__legend" aria-label="Legenda zón">
        {legend.map((f) => (
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
