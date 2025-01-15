function applyPanicButton() {
    // Load the saved panic button key from localStorage or use default
    const savedPanicKey = localStorage.getItem('panicButtonKey') || '`';

    // Add a keydown event listener for the panic button
    document.addEventListener('keydown', function(event) {
        if (event.key === savedPanicKey) {
            window.location.href = 'https://manatee.schoology.com/home';
        }
    });
}

// Call applyPanicButton initially
document.addEventListener("DOMContentLoaded", applyPanicButton);
