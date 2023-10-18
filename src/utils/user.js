import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"


import { db } from "./firebase"


export async function createUser(user) {
  const userRef = doc(db, "productionHouse", user.uid)
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      profilePicture: user.photoURL,
      mobile: user.phoneNumber,
    })
    console.log("Production House created")
  } else {
    console.log("Production House already exists")
  }
}

export async function getProductionHouse(userId) {
  return (await getDoc(doc(db, "productionHouse", userId))).data()
}

//after signin form
export async function updateProductionHouse(user, updatedData) {
  const userRef = doc(db, "productionHouse", user.uid)
  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    const existingData = userDoc.data()
    const newData = {
      ...existingData,
      name: updatedData.name,
      mobile: updatedData.phoneNumber,
      personnelName: updatedData.personnelName,
      personnelPosition: updatedData.personnelPosition,
      socialMedia: updatedData.socialMedia?.map(socialMedia => ({
        platform: socialMedia.platform,
        url: socialMedia.url
      }))
    }

    await updateDoc(userRef, newData)
    console.log("ProductionHouse Updated", newData)
  } else {
    throw new Error("Production house document does not exist.")
  }
}
