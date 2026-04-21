import React from 'react';
import Snowfall from 'react-snowfall';

const SnowfallComponent: React.FC = () => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 m-0 p-0 bg-[#090917]">
      <Snowfall snowflakeCount={50}/>
    </div>
  );
};

export default SnowfallComponent;
