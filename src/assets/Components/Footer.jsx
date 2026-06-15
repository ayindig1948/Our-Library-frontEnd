const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <p>
                &copy; {new Date().getFullYear()} by{" "}
                <a
                    href="https://github.com/ayindig1948"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-purple-600 hover:underline dark:text-purple-400"
                >
                    Ay Indig
                </a>
            </p>
        </footer>
    );
}
 
export default Footer;