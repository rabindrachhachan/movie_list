// LazyImage.js

import React, { Suspense,useState } from 'react';

const LazyImage = ({ src, alt }) => {

  const [imageSrc, setImageSrc] = useState(src);
  const fallbackImage = 'https://test.create.diagnal.com/images/placeholder_for_missing_posters.png'; // Path to your fallback image

  const handleError = () => {
    setImageSrc(fallbackImage);
  };

  return (
    <Suspense fallback={<img src={fallbackImage} alt="Loading..." />}>
      <img src={imageSrc} onError={handleError}  alt={alt} />
    </Suspense>
  );
};

export default LazyImage;
