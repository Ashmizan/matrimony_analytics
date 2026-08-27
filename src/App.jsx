My actual matrimony frontend

import { useEffect, useState } from "react";

function App() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Membership plans
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [membershipLoading, setMembershipLoading] = useState(true);

  // Search states
  const [selectedGender, setSelectedGender] = useState("Men");
  const [selectedAge, setSelectedAge] = useState("18 - 25");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  // Login/Register popup states
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Payment popup states
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // PostgreSQL profiles
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load profiles");
        }

        return response.json();
      })
      .then((data) => {
        console.log("PostgreSQL profiles:", data);

        setProfiles(data);
        setFilteredProfiles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Could not load profiles:", error);
        setLoading(false);
      });
  }, []);

  // PostgreSQL membership plans
  useEffect(() => {
    fetch("http://localhost:5000/api/membership-plans")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load membership plans");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Membership plans:", data);

        setMembershipPlans(data);
        setMembershipLoading(false);
      })
      .catch((error) => {
        console.error("Could not load membership plans:", error);
        setMembershipLoading(false);
      });
  }, []);

  // SEARCH
  const handleSearch = () => {
    const result = profiles.filter((profile) => {
      // Gender
      const gender = String(profile.gender || "").toLowerCase();

      const genderMatch =
        selectedGender === "Men"
          ? gender === "male" ||
            gender === "man" ||
            gender === "men"
          : selectedGender === "Women"
          ? gender === "female" ||
            gender === "woman" ||
            gender === "women"
          : true;

      // Age
      const age = Number(profile.age);

      let ageMatch = true;

      if (selectedAge === "18 - 25") {
        ageMatch = age >= 18 && age <= 25;
      } else if (selectedAge === "26 - 35") {
        ageMatch = age >= 26 && age <= 35;
      } else if (selectedAge === "36 - 45") {
        ageMatch = age >= 36 && age <= 45;
      } else if (selectedAge === "46+") {
        ageMatch = age >= 46;
      }

      // City
      const city = String(profile.city || "").toLowerCase();

      const cityMatch =
        selectedCity.trim() === "" ||
        city.includes(selectedCity.trim().toLowerCase());

      return genderMatch && ageMatch && cityMatch;
    });

    setFilteredProfiles(result);
  };

  // PAYMENT
  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentComplete(false);
    setShowPayment(true);
  };

  const handlePayment = (event) => {
    event.preventDefault();
    setPaymentComplete(true);
  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          ❤️ <span>Matrimony</span>
        </div>

        <div style={styles.navLinks}>
          <a href="#home">Home</a>
          <a href="#matches">Matches</a>
          <a href="#membership">Membership</a>
          <a href="#about">About</a>

          <button
            style={styles.loginButton}
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          >
            Login
          </button>

          <button
            style={styles.registerButton}
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
          >
            Register
          </button>
        </div>
      </nav>


      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroContent}>

          <p style={styles.smallTitle}>
            FIND YOUR PERFECT PARTNER
          </p>

          <h1 style={styles.heroTitle}>
            Where <span style={styles.highlight}>Hearts</span> Meet ❤️
          </h1>

          <p style={styles.heroText}>
            Discover meaningful connections with people
            looking for love, companionship and a beautiful future.
          </p>

          {/* SEARCH BOX */}
          <div style={styles.searchBox}>

            <div style={styles.searchField}>
              <label style={styles.searchLabel}>Looking for</label>

              <select
                style={styles.searchInput}
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option>Men</option>
                <option>Women</option>
              </select>
            </div>

            <div style={styles.searchField}>
              <label style={styles.searchLabel}>Age</label>

              <select
                style={styles.searchInput}
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                <option>18 - 25</option>
                <option>26 - 35</option>
                <option>36 - 45</option>
                <option>46+</option>
              </select>
            </div>

            <div style={styles.searchField}>
              <label style={styles.searchLabel}>City</label>

              <input
                style={styles.searchInput}
                placeholder="Enter city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              />
            </div>

            <button
              style={styles.searchButton}
              onClick={handleSearch}
            >
              🔍 Search
            </button>

          </div>
        </div>
      </section>


      {/* MATCHES */}
      <section id="matches" style={styles.matches}>

        <p style={styles.smallTitle}>
          EXPLORE PROFILES
        </p>

        <h2 style={styles.sectionTitle}>
          Meet Some Amazing People 💕
        </h2>

        {loading ? (
          <p style={{ marginTop: "40px" }}>
            Loading profiles...
          </p>
        ) : (
          <div style={styles.cards}>

            {filteredProfiles.map((profile) => (
              <Profile
                key={profile.user_id || profile.id}
                name={
                  profile.first_name ||
                  profile.name ||
                  "Unknown"
                }
                age={profile.age || "N/A"}
                city={profile.city || "Unknown"}
                profession={
                  profile.profession ||
                  "Not specified"
                }
                emoji={getProfessionEmoji(profile.profession)}
              />
            ))}

          </div>
        )}

        {!loading && filteredProfiles.length === 0 && (
          <p style={{ marginTop: "40px" }}>
            No profiles found matching your search.
          </p>
        )}

      </section>


      {/* STATS */}
      <section style={styles.stats}>

        <div>
          <h2>500,000+</h2>
          <p>Members</p>
        </div>

        <div>
          <h2>120,000+</h2>
          <p>Successful Matches</p>
        </div>

        <div>
          <h2>50+</h2>
          <p>Cities</p>
        </div>

        <div>
          <h2>❤️</h2>
          <p>One Beautiful Goal</p>
        </div>

      </section>


      {/* MEMBERSHIP PLANS */}
      <section id="membership" style={styles.membershipSection}>

        <p style={styles.membershipLabel}>
          MEMBERSHIP
        </p>

        <h2 style={styles.membershipTitle}>
          Choose Your Membership Plan 💎
        </h2>

        <p style={styles.membershipSubtitle}>
          Find the plan that fits your journey to meaningful connections.
        </p>

        {membershipLoading ? (
          <p style={{ marginTop: "30px" }}>
            Loading membership plans...
          </p>
        ) : (
          <div style={styles.membershipGrid}>

            {membershipPlans.map((plan) => (

              <div
                key={plan.membership_plan}
                style={styles.membershipCard}
              >

                <div style={styles.membershipIcon}>
                  {plan.membership_plan === "Free" && "🆓"}
                  {plan.membership_plan === "Gold" && "🥇"}
                  {plan.membership_plan === "Gold Plus" && "✨"}
                  {plan.membership_plan === "Diamond" && "💎"}
                  {plan.membership_plan === "Diamond Plus" && "💎"}
                  {plan.membership_plan === "Platinum Plus" && "👑"}
                </div>

                <h3 style={styles.membershipName}>
                  {plan.membership_plan}
                </h3>

                <div style={styles.membershipPrice}>
                  ₹{Number(plan.price).toLocaleString("en-IN")}
                </div>

                <p style={styles.membershipDuration}>
                  {Number(plan.duration_months) === 0
                    ? "Free forever"
                    : `${plan.duration_months} months`}
                </p>

                <p style={styles.membershipUsers}>
                  {Number(plan.users).toLocaleString("en-IN")} members
                </p>

                <button
                  style={styles.membershipButton}
                  onClick={() => handleChoosePlan(plan)}
                >
                  Choose Plan
                </button>

              </div>

            ))}

          </div>
        )}

      </section>


      {/* ABOUT */}
      <section id="about" style={styles.about}>

        <h2>
          Love deserves a little help ❤️
        </h2>

        <p>
          Our goal is simple — help people find someone
          they genuinely connect with.
        </p>

        <button
          style={styles.registerButton}
          onClick={() => {
            setShowRegister(true);
            setShowLogin(false);
          }}
        >
          Create Your Profile
        </button>

      </section>


      {/* FOOTER */}
      <footer style={styles.footer}>

        <h3>❤️ Matrimony</h3>

        <p>
          Made with curiosity, SQL and way too much chicken. 😂
        </p>

        <p>
          © 2026 Matrimony
        </p>

      </footer>


      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeButton}
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>
              Welcome Back ❤️
            </h2>

            <input
              type="email"
              placeholder="Email"
              style={styles.modalInput}
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.modalInput}
            />

            <button style={styles.modalButton}>
              Login
            </button>

            <p style={styles.modalSwitch}>
              Don't have an account?{" "}

              <button
                style={styles.switchButton}
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register
              </button>
            </p>

          </div>

        </div>
      )}


      {/* REGISTER MODAL */}
      {showRegister && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeButton}
              onClick={() => setShowRegister(false)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>
              Create Your Profile ❤️
            </h2>

            <input
              type="text"
              placeholder="Full name"
              style={styles.modalInput}
            />

            <input
              type="email"
              placeholder="Email"
              style={styles.modalInput}
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.modalInput}
            />

            <button style={styles.modalButton}>
              Create Account
            </button>

            <p style={styles.modalSwitch}>
              Already have an account?{" "}

              <button
                style={styles.switchButton}
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </button>
            </p>

          </div>

        </div>
      )}


      {/* PAYMENT MODAL */}
      {showPayment && selectedPlan && (
        <div style={styles.overlay}>

          <div style={styles.paymentModal}>

            <button
              style={styles.closeButton}
              onClick={() => {
                setShowPayment(false);
                setPaymentComplete(false);
              }}
            >
              ×
            </button>

            {!paymentComplete ? (
              <>
                <div style={styles.paymentIcon}>
                  💳
                </div>

                <h2 style={styles.modalTitle}>
                  Complete Your Membership
                </h2>

                <p style={styles.paymentPlan}>
                  {selectedPlan.membership_plan} Plan
                </p>

                <div style={styles.paymentPrice}>
                  ₹{Number(selectedPlan.price).toLocaleString("en-IN")}
                </div>

                <form onSubmit={handlePayment}>

                  <label style={styles.paymentLabel}>
                    Card Number
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    style={styles.modalInput}
                    required
                  />

                  <div style={styles.paymentRow}>

                    <div style={styles.paymentField}>
                      <label style={styles.paymentLabel}>
                        Expiry Date
                      </label>

                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength="7"
                        style={styles.modalInput}
                        required
                      />
                    </div>

                    <div style={styles.paymentField}>
                      <label style={styles.paymentLabel}>
                        CVV
                      </label>

                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength="4"
                        style={styles.modalInput}
                        required
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    style={styles.modalButton}
                  >
                    Pay ₹{Number(selectedPlan.price).toLocaleString("en-IN")}
                  </button>

                </form>

                <p style={styles.demoNotice}>
                  🔒 Demo payment interface — no real payment is processed.
                </p>

              </>
            ) : (

              <div style={styles.successMessage}>

                <div style={styles.successIcon}>
                  🎉
                </div>

                <h2 style={styles.modalTitle}>
                  Payment Successful!
                </h2>

                <p>
                  Your {selectedPlan.membership_plan} membership
                  has been activated.
                </p>

                <button
                  style={styles.modalButton}
                  onClick={() => {
                    setShowPayment(false);
                    setPaymentComplete(false);
                  }}
                >
                  Done
                </button>

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}


/* PROFESSION EMOJI */

function getProfessionEmoji(profession) {
  const job = String(profession || "").toLowerCase();

  if (
    job.includes("software engineer") ||
    job.includes("software developer") ||
    job.includes("developer") ||
    job.includes("programmer")
  ) {
    return "👩‍💻";
  }

  if (
    job.includes("doctor") ||
    job.includes("physician") ||
    job.includes("medical") ||
    job.includes("surgeon")
  ) {
    return "👩‍⚕️";
  }

  if (
    job.includes("teacher") ||
    job.includes("professor") ||
    job.includes("lecturer") ||
    job.includes("education")
  ) {
    return "👩‍🏫";
  }

  if (
    job.includes("lawyer") ||
    job.includes("attorney") ||
    job.includes("legal")
  ) {
    return "⚖️";
  }

  if (
    job.includes("chef") ||
    job.includes("cook") ||
    job.includes("culinary")
  ) {
    return "👩‍🍳";
  }

  if (
    job.includes("designer")
  ) {
    return "🎨";
  }

  if (
    job.includes("architect")
  ) {
    return "🏗️";
  }

  if (
    job.includes("student")
  ) {
    return "🎓";
  }

  if (
    job.includes("business manager") ||
    job.includes("business") ||
    job.includes("manager")
  ) {
    return "💼";
  }

  if (
    job.includes("nurse") ||
    job.includes("nursing")
  ) {
    return "🩺";
  }

  if (
    job.includes("engineer")
  ) {
    return "👷";
  }

  if (
    job.includes("artist")
  ) {
    return "🎨";
  }

  if (
    job.includes("pilot") ||
    job.includes("aviation")
  ) {
    return "✈️";
  }

  if (
    job.includes("photographer")
  ) {
    return "📸";
  }

  return "😊";
}


/* PROFILE CARD */

function Profile({
  name,
  age,
  city,
  profession,
  emoji
}) {
  return (
    <div style={styles.card}>

      <div style={styles.profileImage}>
        {emoji}
      </div>

      <h3>
        {name}, {age}
      </h3>

      <p>📍 {city}</p>

      <p>💼 {profession}</p>

      <button style={styles.viewButton}>
        View Profile
      </button>

    </div>
  );
}


/* STYLING */

const styles = {

  page: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    color: "#333",
    background: "#e63946"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 7%",
    background: "#9b1233",
    color: "white"
  },

  logo: {
    fontSize: "25px",
    fontWeight: "bold"
  },

  navLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },

  loginButton: {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer"
  },

  registerButton: {
    background: "white",
    color: "#9b1233",
    border: "none",
    padding: "11px 22px",
    borderRadius: "22px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  hero: {
    background: "linear-gradient(135deg, #9b1233, #e54b6b)",
    color: "white",
    padding: "90px 7%"
  },

  heroContent: {
    maxWidth: "900px",
    margin: "auto",
    textAlign: "center"
  },

  smallTitle: {
    letterSpacing: "3px",
    fontSize: "13px",
    fontWeight: "bold"
  },

  heroTitle: {
    fontSize: "58px",
    margin: "20px 0"
  },

  highlight: {
    color: "#ffd1dc"
  },

  heroText: {
    fontSize: "19px",
    lineHeight: "1.6"
  },

  /* SEARCH BOX */

  searchBox: {
    background: "white",
    padding: "18px",
    borderRadius: "15px",
    marginTop: "40px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    color: "#333",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    maxWidth: "780px",
    marginLeft: "auto",
    marginRight: "auto",
    boxSizing: "border-box"
  },

  searchField: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  searchLabel: {
    fontSize: "13px",
    fontWeight: "bold",
    textAlign: "left"
  },

  searchInput: {
    width: "100%",
    height: "42px",
    padding: "0 10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    background: "white",
    color: "#333"
  },

  searchButton: {
    background: "#9b1233",
    color: "white",
    border: "none",
    height: "42px",
    padding: "0 20px",
    borderRadius: "8px",
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  matches: {
    padding: "80px 7%",
    textAlign: "center"
  },

  sectionTitle: {
    fontSize: "36px",
    color: "#9b1233"
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    marginTop: "40px",
    flexWrap: "wrap"
  },

  card: {
    width: "240px",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
    background: "white"
  },

  profileImage: {
    fontSize: "70px",
    background: "#ffe5eb",
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto"
  },

  viewButton: {
    background: "#9b1233",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer"
  },

  stats: {
    display: "flex",
    justifyContent: "space-around",
    textAlign: "center",
    background: "#fff0f3",
    padding: "50px 7%",
    color: "#9b1233"
  },

  /* MEMBERSHIP */

  membershipSection: {
    padding: "80px 7%",
    textAlign: "center",
    background: "#fff"
  },

  membershipLabel: {
    letterSpacing: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#9b1233",
    marginBottom: "10px"
  },

  membershipTitle: {
    fontSize: "36px",
    color: "#26354a",
    margin: "0 0 12px"
  },

  membershipSubtitle: {
    color: "#666",
    marginBottom: "40px"
  },

  membershipGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px"
  },

  membershipCard: {
    background: "white",
    borderRadius: "18px",
    padding: "30px 24px",
    border: "1px solid #f0dce3",
    boxShadow: "0 8px 25px rgba(100,50,70,0.08)"
  },

  membershipIcon: {
    fontSize: "40px",
    marginBottom: "12px"
  },

  membershipName: {
    fontSize: "22px",
    color: "#9b1233",
    marginBottom: "15px"
  },

  membershipPrice: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#26354a",
    marginBottom: "8px"
  },

  membershipDuration: {
    color: "#666",
    marginBottom: "8px"
  },

  membershipUsers: {
    fontSize: "14px",
    color: "#888",
    marginBottom: "22px"
  },

  membershipButton: {
    border: "none",
    background: "#9b1233",
    color: "white",
    padding: "11px 22px",
    borderRadius: "24px",
    cursor: "pointer",
    fontWeight: "600"
  },

  about: {
    textAlign: "center",
    padding: "80px 20px"
  },

  footer: {
    background: "#fff0f3",
    color: "#9b1233",
    textAlign: "center",
    padding: "40px 20px"
  },

  /* LOGIN / REGISTER */

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    position: "relative",
    width: "380px",
    maxWidth: "90%",
    background: "white",
    padding: "35px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center"
  },

  /* PAYMENT */

  paymentModal: {
    position: "relative",
    width: "430px",
    maxWidth: "90%",
    background: "white",
    padding: "35px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    textAlign: "center",
    boxSizing: "border-box"
  },

  paymentIcon: {
    fontSize: "45px",
    marginBottom: "5px"
  },

  paymentPlan: {
    color: "#9b1233",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px"
  },

  paymentPrice: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#26354a",
    marginTop: "5px",
    marginBottom: "20px"
  },

  paymentLabel: {
    display: "block",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#555",
    marginTop: "10px",
    marginBottom: "5px"
  },

  paymentRow: {
    display: "flex",
    gap: "12px"
  },

  paymentField: {
    flex: 1,
    minWidth: 0
  },

  demoNotice: {
    fontSize: "12px",
    color: "#888",
    marginTop: "18px",
    lineHeight: "1.5"
  },

  successMessage: {
    padding: "20px 5px"
  },

  successIcon: {
    fontSize: "55px",
    marginBottom: "10px"
  },

  modalTitle: {
    color: "#9b1233",
    marginBottom: "25px"
  },

  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "28px",
    color: "#777",
    cursor: "pointer"
  },

  modalInput: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box"
  },

  modalButton: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    background: "#9b1233",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  modalSwitch: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#666"
  },

  switchButton: {
    background: "none",
    border: "none",
    color: "#9b1233",
    fontWeight: "bold",
    cursor: "pointer",
    padding: 0
  }
};

export default App;
