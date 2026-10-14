// IndexedDB-backed robust attachment storage for all file types and videos
const DB_NAME = 'TeamWorkAttachmentsDB';
const DB_VERSION = 1;
const STORE_NAME = 'attachments_store';

// In-memory cache for fast blob URLs
const objectUrlCache = new Map();

/**
 * Open or upgrade IndexedDB
 */
const openDB = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject(new Error('IndexedDB is not supported'));
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Format bytes to human readable string
 */
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Classify file category from MIME type or file extension
 */
export const getFileCategory = (type = '', name = '') => {
    const lowerType = (type || '').toLowerCase();
    const ext = (name || '').split('.').pop().toLowerCase();

    // Video
    if (
        lowerType.startsWith('video/') ||
        ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'ogv', 'wmv', '3gp', 'flv'].includes(ext)
    ) {
        return 'video';
    }

    // Image
    if (
        lowerType.startsWith('image/') ||
        ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'avif'].includes(ext)
    ) {
        return 'image';
    }

    // Audio
    if (
        lowerType.startsWith('audio/') ||
        ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma'].includes(ext)
    ) {
        return 'audio';
    }

    // PDF
    if (lowerType.includes('pdf') || ext === 'pdf') {
        return 'pdf';
    }

    // Documents / Sheets / Presentations
    if (
        lowerType.includes('word') ||
        lowerType.includes('excel') ||
        lowerType.includes('powerpoint') ||
        lowerType.includes('officedocument') ||
        lowerType.includes('text/') ||
        ['doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'].includes(ext)
    ) {
        return 'document';
    }

    // Archives
    if (
        lowerType.includes('zip') ||
        lowerType.includes('compressed') ||
        ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)
    ) {
        return 'archive';
    }

    // Code
    if (
        ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'go', 'rs', 'sql', 'sh'].includes(ext)
    ) {
        return 'code';
    }

    return 'file';
};

/**
 * Get category icon emoji and badge styling
 */
export const getCategoryMeta = (category) => {
    switch (category) {
        case 'video':
            return { icon: '🎬', label: 'Video', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
        case 'image':
            return { icon: '🖼️', label: 'Image', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
        case 'audio':
            return { icon: '🎵', label: 'Audio', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
        case 'pdf':
            return { icon: '📕', label: 'PDF', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
        case 'document':
            return { icon: '📄', label: 'Document', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
        case 'archive':
            return { icon: '📦', label: 'Archive', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
        case 'code':
            return { icon: '💻', label: 'Code', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
        default:
            return { icon: '📎', label: 'File', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
};

/**
 * Save an uploaded File/Blob to IndexedDB & cache an Object URL
 */
export const saveAttachmentFile = async (file, uploadedBy = 'Team Member') => {
    const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const category = getFileCategory(file.type, file.name);

    // Create immediate Object URL for instant in-session rendering
    const objectUrl = URL.createObjectURL(file);
    objectUrlCache.set(id, objectUrl);

    // Save to IndexedDB
    try {
        const db = await openDB();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const record = {
                id,
                name: file.name,
                type: file.type || 'application/octet-stream',
                sizeBytes: file.size,
                blob: file,
                uploadedAt: new Date().toISOString()
            };
            const req = store.put(record);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.warn('Could not persist file to IndexedDB, fallback to memory-only:', err);
    }

    return {
        id,
        name: file.name,
        size: formatFileSize(file.size),
        sizeBytes: file.size,
        mimeType: file.type || 'application/octet-stream',
        category,
        uploadedBy,
        date: new Date().toISOString().split('T')[0],
        hasBlob: true
    };
};

/**
 * Retrieve blob / object URL for playing video, previewing image, or downloading
 */
export const getAttachmentUrl = async (attachment) => {
    if (!attachment) return null;

    // 1. Check in-memory cache
    if (objectUrlCache.has(attachment.id)) {
        return objectUrlCache.get(attachment.id);
    }

    // 2. If attachment already has a direct URL or dataUrl
    if (attachment.url && attachment.url !== '#') {
        return attachment.url;
    }
    if (attachment.dataUrl) {
        return attachment.dataUrl;
    }

    // 3. Try to load from IndexedDB
    try {
        const db = await openDB();
        const record = await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(attachment.id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });

        if (record && record.blob) {
            const url = URL.createObjectURL(record.blob);
            objectUrlCache.set(attachment.id, url);
            return url;
        }
    } catch (e) {
        console.warn('Could not retrieve attachment from IndexedDB:', e);
    }

    // 4. Fallback for demo attachments: create a synthetic text blob
    const fallbackText = `Attachment: ${attachment.name}\nSize: ${attachment.size}\nUploaded by: ${attachment.uploadedBy}\nDate: ${attachment.date}`;
    const fallbackBlob = new Blob([fallbackText], { type: 'text/plain' });
    const fallbackUrl = URL.createObjectURL(fallbackBlob);
    objectUrlCache.set(attachment.id, fallbackUrl);
    return fallbackUrl;
};

/**
 * Trigger immediate download for any attachment
 */
export const downloadAttachment = async (attachment) => {
    const url = await getAttachmentUrl(attachment);
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * Delete attachment from IndexedDB & memory cache
 */
export const deleteAttachmentFile = async (id) => {
    if (objectUrlCache.has(id)) {
        try {
            URL.revokeObjectURL(objectUrlCache.get(id));
        } catch (_) {}
        objectUrlCache.delete(id);
    }

    try {
        const db = await openDB();
        await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (err) {
        console.warn('Error deleting attachment from IndexedDB:', err);
    }
};
