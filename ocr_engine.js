/**
 * D2R OCR Engine
 * Handles Image Pre-processing and Tesseract Interaction.
 */

const D2R_IMAGE_PROCESSOR = {
    /**
     * Converts a dark-themed D2R screenshot into a high-contrast B&W image for OCR.
     */
    async binarize(imageSrc) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Thresholding for OCR (Dark background, bright text -> White background, black text)
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Calculate relative luminance
                    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

                    // High Contrast Binarization: threshold at luminance 90
                    if (luminance > 90) {
                        data[i] = 0;     // R -> Black
                        data[i + 1] = 0; // G -> Black
                        data[i + 2] = 0; // B -> Black
                    } else {
                        data[i] = 255;   // R -> White
                        data[i + 1] = 255; // G -> White
                        data[i + 2] = 255; // B -> White
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = imageSrc;
        });
    }
};

const D2R_OCR_SERVICE = {
    /**
     * Executes the OCR pipeline (Preprocessing -> OCR -> Return Structured Data)
     */
    async recognize(imageSrc, onProgress) {
        try {
            if (onProgress) onProgress('⏳ 正在優化影像對比度 (Binarization)...');
            const processedImageSrc = await D2R_IMAGE_PROCESSOR.binarize(imageSrc);

            if (onProgress) onProgress('⏳ 正在初始化辨識引擎...');
            const worker = await Tesseract.createWorker('chi_tra');

            if (onProgress) onProgress('⏳ 正在從高對比圖像中提取文字...');
            const { data: { text, lines } } = await worker.recognize(processedImageSrc);

            console.log('Recognized Text:', text);
            await worker.terminate();

            return { text, lines, processedImageSrc, success: true };
        } catch (err) {
            console.error('OCR Error:', err);
            return { error: err, success: false };
        }
    }
};
