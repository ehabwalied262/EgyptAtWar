const JoinCommunity = () => {
    return (
      <div className="join-community-container">
        {/* Add this CDN to your index.html <head> if not already included */}
        <head>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />

        </head>
        <style>
          {`
            .join-community-container {
              width: 400px; /* Rectangle width */
              height: 250px; /* Rectangle height */
              background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%); /* Updated gradient */
              border: 2px solid #fff; /* Clear border */
              border-radius: 15px; /* Rounded corners */
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); /* Subtle glow */
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              margin: 0 auto; /* Center the component */
              color: white;
              text-align: center;
              transition: all 0.3s ease;
            }
            .join-community-container h2 {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .join-community-container p {
              font-size: 14px;
              margin-bottom: 20px;
              opacity: 0.9;
            }
            .social-links {
              display: flex;
              gap: 15px;
              flex-wrap: wrap; /* Allow wrapping if needed */
              justify-content: center;
            }
            .social-links a {
              width: 40px;
              height: 40px;
              background: #fff;
              border-radius: 50%; /* Circular buttons */
              display: flex;
              align-items: center;
              justify-content: center;
              color: #1a1a1a; /* Icon color */
              font-size: 20px;
              transition: all 0.3s ease;
            }
            .social-links a:hover {
              transform: scale(1.1); /* Slight scale on hover */
              background: #ddd; /* Lighten on hover */
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); /* Glow on hover */
            }
            @media (max-width: 640px) {
              .join-community-container {
                width: 300px;
                height: 200px;
                padding: 15px;
              }
              .join-community-container h2 {
                font-size: 20px;
              }
              .join-community-container p {
                font-size: 12px;
                margin-bottom: 15px;
              }
              .social-links {
                gap: 10px;
              }
              .social-links a {
                width: 35px;
                height: 35px;
                font-size: 18px;
              }
            }
          `}
        </style>
  
        <h2>Join Our Educational Communities</h2>
        <p>Connect with us on social media!</p>
        <div className="social-links">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-discord"></i>
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram-plane"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    );
  };
  
  export default JoinCommunity;