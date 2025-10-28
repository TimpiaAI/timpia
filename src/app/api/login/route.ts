// src/app/api/login/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { hashPassword, setSessionCookie } from '@/lib/auth/session';

const DEFAULT_USERNAME = 'MarketManager';
const DEFAULT_PASSWORD = '8t73gyubca89';

async function ensureDefaultUser(db: FirebaseFirestore.Firestore) {
  const docRef = db.collection('DashboardUsers').doc(DEFAULT_USERNAME);
  const snapshot = await docRef.get();
  if (snapshot.exists) {
    return snapshot.data();
  }

  const passwordHash = hashPassword(DEFAULT_PASSWORD);
  const payload = {
    username: DEFAULT_USERNAME,
    passwordHash,
    role: 'dashboard',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    mustChangePassword: true,
  };
  await docRef.set(payload, { merge: true });
  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, newPassword, confirmPassword } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nume utilizator și parolă obligatorii.' },
        { status: 400 },
      );
    }

    const normalizedUsername = String(username).trim();
    const docId = normalizedUsername.toLowerCase() === DEFAULT_USERNAME.toLowerCase()
      ? DEFAULT_USERNAME
      : normalizedUsername;
    const userPassword = String(password);

    const db = getAdminDb();
    await ensureDefaultUser(db);

    const docRef = db.collection('DashboardUsers').doc(docId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json(
        { error: 'Date de autentificare invalide.' },
        { status: 401 },
      );
    }

    const data = snapshot.data();
    if (!data?.passwordHash) {
      return NextResponse.json(
        { error: 'Date de autentificare invalide.' },
        { status: 401 },
      );
    }

    const incomingHash = hashPassword(userPassword);
    const storedHash = String(data.passwordHash);

    if (incomingHash !== storedHash) {
      return NextResponse.json(
        { error: 'Date de autentificare invalide.' },
        { status: 401 },
      );
    }

    const mustChangePassword = !!data.mustChangePassword;

    if (mustChangePassword && !newPassword) {
      return NextResponse.json(
        { requiresPasswordChange: true, message: 'Este necesară setarea unei noi parole.' },
        { status: 409 },
      );
    }

    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Parola nouă trebuie să aibă cel puțin 8 caractere.' },
          { status: 400 },
        );
      }
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: 'Parolele nu coincid.' },
          { status: 400 },
        );
      }

      const updatedHash = hashPassword(newPassword);
      await docRef.set(
        {
          passwordHash: updatedHash,
          mustChangePassword: false,
          passwordUpdatedAt: FieldValue.serverTimestamp(),
          lastLoginAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      await docRef.set(
        {
          mustChangePassword: false,
          lastLoginAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    await setSessionCookie(docId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[LOGIN] Error:', error);
    return NextResponse.json(
      { error: 'Eroare internă la autentificare.' },
      { status: 500 },
    );
  }
}
