# Responsive Todo List App

A fully functional, responsive Todo List application with CRUD functionality, local storage persistence, and modern UI design.

## Features

### Core Functionality
- ✅ **CRUD Operations**: Create, Read, Update, and Delete tasks
- 🔄 **Local Storage**: Data persists between browser sessions
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🔍 **Search Functionality**: Real-time task search with instant filtering
- 🏷️ **Filter Options**: View All, Active, or Completed tasks
- 📊 **Live Statistics**: Real-time counters for total, active, and completed tasks

### User Experience
- 🎨 **Clean, Minimal UI**: Modern design with gradient backgrounds and smooth animations
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + N`: Focus on new task input
  - `Ctrl/Cmd + /`: Focus on search input
  - `Enter`: Add new task or save edit
  - `Escape`: Cancel edit mode
- ✨ **Smooth Animations**: Tasks slide in when added
- 🔔 **User Confirmations**: Prevents accidental deletions
- 📝 **Inline Editing**: Click edit button to modify tasks directly

## Tech Stack

- **HTML5**: Semantic structure with accessibility in mind
- **CSS3**: Modern styling with Flexbox, Grid, and media queries
- **JavaScript ES6+**: Modular class-based architecture
- **Local Storage API**: Client-side data persistence

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/OK-Emmanuel/internship-activities.git
   ```

2. Navigate to the project directory:
   ```bash
   cd internship-activities
   ```

3. Open `index.html` in your web browser or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using Live Server (VS Code extension)
   # Right-click on index.html and select "Open with Live Server"
   ```

4. Visit `http://localhost:8000` in your browser

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # CSS styling with responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── .gitignore         # Git ignore rules
```

## Usage

### Adding Tasks
- Type your task in the "Add a new task..." input field
- Click "Add Task" button or press `Enter`
- Task appears at the top of the list

### Managing Tasks
- **Complete/Uncomplete**: Click the checkbox next to any task
- **Edit**: Click the ✏️ edit button, modify text, press `Enter` or click elsewhere to save
- **Delete**: Click the 🗑️ delete button and confirm deletion

### Filtering and Search
- **Filter by status**: Click "All", "Active", or "Completed" buttons
- **Search**: Type in the search box to filter tasks by text content
- **Combine**: Use filters and search together for precise task finding

### Data Persistence
- All tasks are automatically saved to browser's local storage
- Data persists between browser sessions
- Works offline - no internet connection required

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security

- No external dependencies or CDNs
- Client-side only application
- No data transmitted to external servers
- CodeQL security analysis passed with 0 vulnerabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is built as part of Techifice internship activities.

## Author

Built with ❤️ for Techifice Internship Program
