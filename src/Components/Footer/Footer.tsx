import fbIcon from '../../assets/fbicon.svg'
import instaIcon from '../../assets/instagram.svg'
import linkedIcon from '../../assets/linkedinIcon.svg'

const SOCIALS = [
  { href: 'https://www.facebook.com/vallabh.patil.92', icon: fbIcon, label: 'Facebook' },
  {
    href: 'https://www.linkedin.com/in/vallabh-patil-63248b144',
    icon: linkedIcon,
    label: 'LinkedIn',
  },
  { href: 'https://www.instagram.com/vallabh_patil_777/', icon: instaIcon, label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="container-page flex flex-col items-center gap-6 border-t border-hairline py-12 text-center">
      <p className="text-lg font-semibold text-brand-500">Vallabh Patil</p>

      <ul className="flex items-center gap-8 sm:gap-12">
        {SOCIALS.map(({ href, icon, label }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={label}
              className="inline-grid h-11 w-11 place-items-center rounded-full transition-transform duration-300 hover:scale-110 hover:bg-white/5"
            >
              <img src={icon} alt="" width={24} height={24} loading="lazy" className="h-6 w-6" />
            </a>
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Vallabh Patil. All rights reserved.
      </p>
    </footer>
  )
}
