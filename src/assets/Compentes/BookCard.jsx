const BookCard = ({book ,checkout}) => {

    return (<>
        
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Author: {book.authorFirstName} {book.authorLastName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
            <span className="inline-block w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                {book.category}
            </span>
            {book.numberOfCopies<1&&(<p>Sorry no available books</p>)}
            <button className="mt-2 w-fit rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400" onClick={() => checkout(book)} disabled={book.numberOfCopies<1}>
                Check Out Book
            </button>
        </div>
        </>
    );
}
 
export default BookCard;