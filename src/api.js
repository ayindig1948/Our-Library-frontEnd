const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API = {
  getAllBooks: () => `${API_BASE}${import.meta.env.VITE_GET_ALL_BOOKS}`,
  checkoutBook: () => `${API_BASE}${import.meta.env.VITE_CHECKOUT_BOOK}`,
  checkinBook: () => `${API_BASE}${import.meta.env.VITE_CHECKIN_BOOK}`,
  getCheckedOutBooks: () => `${API_BASE}${import.meta.env.VITE_GET_CHECKED_OUT_BOOKS}`,
  addBook: () => `${API_BASE}${import.meta.env.VITE_ADD_BOOK}`,
  editBook: () => `${API_BASE}${import.meta.env.VITE_EDIT_BOOK}`,
  addBookItem: () => `${API_BASE}${import.meta.env.VITE_ADD_BOOK_ITEM}`,
  removeBook: () => `${API_BASE}${import.meta.env.VITE_REMOVE_BOOK}`,
  removeBookItem: () => `${API_BASE}${import.meta.env.VITE_REMOVE_BOOK_ITEM}`,
  booksToFulfill: () => `${API_BASE}${import.meta.env.VITE_BOOKS_TO_FULFILL}`,
  fulfillBook: (bookId) => `${API_BASE}${import.meta.env.VITE_FULFILL_BOOK}/${bookId}`,
  uploadImage: () => `${API_BASE}${import.meta.env.VITE_UPLOAD_IMAGE}`,
};

// Base URL used to resolve relative image paths (e.g. /uploads/x.jpg) returned by the API.
export const API_BASE_URL = API_BASE;

// Fire-and-forget request that wakes the Azure App Service worker.
// The backend sleeps after ~20 min idle (no "Always On" on Free/Shared tiers),
// so the first real call after idle pays a 10-30s cold start. Pinging here at
// page load lets the worker warm up in parallel with the Auth0 redirect, before
// any authenticated data call fires.
//
// `no-cors` is intentional: we don't read the response (an opaque 401/404 is
// fine — the request still reaches the worker and wakes it) and it avoids CORS
// errors in the console for a request the server isn't set up to answer.
export const warmUp = () => {
  if (!API_BASE) return;
  fetch(API_BASE, { mode: "no-cors" }).catch(() => {});
};
