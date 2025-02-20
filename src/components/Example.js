import { loginUser, createDocument, uploadFile } from '../utils/firebaseUtils';

const ExampleComponent = () => {
  const handleLogin = async () => {
    try {
      const user = await loginUser('email@example.com', 'password');
      console.log('Logged in user:', user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleUpload = async (file) => {
    try {
      const url = await uploadFile(file, `uploads/${file.name}`);
      console.log('File uploaded:', url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <input 
        type="file" 
        onChange={(e) => handleUpload(e.target.files[0])} 
      />
    </div>
  );
};

export default ExampleComponent; 