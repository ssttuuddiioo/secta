// --- CRT/Scanline Effect Shader (Matchbox Version) ---
// Author: [John Daro] (Adapted from https://www.shadertoy.com/view/Ms3XWH)
// Description: Simulates the look of an old CRT monitor with scanlines, noise, and chromatic aberration.

// --- Inputs (Uniforms) ---
// These are provided by the Matchbox host application.

uniform float adsk_result_w;      // Input: Render target width.
uniform float adsk_result_h;      // Input: Render target height.
uniform sampler2D src;            // Input: Input texture.
uniform float iTime;             // Input: Time in seconds (for animation).

// --- Matchbox Control Parameters (Uniforms) ---
uniform float scanlineRange;       // Controls the width of the scanlines.
uniform float noiseQuality;        // Controls the granularity of the vertical noise.
uniform float noiseIntensity;      // Controls the horizontal jitter/noise.
uniform float offsetIntensity;     // Controls the strength of the vertical scanline offset.
uniform float colorOffsetIntensity; // Controls the strength of the chromatic aberration.

// --- Helper Function: Random Number Generator ---
float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// --- Helper Function: Vertical Bar (Scanline) ---
float verticalBar(float pos, float uvY, float offset)
{
    float edge0 = (pos - scanlineRange);
    float edge1 = (pos + scanlineRange);

    float x = smoothstep(edge0, pos, uvY) * offset;
    x -= smoothstep(pos, edge1, uvY) * offset;
    return x;
}

// --- Main Shader Function ---
void main (void)
{
    // --- UV Coordinate Calculation ---
    vec2 uv = gl_FragCoord.xy / vec2(adsk_result_w, adsk_result_h);

    // --- Scanline Effect ---
    for (float i = 0.0; i < 0.71; i += 0.1313)
    {
        float d = mod(iTime * i, 1.7);
        float scanlineOffset = sin(1.0 - tan(iTime * 0.24 * i));
        scanlineOffset *= offsetIntensity;
        uv.x += verticalBar(d, uv.y, scanlineOffset);
    }

    // --- Vertical Noise ---
    float uvY = uv.y;
    uvY *= noiseQuality;
    uvY = float(int(uvY)) * (1.0 / noiseQuality);
    float noise = rand(vec2(iTime * 0.00001, uvY));
    uv.x += noise * noiseIntensity;

    // --- Chromatic Aberration ---
    vec2 offsetR = vec2(0.006 * sin(iTime), 0.0) * colorOffsetIntensity;
    vec2 offsetG = vec2(0.0073 * (cos(iTime * 0.97)), 0.0) * colorOffsetIntensity;

    // --- Sample Texture with Offsets ---
    float r = texture2D(src, uv + offsetR).r;
    float g = texture2D(src, uv + offsetG).g;
    float b = texture2D(src, uv).b;

    // --- Output ---
    gl_FragColor = vec4(r, g, b, 1.0);
}