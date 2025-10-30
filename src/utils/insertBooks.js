import { books } from "../data/books.js";
import { addProduct } from "./database.js";


export const insertBooks = async () => {
    try {
        const promises = [];
        for (let i = 0; i < books.length; i++) {
            const book = books[i];
            const response = await addProduct(book);
            promises.push(response);
        }
        await Promise.all(promises);
        console.log('All books inserted successfully');
    } catch (error) {
        console.error('Error inserting books:', error);
    }
}
