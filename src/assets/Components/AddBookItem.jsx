const AddBookItem = ({book,HandleChange,AddItem}) => {
    return ( <form onSubmit={AddItem} className="flex max-w-sm flex-col gap-3">
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
          type="number"
          name="numberOfItems"
          min="1"
          placeholder="Number of Copies"
          value={book.numberOfItems}
          onChange={HandleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base sm:py-2 sm:text-sm"
        />
        <button
          type="submit"
          className="mt-6 cursor-pointer rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 sm:py-2"
        >
          Add  Copy
        </button>
      </form>
    ); 
}
 
export default AddBookItem;