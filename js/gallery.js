/**
 * Dynamic Gallery Script
 * 
 * Logic:
 * 1. Define ALBUMS array (folder names).
 * 2. For each album, fetch 1.jpg, 2.jpg, ... sequentially.
 * 3. Stop fetching when a 404 is encountered.
 * 4. Render Album Grid (using 1.jpg as cover).
 * 5. onAlbumClick -> Render Image Grid.
 */

const ALBUMS = [
    { id: 'campus', title: 'Campus Life' },
    { id: 'events', title: 'College Events' },
    // Add new folder names here:
    // { id: 'workshops', title: 'Workshops' }
];

const GALLERY_PATH = 'assets/images/gallery/';
const MAX_IMAGES_TO_CHECK = 50; // Safety limit to prevent infinite loops if no 404

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initModal();
});

async function initGallery() {
    const albumGrid = document.getElementById('album-grid');
    const albumCount = document.getElementById('album-count');

    if (!albumGrid) return;

    // Check if we are in Album View or Image View (simple state)
    // Default to Album View
    renderAlbums();
}

/**
 * Renders the list of Albums
 */
async function renderAlbums() {
    const albumView = document.getElementById('album-view');
    const imageView = document.getElementById('image-view');
    const albumGrid = document.getElementById('album-grid');
    const albumCount = document.getElementById('album-count');

    albumView.style.display = 'block';
    imageView.style.display = 'none';
    albumGrid.innerHTML = '';

    let validAlbums = 0;

    for (const album of ALBUMS) {
        // Try to fetch the cover image (1.jpg)
        const coverPath = `${GALLERY_PATH}${album.id}/1.jpg`;
        const exists = await checkImageExists(coverPath);

        if (exists) {
            validAlbums++;
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6';
            col.innerHTML = `
                <div class="card gallery-card h-100 border-0 shadow-sm cursor-pointer" onclick="openAlbum('${album.id}', '${album.title}')">
                    <div class="overflow-hidden rounded-top" style="height: 200px;">
                        <img src="${coverPath}" class="w-100 h-100 object-fit-cover hover-zoom" alt="${album.title}">
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold text-primary mb-1">${album.title}</h5>
                        <p class="card-text text-muted small">Click to view photos</p>
                    </div>
                </div>
            `;
            albumGrid.appendChild(col);
        }
    }

    albumCount.textContent = `${validAlbums} Albums Available`;
}

/**
 * Opens a specific Album and renders its images
 */
async function openAlbum(albumId, albumTitle) {
    const albumView = document.getElementById('album-view');
    const imageView = document.getElementById('image-view');
    const imageGrid = document.getElementById('image-grid');
    const albumTitleEl = document.getElementById('album-title');
    const imageCount = document.getElementById('image-count');
    const backBtn = document.getElementById('back-to-albums');

    // Switch Views
    albumView.style.display = 'none';
    imageView.style.display = 'block';

    // Set Header
    albumTitleEl.textContent = albumTitle;
    imageGrid.innerHTML = '<div class="col-12 text-center p-5"><div class="spinner-border text-primary" role="status"></div></div>';

    // Setup Back Button
    backBtn.onclick = (e) => {
        e.preventDefault();
        renderAlbums();
    };

    // Scan for images 1.jpg -> N.jpg
    const images = [];
    let i = 1;
    let keepScanning = true;

    while (keepScanning && i <= MAX_IMAGES_TO_CHECK) {
        const imgPath = `${GALLERY_PATH}${albumId}/${i}.jpg`;
        const exists = await checkImageExists(imgPath);

        if (exists) {
            images.push(imgPath);
            i++;
        } else {
            keepScanning = false;
        }
    }

    // Render Grid
    imageGrid.innerHTML = '';
    images.forEach((src, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6';
        col.innerHTML = `
            <div class="gallery-item overflow-hidden rounded shadow-sm" style="height: 200px; cursor: pointer;" onclick="openModal('${src}')">
                <img src="${src}" class="w-100 h-100 object-fit-cover hover-zoom" alt="Gallery Image ${index + 1}">
            </div>
        `;
        imageGrid.appendChild(col);
    });

    imageCount.textContent = `${images.length} Photos`;
}

/**
 * Utility: Checks if an image exists via HEAD request
 * Note: This works for local file:// access in some browsers, but ideally requires a local server.
 * For local file://, fetch might fail or return status 0. We handle that.
 */
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        // Fallback for file:// protocol or simple image load check
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
}

/**
 * Modal Logic
 */
function initModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('modal-close');

    if (!modal) return;

    window.openModal = (src) => {
        modal.style.display = 'flex';
        modalImg.src = src;
        document.body.style.overflow = 'hidden'; // Disable scroll
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // Close on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}
