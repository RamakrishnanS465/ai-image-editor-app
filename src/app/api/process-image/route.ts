    // src/app/api/process-image/route.ts
    import { NextResponse } from 'next/server';
    import { doc, getDoc, updateDoc } from 'firebase/firestore';
    import { auth, db } from '@/firebase';

    export async function POST(request: Request) {
      try {
        // Step 1: Parse the request body (image file)
        const formData = await request.formData();
        const imageFile = formData.get('image');

        if (!imageFile) {
          return NextResponse.json({ error: 'No image file uploaded.' }, { status: 400 });
        }

        // Step 2: Authenticate the user (simulated)
        // In a real app, we would verify the user's session token here.
        // For this demo, we'll assume the user is authenticated from the client-side.
        const user = auth.currentUser;
        if (!user) {
          return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        // Step 3: Check and deduct credits from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists() || userDoc.data()?.credits < 1) {
          return NextResponse.json({ error: 'Insufficient credits.' }, { status: 402 });
        }

        // Deduct one credit
        await updateDoc(userDocRef, {
          credits: userDoc.data().credits - 1,
        });

        // Step 4: Simulate AI image processing
        console.log(`Processing image for user ${user.uid}...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI delay

        // Step 5: Return a placeholder processed image URL
        const processedImageUrl = `https://placehold.co/600x400/94A3B8/FFFFFF?text=Processed+Image`;

        return NextResponse.json({ processedImageUrl });
      } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
      }
    }
    
