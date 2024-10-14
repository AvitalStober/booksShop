
// Import books from JSON file
import data from '../data/books.json' with { type: 'json' };

let myBooks = JSON.parse(localStorage.getItem('books')) || [];
console.log(myBooks);

if (myBooks.length === 0) {
    myBooks = data; // Load from JSON
    localStorage.setItem("books", JSON.stringify(myBooks)); // Save to localStorage
}

const sortBooks = (books, criterion) => {
    switch (criterion) {
        case "price":
            return books.sort((a, b) => a.price - b.price);
        case "title":
            return books.sort((a, b) => a.title.localeCompare(b.title)); // מיון לפי כותרת
        default:
            return books.sort((a, b) => a.id - b.id); // ברירת מחדל לפי ID
    }
};

// Function to display books in the table
// const displayBooks = (books) => {
//     const tableBody = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
//     tableBody.innerHTML = ''; // Clear the table content before adding new data

//     books.forEach(book => {
//         const tableLine = document.createElement("tr");

//         const idCell = document.createElement("td");
//         idCell.textContent = book.id;
//         tableLine.appendChild(idCell);

//         const titleCell = document.createElement("td");
//         titleCell.textContent = book.title;
//         tableLine.appendChild(titleCell);

//         const priceCell = document.createElement("td");
//         priceCell.textContent = `$${book.price.toFixed(2)}`;
//         tableLine.appendChild(priceCell);

//         // Eye icon
//         const actionCellShow = document.createElement("td");
//         actionCellShow.innerHTML = '&#128065;'; // Eye icon
//         actionCellShow.classList.add("tableImg");
//         actionCellShow.addEventListener("click", () => showBookDetails(book));
//         tableLine.appendChild(actionCellShow);

//         // Pencil icon
//         const actionCellUpdate = document.createElement("td");
//         actionCellUpdate.innerHTML = '&#9999;'; // Pencil icon
//         actionCellUpdate.classList.add("tableImg");
//         actionCellUpdate.addEventListener("click", () => editBookDetails(book));
//         tableLine.appendChild(actionCellUpdate);

//         // Garbage icon
//         const actionCellDelete = document.createElement("td");
//         actionCellDelete.innerHTML = '&#128465;'; // Garbage icon
//         actionCellDelete.classList.add("tableImg");
//         actionCellDelete.addEventListener("click", () => deleteBook(book.id));
//         tableLine.appendChild(actionCellDelete);

//         // Add the row to the table body
//         tableBody.appendChild(tableLine);
//     });
// };

const displayBooks = (books) => {
    const tableBody = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // נקה את התוכן הקיים

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

        // אייקון עין
        const actionCellShow = document.createElement("td");
        actionCellShow.innerHTML = '&#128065;'; // אייקון עין
        actionCellShow.classList.add("tableImg");
        actionCellShow.addEventListener("click", () => showBookDetails(book));
        tableLine.appendChild(actionCellShow);

        // אייקון עיפרון
        const actionCellUpdate = document.createElement("td");
        actionCellUpdate.innerHTML = '&#9999;'; // אייקון עיפרון
        actionCellUpdate.classList.add("tableImg");
        actionCellUpdate.addEventListener("click", () => editBookDetails(book));
        tableLine.appendChild(actionCellUpdate);

        // אייקון פח אשפה
        const actionCellDelete = document.createElement("td");
        actionCellDelete.innerHTML = '&#128465;'; // אייקון פח אשפה
        actionCellDelete.classList.add("tableImg");
        actionCellDelete.addEventListener("click", () => deleteBook(book.id));
        tableLine.appendChild(actionCellDelete);

        // הוסף את השורה לגוף הטבלה
        tableBody.appendChild(tableLine);
    });
};

document.getElementById("sortBy").addEventListener("change", (event) => {
    const sortedBooks = sortBooks(myBooks, event.target.value);
    displayBooks(sortedBooks);
});

// displayBooks(sortBooks(myBooks, "id"));

