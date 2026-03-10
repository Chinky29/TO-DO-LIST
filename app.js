// =============================================
//  TASKY — app.js
//  Enhanced Task Manager Logic
// =============================================

const taskInput   = document.getElementById('taskInput');
const addBtn      = document.getElementById('addBtn');
const taskList    = document.getElementById('taskList');
const emptyState  = document.getElementById('emptyState');
const footerActions = document.getElementById('footerActions');
const clearDoneBtn  = document.getElementById('clearDoneBtn');

const totalCount   = document.getElementById('totalCount');
const doneCount    = document.getElementById('doneCount');
const pendingCount = document.getElementById('pendingCount');
const currentDate  = document.getElementById('currentDate');

const tabs = document.querySelectorAll('.tab');

// ── State ──────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('tasky-tasks') || '[]');
let currentFilter = 'all';

// ── Date Display ───────────────────────────
function setDate() {
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', opts);
}
setDate();

// ── Save & Render ───────────────────────────
function save() {
    localStorage.setItem('tasky-tasks', JSON.stringify(tasks));
}

function updateStats() {
    const total   = tasks.length;
    const done    = tasks.filter(t => t.done).length;
    const pending = total - done;

    totalCount.textContent   = total;
    doneCount.textContent    = done;
    pendingCount.textContent = pending;

    footerActions.style.display = done > 0 ? 'flex' : 'none';
}

function getFilteredTasks() {
    if (currentFilter === 'done')    return tasks.filter(t => t.done);
    if (currentFilter === 'pending') return tasks.filter(t => !t.done);
    return tasks;
}

