// Student Record System
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const studentForm = document.getElementById('studentForm');
    const studentTableBody = document.getElementById('studentTableBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Statistics elements
    const totalStudentsEl = document.getElementById('totalStudents');
    const averageAgeEl = document.getElementById('averageAge');
    const gradeDistributionEl = document.getElementById('gradeDistribution');
    
    // Student data
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let editId = null;
    
    // Initialize the app
    function init() {
        renderStudentTable(students);
        updateStatistics();
        
        // Form submission
        studentForm.addEventListener('submit', handleFormSubmit);
        
        // Search functionality
        searchBtn.addEventListener('click', handleSearch);
        resetSearchBtn.addEventListener('click', resetSearch);
        
        // Cancel button
        cancelBtn.addEventListener('click', resetForm);
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const age = parseInt(document.getElementById('age').value);
        const grade = document.getElementById('grade').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (editId !== null) {
            // Update existing student
            students = students.map(student => 
                student.id === editId ? { ...student, name, age, grade, email } : student
            );
            submitBtn.textContent = 'Add Student';
            editId = null;
        } else {
            // Add new student
            const newStudent = {
                id: Date.now(),
                name,
                age,
                grade,
                email
            };
            students.push(newStudent);
        }
        
        // Save to localStorage and update UI
        saveToLocalStorage();
        renderStudentTable(students);
        updateStatistics();
        resetForm();
    }
    
    // Render student table
    function renderStudentTable(studentsToRender) {
        studentTableBody.innerHTML = '';
        
        if (studentsToRender.length === 0) {
            studentTableBody.innerHTML = '<tr><td colspan="6">No students found</td></tr>';
            return;
        }
        
        studentsToRender.forEach(student => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.grade}</td>
                <td>${student.email}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${student.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${student.id}">Delete</button>
                </td>
            `;
            
            studentTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Handle edit
    function handleEdit(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const student = students.find(student => student.id === id);
        
        if (student) {
            document.getElementById('studentId').value = student.id;
            document.getElementById('name').value = student.name;
            document.getElementById('age').value = student.age;
            document.getElementById('grade').value = student.grade;
            document.getElementById('email').value = student.email;
            
            submitBtn.textContent = 'Update Student';
            editId = id;
            
            // Scroll to form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Handle delete
    function handleDelete(e) {
        if (confirm('Are you sure you want to delete this student?')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            students = students.filter(student => student.id !== id);
            
            saveToLocalStorage();
            renderStudentTable(students);
            updateStatistics();
            
            if (editId === id) {
                resetForm();
            }
        }
    }
    
    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            renderStudentTable(students);
            return;
        }
        
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.grade.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.id.toString().includes(searchTerm)
        );
        
        renderStudentTable(filteredStudents);
    }
    
    // Reset search
    function resetSearch() {
        searchInput.value = '';
        renderStudentTable(students);
    }
    
    // Reset form
    function resetForm() {
        studentForm.reset();
        document.getElementById('studentId').value = '';
        submitBtn.textContent = 'Add Student';
        editId = null;
    }
    
    // Update statistics
    function updateStatistics() {
        // Total students
        totalStudentsEl.textContent = students.length;
        
        // Average age
        const totalAge = students.reduce((sum, student) => sum + student.age, 0);
        const avgAge = students.length > 0 ? (totalAge / students.length).toFixed(1) : 0;
        averageAgeEl.textContent = avgAge;
        
        // Grade distribution
        gradeDistributionEl.innerHTML = '';
        
        const gradeCounts = {};
        students.forEach(student => {
            gradeCounts[student.grade] = (gradeCounts[student.grade] || 0) + 1;
        });
        
        for (const grade in gradeCounts) {
            const li = document.createElement('li');
            li.textContent = `${grade}: ${gradeCounts[grade]} student(s)`;
            gradeDistributionEl.appendChild(li);
        }
    }
    
    // Save to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(students));
    }
    
    // Initialize the application
    init();
});