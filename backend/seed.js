const mongoose = require("mongoose");

const Education = require("./src/models/Education");
const Resource = require("./src/models/Resource");

const SYSTEM_USER_ID = new mongoose.Types.ObjectId("000000000000000000000001");

const resources = [
  {
    name: "Community Free Clinic",
    category: "clinic",
    description: "General checkups, screening, and preventive care for local residents.",
    location: "North District",
    contactInformation: "0800-100-200",
    availability: "Monday-Friday, 8:00 AM-5:00 PM",
    createdBy: SYSTEM_USER_ID
  },
  {
    name: "City Vaccination Center",
    category: "vaccination",
    description: "Routine immunizations and vaccination guidance for children and adults.",
    location: "Downtown Health Center",
    contactInformation: "0800-100-300",
    availability: "Monday-Saturday, 9:00 AM-4:00 PM",
    createdBy: SYSTEM_USER_ID
  },
  {
    name: "Mental Wellness Helpline",
    category: "mental_wellness",
    description: "Confidential support for stress, sleep, and emotional wellbeing.",
    location: "Nationwide",
    contactInformation: "Call 988",
    availability: "24 hours a day, 7 days a week",
    createdBy: SYSTEM_USER_ID
  }
];

const education = [
  {
    title: "Building a Balanced Plate",
    category: "nutrition",
    summary: "Simple ways to include a variety of nutritious foods in everyday meals.",
    content: "Aim to include vegetables or fruit, a source of protein, and whole grains in your meals. Drink water regularly and choose less processed foods when possible.",
    source: "HealthBridge Community Health Team",
    createdBy: SYSTEM_USER_ID
  },
  {
    title: "Everyday Hand Hygiene",
    category: "hygiene",
    summary: "When and how to wash your hands to help prevent the spread of illness.",
    content: "Wash your hands with soap and clean running water for at least 20 seconds. Clean them before preparing food, before eating, after using the toilet, and after coughing or sneezing.",
    source: "HealthBridge Community Health Team",
    createdBy: SYSTEM_USER_ID
  },
  {
    title: "Knowing When to Seek First Aid",
    category: "first_aid",
    summary: "Basic steps for responding calmly while waiting for professional help.",
    content: "Check that the area is safe, call local emergency services when needed, and provide only care you know how to give. Do not move someone with a possible serious injury unless there is immediate danger.",
    source: "HealthBridge Community Health Team",
    createdBy: SYSTEM_USER_ID
  },
  {
    title: "Preventive Health Checkups",
    category: "preventive_care",
    summary: "Why routine checkups and screenings are useful even when you feel well.",
    content: "Routine visits can help identify health concerns early and keep vaccinations and screenings up to date. Ask a licensed healthcare provider which checks are appropriate for your age and circumstances.",
    source: "HealthBridge Community Health Team",
    createdBy: SYSTEM_USER_ID
  }
];

async function seedDatabase() {
  const [resourceCount, educationCount] = await Promise.all([
    Resource.countDocuments(),
    Education.countDocuments()
  ]);

  if (resourceCount === 0) {
    await Resource.insertMany(resources);
    console.log(`Seeded ${resources.length} resources`);
  }

  if (educationCount === 0) {
    await Education.insertMany(education);
    console.log(`Seeded ${education.length} education articles`);
  }
}

if (require.main === module) {
  require("dotenv").config();
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
    })
    .catch((error) => {
      console.error("Seed failed:", error.message);
      process.exitCode = 1;
    });
}

module.exports = seedDatabase;