function render() {
    taskList.innerHTML = '';
    const filtered = getFilteredTasks();

    emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';

    filtered.forEach((task, filteredIdx) => {
        const realIdx = tasks.indexOf(task);
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (task.done) li.classList.add('done');

        li.innerHTML = `
            <div class="task-check ${task.done ? 'checked' : ''}" data-idx="${realIdx}" title="Toggle complete"></div>
            <span class="task-text">${escapeHTML(task.text)}</span>
            <span class="task-number">#${tasks.length - realIdx}</span>
            <button class="delete-btn" data-idx="${realIdx}" title="Delete task">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        taskList.appendChild(li);
    });

    updateStats();
    bindEvents();
}

// ── Escape HTML ─────────────────────────────
function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Event Binding ───────────────────────────
function bindEvents() {
    // Toggle done
    document.querySelectorAll('.task-check').forEach(check => {
        check.addEventListener('click', () => {
            const idx = parseInt(check.dataset.idx);
            tasks[idx].done = !tasks[idx].done;
            save();
            render();
        });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx);
            const item = btn.closest('.task-item');
            item.classList.add('removing');
            setTimeout(() => {
                tasks.splice(idx, 1);
                save();
                render();
            }, 240);
        });
    });
}

// ── Add Task ────────────────────────────────
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.style.borderColor = 'var(--danger)';
        taskInput.style.boxShadow = '0 0 0 3px var(--danger-dim)';
        setTimeout(() => {
            taskInput.style.borderColor = '';
            taskInput.style.boxShadow = '';
        }, 700);
        taskInput.focus();
        return;
    }

    tasks.unshift({ text, done: false, created: Date.now() });
    save();
    taskInput.value = '';
    currentFilter = 'all';
    tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
    render();
    taskInput.focus();
}

// ── Filter Tabs ─────────────────────────────
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        currentFilter = tab.dataset.filter;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        render();
    });
});

// ── Clear Completed ─────────────────────────
clearDoneBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
});

// ── Key Listeners ───────────────────────────
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});

// ── Theme Toggle ────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('tasky-theme') || 'dark';

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('tasky-theme', theme);
}

applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = localStorage.getItem('tasky-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ── Init ────────────────────────────────────
render();
// // =============================================
// //  TASKY — app.js
// //  Enhanced Task Manager Logic
// // =============================================

// const taskInput   = document.getElementById('taskInput');
// const addBtn      = document.getElementById('addBtn');
// const taskList    = document.getElementById('taskList');
// const emptyState  = document.getElementById('emptyState');
// const footerActions = document.getElementById('footerActions');
// const clearDoneBtn  = document.getElementById('clearDoneBtn');

// const totalCount   = document.getElementById('totalCount');
// const doneCount    = document.getElementById('doneCount');
// const pendingCount = document.getElementById('pendingCount');
// const currentDate  = document.getElementById('currentDate');

// const tabs = document.querySelectorAll('.tab');

// // ── State ──────────────────────────────────
// let tasks = JSON.parse(localStorage.getItem('tasky-tasks') || '[]');
// let currentFilter = 'all';

// // ── Date Display ───────────────────────────
// function setDate() {
//     const now = new Date();
//     const opts = { weekday: 'short', month: 'short', day: 'numeric' };
//     currentDate.textContent = now.toLocaleDateString('en-US', opts);
// }
// setDate();

// // ── Save & Render ───────────────────────────
// function save() {
//     localStorage.setItem('tasky-tasks', JSON.stringify(tasks));
// }

// function updateStats() {
//     const total   = tasks.length;
//     const done    = tasks.filter(t => t.done).length;
//     const pending = total - done;

//     totalCount.textContent   = total;
//     doneCount.textContent    = done;
//     pendingCount.textContent = pending;

//     footerActions.style.display = done > 0 ? 'flex' : 'none';
// }

// function getFilteredTasks() {
//     if (currentFilter === 'done')    return tasks.filter(t => t.done);
//     if (currentFilter === 'pending') return tasks.filter(t => !t.done);
//     return tasks;
// }

// function render() {
//     taskList.innerHTML = '';
//     const filtered = getFilteredTasks();

//     emptyState.style.display = filtered.length === 0 ? 'flex' : 'none';

//     filtered.forEach((task, filteredIdx) => {
//         const realIdx = tasks.indexOf(task);
//         const li = document.createElement('li');
//         li.classList.add('task-item');
//         if (task.done) li.classList.add('done');

//         li.innerHTML = `
//             <div class="task-check ${task.done ? 'checked' : ''}" data-idx="${realIdx}" title="Toggle complete"></div>
//             <span class="task-text">${escapeHTML(task.text)}</span>
//             <span class="task-number">#${tasks.length - realIdx}</span>
//             <button class="delete-btn" data-idx="${realIdx}" title="Delete task">
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//                     <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
//                 </svg>
//             </button>
//         `;

//         taskList.appendChild(li);
//     });

//     updateStats();
//     bindEvents();
// }

// // ── Escape HTML ─────────────────────────────
// function escapeHTML(str) {
//     return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// }

// // ── Event Binding ───────────────────────────
// function bindEvents() {
//     // Toggle done
//     document.querySelectorAll('.task-check').forEach(check => {
//         check.addEventListener('click', () => {
//             const idx = parseInt(check.dataset.idx);
//             tasks[idx].done = !tasks[idx].done;
//             save();
//             render();
//         });
//     });

//     // Delete
//     document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.addEventListener('click', () => {
//             const idx = parseInt(btn.dataset.idx);
//             const item = btn.closest('.task-item');
//             item.classList.add('removing');
//             setTimeout(() => {
//                 tasks.splice(idx, 1);
//                 save();
//                 render();
//             }, 240);
//         });
//     });
// }

// // ── Add Task ────────────────────────────────
// function addTask() {
//     const text = taskInput.value.trim();
//     if (!text) {
//         taskInput.style.borderColor = 'var(--danger)';
//         taskInput.style.boxShadow = '0 0 0 3px var(--danger-dim)';
//         setTimeout(() => {
//             taskInput.style.borderColor = '';
//             taskInput.style.boxShadow = '';
//         }, 700);
//         taskInput.focus();
//         return;
//     }

//     tasks.unshift({ text, done: false, created: Date.now() });
//     save();
//     taskInput.value = '';
//     currentFilter = 'all';
//     tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
//     render();
//     taskInput.focus();
// }

// // ── Filter Tabs ─────────────────────────────
// tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//         currentFilter = tab.dataset.filter;
//         tabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');
//         render();
//     });
// });

// // ── Clear Completed ─────────────────────────
// clearDoneBtn.addEventListener('click', () => {
//     tasks = tasks.filter(t => !t.done);
//     save();
//     render();
// });

// // ── Key Listeners ───────────────────────────
// addBtn.addEventListener('click', addTask);
// taskInput.addEventListener('keydown', e => {
//     if (e.key === 'Enter') addTask();
// });

// // ── Init ────────────────────────────────────
// render();