
"use client"

import { useEffect, useId, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 0.2,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 0.5,
  minOpacity = null,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
}) {
  const [isReady, setIsReady] = useState(false)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setIsReady(true)
    })
  }, [])

  const id = useId()

  const defaultOptions = {
    background: {
      color: {
        value: background,
      },
    },
    fullScreen: {
      enable: false, // Ensure it's not fullscreen
      zIndex: 0, // Set z-index to be behind content
    },
    interactivity: {
      events: {
        onHover: {
          enable: false, // Disable interactivity on hover
        },
        onClick: {
          enable: false, // Disable interactivity on click
        },
      },
       modes: {
        grab: {
          distance: 0,
        },
        bubble: {
          distance: 0,
        },
        repulse: {
          distance: 0,
        },
        push: {
          quantity: 0,
        },
        remove: {
          quantity: 0,
        },
      },
    },
    fpsLimit: 60, // Limit FPS for performance
    particles: {
      color: {
        value: color,
      },
      move: {
        enable: true,
        direction: "none",
        speed: {
          min: minSpeed || speed / 10,
          max: speed,
        },
        straight: false,
        outModes: {
          default: "out",
        },
      },
      number: {
        value: density,
        density: {
          enable: true,
          area: 800, // Adjust area based on your container size
        },
      },
      opacity: {
        value: {
          min: minOpacity || opacity / 10,
          max: opacity,
        },
        animation: {
          enable: true,
          sync: false,
          speed: opacitySpeed,
          startValue: "random",
          destroy: "none",
        },
      },
      size: {
        value: {
          min: minSize || size / 2.5,
          max: size,
        },
        animation: {
          enable: true,
          speed: 1,
          startValue: "random",
          destroy: "none",
        },
      },
      links: {
        enable: false, // Disable links between particles
      },
    },
    detectRetina: true,
    pauseOnOutsideViewport: true, // Pause animation when not visible
  }

  if (!isClient) {
    return null;
  }

  return isReady && <Particles id={id} options={{ ...defaultOptions, ...options }} className={className} />
}
