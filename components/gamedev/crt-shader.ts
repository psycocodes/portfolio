export const CRT_FRAGMENT_SHADER = `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

// CRT Parameters
uniform vec2 curvature;
uniform vec2 scanLineOpacity;
uniform float vignetteOpacity;
uniform float brightness;
uniform float screenResolution;

varying vec2 outTexCoord;

#define PI 3.14159265359

// Screen curvature effect
vec2 curveRemapUV(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

// Scan line effect
vec4 scanLineIntensity(float uv, float resolution, float opacity) {
    float intensity = sin(uv * resolution * PI * 2.0);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec4(vec3(pow(intensity, opacity)), 1.0);
}

// Vignette effect
float vignette(vec2 uv) {
    uv *= 1.0 - uv.yx;
    float vig = uv.x * uv.y * 15.0;
    return pow(vig, vignetteOpacity);
}

void main() {
    vec2 remappedUV = curveRemapUV(outTexCoord);
    
    // Return black if outside screen bounds (simulating CRT frame)
    if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Sample the base color
    vec4 baseColor = texture2D(uMainSampler, remappedUV);

    // Apply scan lines
    baseColor *= scanLineIntensity(remappedUV.x, screenResolution, scanLineOpacity.x);
    baseColor *= scanLineIntensity(remappedUV.y, screenResolution, scanLineOpacity.y);

    // Apply vignette
    baseColor.rgb *= vignette(remappedUV);

    // Boost brightness to compensate for darkening effects
    baseColor *= vec4(vec3(brightness), 1.0);

    gl_FragColor = baseColor;
}
`;

// Default CRT parameters
export const CRT_DEFAULT_PARAMS = {
  curvature: 3.0,
  scanLineOpacityX: 0.04,
  scanLineOpacityY: 0.04,
  vignetteOpacity: 0.3,
  brightness: 1.1,
  screenResolution: 800.0,
};
