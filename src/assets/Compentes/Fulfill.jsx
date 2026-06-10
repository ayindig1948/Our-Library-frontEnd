import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import BookItemCard from "./BookItemCard";
import { API } from "../../api";

const Fulfill = () => {
  const [booksToFulfill, setBooksToFulfill] = useState([]);
  const [error, setError] = useState(null);
  const [message,setMassage]=useState(null)
  const [loading, setLoading] = useState(true);
  
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const getBooks = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(API.booksToFulfill(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(!res.ok){
            throw new Error(`could not fetch data: ${res.status} ${res.statusText}`)
        }
        const data=await res.json()
        setBooksToFulfill(data)
        
    } catch (error) {
        console.error("getBooksTuFulfil failed:", error)
        setError(error.message)
    } finally{
        setLoading(false)
    }
        

    }

        getBooks();
    },[]
)
     const FulfillBook=async(book)  =>{
        try {
            const token = await getAccessTokenSilently()
       const res = await fetch(API.fulfillBook(book.id), {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if(!res.ok){
            throw new Error(`could not fulfill book: ${res.status} ${res.statusText}`)
        }

        setBooksToFulfill((prev) => prev.filter((b) => b.id !== book.id))
        setMassage(`Fulfilled book id ${book.id}`)
    } catch (error) {
        console.error("getBooksTuFulfil failed:", error)
        setError(error.message)
            
        }
     
     }             
              
    return (  <div>
        {booksToFulfill.map((book,index)=>(
            <BookItemCard key={index} book={book} Fulfill={FulfillBook}/>
        ))}
                  {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>);
}
 
export default Fulfill