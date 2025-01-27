import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import risidio from "../../assets/risidio_logo.jpeg"
import accenture from "../../assets/Accenture-Logo.png"

const Experience: React.FC = () => {
  const experiences = [
    {
      id: 1,
      company: "Risidio, London UK",
      role: "Frontend Developer Intern",
      duration: "January 2025 - Present",
      description:" I am a Frontend Developer Intern with a focus on front-end development, where I turn designs into responsive, scalable web applications. I work with React, Next.js, and TypeScript to build dynamic interfaces and ensure seamless user experiences. My role also allows me to contribute to backend tasks, integrating with PostgreSQL for data management and using Docker for streamlined deployment. Additionally, I have the opportunity to research AI Agents and Large Language Models (LLMs) while collaborating in agile teams", 
      skills: "React • TypeScript • Redux • Git • Docker • NestJS • Figma • PostgreSQL • Agile Project Management",
      logo: risidio,
    },
    {
      id: 2,
      company: "Accenture, India",
      role: "Associate Software Engineer",
      duration: "January 2021 - July 2022",
      description:
        "I work on backend solutions, focusing on change management and software releases. I develop scalable systems using Java, optimize database queries in MySQL, and collaborate with agile teams to improve performance and reliability through continuous testing and sprint planning.",
      skills: "Java • MySQL • Git • Jira • Application Testing"
      , logo :accenture
    },
  ];

  return (
    <div className="relative z-0 flex flex-col items-center justify-center mt-12 mb-10 px-4">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="font-sans text-white font-semibold text-[30px] sm:text-[52px]">
          Experience
        </h1>
        <h2 className="font-sans text-gray-400 font-medium text-md md:text-lg">
        A summary of professional experiences that have shaped my technical and problem-solving abilities.
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col w-full">
        {/* Vertical Line */}
        <div className="absolute left-6 lg:left-[50%] transform -translate-x-[50%] w-[4px] bg-white h-full"></div>

        {experiences.map((exp, index) => {
          const [ref, inView] = useInView({ threshold: 0.2 });
          const controls = useAnimation();

          React.useEffect(() => {
            if (inView) {
              controls.start("visible");
            }
          }, [inView, controls]);

          
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
              {/* Logo */}
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
  className="w-17 h-17 rounded-full object-cover" 
/>
              </motion.div>

              {/* Box */}
              <motion.div
                ref={ref}
                variants={boxVariants}
                initial="hidden"
                animate={controls}
                className={`w-[90%] lg:w-[600px] ml-3 mr-3 mt-2 lg:mt-0 shadow-[0_4px_24px_rgba(23,92,230,0.15)] flex items-start${
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
                  <div className="bg-[rgba(17,25,40,0.83)] text-white p-6 rounded-lg shadow-lg border border-[rgba(255,255,255,0.125)]">
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <p className="text-sm text-gray-300">{exp.company}</p>
                    <p className="text-sm text-gray-300">{exp.duration}</p>
                    <p className="text-sm mt-2 ">{exp.description}</p>
                    <p className="mt-2 text-sm font-semibold">Skills:</p>
                    <p className="text-sm text-gray-300">{exp.skills}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
