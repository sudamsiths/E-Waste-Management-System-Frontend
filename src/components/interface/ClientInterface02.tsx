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
                <div className="button-container">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/8eb94e8c04e6a9b4b6012267ea110eabb95759f6?placeholderIfAbsent=true"
                    className="button-background"
                    alt=""
                  />
                  <div className="button-text">
                    Know More
                  </div>
                </div>
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

      <style jsx>{`
        .user-interface-section {
          overflow: hidden;
        }

        .main-container {
          background-color: rgba(211, 246, 183, 1);
          width: 100%;
          padding: 70px 23px 16px 65px;
        }

        .content-wrapper {
          gap: 20px;
          display: flex;
        }

        .text-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 50%;
          margin-left: 0px;
        }

        .text-content {
          display: flex;
          flex-direction: column;
          align-self: stretch;
          align-items: start;
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-weight: 400;
          margin: auto 0;
        }

        .section-label {
          color: rgba(139, 195, 74, 1);
          font-size: 22px;
        }

        .main-heading {
          color: rgba(44, 62, 80, 1);
          font-size: 56px;
          font-weight: 700;
          margin-top: 21px;
        }

        .description-wrapper {
          align-self: stretch;
          margin-top: 92px;
          font-size: 18px;
          padding: 0 4px;
        }

        .description-text {
          color: rgba(0, 0, 0, 1);
        }

        .button-container {
          display: flex;
          flex-direction: column;
          position: relative;
          aspect-ratio: 2.885;
          margin-top: 55px;
          width: 150px;
          max-width: 100%;
          color: rgba(255, 255, 255, 1);
          text-align: center;
          padding: 3px 53px 14px;
        }

        .button-background {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }

        .button-text {
          position: relative;
        }

        .image-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 50%;
          margin-left: 20px;
        }

        .main-image {
          aspect-ratio: 0.91;
          object-fit: contain;
          object-position: center;
          width: 100%;
          flex-grow: 1;
        }

        @media (max-width: 768px) {
          .main-container {
            max-width: 100%;
            padding: 40px 16px 16px 16px;
          }

          .content-wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }

          .text-column {
            width: 100%;
            margin-left: 0;
          }

          .text-content {
            max-width: 100%;
            margin-top: 0;
            text-align: center;
          }

          .section-label {
            font-size: 18px;
          }

          .main-heading {
            max-width: 100%;
            font-size: 32px;
            line-height: 1.2;
            margin-top: 16px;
          }

          .description-wrapper {
            max-width: 100%;
            margin-top: 32px;
            padding: 0;
          }

          .description-text {
            max-width: 100%;
            font-size: 16px;
            line-height: 1.6;
            text-align: left;
          }

          .button-container {
            margin-top: 32px;
            padding: 8px 40px 12px;
            width: 140px;
            align-self: center;
          }

          .image-column {
            width: 100%;
            margin-left: 0;
          }

          .main-image {
            max-width: 100%;
            margin-top: 32px;
            height: auto;
          }
        }

        @media (max-width: 480px) {
          .main-container {
            padding: 32px 12px 12px 12px;
          }

          .section-label {
            font-size: 16px;
          }

          .main-heading {
            font-size: 28px;
            margin-top: 12px;
          }

          .description-wrapper {
            margin-top: 24px;
          }

          .description-text {
            font-size: 14px;
            line-height: 1.5;
          }

          .button-container {
            margin-top: 24px;
            padding: 6px 32px 10px;
            width: 120px;
            font-size: 14px;
          }

          .main-image {
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ClientInterface02;
