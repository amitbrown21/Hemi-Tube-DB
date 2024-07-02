const mongoose = require("mongoose");

const User = require("../models/userModel"); // Adjust path as needed

mongoose
  .connect("mongodb://localhost:27017/HemiTubeShonAndAmit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

function generateRandomUsers(count) {
  const users = [];
  const genders = ["male", "female", "other"];
  const profilePictures = [
    "/assets/img/user1.jpg",
    "/assets/img/user2.jpg",
    "/assets/img/user3.jpg",
    "/assets/img/user4.jpg",
    "/assets/img/user5.jpg",
  ];

  const usernames = [
    "TechWizard42",
    "NatureLover99",
    "FitnessFanatic23",
    "BookWorm2024",
    "MusicMaestro55",
    "FoodieExplorer",
    "TravelBug88",
    "GamerPro365",
    "ArtisticSoul77",
    "ScienceGeek101",
    "FilmBuff2023",
    "PetLover123",
    "FashionIcon22",
    "CodeNinja44",
    "YogaGuru33",
    "HistoryBuff66",
    "EcoWarrior21",
    "CoffeeAddict95",
    "DIYMaster78",
    "SportsFan2024",
  ];

  function generatePassword() {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let password = "";

    // Ensure at least one letter and one number
    password += letters[Math.floor(Math.random() * letters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill the rest to reach at least 8 characters
    while (password.length < 8) {
      if (Math.random() < 0.5) {
        password += letters[Math.floor(Math.random() * letters.length)];
      } else {
        password += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }

    return password;
  }

  for (let i = 0; i < count; i++) {
    const firstName = `FirstName${i + 1}`;
    const lastName = `LastName${i + 1}`;
    const username = usernames[i];

    users.push({
      firstName,
      lastName,
      username,
      password: generatePassword(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      profilePicture:
        profilePictures[Math.floor(Math.random() * profilePictures.length)],
      subscribers: `${Math.floor(Math.random() * 10000)}`,
      videosID: [],
    });
  }

  return users;
}

async function uploadUsers(users) {
  try {
    await User.insertMany(users);
    console.log("Users uploaded successfully");
  } catch (error) {
    console.error("Error uploading users:", error);
  } finally {
    mongoose.connection.close();
  }
}

const randomUsers = generateRandomUsers(20);
uploadUsers(randomUsers);
