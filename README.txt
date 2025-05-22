Για την σωστή λειτουργια του προτζεκτ υπάρχουν οι εξής απαιτήσεις:

- [Node.js & npm](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/index.html) (για MySQL και phpMyAdmin)


Δομή φακέλων
μέσα στο RestaurantProject υπάρχουν: 

- backend: Node.js Express server
- RestaurantApp: Expo React Native εφαρμογή
- restaurant_db.sql: SQL αρχείο με τη βάση και τους πίνακες (μέσα στον φάκελο `backend/`)


Κλωνοποίηση project 
Το link του GitHub για το project είναι αυτό: https://github.com/MikeBaltz/RestaurantProject.git

Ανοίξτε ένα φάκελο στον υπολογιστή σας (π.χ. `Documents`) και εκτελέστε στο τερματικό:

git clone https://github.com/MikeBaltz/RestaurantProject.git


Σύνδεση βάσης
Στη συνέχεια ανοίξτε το http://localhost/phpmyadmin και κάντε import το restaurant_app.sql που βρίσκεται στον φάκελο backend.

Εκκίνηση backend
cd RestaurantProject 
cd backend
npm install
node app.js

Εκκίνηση frontend
cd ../RestaurantApp
npm install
npx expo start όταν φορτώσουν οι επιλογές επιλέξτε το "w" για "open web"
