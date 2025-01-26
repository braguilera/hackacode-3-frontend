import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Dock, DockIcon } from "./Dock";
import { Separator } from "../ui/Separator";
import { useNavigate } from "react-router-dom";
import Contexto from "../../contexto/Contexto";
import { useTranslation } from "react-i18next";


export function DockDemo() {
    const navegacion = useNavigate();
    const {darkMode, setDarkMode} = useContext(Contexto);
    const [isEnglish, setIsEnglish] = useState(false);
    const [t, i18n] = useTranslation("inicio");

    const Icons = {
      github: (props) => (
          <svg viewBox="0 0 438.549 438.549" {...props}>
          <title>GitHub</title>
          <path
          fill={darkMode ? "white" : "currentColor"}
          d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
        ></path>
      </svg>
    ),
    linkedin: (props) => (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>LinkedIn</title>
        <path
          fill={darkMode ? "white" : "currentColor"}
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        />
      </svg>
    ),
    mail: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={darkMode ? "white" : "currentColor"} {...props}>
          <title>Mail</title> 
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"></path>
      </svg>
    ),
    wsp: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
      <title>Whatsapp</title>
      <path fill={darkMode ? "white" : "currentColor"} d="M12.001 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.95 9.95 0 0 1-5.03-1.355L2.005 22l1.352-4.968A9.95 9.95 0 0 1 2.001 12c0-5.523 4.477-10 10-10M8.593 7.3l-.2.008a1 1 0 0 0-.372.1a1.3 1.3 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.73 2.73 0 0 0 6.9 9.62c.002.49.13.967.33 1.413c.409.902 1.082 1.857 1.97 2.742c.214.213.424.427.65.626a9.45 9.45 0 0 0 3.84 2.046l.568.087c.185.01.37-.004.556-.013a2 2 0 0 0 .833-.231a5 5 0 0 0 .383-.22q.001.002.125-.09c.135-.1.218-.171.33-.288q.126-.13.21-.302c.078-.163.156-.474.188-.733c.024-.198.017-.306.014-.373c-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.402-.621a.5.5 0 0 0-.176-.041a.48.48 0 0 0-.378.127c-.005-.002-.072.055-.795.931a.35.35 0 0 1-.368.13a1.4 1.4 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.108a6 6 0 0 1-1.575-1.003c-.126-.11-.243-.23-.363-.346a6.3 6.3 0 0 1-1.02-1.268l-.059-.095a1 1 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41c.11-.14.203-.276.263-.373c.118-.19.155-.385.093-.536q-.42-1.026-.868-2.041c-.059-.134-.234-.23-.393-.249q-.081-.01-.162-.016a3 3 0 0 0-.403.004z" />
      </svg>
    ),
    dark: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
        <title>Dark</title>
        <path fill={darkMode ? "white" : "currentColor"} d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56" />
      </svg>
    ),
    light: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
        <title>Light</title>
        <path fill={darkMode ? "white" : "currentColor"} d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1M2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1m17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1m-6 8a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0zm5.364-3.05a1 1 0 1 0-1.414 1.414l.707.707a1 1 0 0 0 1.414-1.414zM4.929 4.929a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 5.636 7.05l-.707-.707a1 1 0 0 1 0-1.414M7.05 18.364a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 1 0 1.414 1.414zM19.071 4.929a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0M7 12a5 5 0 1 1 10 0a5 5 0 0 1-10 0" clip-rule="evenodd" />
      </svg>
    ),
  };

    const toggleMode = () =>{
      setDarkMode(!darkMode)
    }

    const redirectTo = (url) => {
      window.open(url, '_blank'); 
  };

    return (
      <div className="fixed bottom-5 left-1/2 translate-x-[-50%] z-50">
        <Dock direction="middle">
          
          <button
          onClick={() => (setIsEnglish(!isEnglish), (!isEnglish ? i18n.changeLanguage("es") : i18n.changeLanguage("en") ) )}
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 flex items-center justify-center group overflow-hidden"
          aria-label="Change language"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={isEnglish ? 'en' : 'es'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute text-lg font-semibold text-black dark:text-white"
                >
                  {!isEnglish ? 'EN' : 'ES'}
                </motion.span>
              </AnimatePresence>
            </div>
            
          </button>

            <Separator className="h-full py-2"></Separator>
            
            <DockIcon>
              <Icons.wsp className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300" onClick={()=>redirectTo('https://wa.me/+5491165062626')}/>
            </DockIcon>
            <DockIcon>
              <Icons.mail className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300" onClick={()=>redirectTo('mailto:marco.enzo.w01@gmail.com')}/>
            </DockIcon>
            <DockIcon>
              <Icons.github className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300" onClick={()=>redirectTo('https://github.com/EnzoMarco01')}/>
            </DockIcon>
            <DockIcon>
              <Icons.linkedin className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300" onClick={()=>redirectTo('https://www.linkedin.com/in/enzomarco/')}/>
            </DockIcon>

            <Separator className="h-full py-2"></Separator>

            <button
              onClick={toggleMode}
              className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 flex items-center justify-center group overflow-hidden"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={darkMode ? 'dark' : 'light'}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute"
                  >
                    {darkMode ? (
                      <Icons.light className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300"/>
                    ) : (
                      <Icons.dark className="size-12 sm:size-10 box-border p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 duration-300" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </button>


      </Dock>
    </div>
    );
}

