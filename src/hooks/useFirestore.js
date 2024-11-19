import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { nanoid } from "nanoid";

export const useFirestore = () => {
  const [data, setData] = useState([]); // Donde se guardan los datos
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({});

  // Obtener todos los documentos para el usuario actual
  const getData = async () => {
    try {
      setLoading((prev) => ({ ...prev, getData: true }));
      if (!auth.currentUser) throw new Error("No user is logged in.");

      const dataRef = collection(db, "urls");
      const q = query(dataRef, where("uid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const dataDB = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataDB);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, getData: false }));
    }
  };

  // Agregar un nuevo documento
  const addData = async (url) => {
    try {
      setLoading((prev) => ({ ...prev, addData: true }));
      if (!auth.currentUser) throw new Error("No user is logged in.");

      const newDoc = {
        enabled: true,
        nanoid: nanoid(6),
        origin: url,
        uid: auth.currentUser.uid,
      };

      const docRef = doc(db, "urls", newDoc.nanoid);
      await setDoc(docRef, newDoc);
      setData((prev) => [...prev, { id: docRef.id, ...newDoc }]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, addData: false }));
    }
  };

  // Eliminar un documento
  const deleteData = async (nanoid) => {
    try {
      setLoading((prev) => ({ ...prev, [nanoid]: true }));
      const docRef = doc(db, "urls", nanoid);
      await deleteDoc(docRef);
      setData((prev) => prev.filter((item) => item.nanoid !== nanoid));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [nanoid]: false }));
    }
  };

  // Actualizar un documento existente
  const updateData = async (nanoid, newOrigin) => {
    try {
      setLoading((prev) => ({ ...prev, updateData: true }));
      const docRef = doc(db, "urls", nanoid);
      await updateDoc(docRef, { origin: newOrigin });
      setData((prev) =>
        prev.map((item) =>
          item.nanoid === nanoid ? { ...item, origin: newOrigin } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, updateData: false }));
    }
  };

  // Buscar un documento por ID
  const searchData = async (nanoid) => {
    try {
      const docRef = doc(db, "urls", nanoid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Document not found.");
      }
      return { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return {
    data, // Datos obtenidos
    error, // Errores
    loading, // Estado de carga
    getData, // Obtener datos
    addData, // Agregar datos
    deleteData, // Eliminar datos
    updateData, // Actualizar datos
    searchData, // Buscar datos
  };
};
