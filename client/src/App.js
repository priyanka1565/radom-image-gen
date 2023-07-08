import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
function App() {
  const [display, setDisplay] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://pixabay.com/api/?key=38119579-bc9a976021967e74f44f1cf25&q=yellow+flowers&image_type=photo"
        );
        const images = response.data.hits;
        setDisplay(images);
        selectRandomImage(images);
      } catch (error) {
        console.error("Failed to fetch images: ", error);
      }
    };

    fetchImages();
  }, []);

  const selectRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    setSelectedImage({ ...randomImage, index: randomIndex });
  };

  const getShareUrl = () => {
    if (selectedImage) {
      const currentUrl = window.location.href;
      const imageUrl = encodeURIComponent(selectedImage.webformatURL);
      const shareUrl = `${currentUrl}?imageIndex=${selectedImage.index}&imageUrl=${imageUrl}`;
      return shareUrl;
    }
    return window.location.href;
  };

  const getImageFromSharedUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    const imageIndex = queryParams.get("imageIndex");
    const imageUrl = queryParams.get("imageUrl");

    if (imageIndex && imageUrl) {
      const decodedImageUrl = decodeURIComponent(imageUrl);
      setSelectedImage({
        webformatURL: decodedImageUrl,
        index: parseInt(imageIndex, 10),
      });
    }
  };

  useEffect(() => {
    getImageFromSharedUrl();
  }, []);

  const renderMetaTags = () => {
    if (selectedImage) {
      const metaTags = [
        { property: "og:title", content: "Reshare your Image" },
        { property: "og:description", content: "Sharing is caring" },
        { property: "og:image", content: selectedImage.webformatURL },
        { property: "og:url", content: window.location.href },
      ];

      return metaTags.map((tag, index) => (
        <meta key={index} property={tag.property} content={tag.content} />
      ));
    }

    return null;
  };

  return (
    <div className="App">
      <Helmet>{renderMetaTags()}</Helmet>
      <div id="share">
        {selectedImage && (
          <div>
            <img src={selectedImage.webformatURL} alt="Random Image" />
          </div>
        )}
      </div>
      <div id="btn">
        <FacebookShareButton url={getShareUrl()}>
          <FacebookIcon size={32} />
        </FacebookShareButton>
        <WhatsappShareButton url={getShareUrl()}>
          <WhatsappIcon size={32} />
        </WhatsappShareButton>
        <TwitterShareButton url={getShareUrl()}>
          <TwitterIcon size={32} />
        </TwitterShareButton>
        <LinkedinShareButton url={getShareUrl()}>
          <LinkedinIcon size={32} />
        </LinkedinShareButton>
      </div>
    </div>
  );
}

export default App;
