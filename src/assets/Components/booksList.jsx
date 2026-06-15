import { useState,useEffect } from "react";

import { useAuth0 } from '@auth0/auth0-react'
import BookCard from "./BookCard";
import { API } from "../../api";
const BooksList = () => {
    const { getAccessTokenSilently, user } = useAuth0();
const[books,setBooks]=useState([])
 const [loading,setLoading]=useState(true);
  const[error,setError]= useState(null)
  const[message,setMessage]= useState(null)
useEffect(()=>{
   const  getBooks = async () => {
    try {
        const token = await getAccessTokenSilently();
        const res= await fetch(API.getAllBooks(), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(!res.ok){
            throw new Error(`could not fetch data: ${res.status} ${res.statusText}`)
        }
        const data=await res.json()
        setBooks(data)
        //console.warn(data)
        
    } catch (error) {
        console.error("getBooks failed:", error)
        setError(error.message)
    } finally{
        setLoading(false)
    }
        

    }

        getBooks();
    },[]
)
const CheckOut = async (book) => {
    try {
        const token = await getAccessTokenSilently();
        const res= await fetch(API.checkoutBook(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
    title: `${book.title}`,
    authorFirstName: book.authorFirstName,
    authorLastName: book.authorLastName,
            }, 

  )
        });
        if (res.status === 409) {
            throw new Error(`Book is  not available for checkout`);
        }
        if (!res.ok) {
            throw new Error(`Could not checkout book: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Checkout successful:", data);
        setError(null);
        setMessage(`You have checked out "${book.title}" by ${book.authorFirstName} ${book.authorLastName}`);
    } catch (error) {
        console.error("Checkout failed:", error);
        setMessage(null);
        setError(error.message);
    }
};

    return (
    <div className="p-6">
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-600">{message}</p>}
        {books && books.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((book,index) => (
                    <BookCard key={index} book={book} checkout={CheckOut}/>
                ))}
            </div>
        ) : (
            !loading && <p className="text-gray-500">No books found</p>
        )}
    </div>
    );
}
 
export default BooksList;

