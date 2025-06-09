'use client'

import { useState } from 'react'
import ReactPlayer from 'react-player'
import axios from 'axios'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [startTime, setStartTime] = useState('0')
  const [endTime, setEndTime] = useState('30')
  const [duration, setDuration] = useState(0)
  const [isPremium, setIsPremium] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    const start = parseFloat(startTime)
    const end = parseFloat(endTime)

    // Süre kontrolü
    if (end - start <= 0) {
      setError('Bitiş zamanı başlangıç zamanından büyük olmalıdır.')
      setIsProcessing(false)
      return
    }

    // Premium olmayan kullanıcılar için 30 saniye limiti
    if (!isPremium && end - start > 30) {
      setError('Ücretsiz kullanıcılar için maksimum 30 saniye seçilebilir.')
      setIsProcessing(false)
      return
    }

    // Premium kullanıcılar için 60 saniye limiti
    if (isPremium && end - start > 60) {
      setError('Maksimum 60 saniye seçilebilir.')
      setIsProcessing(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:8000/process-video', {
        url,
        start_time: start,
        end_time: end,
        add_captions: true,
        is_premium: isPremium
      })

      setVideoUrl(response.data.output_path)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Video işlenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Sadece sayı ve nokta karakterine izin ver
    if (/^\d*\.?\d*$/.test(value)) {
      setStartTime(value)
    }
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Sadece sayı ve nokta karakterine izin ver
    if (/^\d*\.?\d*$/.test(value)) {
      setEndTime(value)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">YouTube videolarını</span>
          <span className="block text-blue-600">Shorts formatına dönüştürün</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Tek tıkla YouTube videolarınızı Shorts formatına dönüştürün. Otomatik altyazı, watermark ve daha fazlası.
        </p>
      </div>

      {/* Video processing form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                YouTube Video URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
            </div>

            {videoUrl && (
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer
                  url={videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  onDuration={setDuration}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Başlangıç Zamanı (saniye)
                </label>
                <input
                  type="text"
                  name="startTime"
                  id="startTime"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Bitiş Zamanı (saniye)
                </label>
                <input
                  type="text"
                  name="endTime"
                  id="endTime"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 placeholder-gray-400"
                  placeholder="30"
                />
              </div>
            </div>

            {duration > 0 && (
              <div className="text-sm text-gray-500">
                Seçilen süre: {Math.round((parseFloat(endTime) - parseFloat(startTime)) * 10) / 10} saniye
                {!isPremium && parseFloat(endTime) - parseFloat(startTime) > 30 && (
                  <span className="text-red-500 ml-2">
                    (Ücretsiz kullanıcılar için maksimum 30 saniye)
                  </span>
                )}
                {isPremium && parseFloat(endTime) - parseFloat(startTime) > 60 && (
                  <span className="text-red-500 ml-2">
                    (Maksimum 60 saniye)
                  </span>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
              >
                {isProcessing ? 'İşleniyor...' : 'Shorts Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-blue-500 p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">Otomatik Altyazı</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Videolarınıza otomatik olarak altyazı ekleyin. AI destekli transkripsiyon ile mükemmel sonuçlar.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-blue-500 p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">9:16 Format</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Videolarınızı otomatik olarak Shorts formatına (9:16) dönüştürün. Mükemmel kırpma ve hizalama.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-blue-500 p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">Hızlı İşleme</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Saniyeler içinde videolarınızı Shorts formatına dönüştürün. Hızlı ve kolay kullanım.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
