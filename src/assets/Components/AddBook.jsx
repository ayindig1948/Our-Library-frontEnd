const AddBookCom = ({ book, HandleChange, AddBook, onFileChange, preview }) => {
    return (
      <form onSubmit={AddBook} className="flex max-w-sm flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <input
          type="text"
          name="authorFirstName"
          placeholder="Author First Name"
          value={book.authorFirstName}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <input
          type="text"
          name="authorLastName"
          placeholder="Author Last Name"
          value={book.authorLastName}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={book.category}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <input
          type="number"
          name="numberOfItems"
          placeholder="Number of Copies"
          value={book.numberOfItems}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Cover image (optional)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onFileChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-purple-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-purple-700"
        />
        {preview && (
          <img
            src={preview}
            alt="Cover preview"
            className="h-40 w-auto rounded-lg border border-gray-200 object-cover"
          />
        )}

        <button
          type="submit"
          className="mt-6 cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:py-2"
        >
          Add Book
        </button>
      </form>
    );
};

export default AddBookCom;
