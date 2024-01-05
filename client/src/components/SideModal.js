import { useEffect, useRef } from "react";
import styled from "styled-components";

function SideModal({ isOpen, setIsOpen, content }) {
  const overlayRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  // Update isOpenRef whenever isOpen changes
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const listener = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      setIsOpen(false);
      isOpenRef.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("click", listener);
    return () => {
      window.removeEventListener("click", listener);
    };
  }, []);

  if (!isOpen) return null;
  return (
    <Styled>
      <div className="overlay" ref={overlayRef}></div>
      <div className="container">
        <button onClick={() => setIsOpen(false)} className="btn close-btn">
          X
        </button>
        <div className="content">{content}</div>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .container {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 500px;
    background-color: var(--background2);
    padding: 5em 2em;
    z-index: 1999;

    .close-btn {
      position: absolute;
      font-size: 18px;
      top: 15px;
      right: 15px;
    }
    .close-btn:hover {
      background-color: var(--background1);
    }

    .content {
    }
  }
`;

export default SideModal;
