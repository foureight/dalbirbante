"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { setWorkerUrl } from "maplibre-gl";
import type { Map, MapLayerMouseEvent, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import zones from "../../data/delivery-zones.json";

const CENTER: [number, number] = [14.578649, 50.143151];

// Turbopack/Next rewrites maplibre's import.meta.url, so the default relative
// worker path 404s. Point at the self-hosted module worker instead.
const MAPLIBRE_WORKER_URL = "/vendor/maplibre/maplibre-gl-worker.mjs";
let workerConfigured = false;

function ensureMaplibreWorker() {
  if (workerConfigured || typeof window === "undefined") return;
  setWorkerUrl(MAPLIBRE_WORKER_URL);
  workerConfigured = true;
}

export function DeliveryMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;
    let styleLoaded = false;
    let popup: Popup | null = null;
    let map: Map | null = null;

    const canUseWebGL2 = () => {
      try {
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext("webgl2"));
      } catch {
        return false;
      }
    };

    if (!canUseWebGL2()) {
      setError("Mapu nelze zobrazit v tomto prohlížeči.");
      return;
    }

    try {
      ensureMaplibreWorker();
      map = new maplibregl.Map({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: CENTER,
        zoom: 11.2,
        attributionControl: false,
      });
    } catch {
      setError("Mapu nelze zobrazit v tomto prohlížeči.");
      return;
    }

    mapRef.current = map;
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    map.on("load", () => {
      if (cancelled || !map) return;

      styleLoaded = true;
      setError("");

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
        if (!map) return;
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
        if (!map) return;
        map.getCanvas().style.cursor = "";
        popup?.remove();
      });

      setReady(true);
    });

    // MapLibre emits "error" for recoverable tile glitches too — only block the
    // UI when the style never loads (e.g. worker/CDN failure).
    map.on("error", () => {
      if (cancelled || styleLoaded) return;
      setError("Mapové podklady se nepodařilo načíst.");
    });

    return () => {
      cancelled = true;
      popup?.remove();
      map?.remove();
      mapRef.current = null;
    };
  }, []);

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
