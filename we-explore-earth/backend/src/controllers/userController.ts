import { db } from "../firestore";
import { Request, Response } from "express";
import admin from "firebase-admin";
import { User, NewUser } from "@shared/types/user";
import nodemailer from 'nodemailer';

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
    const { email, password, username, firstName, lastName, notifications } = req.body;

    if (!email || !password || !username || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //Part 1: Validate the user using firebase Auth + Send email verification link
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

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
      wantsNotifications: Boolean(notifications),
      isAdmin: false,
      events: []
    };

    //Part 3: POST user document to Firestore collection
    await db.collection("users").doc(userRecord.uid).set(userData);

    res.status(201).json({ 
      message: "User created successfully",
      uid: userRecord.uid 
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// PATCH /users/:id/
export async function updateUser(req: Request, res:Response) {
  try {
    const { id } = req.params;
    const { username, email, firstName, lastName, notificationToken, wantsNotifications, isAdmin } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const userDocument = await db.collection("users").doc(id as string).get();

    if (!userDocument.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDocument.data() as NewUser;  
    if (notificationToken !== undefined) userData.notificationToken = notificationToken;
    if (wantsNotifications !== undefined) userData.wantsNotifications = wantsNotifications;
  
    await db.collection("users").doc(id as string).set(userData);
    
    res.json({ id: id, ...userData });
    
  } catch (e: any) {
    res.status(500).json({ error: e.message });
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
