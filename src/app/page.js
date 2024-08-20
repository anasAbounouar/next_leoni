'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export default function Home() {
  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
    });
  }, []);

  return (
    <div>
      <main className="mx-10">
        <section className="bg-cover bg-center text-black py-10" id="home">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold my-5">WELCOME TO LEONI MOROCCO INTERNAL AUDIT</h1>

            <div className="swiper" style={{ width: '100%', height: '500px', position: 'relative' }}>
              <div className="swiper-wrapper">
                <div className="swiper-slide relative">
                  <Image 
                    src="/images/interconnection-solutions.webp"
                    alt="Interconnection Solutions"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xl">Advanced Interconnection Solutions</span>
                  </div>
                </div>
                <div className="swiper-slide relative">
                  <Image
                    src="/images/bg-leoni.jpg"
                    alt="Leoni Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xl">Welcome to Leoni Morocco</span>
                  </div>
                </div>
                <div className="swiper-slide relative">
                  <Image
                    src="/images/technology-innovation.jpg"
                    alt="Technology Innovation"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xl">Driving Technology Innovation</span>
                  </div>
                </div>
                <div className="swiper-slide relative">
                  <Image
                    src="/images/environmental-commitment.webp"
                    alt="Environmental Commitment"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xl">Our Environmental Commitment</span>
                  </div>
                </div>
                <div className="swiper-slide relative">
                  <Image
                    src="/images/customer-support.webp"
                    alt="Customer Support"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xl">Exceptional Customer Support</span>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-scrollbar"></div>
            </div>
          </div>
            <p className="text-lg my-6 mx-2">
              At Leoni Maroc, we prioritize sustainability, quality, and continuous
              improvement in all our processes. Our dedicated team works tirelessly to
              meet the evolving needs of the automotive sector, making us a trusted
              partner in the industry.
            </p>
        </section>
      </main>
    </div>
  );
}
