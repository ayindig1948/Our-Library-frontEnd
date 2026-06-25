import { useState } from "react";
import { API_BASE_URL } from "../../api";
import EditBook from "./Edit";

const BookCard = ({ book, checkout, refresh }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const hasImage = Boolean(book.imageUrl) && !errored;
    const imageSrc = book.imageUrl ? `${API_BASE_URL}${book.imageUrl}` : null;

    return (
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            {/* Cover image with skeleton-while-loading + fallback */}
            <div className="relative mb-1 h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                {hasImage ? (
                    <>
                        {!loaded && (
                            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600" />
                        )}
                        <img
                            src={imageSrc}
                            alt={`Cover of ${book.title}`}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                            onError={() => setErrored(true)}
                            className={
                                "h-full w-full object-cover transition-opacity duration-300 " +
                                (loaded ? "opacity-100" : "opacity-0")
                            }
                        />
                    </>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500">
                        {book.title?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Author: {book.authorFirstName} {book.authorLastName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{book.description}</p>
            <span className="inline-block w-fit rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                {book.category}
            </span>
            {book.numberOfCopies < 1 && (<p>Sorry no books  available</p>)}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <button className=" cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 " onClick={() => checkout(book)} disabled={book.numberOfCopies < 1}>
                    Check Out Book
                </button>
                <button
                    className="cursor-pointer rounded-lg border border-purple-600 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-gray-700"
                    onClick={() => setShowEdit(true)}
                >
                    Edit
                </button>
            </div>

            {showEdit && (
                <EditBook
                    book={book}
                    onClose={() => setShowEdit(false)}
                    onSaved={refresh}
                />
            )}
        </div>
    );
}

export default BookCard;
