"use client";

import { useEffect, useRef } from "react";
import { Application, Container, Graphics, Text } from "pixi.js";
import type { ProofBraid } from "@/lib/types";

type ProofBraidCanvasProps = {
  braid: ProofBraid;
  activeSampleId?: string;
  frozen?: boolean;
  onSelectSample?: (sampleId: string) => void;
};

const COLORS = {
  graphite: 0x17191f,
  paper: 0xf7f4ed,
  coral: 0xff5c35,
  blue: 0x2a6ff2,
  lime: 0xb8f35d,
  muted: 0x9c9a94,
};

export function ProofBraidCanvas({
  braid,
  activeSampleId,
  frozen = false,
  onSelectSample,
}: ProofBraidCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSampleRef = useRef(activeSampleId);
  const redrawRef = useRef<() => void>(() => undefined);
  activeSampleRef.current = activeSampleId;

  useEffect(() => {
    if (!hostRef.current || !canvasRef.current) return;
    let cancelled = false;
    let app: Application | null = null;
    let observer: ResizeObserver | null = null;

    async function mount() {
      const host = hostRef.current;
      const canvas = canvasRef.current;
      if (!host || !canvas) return;
      const instance = new Application();
      await instance.init({
        canvas,
        width: Math.max(host.clientWidth, 320),
        height: Math.max(host.clientHeight, 330),
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      if (cancelled) {
        instance.destroy();
        return;
      }
      app = instance;

      const draw = () => {
        if (!app || !host) return;
        const width = Math.max(host.clientWidth, 320);
        const height = Math.max(host.clientHeight, 330);
        app.renderer.resize(width, height);
        app.stage.removeChildren();

        const scene = new Container();
        app.stage.addChild(scene);

        const capabilities = braid.capabilities.length
          ? braid.capabilities
          : ["add-capability"];
        const sampleIds = [...new Set(braid.links.map((link) => link.sample_id))];
        const laneTop = 64;
        const laneBottom = height - 46;
        const laneGap =
          capabilities.length > 1
            ? (laneBottom - laneTop) / (capabilities.length - 1)
            : 0;
        const startX = 72;
        const endX = Math.max(startX + 160, width - 74);
        const sampleGap =
          sampleIds.length > 1
            ? (endX - startX) / (sampleIds.length - 1)
            : 0;

        const rails = new Graphics();
        capabilities.forEach((capability, index) => {
          const y = laneTop + index * laneGap;
          rails
            .moveTo(20, y)
            .lineTo(width - 20, y)
            .stroke({
              color: frozen ? COLORS.graphite : COLORS.muted,
              width: frozen ? 1.5 : 1,
              alpha: frozen ? 0.38 : 0.26,
            });
          const label = new Text({
            text: capability.toUpperCase().replaceAll("-", " "),
            style: {
              fontFamily: "IBM Plex Mono",
              fontSize: 9,
              fontWeight: "500",
              fill: COLORS.graphite,
              letterSpacing: 0,
            },
          });
          label.x = 20;
          label.y = Math.max(4, y - 25);
          scene.addChild(label);
        });
        scene.addChildAt(rails, 0);

        const links = new Graphics();
        braid.links.forEach((link) => {
          const sampleIndex = Math.max(0, sampleIds.indexOf(link.sample_id));
          const capabilityIndex = Math.max(
            0,
            capabilities.indexOf(link.capability),
          );
          const x = startX + sampleIndex * sampleGap;
          const y = laneTop + capabilityIndex * laneGap;
          const bend = Math.max(22, Math.min(58, sampleGap / 2 || 34));
          links
            .moveTo(x, 30)
            .bezierCurveTo(x + bend, 30, x - bend, y, x, y)
            .stroke({
              color:
                sampleIndex % 3 === 0
                  ? COLORS.coral
                  : sampleIndex % 3 === 1
                    ? COLORS.blue
                    : COLORS.lime,
              width: frozen ? 4 : 2.5,
              alpha: frozen ? 0.88 : 0.68,
            });
          links
            .circle(
              x,
              y,
              activeSampleRef.current === link.sample_id ? 8 : 5,
            )
            .fill({
              color:
                activeSampleRef.current === link.sample_id
                  ? COLORS.graphite
                  : COLORS.paper,
            })
            .stroke({ color: COLORS.graphite, width: 1.5 });
        });
        scene.addChild(links);

        sampleIds.forEach((sampleId, index) => {
          const x = startX + index * sampleGap;
          const active = activeSampleRef.current === sampleId;
          const token = new Graphics();
          token
            .roundRect(x - 22, 8, 44, 30, 3)
            .fill({
              color: active
                ? COLORS.graphite
                : index % 2 === 0
                  ? COLORS.coral
                  : COLORS.blue,
            })
            .stroke({ color: COLORS.graphite, width: 1 });
          token.eventMode = "static";
          token.cursor = "pointer";
          token.hitArea = { contains: (px, py) => px >= -22 && px <= 22 && py >= 8 && py <= 38 };
          token.on("pointertap", () => onSelectSample?.(sampleId));
          const number = new Text({
            text: String(index + 1).padStart(2, "0"),
            style: {
              fontFamily: "IBM Plex Mono",
              fontSize: 11,
              fontWeight: "500",
              fill: active ? COLORS.paper : COLORS.graphite,
              letterSpacing: 0,
            },
          });
          number.anchor.set(0.5);
          number.x = x;
          number.y = 23;
          scene.addChild(token, number);
        });

        const status = new Text({
          text: frozen
            ? `${braid.frozen_link_count} LINKS / BRAID LOCKED`
            : `${braid.link_count} LINKS / OPEN WEAVE`,
          style: {
            fontFamily: "IBM Plex Mono",
            fontSize: 10,
            fontWeight: "500",
            fill: COLORS.graphite,
            letterSpacing: 0,
          },
        });
        status.x = 20;
        status.y = height - 25;
        scene.addChild(status);
      };

      draw();
      redrawRef.current = draw;
      observer = new ResizeObserver(draw);
      observer.observe(host);
    }

    void mount();
    return () => {
      cancelled = true;
      redrawRef.current = () => undefined;
      observer?.disconnect();
      app?.destroy();
    };
  }, [braid, frozen, onSelectSample]);

  useEffect(() => {
    redrawRef.current();
  }, [activeSampleId]);

  return (
    <div className="proof-canvas" ref={hostRef}>
      <canvas ref={canvasRef} aria-label="Proof braid visualization" />
      <span className="canvas-engine">PIXEL-RENDERED WITH PIXIJS</span>
    </div>
  );
}
