'use client'

import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
  {
    name: 'Ücretsiz',
    id: 'tier-free',
    href: '#',
    price: { monthly: '0' },
    description: 'Temel özelliklerle başlayın.',
    features: [
      'Ayda 5 video export',
      'Video\'da watermark',
      'Maksimum 30 saniye export',
      'Temel altyazı desteği',
      'Email desteği',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '#',
    price: { monthly: '99' },
    description: 'Tüm özelliklere sınırsız erişim.',
    features: [
      'Sınırsız export',
      'Watermark kaldırma',
      '60 saniyeye kadar short çıkarma',
      'AI ile otomatik "highlight" kesme önerisi',
      'Otomatik subtitles + renkli caption desteği',
      'Öncelikli destek',
    ],
    featured: true,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Fiyatlandırma</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            İhtiyacınıza uygun planı seçin
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          İster ücretsiz planla başlayın, ister premium özelliklerin tümüne sınırsız erişim kazanın.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10'
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.featured ? 'text-blue-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8'
                  )}
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price.monthly}₺</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/ay</span>
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.featured
                    ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500'
                    : 'text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300',
                  'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                )}
              >
                {tier.featured ? 'Premium\'a Geç' : 'Ücretsiz Başla'}
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 