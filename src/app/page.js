// pages/index.js


import Image from 'next/image'

export default function Home() {
  return (
    <div>

      <main className='mx-10'>
      <Image
      width={320}
      height={180}  
      src="/public/images/bg-leoni.jpg"
      alt="Default Image"
      objectFit="cover"
    />
        <section className="bg-cover bg-center text-black py-32"id="home">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">WELCOME TO LEONI MOROCCO INTERNAL AUDIT</h1>
            <p className="text-lg">
              At Leoni Maroc, we prioritize sustainability, quality, and continuous
              improvement in all our processes. Our dedicated team works tirelessly to
              meet the evolving needs of the automotive sector, making us a trusted
              partner in the industry. 
            </p>
          </div>
        </section>

       

      </main>

     
    </div>
  )
}
