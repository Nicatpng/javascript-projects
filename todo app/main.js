const themeButton = document.querySelector(".theme-button");
const darkThemeIcon = document.querySelector("#theme-icon-dark");
const lightThemeIcon = document.querySelector("#theme-icon-light");

themeButton.addEventListener("click", () => {
    darkThemeIcon.classList.toggle("hidden");
    lightThemeIcon.classList.toggle("hidden");
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
});

let notesData = [
    {
        id: 0,
        name: "Buy groceries",
        completed: false,
    },
    {
        id: 1,
        name: "Walk the dog",
        completed: true,
    },
    {
        id: 2,
        name: "Finish homework",
        completed: false,
    },
    {
        id: 3,
        name: "Read a book",
        completed: true,
    },
    {
        id: 4,
        name: "Exercise",
        completed: false,
    },
];

const newNoteButton = document.querySelector(".note-window-button");
const noteForm = document.querySelector(".note-form-container");
const noteWindowTitle = document.querySelector(".note-window-title");
const noteWindowInput = document.querySelector("#note-window-input");
const cancelButton = document.querySelector("#cancel-button");

const notesContainer = document.querySelector(".notes-container");

function renderNotes() {
    loadNotes();

    notesContainer.innerHTML = "";

    notesData.forEach((note) => {
        notesContainer.innerHTML += `
                <div
                    class="note flex flex-col justify-between items-center after:bg-indigo-500 after:h-[1px] after:w-full after:my-[16px]">
                    <div class="flex justify-between items-center w-full transition-all duration-200">
                        <div class="flex items-center gap-[24px]">
                            <input type="checkbox"
                                class="note-checkmark border-[2px] border-indigo-500 w-[32px] aspect-square transition-all duration-200" onclick="checkNote(${
                                    note.id
                                })" ${note.completed ? "checked" : ""}>
                            <p class="note-content text-[24px]">${note.name}</p>
                        </div>
                        <div class="note-buttons flex items-center">
                            <button
                                class="note-edit cursor-pointer p-[8px] text-gray-400 hover:text-blue-600 transition-colors duration-200" note-id="${
                                    note.id
                                }" onclick="updateNoteWindow('edit', ${note.id})">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button
                                class="note-remove cursor-pointer p-[8px] text-gray-400 hover:text-red-600 transition-colors duration-200" note-id="${
                                    note.id
                                }" onclick="deleteNote(${note.id})">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
                                        stroke="currentColor" />
                                    <path d="M14.625 3.75H3.375" stroke="currentColor" stroke-linecap="round" />
                                    <path
                                        d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                                        stroke="currentColor" />
                                    <path d="M10.5 9V12.75" stroke="currentColor" stroke-linecap="round" />
                                    <path d="M7.5 9V12.75" stroke="currentColor" stroke-linecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
        `;
    });
}

function saveNotes() {
    localStorage.setItem("myNotes", JSON.stringify(notesData));
}

function loadNotes() {
    notesData = JSON.parse(localStorage.getItem("myNotes"));
}

renderNotes();

function showNoteWindow(visible) {
    noteForm.classList.toggle("opacity-0", !visible);
    noteForm.classList.toggle("invisible", !visible);
}

cancelButton.addEventListener("click", () => {
    showNoteWindow(false);
});

function updateNoteWindow(type, id = -1) {
    showNoteWindow(true);

    noteWindowTitle.innerText = (type + " note").toUpperCase();
    noteForm.setAttribute("note-id", id);

    if (id === -1) {
        noteWindowInput.value = "";
    } else {
        const note = notesData.find((note) => note.id === id);
        noteWindowInput.value = note ? note.name : "";
    }
}

function deleteNote(id) {
    notesData = notesData.filter((note) => note.id !== id);

    saveNotes();

    renderNotes();
}

function checkNote(id) {
    const note = notesData.find((note) => note.id === id);
    if (note) {
        note.completed = !note.completed;
    }

    saveNotes();

    renderNotes();
}

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let noteId = +noteForm.getAttribute("note-id");
    if (noteId === -1) {
        notesData.push({
            id: Date.now(),
            name: noteWindowInput.value,
            completed: false,
        });
    } else {
        const note = notesData.find((note) => note.id === noteId);
        if (note) {
            note.name = noteWindowInput.value;
        }
    }
    saveNotes();

    showNoteWindow(false);

    renderNotes();
});
