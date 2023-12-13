
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

     // Memeriksa properti "name"
     if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Memeriksa nilai "readPage" lebih besar dari "pageCount"
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }


    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
    const newbook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
      };
      books.push(newbook);

    // Menampilkan pesan sukses
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    });
    response.code(201);
    return response;

  };

  const getAllBooksHandler = (request, h) => {
    const { name, reading, finished} = request.query;

    // memeriksa apakah array book kosong
    if (books.length === 0) {
        // array book kosong
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }
    else {
        let allBooks = books;

        // filter query name
        if (name) {
            // filter nama buku dari array book
            allBooks = books.filter(book =>
                book.name.toLowerCase().includes(name.toLowerCase())
            );
    
            // Mengecek apakah nama buku ada
            if (allBooks.length > 0) {
                // jika nama buku ada
                const filteredBooks = allBooks.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
    
                const response = h.response({
                    status: 'success',
                    data: {
                        books: filteredBooks,
                    },
                });
                response.code(200);
                return response;
            } else {
                // jika nama buku tidak ada
                const response = h.response({
                    status: 'fail',
                    message: `Buku dengan nama '${name}' tidak ditemukan.`,
                });
                response.code(404);
                return response;
            }
    
        } 
        

        // filter query reading
        if (reading === "0") {
            allBooks = books.filter(book => !book.reading);
        } else if (reading === "1") {
            allBooks = books.filter(book => book.reading);
        }

        // filter query finished
        if (finished === "0"){
            allBooks = books.filter(book => !book.finished);
        } else if (finished === "1"){
            allBooks = books.filter(book => book.finished);
        }

        // menampilkan semua buku tanpa query, dengan query reading dan finished
        const filteredBooks = allBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooks,
            },
        });
        response.code(200);
        return response;
    }

};
 
const getBookDetailByIdHandler = (request, h) => {
    const { bookId } = request.params;

    //mencari buku dengan ID
    const book = books.find((book) => book.id === bookId);

    // buku ditemukan
    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }


    //  buku tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};


const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;

    // memeriksa properti name
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Memeriksa nilai "readPage" lebih besar dari "pageCount"
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    
    // Memeriksa apakah id buku ada
    const index = books.findIndex((book) => book.id === bookId);
    
    if (index !== -1) {
        // update buku yang ditemukan
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;

        books[index] = {
          ...books[index],
          name,
          year, 
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          finished,
          updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }

      //jika id buku tidak ditemukan
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;

};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    // Memeriksa apakah id buku ada
    const index = books.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
    // delete id buku jika ditemukan
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
   
    // jika id buku tidak ditemukan
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


  module.exports = { 
    addBookHandler, 
    getAllBooksHandler,
    getBookDetailByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
