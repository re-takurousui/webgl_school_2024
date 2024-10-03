precision mediump float;

uniform sampler2D textureUnit0;
uniform sampler2D textureUnit1;
uniform float fade; // 0.0 から 1.0 までの範囲で、2つのテクスチャのブレンド割合を制御
varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
  // テクスチャから、テクスチャ座標の位置の色を取得
  vec4 textureColor0 = texture2D(textureUnit0, vTexCoord);
  vec4 textureColor1 = texture2D(textureUnit1, vTexCoord);

  // 2つのテクスチャの色を mix 関数でブレンドする
  vec4 blendedTexture = mix(textureColor0, textureColor1, fade);

  // テクスチャと頂点カラーの乗算
  gl_FragColor = vColor * blendedTexture;
}