const showBookDetails = (book) => {
    document.getElementById("bookId").textContent = book.id;
    document.getElementById("bookTitleDisplay").textContent = book.title;
    document.getElementById("bookPriceDisplay").textContent = `$${book.price.toFixed(2)}`;
    document.getElementById("bookImageDisplay").src = book.image; // Load the book image

    // הצג דירוג קיים או טקסט "לא דורג"
    const bookRatingDisplay = document.getElementById("bookRatingDisplay");
    bookRatingDisplay.textContent = book.rating ? book.rating : "Not rated";

    const ratingInput = document.getElementById("bookRatingInput");
    ratingInput.value = book.rating || ''; // הגדר את שדה הקלט לדירוג הנוכחי

    // אפשר עריכה על ידי לחיצה
    bookRatingDisplay.onclick = () => {
        bookRatingDisplay.style.display = "none"; // הסתר את התצוגה
        ratingInput.style.display = "block"; // הראה את שדה הקלט
        ratingInput.focus(); // העבר את הפוקוס לשדה הקלט
    };

    // עדכון הדירוג
    ratingInput.onchange = () => {
        const newRating = parseInt(ratingInput.value);
        if (newRating >= 1 && newRating <= 5) {
            // עדכן את הדירוג בספר
            book.rating = newRating;

            // עדכן את localStorage
            let books = JSON.parse(localStorage.getItem('books'));
            const bookIndex = books.findIndex(b => b.id === book.id);
            if (bookIndex !== -1) {
                books[bookIndex].rating = newRating;
                localStorage.setItem('books', JSON.stringify(books)); // שמור את הנתונים המעודכנים
            }

            // עדכן את התצוגה
            bookRatingDisplay.textContent = newRating;
            ratingInput.style.display = "none"; // הסתר את שדה הקלט
            bookRatingDisplay.style.display = "inline"; // הראה את התצוגה מחדש
        } else {
            alert("Please enter a rating between 1 and 5.");
        }
    };

    // document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebar").classList.add("open");
    document.body.classList.add("sidebar-open"); 
};


const closeSidebar = () => {
    document.getElementById("sidebar").classList.remove("open");
    document.body.classList.remove("sidebar-open"); // הסר את הכיתה מהגוף
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
// displayBooks(myBooks);
displayBooks(sortBooks(myBooks, "id"));

const form = document.getElementsByClassName("addBookForm");

// Add a new book
document.getElementById("showAddBook").addEventListener("click", () => {
    form[0].style.display === "block" ? form[0].style.display = "none" : form[0].style.display = "block";
})

// document.getElementById("addBookButton").addEventListener("click", () => {
//     const title = document.getElementById("newBookTitle").value;
//     const price = parseFloat(document.getElementById("newBookPrice").value);
//     const image = document.getElementById("newBookImage").value;

//     if (title && !isNaN(price) && image) {
//         const newBook = {
//             id: (myBooks.length + 1).toString(), // יצירת ID חדש
//             title: title,
//             price: price,
//             image: image,
//             rating: null,
//             comment: ""
//         };

//         myBooks.push(newBook); // הוסף את הספר לרשימה
//         localStorage.setItem('books', JSON.stringify(myBooks)); // עדכון localStorage
//         displayBooks(myBooks); // עדכון התצוגה

//         // ניקוי השדות בטופס
//         document.getElementById("newBookTitle").value = '';
//         document.getElementById("newBookPrice").value = '';
//         document.getElementById("newBookImage").value = '';

//         form[0].style.display = "none";
//     } else {
//         alert("Please fill in all fields correctly.");
//     }
// });



document.getElementById("addBookButton").addEventListener("click", () => {
    const title = document.getElementById("newBookTitle").value;
    const price = parseFloat(document.getElementById("newBookPrice").value);
    const image = document.getElementById("newBookImage").value;

    if (title && !isNaN(price) && image) {
        const newBook = {
            id: (myBooks.length + 1).toString(), // יצירת ID חדש
            title: title,
            price: price,
            image: image,
            rating: null,
            comment: ""
        };

        myBooks.push(newBook); // הוסף את הספר לרשימה
        localStorage.setItem('books', JSON.stringify(myBooks)); // עדכון localStorage

        // קבלת קריטריון המיון הנוכחי
        const sortBy = document.getElementById("sortBy").value;
        const sortedBooks = sortBooks(myBooks, sortBy); // מיון מחדש לפי הקריטריון הנוכחי

        displayBooks(sortedBooks); // עדכון התצוגה

        // ניקוי השדות בטופס
        document.getElementById("newBookTitle").value = '';
        document.getElementById("newBookPrice").value = '';
        document.getElementById("newBookImage").value = '';

        form[0].style.display = "none";
    } else {
        alert("Please fill in all fields correctly.");
    }
});
