import { onSnapshot, orderBy, query, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { appFirestore } from "../firebase/config";

const useFirestore = (collectionDocs) => {
    const [docs, setDocs] = useState([]);
    useEffect( () => {
        const q = query(collection(appFirestore, collectionDocs), orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(q, (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({...doc.data(), id: doc.id});
            });
            setDocs(documents);
        })
        return () => unsub();
    }, [collectionDocs])

    return { docs };
}

export default useFirestore;