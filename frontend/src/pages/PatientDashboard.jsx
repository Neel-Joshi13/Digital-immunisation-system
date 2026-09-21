import { useEffect, useState } from "react";
import {
  changeMyPassword,
  createMyProfile,
  getMyProfile,
  updateMyProfile,
} from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "../styles/patient-profile.css";

function PatientDashboard() {
  const { language } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [isProfileLoading, setIsProfileLoading] =
    useState(true);

  const [isEditingProfile, setIsEditingProfile] =
    useState(false);
  const [isSavingProfile, setIsSavingProfile] =
    useState(false);
  const [profileMessage, setProfileMessage] =
    useState("");
  const [profileError, setProfileError] =
    useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] =
    useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const text = {
    en: {
      title: "My Profile",
      subtitle: "View and manage your personal information.",
      patientInformation: "Patient information",
      fullName: "Full Name",
      firstName: "First Name",
      lastName: "Last Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      phoneNumber: "Phone Number",
      address: "Address",
      male: "Male",
      female: "Female",
      other: "Other",
      selectGender: "Select gender",
      notProvided: "Not provided",
      security:
        "Your personal information is securely stored in your Digital Immunisation record.",
      loading: "Loading profile...",
      createProfile: "Create Profile",
      createProfileDescription:
        "Complete your personal information to create your patient profile.",
      editProfile: "Edit Profile",
      editProfileDescription:
        "Update your personal information whenever needed.",
      saveProfile: "Save Profile",
      saveChanges: "Save Changes",
      savingProfile: "Saving profile...",
      cancel: "Cancel",
      profileCreated:
        "Your profile has been created successfully.",
      profileUpdated:
        "Your profile has been updated successfully.",
      profileRequired:
        "Please complete all required profile fields.",
      profileLoadError:
        "Unable to load your profile.",
      changePassword: "Change Password",
      changePasswordDescription:
        "Update your account password to keep your account secure.",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      passwordStrength: "Password strength",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      passwordRequirements:
        "Use at least 8 characters with uppercase, lowercase, number and special character.",
      passwordsDoNotMatch:
        "New password and confirmation password do not match.",
      passwordTooWeak:
        "Please choose a stronger password.",
      changePasswordButton: "Change Password",
      changingPassword: "Changing password...",
      passwordChanged:
        "Password changed successfully.",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },

    hi: {
      title: "मेरी प्रोफ़ाइल",
      subtitle:
        "अपनी व्यक्तिगत जानकारी देखें और प्रबंधित करें।",
      patientInformation: "मरीज की जानकारी",
      fullName: "पूरा नाम",
      firstName: "पहला नाम",
      lastName: "उपनाम",
      dateOfBirth: "जन्म तिथि",
      gender: "लिंग",
      phoneNumber: "फ़ोन नंबर",
      address: "पता",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      selectGender: "लिंग चुनें",
      notProvided: "उपलब्ध नहीं",
      security:
        "आपकी व्यक्तिगत जानकारी आपके डिजिटल टीकाकरण रिकॉर्ड में सुरक्षित रूप से संग्रहीत है।",
      loading: "प्रोफ़ाइल लोड हो रही है...",
      createProfile: "प्रोफ़ाइल बनाएँ",
      createProfileDescription:
        "अपनी व्यक्तिगत जानकारी पूरी करके अपनी मरीज प्रोफ़ाइल बनाएँ।",
      editProfile: "प्रोफ़ाइल संपादित करें",
      editProfileDescription:
        "जब भी आवश्यक हो अपनी व्यक्तिगत जानकारी अपडेट करें।",
      saveProfile: "प्रोफ़ाइल सहेजें",
      saveChanges: "परिवर्तन सहेजें",
      savingProfile: "प्रोफ़ाइल सहेजी जा रही है...",
      cancel: "रद्द करें",
      profileCreated:
        "आपकी प्रोफ़ाइल सफलतापूर्वक बनाई गई है।",
      profileUpdated:
        "आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट की गई है।",
      profileRequired:
        "कृपया सभी आवश्यक प्रोफ़ाइल फ़ील्ड भरें।",
      profileLoadError:
        "आपकी प्रोफ़ाइल लोड नहीं की जा सकी।",
      changePassword: "पासवर्ड बदलें",
      changePasswordDescription:
        "अपने खाते को सुरक्षित रखने के लिए अपना पासवर्ड अपडेट करें।",
      currentPassword: "वर्तमान पासवर्ड",
      newPassword: "नया पासवर्ड",
      confirmPassword: "नए पासवर्ड की पुष्टि करें",
      passwordStrength: "पासवर्ड की मजबूती",
      weak: "कमज़ोर",
      medium: "मध्यम",
      strong: "मज़बूत",
      passwordRequirements:
        "कम से कम 8 अक्षरों का उपयोग करें जिसमें बड़े अक्षर, छोटे अक्षर, संख्या और विशेष अक्षर हों।",
      passwordsDoNotMatch:
        "नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।",
      passwordTooWeak:
        "कृपया अधिक मजबूत पासवर्ड चुनें।",
      changePasswordButton: "पासवर्ड बदलें",
      changingPassword: "पासवर्ड बदला जा रहा है...",
      passwordChanged:
        "पासवर्ड सफलतापूर्वक बदल दिया गया है।",
      showPassword: "पासवर्ड दिखाएँ",
      hidePassword: "पासवर्ड छिपाएँ",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();

        setProfile(data);
        setProfileForm(data);
      } catch (error) {
        if (
          error?.message ===
          "Patient profile not found."
        ) {
          setProfile(null);
          setIsEditingProfile(true);
        } else {
          setMessage(
            error?.message ||
              currentText.profileLoadError
          );
        }
      } finally {
        setIsProfileLoading(false);
      }
    }

    loadProfile();
  }, []);

  function setProfileForm(data) {
    setFirstName(data?.first_name || "");
    setLastName(data?.last_name || "");
    setDateOfBirth(
      data?.date_of_birth
        ? String(data.date_of_birth).slice(0, 10)
        : ""
    );
    setGender(data?.gender || "");
    setPhone(data?.phone || "");
    setAddress(data?.address || "");
  }

  function clearProfileMessages() {
    setProfileMessage("");
    setProfileError("");
  }

  function handleEditProfile() {
    clearProfileMessages();
    setProfileForm(profile);
    setIsEditingProfile(true);
  }

  function handleCancelProfileEdit() {
    clearProfileMessages();

    if (profile) {
      setProfileForm(profile);
      setIsEditingProfile(false);
    }
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    clearProfileMessages();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !dateOfBirth ||
      !gender ||
      !phone.trim() ||
      !address.trim()
    ) {
      setProfileError(
        currentText.profileRequired
      );
      return;
    }

    try {
      setIsSavingProfile(true);

      let data;

      if (profile) {
        data = await updateMyProfile(
          firstName.trim(),
          lastName.trim(),
          dateOfBirth,
          gender,
          phone.trim(),
          address.trim()
        );
      } else {
        data = await createMyProfile(
          firstName.trim(),
          lastName.trim(),
          dateOfBirth,
          gender,
          phone.trim(),
          address.trim()
        );
      }

      setProfile(data);
      setProfileForm(data);
      setIsEditingProfile(false);

      setProfileMessage(
        profile
          ? currentText.profileUpdated
          : currentText.profileCreated
      );
    } catch (error) {
      setProfileError(
        error?.message ||
          currentText.profileLoadError
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  function getPasswordStrength(password) {
    if (!password) {
      return {
        level: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    if (score <= 2) {
      return {
        level: 1,
        label: currentText.weak,
      };
    }

    if (score <= 4) {
      return {
        level: 2,
        label: currentText.medium,
      };
    }

    return {
      level: 3,
      label: currentText.strong,
    };
  }

  const passwordStrength =
    getPasswordStrength(newPassword);

  function validatePassword() {
    if (newPassword.length < 8) {
      return false;
    }

    if (!/[A-Z]/.test(newPassword)) {
      return false;
    }

    if (!/[a-z]/.test(newPassword)) {
      return false;
    }

    if (!/[0-9]/.test(newPassword)) {
      return false;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return false;
    }

    return true;
  }

  async function handleChangePassword(event) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError(
        currentText.currentPassword
      );
      return;
    }

    if (!validatePassword()) {
      setPasswordError(
        currentText.passwordTooWeak
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        currentText.passwordsDoNotMatch
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      await changeMyPassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        currentText.passwordChanged
      );
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsChangingPassword(false);
    }
  }

  if (message) {
    return (
      <div className="patient-profile">
        <div className="patient-profile-error">
          {message}
        </div>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="patient-profile">
        <div className="patient-profile-loading">
          <span className="patient-profile-spinner" />
          {currentText.loading}
        </div>
      </div>
    );
  }

  const fullName =
    `${profile?.first_name || ""} ${
      profile?.last_name || ""
    }`.trim();

  return (
    <div className="patient-profile">
      <div className="patient-profile-header">
        <h1>{currentText.title}</h1>

        <p>{currentText.subtitle}</p>
      </div>

      {!profile || isEditingProfile ? (
        <div className="patient-profile-card">
          <div className="patient-profile-card-header">
            <div className="patient-profile-avatar">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 4V20"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="patient-profile-card-title">
              <b>
                {!profile
                  ? currentText.createProfile
                  : currentText.editProfile}
              </b>

              <span>
                {!profile
                  ? currentText.createProfileDescription
                  : currentText.editProfileDescription}
              </span>
            </div>
          </div>

          <form
            className="patient-profile-form"
            onSubmit={handleSaveProfile}
          >
            <div className="patient-profile-form-grid">
              <div className="patient-profile-form-field">
                <label htmlFor="profile-first-name">
                  {currentText.firstName}
                </label>

                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="patient-profile-form-field">
                <label htmlFor="profile-last-name">
                  {currentText.lastName}
                </label>

                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="patient-profile-form-field">
                <label htmlFor="profile-date-of-birth">
                  {currentText.dateOfBirth}
                </label>

                <input
                  id="profile-date-of-birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="patient-profile-form-field">
                <label htmlFor="profile-gender">
                  {currentText.gender}
                </label>

                <select
                  id="profile-gender"
                  value={gender}
                  onChange={(event) =>
                    setGender(event.target.value)
                  }
                  required
                >
                  <option value="">
                    {currentText.selectGender}
                  </option>

                  <option value="Male">
                    {currentText.male}
                  </option>

                  <option value="Female">
                    {currentText.female}
                  </option>

                  <option value="Other">
                    {currentText.other}
                  </option>
                </select>
              </div>

              <div className="patient-profile-form-field">
                <label htmlFor="profile-phone">
                  {currentText.phoneNumber}
                </label>

                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="patient-profile-form-field patient-profile-form-field-full">
                <label htmlFor="profile-address">
                  {currentText.address}
                </label>

                <textarea
                  id="profile-address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  autoComplete="street-address"
                  rows="3"
                  required
                />
              </div>
            </div>

            {profileError && (
              <div className="patient-profile-form-error">
                {profileError}
              </div>
            )}

            {profileMessage && (
              <div className="patient-profile-form-success">
                {profileMessage}
              </div>
            )}

            <div className="patient-profile-form-actions">
              {profile && (
                <button
                  type="button"
                  className="patient-profile-cancel-button"
                  onClick={
                    handleCancelProfileEdit
                  }
                  disabled={isSavingProfile}
                >
                  {currentText.cancel}
                </button>
              )}

              <button
                type="submit"
                className="patient-profile-save-button"
                disabled={isSavingProfile}
              >
                {isSavingProfile
                  ? currentText.savingProfile
                  : profile
                  ? currentText.saveChanges
                  : currentText.saveProfile}
              </button>
            </div>
          </form>

          <div className="patient-profile-security">
            <div className="patient-profile-security-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                <circle
                  cx="12"
                  cy="16"
                  r="1"
                />
              </svg>
            </div>

            <div>{currentText.security}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="patient-profile-card">
            <div className="patient-profile-card-header">
              <div className="patient-profile-avatar">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4V20"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <path
                    d="M4 12H20"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="patient-profile-card-title">
                <b>
                  {currentText.patientInformation}
                </b>

                <button
                  type="button"
                  className="patient-profile-edit-button"
                  onClick={handleEditProfile}
                >
                  {currentText.editProfile}
                </button>
              </div>
            </div>

            <div className="patient-profile-details">
              <div className="patient-profile-field">
                <span className="patient-profile-field-label">
                  {currentText.fullName}
                </span>

                <span className="patient-profile-field-value">
                  {fullName ||
                    currentText.notProvided}
                </span>
              </div>

              <div className="patient-profile-field">
                <span className="patient-profile-field-label">
                  {currentText.dateOfBirth}
                </span>

                <span className="patient-profile-field-value">
                  {profile.date_of_birth ||
                    currentText.notProvided}
                </span>
              </div>

              <div className="patient-profile-field">
                <span className="patient-profile-field-label">
                  {currentText.gender}
                </span>

                <span className="patient-profile-field-value">
                  {profile.gender ||
                    currentText.notProvided}
                </span>
              </div>

              <div className="patient-profile-field">
                <span className="patient-profile-field-label">
                  {currentText.phoneNumber}
                </span>

                <span className="patient-profile-field-value">
                  {profile.phone ||
                    currentText.notProvided}
                </span>
              </div>

              <div className="patient-profile-field">
                <span className="patient-profile-field-label">
                  {currentText.address}
                </span>

                <span className="patient-profile-field-value">
                  {profile.address ||
                    currentText.notProvided}
                </span>
              </div>
            </div>

            <div className="patient-profile-security">
              <div className="patient-profile-security-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="10"
                    rx="2"
                  />

                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                  <circle
                    cx="12"
                    cy="16"
                    r="1"
                  />
                </svg>
              </div>

              <div>{currentText.security}</div>
            </div>
          </div>
        </>
      )}

      {profile && (
        <div className="patient-profile-password-card">
          <div className="patient-profile-password-header">
            <div className="patient-profile-password-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <div>
              <h2>
                {currentText.changePassword}
              </h2>

              <p>
                {
                  currentText.changePasswordDescription
                }
              </p>
            </div>
          </div>

          <form
            className="patient-profile-password-form"
            onSubmit={handleChangePassword}
          >
            <div className="patient-profile-password-field">
              <label htmlFor="current-password">
                {currentText.currentPassword}
              </label>

              <div className="patient-profile-password-input">
                <input
                  id="current-password"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? currentText.hidePassword
                      : currentText.showPassword
                  }
                >
                  {showCurrentPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            <div className="patient-profile-password-field">
              <label htmlFor="new-password">
                {currentText.newPassword}
              </label>

              <div className="patient-profile-password-input">
                <input
                  id="new-password"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? currentText.hidePassword
                      : currentText.showPassword
                  }
                >
                  {showNewPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {newPassword && (
                <div className="patient-profile-password-strength">
                  <div className="patient-profile-password-strength-header">
                    <span>
                      {currentText.passwordStrength}
                    </span>

                    <span
                      className={`patient-profile-password-strength-label level-${passwordStrength.level}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="patient-profile-password-strength-bars">
                    <span
                      className={
                        passwordStrength.level >= 1
                          ? "active level-1"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordStrength.level >= 2
                          ? "active level-2"
                          : ""
                      }
                    />

                    <span
                      className={
                        passwordStrength.level >= 3
                          ? "active level-3"
                          : ""
                      }
                    />
                  </div>

                  <p>
                    {
                      currentText.passwordRequirements
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="patient-profile-password-field">
              <label htmlFor="confirm-password">
                {currentText.confirmPassword}
              </label>

              <div className="patient-profile-password-input">
                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? currentText.hidePassword
                      : currentText.showPassword
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="patient-profile-password-error">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="patient-profile-password-success">
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              className="patient-profile-password-button"
              disabled={isChangingPassword}
            >
              {isChangingPassword
                ? currentText.changingPassword
                : currentText.changePasswordButton}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;