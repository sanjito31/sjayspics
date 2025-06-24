import Layout from './Components/Layout.jsx'
import Gallery from './Components/Gallery.jsx'
import { useState, useEffect } from "react";

function App() {

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('/api/images.json')
      .then(res => res.json())
      .then(setPhotos)
      .catch(console.error)
  }, [])


  return (
      <Layout>
        <Gallery photos={photos} />
      </Layout>
  );
}

export default App
