// js/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

let app, db;

// Initialize Firebase if config is present
if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button to prevent multiple submissions
    const submitBtn = rsvpForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerHTML = '<span>Sending...</span>';

    const formData = new FormData(rsvpForm);
    const rsvpData = {
      name: formData.get('name'),
      guests: formData.get('guests'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    try {
      if (db) {
        // Save to Firebase
        await addDoc(collection(db, "rsvps"), rsvpData);
      } else {
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem('harikaBikshamaiahRSVP') || '[]');
        saved.push(rsvpData);
        localStorage.setItem('harikaBikshamaiahRSVP', JSON.stringify(saved));
        console.log("RSVP saved to localStorage (Firebase not configured)");
      }

      // Show success
      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
      
      // Trigger small confetti from success message
      if (typeof confetti === 'function') {
        const rect = rsvpSuccess.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x, y },
          colors: ['#b8895a', '#d8b16e', '#ffffff']
        });
      }
      
    } catch (error) {
      console.error("Error saving RSVP: ", error);
      alert("There was an error saving your RSVP. Please try again or use the email fallback.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>${originalText}</span>`;
    }
  });
});
