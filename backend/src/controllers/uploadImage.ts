import { initializeApp } from "firebase/app";
import { firebaseConfig } from '../config/firebaseconfig';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from 'multer';


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const upload = multer({storage: multer.memoryStorage()});

const uploadImage = async (req:Request, res:Response) => {
    try {
        const file = req.file;
        const storageRef = ref(storage, `images/${file.originalname}`);
        const uploadTask = uploadBytesResumable(storageRef, file.buffer);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                console.error("Error during image upload:", error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    res.send({ success: true, downloadURL });
                });
            }
        );
    } catch (error) {
        console.error("Error during image upload:", error);
        res.send({ success: false });
    }
}