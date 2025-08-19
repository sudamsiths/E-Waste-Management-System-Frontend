import React from "react";

const ClientInterface02: React.FC = () => {
  return (
    <div className="user-interface-section">
      <div className="main-container">
        <div className="content-wrapper">
          <div className="text-column">
            <div className="text-content">
              <div className="section-label">
                About Us
              </div>
              <div className="main-heading">
                We Have Experts
                <br />
                Who Help
              </div>
              <div className="description-wrapper">
                <div className="description-text">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do
                  amet sint. <br />
                  duis enim velit mollit. Exercitation veniam consequat nostrud
                  amet.
                  <br />
                  <br />
                  There are many variations of passages of Lorem Ipsum
                  available, but as a the majority have suffered alteration in
                  some form, by injected humour, or deratt randomised words
                  which don't look even slightly believable. If you are even
                  going to use a passage of Lorem Ipsum, you need to be sure.
                </div>
                <button className="button-container"style={{ cursor: "pointer" }}>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/8eb94e8c04e6a9b4b6012267ea110eabb95759f6?placeholderIfAbsent=true"
                    className="button-background"
                    alt=""
                  />
                  <div className="button-text">
                    Know More
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="image-column">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/2e2c586f4d733fc3f7282c8a85a2d9ea1d669be9?placeholderIfAbsent=true"
              className="main-image"
              alt="Expert team"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInterface02;
