// DOM ELEMENTS
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");

const notesViewBtn = document.getElementById("notesViewBtn");
const remindersViewBtn = document.getElementById("remindersViewBtn");
const labelsViewBtn = document.getElementById("labelsViewBtn");
const archiveViewBtn = document.getElementById("archiveViewBtn");
const trashViewBtn = document.getElementById("trashViewBtn");

const searchInput = document.getElementById("searchInput");

const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editTitle = document.getElementById("editTitle");
const editText = document.getElementById("editText");
const saveEditBtn = document.getElementById("saveEditBtn");

const noteFormCard = document.getElementById("noteFormCard");
const collapsedNote = document.getElementById("collapsedNote");

const viewToggleBtn = document.getElementById("viewToggleBtn");
const viewIcon = viewToggleBtn.querySelector("i");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const appLayout = document.querySelector(".app-layout");

// APP DATA
let notes = [];
let archivedNotes = [];
let trashNotes = [];

let currentView = "notes";
let editIndex = null;
let gridView = true;

// DISPLAY NOTES
function renderNotes() {
  notesContainer.innerHTML = "";

  let list;

  if (currentView === "archive") {
    list = archivedNotes;
  } else if (currentView === "trash") {
    list = trashNotes;
  } else {
    list = notes;
  }

  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredList = list.filter((note) => {
    const title = note.title || "";
    const text = note.text || "";

    return (
      title.toLowerCase().includes(searchTerm) ||
      text.toLowerCase().includes(searchTerm)
    );
  });

  emptyState.style.display =
    filteredList.length === 0 ? "block" : "none";

  filteredList.forEach((note, index) => {
    const noteCard = document.createElement("article");
    noteCard.className = "note-card";

    let actionButtons = "";

    if (currentView === "notes") {
      actionButtons = `
        <button title="Edit" onclick="openEditModal(${index})">
          <i class="bi bi-pencil"></i>
        </button>

        <button title="Archive" onclick="archiveNote(${index})">
          <i class="bi bi-archive"></i>
        </button>

        <button title="Delete" onclick="deleteNote(${index})">
          <i class="bi bi-trash"></i>
        </button>
      `;
    } else if (currentView === "archive") {
      actionButtons = `
        <button title="Unarchive" onclick="unarchiveNote(${index})">
          <i class="bi bi-arrow-up-square"></i>
        </button>

        <button title="Delete" onclick="deleteArchivedNote(${index})">
          <i class="bi bi-trash"></i>
        </button>
      `;
    } else {
      actionButtons = `
        <button title="Restore" onclick="restoreNote(${index})">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>

        <button title="Delete permanently" onclick="deleteForever(${index})">
          <i class="bi bi-x-circle"></i>
        </button>
      `;
    }

    noteCard.innerHTML = `
      <h3>${note.title || "Untitled"}</h3>
      <p>${note.text}</p>

      <div class="note-actions">
        ${actionButtons}
      </div>
    `;

    notesContainer.appendChild(noteCard);
  });
}

// ADD NOTE
addNoteBtn.addEventListener("click", () => {
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (title === "" && text === "") {
    alert("Please write something before adding a note.");
    return;
  }

  notes.unshift({
    title,
    text
  });

  noteTitle.value = "";
  noteText.value = "";

  noteFormCard.classList.remove("expanded");

  currentView = "notes";
  setActiveButton(notesViewBtn);
  renderNotes();
});

// EXPAND NOTE FORM
collapsedNote.addEventListener("click", () => {
  noteFormCard.classList.add("expanded");
  noteText.focus();
});

// ARCHIVE NOTE
function archiveNote(index) {
  archivedNotes.unshift(notes[index]);
  notes.splice(index, 1);
  renderNotes();
}

// UNARCHIVE NOTE
function unarchiveNote(index) {
  notes.unshift(archivedNotes[index]);
  archivedNotes.splice(index, 1);
  renderNotes();
}

// DELETE NOTE
function deleteNote(index) {
  trashNotes.unshift(notes[index]);
  notes.splice(index, 1);
  renderNotes();
}

// DELETE ARCHIVED NOTE
function deleteArchivedNote(index) {
  trashNotes.unshift(archivedNotes[index]);
  archivedNotes.splice(index, 1);
  renderNotes();
}

// RESTORE NOTE
function restoreNote(index) {
  notes.unshift(trashNotes[index]);
  trashNotes.splice(index, 1);
  renderNotes();
}

// DELETE FOREVER
function deleteForever(index) {
  trashNotes.splice(index, 1);
  renderNotes();
}

// OPEN EDIT MODAL
function openEditModal(index) {
  editIndex = index;
  editTitle.value = notes[index].title;
  editText.value = notes[index].text;
  editModal.classList.add("active");
}

// CLOSE EDIT MODAL
closeModalBtn.addEventListener("click", () => {
  editModal.classList.remove("active");
});

// SAVE EDITED NOTE
saveEditBtn.addEventListener("click", () => {
  if (editIndex === null) {
    return;
  }

  notes[editIndex].title = editTitle.value.trim();
  notes[editIndex].text = editText.value.trim();

  editIndex = null;
  editModal.classList.remove("active");
  renderNotes();
});

// CLOSE MODAL WHEN CLICKING OUTSIDE
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) {
    editModal.classList.remove("active");
  }
});

// SIDEBAR BUTTON ACTIVE STATE
function setActiveButton(activeBtn) {
  const allSideLinks = document.querySelectorAll(".side-link");

  allSideLinks.forEach((button) => {
    button.classList.remove("active");
  });

  activeBtn.classList.add("active");
}

// NOTES VIEW
notesViewBtn.addEventListener("click", () => {
  currentView = "notes";
  setActiveButton(notesViewBtn);
  renderNotes();
});

// REMINDERS VIEW
remindersViewBtn.addEventListener("click", () => {
  setActiveButton(remindersViewBtn);
  notesContainer.innerHTML = "";
  emptyState.style.display = "none";
});

// LABELS VIEW
labelsViewBtn.addEventListener("click", () => {
  setActiveButton(labelsViewBtn);
  notesContainer.innerHTML = "";
  emptyState.style.display = "none";
});

// ARCHIVE VIEW
archiveViewBtn.addEventListener("click", () => {
  currentView = "archive";
  setActiveButton(archiveViewBtn);
  renderNotes();
});

// TRASH VIEW
trashViewBtn.addEventListener("click", () => {
  currentView = "trash";
  setActiveButton(trashViewBtn);
  renderNotes();
});

// SEARCH NOTES
searchInput.addEventListener("input", renderNotes);

// GRID / LIST VIEW
viewToggleBtn.addEventListener("click", () => {
  gridView = !gridView;

  if (gridView) {
    notesContainer.classList.remove("list-view");
    viewIcon.className = "bi bi-grid-3x3-gap";
  } else {
    notesContainer.classList.add("list-view");
    viewIcon.className = "bi bi-list";
  }
});

// COLLAPSE SIDEBAR
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  appLayout.classList.toggle("collapsed");
});

// INITIAL DISPLAY
searchInput.addEventListener("input", () => {
  renderNotes();
});