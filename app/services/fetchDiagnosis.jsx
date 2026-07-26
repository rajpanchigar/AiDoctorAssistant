import { db } from "../../configs/FirebaseConfigs";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../configs/FirebaseConfigs";

export const fetchDiagnosis = async (id) => {
  try {
    const docRef = doc(db, "user_diagnoses", id);
    const result = await getDoc(docRef);

    if (result.exists()) {
      return result.data();
    } else {
      console.log("Data Not Found");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};