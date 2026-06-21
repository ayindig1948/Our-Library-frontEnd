const BookItemCard = ({book,Fulfill}) => {
    return ( 

  
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
           Id:{book.id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{book.userId}</p>
            
            <button className="cursor-pointer  mt-2 w-fit rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700" onClick={() => Fulfill(book)}>
               Fulfill book
            </button>
        </div>
    );
}
 
export default BookItemCard;
    