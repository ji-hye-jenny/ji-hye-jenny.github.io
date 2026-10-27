// Simple Notepad Application Logic
const STORAGE_KEY = 'simple_notepad_notes';

// Initial sample notes shown on first visit
const DEFAULT_NOTES = [
    {
        id: 'note-1',
        title: 'Shopping List',
        category: 'Personal',
        content: '1. Apples\n2. Milk\n3. Bread',
        date: '2026-10-27'
    },
    {
        id: 'note-2',
        title: 'Project Ideas',
        category: 'Ideas',
        content: 'Build an accessible, lightweight web tool using semantic HTML5 elements.',
        date: '2026-10-26'
    }
];

// DOM Elements
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('note-title');
const categorySelect = document.getElementById('note-category');
const contentInput = document.getElementById('note-content');
const notesContainer = document.getElementById('notes-container');
const notesCountBadge = document.getElementById('notes-count');
const toastElement = document.getElementById('toast');

// Load notes from localStorage
function getNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Seed default notes
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTES));
        return DEFAULT_NOTES;
    }
    try {
        return JSON.parse(stored) || [];
    } catch (e) {
        console.error('Error parsing stored notes:', e);
        return [];
    }
}

// Save notes array to localStorage
function saveNotesToStorage(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Format current date as YYYY-MM-DD
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Capitalize category name for display
function formatCategory(category) {
    if (!category) return 'General';
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Display toast notification
let toastTimer = null;
function showToast(message) {
    if (!toastElement) return;
    toastElement.textContent = message;
    toastElement.classList.add('show');
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastElement.classList.remove('show');
    }, 2500);
}

// Render all notes in the list
function renderNotes() {
    const notes = getNotes();
    
    // Update count indicator
    if (notesCountBadge) {
        notesCountBadge.textContent = `(${notes.length})`;
    }

    if (!notesContainer) return;
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<p>No notes found. Create your first note above!</p>';
        notesContainer.appendChild(emptyState);
        return;
    }

    notes.forEach(note => {
        const article = document.createElement('article');
        article.className = 'note-card';
        article.id = note.id;

        // Card header with Title and Delete action
        const headerDiv = document.createElement('div');
        headerDiv.className = 'note-card-header';

        const h3 = document.createElement('h3');
        h3.textContent = note.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', `Delete note "${note.title}"`);
        deleteBtn.title = 'Delete Note';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        headerDiv.appendChild(h3);
        headerDiv.appendChild(deleteBtn);

        // Meta info (Category and Date)
        const metaP = document.createElement('p');
        const badge = document.createElement('small');
        badge.textContent = `Category: ${note.category} | Date: ${note.date}`;
        metaP.appendChild(badge);

        // Content paragraph
        const contentP = document.createElement('p');
        contentP.className = 'note-card-content';
        contentP.textContent = note.content;

        article.appendChild(headerDiv);
        article.appendChild(metaP);
        article.appendChild(contentP);

        notesContainer.appendChild(article);
    });
}

// Delete a note by id
function deleteNote(noteId) {
    const notes = getNotes().filter(note => note.id !== noteId);
    saveNotesToStorage(notes);
    renderNotes();
    showToast('Note deleted');
}

// Handle Form Submission (Save Note)
function handleSaveNote(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = formatCategory(categorySelect.value);
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert('Please fill in both the title and content fields.');
        return;
    }

    const newNote = {
        id: 'note-' + Date.now(),
        title: title,
        category: category,
        content: content,
        date: getFormattedDate()
    };

    // Prepend to notes list
    const notes = getNotes();
    notes.unshift(newNote);
    saveNotesToStorage(notes);

    // Refresh UI
    renderNotes();

    // Reset form fields
    noteForm.reset();
    titleInput.focus();

    // Feedback
    showToast('Note saved successfully!');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (noteForm) {
        noteForm.addEventListener('submit', handleSaveNote);
    }
    renderNotes();
});
