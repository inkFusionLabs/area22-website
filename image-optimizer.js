const fs = require('fs');
const path = require('path');

// Image optimization configuration
const imageConfig = {
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    formats: ['webp', 'jpg']
};

// Function to create optimized image paths
function createOptimizedImagePath(originalPath, format) {
    const dir = path.dirname(originalPath);
    const name = path.basename(originalPath, path.extname(originalPath));
    return path.join(dir, `${name}-optimized.${format}`);
}

// Function to generate responsive image HTML
function generateResponsiveImageHTML(originalPath, alt) {
    const baseName = path.basename(originalPath, path.extname(originalPath));
    const webpPath = `${baseName}-optimized.webp`;
    const jpgPath = `${baseName}-optimized.jpg`;
    
    return `
<picture>
    <source srcset="${webpPath}" type="image/webp">
    <source srcset="${jpgPath}" type="image/jpeg">
    <img src="${originalPath}" alt="${alt}" loading="lazy" decoding="async">
</picture>`;
}

// Function to create image optimization instructions
function createOptimizationInstructions() {
    const instructions = `
# Image Optimization Instructions

## Current Image Sizes:
- BRINGING PASSION TO EVERY GIG-2: 113KB
- 1fc648c3-ee2a-4358-82f4-a26a3280238e.JPG: 200KB
- 3276866b-6597-4161-bcd2-80b2c1a0a2da.JPG: 206KB
- 985b51a5-322d-4049-a1d0-ebc1a7396c99.JPG: 280KB
- bee16901-3162-409b-a3d4-6fd2c9feb800 Copy.JPG: 85KB
- e82bf8ca-cf23-4351-9a1f-35ec4b4e02a1.JPG: 180KB

## Optimization Recommendations:

### 1. Use WebP Format
Convert all images to WebP format for better compression:
- WebP provides 25-35% smaller file sizes
- Maintains quality while reducing bandwidth
- Supported by all modern browsers

### 2. Implement Responsive Images
Use <picture> element with multiple sources:
- WebP for modern browsers
- JPEG fallback for older browsers
- Different sizes for different screen sizes

### 3. Lazy Loading
Add loading="lazy" to all images:
- Improves initial page load time
- Only loads images when needed

### 4. Compression Settings
- Quality: 85% (good balance of quality/size)
- Max width: 1920px
- Max height: 1080px
- Progressive JPEG for better perceived loading

### 5. CDN Integration
Use a CDN for faster image delivery:
- Cloudflare Images
- AWS CloudFront
- Vercel Image Optimization

## Implementation Steps:
1. Convert images to WebP format
2. Create responsive image HTML
3. Add lazy loading attributes
4. Implement CDN for image delivery
5. Monitor Core Web Vitals
`;

    fs.writeFileSync('image-optimization-guide.md', instructions);
    console.log('Image optimization guide created: image-optimization-guide.md');
}

// Generate optimization instructions
createOptimizationInstructions();

// Create responsive image HTML snippets
const imageHTML = {
    banner: generateResponsiveImageHTML('BRINGING PASSION TO EVERY GIG-2', 'Area22 Banner'),
    gallery1: generateResponsiveImageHTML('985b51a5-322d-4049-a1d0-ebc1a7396c99.JPG', 'DJ Performance'),
    gallery2: generateResponsiveImageHTML('3276866b-6597-4161-bcd2-80b2c1a0a2da.JPG', 'Lighting Show'),
    gallery3: generateResponsiveImageHTML('1fc648c3-ee2a-4358-82f4-a26a3280238e.JPG', 'DJ Equipment'),
    gallery4: generateResponsiveImageHTML('e82bf8ca-cf23-4351-9a1f-35ec4b4e02a1.JPG', 'Stage Lighting'),
    logo: generateResponsiveImageHTML('bee16901-3162-409b-a3d4-6fd2c9feb800 Copy.JPG', 'Area22 Logo')
};

// Save responsive image HTML
fs.writeFileSync('responsive-images.html', JSON.stringify(imageHTML, null, 2));
console.log('Responsive image HTML snippets created: responsive-images.html');

console.log('Image optimization setup complete!'); 