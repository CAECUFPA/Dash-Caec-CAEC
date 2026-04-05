import React from 'react';

const AtenaIcon = ({ size = 44, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Fundo Quadrado Arredondado estilo ADM/FIN */}
    <rect x="0" y="0" width="512" height="512" rx="120" fill="#FBBF24" />

    {/* Ícone da Deusa em contraste (Preto do Fundo da Sidebar) */}
    <path
      d="M256 90C198.8 90 152 136.8 152 194C152 233.1 173.8 267.1 206 284.9C213 286.7 213 286.7 213 286.7H299C299 286.7 299 286.7 306 284.9C338.2 267.1 360 233.1 360 194C360 136.8 313.2 90 256 90ZM286 238.6C280.3 241.7 273.8 243.4 267.3 243.4H245V194H298V210.5C298 221.9 293.4 232.7 286 238.6ZM256 100C302 100 339.4 133.4 347.7 176.6C334.8 166.7 321.4 161.5 308.3 159.4C303.2 124.8 273.4 100 237 100H256Z"
      fill="#030712"
    />
  </svg>
);

export default AtenaIcon;
