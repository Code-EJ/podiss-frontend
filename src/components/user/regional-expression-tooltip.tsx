import React, { useState } from 'react';

interface RegionalExpressionTooltipProps {
  expression: string;
  meaning: string;
}

/**
 * Explains regional expressions without translating the visible editorial content.
 * @author oEnzoRibas
 */
const RegionalExpressionTooltip: React.FC<RegionalExpressionTooltipProps> = ({ expression, meaning }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ // Estilo da expressão mineira
        display: 'inline-block',
        position: 'relative',
        cursor: 'pointer',
        margin: '5px',
        padding: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
      }}
    >
      {expression}
      {isHovered && (
        <div
          style={{ // Estilo do sentido da expressão
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '5px',
            padding: '10px',
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {meaning}
        </div>
      )}
    </div>
  );
};

export default RegionalExpressionTooltip;
