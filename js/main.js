
// Import books from JSON file
import data from '../data/books.json' with { type: 'json' };

let myBooks = JSON.parse(localStorage.getItem('books')) || [];
console.log(myBooks);

// copy the books from json to localStorage
if (myBooks.length === 0) {
    myBooks = data;
    localStorage.setItem("books", JSON.stringify(myBooks));
}

// sorting
const sortBooks = (books, criterion) => {
    switch (criterion) {
        case "price":
            return books.sort((a, b) => a.price - b.price); // by price
        case "title":
            return books.sort((a, b) => a.title.localeCompare(b.title)); // by title
        default:
            return books.sort((a, b) => a.id - b.id); // by id
    }
};

document.getElementById("sortBy").addEventListener("change", (event) => {
    const sortedBooks = sortBooks(myBooks, event.target.value);
    displayBooks(sortedBooks);
});


// make the books table
const displayBooks = (books) => {
    const tableBody = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    books.forEach(book => {
        const tableLine = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = book.id;
        tableLine.appendChild(idCell);

        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        tableLine.appendChild(titleCell);

        const priceCell = document.createElement("td");
        priceCell.textContent = `$${book.price.toFixed(2)}`;
        tableLine.appendChild(priceCell);

        // eye icon
        const actionCellShow = document.createElement("td");
        actionCellShow.innerHTML = '&#128065;';
        actionCellShow.classList.add("tableImg");
        actionCellShow.addEventListener("click", () => showBookDetails(book));
        tableLine.appendChild(actionCellShow);

        // update icon
        const actionCellUpdate = document.createElement("td");
        actionCellUpdate.innerHTML = '&#9999;';
        actionCellUpdate.classList.add("tableImg");
        actionCellUpdate.addEventListener("click", () => editBookDetails(book));
        tableLine.appendChild(actionCellUpdate);

        // delete icon
        const actionCellDelete = document.createElement("td");
        actionCellDelete.innerHTML = '&#128465;';
        actionCellDelete.classList.add("tableImg");
        actionCellDelete.addEventListener("click", () => deleteBook(book.id));
        tableLine.appendChild(actionCellDelete);

        tableBody.appendChild(tableLine);
    });
};

// sidebar with book details
const showBookDetails = (book) => {
    document.getElementById("bookId").textContent = book.id;
    document.getElementById("bookTitleDisplay").textContent = book.title;
    document.getElementById("bookPriceDisplay").textContent = `$${book.price.toFixed(2)}`;
    document.getElementById("bookImageDisplay").src = book.image; 

    const bookRatingDisplay = document.getElementById("bookRatingDisplay");
    bookRatingDisplay.textContent = book.rating ? book.rating : "Not rated";

    const ratingInput = document.getElementById("bookRatingInput");
    ratingInput.value = book.rating || '';

    // change the rating to update availble
    bookRatingDisplay.onclick = () => {
        bookRatingDisplay.style.display = "none";
        ratingInput.style.display = "block";
        ratingInput.focus();
    };

    // rating updating
    ratingInput.onchange = () => {
        const newRating = parseInt(ratingInput.value);
        if (newRating >= 1 && newRating <= 5) {
            
            book.rating = newRating;

            // update localStorage
            let books = JSON.parse(localStorage.getItem('books'));
            const bookIndex = books.findIndex(b => b.id === book.id);
            if (bookIndex !== -1) {
                books[bookIndex].rating = newRating;
                localStorage.setItem('books', JSON.stringify(books)); 
            }

            bookRatingDisplay.textContent = newRating;
            ratingInput.style.display = "none"; 
            bookRatingDisplay.style.display = "inline";
        } else {
            alert("Please enter a rating between 1 and 5.");
        }
    };

    document.getElementById("sidebar").classList.add("open");
    document.body.classList.add("sidebar-open"); 
};

const closeSidebar = () => {
    document.getElementById("sidebar").classList.remove("open");
    document.body.classList.remove("sidebar-open");
};

document.getElementById("closeSidebar").addEventListener("click", closeSidebar);
document.getElementById("editButton").addEventListener("click", closeSidebar);

// Function to edit book details
const editBookDetails = (book) => {
    document.getElementById("bookId").textContent = book.id;
    document.getElementById("bookTitleDisplay").innerHTML = `<input type="text" value="${book.title}"/>`;
    document.getElementById("bookPriceDisplay").innerHTML = `<input type="number" value="${book.price}" step="0.01"/>`;
    document.getElementById("bookImageDisplay").src = book.image; // Load the book image

    // Show the rating and comment inputs
    document.getElementById("bookRatingInput").value = book.rating || ''; // Default to empty if no rating

    // Show the edit button
    const editButton = document.getElementById("editButton");
    editButton.style.display = "block"; // Show edit button
    editButton.onclick = () => {
        const updatedTitle = document.querySelector('#bookTitleDisplay input').value;
        const updatedPrice = parseFloat(document.querySelector('#bookPriceDisplay input').value);
        const updatedRating = parseInt(document.getElementById("bookRatingInput").value);

        // Update the book data
        let books = JSON.parse(localStorage.getItem('books'));
        const bookIndex = books.findIndex(b => b.id === book.id);
        if (bookIndex !== -1) {
            books[bookIndex].title = updatedTitle;
            books[bookIndex].price = updatedPrice;
            books[bookIndex].rating = updatedRating; // Save the rating

            localStorage.setItem('books', JSON.stringify(books)); // Save updated data to localStorage
            displayBooks(books); // Update the display
        }

        // Close sidebar
        document.getElementById("sidebar").classList.remove("open");
    };

    // document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebar").classList.add("open");
    document.body.classList.add("sidebar-open");
};

// Function to delete a book
const deleteBook = (bookId) => {
    let books = JSON.parse(localStorage.getItem('books'));
    books = books.filter(book => book.id !== bookId);
    localStorage.setItem('books', JSON.stringify(books)); // Save updated data to localStorage
    displayBooks(books); // Update the display
};

// Close sidebar button functionality
document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
});

// Initial display of books
displayBooks(sortBooks(myBooks, "id"));

const form = document.getElementsByClassName("addBookForm");

// Add a new book
document.getElementById("showAddBook").addEventListener("click", () => {
    form[0].style.display === "block" ? form[0].style.display = "none" : form[0].style.display = "block";
})

document.getElementById("addBookButton").addEventListener("click", () => {
    const title = document.getElementById("newBookTitle").value;
    const price = parseFloat(document.getElementById("newBookPrice").value);
    const image = document.getElementById("newBookImage").value;

    if (title && !isNaN(price) && image) {
        const newBook = {
            id: (myBooks.length + 1).toString(), // calculate the id
            title: title,
            price: price,
            image: image,
            rating: null,
            comment: ""
        };

        myBooks.push(newBook);
        localStorage.setItem('books', JSON.stringify(myBooks));

        // get current sorting
        const sortBy = document.getElementById("sortBy").value;
        const sortedBooks = sortBooks(myBooks, sortBy); 

        displayBooks(sortedBooks); 

        // clean the form
        document.getElementById("newBookTitle").value = '';
        document.getElementById("newBookPrice").value = '';
        document.getElementById("newBookImage").value = '';

        form[0].style.display = "none";
    } else {
        alert("Please fill in all fields correctly.");
    }
});
