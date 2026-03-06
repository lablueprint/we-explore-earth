import { Request, Response } from "express";
import admin from "firebase-admin";
// import { updateDoc } from "firebase/firestore";

const db = admin.firestore();

export async function getAdmins(req: Request, res: Response) {
  try {
    const snap = await db.doc("config/shared").get();
    const data = snap.data();

    res.json({ admins: data?.admins ?? [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


export async function addAdmin(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await db.doc("config/shared").update({
      admins: admin.firestore.FieldValue.arrayUnion(normalizedEmail),
    });

    const usersRef = db.collection("users");
    const snap = await usersRef.where("email", "==", normalizedEmail).limit(1).get();

    if (!snap.empty) {
      const userDocRef = snap.docs[0].ref;
      await userDocRef.set({ isAdmin: true }, { merge: true });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}


export async function removeAdmin(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await db.doc("config/shared").update({
      admins: admin.firestore.FieldValue.arrayRemove(normalizedEmail),
    });

    const userRef = db.collection("users")
    const snap = await userRef.where("email", "==", normalizedEmail).limit(1).get();

  
    if(!snap.empty){
      const userDocRef = snap.docs[0].ref;
      await userDocRef.set({ isAdmin: false }, { merge: true });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// GET /config/categories - Get categories for event form/filters
export async function getCategories(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("config").doc("shared").get();
    if (!snapshot.exists) {
      return res.status(404).json({ error: "No config found" });
    }

    const data = snapshot.data();
    const category: string[] = Array.isArray(data?.category) ? data.category : [];

    return res.json({ category });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// GET /config/accommodations - Get accommodations for event form
export async function getAccommodations(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("config").doc("shared").get();
    if (!snapshot.exists) {
      return res.status(404).json({ error: "No config found" });
    }

    const data = snapshot.data();
    const accommodation: string[] = Array.isArray(data?.accommodation)
      ? data.accommodation
      : Array.isArray(data?.accommodations)
        ? data.accommodations
        : [];

    return res.json({ accommodation });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
