// Global variables
let currentLetterId = null;
let currentLetterData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadEmployees();
    loadLetters();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show default tab
    showTab('generate');
});

// Set up event listeners
function setupEventListeners() {
    // Letter form submission
    document.getElementById('letterForm').addEventListener('submit', handleLetterSubmission);
    
    // Employee form submission
    document.getElementById('employeeForm').addEventListener('submit', handleEmployeeSubmission);
    
    // Edit letter form submission
    document.getElementById('editLetterForm').addEventListener('submit', handleEditLetterSubmission);
    
    // Search functionality
    document.getElementById('searchLetters').addEventListener('input', debounce(searchLetters, 300));
}

// Tab navigation
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected tab button
    event.target.classList.add('active');
    
    // Load data based on tab
    if (tabName === 'view') {
        loadLetters();
    } else if (tabName === 'employees') {
        loadEmployees();
    }
}

// Toggle custom department input
function toggleCustomDepartment() {
    const departmentSelect = document.getElementById('department');
    const customDepartmentGroup = document.getElementById('customDepartmentGroup');
    const customDepartmentInput = document.getElementById('customDepartment');
    
    if (departmentSelect.value === 'Other') {
        customDepartmentGroup.style.display = 'block';
        customDepartmentInput.required = true;
        customDepartmentInput.focus();
    } else {
        customDepartmentGroup.style.display = 'none';
        customDepartmentInput.required = false;
        customDepartmentInput.value = '';
    }
}

// Toggle custom department input for employee form
function toggleCustomEmployeeDepartment() {
    const departmentSelect = document.getElementById('newEmployeeDept');
    const customDepartmentGroup = document.getElementById('customEmployeeDepartmentGroup');
    const customDepartmentInput = document.getElementById('customEmployeeDepartment');
    
    if (departmentSelect.value === 'Other') {
        customDepartmentGroup.style.display = 'block';
        customDepartmentInput.required = true;
        customDepartmentInput.focus();
    } else {
        customDepartmentGroup.style.display = 'none';
        customDepartmentInput.required = false;
        customDepartmentInput.value = '';
    }
}

