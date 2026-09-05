import SectionHeading from '../common/SectionHeading'
import Timeline from '../common/Timeline'
import { experience } from '../../data/experience'

export default function Experience() {
  return (
    <div className="container-page">
      <SectionHeading
        eyebrow="Where I've worked"
        title="Experience"
        subtitle="A summary of professional experiences that have shaped my technical and problem-solving abilities."
      />
      <Timeline entries={experience} />
    </div>
  )
}
