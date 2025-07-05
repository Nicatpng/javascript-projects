const themeButton = document.querySelector(".theme-button");
const darkThemeIcon = document.querySelector("#theme-icon-dark");
const lightThemeIcon = document.querySelector("#theme-icon-light");

themeButton.addEventListener("click", () => {
    darkThemeIcon.classList.toggle("hidden");
    lightThemeIcon.classList.toggle("hidden");
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");
});

let notesData = [];

const newNoteButton = document.querySelector(".note-window-button");
const noteForm = document.querySelector(".note-form-container");
const noteWindowTitle = document.querySelector(".note-window-title");
const noteNameInput = document.querySelector("#note-name-input");
const noteTagInput = document.querySelector("#note-tag-input");
const cancelButton = document.querySelector("#cancel-button");

const notesContainer = document.querySelector(".notes-container");

const notFound = document.querySelector(".not-found");

const searchInput = document.querySelector("#search-input");
const filterMenu = document.querySelector(".filter-menu");

searchInput.addEventListener("input", () => {
    renderNotes();
});

function searchNotes(rawNotes) {
    const searchValue = searchInput.value.toLowerCase();

    if (searchValue !== "") {
        if (searchValue.startsWith("#")) {
            const tag = searchValue.slice(1);
            return rawNotes.filter((note) => {
                return note.tags.some((noteTag) => noteTag.toLowerCase().includes(tag));
            });
        } else {
            return rawNotes.filter((note) => note.name.toLowerCase().includes(searchValue));
        }
    }
    return rawNotes;
}

filterMenu.addEventListener("input", () => {
    renderNotes();
});

function filterNotes(rawNotes) {
    const filterValue = filterMenu.value.toLowerCase();

    if (filterValue !== "" && filterValue !== "all") {
        const filtered = rawNotes.filter((note) => {
            if (filterValue === "completed") {
                return note["completed"];
            } else if (filterValue === "incomplete") {
                return !note["completed"];
            } else {
                return note.tags.some((tag) => tag.toLowerCase() === filterValue);
            }
        });
        return filtered;
    }
    renderFilterMenu();
    return rawNotes;
}

function addIndexToNotes(notes) {
    return notes.map((note, index) => {
        return {
            ...note,
            index: index + 1,
        };
    });
}

