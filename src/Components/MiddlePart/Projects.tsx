import { useState } from 'react'
import social from "../../assets/social.png"
import restro from "../../assets/restro.png"
import blog from '../../assets/blog.png'
import facecmask from '../../assets/facemask1.png'
import spam from '../../assets/spam.png'
import portfolio from '../../assets/portfolio.png'

const Projects = () => {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  const projectData = [
    {
      image: social,
      topic: 'Social Media Web Application',
      duration: '1 Month',
      description: 'A web application built using React, Redux, Java, MySQL and Spring Boot, enabling users to share posts, interact, and connect seamlessly. The application offers functionalities such as creating, liking, and commenting on posts, as well as secure image and video uploads using Cloudinary. It features follow/unfollow capabilities and secure JWT-based authentication for user accounts.',
      category: 'Java',
      codeLink: "https://github.com/vallabhpatil777/SocialMedia-App-Java-JavaScript-React",
    },
  
    {
      image: restro,
      topic: 'Restaurant Booking Web Application',
      duration: '1 Month',
      description: "A Django-based web application built using Python, SQLite, Bootstrap and Javascript that allows users to view the restaurant menu, book tables, and provide feedback. The app is fully functional, with an intuitive interface for seamless booking and interaction. It leverages Django's robust backend features, while the frontend is styled using Bootstrap for responsiveness and ease of use. Also deployed on AWS EC2.",
      category: 'Python',
      codeLink: 'https://github.com/vallabhpatil777/Restaurant-Booking-WebApplication-Django',
      demoLink: 'http://13.53.48.37:8000',
    },
    {
      image: blog,
      topic: 'BlogHive Web Application',
      duration: '1 Month',
      description: 'A Django-based blog web application built using Python, SQLite, Bootstrap and Javascript that enables users to create, edit, and delete blog posts, add comments, and manage their profiles. The app features blog post creation, deletion, add comments, user authentication (signup, login, logout) and profile editing functionality. Application is deployed on PythonAnywhere.',
      category: 'Python',
      codeLink: 'https://github.com/vallabhpatil777/Blog-WebApp-Django',
      demoLink: 'https://vallabhpatil777.pythonanywhere.com',
    },
    {
      image: facecmask,
      topic: 'Face Mask Detection Web Application ',
      duration: '1 Month',
      description: 'A web application built using Flask, Python, OpenCV and Tensorflow that detects whether a person is wearing a face mask with fine-tuned VGG16 model. The model was trained on 7,000 images with data augmentation techniques for improved accuracy and generalization. The app provides real-time predictions through a simple interface, with real time detection using webcam. ',
      category: 'AI / ML',
      codeLink: 'https://github.com/vallabhpatil777/Facemask-detection-OpenCV',
     
    },
    {
      image: spam,
      topic: 'Spam Email Detection Web Application',
      duration: '1 Month',
      description: 'A Machine Learning web application designed to classify emails and SMS messages as Spam or Not Spam using Natural Language Processing (NLP). Various ML models were evaluated, and Multinomial Naive Bayes with TF-IDF vectorization with (98% precision) was selected for prediction due to its accuracy and efficiency. Built with Streamlit, it provides real-time predictions.',
      category: 'AI / ML',
      codeLink: 'https://github.com/vallabhpatil777/Spam-email-predictor',
     
    },
    {
      image: portfolio,
      topic: 'Personal Portfolio',
      duration: '1 Month',
      description: 'A personal portfolio web application developed using React, TypeScript, Three.js and Tailwind CSS, featuring an interactive 3D avatar rendered using Three.js. The portfolio showcases my skills, education, experience, and includes a contact form. Built with a sleek, responsive UI using Tailwind CSS, it provides an immersive, visually engaging experience that highlights my academic and professional journey.',
      category:'React',
      codeLink: 'https://github.com/vallabhpatil777/VallabhPortfolio',
      demoLink : '#'
    },
  ]

  
  const filteredProjects = selectedFilter === 'All'
    ? projectData
    : projectData.filter(project => project.category === selectedFilter)

  
  const toggleDescription = (index : any) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  return (
    <div className="relative z-0 flex flex-col items-center justify-center mt-20 px-4">
     
      <div className="text-center mt-5 mb-12">
        <h1 className="font-sans text-white font-semibold text-[30px] sm:text-[52px] mb-6">
          Projects
        </h1>
        <h2 className="font-sans text-gray-400 font-medium text-md md:text-lg">
        A showcase of key projects that highlight my skills across various domains, demonstrating innovation and problem-solving.
        </h2>
      </div>

   
      <div className="flex space-x-6 mb-6">
        {['All', 'Python', 'Java', 'React' , 'AI / ML'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedFilter(category)}
            className={`px-4 py-2 py-2 text-[10px] sm:text-sm font-medium rounded-lg transition duration-300 
              ${selectedFilter === category
                ? 'bg-[#854CE6] text-white'
                : 'bg-transparent text-gray-400 hover:bg-[#854CE6] hover:text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:w-[1200px]">
        {filteredProjects.map((project, index) => {
          const maxDescriptionLength = 150; 
          const isLongDescription = project.description.length > maxDescriptionLength
          const isExpanded = expandedDescriptions[index] || false

          return (
            <div
              key={index}
              className="bg-[rgba(17,25,40,0.83)] border border-[rgba(255,255,255,0.125)] shadow-[0_4px_24px_rgba(23,92,230,0.15)] text-white p-6 rounded-lg shadow-lg flex flex-col w-full"
            >
              <img
                src={project.image}
                alt={project.topic}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{project.topic}</h3>
              <p className="text-sm text-gray-400 mb-4">{project.duration}</p>
              <p className="text-lg text-gray-300 mb-4 flex-grow">
                {isLongDescription && !isExpanded
                  ? `${project.description.slice(0, maxDescriptionLength)}...`
                  : project.description}
                {isLongDescription && (
                  <button
                    onClick={() => toggleDescription(index)}
                    className="text-[#854CE6] ml-2 underline"
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </p>

              
              <div className="flex space-x-4 mt-auto justify-center">
                <a
                  href={project.codeLink}
                  className="border-[#854CE6] bg-gradient-to-r from-[#854CE6] to-[#8C2EDB] text-white hover:from-[#8C2EDB] hover:to-[#854CE6] px-4 py-2 rounded-lg transition duration-300"
                >
                  View Code
                </a>
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    className="border-[#854CE6] bg-gradient-to-r from-[#854CE6] to-[#8C2EDB] text-white hover:from-[#8C2EDB] hover:to-[#854CE6] px-4 py-2 rounded-lg transition duration-300"
                  >
                    View Demo
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Projects
