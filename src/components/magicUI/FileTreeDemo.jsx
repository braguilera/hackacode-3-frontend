import { useNavigate } from "react-router-dom";
import { File, Folder, Tree } from "./FileTree";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function FileTreeDemo({ seleccionado }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-background rounded-md"
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className="size-6 dark:stroke-white" />
          ) : (
            <Menu className="size-6 dark:stroke-white" />
          )}
        </button>
      )}

      <div
        className={`
          fixed top-0 left-0 
          transition-all duration-300
          bg-background z-50 rounded-lg dark:text-white 
          ${isMobile ? 'mt-16' : ''}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <Tree
          className="p-2 overflow-hidden rounded-md"
          initialSelectedId={seleccionado.file}
          initialExpandedItems={isMobile ? [] : [seleccionado.folder]}
          elements={ELEMENTS}
        >
          {renderElements(ELEMENTS, navigate, () => isMobile && setIsOpen(false))}
        </Tree>
      </div>
    </>
  );
}

function renderElements(elements, navigate, onNavigate) {
  return elements.map((element) => {
    if (element.children) {
      return (
        <Folder key={element.id} value={element.id} element={element.name}>
          {renderElements(element.children, navigate, onNavigate)}
        </Folder>
      );
    }
    return (
      <File
        key={element.id}
        value={element.id}
        onClick={() => {
          navigate(`/${element.navegation}`);
          onNavigate?.(); 
        }}
      >
        <p>{element.name}</p>
      </File>
    );
  });
}

const ELEMENTS = [
  {
    id: "1",
    isSelectable: true,
    name: "src",
    children: [
      {
        id: "2",
        isSelectable: true,
        name: "home",
        children: [
          {
            id: "3",
            isSelectable: true,
            name: "Home.jsx",
            navegation: "",
          },
        ],
      },
      {
        id: "8",
        isSelectable: true,
        name: "about_me",
        children: [
          {
            id: "9",
            isSelectable: true,
            name: "AboutMe.jsx",
            navegation: "sobre_mi",
          },
        ],
      },
      {
        id: "4",
        isSelectable: true,
        name: "projects",
        children: [
          {
            id: "5",
            isSelectable: true,
            name: "Projects.jsx",
            navegation: "proyectos",
          },
        ],
      },
      {
        id: "6",
        isSelectable: true,
        name: "skills",
        children: [
          {
            id: "7",
            isSelectable: true,
            name: "Skills.jsx",
            navegation: "habilidades",
          },
        ],
      },
      
    ],
  },
];