// Handle letter form submission
async function handleLetterSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    let department = formData.get('department');
    
    // If "Other" is selected, use the custom department input
    if (department === 'Other') {
        department = formData.get('customDepartment');
        if (!department || department.trim() === '') {
            showMessage('Please specify the department name.', 'error');
            return;
        }
    }
    
    const letterData = {
        employee_name: formData.get('employeeName'),
        department: department,
        email: formData.get('email'),
        subject: formData.get('subject'),
        reason: formData.get('reason')
    };
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/generate-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(letterData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentLetterId = result.letter_id;
            currentLetterData = {
                ...letterData,
                letter_content: result.letter_content,
                created_at: new Date().toISOString()
            };
            
            displayLetterPreview(currentLetterData);
            showMessage('Letter generated successfully!', 'success');
        } else {
            showMessage('Failed to generate letter: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error generating letter:', error);
        showMessage('Error generating letter. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Handle employee form submission
async function handleEmployeeSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    let department = formData.get('department') || document.getElementById('newEmployeeDept').value;
    
    // If "Other" is selected, use the custom department input
    if (department === 'Other') {
        department = formData.get('customEmployeeDepartment') || document.getElementById('customEmployeeDepartment').value;
        if (!department || department.trim() === '') {
            showMessage('Please specify the department name.', 'error');
            return;
        }
    }
    
    const employeeData = {
        name: formData.get('name') || document.getElementById('newEmployeeName').value,
        department: department,
        email: formData.get('email') || document.getElementById('newEmployeeEmail').value
    };
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Employee added successfully!', 'success');
            event.target.reset();
            loadEmployees();
        } else {
            showMessage('Failed to add employee: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        showMessage('Error adding employee. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Handle edit letter form submission
async function handleEditLetterSubmission(event) {
    event.preventDefault();
    
    if (!currentLetterId) return;
    
    const formData = new FormData(event.target);
    const updateData = {
        subject: formData.get('subject'),
        reason: formData.get('reason'),
        generated_letter: formData.get('content')
    };
    
    showLoading(true);
    
    try {
        const response = await fetch(`/api/letters/${currentLetterId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Letter updated successfully!', 'success');
            closeEditModal();
            
            // Update current letter data
            currentLetterData.subject = updateData.subject;
            currentLetterData.reason = updateData.reason;
            currentLetterData.letter_content = updateData.generated_letter;
            
            displayLetterPreview(currentLetterData);
            loadLetters(); // Refresh letters list
        } else {
            showMessage('Failed to update letter: ' + result.error, 'error');
        }
    } catch (error) {
        console.error('Error updating letter:', error);
        showMessage('Error updating letter. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Display letter preview
function displayLetterPreview(letterData) {
    const previewContainer = document.getElementById('letterPreview');
    const contentContainer = document.getElementById('letterContent');
    
    const currentDate = new Date(letterData.created_at).toLocaleDateString();
    
    contentContainer.innerHTML = `
        <div class="letter-header">
            <h1>ABHIMO TECHNOLOGIES</h1>
            <p>F07, D.No. 2-11/26(27), "Green City", Behind Naganakatte, N.H.66, Thokottu<br>
            Mangaluru - 575017, Karnataka, India<br>
            Email: naveennayak.i@abhimo.com | Phone: +91 7829738999, +91 9480528421</p>
        </div>
        
        <div class="letter-date">Date: ${currentDate}</div>
        
        <div class="letter-subject">Subject: ${letterData.subject}</div>
        
        <div class="letter-body">${letterData.letter_content}</div>
        
        <div class="letter-signature">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="flex: 1;">
                    <p>Best Regards,</p>
                    <img src="images/founder-signature.svg" alt="Signature" style="width: 150px; height: 60px; margin: 10px 0;">
                    <div class="signature-name">Naveen Nayak</div>
                    <div>Managing Director</div>
                    <div>Abhimo Technologies</div>
                </div>
                <div style="flex: 1; text-align: center;">
                    <img src="images/company-seal.svg" alt="Company Seal" style="width: 80px; height: 80px; margin: 10px auto;">
                    <div style="font-size: 12px; margin-top: 5px;">Official Seal</div>
                </div>
            </div>
        </div>
    `;
    
    previewContainer.style.display = 'block';
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// Load employees
async function loadEmployees() {
    try {
        const response = await fetch('/api/employees');
        const employees = await response.json();
        
        displayEmployees(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
        showMessage('Error loading employees.', 'error');
    }
}

// Display employees
function displayEmployees(employees) {
const container = document.getElementById('employeesContainer');

if (employees.length === 0) {
container.innerHTML = '<p>No employees found. Add some employees to get started.</p>';
return;
}

container.innerHTML = employees.map(employee => `
<div class="employee-card">
<div class="employee-info">
<h4>${employee.name} <span class="employee-id">(ID: ${employee.employee_id})</span></h4>
<p><i class="fas fa-building"></i> ${employee.department}</p>
<p><i class="fas fa-envelope"></i> ${employee.email}</p>
<p><i class="fas fa-calendar"></i> Added: ${new Date(employee.created_at).toLocaleDateString()}</p>
</div>
</div>
`).join('');
}

// Load letters
async function loadLetters() {
    try {
        const response = await fetch('/api/letters');
        const letters = await response.json();
        
        displayLetters(letters);
    } catch (error) {
        console.error('Error loading letters:', error);
        showMessage('Error loading letters.', 'error');
    }
}

// Display letters
function displayLetters(letters) {
    const container = document.getElementById('lettersContainer');
    
    if (letters.length === 0) {
        container.innerHTML = '<p>No letters generated yet. Create your first appreciation letter!</p>';
        return;
    }
    
    container.innerHTML = letters.map(letter => `
        <div class="letter-card">
            <div class="letter-card-header">
                <div class="letter-card-info">
                    <h3>${letter.employee_name}</h3>
                    <p><i class="fas fa-building"></i> ${letter.department}</p>
                    <p><i class="fas fa-envelope"></i> ${letter.email}</p>
                    <p><i class="fas fa-tag"></i> ${letter.subject}</p>
                    <p><i class="fas fa-calendar"></i> ${new Date(letter.created_at).toLocaleDateString()}</p>
                </div>
                <div class="letter-card-actions">
                    <button onclick="viewLetter(${letter.letter_id})" class="btn btn-primary">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button onclick="editLetterById(${letter.letter_id})" class="btn btn-warning">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="downloadPDF(${letter.letter_id})" class="btn btn-danger">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button onclick="downloadWord(${letter.letter_id})" class="btn btn-success">
                        <i class="fas fa-file-word"></i> Word
                    </button>
                </div>
            </div>
            <div class="letter-preview-text">
                <p><strong>Reason:</strong> ${letter.reason.substring(0, 150)}${letter.reason.length > 150 ? '...' : ''}</p>
            </div>
        </div>
    `).join('');
}

// View specific letter
async function viewLetter(letterId) {
    try {
        const response = await fetch(`/api/letters/${letterId}`);
        const letter = await response.json();
        
        currentLetterId = letterId;
        currentLetterData = {
            employee_name: letter.employee_name,
            department: letter.department,
            email: letter.email,
            subject: letter.subject,
            reason: letter.reason,
            letter_content: letter.generated_letter,
            created_at: letter.created_at
        };
        
        // Show view modal instead of switching tabs
        showViewModal(currentLetterData);
        
    } catch (error) {
        console.error('Error viewing letter:', error);
        showMessage('Error loading letter.', 'error');
    }
}

// Show view letter modal
function showViewModal(letterData) {
    const modal = document.getElementById('viewModal');
    const content = document.getElementById('viewModalContent');
    
    const currentDate = new Date(letterData.created_at).toLocaleDateString();
    
    content.innerHTML = `
        <div class="letter-header">
            <h1>ABHIMO TECHNOLOGIES</h1>
            <p>F07, D.No. 2-11/26(27), "Green City", Behind Naganakatte, N.H.66, Thokottu<br>
            Mangaluru - 575017, Karnataka, India<br>
            Email: naveennayak.i@abhimo.com | Phone: +91 7829738999, +91 9480528421</p>
        </div>
        
        <div class="letter-date">Date: ${currentDate}</div>
        
        <div class="letter-subject">Subject: ${letterData.subject}</div>
        
        <div class="letter-body">${letterData.letter_content}</div>
        
        <div class="letter-signature">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="flex: 1;">
                    <p>Best Regards,</p>
                    <img src="images/founder-signature.svg" alt="Signature" style="width: 150px; height: 60px; margin: 10px 0;">
                    <div class="signature-name">Naveen Nayak</div>
                    <div>Managing Director</div>
                    <div>Abhimo Technologies</div>
                </div>
                <div style="flex: 1; text-align: center;">
                    <img src="images/company-seal.svg" alt="Company Seal" style="width: 80px; height: 80px; margin: 10px auto;">
                    <div style="font-size: 12px; margin-top: 5px;">Official Seal</div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Close view modal
function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

// Edit letter by ID
async function editLetterById(letterId) {
    try {
        const response = await fetch(`/api/letters/${letterId}`);
        const letter = await response.json();
        
        currentLetterId = letterId;
        
        // Populate edit form
        document.getElementById('editSubject').value = letter.subject;
        document.getElementById('editReason').value = letter.reason;
        document.getElementById('editContent').value = letter.generated_letter;
        
        // Show edit modal
        document.getElementById('editModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading letter for edit:', error);
        showMessage('Error loading letter for editing.', 'error');
    }
}

// Edit current letter
function editLetter() {
    if (!currentLetterId || !currentLetterData) {
        showMessage('No letter selected for editing.', 'error');
        return;
    }
    
    // Populate edit form
    document.getElementById('editSubject').value = currentLetterData.subject;
    document.getElementById('editReason').value = currentLetterData.reason;
    document.getElementById('editContent').value = currentLetterData.letter_content;
    
    // Show edit modal
    document.getElementById('editModal').style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Download PDF
async function downloadPDF(letterId = null) {
    const id = letterId || currentLetterId;
    if (!id) {
        showMessage('No letter selected for download.', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`/api/download/pdf/${id}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `appreciation_letter_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showMessage('PDF downloaded successfully!', 'success');
        } else {
            showMessage('Failed to download PDF.', 'error');
        }
    } catch (error) {
        console.error('Error downloading PDF:', error);
        showMessage('Error downloading PDF.', 'error');
    } finally {
        showLoading(false);
    }
}

// Download Word
async function downloadWord(letterId = null) {
    const id = letterId || currentLetterId;
    if (!id) {
        showMessage('No letter selected for download.', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const response = await fetch(`/api/download/word/${id}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `appreciation_letter_${id}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showMessage('Word document downloaded successfully!', 'success');
        } else {
            showMessage('Failed to download Word document.', 'error');
        }
    } catch (error) {
        console.error('Error downloading Word document:', error);
        showMessage('Error downloading Word document.', 'error');
    } finally {
        showLoading(false);
    }
}

// Search letters
function searchLetters() {
    const searchTerm = document.getElementById('searchLetters').value.toLowerCase();
    const letterCards = document.querySelectorAll('.letter-card');
    
    letterCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
    
    // Remove on click
    messageDiv.addEventListener('click', () => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle modal clicks (close when clicking outside)
window.addEventListener('click', function(event) {
    const editModal = document.getElementById('editModal');
    const viewModal = document.getElementById('viewModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    
    if (event.target === viewModal) {
        closeViewModal();
    }
});

// Handle escape key for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
        closeViewModal();
    }
});