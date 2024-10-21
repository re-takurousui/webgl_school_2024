precision mediump float;
uniform vec3 lightVector;
uniform sampler2D textureUnit;
uniform float noiseDistortion; // ノイズの歪み係数
uniform vec2 resolution;        // 解像度
uniform vec2 mousePosition;     // マウス座標

varying vec3 vNormal;
varying vec2 vTexCoord;

// ノイズ関数の追加
float noise(vec2 uv) {
    return sin(uv.x * 10.0 + uv.y * 10.0) * 0.5 + 0.5; // 簡単なノイズ関数
}

void main() {
    // テクスチャの色
    vec4 samplerColor = texture2D(textureUnit, vTexCoord);
    
    // 平行光源による拡散光
    vec3 light = normalize(lightVector);
    vec3 normal = normalize(vNormal);
    float diffuse = max(dot(light, normal), 0.0) * 0.5 + 0.5;
    
    // マウスカーソルの位置に基づいてテクスチャを歪ませる
    vec2 uv = vTexCoord;

    // マウス座標を正規化（[0.0, 1.0]に変換）
    vec2 normalizedMouse = mousePosition / resolution;

    // マウス位置とテクスチャ座標の距離を計算
    float dist = distance(uv, normalizedMouse);
    
    // 距離に応じて歪みを適用（指定した距離以内のみ適用）
    if (dist < 0.1) { // ここで歪みを適用する範囲を設定
        float distortion = noise(uv) * noiseDistortion * (1.0 - dist / 0.5); // 距離が近いほど歪みが強くなる
        uv += (uv - normalizedMouse) * distortion; // 歪みを適用
    }

    // 歪んだ位置でテクスチャをサンプリング
    samplerColor = texture2D(textureUnit, uv);

    // テクスチャの色と拡散光の合成
    gl_FragColor = samplerColor * vec4(vec3(diffuse), 1.0);
}
