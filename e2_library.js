/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'));
patrons.push(new Patron('Kelly Jones'));

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary);

/*-----------------------------------------------------------*/
/* End of starter code - do not edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();
	var bookName = document.getElementById("newBookName").value;
	var bookAuthor = document.getElementById("newBookAuthor").value;
	var genre = document.getElementById("newBookGenre").value;

	// Add book book to global array
	var newBook = new Book(bookName, bookAuthor, genre);
	libraryBooks.push(newBook);
	console.log("Added "+bookName+" "+bookAuthor+" "+genre);
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookId = document.getElementById("loanBookId").value;
	const cardNumber = document.getElementById("loanCardNum").value;

	var bookToLoan = libraryBooks[bookId];
	var borrower = patrons[cardNumber];
	console.log("Loan "+ bookToLoan.title + " to "+ borrower.name);

	//Update BookTable
	bookTable.rows[parseInt(bookId)+1].cells[2].innerHTML = cardNumber;
	// Add patron to the book's patron property
	bookToLoan.patron = borrower;
	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(bookToLoan);
	// Start the book loan timer.
	libraryBooks[bookId].setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	// Call removeBookFromPatronTable()
	// Change the book object to have a patron of 'null'
	if(e.target.className == "return"){
		
		const index = e.target.parentElement.parentElement.children[0].innerHTML; 
		const row = e.target.parentElement.parentElement;
		const bookToRemove = libraryBooks[parseInt(index)];
		
		bookTable.rows[parseInt(index)+1].cells[2].innerHTML = ""; // Update BookTable
		removeBookFromPatronTable(bookToRemove);

		e.target.closest('table').deleteRow(row.rowIndex);
		console.log(bookToRemove.title+ " is returned.");
	}
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newPatron = new Patron(document.getElementById("newPatronName").value);
	patrons.push(newPatron);
	console.log(newPatron.name + " has been added as a new patron.");

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const index = document.getElementById("bookInfoId").value;
	// Call displayBookInfo()
	const findBook = libraryBooks[parseInt(index)];
	console.log("Displaying info on: "+findBook.title);
	displayBookInfo(findBook);	

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	//tr |td bookID td|bookName td| patron card number tr//
	
	var row = bookTable.insertRow(-1);
	var ID = row.insertCell(0);
	var Name = row.insertCell(1);
	var PatronNumber = row.insertCell(2);
	ID.innerHTML = book.bookId;
	Name.innerHTML = book.title;
	PatronNumber.innerHTML = book.patron;

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	const info = document.getElementById("bookInfo").querySelectorAll("p span");
	info[0].innerHTML = book.bookId;
	info[1].innerHTML = book.title;
	info[2].innerHTML = book.author;
	info[3].innerHTML = book.genre;
	if(book.patron != null){
		info[4].innerHTML = book.patron.cardNumber;
	}
	else info[4].innerHTML = "N/A";
	
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	const index = book.patron.cardNumber;
	const patronLoans = document.querySelectorAll('.patronLoansTable');
	
	var row = patronLoans[index].insertRow(-1);
	var ID = row.insertCell(0);
	var Title = row.insertCell(1);
	var Status = row.insertCell(2);
	var button = row.insertCell(3); 
	ID.innerHTML = book.bookId;
	Title.innerHTML = book.title;
	Status.innerHTML = '<span class = "green">Within due date</span>';
	button.innerHTML = "<button class='return'>return</button>";
	
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here

	var newDiv = document.createElement("div");
	newDiv.setAttribute("class", "patron");
	patronEntries.appendChild(newDiv);
	newDiv.innerHTML = '<p>Name: <span>'+ patron.name +'</span></p><p>Card Number: <span>'+patron.cardNumber+'</span></p>'+
	'<h4>Books on loan:</h4><table class="patronLoansTable"><tbody><tr><th>BookID</th><th>Title</th><th>Status</th><th>Return'+
	'</th></tr></tbody></table></div>';


}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	book.patron = null;
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const booksLoaned = patronEntries.children[parseInt(book.patron.cardNumber)].querySelectorAll("td");
	for(let i=0; i < booksLoaned.length; i++){
		if(booksLoaned[i].innerHTML == book.bookId){
			booksLoaned[i].parentElement.children[2].innerHTML = "<span class='red'>Overdue</span>";
			break;
		}
	}

}