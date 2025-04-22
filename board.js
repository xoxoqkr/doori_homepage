const firebaseConfig = {
  apiKey: "AIzaSyC2Cq3tKms5XRuYcdFBbRHmvMt1JBcu4EE",
  authDomain: "testtj-4ba34.firebaseapp.com",
  projectId: "testtj-4ba34",
  storageBucket: "testtj-4ba34.appspot.com",
  messagingSenderId: "10381310067",
  appId: "1:10381310067:web:3f1d7797cb106a55325206",
  measurementId: "G-7YP2BBXC9X"
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

  try {
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
  } catch (err) {
    console.error('업로드 실패:', err);
    status.textContent = '업로드 중 오류가 발생했습니다.';
  }
});
