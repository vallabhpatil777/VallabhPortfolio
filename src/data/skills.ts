import react from '../assets/react.svg'
import javascript from '../assets/javascript.svg'
import typescript from '../assets/typescript.svg'
import css from '../assets/css.svg'
import tailwindcss from '../assets/tailwind-css.svg'
import redux from '../assets/redux.svg'
import java from '../assets/java-4.svg'
import html from '../assets/html.webp'
import flask from '../assets/flask.webp'
import python from '../assets/python.svg'
import django from '../assets/django.svg'
import springboot from '../assets/spring-boot.svg'
import expressjs from '../assets/expressjs.webp'
import nestjs from '../assets/nest.webp'
import aws from '../assets/aws-2.svg'
import docker from '../assets/docker-4.svg'
import jira from '../assets/jira-1.svg'
import jenkins from '../assets/jenkins-1.webp'
import git from '../assets/git.svg'
import tensorflow from '../assets/tensorflow-2.svg'
import cv from '../assets/cv.webp'
import nlp from '../assets/nlp.webp'
import ml from '../assets/ml.webp'
import scikit from '../assets/scikit.webp'
import pandas from '../assets/pandas.svg'
import dnn from '../assets/dnn.webp'
import datavis from '../assets/datavis.webp'
import datapre from '../assets/datapre.webp'
import mysql from '../assets/mysql-3.svg'
import oracle from '../assets/oracle-6.svg'
import postgres from '../assets/postgresql.svg'
import mongodb from '../assets/mongodb-icon-2.webp'
import threejs from '../assets/threejs.webp'
import vscode from '../assets/visual-studio-code-1.svg'
import colab from '../assets/colab.webp'
import pycharm from '../assets/jetbrains-pycharm.svg'
import postman from '../assets/postman.svg'
import excel from '../assets/excel.webp'
import spyder from '../assets/spyder.webp'
import springtool from '../assets/springtool.webp'
import jupyter from '../assets/jupyter.webp'
import fastapi from '../assets/FastAPI.svg'
import cursor from '../assets/cursor.svg'
import weaviate from '../assets/weaviate.webp'
import chroma from '../assets/chroma.webp'
import langchain from '../assets/Langchain--Streamline-Simple-Icons.svg'
import claude from '../assets/claude.webp'
import openapi from '../assets/openapi.webp'

/**
 * `image` is optional: several skills on the CV are capabilities rather than
 * products (RAG, Prompt Engineering, Error Analysis) and have no brand mark.
 * Those render as a lettered tile instead — see `SkillCard`.
 */
export type Skill = { name: string; image?: string }
export type SkillSet = { title: string; skills: Skill[] }

export const skillSets: SkillSet[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', image: react },
      { name: 'JavaScript', image: javascript },
      { name: 'TypeScript', image: typescript },
      { name: 'CSS4', image: css },
      { name: 'Tailwind CSS', image: tailwindcss },
      { name: 'Redux Toolkit', image: redux },
      { name: 'ThreeJS', image: threejs },
      { name: 'HTML5', image: html },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Python', image: python },
      { name: 'Java', image: java },
      { name: 'Django', image: django },
      { name: 'SpringBoot', image: springboot },
      { name: 'Flask', image: flask },
      { name: 'ExpressJS', image: expressjs },
      { name: 'NestJS', image: nestjs },
      { name: 'FastAPI', image: fastapi },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', image: aws },
      { name: 'Docker', image: docker },
      { name: 'GitHub', image: git },
      { name: 'Jira', image: jira },
      { name: 'Jenkins', image: jenkins },
      { name: 'API Integration', image: openapi },
    ],
  },
  {
    title: 'AI/ML and Data Analysis',
    skills: [
      { name: 'Production-Grade RAG Pipelines' },
      { name: 'LangChain', image: langchain },
      { name: 'TensorFlow', image: tensorflow },
      { name: 'Computer Vision', image: cv },
      { name: 'NLP', image: nlp },
      { name: 'ML Algorithms', image: ml },
      { name: 'Scikit-learn', image: scikit },
      { name: 'Pandas', image: pandas },
      { name: 'Deep Neural Network (DNN)', image: dnn },
      { name: 'Data Visualization', image: datavis },
      { name: 'Data Preprocessing', image: datapre },
    ],
  },
  {
    title: 'RAG & Model Evaluation',
    skills: [
      { name: 'RAG Evaluation' },
      { name: 'RAGAS' },
      { name: 'LangSmith', image: langchain },
      { name: 'DeepEval' },
      { name: 'TruLens' },
      { name: 'Faithfulness & Answer Relevancy' },
      { name: 'Context Precision & Recall' },
      { name: 'Groundedness / Hallucination Checks' },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'MySQL', image: mysql },
      { name: 'Oracle Database', image: oracle },
      { name: 'PostgreSQL', image: postgres },
      { name: 'MongoDB', image: mongodb },
      { name: 'Weaviate', image: weaviate },
      { name: 'Chroma', image: chroma },
    ],
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Claude Code', image: claude },
      { name: 'Cursor', image: cursor },
      { name: 'VS Code', image: vscode },
      { name: 'Postman', image: postman },
      { name: 'SpringToolSuite', image: springtool },
      { name: 'Spyder', image: spyder },
      { name: 'Pycharm', image: pycharm },
      { name: 'GoogleColab', image: colab },
      { name: 'Jupyter Notebook', image: jupyter },
      { name: 'Excel', image: excel },
    ],
  },
]
