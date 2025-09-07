// src/app/api/process-image/route.ts
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

// The Admin SDK is needed for secure backend authentication
import * as admin from 'firebase-admin';

// Helper function to convert a Blob to a Base64 string
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Initialize Firebase Admin SDK if not already done
if (!admin.apps.length) {
  // It's assumed your service account key is in the root and ignored by Git
  const serviceAccount = require('@/../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(request: Request) {
  try {
    // Read the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header not found.' }, { status: 401 });
    }
    const idToken = authHeader.split('Bearer ')[1];

    // Verify the user's token using the Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
    }

    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists() || userDoc.data()?.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits.' }, { status: 402 });
    }

    await updateDoc(userDocRef, {
      credits: userDoc.data().credits - 1,
    });

    // Step 3: Call the real AI image processing API
    const API_KEY = process.env.REAL_ESRGAN_API_KEY;
    const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa', // The Real-ESRGAN model version
        input: { image: await blobToBase64(imageFile as Blob), scale: 4 }, // Upscale by 4x
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(errorData.detail || 'API failed to process the image.');
    }

    const data = await apiResponse.json();
    const processedImageUrl = data.output;

    return NextResponse.json({ processedImageUrl });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}