// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Task
class UI {
    // Display books method 
    static displayBooks() {
        const books = Store.getBooks();
    
        books.forEach((book) => UI.addBookToList(book));
      }


    // Add book to list method
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        // Creating html element and appending it to tbody that has id book-list
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><i class="bi bi-x-lg bg-danger btn btn-small fs-5 py-1 px-2 text-white rounded delete"></i></td>
        `

        list.appendChild(row);
    }

    // Remove Book method
    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Show Alerts method
    static showAlerts(message, className) {
        // Creating div element with class names and appending it to main tag before form
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('main .container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Set timeOut
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    // Clear fields method
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}

// Store Class: Handle Storage
class Store {
    // Get Books
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }


    // add Book
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }


    // remove Book
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);


// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Form Validation
    if(title === '' || author === '' || isbn === '') {
        UI.showAlerts('Please add text in input fields', 'danger');
    }else {
    // Instantiate book 
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message for adding a book
    UI.showAlerts('Book added', 'success');

    // Clear fields of form
    UI.clearFields();
    }

    // Add book to local storage

});
    

// Event: Remove a Book 
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // Show remove book message
    if(e.target.classList.contains('delete')){
        UI.showAlerts('Book removed', 'success');
    }

    // Remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})