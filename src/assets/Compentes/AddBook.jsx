const AddBookCom = ({ book, HandleChange, AddBook }) => {
    return (
      <form onSubmit={AddBook} className="flex max-w-sm flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="authorFirstName"
          placeholder="Author First Name"
          value={book.authorFirstName}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="authorLastName"
          placeholder="Author Last Name"
          value={book.authorLastName}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="number"
          name="numberOfItems"
          placeholder="Number of Copies"
          value={book.numberOfItems}
          onChange={HandleChange}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="mt-6 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
        >
          Add Book
        </button>
      </form>
    );
};

export default AddBookCom;
