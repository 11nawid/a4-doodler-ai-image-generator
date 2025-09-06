// Simple line drawing worker
self.onmessage = (event) => {
    try {
        const { imageData } = event.data;
        const { data, width, height } = imageData;

        // 1. Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }

        // 2. Invert colors
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }

        // 3. Apply a simple edge detection (Sobel-like, simplified)
        const newCanvas = new OffscreenCanvas(width, height);
        const newCtx = newCanvas.getContext('2d');
        const newImageData = newCtx.createImageData(width, height);
        const newData = newImageData.data;

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                
                // Get neighboring pixel values
                const a = data[((y - 1) * width + (x - 1)) * 4];
                const b = data[((y - 1) * width + x) * 4];
                const c = data[((y - 1) * width + (x + 1)) * 4];
                const d = data[(y * width + (x - 1)) * 4];
                const f = data[(y * width + (x + 1)) * 4];
                const g = data[((y + 1) * width + (x - 1)) * 4];
                const h = data[((y + 1) * width + x) * 4];
                const i_pix = data[((y + 1) * width + (x + 1)) * 4];

                const gx = -a - 2 * d - g + c + 2 * f + i_pix;
                const gy = -a - 2 * b - c + g + 2 * h + i_pix;

                const magnitude = Math.sqrt(gx * gx + gy * gy);
                const value = magnitude > 50 ? 0 : 255; // Threshold for edges

                newData[i] = value;
                newData[i + 1] = value;
                newData[i + 2] = value;
                newData[i + 3] = 255;
            }
        }
        
        newCtx.putImageData(newImageData, 0, 0);

        newCanvas.convertToBlob({ type: 'image/png' }).then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                self.postMessage({ status: 'done', imageDataUrl: reader.result });
            };
            reader.onerror = () => {
                self.postMessage({ status: 'error', message: 'Failed to read blob.' });
            };
            reader.readAsDataURL(blob);
        }).catch(err => {
             self.postMessage({ status: 'error', message: `Canvas to Blob conversion failed: ${err.message}` });
        });

    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
    }
};
