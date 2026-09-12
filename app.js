/**
 * Kanban Board App Logic
 * Pure Vanilla JavaScript with HTML5 Drag & Drop and LocalStorage Persistence
 */

const STORAGE_KEY = 'kanban_app_tasks';

// Initial default tasks if user has no saved data
const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: '研究 Kanban 看板核心功能需求',
    desc: '確認待處理、進行中、已完成三個欄位的拖曳互動流程',
    status: 'done',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: 'task-2',
    title: '實作 HTML5 拖曳排序 (Drag & Drop)',
    desc: '支援跨欄位拖曳、放置視覺反饋與資料狀態自動同步',
    status: 'in-progress',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'task-3',
    title: '串接 LocalStorage 本地儲存',
    desc: '每次更新看板狀態時自動存入瀏覽器，重新整理不遺失',
    status: 'in-progress',
    priority: 'medium',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'task-4',
    title: '發布至 GitHub Pages 靜態網站',
    desc: '透過 gh repo 設定公開網址，讓所有人都能在線試用',
    status: 'todo',
    priority: 'low',
    createdAt: Date.now()
  }
];

// App State
let tasks = loadTasks();
let draggedTaskId = null;

// DOM Elements
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title-input');
const taskDescInput = document.getElementById('task-desc-input');
const taskStatusSelect = document.getElementById('task-status-select');
const taskPrioritySelect = document.getElementById('task-priority-select');

const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelBtn = document.getElementById('cancel-btn');
const clearDoneBtn = document.getElementById('clear-done-btn');

// Lists
const lists = {
  todo: document.getElementById('list-todo'),
  'in-progress': document.getElementById('list-in-progress'),
  done: document.getElementById('list-done')
};

// Badges
const counts = {
  todo: document.getElementById('count-todo'),
  'in-progress': document.getElementById('count-in-progress'),
  done: document.getElementById('count-done')
};

// Init
function init() {
  renderBoard();
  setupEventListeners();
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved tasks', e);
    }
  }
  return [...DEFAULT_TASKS];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render Board
function renderBoard() {
  // Clear lists
  Object.values(lists).forEach((list) => (list.innerHTML = ''));

  const grouped = {
    todo: [],
    'in-progress': [],
    done: []
  };

  tasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });

  // Render cards for each column
  Object.keys(grouped).forEach((status) => {
    const listEl = lists[status];
    const columnTasks = grouped[status];

    // Update count badge
    if (counts[status]) {
      counts[status].textContent = columnTasks.length;
    }

    if (columnTasks.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-placeholder';
      empty.textContent = '尚無卡片，拖曳或點擊下方新增';
      listEl.appendChild(empty);
    } else {
      columnTasks.forEach((task) => {
        listEl.appendChild(createTaskCardElement(task));
      });
    }
  });
}

// Create Task Card Element
function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.id = task.id;

  const priorityLabels = {
    high: '🔴 高',
    medium: '🟡 中',
    low: '🟢 低'
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('zh-TW', {
    month: 'numeric',
    day: 'numeric'
  });

  card.innerHTML = `
    <div class="task-card-header">
      <span class="priority-tag priority-${task.priority}">
        ${priorityLabels[task.priority] || task.priority}
      </span>
      <div class="card-actions">
        <button class="card-btn edit" title="編輯">✎</button>
        <button class="card-btn delete" title="刪除">✕</button>
      </div>
    </div>
    <div class="task-title">${escapeHTML(task.title)}</div>
    ${task.desc ? `<div class="task-desc">${escapeHTML(task.desc)}</div>` : ''}
    <div class="task-footer">
      <span>${formattedDate}</span>
    </div>
  `;

  // Drag events on card
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  // Edit / Delete buttons
  card.querySelector('.card-btn.edit').addEventListener('click', (e) => {
    e.stopPropagation();
    openEditModal(task.id);
  });

  card.querySelector('.card-btn.delete').addEventListener('click', (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  return card;
}

// Drag & Drop Handlers
function handleDragStart(e) {
  draggedTaskId = this.dataset.id;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedTaskId = null;
  document.querySelectorAll('.task-list').forEach((list) => {
    list.classList.remove('drag-over');
  });
}

// Column Drop Zones
function setupDropZones() {
  Object.entries(lists).forEach(([status, listEl]) => {
    listEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      listEl.classList.add('drag-over');
    });

    listEl.addEventListener('dragleave', (e) => {
      // Only remove if leaving the list itself
      if (!listEl.contains(e.relatedTarget)) {
        listEl.classList.remove('drag-over');
      }
    });

    listEl.addEventListener('drop', (e) => {
      e.preventDefault();
      listEl.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
      if (!id) return;

      moveTaskToStatus(id, status);
    });
  });
}

function moveTaskToStatus(taskId, newStatus) {
  const task = tasks.find((t) => t.id === taskId);
  if (task && task.status !== newStatus) {
    task.status = newStatus;
    saveTasks();
    renderBoard();
  }
}

// Modal Handlers
function openCreateModal(defaultStatus = 'todo') {
  modalTitle.textContent = '新增任務';
  taskIdInput.value = '';
  taskTitleInput.value = '';
  taskDescInput.value = '';
  taskStatusSelect.value = defaultStatus;
  taskPrioritySelect.value = 'medium';

  modal.classList.remove('hidden');
  taskTitleInput.focus();
}

function openEditModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  modalTitle.textContent = '編輯任務';
  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.desc || '';
  taskStatusSelect.value = task.status;
  taskPrioritySelect.value = task.priority || 'medium';

  modal.classList.remove('hidden');
  taskTitleInput.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  taskForm.reset();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const title = taskTitleInput.value.trim();
  if (!title) return;

  const editingId = taskIdInput.value;
  const desc = taskDescInput.value.trim();
  const status = taskStatusSelect.value;
  const priority = taskPrioritySelect.value;

  if (editingId) {
    // Update existing task
    const task = tasks.find((t) => t.id === editingId);
    if (task) {
      task.title = title;
      task.desc = desc;
      task.status = status;
      task.priority = priority;
    }
  } else {
    // Create new task
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      desc,
      status,
      priority,
      createdAt: Date.now()
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderBoard();
  closeModal();
}

function deleteTask(id) {
  if (confirm('確定要刪除這張卡片嗎？')) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderBoard();
  }
}

function clearDoneTasks() {
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  if (doneCount === 0) {
    alert('目前沒有已完成的卡片！');
    return;
  }
  if (confirm(`確定要清除所有已完成的 ${doneCount} 張卡片嗎？`)) {
    tasks = tasks.filter((t) => t.status !== 'done');
    saveTasks();
    renderBoard();
  }
}

// Event Listeners
function setupEventListeners() {
  setupDropZones();

  openModalBtn.addEventListener('click', () => openCreateModal('todo'));
  closeModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  clearDoneBtn.addEventListener('click', clearDoneTasks);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Quick add buttons on each column
  document.querySelectorAll('.quick-add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status || 'todo';
      openCreateModal(status);
    });
  });

  // Form submit
  taskForm.addEventListener('submit', handleFormSubmit);
}

// Utility
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Start app
init();
