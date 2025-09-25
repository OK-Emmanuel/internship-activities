/**
 * Todo List Application
 * A responsive todo list app with CRUD functionality, local storage persistence,
 * filtering, and search capabilities.
 */

class TodoApp {
    constructor() {
        // Initialize app state
        this.todos = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.nextId = 1;
        
        // Initialize DOM elements
        this.initDOMElements();
        
        // Load data from localStorage
        this.loadFromStorage();
        
        // Set up event listeners
        this.initEventListeners();
        
        // Initial render
        this.render();
    }

    /**
     * Initialize DOM element references
     */
    initDOMElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.searchInput = document.getElementById('searchInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.todoTemplate = document.getElementById('todoTemplate');
        
        // Filter buttons
        this.allFilter = document.getElementById('allFilter');
        this.activeFilter = document.getElementById('activeFilter');
        this.completedFilter = document.getElementById('completedFilter');
        
        // Stats elements
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    /**
     * Set up all event listeners
     */
    initEventListeners() {
        // Add todo events
        this.addBtn.addEventListener('click', () => this.handleAddTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddTodo();
        });

        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.render();
        });

        // Filter events
        this.allFilter.addEventListener('click', () => this.setFilter('all'));
        this.activeFilter.addEventListener('click', () => this.setFilter('active'));
        this.completedFilter.addEventListener('click', () => this.setFilter('completed'));

        // Todo list events (using event delegation)
        this.todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                this.toggleTodo(todoId);
            }
        });

        this.todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;
            
            const todoId = parseInt(todoItem.dataset.id);
            
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(todoId);
            } else if (e.target.classList.contains('edit-btn')) {
                this.startEdit(todoId);
            }
        });

        this.todoList.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('todo-edit-input')) {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                this.saveEdit(todoId, e.target.value);
            } else if (e.key === 'Escape' && e.target.classList.contains('todo-edit-input')) {
                this.cancelEdit();
            }
        });

        this.todoList.addEventListener('blur', (e) => {
            if (e.target.classList.contains('todo-edit-input')) {
                const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
                this.saveEdit(todoId, e.target.value);
            }
        }, true);
    }

    /**
     * Add a new todo item
     */
    handleAddTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const newTodo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo); // Add to beginning of array
        this.todoInput.value = '';
        this.saveToStorage();
        this.render();
        
        // Add animation class to new item
        setTimeout(() => {
            const newItem = this.todoList.querySelector(`[data-id="${newTodo.id}"]`);
            if (newItem) newItem.classList.add('new-item');
        }, 0);
    }

    /**
     * Toggle todo completion status
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            todo.updatedAt = new Date().toISOString();
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Delete a todo item
     */
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Start editing a todo item
     */
    startEdit(id) {
        const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
        if (!todoItem) return;

        const textSpan = todoItem.querySelector('.todo-text');
        const editInput = todoItem.querySelector('.todo-edit-input');
        
        textSpan.style.display = 'none';
        editInput.style.display = 'block';
        editInput.value = textSpan.textContent;
        editInput.focus();
        editInput.select();
    }

    /**
     * Save edited todo text
     */
    saveEdit(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        const todoItem = this.todoList.querySelector(`[data-id="${id}"]`);
        
        if (todo && todoItem) {
            const textSpan = todoItem.querySelector('.todo-text');
            const editInput = todoItem.querySelector('.todo-edit-input');
            
            const trimmedText = newText.trim();
            if (trimmedText && trimmedText !== todo.text) {
                todo.text = trimmedText;
                todo.updatedAt = new Date().toISOString();
                this.saveToStorage();
            }
            
            textSpan.style.display = 'block';
            editInput.style.display = 'none';
            this.render();
        }
    }

    /**
     * Cancel editing
     */
    cancelEdit() {
        const editInput = document.querySelector('.todo-edit-input[style*="block"]');
        if (editInput) {
            const todoItem = editInput.closest('.todo-item');
            const textSpan = todoItem.querySelector('.todo-text');
            
            textSpan.style.display = 'block';
            editInput.style.display = 'none';
        }
    }

    /**
     * Set current filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) activeButton.classList.add('active');
        
        this.render();
    }

    /**
     * Get filtered todos based on current filter and search query
     */
    getFilteredTodos() {
        let filtered = [...this.todos];
        
        // Apply filter
        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(todo => !todo.completed);
                break;
            case 'completed':
                filtered = filtered.filter(todo => todo.completed);
                break;
            // 'all' shows everything
        }
        
        // Apply search
        if (this.searchQuery) {
            filtered = filtered.filter(todo =>
                todo.text.toLowerCase().includes(this.searchQuery)
            );
        }
        
        return filtered;
    }

    /**
     * Create a todo item DOM element
     */
    createTodoElement(todo) {
        const template = this.todoTemplate.content.cloneNode(true);
        const todoItem = template.querySelector('.todo-item');
        
        todoItem.dataset.id = todo.id;
        todoItem.classList.toggle('completed', todo.completed);
        
        const checkbox = todoItem.querySelector('.todo-checkbox');
        const text = todoItem.querySelector('.todo-text');
        
        checkbox.checked = todo.completed;
        text.textContent = todo.text;
        
        return todoItem;
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;
        
        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }

    /**
     * Render the todo list
     */
    render() {
        const filteredTodos = this.getFilteredTodos();
        
        // Clear current list
        this.todoList.innerHTML = '';
        
        // Show/hide empty state
        this.emptyState.style.display = filteredTodos.length === 0 ? 'block' : 'none';
        
        // Render todos
        filteredTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
        });
        
        // Update statistics
        this.updateStats();
    }

    /**
     * Save todos to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                todos: this.todos,
                nextId: this.nextId
            };
            localStorage.setItem('todoAppData', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    /**
     * Load todos from localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('todoAppData');
            if (saved) {
                const data = JSON.parse(saved);
                this.todos = data.todos || [];
                this.nextId = data.nextId || 1;
                
                // Ensure nextId is higher than any existing todo id
                if (this.todos.length > 0) {
                    const maxId = Math.max(...this.todos.map(t => t.id));
                    this.nextId = Math.max(this.nextId, maxId + 1);
                }
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            this.todos = [];
            this.nextId = 1;
        }
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveToStorage();
        this.render();
    }

    /**
     * Clear all todos (with confirmation)
     */
    clearAll() {
        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            this.todos = [];
            this.nextId = 1;
            this.saveToStorage();
            this.render();
        }
    }
}

/**
 * Utility functions
 */

/**
 * Initialize the app when DOM is ready
 */
function initApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.todoApp = new TodoApp();
        });
    } else {
        window.todoApp = new TodoApp();
    }
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Ctrl/Cmd + N to focus new todo input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
});

/**
 * Handle offline/online status
 */
window.addEventListener('online', () => {
    console.log('App is back online');
});

window.addEventListener('offline', () => {
    console.log('App is offline - data will be saved locally');
});

// Initialize the application
initApp();