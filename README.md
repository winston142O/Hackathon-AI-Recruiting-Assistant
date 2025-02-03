# 🛍️ AI Recruiting Assistance

[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/-Express-373737?style=for-the-badge&logo=Express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?logo=amazons3&logoColor=fff&style=for-the-badge)](https://aws.amazon.com/s3/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![AOS](https://img.shields.io/badge/Animate_On_Scroll-blue)](https://michalsnik.github.io/aos/)
[![OpenAI API](https://img.shields.io/badge/OpenAI-%23412991?logo=openai&logoColor=white)](https://platform.openai.com/docs/overview)

A modern web application to manage job vacancies and analyze applicant CVs using AI.

## 📋 Table of Contents
- [Installation](#Installation)
- [Usage](#Usage)
- [License](#license)

## Prerequisites
 -npm
 -node
 -mongodb
 -an openai api key
 -an aws access key

## Installation
1. Clone the repository:

```bash
git clone https://github.com/winston142O/Hackathon-AI-Recruiting-Assistant.git

cd Hackathon-AI-Recruiting-Assistant
```
2. Install backend and frontend dependencies:

    2.1 Backend:
    ```bash
    cd backend

    npm install

    npm run dev
    ```
    Environment variables:
    ```bash
    MONGO_URI=mongodb://localhost:27017/bd-hackathon
    AWS_ACCESS_KEY_ID=YOUR_AWS_KEY
    AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
    AWS_REGION=YOUR_AWS_REGION
    S3_BUCKET_NAME=YOUR_S3_BUCKET
    OPENAI_API_KEY=YOUR_OPENAI_KEY
    ```

    2.2 Frontend:

    ```bash
    cd frontend

    npm install

    npm run dev
    ```
    Environment variables:
    ```bash
    VITE_REACT_APP_JOBS_URL=http://localhost:3000
    ```

## Usage
1. With both frontend and backend running, access the web-app at http://localhost:5173
2. Add a new vacant on the green button on the top right.
3. Input the vacant name and vacant description.
4. Upload CVs by clicking the new vacant in the dashboard.
5. Press 'visualize' on the vacant to see the AI analyzed dashboard and statistics.
6. You can delete and edit vacants via the main board, as well as search or filter them.

## License
This project is licensed under the MIT License.