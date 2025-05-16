// Image Gallery Configuration
const galleryConfig = {
    animationDuration: 300,
    gridGap: 10,
    categories: ['all', 'nature', 'urban', 'portrait', 'abstract']
};

// Image Gallery Class
class ImageGallery {
    static instance = null;  // Singleton instance

    constructor() {
        // Singleton pattern - ensure only one gallery instance exists
        if (ImageGallery.instance) {
            return ImageGallery.instance;
        }
        
        console.log('Gallery class instantiated');
        this.images = [];
        this.currentFilter = 'all';
        this.mountPoint = document.getElementById('gallery-mount-point');
        
        if (!this.mountPoint) {
            console.error('Gallery mount point not found!');
            return;
        }

        // Clear any existing content
        this.mountPoint.innerHTML = '';
        
        ImageGallery.instance = this;
        this.initializeGallery();
    }

    async initializeGallery() {
        try {
            console.log('Initializing gallery...');
            // Create gallery container
            const galleryContainer = document.createElement('div');
            galleryContainer.className = 'gallery-container glass-effect';
            
            // Insert into mount point
            this.mountPoint.appendChild(galleryContainer);
            console.log('Gallery container mounted');

            // Create filter buttons
            this.createFilterButtons(galleryContainer);  // Pass container as argument

            // Create image grid
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            galleryContainer.appendChild(imageGrid);
            console.log('Image grid created and appended');

            // Initialize lightbox
            this.initializeLightbox();

            // Load images
            await this.loadImages();
            console.log('Gallery initialization complete');
        } catch (error) {
            console.error('Error initializing gallery:', error);
        }
    }

    createFilterButtons(galleryContainer) {  // Accept container as parameter
        try {
            console.log('Creating filter buttons...');
            const filterContainer = document.createElement('div');
            filterContainer.className = 'filter-container';
            
            galleryConfig.categories.forEach(category => {
                const button = document.createElement('button');
                button.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                button.addEventListener('click', () => this.filterImages(category));
                filterContainer.appendChild(button);
            });

            // Directly append to gallery container
            galleryContainer.appendChild(filterContainer);
            console.log('Filter buttons created successfully');
        } catch (error) {
            console.error('Error creating filter buttons:', error);
        }
    }

    async loadImages() {
        try {
            console.log('Starting to load images...');
            const imageGrid = this.mountPoint.querySelector('.image-grid');
            if (!imageGrid) {
                console.error('Image grid not found!');
                return;
            }
            console.log('Image grid found, proceeding to load images');
            
            for (let i = 1; i <= 12; i++) {
                console.log(`Creating wrapper for image ${i}`);
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'image-wrapper';
                
                const img = document.createElement('img');
                const imagePath = `./images/photo${i}.JPG`;
                console.log(`Attempting to load image from: ${imagePath}`);
                img.src = imagePath;
                img.alt = `Photo ${i}`;
                
                // Add error handling for image loading
                img.onerror = () => {
                    console.error(`Error loading image ${i} from path: ${imagePath}`);
                    imgWrapper.innerHTML = `<div class="error-message">Error loading image ${i}</div>`;
                    imgWrapper.classList.add('error');
                };
                
                img.dataset.category = galleryConfig.categories[Math.floor(Math.random() * (galleryConfig.categories.length - 1)) + 1];
                
                // Add loading state
                img.style.opacity = '0';
                img.onload = () => {
                    console.log(`Image ${i} loaded successfully from: ${imagePath}`);
                    imgWrapper.classList.add('loaded');
                    img.style.transition = `opacity ${galleryConfig.animationDuration}ms ease-in-out`;
                    img.style.opacity = '1';
                };
                
                img.addEventListener('click', () => this.openLightbox(img.src));
                imgWrapper.appendChild(img);
                imageGrid.appendChild(imgWrapper);
                console.log(`Image ${i} wrapper added to grid`);

                // Add a small delay between loading each image
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            console.log('All image wrappers added to grid');
        } catch (error) {
            console.error('Error in loadImages:', error);
        }
    }

    filterImages(category) {
        this.currentFilter = category;
        const images = document.querySelectorAll('.image-wrapper img');
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase() === category);
        });

        // Filter images
        images.forEach(img => {
            const wrapper = img.parentElement;
            const shouldShow = category === 'all' || img.dataset.category === category;
            
            wrapper.style.transition = `all ${galleryConfig.animationDuration}ms ease-in-out`;
            wrapper.style.opacity = shouldShow ? '1' : '0';
            wrapper.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
            setTimeout(() => {
                wrapper.style.display = shouldShow ? 'block' : 'none';
            }, shouldShow ? 0 : galleryConfig.animationDuration);
        });
    }

    initializeLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Lightbox Image">
                <button class="close-btn">&times;</button>
            </div>
        `;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox') || e.target.classList.contains('close-btn')) {
                this.closeLightbox();
            }
        });
    }

    openLightbox(imageSrc) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.src = imageSrc;
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.style.opacity = '1', 10);
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.style.display = 'none', galleryConfig.animationDuration);
    }
}

// Initialize gallery when DOM is loaded
let initialized = false;  // Flag to track initialization

function initGallery() {
    if (initialized) {
        console.log('Gallery already initialized, skipping');
        return;
    }

    console.log('Checking if we should initialize gallery...');
    if (window.location.pathname.endsWith('collections.html')) {
        console.log('On collections page, creating gallery');
        new ImageGallery();
        initialized = true;
    } else {
        console.log('Not on collections page, skipping gallery creation');
    }
}

// Single event listener for initialization
document.addEventListener('DOMContentLoaded', initGallery);