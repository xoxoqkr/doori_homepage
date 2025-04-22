// 🔧 여기에 본인 Firebase 프로젝트 설정 정보 입력
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const writer = document.getElementById('writer').value;
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const file = document.getElementById('file').files[0];
  const status = document.getElementById('status');

  if (!file || file.type !== 'application/pdf') {
    status.textContent = 'PDF 파일만 업로드할 수 있습니다.';
    return;
  }

  const fileRef = storage.ref().child('uploads/' + Date.now() + '_' + file.name);
  await fileRef.put(file);
  const fileURL = await fileRef.getDownloadURL();

  await db.collection('posts').add({
    writer,
    title,
    content,
    fileURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  status.textContent = '게시글이 성공적으로 업로드되었습니다!';
  document.getElementById('post-form').reset();
});
