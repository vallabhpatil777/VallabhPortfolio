import cardiff from '../assets/cardiff.webp'
import cdac from '../assets/cdac.webp'
import skn from '../assets/skn.webp'
import type { TimelineEntry } from '../Components/common/Timeline'

export const education: TimelineEntry[] = [
  {
    id: 1,
    organisation: 'Cardiff University, UK',
    role: 'MSc Advanced Computer Science',
    duration: 'September 2023 - September 2024',
    description:
      'Specialised in modules Penetration Testing, Malware Analysis, Developing Secure Systems and Applications, Applications of Machine Learning: Natural Language Processing, Knowledge representation and Cloud Computing. Achieved 82% in Dissertation.',
    metaLabel: 'Grade',
    meta: 'Distinction',
    logo: cardiff,
  },
  {
    id: 2,
    organisation: 'Centre for Development of Advanced Computing (CDAC), India',
    role: 'PG-Diploma in Artificial Intelligence',
    duration: 'March 2023 - August 2023',
    description:
      'Completed PG-diploma in AI with core subjects like Java, Python programming, Deep learning, Principles of Machine learning, Data Analysis, Mathematics in AI, Natural Language Processing, and Computer Vision as part of coursework. With an understanding of various machine learning algorithms, data science methodologies, and deep learning, this course aided in the development of expertise in the fields of machine learning and artificial intelligence.',
    metaLabel: 'Grade',
    meta: 'A',
    logo: cdac,
  },
  {
    id: 3,
    organisation: 'SKN College Of Engineering, India',
    role: 'Bachelor of Engineering in Computer Science',
    duration: 'August 2016 - May 2020',
    description:
      'Completed Bachelors in Computer Science with key subjects like Software Engineering, Database Management Systems, Data Structures and Algorithms, Human Computer Interaction, Internet of Things and Machine Learning.',
    metaLabel: 'Grade',
    meta: '7.77 / 10 CGPA',
    logo: skn,
  },
]
