"use client"
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function FluidShader() {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouseMoved = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize Three.js scene
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Create a plane to display our shader
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define our fluid shader
    const fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 mouse;
      uniform bool mouseMoved;
      
      #define MOUSE_FORCE 0.15
      #define ITERATIONS 4
      #define FORMUPARAM 0.53
      #define VOLSTEPS 10
      #define SPEED 0.1
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Mouse influence
        vec2 m = mouseMoved ? vec2(mouse.x * 2.0 - 1.0, mouse.y * 2.0 - 1.0) : vec2(0.0);
        float mouseDistance = length(p - m);
        float mouseForce = MOUSE_FORCE / mouseDistance;
        
        // Time control for animation
        float t = time * SPEED;
        
        // Base fluid dynamics
        vec3 color = vec3(0.0);
        
        for (int i = 1; i <= VOLSTEPS; i++) {
          float fade = 1.0 / float(i);
          
          // Create fluid dynamics
          vec3 p3 = vec3(p.x + t * 0.2, p.y + m.y * 0.1, t * 0.1);
          p3 += mouseMoved ? vec3(m.x * mouseForce, m.y * mouseForce, 0.0) : vec3(0.0);
          
          for (int j = 0; j < ITERATIONS; j++) {
            p3 = abs(p3) / dot(p3, p3) - FORMUPARAM;
          }
          
          // Calculate color
          float intensity = 0.01 / dot(p3, p3) * fade;
          
          // Color palette - blues for fluid
          vec3 baseColor = vec3(0.2, 0.5, 0.9); // Base blue
          vec3 accentColor = vec3(0.1, 0.9, 1.0); // Cyan accent
          
          color += intensity * mix(baseColor, accentColor, intensity * 2.0);
        }
        
        // Output the final color
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Create uniforms to pass to the shader
    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
      mouseMoved: { value: false }
    };

    // Create material with our shaders
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms,
      transparent: true
    });

    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    // Track mouse movement
    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = 1.0 - event.clientY / window.innerHeight; // Invert Y for shader coord system
      
      mousePosition.current = { x, y };
      mouseMoved.current = true;
      uniforms.mouse.value.set(x, y);
      uniforms.mouseMoved.value = true;
    };

    // Touch support for mobile
    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = 1.0 - touch.clientY / window.innerHeight;
        
        mousePosition.current = { x, y };
        mouseMoved.current = true;
        uniforms.mouse.value.set(x, y);
        uniforms.mouseMoved.value = true;
      }
    };

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.time.value = elapsedTime;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Start animation and add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    animate();
    setIsLoaded(true);

    // Clean up on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="shader-container">
      <canvas 
        ref={canvasRef} 
        className="fluid-shader"
      />
      {!isLoaded && <div className="loading">Loading shader...</div>}
      <style jsx>{`
        .shader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        .fluid-shader {
          width: 100%;
          height: 100%;
          display: block;
        }
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: sans-serif;
        }
      `}</style>
    </div>
  );
}