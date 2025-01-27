import React from 'react';
import fbIcon from '../../assets/fbicon.svg';
import instaIcon from '../../assets/instagram.svg';
import linkedIcon from '../../assets/linkedinIcon.svg';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-0 bg-[#090917] text-white flex flex-col items-center justify-center mt-24  px-4">
      <div className="flex flex-col items-center ">
        <div className="text-[#854CE6] font-semibold text-[20px] mb-6">
          Vallabh Patil
        </div>
        <div className="links flex gap-16 justify-between items-end mb-10">
          <a href="https://www.facebook.com/vallabh.patil.92" target="_blank" rel="noopener noreferrer">

            <img src={fbIcon} alt="facebookIcon" className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/vallabh-patil-63248b144" target="_blank" rel="noopener noreferrer">
            <img src={linkedIcon} alt="linkedIn" className="w-6 h-6 " />
          </a>
          <a href="https://www.instagram.com/vallabh_patil_777/" target="_blank" rel="noopener noreferrer">
            <img src={instaIcon} alt="instagramIcon" className="w-6 h-6" />
          </a>
       
        </div>
        <div className="text-sm text-gray-400 mb-2">
          © 2024 Vallabh Patil. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
