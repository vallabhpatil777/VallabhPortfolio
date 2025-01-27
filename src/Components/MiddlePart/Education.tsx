import React from 'react'
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import cardiff from "../../assets/cardiff.png"
import cdac from "../../assets/cdac.png"
import skn from "../../assets/sing.jpeg"
const Education = () => {
  
    const experiences = [
        {
          id: 1,
          company: "Cardiff University, UK",
          role: "MSc Advanced Computer Science",
          duration: "September 2023 - September 2024",
          description:
            "Specialised in modules Penetration Testing, Malware Analysis, Developing Secure Systems and Applications, Applications of Machine Learning: Natural Language Processing, Knowledge representation and Cloud Computing. Achieved 82% in Dissertation.",
          skills: "Distinction",
          logo: cardiff,
        },
        {
          id: 2,
          company: "Centre for Development of Advanced Computing (CDAC), India",
          role: "PG-Diploma in Artificial Intelligence",
          duration: "March 2023 - August 2023",
          description:
            "Completed PG-diploma in AI with core subjects like Java, Python programming, Deep learning, Principles of Machine learning, Data Analysis, Mathematics in AI, Natural Language Processing, and Computer Vision as part of coursework. With an understanding of various machine learning algorithms, data science methodologies, and deep learning, this course aided in the development of expertise in the fields of machine learning and artificial intelligence.",
          skills: "A",
          logo: cdac,
        },
        {
            id: 3,
            company: "SKN College Of Engineering, India",
            role: "Bachelor of Engineering in Computer Science",
            duration: "August 2016 - May 2020",
            description:
              "Completed Bachelors in Computer Science with key subjects like Software Engineering, Database Management Systems, Data Structures and Algorithms, Human Computer Interaction, Internet of Things and Machine Learning.",
            skills: "7.77 / 10 CGPA",
            logo: skn ,
          },
      ];
    
      return (
        <div className="relative z-0 flex flex-col items-center justify-center mt-12 mb-10 px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-sans text-white font-semibold text-[30px] sm:text-[52px]">
              Education
            </h1>
            <h2 className="font-sans text-gray-400 font-medium text-md md:text-lg mt-5">
            An outline of my academic qualifications and the knowledge gained throughout my academic journey.
            </h2>
          </div>
    
          {/* Timeline */}
          <div className="relative flex flex-col w-full mt-5">
            {/* Vertical Line */}
            <div className="absolute left-6 lg:left-[50%]  transform -translate-x-[50%] w-[4px] bg-white h-full"></div>
    
            {experiences.map((exp, index) => {
              const [ref, inView] = useInView({ threshold: 0.2 });
              const controls = useAnimation();
    
              React.useEffect(() => {
                if (inView) {
                  controls.start("visible");
                }
              }, [inView, controls]);
    
              const isMobile = window.innerWidth < 1024; 
    
              const boxVariants = {
                hidden: { y: 100, opacity: 0 }, 
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              };
    
              const logoVariants = {
                hidden: { y: 100, opacity: 0 }, 
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              };
    
              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-row mt-6 place-items-start ${
                    index % 2 === 0
                      ? "lg:flex-row-reverse lg:right-[810px]"
                      : "lg:flex-row lg:ml-[810px]"
                  } mb-12`}
                >
                 
                  <motion.div
                    ref={ref}
                    variants={logoVariants}
                    initial="hidden"
                    animate={controls}
                    className="relative z-10 flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 bg-gray-800 border-2 border-white rounded-full shadow-md"
                  >
                           <img 
  src={exp.logo}
  alt="Logo" 
  className="lg:w-20 lg:h-20 w-11 h-11 rounded-full object-cover" 
/>
                  </motion.div>
    
                  {/* Box */}
                  <motion.div
                    ref={ref}
                    variants={boxVariants}
                    initial="hidden"
                    animate={controls}
                    className={`w-[90%] lg:w-[600px] ml-3 mr-3 mt-2 lg:mt-0 shadow-[0_4px_24px_rgba(23,92,230,0.15)] ${
                      index % 2 === 0 ? "lg:ml-8" : "lg:mr-8"
                    }`}
                  >
                    <div className="relative">
                      {/* Arrow pointing to the circle */}
                      <div
                        className={`absolute w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ${
                          index % 2 === 0
                            ? "lg:border-l-[10px] border-r-[10px] lg:border-l-gray-600 border-r-gray-600 lg:left-[600px] -left-[10px] top-[10%] transform -translate-y-[50%]"
                            : "border-r-[10px] border-r-gray-600 lg:left-[-10px] -left-[10px] top-[10%] transform -translate-y-[50%]"
                        }`}
                      ></div>
    
                      {/* Content Box */}
                      <div className="bg-[rgba(17,25,40,0.83)] text-white p-6 rounded-lg shadow-lg border  border-[rgba(255,255,255,0.125)]">
                        <h3 className="font-semibold text-lg">{exp.role}</h3>
                        <p className="text-sm text-gray-300">{exp.company}</p>
                        <p className="text-sm text-gray-300">{exp.duration}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                        <p className="mt-2 text-sm font-semibold">Grade:</p>
                        <p className="text-sm text-gray-300">{exp.skills}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
  )
}

export default Education;
