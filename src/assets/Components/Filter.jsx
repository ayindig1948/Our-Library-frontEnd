const Filter = ({setTitleFilter,setCategoryFilter,titleFilter,categoryFilter

}) => {
    return (  <div className="mb-4 flex flex-col gap-4">
            <input
                type="text"
                placeholder="Search by title"
                onChange={(e)=>{setTitleFilter(e.target.value)}}
                className="w-full max-w-md  rounded-lg border border-purple-500 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-500 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
            <input
                type="text"
                placeholder="Search by category"
                onChange={(e)=>{setCategoryFilter(e.target.value)}}
                className="w-full  max-w-md rounded-lg border border-purple-500 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-500 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

        </div>);
}
 
export default Filter