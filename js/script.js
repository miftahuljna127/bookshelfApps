let bookList = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const addBookButton = document.getElementById('add-book-button');
const addBookDisplay = document.getElementById('add-book-display');
const bookListed = document.querySelectorAll('.book__item');
const bookComplete = document.getElementById('book-complete');
const bookNotComplete = document.getElementById('book-not-complete');
const modalSearchDisplay = document.getElementById('modal-search-data');

// Melakukan generate id
function generateId() {
  return +new Date();
}

function generateBookObject(id, titles, authors, years, isComplete) {
  return {
    id, 
    titles,
    authors,
    years,
    isComplete
  }
}

function findBook(bookId) {
  for (const item of bookList) {
    if(item.id === bookId) {
      return item;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Menampilkan form tambah buku
addBookButton.addEventListener('click', function() {
  if(addBookDisplay.style.display === 'none') {
    addBookDisplay.style.display = 'block';
  } else {
    addBookDisplay.style.display = 'none';
  }
}); 

// Mengambil nilai data buku dari form input
function addBook() {
  const titleBook = document.getElementById('title').value;
  const authorBook = document.getElementById('author').value;
  const yearsBook = document.getElementById('year').value;
  const readCheckBook = document.getElementById('read-check').checked;

  const generateID = generateId();
  const bookObject = generateBookObject(generateID, titleBook, authorBook, yearsBook, readCheckBook);
  bookList.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Melakukan complete or not complete check buku
function myFunction() {
  if (readCheckBook.checked == true) {
    bookComplete;
  } else {
    bookNotComplete;
  }
}

// Membuat struktur item buku untuk ditampilkan
function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.titles;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${bookObject.authors}`;

  const textYears = document.createElement('p');
  textYears.innerText = `Tahun: ${bookObject.years}`;

  const textDetail = document.createElement('div');
  textDetail.classList.add('book__detail');
  textDetail.append(textTitle, textAuthor, textYears);

  const ItemContainer = document.createElement('div');
  ItemContainer.classList.add('book__item');
  ItemContainer.append(textDetail);
  ItemContainer.setAttribute('id', `book-${bookObject.id}`);

  const undoButton = document.createElement('button');
  if(bookObject.isComplete) {
    // Membuat button undo from complete
    undoButton.classList.add('undo__button');
    undoButton.title = "Belum Selesai Dibaca";
    undoButton.addEventListener('click', function() {
      undoBookFromComplete(bookObject.id);
    });
  } else {
    // Membuat button add buku to complete
    undoButton.classList.add('checklist__button');
    undoButton.title = "Selesai Dibaca";
    undoButton.addEventListener('click', function() {
      addBookToComplete(bookObject.id);
    });
  }

  // Membuat button edit buku
  const editButton = document.createElement('button');
  editButton.classList.add('edit__button');
  editButton.title = "Edit Buku";
  editButton.addEventListener('click', function() {
    editShowData(bookObject.id);
  });

  // Membuat button delete buku
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete__button');
  deleteButton.title = "Hapus Buku";
  deleteButton.addEventListener('click', function() {
    deleteBookFromComplete(bookObject.id);
  });

  const textAction = document.createElement('div');
  textAction.classList.add('book__action');
  textAction.append(editButton, undoButton, deleteButton);

  ItemContainer.append(textDetail, textAction);
  return ItemContainer;
}

// Menambahkan buku ke complete
function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);

  if(bookTarget == null ) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Menampilkan modal edit dan data bukunya
function editShowData(bookId) {
  // Untuk menampilkan modal edit data
  const editForm = document.getElementById('edit-book');
  const modalEditDisplay = document.getElementById('edit-wrapper');
  modalEditDisplay.style.display = 'grid';
  const closeModal = function(event) {
    if (event.target == modalEditDisplay) {
      modalEditDisplay.style.display = 'none';
    }
  }
  modalEditDisplay.addEventListener('click', closeModal);

  // Menampilkan data buku pada form edit
  const book = findBook(Number(bookId));
  const edittitleBook = document.getElementById('edit-title');
  const editauthorBook = document.getElementById('edit-author');
  const edityearsBook = document.getElementById('edit-year');
  const editcheckBook = document.getElementById('edit-read-check');

  edittitleBook.value = book.titles;
  editauthorBook.value = book.authors;
  edityearsBook.value = book.years;
  editcheckBook.checked = book.isComplete;

  // Melakukan submit untuk menyimpan data
  editForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateEditBook(bookId);
  });
}

// Melakukan perubahan data buku dan menyimpan ke storage
function updateEditBook(bookId) {
  // Menemukan buku berdasarkan id
  const bookTarget = findBook(bookId);
  
  // Ambil nilai data buku dari form input edit
  const updateTitle = document.getElementById('edit-title').value;
  const updateauthor = document.getElementById('edit-author').value;
  const updateyears = document.getElementById('edit-year').value;
  const updatecheck = document.getElementById('edit-read-check').checked;

  bookTarget.titles = updateTitle;
  bookTarget.authors = updateauthor;
  bookTarget.years = updateyears;
  bookTarget.isComplete = updatecheck;

  // Simpan data ke local storage
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  // Memuat halaman setelah diubah
  location.reload(true);
}

// Menampilkan modal untuk menghapus buku
function deleteBookFromComplete(bookId) {
  const bookTarget = findBookIndex(bookId);
  
  const modalDeleteDisplay = document.getElementById('delete-wrapper');
  modalDeleteDisplay.style.display = 'grid';
  
  const closeModal = function(event) {
    if (event.target == modalDeleteDisplay) {
      modalDeleteDisplay.style.display = 'none';
    }
  }
  modalDeleteDisplay.addEventListener('click', closeModal);

  // Jika pilihan hapus di klik maka akan buku terhapus
  const yesAction = document.getElementById('yes-action');
  if (yesAction) {
    yesAction.addEventListener('click', function() {
      if (bookTarget === -1 ) return;
      bookList.splice(bookTarget, 1);
      saveData();
      console.log(bookList);
      return location.reload();
    });
  }

  // Jika pilihan batal di klik maka konfirmasi akan batal
  const noAction = document.getElementById('no-action');
  if (noAction) {
    noAction.addEventListener('click', function() {
      modalDeleteDisplay.style.display = 'none';
    });
  }
}

// Undo buku dari complete ke uncomplete
function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);

  if(bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Untuk pencarian buku berdasarkan judul buku atau penulis
function searchingBook() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  // const serializedData = localStorage.getItem(STORAGE_KEY);
  // const data = JSON.parse(serializedData);
  // const datas = data.filter(function(bookObject) {
  //   return (
  //     bookObject.titles.toLowerCase().includes(searchInput) || 
  //     bookObject.authors.toLowerCase().includes(searchInput)
  //   );
  // });

  // if(datas.length === 0) {
  //   modalSearchDisplay.style.display = 'block';
  //   return setTimeout((function() {
  //     location.reload();
  //   }), 4000);
  // }
const bookListed = document.querySelectorAll('.book__item > .book__detail');

  for(let book of bookListed) {
    console.log(book);
    const title = book.childNodes[0];
    const author = book.childNodes[1];
    console.log(title);
    console.log(!title.innerText.toLowerCase().includes(searchInput));
    if(title.innerText.toLowerCase().includes(searchInput) || author.innerText.toLowerCase().includes(searchInput)) {
      title.parentElement.parentElement.style.display = "display";
    } else {
      title.parentElement.parentElement.style.display = "none";
    }
  }



  // console.log(datas);
  // for(let book of bookListed) {
  //   if (searchInput == book.innerText) {
  //     console.log(book.innerText, 'poo');
  //     // book.parentElement.remove();
  //     book.style.display = "block";
  //   } else {
  //     book.style.display = "";
  //     console.log(book.innerText, "ypp");
  //   }
  // }

  // if(searchInput !== '') {
  //   bookList = [];
  //   for(const item of datas) {
  //     bookList.push(item);
  //     console.log(item);
  //   }
  //   document.dispatchEvent(new Event(RENDER_EVENT));
  // } else {
  //   bookList = [];
  //   loadDataFromStorage();
  // }
}

// Menyimpan data ke local storage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Jika perangkat browser tidak mendukung local storage
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const index of data) {
      bookList.push(index);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
  const submitBook = document.getElementById('add-book');
  submitBook.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });
  
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searchBook = document.getElementById('search-books');
  searchBook.addEventListener('submit', function(event) {
    event.preventDefault();
    // const searchInput = document.getElementById('search-input').value;
    // searchingBook(searchInput.toLowerCase());
    searchingBook();
  });
});

document.addEventListener(RENDER_EVENT, function() {
  bookComplete.innerHTML = '';
  bookNotComplete.innerHTML = '';

  for (const item of bookList) {
    const bookElement = makeBook(item);
    if (!item.isComplete) {
      bookNotComplete.append(bookElement);
    } else {
      bookComplete.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, function() {
  console.log(localStorage.getItem(STORAGE_KEY));
});
