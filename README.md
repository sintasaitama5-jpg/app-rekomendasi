# AppFuture — Deploy Guide

## Langkah 1: Dapat Gemini API Key (Gratis)
1. Buka https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy key-nya

## Langkah 2: Upload ke GitHub
1. Buka https://github.com dan daftar/login
2. Klik tombol "+" → "New repository"
3. Nama repo: `app-rekomendasi`
4. Klik "Create repository"
5. Upload semua file dari folder ini (drag & drop)

## Langkah 3: Deploy ke Vercel
1. Buka https://vercel.com dan login pakai akun GitHub
2. Klik "Add New Project"
3. Pilih repo `app-rekomendasi`
4. Klik "Deploy"

## Langkah 4: Tambah API Key di Vercel
1. Setelah deploy, masuk ke project di Vercel
2. Klik "Settings" → "Environment Variables"
3. Tambah variable:
   - Name: `GEMINI_API_KEY`
   - Value: (paste API key dari langkah 1)
4. Klik "Save"
5. Klik "Deployments" → "Redeploy"

## Selesai! 🎉
App kamu sudah live dan bisa diakses siapa saja lewat link Vercel.