function renderNotes() {
    loadNotes();

    notesData = addIndexToNotes(notesData);
    notesData = searchNotes(notesData);
    notesData = filterNotes(notesData);

    notFound.classList.toggle("hidden", notesData.length);

    notesContainer.innerHTML = "";

    notesData.forEach((note, index) => {
        notesContainer.innerHTML += `
                <div
                    class="note select-none flex flex-col justify-between items-center after:bg-[var(--purple)] after:h-[1px] after:w-full after:my-[8px] 
                    after: ${index === notesData.length - 1 ? "after:opacity-0" : ""}">
                    <div class="flex justify-between items-center w-full gap-[16px]">
                        <p class="text-[20px] text-[var(--gray)] mr-[10px] min-w-[0px] max-w-[0px] text-end italic">
                        ${note.index}.</p>
                        <div class="relative flex items-center justify-start w-full py-[16px] px-[16px]">
                            <div class="note-checkbox rounded-[2px] p-[6px] outline-[2px] outline-[var(--purple)] cursor-pointer transition-all duration-200
                            ${note.completed ? "bg-[var(--purple)]" : ""}"
                            onclick="checkNote(${note.id}, this)">
                                <svg class="transition-all duration-200
                                ${!note.completed ? "opacity-0" : ""}"
                                width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="path-1-inside-1_18_421" fill="white">
                                <path d="M4.9978 14.6488L1.72853e-05 9.74756L9.55927 2.22748e-06L14.5571 4.90124L4.9978 14.6488Z"/>
                                </mask>
                                <path d="M4.9978 14.6488L3.59745 16.0767L5.02539 17.4771L6.42574 16.0491L4.9978 14.6488ZM6.39816 13.2209L1.40037 8.31962L-1.40034 11.1755L3.59745 16.0767L6.39816 13.2209ZM13.1291 3.50089L3.56986 13.2484L6.42574 16.0491L15.985 6.30159L13.1291 3.50089Z" fill="#F7F7F7" mask="url(#path-1-inside-1_18_421)"/>
                            </svg>
                            </div>
                            <p class="note-content flex justify-start items-center h-full max-w-full absolute left-[64px] right-0 px-[16px] text-[24px] truncate cursor-pointer rounded-md hover:bg-[var(--light-purple)] transition-all duration-200
                            ${note.completed ? "line-through text-[var(--gray)]" : ""}"
                            onclick="updateNoteWindow('view', ${note.id})">
                                ${note.name}</p>
                        </div>
                        <div class="note-buttons flex items-center">
                            <button
                                class="note-edit cursor-pointer p-[8px] text-[var(--gray)] hover:text-blue-600 transition-colors duration-200"
                                note-id="${note.id}" onclick="updateNoteWindow('edit', ${note.id})">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button
                                class="note-remove cursor-pointer p-[8px] text-[var(--gray)] hover:text-red-600 transition-colors duration-200"
                                note-id="${note.id}" onclick="deleteNote(${note.id})">
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
    const storedNotes = localStorage.getItem("myNotes");

    if (storedNotes) {
        notesData = JSON.parse(storedNotes);
    } else {
        notesData = [];
    }
}

function renderFilterMenu() {
    filterMenu.innerHTML = "";

    let allTags = ["all", "completed", "incomplete"];

    console.log(notesData);

    notesData.forEach((note) => {
        if (note.tags) {
            note.tags.forEach((tag) => {
                if (!allTags.includes(tag)) {
                    allTags.push(tag);
                }
            });
        }
    });

    allTags.forEach((tag) => {
        if (tag) {
            filterMenu.innerHTML += `
                        <option value="${tag}"
                            class="bg-white appearance-none text-[var(--purple)] border-[2px] border-[var(--purple)] rounded-md active:bg-[var(--purple)]/50 transition-all duration-200">
                           ${tag[0].toUpperCase() + tag.slice(1)}
                        </option>
            `;
        }
    });
}

renderNotes();

function showNoteWindow(visible) {
    noteForm.classList.toggle("invisible", !visible);
    noteForm.classList.toggle("opacity-0", !visible);
}

cancelButton.addEventListener("click", () => {
    showNoteWindow(false);
});

function updateNoteWindow(type, id = -1) {
    showNoteWindow(true);

    noteWindowTitle.innerText = (type + " note").toUpperCase();
    noteForm.setAttribute("note-id", id);

    const note = notesData.find((note) => note.id === id);

    switch (type) {
        case "edit":
            noteNameInput.disabled = false;
            noteTagInput.disabled = false;
            noteNameInput.value = note ? note.name : "";
            noteTagInput.value = note ? note.tags.join(" ") : "";
            break;
        case "new":
            noteNameInput.disabled = false;
            noteTagInput.disabled = false;
            noteNameInput.value = "";
            noteTagInput.value = "";
            break;
        case "view":
            noteNameInput.disabled = true;
            noteTagInput.disabled = true;
            noteNameInput.value = note ? note.name : "";
            noteTagInput.value = note ? note.tags.join(" ") : "";
            break;
    }
}

function deleteNote(id) {
    notesData = notesData.filter((note) => note.id !== id);

    saveNotes();

    renderNotes();
}

function checkNote(id, checkbox) {
    const note = notesData.find((note) => note.id === id);
    if (note) {
        note.completed = !note.completed;
        checkbox.classList.toggle("bg-[var(--purple)]", note.completed);
        checkbox.querySelector("svg").classList.toggle("opacity-0", !note.completed);
        checkbox.nextElementSibling.classList.toggle("line-through", note.completed);
        checkbox.nextElementSibling.classList.toggle("text-[var(--gray)]", note.completed);
    }
    saveNotes();
}

noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let noteId = +noteForm.getAttribute("note-id");
    if (noteId === -1) {
        notesData.push({
            id: Date.now(),
            name: noteNameInput.value,
            completed: false,
            tags: [...noteTagInput.value.split(" ")],
        });
    } else {
        const note = notesData.find((note) => note.id === noteId);
        if (note) {
            note.name = noteNameInput.value;
            note.tags = [...noteTagInput.value.split(" ")];
        }
    }

    saveNotes();

    showNoteWindow(false);

    renderFilterMenu();

    renderNotes();
});
