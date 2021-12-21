import { useState, useEffect } from "react";
import { appStorage } from "../firebase/config";
import { appFirestore, timeStamp } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore'

const useStorage = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        // refrences 
        const storageRef = ref(appStorage, file.name)

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                let percentage =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(percentage);
            },
            (err) => {
                setError(err);
            },
            async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(url);
            await addDoc(collection(appFirestore, 'images'), { url, createdAt: timeStamp.now() });
            setUrl(url);
            }
        );
    }, [file]);
    return { progress, url, error }
}

export default useStorage;