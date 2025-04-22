import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://qiyqnkgwejksykqkxqwm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeXFuZ2d3ZWpra3lrcXhxd20iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxMzcxMzg4NSwiZXhwIjoxNzQ1Mjc5ODg1fQ.cEnO3bEF9AcAO4gzHeVt9TrmJHgW00-Eevb9ZfbDEOY'
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('post-form')
const status = document.getElementById('status')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  status.textContent = '업로드 중...'

  const writer = document.getElementById('writer').value
  const title = document.getElementById('title').value
  const content = document.getElementById('content').value
  const file = document.getElementById('file').files[0]

  let file_url = null
  if (file) {
    const { data, error } = await supabase.storage
      .from('uploads-public')
      .upload(`posts/${Date.now()}_${file.name}`, file)

    if (error) {
      status.textContent = '파일 업로드 실패: ' + error.message
      return
    }
    file_url = `${supabaseUrl}/storage/v1/object/public/uploads-public/${data.path}`
  }

  const { error: insertError } = await supabase
    .from('posts')
    .insert([{ writer, title, content, file_url }])

  if (insertError) {
    status.textContent = '게시글 저장 실패: ' + insertError.message
  } else {
    status.textContent = '게시글이 성공적으로 등록되었습니다!'
    form.reset()
  }
})
