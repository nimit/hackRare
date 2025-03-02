import data from './dummyData.js';

const firebaseConfig = {
    apiKey: "AIzaSyAV_arS9DGmO21ZWJsG_ZhWDFPtbGBSSns",
    authDomain: "hack-rare.firebaseapp.com",
    projectId: "hack-rare",
    storageBucket: "hack-rare.firebasestorage.app",
    messagingSenderId: "720609785383",
    appId: "1:720609785383:web:75a9d26c035e7c949e0002"
};

// Initialize Firebase with compat version
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


function signin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.user = userCredential.user;
            document.getElementById("message").innerText = `Signed in successfully (${user.uid})`;
            console.dir(userCredential)
        })
        .catch(error => {
            document.getElementById("message").innerText = "Error: " + error.message;
        });
}

function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.user = userCredential.user;
            document.getElementById("message").innerText = `Account created successfully ((${user.uid}))`;
            console.dir(userCredential)
        })
        .catch(error => {
            document.getElementById("message").innerText = "Error: " + error.message;
        });
}

function signout() {
    auth.signOut()
        .then(() => {
            document.getElementById("message").innerText = "Signed out successfully";
        })
        .catch(error => {
            document.getElementById("message").innerText = "Error: " + error.message;
        });
}

// Function to add or update a document with ID "x" in patient_users collection
function insertPatient() {
    // Get Firestore reference from the compat CDN version
    const db = firebase.firestore();
    
    // Reference to the document with ID "x" in patient_users collection
    const patientDocRef = db.collection("patients").doc(user.uid);
    
    // Set the document data (this will create if doesn't exist, or update if it does)
    return patientDocRef.set(data.patientData)
      .then(() => {
        console.log("Document successfully written!");
        document.getElementById("message").innerText = "Patient user data saved successfully";
        return true;
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        document.getElementById("message").innerText = "Error saving patient data: " + error.message;
        return false;
      });
  }

// Function to add or update a document with ID "x" in patient_users collection
function insertTrial() {
    // Get Firestore reference from the compat CDN version
    const db = firebase.firestore();
    
    // Reference to the document with ID "x" in patient_users collection
    const trialRef = db.collection("trials").doc(data.trialData.trial_id);
    
    // Set the document data (this will create if doesn't exist, or update if it does)
    return trialRef.set(data.trialData)
      .then(() => {
        console.log("Document successfully written!");
        document.getElementById("message").innerText = "Trial data saved successfully";
        return true;
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        document.getElementById("message").innerText = "Error saving patient data: " + error.message;
        return false;
      });
  }

// Function to add or update a document with ID "x" in patient_users collection
function insertClinic() {
    // Get Firestore reference from the compat CDN version
    const db = firebase.firestore();
    
    // Reference to the document with ID "x" in patient_users collection
    const trialRef = db.collection("clinics").doc(data.clinicData.clinic_id);
    
    // Set the document data (this will create if doesn't exist, or update if it does)
    return trialRef.set(data.clinicData)
      .then(() => {
        console.log("Document successfully written!");
        document.getElementById("message").innerText = "Trial data saved successfully";
        return true;
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        document.getElementById("message").innerText = "Error saving patient data: " + error.message;
        return false;
      });
  }

function insertClinicUser() {
    // Get Firestore reference from the compat CDN version
    const db = firebase.firestore();
    
    // Reference to the document with ID "x" in patient_users collection
    const trialRef = db.collection("clinic_users").doc(data.clinicUserData.user_id);
    
    // Set the document data (this will create if doesn't exist, or update if it does)
    return trialRef.set(data.clinicUserData)
      .then(() => {
        console.log("Document successfully written!");
        document.getElementById("message").innerText = "Trial data saved successfully";
        return true;
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        document.getElementById("message").innerText = "Error saving patient data: " + error.message;
        return false;
      });
  }

window.signin = signin;
window.signup = signup;
window.signout = signout;
window.insertPatient = insertPatient;
window.insertTrial = insertTrial;
signin()
insertClinic()
insertClinicUser()
console.log("Added to window");