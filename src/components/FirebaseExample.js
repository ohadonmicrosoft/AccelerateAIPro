import React, { useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  createDocument,
  updateDocument,
  deleteDocument,
  uploadFile,
  subscribeToDocument
} from '../utils/firebaseUtils';

const FirebaseExample = () => {
  const [user, setUser] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example registration
  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await registerUser('test@example.com', 'password123');
      await createUserProfile(newUser.uid, {
        email: newUser.email,
        name: 'Test User'
      });
      setUser(newUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example document creation
  const handleCreateDocument = async () => {
    try {
      const docRef = await createDocument('posts', null, {
        title: 'Test Post',
        content: 'This is a test post',
        createdAt: new Date().toISOString()
      });
      console.log('Document created:', docRef);
    } catch (err) {
      setError(err.message);
    }
  };

  // Example file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, `uploads/${file.name}`);
      console.log('File uploaded:', url);
      
      // Save file reference to Firestore
      await createDocument('files', null, {
        fileName: file.name,
        fileUrl: url,
        uploadedAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Real-time document subscription example
  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = subscribeToDocument('users', user.uid, (userData) => {
        setDocument(userData);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  return (
    <div className="firebase-example">
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      <div className="auth-section">
        <button onClick={handleRegister} disabled={loading}>
          Register New User
        </button>
      </div>

      <div className="document-section">
        <button onClick={handleCreateDocument} disabled={!user}>
          Create Test Document
        </button>
      </div>

      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={!user}
        />
      </div>

      {document && (
        <div className="user-data">
          <h3>User Profile:</h3>
          <pre>{JSON.stringify(document, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FirebaseExample; 