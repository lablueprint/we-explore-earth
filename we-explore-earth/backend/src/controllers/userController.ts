import { db } from "../firestore";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { User, NewUser, UserRSVP } from "@shared/types/user";
import nodemailer from 'nodemailer';

// GET /users/:id/events - get all events for a user
export async function getUserEvents(req: Request, res: Response) {
  try {
    const userDoc = await db
      .collection("users")
      .doc(req.params.id as string)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data() as {
      events?: { eventID: string; status: string }[];
    };

    const eventsList = userData.events ?? [];

    const events = await Promise.all(
      eventsList.map(async ({ eventID, status }) => {
        const eventDoc = await db.collection("events").doc(eventID).get();
        if (!eventDoc.exists) return null;

        return {
          id: eventDoc.id,
          ...eventDoc.data(),
          status,
        };
      })
    );

    return res.status(200).json(events.filter(Boolean));
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(500).json({ error: "Failed to fetch user events" });
  }
}

// GET /users/:id
export async function getUser(req: Request, res: Response) {
  try {
    const doc = await db.collection("users").doc(req.params.id as string).get();

    if (!doc.exists) return res.status(404).json({ error: "User not found" });

    res.json({ id: doc.id, ...doc.data() });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// POST /users/signup
export async function signupUser(req: Request, res: Response) {
  try {
    const { email, password, username, firstName, lastName, notifications} = req.body;

    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const configSnap = await db.doc("config/shared").get();

    if (!configSnap.exists) {
      return res.status(500).json({ error: "Config not found" });
    }

    const admins: string[] = configSnap.data()?.admins ?? [];

    const isAdmin = admins.includes(normalizedEmail);




    //Part 1: Validate the user using firebase Auth + Send email verification link
    const userRecord = await admin.auth().createUser({
      email: normalizedEmail,
      password,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: isAdmin });

    // Generate verification link
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - We Explore Earth',
      html: `
        <h2>Welcome to We Explore Earth, ${firstName}!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${verificationLink}</p>
      `
    });

    //Part 2: Create user document
    const userData: NewUser = {
      username,
      email,
      firstName,
      lastName,
      notificationToken: null,
      isAdmin: isAdmin,
      events: [],
      avatar: null,
      hasOnboarded: false
    };

    //Part 3: POST user document to Firestore collection
    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
      admin: isAdmin,
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// PATCH /users/:id/
export async function updateUser(req: Request, res:Response) {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, notificationToken, isAdmin, hasOnboarded } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const userDocument = await db.collection("users").doc(id as string).get();

    if (!userDocument.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDocument.data() as NewUser;
    if (notificationToken !== undefined) userData.notificationToken = notificationToken;
    if (hasOnboarded !== undefined) userData.hasOnboarded = hasOnboarded;
  
    await db.collection("users").doc(id as string).set(userData);

    res.json({ id: id, ...userData });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

// PATCH /users/:id/avatar ;set the user's chosen avatar key
export async function updateUserAvatar(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { avatarKey } = req.body;

    if (!avatarKey) {
      return res.status(400).json({ error: "avatarKey is required" });
    }

    const userRef = db.collection("users").doc(id as string);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({ avatar: avatarKey });

    return res.json({ id, avatar: avatarKey });
  } catch (error: any) {
    console.error("Error updating user avatar:", error);
    return res.status(500).json({ error: "Failed to update user avatar" });
  }
}

// POST /users/login
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Try to sign in using Firebase REST API with better error handling
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Log the specific error for debugging
      console.log('Firebase Auth Error:', data);

      if (data.error?.message?.includes('EMAIL_NOT_FOUND')) {
        return res.status(401).json({ error: "No account found with this email" });
      } else if (data.error?.message?.includes('INVALID_PASSWORD')) {
        return res.status(401).json({ error: "Incorrect password" });
      } else if (data.error?.message?.includes('USER_DISABLED')) {
        return res.status(401).json({ error: "Account has been disabled" });
      } else {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    // Get user details from Firebase Auth
    const user = await admin.auth().getUserByEmail(email);

    // Check if user is authenticated
    if (!user.emailVerified) {
      return res.status(400).json({
        error: "Please verify your email before logging in"
      });
    }

    // Get user from database
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// POST /users/reset for resetting the user password by email
export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const verificationLink = await admin.auth().generatePasswordResetLink(email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - We Explore Earth',
      html: `
        <h2>Reset Your Password - We Explore Earth</h2>
        <p>Please click the link below to reset your password:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${verificationLink}</p>
      `
    });

    res.json({ message: "Password reset email sent" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

// POST /users/:id/rsvp
export async function addOrUpdateUserRSVP(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { eventID, status } = req.body;

    if (!eventID || !status) {
      return res.status(400).json({ error: "eventID and status are required" });
    }

    if (status !== 'YES' && status !== 'MAYBE') {
      return res.status(400).json({ error: "status must be 'YES' or 'MAYBE'" });
    }

    const userRef = db.collection("users").doc(id as any);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data()!;
    const userEvents: UserRSVP[] = userData.events.filter((e: UserRSVP) => e.eventID !== eventID);
    userEvents.push({ eventID, status });

    await userRef.update({ events: userEvents });

    return res.status(200).json({ message: "User RSVP updated successfully" });
  } catch (error: any) {
    console.error("Error updating user RSVP:", error);
    return res.status(500).json({ error: "Failed to update user RSVP" });
  }
}

// DELETE /users/:id/rsvp
export async function removeUserRSVP(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { eventID } = req.body;

    if (!eventID) {
      return res.status(400).json({ error: "eventID is required" });
    }

    const userRef = db.collection("users").doc(id as any);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data()!;
    const userEvents: UserRSVP[] = userData.events.filter(
      (e: UserRSVP) => e.eventID !== eventID
    );

    await userRef.update({ events: userEvents });

    return res.status(200).json({ message: "User RSVP removed successfully" });
  } catch (error: any) {
    console.error("Error removing user RSVP:", error);
    return res.status(500).json({ error: "Failed to remove user RSVP" });
  }
}

// GET /users/:id/rsvps
export async function getUserRSVPs(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const userDoc = await db.collection("users").doc(id as any).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data()!;
    const userEvents: UserRSVP[] = userData.events;

    if (userEvents.length === 0) {
      return res.json([]);
    }

    const eventIds = userEvents.map((e) => e.eventID);
    const eventsSnapshot = await db.collection("events")
      .where(admin.firestore.FieldPath.documentId(), 'in', eventIds)
      .get();

    const rsvps = eventsSnapshot.docs.map((doc) => {
      const userRSVP = userEvents.find((e) => e.eventID === doc.id);
      return {
        event: { id: doc.id, ...doc.data() },
        status: userRSVP?.status || null,
      };
    });

    res.json(rsvps);
  } catch (e: any) {
    console.error("Error fetching user RSVPs:", e);
    res.status(500).json({ error: e.message });
  }
}
