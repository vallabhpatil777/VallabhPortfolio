import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import { AnimationMixer, LoopOnce, Clock } from "three";

useGLTF.preload("/model.glb");

const Model = ({
  onClick,
  castShadow,
}: {
  onClick: () => void;
  castShadow?: boolean;
}) => {
  const { scene, animations } = useGLTF("/model.glb", true);
  const mixer = useRef<AnimationMixer | null>(null);
  const clock = useRef<Clock | null>(null);

  useEffect(() => {
    if (animations.length > 0) {
      mixer.current = new AnimationMixer(scene);
      clock.current = new Clock();

      const crouchAction = mixer.current.clipAction(
        animations.find((clip) => clip.name === "crouch") || animations[0]
      );
      const wavingAction = mixer.current.clipAction(
        animations.find((clip) => clip.name === "waving") || animations[1]
      );

      crouchAction.setLoop(LoopOnce, 1).play();
      crouchAction.clampWhenFinished = true;

      const handleFinished = (e: any) => {
        if (e.action === crouchAction || e.action === mixer.current?.clipAction(animations[2])) {
          wavingAction?.reset().play();
          wavingAction?.setEffectiveWeight(1);
        }
      };

      mixer.current.addEventListener("finished", handleFinished);

      return () => {
        mixer.current?.removeEventListener("finished", handleFinished);
        mixer.current?.stopAllAction();
      };
    }
  }, [scene, animations]);

  const handleClick = () => {
    if (mixer.current) {
      const staggerAction = mixer.current.clipAction(
        animations.find((clip) => clip.name === "stagger") || animations[2]
      );
      staggerAction?.reset().setLoop(LoopOnce, 1).play();
    }
    onClick();
  };

  useEffect(() => {
    const tick = () => {
      const delta = clock.current?.getDelta() || 0;
      if (mixer.current) {
        mixer.current.update(delta);
      }
      requestAnimationFrame(tick);
    };

    const animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      dispose={null}
      scale={[2.6, 2.6, 2.6]}
      position={[-0.1, -2.1, 0]}
      receiveShadow 
      castShadow={castShadow} 
    />
  );
};

const Intro: React.FC = () => {
  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loopIndex, setLoopIndex] = useState<number>(0);
  const [typingSpeed, setTypingSpeed] = useState<number>(150);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);

  const texts = [
    "Full Stack Developer",
    "AI & ML Engineer",
    "Cloud Enthusiast",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentText = texts[loopIndex % texts.length];

      if (isDeleting) {
        setDisplayText((prev) => prev.slice(0, -1));
        setTypingSpeed(100);
      } else {
        setDisplayText((prev) => currentText.slice(0, prev.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && displayText === currentText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopIndex((prev) => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopIndex, texts, typingSpeed]);

  const handleModelClick = () => {
    console.log("Model clicked!");
  };

  useEffect(() => {
    const preloadModel = async () => {
      await useGLTF.preload("/model.glb");
      setIsModelLoaded(true);
    };

    preloadModel();
  }, []);

  return (
    <div className="relative z-0 inset-0 flex flex-col lg:ml-35 items-center  justify-center mt-10 sm:mt-28 lg:mt-44">
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start w-full max-w-[1200px] px-4 sm:px-2">
        <div className="lg:order-last mt-8 lg:mt-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[700px] mr-3">
          {isModelLoaded ? (
            <Suspense fallback={<div>Loading Model...</div>}>
              <Canvas shadows camera={{ position: [0, 2, 10], fov: 35 }}>
                <Preload all />
                <ambientLight intensity={1.7} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.5}
                  penumbra={0.5}
                  intensity={2}
                  castShadow={true}
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-bias={-0.0001}
                />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={0.5}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <spotLight
                  position={[0, 20, 0]}
                  angle={0.8}
                  penumbra={0.3}
                  intensity={2}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <mesh position={[0.3, -2.3, 0]} receiveShadow>
                  <cylinderGeometry args={[1.1, 1.4, 0.2, 64]} />
                  <meshStandardMaterial color="#5B595E" />
                </mesh>

                <Model onClick={handleModelClick} castShadow />
              </Canvas>
            </Suspense>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#854CE6]"></div>
            </div>
          )}
        </div>
        <div className="max-w-[600px] text-center lg:text-left mt-10 lg:mt-0">
          <h1 className="font-sans text-white font-semibold text-[32px] sm:text-[40px] lg:text-[50px] leading-tight">
            Hi, I am <br />
            <span className="block">Vallabh Patil</span>
          </h1>
          <div className="font-sans text-white font-semibold text-[16px] md:text-[20px] lg:text-[25px] py-5 flex flex-row lg:items-center justify-center lg:justify-start">
            <h1 className="mr-1">I am a&nbsp;</h1>
            <h1 className="text-[#8C2EDB]">{displayText}</h1>
            <span className="text-[#8C2EDB] animate-blink">|</span>
          </div>
          <div>
            <span className="text-gray-500 font-sans text-[16px]">INNOVATING TODAY FOR A SMARTER TOMORROW</span>
          </div>
          <div className="text-[#854CE6] mt-6 lg:mt-10 text-sm sm:text-md lg:text-lg font-normal">
            <a
              href="https://drive.google.com/file/d/1b9XkgCwZZH2Vdh94w9sqNHAHfyaz_ERe/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="rounded-full w-[200px] sm:w-[250px] lg:w-[300px] h-[50px] sm:h-[60px] lg:h-[70px] border-[1px] border-[#854CE6] bg-gradient-to-r from-[#854CE6] to-[#8C2EDB] text-white hover:from-[#8C2EDB] hover:to-[#854CE6] transition duration-300 ease-in-out shadow-lg hover:shadow-xl">
                Resume
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;