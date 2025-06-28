


function interleaveVertexData(positions, uvs, pieceId = 0) {
  const result = [];
  for (let i = 0; i < positions.length; i++) {
    const [x, y] = positions[i];
    const [u, v] = uvs[i];
    result.push(x, y, u, v, pieceId); // 👈 5 floats per vertex
  }
  return result;
}


export function generatePieces(count, field) {
  const shapes = ['triangle', 'square', 'pentagon'];
  const allVertices = [];

  for (let i = 0; i < count; i++) {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 40 + Math.random() * 50;
    const cx = field.x + Math.random() * field.width;
    const cy = field.y + Math.random() * field.height;

    const { positions, uvs } = getVerticesAndUVs(shape, cx, cy, size, field);
    allVertices.push(...interleaveVertexData(positions, uvs, i));
  }

  return new Float32Array(allVertices);
}