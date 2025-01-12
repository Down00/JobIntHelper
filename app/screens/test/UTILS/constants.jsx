// constants/constants.js
import backendQuestions from "../DATA/backend.json";
import dataScienceQuestions from "../DATA/datascience.json";
import frontendQuestions from "../DATA/frontend.json";
import softwareEngineerQuestions from "../DATA/softwareengineer.json";

export const colors = {
  primary: "#6200ee",
  secondary: "#03dac4",
  background: "#f5f5f5",
  text: "#000000",
  lightText: "#6b6b6b",
};

export const jobTypes = [
  "datascience",
  "softwareengineer",
  "frontend",
  "backend",
];
export const difficulties = ["Easy", "Medium", "Hard"];

export const jobQuestions = {
  datascience: dataScienceQuestions,
  softwareengineer: softwareEngineerQuestions,
  frontend: frontendQuestions,
  backend: backendQuestions,
};
