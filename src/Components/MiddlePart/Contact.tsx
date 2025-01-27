import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm('service_v43r0ei', 'template_kx8jygh', form.current, {
          publicKey: 'TXBKoDbbNEyQNtYgs',
        })
        .then(
          (result) => {
            console.log(result.text);
            
            (e.target as HTMLFormElement).reset();
            alert('Email Sent!');
          },
          (error) => {
            console.log('FAILED...', error.text);
          }
        );
    }
  };

  return (
    <section id="contactPage" className="relative z-0 flex flex-col items-center justify-center mt-12 mb-10 px-4">
      <div className=" font-sans contactDiv text-center">
        <h1 className="text-white text-[30px] sm:text-[52px] font-semibold mb-4">Contact Me</h1>
        <span className="text-gray-400 text-md mb-8">
          Feel free to reach out to me for any questions or to discuss any work opportunities
        </span>
        <form className="contactForm flex flex-col lg:h-[500px] lg:w-[700px] gap-3 bg-[rgba(17,25,40,0.83)] shadow-[0_4px_24px_rgba(23,92,230,0.15)] text-white p-6 rounded-lg mt-10  border border-[rgba(255,255,255,0.125)]" ref={form} onSubmit={sendEmail}>
        <h1 className="text-white text-3xl font-semibold mb-4 font-sans flex justify-start">Email Me 📨</h1>
          <input
            type="text"
            className="p-3 rounded-md border border-gray-600 bg-transparent focus:outline-none"
            name="from_name"
            placeholder="Your Name"
          />
          <input
            type="email"
            className="p-3 rounded-md border border-gray-600 bg-transparent focus:outline-none"
            name="from_email"
            placeholder="Your Email"
          />
          <textarea
            className="p-3 rounded-md border border-gray-600 bg-transparent focus:outline-none"
            name="message"
            rows={5}
            placeholder="Message"
          />
          <button className="submitBtn p-3  bg-gradient-to-r from-[#854CE6] to-[#8C2EDB] text-white hover:from-[#8C2EDB] hover:to-[#854CE6] transition duration-300 ease-in-out shadow-lg hover:shadow-xl rounded-md">
            Send Email
          </button>
      
        </form>
      </div>
    </section>
  );
};

export default Contact;
