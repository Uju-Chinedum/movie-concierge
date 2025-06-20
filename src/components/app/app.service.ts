import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>The Movie Concierge</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .container {
            padding: 40px 30px;
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            text-align: center;
            max-width: 90%;
            width: 480px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
          }

          h1 {
            font-size: 2.5rem;
            margin-bottom: 16px;
            letter-spacing: 1px;
          }

          h1 span {
            color: #ffd700;
          }

          p {
            font-size: 1.2rem;
            margin-bottom: 24px;
          }

          a.button {
            display: inline-block;
            padding: 12px 28px;
            background: #ffd700;
            color: #1e3c72;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1rem;
            transition: background 0.2s ease;
          }

          a.button:hover {
            background: #ffe066;
          }

          @media (max-width: 480px) {
            h1 {
              font-size: 2rem;
            }

            p {
              font-size: 1rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎬 Welcome to <span>The Movie Concierge</span></h1>
          <p>Discover, explore, and enjoy your favorite movies with personalized recommendations.</p>
          <a href="/api/v1" class="button">Get Started</a>
        </div>
      </body>
      </html>
    `;
  }
}
