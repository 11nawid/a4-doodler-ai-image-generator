// public/drawing-worker.js

/**
 * Turns an image into a series of paths for a drawing machine.
 *
 * This worker takes image data and converts it into an array of colored paths
 * that can be used to create a "hand-drawn" effect. It uses a clustering
 * algorithm to group similar colors and then traces paths for each cluster.
 *
 * Algorithm Steps:
 * 1.  **Color Clustering**: The worker first groups the image's pixels into a
 *     limited number of color clusters (e.g., 16) using a K-Means-like approach.
 *     This simplifies the color palette to make tracing manageable.
 *
 * 2.  **Pixel Mapping**: It then creates a map of the image, where each pixel is
 *     assigned to one of the color clusters.
 *
 * 3.  **Path Tracing**: For each color cluster, the worker scans the pixel map
 *     to find contiguous areas of that color. It then traces the outline of these
 *     areas to generate paths.
 *
 * 4.  **Path Distribution**: The generated paths for all colors are collected. If
 *     multiple "partners" (pens) are specified, the paths are distributed among
 *     them in a round-robin fashion, so they can draw concurrently.
 *
 * This approach ensures that the resulting drawing preserves the main color
 * regions and shapes of the original image while creating an artistic,
* plotted look.
 */
self.onmessage = function (e) {
  const { imageData, width, height, numPartners } = e.data;
  const pixels = imageData.data;

  // --- 1. K-Means Color Clustering ---
  const k = 16; // Number of color clusters
  let centroids = [];

  // Initialize centroids with random pixels from the image
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * (pixels.length / 4)) * 4;
    centroids.push([
      pixels[randomIndex],
      pixels[randomIndex + 1],
      pixels[randomIndex + 2],
    ]);
  }

  // Helper to calculate Euclidean distance between colors
  const colorDistance = (c1, c2) =>
    Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
        Math.pow(c1[1] - c2[1], 2) +
        Math.pow(c1[2] - c2[2], 2)
    );

  // K-Means iterations
  for (let iter = 0; iter < 5; iter++) {
    const clusters = Array.from({ length: k }, () => []);

    // Assign each pixel to the nearest centroid
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Ignore white/light gray pixels to focus on the subject
      if (r > 240 && g > 240 && b > 240) continue;

      let minDistance = Infinity;
      let clusterIndex = 0;
      for (let j = 0; j < k; j++) {
        const distance = colorDistance([r, g, b], centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = j;
        }
      }
      clusters[clusterIndex].push([r, g, b]);
    }

    // Recalculate centroids
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        const sum = clusters[i].reduce(
          (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
          [0, 0, 0]
        );
        centroids[i] = [
          Math.round(sum[0] / clusters[i].length),
          Math.round(sum[1] / clusters[i].length),
          Math.round(sum[2] / clusters[i].length),
        ];
      }
    }
  }

  // --- 2. Create Clustered Pixel Map ---
  const pixelMap = new Array(width * height).fill(-1);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      if (r > 240 && g > 240 && b > 240) {
         pixelMap[y * width + x] = -1; // Background
         continue;
      }

      let minDistance = Infinity;
      let clusterIndex = 0;
      for (let j = 0; j < k; j++) {
        const distance = colorDistance([r, g, b], centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = j;
        }
      }
      pixelMap[y * width + x] = clusterIndex;
    }
  }


  // --- 3. Trace Paths for Each Color Cluster ---
  const allPaths = [];
  const visited = new Set();
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]; // 8 directions

  for (let c = 0; c < k; c++) {
    const clusterColor = `rgb(${centroids[c][0]}, ${centroids[c][1]}, ${centroids[c][2]})`;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (pixelMap[index] === c && !visited.has(index)) {
          let currentPath = [];
          const queue = [[x, y]];
          visited.add(index);

          while (queue.length > 0) {
            const [cx, cy] = queue.shift();
            currentPath.push({ x: cx, y: cy });

            // Add a "pen up" marker if we need to jump
            if(queue.length === 0) {
                // Find next unvisited pixel of same color
                let foundNext = false;
                for (let i = 0; i < directions.length; i++) {
                    const [dx, dy] = directions[i];
                    const nx = cx + dx;
                    const ny = cy + dy;
                    const nextIndex = ny * width + nx;

                    if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited.has(nextIndex) && pixelMap[nextIndex] === c) {
                        queue.push([nx,ny]);
                        visited.add(nextIndex);
                        foundNext = true;
                        break; 
                    }
                }

                if(!foundNext) {
                  // If no direct neighbor, jump to the next available pixel in the scan
                  currentPath.push({ x: -1, y: -1 });
                }
            }
          }
           if (currentPath.length > 1) {
              allPaths.push({ color: clusterColor, path: currentPath });
           }
        }
      }
    }
  }

  // --- 4. Distribute Paths Among Partners ---
  const partnerPaths = Array.from({ length: numPartners }, () => []);
  allPaths.forEach((p, i) => {
    partnerPaths[i % numPartners].push(p);
  });
  
  self.postMessage({ status: 'done', path: partnerPaths });
};