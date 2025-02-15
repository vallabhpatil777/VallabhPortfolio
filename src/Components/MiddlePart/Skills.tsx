import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import reacr from "../../assets/react.svg"
import javascript from "../../assets/javascript.svg"
import typescript from "../../assets/typescript.svg"
import css from "../../assets/css.svg"
import tailwindcss from "../../assets/tailwind-css.svg"
import redux from "../../assets/redux.svg"
import java from "../../assets/java-4.svg"
import html from "../../assets/html.svg"
import flask from "../../assets/flask.svg"
import python from "../../assets/python.svg"
import django from "../../assets/django.svg"
import springboot from "../../assets/spring-boot.svg"
import expressjs from "../../assets/express-js.png"
import nestjs from "../../assets/nest .png"
import aws from "../../assets/aws-2.svg"
import docker from "../../assets/docker-4.svg"
import jira from "../../assets/jira-1.svg"
import jenkins from "../../assets/jenkins-1.svg"
import git from "../../assets/git.svg"
import tensorflow from "../../assets/tensorflow-2.svg"
import cv from "../../assets/cv.jpg"
import nlp from "../../assets/nlp.png"
import ml from "../../assets/ml.png"
import scikit from "../../assets/scikit.png"
import pandas from "../../assets/pandas.svg"
import dnn from "../../assets/dnn.png"
import datavis from "../../assets/datavis.png"
import datapre from "../../assets/datapre.png"
import mysql from "../../assets/mysql-3.svg"
import oracle from "../../assets/oracle-6.svg"
import postgres from "../../assets/postgresql.svg"
import mongodb from "../../assets/mongodb-icon-2.svg"
import threejs from "../../assets/threejs.png"
import vscode from "../../assets/visual-studio-code-1.svg"
import colab from "../../assets/colab.png"
import pycharm from "../../assets/jetbrains-pycharm.svg"
import postman from "../../assets/postman.svg"
import excel from "../../assets/excel.png"
import spyder from "../../assets/spyder.png"
import springtool from "../../assets/springtool.jpeg"
import jupyter from "../../assets/Jupyter_logo.svg.png"
import fastapi from '../../assets/FastAPI.svg'







type Skill = {
  name: string;
  image: string; 
};

const Card = ({
  title,
  skills,
}: {
  title: string;
  skills: Skill[];
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.4, 0.4], ["21.5deg", "-21.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.4, 0.4], ["-21.5deg", "21.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  style={{
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
  }}
  className="  w-full max-w-[500px] bg-[rgba(17,25,40,0.83)] h-auto  border border-[rgba(255,255,255,0.125)] shadow-[0_4px_24px_rgba(23,92,230,0.15)] rounded-[16px] p-[18px_36px] mt-10"
>
  <h2 className="text-[#bbbdbf] text-center lg:text-[28px] text-[20px] font-semibold m-4">
    {title}
  </h2>
  <div className="flex flex-wrap justify-center gap-2">
    {skills.map((skill, index) => (
      <div
        key={index}
        className="flex flex-row items-center bg-[rgba(17,25,40,0.83)] border-[rgba(255,255,255,0.125)] p-3 rounded-[18px] shadow-md flex-grow-0 flex-shrink-1  max-w-[70%] mb-2"
      >
        <img
          src={skill.image}
          alt={skill.name}
          className="w-8 h-8 lg:w-10 lg:h-10 object-contain mr-3"
        />
        <p className="text-[#a3a6a8] font-sans text-[15px] lg:text-sm">{skill.name}</p>
      </div>
    ))}
  </div>
</motion.div>

  );
};

const Skills = () => {
  const skillSets = [
    {
      title: "Frontend",
      skills: [
        { name: "React", image:  reacr},
        { name: "JavaScript", image: javascript },
        { name: "TypeScript", image: typescript },
        { name: "CSS4", image: css },
        { name: "Tailwind CSS", image: tailwindcss },
        { name: "Redux Toolkit", image: redux },
        { name: "ThreeJS", image: threejs },
        { name: "HTML5", image: html },
      ],
    },
    {
      title: "Backend",
      skills: [
        { name: "Python", image: python },
        { name: "Java", image: java },
        { name: "Django", image: django },
        { name: "SpringBoot", image: springboot },
        { name: "Flask", image: flask },
        { name: "ExpressJS", image: expressjs },
        { name: "NestJS", image: nestjs },
        { name: "FastAPI", image: fastapi },
      ],
    },
    {
      title: "Cloud & DevOps",
      skills: [
        { name: "AWS", image: aws},
        { name: "Docker", image: docker },
        { name: "GitHub", image: git },
        { name: "Jira", image: jira },
        { name: "Jenkins", image: jenkins },
      ],
    },
    {
      title: "AI/ML and Data Analysis",
      skills: [
        { name: "TensorFlow", image: tensorflow},
        { name: "Computer Vision", image: cv },
        { name: "NLP", image: nlp },
        { name: "ML Algorithms", image: ml},
        { name: "Scikit-learn", image:scikit },
        { name: "Pandas", image: pandas },
        { name: "Deep Neural Network (DNN)", image: dnn},
        { name: "Data Visualization", image: datavis },
        { name: "Data Preprocessing", image: datapre },


      ],
    },
    {
      title: "Database",
      skills: [
        { name: "MySQL", image: mysql},
        { name: "Oracle Database", image: oracle },
        { name: "PostgreSQL", image: postgres },
        { name: "MongoDB", image: mongodb },
      ],
    },
    {
      title: "Tools & Techonologies",
      skills: [
        { name: "VS Code", image: vscode},
        { name: "Postman", image: postman },
        { name: "SpringToolSuite", image: springtool },
        { name: "Spyder", image: spyder },
        { name: "Pycharm", image: pycharm },
        { name: "GoogleColab", image: colab},
        { name: "Jupyter Notebook", image: jupyter },
        { name: "Excel", image: excel },
      ],
    },
  ];

  return (
    <div className="relative z-0 inset-0 flex flex-col items-center justify-center mt-24 mb-24">
      <div className="flex flex-col text-center">
        <div>
          <h1 className="font-sans text-white font-semibold text-[30px] sm:text-[52px]">
            Skills
          </h1>
        </div>
        <div>
          <h2 className="font-sans text-gray-400  font-medium text-[15px] sm:text-[18px]">
          An overview of the technical skills acquired through hands-on experience and continuous learning.          </h2>
        </div>
      </div>

      <div className="flex flex-row   ">
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-6 pl-5 pr-5">
          {skillSets.map((set, index) => (
            <Card key={index} title={set.title} skills={set.skills} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
